"""
Lucida inference layer — maps user-friendly inputs to model features,
runs RF prediction, and produces pathway / premium / outlook fields.
"""

from __future__ import annotations
import json
import logging
import joblib
import numpy as np
from pathlib import Path
from typing import Any

log = logging.getLogger(__name__)

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"

_model: Any = None
_meta: dict[str, Any] = {}
_explainer: Any = None        # shap.TreeExplainer; populated at load
_shap_available: bool = False  # falls back to single-feature ablation if False

# Tracks the explainer that served the most recent /api/explain request.
# /api/health reports configured_explainer (startup state) AND
# last_used_explainer (most recent serve) so a silent per-request fallback
# does not leave the health endpoint lying.
_last_used_explainer: str = "single_feature_ablation"


def load_model() -> None:
    """Load RF + feature metadata at process startup.

    We try to construct a SHAP TreeExplainer pinned to the deterministic
    `tree_path_dependent` perturbation. If `shap` is missing or the
    explainer fails to build (e.g. due to a sklearn-version mismatch),
    the failure is logged at WARNING and we fall back to single-feature
    ablation in explain(). This guarantees /api/explain never 500s.
    """
    global _model, _meta, _explainer, _shap_available, _last_used_explainer
    _model = joblib.load(MODELS_DIR / "lucida_rf.pkl")
    with open(MODELS_DIR / "feature_meta.json") as f:
        _meta = json.load(f)
    try:
        import shap  # type: ignore
        _explainer = shap.TreeExplainer(
            _model, feature_perturbation="tree_path_dependent"
        )
        _shap_available = True
        _last_used_explainer = "tree_shap"
        log.info("SHAP TreeExplainer ready (tree_path_dependent).")
    except (ImportError, ValueError, TypeError, AttributeError) as e:
        _explainer = None
        _shap_available = False
        _last_used_explainer = "single_feature_ablation"
        log.warning(
            "SHAP unavailable, /api/explain will use single-feature "
            "ablation. Reason: %s: %s", type(e).__name__, e,
        )


def is_loaded() -> bool:
    return _model is not None


def explainer_kind() -> str:
    """Configured explainer (startup state). See `last_used_explainer`
    for the per-request truth — they can diverge if a runtime fallback
    fires."""
    return "tree_shap" if _shap_available else "single_feature_ablation"


def last_used_explainer() -> str:
    """Reports which explainer actually served the most recent request.
    Diverges from explainer_kind() only when a runtime fallback occurs
    inside explain() despite SHAP being available at startup."""
    return _last_used_explainer


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


def _ablation_contributions(feats: dict, actual_score: int) -> list[dict]:
    """Fallback explainer — used when shap is unavailable.

    Single-feature ablation: replace each feature in turn with its HC
    baseline value and observe the score swing. delta_score = actual −
    ablated, so negative means the user's value pulls the score down.

    Sign convention matches _shap_contributions, but additivity is NOT
    guaranteed (these are single-feature counterfactuals, not Shapley
    values; the contributions do not sum to actual_score − baseline_score).
    The /api/health.last_used_explainer field is the authority for which
    regime produced a given response.
    """
    baseline = _hc_baseline()
    contribs = []
    for f in FEATURE_ORDER:
        ablated = dict(feats)
        ablated[f] = baseline[f]
        ablated_score, _ = _score_from_features(ablated)
        contribs.append({
            "feature": f,
            "value": round(float(feats[f]), 2),
            "baseline": round(float(baseline[f]), 2),
            "delta_score": round(float(actual_score - ablated_score), 2),
        })
    return contribs


def _extract_shap_at_risk(sv: Any, n_features: int) -> np.ndarray:
    """Normalise SHAP output to a 1-D length-`n_features` vector for the
    at-risk (class 1) probability, across SHAP API generations.

    Supported shapes:
      - list of length n_classes, each (1, n_features) — pre-0.45 SHAP
      - ndarray (n_samples, n_features, n_classes) — SHAP 0.45+
      - ndarray (n_classes, n_samples, n_features) — older after np.asarray
      - ndarray (1, n_features) — single-output edge case
    Raises ValueError if the shape is unrecognised so the caller can
    fall through to ablation.
    """
    # Pre-0.45 binary RandomForestClassifier returns [sv_class0, sv_class1].
    if isinstance(sv, list):
        if len(sv) < 2:
            raise ValueError(f"SHAP list-output with len={len(sv)}")
        return np.asarray(sv[1]).reshape(-1)[:n_features]

    arr = np.asarray(sv)
    if arr.ndim == 3:
        # (n_samples, n_features, n_classes)  — modern SHAP
        if arr.shape == (1, n_features, 2):
            return arr[0, :, 1]
        # (n_classes, n_samples, n_features)  — list-then-asarray
        if arr.shape == (2, 1, n_features):
            return arr[1, 0, :]
        raise ValueError(f"Unexpected 3-D SHAP shape {arr.shape}")
    if arr.ndim == 2 and arr.shape == (1, n_features):
        # Single-output regressor-style return.
        return arr[0]
    if arr.ndim == 1 and arr.shape == (n_features,):
        return arr
    raise ValueError(f"Unexpected SHAP shape {arr.shape}")


def _shap_contributions(feats: dict) -> list[dict]:
    """TreeSHAP-based attribution.

    For the at-risk (class 1) probability, a POSITIVE shap value means
    the feature pushed the probability up — i.e. it pulled the cognitive
    SCORE down. We sign-flip and rescale to score points (×100) so that
    the resulting `delta_score` shares the SAME SIGN CONVENTION as the
    ablation fallback:
        delta_score > 0  ⇒  feature pushes the score above the base
        delta_score < 0  ⇒  feature pulls the score below the base

    Unlike ablation, SHAP attributions are ADDITIVE — they sum (up to
    rounding) to actual_score − baseline_score (the efficiency property).
    Consumers wanting that identity should check /api/health for
    last_used_explainer == "tree_shap".
    """
    if _explainer is None:
        raise RuntimeError("SHAP explainer not initialised")
    x = _features_to_array(feats)
    sv = _explainer.shap_values(x)
    sv_at_risk = _extract_shap_at_risk(sv, len(FEATURE_ORDER))

    baseline_feats = _hc_baseline()
    contribs = []
    for i, f in enumerate(FEATURE_ORDER):
        # +shap on at-risk ⇒ −delta on score
        delta = -float(sv_at_risk[i]) * 100.0
        contribs.append({
            "feature": f,
            "value": round(float(feats[f]), 2),
            "baseline": round(float(baseline_feats[f]), 2),
            "delta_score": round(delta, 2),
        })
    return contribs


def explain(req: dict) -> dict:
    """Return per-feature contribution + cohort distances.

    Primary explainer: TreeSHAP (additive, satisfies the efficiency
    property). Fallback: single-feature ablation against the HC baseline.
    The fallback path is taken automatically if `shap` failed to load at
    startup — see load_model().
    """
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

    # Reference score: the SHAP base (training expectation) if available,
    # else the score of an all-HC-mean input. Both are valid "what would
    # the score be without this user's specific values?" anchors; SHAP
    # uses the training mean of the model output.
    global _last_used_explainer
    if _shap_available and _explainer is not None:
        try:
            ev = np.asarray(_explainer.expected_value).ravel()
            # ev should be [P(class 0), P(class 1)] for a binary RF.
            if ev.size >= 2:
                prob_at_risk_base = float(ev[-1])
            elif ev.size == 1:
                # Single-output regressor-style return; treat as p(at_risk).
                prob_at_risk_base = float(ev[0])
            else:
                raise ValueError(f"empty expected_value, shape={ev.shape}")
            # Clamp defensively — TreeSHAP for a probabilistic classifier
            # MUST return a probability, but a future API drift could ship
            # margins/log-odds instead, which would yield nonsense scores.
            if not 0.0 <= prob_at_risk_base <= 1.0:
                raise ValueError(
                    f"expected_value out of [0,1]: {prob_at_risk_base}"
                )
            baseline_score = int(round((1.0 - prob_at_risk_base) * 100))
            contributions = _shap_contributions(feats)
            _last_used_explainer = "tree_shap"
        except (ValueError, RuntimeError, AttributeError, IndexError) as e:
            # Per-request fallback. Logged so silent degradation is visible
            # in `docker compose logs backend` and the next /api/health call
            # will report last_used_explainer == "single_feature_ablation".
            log.warning(
                "Runtime SHAP failure on /api/explain; falling back to "
                "ablation. Reason: %s: %s", type(e).__name__, e,
            )
            baseline_score, _ = _score_from_features(_hc_baseline())
            contributions = _ablation_contributions(feats, actual_score)
            _last_used_explainer = "single_feature_ablation"
    else:
        baseline_score, _ = _score_from_features(_hc_baseline())
        contributions = _ablation_contributions(feats, actual_score)
        _last_used_explainer = "single_feature_ablation"

    # Cohort distances (standardised Euclidean), unchanged.
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
        "explainer": _last_used_explainer,
    }
