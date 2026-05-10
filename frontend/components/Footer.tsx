"use client";

import Link from "next/link";
import LucidaMark from "./ui/LucidaMark";
import { useLang } from "./LanguageContext";
import { legalLabels } from "@/lib/legal";

export default function Footer() {
  const { t, lang } = useLang();
  const lbl = legalLabels[lang];

  return (
    <footer className="rule-t" style={{ background: "var(--paper-2)" }}>
      <div className="max-w-deck mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2.5">
              <LucidaMark />
              <span
                className="font-serif text-[20px]"
                style={{ color: "var(--ink-900)" }}
              >
                Lucida
              </span>
            </div>
            <p
              className="mt-4 max-w-md text-[14px] leading-[1.6]"
              style={{ color: "var(--ink-500)" }}
            >
              {t.footer.tagline}
            </p>
            <div
              className="mt-5 inline-flex items-center gap-2 text-[12px]"
              style={{ color: "var(--ink-400)" }}
            >
              <span className="lc-dot" />
              <span>{t.footer.modelLive}</span>
            </div>
          </div>

          {/* Team */}
          <div className="lg:col-span-3">
            <div
              className="text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "var(--ink-400)" }}
            >
              {t.footer.teamHead}
            </div>
            <div
              className="mt-3 text-[14px]"
              style={{ color: "var(--ink-900)" }}
            >
              {t.footer.teamName}
            </div>
            <div
              className="mt-1 text-[13px]"
              style={{ color: "var(--ink-500)" }}
            >
              {t.footer.school}
            </div>
          </div>

          {/* Legal */}
          <div className="lg:col-span-3">
            <div
              className="text-[11px] uppercase tracking-[0.14em]"
              style={{ color: "var(--ink-400)" }}
            >
              {lbl.legalHead}
            </div>
            <ul className="mt-3 space-y-2 text-[13px]">
              <li>
                <Link
                  href="/privacy"
                  className="hover:underline"
                  style={{ color: "var(--ink-900)" }}
                >
                  {lbl.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:underline"
                  style={{ color: "var(--ink-900)" }}
                >
                  {lbl.terms}
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:underline"
                  style={{ color: "var(--ink-900)" }}
                >
                  {lbl.cookies}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-6 rule-t flex flex-wrap items-baseline justify-between gap-4 text-[11.5px] leading-[1.6]"
          style={{ color: "var(--ink-400)" }}
        >
          <p className="max-w-3xl">{t.footer.rights}</p>
          <p className="tabular">© 2026 Team JEONNAM NICE</p>
        </div>
      </div>
    </footer>
  );
}
