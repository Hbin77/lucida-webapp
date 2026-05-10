"""
Lucida inference layer — maps user-friendly inputs to model features,
runs RF prediction, and produces pathway / premium / outlook fields.
"""

from __future__ import annotations
import json
import joblib
import numpy as np
from pathlib import Path
from typing import Any

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"

_model = None
_meta: dict[str, Any] = {}


def load_model() -> None:
    """Load RF + feature metadata at process startup."""
    global _model, _meta
    _model = joblib.load(MODELS_DIR / "lucida_rf.pkl")
    with open(MODELS_DIR / "feature_meta.json") as f:
        _meta = json.load(f)


def is_loaded() -> bool:
    return _model is not None


def model_auc() -> float:
    return float(_meta.get("training_auc", 0.0))


# ----------------------------------------------------------------------
# UI input → model feature mapping
#
# UI inputs are intentionally human-friendly sliders (0-100). We map them
# to clinically meaningful keystroke timing values calibrated to Park 2024:
#   HC range : avg_ft 500-700 ms, std_ft 80-150 ms
#   MCI range: avg_ft 1100-1400 ms, std_ft 200-300 ms
# ----------------------------------------------------------------------

def _lerp(a: float, b: float, t: float) -> float:
    """Linear interpolation. t in [0, 1]."""
    return a + (b - a) * t


def derive_features(age: int, typing_speed: float, latency_variance: float) -> dict:
    """Map sliders to (avg_ht, std_ht, avg_ft, std_ft, avg_keys_per_session, age)."""
    # speed: 100 = fast (low FT), 0 = slow (high FT)
    speed_t = 1.0 - (typing_speed / 100.0)        # 0 fast → 1 slow
    var_t = latency_variance / 100.0              # 0 stable → 1 erratic

    avg_ft = _lerp(500.0, 1500.0, speed_t)        # ms
    std_ft = _lerp(80.0, 350.0, var_t)            # ms

    avg_ht = _lerp(95.0, 200.0, speed_t)          # ms (smaller range)
    std_ht = _lerp(15.0, 35.0, var_t)             # ms

    avg_keys_per_session = 100.0                  # typical session length

    return {
        "avg_ht": round(avg_ht, 2),
        "std_ht": round(std_ht, 2),
        "avg_ft": round(avg_ft, 2),
        "std_ft": round(std_ft, 2),
        "avg_keys_per_session": avg_keys_per_session,
        "age": age,
    }


# ----------------------------------------------------------------------
# Pathway / premium / outlook
# ----------------------------------------------------------------------

PATHWAY_MAP = {
    "A": {
        "label": "Path A — Healthy cognition",
        "description": (
            "Lower premium, retention focus. Stable typing pattern matches "
            "the healthy reference distribution."
        ),
        "premium": 50_000,
        "premium_change_pct": -10.0,
        "implied_group": "HC",
    },
    "B": {
        "label": "Path B — Early decline (SCD / MCI signal)",
        "description": (
            "Premium holds steady. Policy unlocks a preventive intervention "
            "program — sleep, exercise, cognitive training — before decline "
            "is irreversible."
        ),
        "premium": 65_000,
        "premium_change_pct": 0.0,
        "implied_group": "SCD",
    },
    "C": {
        "label": "Path C — Established decline",
        "description": (
            "Coverage activates rather than expires. Insurer transitions to "
            "a clinical-care pathway in coordination with providers."
        ),
        "premium": 85_000,
        "premium_change_pct": +30.0,
        "implied_group": "MCI",
    },
}


def _classify_pathway(score: int, age: int) -> str:
    """Score → A/B/C with mild age-driven adjustment for Path B floor."""
    # Older users get the benefit of the doubt for Path B (early signal still
    # actionable even when score borderline-low).
    b_floor = 45 if age >= 65 else 50
    if score >= 75:
        return "A"
    if score >= b_floor:
        return "B"
    return "C"


def _confidence(prob: float) -> str:
    margin = abs(prob - 0.5)
    if margin > 0.30:
        return "high"
    if margin > 0.15:
        return "medium"
    return "low"


def _five_year_outlook(pathway: str) -> dict:
    """Pull intervention deltas from training-data per-group means."""
    ins = _meta.get("insurance_summary", {})
    group = PATHWAY_MAP[pathway]["implied_group"]
    row = ins.get(group, {})
    return {
        "without_intervention": round(float(row.get("base_5yr", 0.10)), 4),
        "with_intervention": round(float(row.get("adjusted_5yr", 0.10)), 4),
        "delay_months": round(float(row.get("delay_months", 0.0)), 1),
    }


# ----------------------------------------------------------------------
# Public entrypoint
# ----------------------------------------------------------------------

FEATURE_ORDER = ["avg_ht", "std_ht", "avg_ft", "std_ft",
                  "avg_keys_per_session", "age"]


def _features_to_array(feats: dict) -> np.ndarray:
    return np.array([[feats[f] for f in FEATURE_ORDER]])


def _score_from_features(feats: dict) -> tuple[int, float]:
    """Run the model on a feature dict; return (score 0..100, prob_at_risk)."""
    x = _features_to_array(feats)
    prob = float(_model.predict_proba(x)[0, 1])
    return int(round((1.0 - prob) * 100)), prob


def _build_response(feats: dict) -> dict:
    """Shared post-processing for both /simulate and /simulate_raw.

    Note: `sex` is captured at the API boundary (Pydantic schemas) for a
    future model version that will incorporate population baselines. The
    current RandomForest does not use sex as a feature; we therefore do
    not thread it through here.
    """
    score, prob_at_risk = _score_from_features(feats)
    pathway = _classify_pathway(score, int(feats["age"]))
    info = PATHWAY_MAP[pathway]

    return {
        "cognitive_score": score,
        "pathway": pathway,
        "pathway_label": info["label"],
        "pathway_description": info["description"],
        "monthly_premium_krw": info["premium"],
        "premium_change_pct": info["premium_change_pct"],
        "five_year_outlook": _five_year_outlook(pathway),
        "confidence": _confidence(prob_at_risk),
        "derived_features": feats,
        "disclaimer": (
            "Result is illustrative. Lucida is built on synthetic data "
            "calibrated to four published clinical studies; it is not a "
            "medical diagnosis nor an insurance quote."
        ),
    }


def simulate(req: dict) -> dict:
    """Slider-based simulator (existing behaviour)."""
    if _model is None:
        raise RuntimeError("Model not loaded — call load_model() first.")

    feats = derive_features(req["age"], req["typing_speed"],
                            req["latency_variance"])
    return _build_response(feats)


def simulate_raw(req: dict) -> dict:
    """Raw-features simulator used by the Live Typing Lab.

    Accepts the actual measured keystroke statistics — no slider mapping.
    """
    if _model is None:
        raise RuntimeError("Model not loaded — call load_model() first.")

    feats = {
        "avg_ht": float(req["avg_ht"]),
        "std_ht": float(req["std_ht"]),
        "avg_ft": float(req["avg_ft"]),
        "std_ft": float(req["std_ft"]),
        "avg_keys_per_session": float(req["avg_keys_per_session"]),
        "age": int(req["age"]),
    }
    return _build_response(feats)


# ────────────────────────────────────────────────────────────────────
# Explain — feature ablation against the HC group baseline
# ────────────────────────────────────────────────────────────────────

def _hc_baseline() -> dict:
    """Mean feature vector for the HC (cognitively healthy) group."""
    means = _meta.get("per_group_means", {})
    if not means:
        return {f: 0.0 for f in FEATURE_ORDER}
    return {
        f: float(means.get(f, {}).get("HC", 0.0))
        for f in FEATURE_ORDER
    }


def _per_group_centroids() -> dict[str, dict]:
    means = _meta.get("per_group_means", {})
    out: dict[str, dict] = {}
    for group in ("HC", "SCD", "MCI", "AD"):
        out[group] = {
            f: float(means.get(f, {}).get(group, 0.0)) for f in FEATURE_ORDER
        }
    return out


def _euclidean(a: dict, b: dict) -> float:
    """Standardised Euclidean distance between two feature dicts."""
    stats = _meta.get("feature_stats", {})
    total = 0.0
    for f in FEATURE_ORDER:
        std = float(stats.get(f, {}).get("std", 1.0)) or 1.0
        total += ((a[f] - b[f]) / std) ** 2
    return total ** 0.5


def explain(req: dict) -> dict:
    """Return per-feature contribution via single-feature ablation,
    plus standardised distance to each cohort centroid."""
    if _model is None:
        raise RuntimeError("Model not loaded — call load_model() first.")

    if "typing_speed" in req:
        feats = derive_features(req["age"], req["typing_speed"],
                                req["latency_variance"])
    else:
        feats = {
            "avg_ht": float(req["avg_ht"]),
            "std_ht": float(req["std_ht"]),
            "avg_ft": float(req["avg_ft"]),
            "std_ft": float(req["std_ft"]),
            "avg_keys_per_session": float(req["avg_keys_per_session"]),
            "age": int(req["age"]),
        }

    actual_score, _ = _score_from_features(feats)
    pathway = _classify_pathway(actual_score, int(feats["age"]))

    # Baseline: HC group means → reference "fully healthy" prediction
    baseline = _hc_baseline()
    baseline_score, _ = _score_from_features(baseline)

    # For each feature, swap in the baseline value and re-score.
    contributions = []
    for f in FEATURE_ORDER:
        ablated = dict(feats)
        ablated[f] = baseline[f]
        ablated_score, _ = _score_from_features(ablated)
        contributions.append({
            "feature": f,
            "value": round(float(feats[f]), 2),
            "baseline": round(float(baseline[f]), 2),
            # delta_score = actual − ablated.
            #   negative ⇒ swapping this feature to HC baseline RAISES the
            #              score, so the user's value was pulling score DOWN.
            #   positive ⇒ user's value pushes score above HC baseline.
            "delta_score": float(actual_score - ablated_score),
        })

    # Cohort distances (standardised Euclidean)
    centroids = _per_group_centroids()
    distances = [
        {"cohort": g, "distance": round(_euclidean(feats, centroids[g]), 3)}
        for g in ("HC", "SCD", "MCI", "AD")
    ]

    return {
        "cognitive_score": actual_score,
        "pathway": pathway,
        "contributions": contributions,
        "cohort_distances": distances,
        "baseline_score": baseline_score,
    }
