"use client";

import { useEffect } from "react";

import { useLocale } from "@/components/locale-provider";
import { isLocale, type Locale } from "@/i18n/config";

export function LocaleSync({ language }: { language: string | null }) {
  const { setLocale, locale } = useLocale();

  useEffect(() => {
    if (!isLocale(language)) return;
    if (language === locale) return;
    setLocale(language as Locale);
  }, [language, locale, setLocale]);

  return null;
}
