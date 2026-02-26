"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Lang } from "@/lib/i18n";
import { setClientLang, DEFAULT_LANG } from "@/lib/i18n";

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextType>({
  lang: DEFAULT_LANG,
  setLang: () => {},
});

export function useLang(): LangContextType {
  return useContext(LangContext);
}

export function LangProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // Manual language switch — sets cookie and reloads so server components re-render
  const setLang = useCallback((newLang: Lang) => {
    setClientLang(newLang);
    setLangState(newLang);
    document.documentElement.lang = newLang;
    window.location.reload();
  }, []);

  // Listen for langchange events from BlogLangSync (blog post auto-detection)
  useEffect(() => {
    function handleLangChange(e: Event) {
      const detail = (e as CustomEvent).detail as Lang;
      if (detail !== lang) {
        setLangState(detail);
        document.documentElement.lang = detail;
      }
    }
    window.addEventListener("langchange", handleLangChange);
    return () => window.removeEventListener("langchange", handleLangChange);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}
