import type { MoodPalettes } from "../schema";

/** Har mood ka atmosphere. Journey ke saath sky/fog in palettes ke beech lerp hoga. */
export const MOOD_PALETTES: MoodPalettes = {
  // Vintage film look: dhoodhle, garam, thore faded rang (sepia / kodachrome jaisa)
  dawn: {
    skyTop: "#4a3f5c",
    skyBottom: "#e8b48a",
    fog: "#dcae8c",
    sun: "#f6cf9a",
    ambient: "#c7ad9a",
    land: "#5d6b4a",
    fogRange: [110, 880],
  },
  morning: {
    skyTop: "#7f9fb0",
    skyBottom: "#f0dcb4",
    fog: "#ead9b6",
    sun: "#fbe7b0",
    ambient: "#d9d2c0",
    land: "#74855a",
    fogRange: [130, 980],
  },
  noon: {
    skyTop: "#7aa2b8",
    skyBottom: "#efe3c4",
    fog: "#e8dcc0",
    sun: "#fff0c2",
    ambient: "#e4e0d2",
    land: "#7d8e5d",
    fogRange: [150, 1080],
  },
  golden: {
    skyTop: "#b8704a",
    skyBottom: "#f2c487",
    fog: "#e8b982",
    sun: "#f2a65a",
    ambient: "#e6c29a",
    land: "#8a8049",
    fogRange: [110, 940],
  },
  dusk: {
    skyTop: "#4a3a5e",
    skyBottom: "#d0707c",
    fog: "#a9667a",
    sun: "#e8806e",
    ambient: "#9a86a8",
    land: "#4d5646",
    fogRange: [100, 800],
  },
  night: {
    skyTop: "#080b1a",
    skyBottom: "#222a4a",
    fog: "#161c3a",
    sun: "#d8d2b8",
    ambient: "#6b72a0",
    land: "#202a3a",
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
