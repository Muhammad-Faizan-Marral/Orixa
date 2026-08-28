import type { Locale } from "@/i18n/config";
import type { Dictionary } from "./en";

import en from "./en";
import es from "./es";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  es,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

export type { Dictionary };
