"use client";

import Eyebrow from "./ui/Eyebrow";
import Button from "./ui/Button";
import { useLang } from "./LanguageContext";

function HeroDiagram() {
  // Single editorial cognitive-decline curve with a subtle "intervention" branch.
  return (
    <svg viewBox="0 0 320 200" className="w-full h-full" aria-hidden="true">
      <defs>
        <pattern
          id="hg"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M20 0 L0 0 L0 20"
            fill="none"
            stroke="var(--rule)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect x="0" y="0" width="320" height="200" fill="url(#hg)" />
      <line x1="24" y1="170" x2="304" y2="170" stroke="var(--rule-strong)" strokeWidth="1" />
      <line x1="24" y1="20"  x2="24"  y2="170" stroke="var(--rule-strong)" strokeWidth="1" />
      <path
        d="M24,140 C 90,138 130,128 170,108 C 210,88 250,52 304,30"
        fill="none"
        stroke="var(--burgundy)"
        strokeWidth="1.8"
      />
      <path
        d="M24,140 C 90,138 130,132 170,124 C 220,114 260,102 304,86"
        fill="none"
        stroke="var(--sage)"
        strokeWidth="1.8"
        strokeDasharray="3 3"
      />
      <circle cx="170" cy="108" r="3" fill="var(--ink-900)" />
      <line
        x1="170" y1="108" x2="170" y2="170"
        stroke="var(--ink-300)" strokeWidth="0.8" strokeDasharray="2 3"
      />
      <text x="180" y="106" fontSize="9" fill="var(--ink-500)" fontFamily="Inter">divergence</text>
      <text x="306" y="34"  fontSize="9" fill="var(--burgundy)" textAnchor="end" fontFamily="Inter">decline</text>
      <text x="306" y="90"  fontSize="9" fill="var(--sage)"     textAnchor="end" fontFamily="Inter">with Lucida</text>
      <text x="20"  y="14"  fontSize="9" fill="var(--ink-300)" fontFamily="Inter">risk</text>
      <text x="304" y="184" fontSize="9" fill="var(--ink-300)" textAnchor="end" fontFamily="Inter">years</text>
    </svg>
  );
}

type Props = {
  onStart: () => void;
  onHow: () => void;
};

export default function Hero({ onStart, onHow }: Props) {
  const { t } = useLang();
  const k = t.hero.kpi;
  const kpis = [
    { label: k.agedLabel,  value: k.agedValue,  foot: k.agedFoot  },
    { label: k.casesLabel, value: k.casesValue, foot: k.casesFoot },
    { label: k.costLabel,  value: k.costValue,  foot: k.costFoot  },
    { label: k.delayLabel, value: k.delayValue, foot: k.delayFoot },
  ];

  return (
    <section className="relative" aria-labelledby="hero-heading">
      <div className="max-w-deck mx-auto px-6 lg:px-10 pt-20 lg:pt-28 pb-12 lg:pb-20">
        <Eyebrow>{t.hero.eyebrow}</Eyebrow>
        <div className="mt-5 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <h1
              id="hero-heading"
              className="font-serif text-[44px] sm:text-[56px] lg:text-[68px] leading-[1.04]"
              style={{ color: "var(--ink-900)" }}
            >
              {t.hero.titleLine1}
              <br className="hidden sm:block" /> {t.hero.titleLine2}
            </h1>
            <p
              className="mt-6 max-w-2xl text-[16px] lg:text-[17px] leading-[1.6]"
              style={{ color: "var(--ink-500)" }}
            >
              {t.hero.body}
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Button onClick={onStart}>
                {t.hero.ctaPrimary}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Button>
              <Button variant="ghost" onClick={onHow}>
                {t.hero.ctaSecondary}
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5 hidden lg:block">
            <div className="aspect-[16/10]">
              <HeroDiagram />
            </div>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="rule-t" style={{ background: "var(--paper-2)" }}>
        <div className="max-w-deck mx-auto px-6 lg:px-10">
          <dl
            className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x"
            style={{ borderColor: "var(--rule)" }}
          >
            {kpis.map((it, i) => (
              <div
                key={it.label}
                className={`py-7 ${i > 0 ? "sm:pl-8" : ""} ${
                  i < 3 ? "sm:pr-8" : ""
                }`}
                style={{ borderColor: "var(--rule)" }}
              >
                <dt
                  className="text-[11px] uppercase tracking-[0.14em]"
                  style={{ color: "var(--ink-400)" }}
                >
                  {it.label}
                </dt>
                <dd className="mt-2">
                  <div
                    className="kpi-num font-serif text-[32px] lg:text-[40px] leading-none"
                    style={{ color: "var(--ink-900)" }}
                  >
                    {it.value}
                  </div>
                  <div
                    className="mt-2 text-[12.5px]"
                    style={{ color: "var(--ink-500)" }}
                  >
                    {it.foot}
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
