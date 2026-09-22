import { DEFAULT_COMPONENT_SELECTION } from "@/features/portfolio/component-variants";
import type { RendererComponentSelection, RendererDesignPreferences } from "@/portfolio-renderer/types";
import type { ThemeDefinition, ThemeId, ThemeSectionId } from "./types";
import { getTheme, THEMES } from "./registry";

export function normalizeThemeId(value: unknown): ThemeId {
  if (typeof value === "string" && getTheme(value as ThemeId)) return value as ThemeId;
  return "minimal-airy";
}

export function getThemeIdFromPreferences(prefs?: RendererDesignPreferences | null): ThemeId {
  return normalizeThemeId(prefs?.themeId ?? prefs?.designDna);
}

export function defaultSelectionForTheme(theme: ThemeDefinition): RendererComponentSelection {
  return Object.fromEntries(
    Object.keys(DEFAULT_COMPONENT_SELECTION).map((section) => [
      section,
      { enabled: true, variant: theme.defaults[section as ThemeSectionId] },
    ]),
  ) as RendererComponentSelection;
}

export function normalizeSelectionForTheme(
  theme: ThemeDefinition,
  selection?: RendererComponentSelection | null,
): RendererComponentSelection {
  const base = defaultSelectionForTheme(theme);
  for (const section of Object.keys(base) as ThemeSectionId[]) {
    const incoming = selection?.[section];
    if (!incoming) continue;
    const variants = theme.variants[section];
    base[section] = {
      enabled: incoming.enabled !== false,
      variant: variants.includes(incoming.variant) ? incoming.variant : theme.defaults[section],
    };
  }
  return base;
}

export function getSectionVariantsForTheme(themeId: ThemeId, section: ThemeSectionId): readonly string[] {
  return getTheme(themeId).variants[section];
}

export function listThemesForLab(isPremium: boolean): ThemeDefinition[] {
  return Object.values(THEMES).filter((theme) => isPremium || !theme.premium || theme.premium);
}
