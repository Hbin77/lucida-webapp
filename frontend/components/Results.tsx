"use client";

import type { SimulateResponse } from "@/lib/api";
import Card from "./ui/Card";
import Eyebrow from "./ui/Eyebrow";
import PathTag, { PATHWAY_COLOR, type PathwayCode } from "./ui/PathTag";
import { useLang } from "./LanguageContext";

type SimState = "idle" | "loading" | "success" | "error";

type Props = {
  state: SimState;
  result: SimulateResponse | null;
};

function OutlookBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between text-[12.5px]">
        <span style={{ color: "var(--ink-700)" }}>{label}</span>
        <span className="tabular font-medium" style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className="mt-1.5 lc-bar-track">
        <div
          className="lc-bar-fill"
          style={{ width: `${Math.max(2, pct)}%`, background: color }}
        />
      </div>
    </div>
  );
}

function DerivedRow({ k, v }: { k: string; v: string }) {
  return (
    <div
      className="flex items-center justify-between rule-b py-1.5"
      style={{ borderBottomStyle: "dotted" }}
    >
      <span style={{ color: "var(--ink-500)" }}>{k}</span>
      <span style={{ color: "var(--ink-900)" }}>{v}</span>
    </div>
  );
}

export default function Results({ state, result }: Props) {
  const { t, lang } = useLang();

  if (state === "idle" || (!result && state !== "loading")) {
    return (
      <Card className="p-8 lg:p-10 h-full flex flex-col justify-center min-h-[480px]">
        <Eyebrow tone="ink">{t.sim.resultTitle}</Eyebrow>
        <div className="mt-8 max-w-md">
          <h3
            className="font-serif text-[26px]"
            style={{ color: "var(--ink-900)" }}
          >
            {t.sim.placeholder.title}
          </h3>
          <p
            className="mt-3 text-[14px] leading-[1.6]"
            style={{ color: "var(--ink-500)" }}
          >
            {t.sim.placeholder.body}
          </p>
        </div>
        <div
          className="mt-10 flex items-center gap-2 text-[12px]"
          style={{ color: "var(--ink-400)" }}
        >
          <span className="lc-dot" />
          <span>
            {t.footer.modelLive} · /api/simulate
          </span>
        </div>
      </Card>
    );
  }

  if (state === "loading") {
    return (
      <Card className="p-8 lg:p-10 h-full flex items-center justify-center min-h-[480px]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="var(--rule)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M21 12a9 9 0 0 1-9 9"
              stroke="var(--ink-900)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <div
            className="text-[13px]"
            style={{ color: "var(--ink-500)" }}
          >
            {t.sim.loading}
          </div>
        </div>
      </Card>
    );
  }

  // success — defensive null guard (state machine should make this
  // unreachable, but a stale "success" with cleared result must not crash)
  if (!result) return null;
  const r = result;
  const pathwayCode = r.pathway as PathwayCode;
  const c = PATHWAY_COLOR[pathwayCode];
  const pathwayLabel = t.res.pathway[pathwayCode].label;
  const pathwayDesc = t.res.pathway[pathwayCode].description;

  const without = r.five_year_outlook.without_intervention;
  const withInt = r.five_year_outlook.with_intervention;
  const reductionAbs = Math.max(0, without - withInt);
  const reductionRel =
    without > 0 ? Math.round((reductionAbs / without) * 100) : 0;

  const krw = (n: number) =>
    new Intl.NumberFormat(lang === "ko" ? "ko-KR" : "en-US").format(n);

  const premiumColor =
    r.premium_change_pct === 0
      ? "var(--ink-400)"
      : r.premium_change_pct < 0
      ? "var(--sage)"
      : "var(--burgundy)";

  return (
    <Card className="p-7 lg:p-9 min-h-[480px]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <Eyebrow tone="ink">{t.sim.resultTitle}</Eyebrow>
        <PathTag code={pathwayCode}>{pathwayLabel}</PathTag>
      </div>

      {/* Score block */}
      <div className="mt-6 lc-rise">
        <div
          className="text-[12px] uppercase tracking-[0.14em]"
          style={{ color: "var(--ink-400)" }}
        >
          {t.res.score}
        </div>
        <div className="mt-2 flex items-baseline gap-3">
          <div
            className="font-serif tabular text-[88px] lg:text-[112px] leading-none"
            style={{ color: "var(--ink-900)" }}
          >
            {r.cognitive_score}
          </div>
          <div
            className="tabular text-[18px]"
            style={{ color: "var(--ink-300)" }}
          >
            {t.res.scoreOutOf}
          </div>
        </div>
        <div className="mt-5 lc-bar-track">
          <div
            className="lc-bar-fill"
            style={{
              width: `${r.cognitive_score}%`,
              background: "var(--ink-900)",
            }}
          />
        </div>
        <div
          className="mt-2 flex items-center justify-between text-[12px]"
          style={{ color: "var(--ink-400)" }}
        >
          <span>
            {t.res.confidenceLabel} ·{" "}
            <span style={{ color: "var(--ink-700)" }}>
              {t.res.confidence[r.confidence]}
            </span>
          </span>
          <span className="tabular">AUC 0.957 · n=111</span>
        </div>
      </div>

      {/* Pathway callout */}
      <div
        className="mt-7 lc-rise-2 pl-5 py-4"
        style={{ borderLeft: `3px solid ${c.fg}` }}
      >
        <div className="font-medium text-[14px]" style={{ color: c.fg }}>
          {pathwayLabel}
        </div>
        <p
          className="mt-1.5 text-[13.5px] leading-[1.6]"
          style={{ color: "var(--ink-700)" }}
        >
          {pathwayDesc}
        </p>
      </div>

      {/* Two-up: premium + delay */}
      <div className="mt-7 lc-rise-3 grid grid-cols-2 gap-4">
        <div className="rule-t pt-4">
          <div
            className="text-[11px] uppercase tracking-[0.14em]"
            style={{ color: "var(--ink-400)" }}
          >
            {t.res.premium}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div
              className="font-serif tabular text-[28px] lg:text-[32px]"
              style={{ color: "var(--ink-900)" }}
            >
              ₩{krw(r.monthly_premium_krw)}
            </div>
          </div>
          <div
            className="mt-1.5 text-[12px] tabular"
            style={{ color: premiumColor }}
          >
            {r.premium_change_pct > 0 ? "+" : ""}
            {r.premium_change_pct}%{" "}
            <span style={{ color: "var(--ink-400)" }}>
              · {t.res.premiumChange}
            </span>
          </div>
        </div>
        <div className="rule-t pt-4">
          <div
            className="text-[11px] uppercase tracking-[0.14em]"
            style={{ color: "var(--ink-400)" }}
          >
            {t.res.delay}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div
              className="font-serif tabular text-[28px] lg:text-[32px]"
              style={{ color: "var(--ink-900)" }}
            >
              {r.five_year_outlook.delay_months}
            </div>
            <div
              className="text-[13px]"
              style={{ color: "var(--ink-400)" }}
            >
              {t.res.delayUnit}
            </div>
          </div>
        </div>
      </div>

      {/* 5-year outlook */}
      <div className="mt-7 lc-rise-3">
        <div className="flex items-baseline justify-between">
          <div
            className="text-[11px] uppercase tracking-[0.14em]"
            style={{ color: "var(--ink-400)" }}
          >
            {t.res.outlookTitle}
          </div>
          <div
            className="text-[11px] tabular"
            style={{ color: "var(--ink-300)" }}
          >
            5y
          </div>
        </div>
        <div className="mt-4 space-y-3.5">
          <OutlookBar
            label={t.res.withoutLabel}
            value={without}
            color="var(--burgundy)"
          />
          <OutlookBar
            label={t.res.withLabel}
            value={withInt}
            color="var(--sage)"
          />
        </div>
        {reductionAbs > 0 ? (
          <p
            className="mt-4 text-[13px] tabular"
            style={{ color: "var(--ink-700)" }}
          >
            {t.res.outlookReduction}{" "}
            <strong style={{ color: "var(--ink-900)" }}>
              {(reductionAbs * 100).toFixed(1)}
            </strong>{" "}
            {t.res.outlookReductionTail}
            {reductionAbs > 0.05 ? (
              <>
                {" "}
                {t.res.outlookRel}{" "}
                <strong style={{ color: "var(--sage)" }}>
                  {reductionRel}%
                </strong>
                .
              </>
            ) : (
              "."
            )}
          </p>
        ) : null}
      </div>

      {/* Derived features */}
      <details className="mt-7 lc-rise-4 group">
        <summary className="cursor-pointer list-none flex items-center justify-between rule-t pt-4">
          <div>
            <div
              className="text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "var(--ink-400)" }}
            >
              {t.res.derivedTitle}
            </div>
            <div
              className="text-[12px] mt-1"
              style={{ color: "var(--ink-500)" }}
            >
              {t.res.derivedHint}
            </div>
          </div>
          <span
            className="text-[11px] tabular px-2 py-1 rounded-full"
            style={{ background: "var(--paper-3)", color: "var(--ink-500)" }}
          >
            + / −
          </span>
        </summary>
        <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-[12.5px] tabular">
          <DerivedRow
            k="avg_ht"
            v={`${r.derived_features.avg_ht.toFixed(1)} ms`}
          />
          <DerivedRow
            k="std_ht"
            v={`${r.derived_features.std_ht.toFixed(1)} ms`}
          />
          <DerivedRow
            k="avg_ft"
            v={`${r.derived_features.avg_ft.toFixed(1)} ms`}
          />
          <DerivedRow
            k="std_ft"
            v={`${r.derived_features.std_ft.toFixed(1)} ms`}
          />
          <DerivedRow
            k="avg_keys_per_session"
            v={`${r.derived_features.avg_keys_per_session}`}
          />
          <DerivedRow k="age" v={`${r.derived_features.age}`} />
        </dl>
      </details>

      <p
        className="mt-7 italic text-[11.5px] leading-[1.55]"
        style={{ color: "var(--ink-400)" }}
      >
        {t.res.disclaimer}
      </p>
    </Card>
  );
}
