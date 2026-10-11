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
import type {
  ThemePageComponent,
  ThemePageProps,
  ThemeSectionId,
  ThemeId,
} from "./types";
import { ThemeBootGate, ThemeLoader } from "./shared/theme-loaders";
import { isPremiumTheme, FREE_THEMES } from "@/constants/billing";

const FALLBACK_FREE_THEME: ThemeId = FREE_THEMES[0]; // "minimal-airy"

const themePageLoaders: Record<
  ThemeId,
  () => Promise<{ default: ThemePageComponent }>
> = {
  "minimal-airy": () =>
    import("./minimal-airy").then((m) => ({ default: m.default.ThemePage! })),
  "tech-dense": () =>
    import("./tech-dense").then((m) => ({ default: m.default.ThemePage! })),
  editorial: () =>
    import("./editorial").then((m) => ({ default: m.default.ThemePage! })),
  "soft-luxury": () =>
    import("./soft-luxury").then((m) => ({ default: m.default.ThemePage! })),
  "neo-glass": () =>
    import("./neo-glass").then((m) => ({ default: m.default.ThemePage! })),
  brutalist: () =>
    import("./brutalist").then((m) => ({ default: m.default.ThemePage! })),
  cinematic: () =>
    import("./cinematic").then((m) => ({ default: m.default.ThemePage! })),
};

function makeLoading(themeId: ThemeId) {
  return function ThemeChunkLoading() {
    return <ThemeLoader themeId={themeId} />;
  };
}

const themePages = Object.fromEntries(
  (Object.keys(themePageLoaders) as ThemeId[]).map((id) => [
    id,
    dynamic<ThemePageProps>(themePageLoaders[id], {
      ssr: true,
      loading: makeLoading(id),
    }),
  ]),
) as Record<ThemeId, ComponentType<ThemePageProps>>;

export function ThemeEngine({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta & { isPremium?: boolean };
}) {
  const requestedId = getThemeIdFromPreferences(config.designPreferences);

  // Free user + premium DNA saved → public page pe free theme dikhao
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

  const ThemePage = themePages[theme.id];

  return (
    <div className="min-h-screen" style={style}>
      <ThemeBootGate themeId={theme.id}>
        <ThemePage config={config} profile={profile} selection={selection} />
      </ThemeBootGate>
    </div>
  );
}