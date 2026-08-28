export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_STORAGE_KEY = "orixa-locale";
export const LOCALE_COOKIE_NAME = "orixa-locale";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "es";
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (isLocale(value)) return value;
  return defaultLocale;
}
