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

/** dynamic() loading fallback — theme-aware while JS chunk loads */
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
  const theme = getTheme(getThemeIdFromPreferences(config.designPreferences));
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