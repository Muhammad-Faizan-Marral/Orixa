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

import {
  applyThemeClass,
  isThemeMode,
  persistTheme,
  readStoredTheme,
  resolveTheme,
  type ResolvedTheme,
  type ThemeMode,
} from "@/lib/theme";

type ThemeContextValue = {
  /** User preference: light | dark | system */
  theme: ThemeMode;
  /** Actual applied theme after resolving system */
  resolvedTheme: ResolvedTheme;
  setTheme: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type Props = {
  children: ReactNode;
  /** Optional server-known preference (e.g. from DB settings) */
  initialTheme?: ThemeMode | null;
};

export function ThemeProvider({ children, initialTheme }: Props) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (isThemeMode(initialTheme)) return initialTheme;
    return "system";
  });
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");

  // Hydrate from localStorage after mount (prefer DB value if provided)
  useEffect(() => {
    const stored = readStoredTheme();
    const preferred = isThemeMode(initialTheme) ? initialTheme : stored;

    if (isThemeMode(initialTheme) && initialTheme !== stored) {
      persistTheme(initialTheme);
    }

    setThemeState(preferred);
    const resolved = resolveTheme(preferred);
    setResolvedTheme(resolved);
    applyThemeClass(resolved);
  }, [initialTheme]);

  // Keep in sync with OS when mode === "system"
  useEffect(() => {
    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const onChange = () => {
      const resolved = resolveTheme("system");
      setResolvedTheme(resolved);
      applyThemeClass(resolved);
    };

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    persistTheme(mode);
    const resolved = resolveTheme(mode);
    setResolvedTheme(resolved);
    applyThemeClass(resolved);
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}

/** Safe variant for optional usage (e.g. marketing pages). */
export function useThemeOptional() {
  return useContext(ThemeContext);
}
