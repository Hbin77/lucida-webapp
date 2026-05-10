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
    delta_score: float = Field(..., description="How many score points "
                                                 "this feature shifts vs HC baseline.")


class CohortDistance(BaseModel):
    cohort: str  # "HC" | "SCD" | "MCI" | "AD"
    distance: float


class ExplainResponse(BaseModel):
    cognitive_score: int
    pathway: Literal["A", "B", "C"]
    contributions: list[FeatureContribution]
    cohort_distances: list[CohortDistance]
    baseline_score: int = Field(..., description="Score if all features were HC means.")
