import type { MoodPalettes } from "../schema";

/** Har mood ka atmosphere. Journey ke saath sky/fog in palettes ke beech lerp hoga. */
export const MOOD_PALETTES: MoodPalettes = {
  dawn: {
    skyTop: "#2b2a5e",
    skyBottom: "#f4a77b",
    fog: "#e9a583",
    sun: "#ffd2a1",
    ambient: "#b9a3c9",
    land: "#3f6b5a",
    fogRange: [120, 900],
  },
  morning: {
    skyTop: "#5aa7e0",
    skyBottom: "#f9e4b7",
    fog: "#f2e2bd",
    sun: "#fff1b8",
    ambient: "#cfd8e6",
    land: "#4f8a5b",
    fogRange: [140, 1000],
  },
  noon: {
    skyTop: "#3b8fe0",
    skyBottom: "#bfe6ff",
    fog: "#cfeaff",
    sun: "#fffbe0",
    ambient: "#e6f1ff",
    land: "#58985f",
    fogRange: [160, 1100],
  },
  golden: {
    skyTop: "#d77a4a",
    skyBottom: "#ffd28a",
    fog: "#f7c58a",
    sun: "#ffb347",
    ambient: "#f0c9a0",
    land: "#6a7f4a",
    fogRange: [120, 950],
  },
  dusk: {
    skyTop: "#3a2c64",
    skyBottom: "#e0678b",
    fog: "#b9577f",
    sun: "#ff7a7a",
    ambient: "#9a86c2",
    land: "#3a4a5e",
    fogRange: [100, 800],
  },
  night: {
    skyTop: "#05081c",
    skyBottom: "#1b2250",
    fog: "#0e1438",
    sun: "#cfd8ff",
    ambient: "#5a6aa8",
    land: "#16223a",
    fogRange: [80, 700],
  },
};

/** Projects / certificates ke liye rang cycle (original zip ke Colors se inspired). */
export const ACCENT_CYCLE = [
  "#f25346", // red
  "#68c3c0", // blue
  "#edeb27", // yellow
  "#f5986e", // pink
  "#8b5cf6", // purple
  "#629265", // light green
] as const;
