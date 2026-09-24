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

const themePageLoaders: Record<ThemeId, () => Promise<{ default: ThemePageComponent }>> = {
  "minimal-airy": () => import("./minimal-airy").then((module) => ({ default: module.default.ThemePage! })),
  "tech-dense": () => import("./tech-dense").then((module) => ({ default: module.default.ThemePage! })),
  editorial: () => import("./editorial").then((module) => ({ default: module.default.ThemePage! })),
  "soft-luxury": () => import("./soft-luxury").then((module) => ({ default: module.default.ThemePage! })),
  "neo-glass": () => import("./neo-glass").then((module) => ({ default: module.default.ThemePage! })),
  brutalist: () => import("./brutalist").then((module) => ({ default: module.default.ThemePage! })),
  cinematic: () => import("./cinematic").then((module) => ({ default: module.default.ThemePage! })),
};

const themePages = Object.fromEntries(
  Object.entries(themePageLoaders).map(([id, loader]) => [
    id,
    dynamic<ThemePageProps>(loader, { ssr: true, loading: PortfolioSkeleton }),
  ]),
) as Record<ThemeId, ComponentType<ThemePageProps>>;

function PortfolioSkeleton() {
  return <div className="min-h-screen" aria-busy="true" />;
}

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
      <ThemePage config={config} profile={profile} selection={selection} />
    </div>
  );
}
