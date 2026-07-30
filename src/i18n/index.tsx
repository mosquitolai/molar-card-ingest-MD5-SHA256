import React, { createContext, useContext, useMemo, useState } from "react";
import en from "./locales/en";
import zhTW from "./locales/zh-TW";
import zhCN from "./locales/zh-CN";
import ja from "./locales/ja";
import de from "./locales/de";
import fr from "./locales/fr";
import nl from "./locales/nl";
import ru from "./locales/ru";
import type { LanguageCode } from "../types/disk";
import type { TranslationSchema } from "./locales/en";

const dictionaries: Record<LanguageCode, TranslationSchema> = {
  "zh-TW": zhTW,
  "zh-CN": zhCN,
  en,
  ja,
  de,
  fr,
  nl,
  ru,
};

export const languageNames: Record<LanguageCode, string> = {
  "zh-TW": "繁體中文",
  "zh-CN": "简体中文",
  en: "English (US)",
  ja: "日本語",
  de: "Deutsch",
  fr: "Français",
  nl: "Nederlands",
  ru: "Русский",
};

interface I18nContextValue {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: TranslationSchema;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "molacard.language";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    return saved && dictionaries[saved] ? saved : "zh-TW";
  });

  const setLang = (next: LanguageCode) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo(
    () => ({ lang, setLang, t: dictionaries[lang] }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
