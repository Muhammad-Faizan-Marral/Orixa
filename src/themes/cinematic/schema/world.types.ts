/**
 * World / mood schema.
 * A "mood" = one atmospheric look (palette + ambient particle system).
 * The 4 ambiences are distilled from the 3 reference sketches:
 *   petals      -> cherry blossoms falling on dark water, ripples on touch-down
 *   butterflies -> GPGPU swarm drifting through a dusk sky
 *   wavefield   -> glowing line-terrain with particles rising off it (aquamarine on black)
 *   dust        -> slow warm light motes (quiet acts, projector-beam feel)
 */
export type AmbienceId = "petals" | "butterflies" | "wavefield" | "dust";

export type MoodId =
  | "petal-pond"
  | "butterfly-dusk"
  | "wave-field"
  | "lantern-dust";

export type Palette = {
  skyTop: string;
  skyBottom: string;
  accent: string;
  glow: string;
  /** Tint applied to particles of this mood */
  particle: string;
};

export type MoodPreset = {
  id: MoodId;
  ambience: AmbienceId;
  palette: Palette;
  /** 0..1 – how busy the ambience is */
  intensity: number;
  /** 0..1 – fog / haze amount */
  haze: number;
};

export type QualityTier = "low" | "medium" | "high";

/** Particle budgets per ambience per tier (GPU / battery safety). */
export type QualityBudget = Record<AmbienceId, number>;

/** The "old film" layer drawn over the whole experience (DOM/CSS, not WebGL). */
export type FilmLook = {
  grain: number; // 0..1
  vignette: number; // 0..1
  letterbox: boolean;
  aspect: number; // 2.39 = cinemascope
  flicker: number; // 0..1
  timestamp: boolean; // "REC ● 2024"-style corner stamp
};
