"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { applyHtmlLang, persistLocale, readStoredLocale } from "@/i18n/locale";

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type Props = {
  children: ReactNode;
  initialLocale?: Locale | null;
};

export function LocaleProvider({ children, initialLocale }: Props) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (isLocale(initialLocale)) return initialLocale;
    return defaultLocale;
  });

  useEffect(() => {
    const stored = readStoredLocale();
    const preferred = isLocale(initialLocale) ? initialLocale : stored;

    if (isLocale(initialLocale) && initialLocale !== stored) {
      persistLocale(initialLocale);
    }

    setLocaleState(preferred);
    applyHtmlLang(preferred);
  }, [initialLocale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
    applyHtmlLang(next);
  }, []);

  const dictionary = useMemo(() => getDictionary(locale), [locale]);

  const value = useMemo(
    () => ({
      locale,
      dictionary,
      setLocale,
      t: dictionary,
    }),
    [locale, dictionary, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useLocaleOptional() {
  return useContext(LocaleContext);
}
