/**
 * Orixa theme utilities.
 *
 * Storage key is shared between the blocking FOUC script (layout)
 * and the client ThemeProvider so they stay in sync.
 *
 * Resolved theme:
 *   - "light"  → <html class="light">
 *   - "dark"   → no class (default :root is dark)
 *   - "system" → follows prefers-color-scheme
 */

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "orixa-theme";
export const THEME_COOKIE_NAME = "orixa-theme";

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === "system") return getSystemTheme();
  return mode;
}

/** Apply resolved theme to <html>. Default (dark) = no class. */
export function applyThemeClass(resolved: ResolvedTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "light") {
    root.classList.add("light");
  } else {
    root.classList.remove("light");
  }
}

export function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeMode(raw)) return raw;
  } catch {
    /* private mode / blocked storage */
  }
  return "system";
}

export function persistTheme(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
  try {
    document.cookie = `${THEME_COOKIE_NAME}=${mode};path=/;max-age=31536000;SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

/**
 * Blocking script injected into <head> to prevent FOUC.
 * Must stay in sync with applyThemeClass / resolveTheme logic above.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var m=localStorage.getItem(k)||"system";var d=m==="system"?window.matchMedia("(prefers-color-scheme: dark)").matches:"dark"===m;if(!d)document.documentElement.classList.add("light");else document.documentElement.classList.remove("light");}catch(e){}})();`;
