"use client";

import { useEffect } from "react";

import { useTheme } from "@/components/theme-provider";
import { isThemeMode, type ThemeMode } from "@/lib/theme";

/**
 * Syncs the theme preference loaded from the database into the
 * client ThemeProvider (and localStorage) when the user is authenticated.
 * Place once inside the dashboard shell / authenticated layout.
 */
export function ThemeSync({ themeMode }: { themeMode: string | null }) {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    if (!isThemeMode(themeMode)) return;
    if (themeMode === theme) return;
    setTheme(themeMode as ThemeMode);
  }, [themeMode, theme, setTheme]);

  return null;
}
