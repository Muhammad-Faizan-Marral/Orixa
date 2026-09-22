import type { ComponentType, CSSProperties } from "react";
import type { PortfolioRenderConfig, PublicProfileMeta, RendererComponentSelection } from "@/portfolio-renderer/types";

export type ThemeId =
  | "minimal-airy"
  | "tech-dense"
  | "editorial"
  | "soft-luxury"
  | "neo-glass"
  | "brutalist"
  | "cinematic";

export type ThemeTokens = {
  themeMode: "light" | "dark";
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  mutedColor: string;
  fontSans: string;
  fontDisplay: string;
};

export type ThemeSectionId = keyof RendererComponentSelection;

export type ThemePageProps = {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta & { isPremium?: boolean };
  selection: Record<ThemeSectionId, string>;
  style?: CSSProperties;
};

export type ThemeSectionProps = {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta & { isPremium?: boolean };
};

export type ThemePageComponent = ComponentType<ThemePageProps>;

export type ThemeDefinition = {
  id: ThemeId;
  name: string;
  description: string;
  premium: boolean;
  tokens: ThemeTokens;
  defaults: Record<ThemeSectionId, string>;
  variants: Record<ThemeSectionId, readonly string[]>;
  ThemePage: ThemePageComponent;
};
