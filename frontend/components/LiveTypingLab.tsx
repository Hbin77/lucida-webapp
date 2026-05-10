"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  newSession,
  createCapture,
  applyKeyDown,
  applyKeyUp,
  sessionFeatures,
  type SessionState,
} from "@/lib/keystroke";
import { welfordStd } from "@/lib/stats";
import { COHORT_HC, COHORT_MCI } from "@/lib/cohorts";
import {
  simulateRaw,
  explain,
  type SimulateResponse,
  type ExplainResponse,
  type SimulateRawRequest,
} from "@/lib/api";
import Eyebrow from "./ui/Eyebrow";
import Card from "./ui/Card";
import Button from "./ui/Button";
import PathTag, { type PathwayCode } from "./ui/PathTag";
import Histogram from "./lab/Histogram";
import Waterfall from "./lab/Waterfall";
import PrivacyMirror from "./lab/PrivacyMirror";
import SessionTimeline from "./lab/SessionTimeline";
import CohortDistanceBars from "./lab/CohortDistance";
import { useLang } from "./LanguageContext";

const MIN_KEYSTROKES = 30;

type Lab = "idle" | "loading" | "success" | "error";

export default function LiveTypingLab() {
  const { t, lang } = useLang();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const captureRef = useRef(createCapture());
  const [session, setSession] = useState<SessionState>(newSession);
  const [age, setAge] = useState(50);
  const [sex, setSex] = useState<"M" | "F">("F");
  const [labState, setLabState] = useState<Lab>("idle");
  const [result, setResult] = useState<SimulateResponse | null>(null);
  const [explanation, setExplanation] = useState<ExplainResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Wire keyboard listeners directly to the textarea so we don't intercept
  // events outside the lab. We also keep React state for re-render.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    const cap = captureRef.current;

    function onDown(e: KeyboardEvent) {
      const c = cap.onKeyDown(e);
      if (c) setSession((s) => applyKeyDown(s, c));
    }
    function onUp(e: KeyboardEvent) {
      const c = cap.onKeyUp(e);
      if (c) setSession((s) => applyKeyUp(s, c));
    }
    el.addEventListener("keydown", onDown);
    el.addEventListener("keyup", onUp);
    return () => {
      el.removeEventListener("keydown", onDown);
      el.removeEventListener("keyup", onUp);
    };
  }, []);

  const features = useMemo(() => sessionFeatures(session), [session]);
  const ready = session.totalKeystrokes >= MIN_KEYSTROKES;

  const onAnalyze = useCallback(async () => {
    if (!ready) return;
    const body: SimulateRawRequest = {
      age,
      sex,
      avg_ht: features.avg_ht,
      std_ht: features.std_ht,
      avg_ft: features.avg_ft,
      std_ft: features.std_ft,
      avg_keys_per_session: Math.max(1, features.avg_keys_per_session),
    };
    setLabState("loading");
    setError(null);
    try {
      const [r, ex] = await Promise.all([simulateRaw(body), explain(body)]);
      setResult(r);
      setExplanation(ex);
      setLabState("success");
    } catch (_e) {
      setError(t.sim.errorGeneric);
      setLabState("error");
    }
  }, [age, sex, features, ready, t]);

  function reset() {
    captureRef.current.reset();
    setSession(newSession());
    setResult(null);
    setExplanation(null);
    setLabState("idle");
    setError(null);
    if (textareaRef.current) textareaRef.current.value = "";
  }

  const htMean = session.ht.mean;
  const ftMean = session.ft.mean;
  const ftStd = welfordStd(session.ft);
  const htStd = welfordStd(session.ht);

  const variabilityLabel = (() => {
    if (session.totalKeystrokes < 5) return "—";
    if (ftStd < 100) return t.sim.level.stable;
    if (ftStd < 180) return t.sim.level.moderate;
    if (ftStd < 280) return t.sim.level.inconsistent;
    return t.sim.level.erratic;
  })();

  const pathwayCode: PathwayCode | null =
    result?.pathway as PathwayCode | undefined ?? null;

  const labelOf = (k: string) => {
    const map = t.lab.featureLabels as Record<string, string>;
    return map[k] ?? k;
  };

  return (
    <section
      id="live-lab"
      className="rule-t"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-deck mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <header className="max-w-2xl">
          <Eyebrow>{t.lab.eyebrow}</Eyebrow>
          <h2
            className="mt-4 font-serif text-[34px] lg:text-[40px] leading-[1.1]"
            style={{ color: "var(--ink-900)" }}
          >
            {t.lab.title}
          </h2>
          <p
            className="mt-4 text-[15px] leading-[1.6]"
            style={{ color: "var(--ink-500)" }}
          >
            {t.lab.body}
          </p>
        </header>

        <div className="mt-10 grid lg:grid-cols-12 gap-6">
          {/* Left — Typing pad + visualisations */}
          <Card className="lg:col-span-7 p-6 lg:p-8">
            {/* sample passage as a quotation block */}
            <p
              className="font-serif text-[16px] leading-[1.55] italic"
              style={{ color: "var(--ink-500)" }}
            >
              “{t.lab.samplePassage}”
            </p>

            <textarea
              ref={textareaRef}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              placeholder={t.lab.placeholder}
              className="mt-4 w-full min-h-[110px] rounded-[8px] p-3 text-[15px] leading-[1.55] outline-none resize-y"
              style={{
                background: "var(--paper-2)",
                border: "1px solid var(--rule-strong)",
                color: "var(--ink-900)",
                fontFamily: "Inter, sans-serif",
              }}
              aria-label={t.lab.placeholder}
            />

            {/* live counters */}
            <div className="mt-5 grid grid-cols-4 gap-3">
              <Counter
                label={t.lab.keystrokes}
                value={`${session.totalKeystrokes}`}
                hint={t.lab.minimum}
                ok={ready}
              />
              <Counter
                label={t.lab.holdTime}
                value={
                  session.totalKeystrokes > 0
                    ? `${htMean.toFixed(0)} ms`
                    : "—"
                }
                hint={
                  session.totalKeystrokes > 1
                    ? `± ${htStd.toFixed(0)} ms`
                    : ""
                }
              />
              <Counter
                label={t.lab.flightTime}
                value={
                  session.totalKeystrokes > 1
                    ? `${ftMean.toFixed(0)} ms`
                    : "—"
                }
                hint={
                  session.totalKeystrokes > 2
                    ? `± ${ftStd.toFixed(0)} ms`
                    : ""
                }
              />
              <Counter
                label={t.lab.variability}
                value={variabilityLabel}
              />
            </div>

            {/* histograms */}
            <div className="mt-7 grid sm:grid-cols-2 gap-5">
              <DistBlock title={t.lab.htDistTitle}>
                <Histogram
                  hist={session.htHist}
                  marker={
                    session.totalKeystrokes > 1 ? htMean : null
                  }
                  overlays={[
                    { gauss: COHORT_HC.ht, color: "var(--sage)" },
                    {
                      gauss: COHORT_MCI.ht,
                      color: "var(--burgundy)",
                      dashed: true,
                    },
                  ]}
                />
                <Legend
                  hcLabel={t.lab.cohortHc}
                  mciLabel={t.lab.cohortMci}
                  youLabel={t.lab.youAre}
                />
              </DistBlock>
              <DistBlock title={t.lab.ftDistTitle}>
                <Histogram
                  hist={session.ftHist}
                  marker={
                    session.totalKeystrokes > 2 ? ftMean : null
                  }
                  overlays={[
                    { gauss: COHORT_HC.ft, color: "var(--sage)" },
                    {
                      gauss: COHORT_MCI.ft,
                      color: "var(--burgundy)",
                      dashed: true,
                    },
                  ]}
                />
                <Legend
                  hcLabel={t.lab.cohortHc}
                  mciLabel={t.lab.cohortMci}
                  youLabel={t.lab.youAre}
                />
              </DistBlock>
            </div>

            {/* timeline */}
            <div className="mt-7">
              <div
                className="text-[10.5px] uppercase tracking-[0.14em] mb-1"
                style={{ color: "var(--ink-400)" }}
              >
                {t.lab.timelineTitle}
              </div>
              <SessionTimeline
                recentFt={session.recentFt}
                recentHt={session.recentHt}
              />
            </div>

            {/* age/sex inputs */}
            <div className="mt-6 grid sm:grid-cols-2 gap-5">
              <div>
                <label
                  className="text-[12.5px] font-medium"
                  style={{ color: "var(--ink-900)" }}
                >
                  {t.sim.field.age}
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="range"
                    className="lc-range flex-1"
                    min={30}
                    max={85}
                    value={age}
                    onChange={(e) =>
                      setAge(parseInt(e.target.value, 10))
                    }
                  />
                  <span
                    className="tabular text-[13px] w-12 text-right"
                    style={{ color: "var(--ink-700)" }}
                  >
                    {age} {lang === "ko" ? "세" : "yr"}
                  </span>
                </div>
              </div>
              <div>
                <span
                  className="text-[12.5px] font-medium"
                  style={{ color: "var(--ink-900)" }}
                >
                  {t.sim.field.sex}
                </span>
                <div className="mt-2 lc-seg" role="group">
                  <button
                    type="button"
                    aria-pressed={sex === "F"}
                    onClick={() => setSex("F")}
                  >
                    {t.sim.sex.F}
                  </button>
                  <button
                    type="button"
                    aria-pressed={sex === "M"}
                    onClick={() => setSex("M")}
                  >
                    {t.sim.sex.M}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                onClick={onAnalyze}
                disabled={!ready || labState === "loading"}
              >
                {labState === "loading"
                  ? t.lab.btnAnalyzing
                  : t.lab.btnAnalyze}
              </Button>
              <Button variant="ghost" onClick={reset}>
                {t.lab.btnReset}
              </Button>
              {!ready ? (
                <span
                  className="text-[12px]"
                  style={{ color: "var(--ink-400)" }}
                >
                  {t.lab.typeMore.replace("{n}", `${MIN_KEYSTROKES}`)}
                </span>
              ) : null}
            </div>

            {labState === "error" && error ? (
              <div
                role="alert"
                className="mt-5 px-4 py-3 rounded-[8px] text-[13px]"
                style={{
                  background: "var(--burgundy-soft)",
                  color: "var(--burgundy)",
                }}
              >
                {error}
              </div>
            ) : null}
          </Card>

          {/* Right — Privacy mirror + measured features + result */}
          <div className="lg:col-span-5 space-y-6">
            <PrivacyMirror
              redactedLength={session.redactedLength}
              htMean={htMean}
              ftMean={ftMean}
              capturedLabel={t.lab.privacyCapturedHead}
              ignoredLabel={t.lab.privacyIgnoredHead}
              whatLabel={t.lab.privacyWhat}
              notLabel={t.lab.privacyNot}
            />

            <Card className="p-6">
              <Eyebrow tone="ink">{t.lab.note}</Eyebrow>
              <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 font-mono text-[12.5px] tabular">
                <FeatureRow
                  k="avg_ht"
                  label={t.lab.featureLabels.avg_ht}
                  v={
                    session.totalKeystrokes > 0
                      ? `${features.avg_ht.toFixed(1)} ms`
                      : "—"
                  }
                />
                <FeatureRow
                  k="std_ht"
                  label={t.lab.featureLabels.std_ht}
                  v={
                    session.totalKeystrokes > 1
                      ? `${features.std_ht.toFixed(1)} ms`
                      : "—"
                  }
                />
                <FeatureRow
                  k="avg_ft"
                  label={t.lab.featureLabels.avg_ft}
                  v={
                    session.totalKeystrokes > 1
                      ? `${features.avg_ft.toFixed(1)} ms`
                      : "—"
                  }
                />
                <FeatureRow
                  k="std_ft"
                  label={t.lab.featureLabels.std_ft}
                  v={
                    session.totalKeystrokes > 2
                      ? `${features.std_ft.toFixed(1)} ms`
                      : "—"
                  }
                />
                <FeatureRow
                  k="keys"
                  label={t.lab.featureLabels.avg_keys_per_session}
                  v={`${session.totalKeystrokes}`}
                />
                <FeatureRow
                  k="age"
                  label={t.lab.featureLabels.age}
                  v={`${age}`}
                />
              </dl>
            </Card>

            {/* Result */}
            {labState === "success" && result && explanation ? (
              <Card className="p-6 lc-rise">
                <div className="flex items-start justify-between">
                  <Eyebrow tone="ink">{t.sim.resultTitle}</Eyebrow>
                  {pathwayCode ? (
                    <PathTag code={pathwayCode}>
                      {t.res.pathway[pathwayCode].label}
                    </PathTag>
                  ) : null}
                </div>

                <div className="mt-4 flex items-baseline gap-3">
                  <span
                    className="font-serif tabular text-[64px] leading-none"
                    style={{ color: "var(--ink-900)" }}
                  >
                    {result.cognitive_score}
                  </span>
                  <span
                    className="text-[13px]"
                    style={{ color: "var(--ink-300)" }}
                  >
                    {t.res.scoreOutOf}
                  </span>
                </div>

                <p
                  className="mt-3 text-[12.5px] leading-[1.6]"
                  style={{ color: "var(--ink-700)" }}
                >
                  {pathwayCode
                    ? t.res.pathway[pathwayCode].description
                    : ""}
                </p>

                {/* Waterfall */}
                <div className="mt-6">
                  <div
                    className="text-[10.5px] uppercase tracking-[0.14em]"
                    style={{ color: "var(--ink-400)" }}
                  >
                    {t.lab.explainTitle}
                  </div>
                  <div className="mt-2">
                    <Waterfall
                      baselineScore={explanation.baseline_score}
                      finalScore={explanation.cognitive_score}
                      contributions={explanation.contributions}
                      labelOf={labelOf}
                    />
                  </div>
                  <p
                    className="mt-2 text-[11px] leading-[1.5]"
                    style={{ color: "var(--ink-400)" }}
                  >
                    {t.lab.explainHint}
                  </p>
                </div>

                {/* Cohort distance */}
                <div className="mt-6">
                  <CohortDistanceBars
                    distances={explanation.cohort_distances}
                    title={t.lab.cohortDistanceTitle}
                    hint={t.lab.cohortDistanceHint}
                  />
                </div>
              </Card>
            ) : labState === "loading" ? (
              <Card className="p-6 flex items-center justify-center min-h-[140px]">
                <div className="flex items-center gap-3 text-[13px]"
                     style={{ color: "var(--ink-500)" }}>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" stroke="var(--rule)" strokeWidth="2" fill="none" />
                    <path d="M21 12a9 9 0 0 1-9 9" stroke="var(--ink-900)" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                  {t.lab.btnAnalyzing}
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── small helpers ────────────────────────────────────────────────
function Counter({
  label,
  value,
  hint,
  ok,
}: {
  label: string;
  value: string;
  hint?: string;
  ok?: boolean;
}) {
  return (
    <div
      className="rounded-[8px] px-3 py-2.5"
      style={{
        background: "var(--paper-2)",
        border: "1px solid var(--rule)",
      }}
    >
      <div
        className="text-[10px] uppercase tracking-[0.12em]"
        style={{ color: "var(--ink-400)" }}
      >
        {label}
      </div>
      <div
        className="mt-1 font-serif tabular text-[20px] leading-none"
        style={{ color: ok ? "var(--sage)" : "var(--ink-900)" }}
      >
        {value}
      </div>
      {hint ? (
        <div
          className="mt-1 text-[10px] tabular"
          style={{ color: "var(--ink-400)" }}
        >
          {hint}
        </div>
      ) : null}
    </div>
  );
}

function DistBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="text-[10.5px] uppercase tracking-[0.14em] mb-1"
        style={{ color: "var(--ink-400)" }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Legend({
  hcLabel,
  mciLabel,
  youLabel,
}: {
  hcLabel: string;
  mciLabel: string;
  youLabel: string;
}) {
  return (
    <div
      className="mt-1 flex items-center gap-4 text-[10.5px]"
      style={{ color: "var(--ink-500)" }}
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          className="inline-block w-3 h-[2px]"
          style={{ background: "var(--sage)" }}
        />
        {hcLabel}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="inline-block w-3 h-[2px]"
          style={{
            background:
              "repeating-linear-gradient(90deg, var(--burgundy) 0 3px, transparent 3px 6px)",
          }}
        />
        {mciLabel}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="inline-block w-[2px] h-3"
          style={{ background: "var(--ink-900)" }}
        />
        {youLabel}
      </span>
    </div>
  );
}

function FeatureRow({
  k,
  label,
  v,
}: {
  k: string;
  label: string;
  v: string;
}) {
  return (
    <div
      key={k}
      className="flex items-center justify-between rule-b py-1.5"
      style={{ borderBottomStyle: "dotted" }}
    >
      <span style={{ color: "var(--ink-500)" }}>{label}</span>
      <span style={{ color: "var(--ink-900)" }}>{v}</span>
    </div>
  );
}
