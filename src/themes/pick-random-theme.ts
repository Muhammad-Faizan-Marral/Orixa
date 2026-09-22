import { listThemes } from "./registry";
import type { ThemeDefinition } from "./types";

export function pickRandomFreeTheme(): ThemeDefinition {
  const themes = listThemes().filter((theme) => !theme.premium);
  return themes[Math.floor(Math.random() * themes.length)] ?? themes[0];
}