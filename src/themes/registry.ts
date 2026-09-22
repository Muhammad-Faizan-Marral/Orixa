import type { ThemeDefinition, ThemeId } from "./types";
import minimalAiry from "./minimal-airy"; import techDense from "./tech-dense"; import editorial from "./editorial"; import softLuxury from "./soft-luxury"; import neoGlass from "./neo-glass"; import brutalist from "./brutalist"; import cinematic from "./cinematic";
export const THEMES:Record<ThemeId,ThemeDefinition>={"minimal-airy":minimalAiry,"tech-dense":techDense,editorial,"soft-luxury":softLuxury,"neo-glass":neoGlass,brutalist,cinematic};
export function getTheme(id:ThemeId):ThemeDefinition{return THEMES[id]||minimalAiry;} export function listThemes(){return Object.values(THEMES);}
