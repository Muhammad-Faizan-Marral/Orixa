import type { CSSProperties } from "react";
import { getTheme } from "./registry";
import { getThemeIdFromPreferences, normalizeSelectionForTheme } from "./lab-helpers";
import type { PortfolioRenderConfig, PublicProfileMeta } from "@/portfolio-renderer/types";
import type { ThemeSectionId } from "./types";

export function ThemeEngine({config,profile}:{config:PortfolioRenderConfig;profile:PublicProfileMeta&{isPremium?:boolean}}){const theme=getTheme(getThemeIdFromPreferences(config.designPreferences));const normalized=normalizeSelectionForTheme(theme,config.componentSelection);const selection=Object.fromEntries(Object.entries(normalized).map(([key,value])=>[key,value.variant])) as Record<ThemeSectionId,string>;const style={"--theme-accent":theme.tokens.accentColor,"--theme-background":theme.tokens.backgroundColor,"--theme-foreground":theme.tokens.foregroundColor,"--theme-muted":theme.tokens.mutedColor,"--theme-font-sans":theme.tokens.fontSans,"--theme-font-display":theme.tokens.fontDisplay,backgroundColor:theme.tokens.backgroundColor,color:theme.tokens.foregroundColor,fontFamily:theme.tokens.fontSans} as CSSProperties;const ThemePage=theme.ThemePage;return <div className="min-h-screen" style={style}><ThemePage config={config} profile={profile} selection={selection}/></div>;}
