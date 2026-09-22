import type { CSSProperties } from "react";
import { getTheme } from "./registry";
import { getThemeIdFromPreferences, normalizeSelectionForTheme } from "./lab-helpers";
import type { PortfolioRenderConfig, PublicProfileMeta } from "@/portfolio-renderer/types";

function hasContent(config: PortfolioRenderConfig, section: string) {
  if (["navbar", "hero", "footer", "contact"].includes(section)) return true;
  const value = config[section as keyof PortfolioRenderConfig];
  return typeof value === "string" ? Boolean(value.trim()) : Array.isArray(value) && value.length > 0;
}

export function ThemeEngine({ config, profile }: { config: PortfolioRenderConfig; profile: PublicProfileMeta & { isPremium?: boolean } }) {
  const theme = getTheme(getThemeIdFromPreferences(config.designPreferences));
  const selection = normalizeSelectionForTheme(theme, config.componentSelection);
  const style = {
    "--theme-accent": theme.tokens.accentColor,
    "--theme-background": theme.tokens.backgroundColor,
    "--theme-foreground": theme.tokens.foregroundColor,
    "--theme-muted": theme.tokens.mutedColor,
    "--theme-font-sans": theme.tokens.fontSans,
    "--theme-font-display": theme.tokens.fontDisplay,
  } as CSSProperties;
  return <div className="min-h-screen" style={{ ...style, backgroundColor: theme.tokens.backgroundColor, color: theme.tokens.foregroundColor, fontFamily: theme.tokens.fontSans }}>
    {Object.keys(theme.sections).map((section) => {
      const key = section as keyof typeof selection;
      if (!hasContent(config, section) || selection[key]?.enabled === false) return null;
      const Component = theme.sections[key];
      return <Component key={section} config={config} profile={profile} section={key} variant={selection[key]?.variant} tone={selection[key]?.variant.endsWith("-alt") ? "alternate" : "default"} />;
    })}
  </div>;
}