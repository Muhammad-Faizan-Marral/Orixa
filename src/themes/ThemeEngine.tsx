import type { ComponentType, CSSProperties } from "react";
import dynamic from "next/dynamic";

import { getTheme } from "./registry";
import {
  getThemeIdFromPreferences,
  normalizeSelectionForTheme,
} from "./lab-helpers";

import type {
  PortfolioRenderConfig,
  PublicProfileMeta,
} from "@/portfolio-renderer/types";

import type { ThemePageProps, ThemeSectionId, ThemeId } from "./types";

import { ThemeBootGate, ThemeLoader } from "./shared/theme-loaders";
import { FREE_THEMES, isPremiumTheme } from "@/constants/billing";

const FALLBACK_FREE_THEME: ThemeId = FREE_THEMES[0];

function makeLoading(themeId: ThemeId) {
  return function ThemeChunkLoading() {
    return <ThemeLoader themeId={themeId} />;
  };
}

/**
 * IMPORTANT:
 * Keep every dynamic() declaration at module scope.
 * Do not create dynamic components inside ThemeEngine().
 *
 * SSR is preserved for SEO and compatibility with Server Components.
 */

const themePages: Record<ThemeId, ComponentType<ThemePageProps>> = {
  "minimal-airy": dynamic<ThemePageProps>(
    () =>
      import("./minimal-airy").then((m) => ({
        default: m.default.ThemePage!,
      })),
    {
      ssr: true,
      loading: makeLoading("minimal-airy"),
    },
  ),

  "tech-dense": dynamic<ThemePageProps>(
    () =>
      import("./tech-dense").then((m) => ({
        default: m.default.ThemePage!,
      })),
    {
      ssr: true,
      loading: makeLoading("tech-dense"),
    },
  ),

  editorial: dynamic<ThemePageProps>(
    () =>
      import("./editorial").then((m) => ({
        default: m.default.ThemePage!,
      })),
    {
      ssr: true,
      loading: makeLoading("editorial"),
    },
  ),

  "soft-luxury": dynamic<ThemePageProps>(
    () =>
      import("./soft-luxury").then((m) => ({
        default: m.default.ThemePage!,
      })),
    {
      ssr: true,
      loading: makeLoading("soft-luxury"),
    },
  ),

  "neo-glass": dynamic<ThemePageProps>(
    () =>
      import("./neo-glass").then((m) => ({
        default: m.default.ThemePage!,
      })),
    {
      ssr: true,
      loading: makeLoading("neo-glass"),
    },
  ),

  brutalist: dynamic<ThemePageProps>(
    () =>
      import("./brutalist").then((m) => ({
        default: m.default.ThemePage!,
      })),
    {
      ssr: true,
      loading: makeLoading("brutalist"),
    },
  ),

  cinematic: dynamic<ThemePageProps>(
    () =>
      import("./cinematic").then((m) => ({
        default: m.default.ThemePage!,
      })),
    {
      ssr: true,
      loading: makeLoading("cinematic"),
    },
  ),
};

type ThemeEngineProps = {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta & {
    isPremium?: boolean;
  };
};

export function ThemeEngine({ config, profile }: ThemeEngineProps) {
  const requestedId = getThemeIdFromPreferences(config.designPreferences);

  // A free user must not receive a saved premium theme publicly.
  const resolvedId: ThemeId =
    !profile.isPremium && isPremiumTheme(requestedId)
      ? FALLBACK_FREE_THEME
      : requestedId;

  const theme = getTheme(resolvedId);

  const normalized = normalizeSelectionForTheme(
    theme,
    config.componentSelection,
  );

  const selection = Object.fromEntries(
    Object.entries(normalized).map(([key, value]) => [key, value.variant]),
  ) as Record<ThemeSectionId, string>;

  const style = {
    "--theme-accent": theme.tokens.accentColor,
    "--theme-background": theme.tokens.backgroundColor,
    "--theme-foreground": theme.tokens.foregroundColor,
    "--theme-muted": theme.tokens.mutedColor,
    "--theme-font-sans": theme.tokens.fontSans,
    "--theme-font-display": theme.tokens.fontDisplay,
    backgroundColor: theme.tokens.backgroundColor,
    color: theme.tokens.foregroundColor,
    fontFamily: theme.tokens.fontSans,
  } as CSSProperties;

  // Lookup an already-created component; never call dynamic() here.
  const ThemePage = themePages[theme.id];

  return (
    <div className="min-h-screen" style={style}>
      <ThemeBootGate themeId={theme.id}>
        <ThemePage config={config} profile={profile} selection={selection} />
      </ThemeBootGate>
    </div>
  );
}
