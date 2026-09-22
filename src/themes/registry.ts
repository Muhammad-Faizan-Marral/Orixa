import type { ThemeDefinition, ThemeId, ThemeSectionId } from "./types";
import { makeThemeSection } from "./shared/section-factory";
import { tokens as minimalTokens } from "./minimal-airy/tokens";
import { tokens as techTokens } from "./tech-dense/tokens";
import { tokens as editorialTokens } from "./editorial/tokens";
import { tokens as luxuryTokens } from "./soft-luxury/tokens";
import { tokens as glassTokens } from "./neo-glass/tokens";
import { tokens as brutalTokens } from "./brutalist/tokens";
import { tokens as cinemaTokens } from "./cinematic/tokens";

const sections = ["navbar", "hero", "about", "skills", "projects", "experience", "education", "certificates", "contact", "footer"] as const;
const ids = Object.fromEntries(sections.map((section) => [section, makeThemeSection(section)])) as ThemeDefinition["sections"];
const variants = (prefix: string) => Object.fromEntries(sections.map((section) => [section, [`${prefix}-${section}`, `${prefix}-${section}-alt`]])) as unknown as Record<ThemeSectionId, readonly string[]>;
const defaults = (prefix: string) => Object.fromEntries(sections.map((section) => [section, `${prefix}-${section}`])) as Record<ThemeSectionId, string>;

function define(id: ThemeId, name: string, description: string, premium: boolean, tokens: ThemeDefinition["tokens"], prefix: string): ThemeDefinition {
  return { id, name, description, premium, tokens, defaults: defaults(prefix), variants: variants(prefix), sections: ids };
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  "minimal-airy": define("minimal-airy", "Minimal Airy", "Quiet spacing and clear typography.", false, minimalTokens, "minimal"),
  "tech-dense": define("tech-dense", "Tech Dense", "Structured, technical, and information-rich.", false, techTokens, "tech"),
  editorial: define("editorial", "Editorial", "Warm type-led storytelling.", false, editorialTokens, "editorial"),
  "soft-luxury": define("soft-luxury", "Soft Luxury", "Restrained warmth with polished surfaces.", true, luxuryTokens, "luxury"),
  "neo-glass": define("neo-glass", "Neo Glass", "Layered contrast and translucent rhythm.", true, glassTokens, "glass"),
  brutalist: define("brutalist", "Brutalist", "Direct, graphic, and unapologetic.", true, brutalTokens, "brutal"),
  cinematic: define("cinematic", "Cinematic", "Dark, dramatic, and image-conscious.", true, cinemaTokens, "cinema"),
};

export function getTheme(themeId: ThemeId): ThemeDefinition { return THEMES[themeId] ?? THEMES["minimal-airy"]; }
export function listThemes(): ThemeDefinition[] { return Object.values(THEMES); }
