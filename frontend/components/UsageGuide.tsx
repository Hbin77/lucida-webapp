"use client";

import Eyebrow from "./ui/Eyebrow";
import PathTag, { PATHWAY_COLOR, type PathwayCode } from "./ui/PathTag";
import { useLang } from "./LanguageContext";
import type { SimulateRequest } from "@/lib/api";

type PresetKey = "healthy" | "borderline" | "atrisk";
type PresetDef = SimulateRequest & { code: PathwayCode };

export const PRESETS: Record<PresetKey, PresetDef> = {
  healthy:    { age: 45, sex: "F", typing_speed: 78, latency_variance: 22, code: "A" },
  borderline: { age: 60, sex: "M", typing_speed: 52, latency_variance: 55, code: "B" },
  atrisk:     { age: 70, sex: "M", typing_speed: 32, latency_variance: 82, code: "C" },
};

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt
        className="text-[11px] uppercase tracking-[0.10em]"
        style={{ color: "var(--ink-400)" }}
      >
        {k}
      </dt>
      <dd style={{ color: "var(--ink-900)" }}>{v}</dd>
    </div>
  );
}

function PresetCard({ id, def }: { id: PresetKey; def: PresetDef }) {
  const { t } = useLang();
  const meta = t.guide.presets[id];
  const c = PATHWAY_COLOR[def.code];

  function onClick() {
    if (typeof window === "undefined") return;
    const detail: SimulateRequest = {
      age: def.age,
      sex: def.sex,
      typing_speed: def.typing_speed,
      latency_variance: def.latency_variance,
    };
    window.dispatchEvent(new CustomEvent<SimulateRequest>("lucida:preset", { detail }));
    document
      .getElementById("simulator")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left p-6 rounded-[10px] transition-all duration-150"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--rule)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center justify-between">
        <PathTag code={def.code}>{meta.tag}</PathTag>
        <span className="text-[11px]" style={{ color: "var(--ink-300)" }}>
          ›
        </span>
      </div>
      <h3
        className="mt-4 font-serif text-[22px] leading-tight"
        style={{ color: "var(--ink-900)" }}
      >
        {meta.title}
      </h3>
      <p className="mt-1 text-[13.5px]" style={{ color: "var(--ink-500)" }}>
        {meta.body}
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-[12px] tabular">
        <Detail k={t.sim.field.age}      v={`${def.age}`} />
        <Detail k={t.sim.field.sex}      v={t.sim.sex[def.sex]} />
        <Detail k={t.sim.field.speed}    v={`${def.typing_speed}`} />
        <Detail k={t.sim.field.variance} v={`${def.latency_variance}`} />
      </dl>
      <div
        className="mt-6 inline-flex items-center gap-1.5 text-[12.5px] font-medium"
        style={{ color: c.fg }}
      >
        {meta.run}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

export default function UsageGuide() {
  const { t } = useLang();
  const s = t.guide.steps;
  return (
    <section
      id="how-to-use"
      className="rule-t"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-deck mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-10">
          <header className="lg:col-span-4">
            <Eyebrow>{t.guide.eyebrow}</Eyebrow>
            <h2
              className="mt-4 font-serif text-[34px] lg:text-[40px] leading-[1.1]"
              style={{ color: "var(--ink-900)" }}
            >
              {t.guide.title}
            </h2>
            <p
              className="mt-4 text-[15px] leading-[1.6]"
              style={{ color: "var(--ink-500)" }}
            >
              {t.guide.body}
            </p>
          </header>
          <div className="lg:col-span-8">
            <div
              className="text-[11px] uppercase tracking-[0.14em] mb-3"
              style={{ color: "var(--ink-400)" }}
            >
              {t.guide.presetsLabel}
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <PresetCard id="healthy"    def={PRESETS.healthy} />
              <PresetCard id="borderline" def={PRESETS.borderline} />
              <PresetCard id="atrisk"     def={PRESETS.atrisk} />
            </div>
            <ol className="mt-10 grid sm:grid-cols-3 gap-x-8 gap-y-6">
              {[s.s1, s.s2, s.s3].map((st) => (
                <li key={st.n}>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-serif text-[20px] tabular"
                      style={{ color: "var(--indigo)" }}
                    >
                      {st.n}
                    </span>
                    <span
                      className="font-medium text-[14.5px]"
                      style={{ color: "var(--ink-900)" }}
                    >
                      {st.h}
                    </span>
                  </div>
                  <p
                    className="mt-1.5 pl-9 text-[13.5px] leading-[1.55]"
                    style={{ color: "var(--ink-500)" }}
                  >
                    {st.p}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
