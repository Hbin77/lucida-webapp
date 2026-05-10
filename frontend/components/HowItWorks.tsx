"use client";

import Eyebrow from "./ui/Eyebrow";
import { useLang } from "./LanguageContext";

export default function HowItWorks() {
  const { t } = useLang();
  const s = t.how.step;
  const steps = [s.s1, s.s2, s.s3, s.s4];

  return (
    <section
      id="how-it-works"
      className="rule-t"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-deck mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <header className="max-w-2xl">
          <Eyebrow>{t.how.eyebrow}</Eyebrow>
          <h2
            className="mt-4 font-serif text-[34px] lg:text-[40px] leading-[1.1]"
            style={{ color: "var(--ink-900)" }}
          >
            {t.how.title}
          </h2>
        </header>

        <ol
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-[12px] overflow-hidden"
          style={{
            background: "var(--rule)",
            border: "1px solid var(--rule)",
          }}
        >
          {steps.map((st) => (
            <li
              key={st.n}
              className="p-7 lg:p-8"
              style={{ background: "var(--paper)" }}
            >
              <div
                className="font-serif tabular text-[24px]"
                style={{ color: "var(--indigo)" }}
              >
                {st.n}
              </div>
              <h3
                className="mt-4 text-[16px] font-medium"
                style={{ color: "var(--ink-900)" }}
              >
                {st.h}
              </h3>
              <p
                className="mt-2 text-[13.5px] leading-[1.6]"
                style={{ color: "var(--ink-500)" }}
              >
                {st.p}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid lg:grid-cols-12 gap-6">
          <div
            className="lg:col-span-7 lg:col-start-6 p-7 lg:p-8 rounded-[10px]"
            style={{
              background: "var(--sage-soft)",
              border: "1px solid var(--sage-soft)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--sage)"
                strokeWidth="1.8"
              >
                <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <h3
                className="text-[15px] font-medium"
                style={{ color: "var(--sage)" }}
              >
                {t.how.privacyTitle}
              </h3>
            </div>
            <p
              className="mt-3 text-[14px] leading-[1.6]"
              style={{ color: "var(--ink-700)" }}
            >
              {t.how.privacyBody}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
