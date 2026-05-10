"use client";

import { useLang } from "./LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="lc-pill" role="group" aria-label={t.lang.switchTo}>
        <button
          type="button"
          aria-pressed={lang === "en"}
          onClick={() => setLang("en")}
        >
          {t.lang.en}
        </button>
        <button
          type="button"
          aria-pressed={lang === "ko"}
          onClick={() => setLang("ko")}
        >
          {t.lang.ko}
        </button>
      </div>
    </div>
  );
}
