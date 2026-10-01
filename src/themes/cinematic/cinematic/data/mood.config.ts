import type { AmbienceId, FilmLook, MoodId, MoodPreset, QualityBudget, QualityTier } from "../schema";

export const MOODS: Record<MoodId, MoodPreset> = {
  "petal-pond": {
    id: "petal-pond",
    ambience: "petals",
    palette: { skyTop: "#050308", skyBottom: "#1a0b18", accent: "#f2a6c4", glow: "#ff7eb6", particle: "#f6b8d0" },
    intensity: 0.7,
    haze: 0.35,
  },
  "butterfly-dusk": {
    id: "butterfly-dusk",
    ambience: "butterflies",
    palette: { skyTop: "#0d1b30", skyBottom: "#6fa8d6", accent: "#ffd9a0", glow: "#ffe9c4", particle: "#ffffff" },
    intensity: 0.6,
    haze: 0.5,
  },
  "wave-field": {
    id: "wave-field",
    ambience: "wavefield",
    palette: { skyTop: "#000000", skyBottom: "#021a16", accent: "#7fffd4", glow: "#00ffbf", particle: "#7fffd4" },
    intensity: 0.85,
    haze: 0.2,
  },
  "lantern-dust": {
    id: "lantern-dust",
    ambience: "dust",
    palette: { skyTop: "#0a0806", skyBottom: "#2a1a0e", accent: "#ffc58a", glow: "#ff9d4d", particle: "#ffd7a8" },
    intensity: 0.4,
    haze: 0.6,
  },
};

/** Particle counts – tuned so "low" survives a budget phone. */
export const QUALITY_BUDGETS: Record<QualityTier, QualityBudget> = {
  low:    { petals: 40,  butterflies: 24,  wavefield: 4_000,  dust: 120 },
  medium: { petals: 90,  butterflies: 48, wavefield: 12_000, dust: 260 },
  high:   { petals: 160, butterflies: 90, wavefield: 25_000, dust: 480 },
};

export const FILM_LOOK: FilmLook = {
  grain: 0.06,
  vignette: 0.55,
  letterbox: true,
  aspect: 2.39,
  flicker: 0.02,
  timestamp: true,
};

/** Every ambience that can be crossfaded (implemented or not). */
export const AMBIENCE_IDS: AmbienceId[] = ["petals", "butterflies", "wavefield", "dust"];
