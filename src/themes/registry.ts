import type { ThemeDefinition, ThemeId, ThemeSectionId } from "./types";
import { tokens as minimalTokens } from "./minimal-airy/tokens";
import { tokens as techTokens } from "./tech-dense/tokens";
import { tokens as editorialTokens } from "./editorial/tokens";
import { tokens as luxuryTokens } from "./soft-luxury/tokens";
import { tokens as glassTokens } from "./neo-glass/tokens";
import { tokens as brutalistTokens } from "./brutalist/tokens";
import { tokens as cinematicTokens } from "./cinematic/tokens";

const sections: ThemeSectionId[] = [
	"navbar", "hero", "about", "skills", "projects", "experience",
	"education", "certificates", "contact", "footer",
];

function createTheme(
	id: ThemeId,
	name: string,
	description: string,
	premium: boolean,
	tokens: ThemeDefinition["tokens"],
): ThemeDefinition {
	return {
		id,
		name,
		description,
		premium,
		tokens,
		defaults: Object.fromEntries(sections.map((section) => [section, "default"])),
		variants: Object.fromEntries(sections.map((section) => [section, ["default", "alt"]])),
	} as unknown as ThemeDefinition;
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
	"minimal-airy": createTheme("minimal-airy", "Minimal Airy", "Quiet spacing and clear typography.", false, minimalTokens),
	"tech-dense": createTheme("tech-dense", "Tech Dense", "Structured technical portfolio.", false, techTokens),
	editorial: createTheme("editorial", "Editorial", "Warm type-led storytelling.", false, editorialTokens),
	"soft-luxury": createTheme("soft-luxury", "Soft Luxury", "Restrained warmth and polished surfaces.", true, luxuryTokens),
	"neo-glass": createTheme("neo-glass", "Neo Glass", "Layered contrast and translucent rhythm.", true, glassTokens),
	brutalist: createTheme("brutalist", "Brutalist", "Direct graphic portfolio system.", true, brutalistTokens),
	cinematic: createTheme("cinematic", "Cinematic", "Dark, dramatic, image-conscious portfolio.", true, cinematicTokens),
};

export function getTheme(id: ThemeId): ThemeDefinition {
	return THEMES[id] || THEMES["minimal-airy"];
}

export function listThemes() {
	return Object.values(THEMES);
}
