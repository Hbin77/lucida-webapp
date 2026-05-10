"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type Lang, type Translations } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
};

const LanguageCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "lucida-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined"
      ? (localStorage.getItem(STORAGE_KEY) as Lang | null)
      : null);
    if (saved === "en" || saved === "ko") {
      setLangState(saved);
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, l);
    }
  }, []);

  const value: Ctx = { lang, setLang, t: translations[lang] };
  return <LanguageCtx.Provider value={value}>{children}</LanguageCtx.Provider>;
}

export function useLang(): Ctx {
  const v = useContext(LanguageCtx);
  if (!v) throw new Error("useLang must be used within <LanguageProvider>");
  return v;
}
