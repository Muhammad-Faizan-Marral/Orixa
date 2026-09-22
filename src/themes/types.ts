import type { ComponentType, CSSProperties, ReactNode } from "react";
import type {
  PortfolioRenderConfig,
  PublicProfileMeta,
  RendererDesignPreferences,
  RendererComponentSelection,
} from "@/portfolio-renderer/types";

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

export type ThemeSectionProps = {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
  variant?: string;
  design?: RendererDesignPreferences;
  section: ThemeSectionId;
  tone: "default" | "alternate";
};

export type ThemeSectionComponent = ComponentType<ThemeSectionProps>;

export type ThemeDefinition = {
  id: ThemeId;
  name: string;
  description: string;
  premium: boolean;
  tokens: ThemeTokens;
  defaults: Record<ThemeSectionId, string>;
  variants: Record<ThemeSectionId, readonly string[]>;
  sections: Record<ThemeSectionId, ThemeSectionComponent>;
};

export type ThemeRenderContext = {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta & { isPremium?: boolean };
  theme: ThemeDefinition;
  selection: RendererComponentSelection;
  style: CSSProperties;
};

export type ThemeSectionRendererProps = ThemeSectionProps & {
  children?: ReactNode;
};
