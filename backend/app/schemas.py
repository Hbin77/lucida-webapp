from pydantic import BaseModel, Field
from typing import Literal


class SimulateRequest(BaseModel):
    age: int = Field(..., ge=30, le=85, description="User age in years")
    sex: Literal["M", "F"]
    typing_speed: float = Field(..., ge=0, le=100,
                                description="0=very slow, 100=very fast")
    latency_variance: float = Field(..., ge=0, le=100,
                                    description="0=very stable, 100=erratic")


class FiveYearOutlook(BaseModel):
    without_intervention: float = Field(..., description="Base 5-yr incidence (0-1)")
    with_intervention: float = Field(..., description="Adjusted 5-yr incidence (0-1)")
    delay_months: float = Field(..., description="Avg AD-onset delay (months)")


class SimulateResponse(BaseModel):
    cognitive_score: int = Field(..., ge=0, le=100,
                                  description="0 = high risk, 100 = healthy")
    pathway: Literal["A", "B", "C"]
    pathway_label: str
    pathway_description: str
    monthly_premium_krw: int
    premium_change_pct: float = Field(..., description="Δ vs Path A baseline")
    five_year_outlook: FiveYearOutlook
    confidence: Literal["low", "medium", "high"]
    derived_features: dict
    disclaimer: str


class HealthResponse(BaseModel):
    status: Literal["ok"]
    model_loaded: bool
    model_auc: float
    # explainer = the configured explainer at startup.
    # last_used_explainer = the explainer that actually served the most
    # recent /api/explain request. They diverge when a runtime fallback
    # fires despite SHAP being available at startup — the latter is the
    # authority for interpreting a specific /api/explain response.
    explainer: Literal["tree_shap", "single_feature_ablation"] = "single_feature_ablation"
    last_used_explainer: Literal["tree_shap", "single_feature_ablation"] = "single_feature_ablation"


# ── Live Typing Lab — raw-features endpoint ──────────────────────
class SimulateRawRequest(BaseModel):
    """Direct model features (no slider abstraction). Used by the Live
    Typing Lab where actual keystroke timings are measured in-browser."""
    age: int = Field(..., ge=30, le=85)
    sex: Literal["M", "F"]
    avg_ht: float = Field(..., ge=0)
    std_ht: float = Field(..., ge=0)
    avg_ft: float = Field(..., ge=0)
    std_ft: float = Field(..., ge=0)
    avg_keys_per_session: float = Field(..., ge=0)


class FeatureContribution(BaseModel):
    feature: str
    value: float
    baseline: float
    delta_score: float = Field(
        ...,
        description=(
            "How many cognitive-score points this feature contributes. "
            "Sign convention is uniform across explainers: negative means "
            "the feature pulls the score DOWN from the baseline; positive "
            "means it pushes the score UP. "
            "Mathematical definition depends on the explainer that served "
            "the response — check /api/health.last_used_explainer:\n"
            "  • tree_shap: delta_score = -100·φᵢ, where φᵢ is the Shapley "
            "    value for the at-risk class. Additive: Σ delta_score ≈ "
            "    cognitive_score - baseline_score (SHAP efficiency).\n"
            "  • single_feature_ablation: delta_score = cognitive_score - "
            "    cognitive_score_with_this_feature_set_to_HC_mean. NOT "
            "    additive (single-feature counterfactual)."
        ),
    )


class CohortDistance(BaseModel):
    cohort: str  # "HC" | "SCD" | "MCI" | "AD"
    distance: float


class ExplainResponse(BaseModel):
    cognitive_score: int
    pathway: Literal["A", "B", "C"]
    contributions: list[FeatureContribution]
    cohort_distances: list[CohortDistance]
    baseline_score: int = Field(
        ...,
        description=(
            "Reference score against which `contributions` are decomposed. "
            "Under tree_shap this is the model's training-mean prediction "
            "(SHAP expected_value translated to score points). Under "
            "single_feature_ablation this is the score of an all-HC-mean "
            "input. Check `explainer` to know which one."
        ),
    )
    explainer: Literal["tree_shap", "single_feature_ablation"] = Field(
        ...,
        description="The explainer that produced this specific response.",
    )
