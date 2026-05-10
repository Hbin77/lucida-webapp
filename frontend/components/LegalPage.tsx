"use client";

import Link from "next/link";
import { useLang } from "./LanguageContext";
import { legalDocs, legalLabels, type LegalDoc } from "@/lib/legal";

type Props = {
  docKey: "privacy" | "terms" | "cookies";
};

export default function LegalPage({ docKey }: Props) {
  const { lang } = useLang();
  const doc: LegalDoc = legalDocs[lang][docKey];
  const lbl = legalLabels[lang];

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--paper)", color: "var(--ink-900)" }}
    >
      <div className="max-w-[760px] mx-auto px-6 lg:px-10 pt-24 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[12.5px] hover:underline"
          style={{ color: "var(--ink-500)" }}
        >
          {lbl.backHome}
        </Link>

        <h1
          className="mt-6 font-serif text-[40px] sm:text-[48px] leading-[1.05]"
          style={{ color: "var(--ink-900)" }}
        >
          {doc.title}
        </h1>

        <p
          className="mt-6 text-[15px] leading-[1.6]"
          style={{ color: "var(--ink-700)" }}
        >
          {doc.intro}
        </p>

        <div
          className="mt-2 text-[12px] tabular"
          style={{ color: "var(--ink-400)" }}
        >
          {lbl.lastUpdated} · {doc.lastUpdated}
        </div>

        <div
          className="mt-10 pt-8 rule-t space-y-10"
          style={{ borderColor: "var(--rule)" }}
        >
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2
                className="font-serif text-[22px] leading-[1.2]"
                style={{ color: "var(--ink-900)" }}
              >
                {s.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {s.body.map((p, i) => (
                  <p
                    key={i}
                    className="text-[14px] leading-[1.65] whitespace-pre-line"
                    style={{ color: "var(--ink-700)" }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
