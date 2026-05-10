// ── Slider-based simulate (existing) ─────────────────────────────
export type SimulateRequest = {
  age: number;
  sex: "M" | "F";
  typing_speed: number;
  latency_variance: number;
};

export type FiveYearOutlook = {
  without_intervention: number;
  with_intervention: number;
  delay_months: number;
};

export type SimulateResponse = {
  cognitive_score: number;
  pathway: "A" | "B" | "C";
  pathway_label: string;
  pathway_description: string;
  monthly_premium_krw: number;
  premium_change_pct: number;
  five_year_outlook: FiveYearOutlook;
  confidence: "low" | "medium" | "high";
  derived_features: Record<string, number>;
  disclaimer: string;
};

// ── Live Typing Lab — raw-features simulate ──────────────────────
export type SimulateRawRequest = {
  age: number;
  sex: "M" | "F";
  avg_ht: number;
  std_ht: number;
  avg_ft: number;
  std_ft: number;
  avg_keys_per_session: number;
};

export type FeatureContribution = {
  feature: string;
  value: number;
  baseline: number;
  delta_score: number;
};

export type CohortDistance = {
  cohort: "HC" | "SCD" | "MCI" | "AD";
  distance: number;
};

export type ExplainerKind = "tree_shap" | "single_feature_ablation";

export type ExplainResponse = {
  cognitive_score: number;
  pathway: "A" | "B" | "C";
  contributions: FeatureContribution[];
  cohort_distances: CohortDistance[];
  baseline_score: number;
  /** Which explainer produced THIS response. /api/health surfaces both a
   *  startup-configured and a last-used field; this field is response-
   *  scoped, so it is the right thing to read for chart labels. */
  explainer: ExplainerKind;
};

// ─────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

async function postJson<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export function simulate(body: SimulateRequest) {
  return postJson<SimulateRequest, SimulateResponse>("/simulate", body);
}

export function simulateRaw(body: SimulateRawRequest) {
  return postJson<SimulateRawRequest, SimulateResponse>("/simulate_raw", body);
}

export function explain(body: SimulateRawRequest) {
  return postJson<SimulateRawRequest, ExplainResponse>("/explain", body);
}
