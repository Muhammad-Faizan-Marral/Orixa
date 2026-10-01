/** 3D world ki settings: palette, quality, controls. Sirf types, koi three.js import nahi. */

import type { StationMood } from "./station.types";

export type MoodPalette = {
  skyTop: string;
  skyBottom: string;
  fog: string;
  sun: string;
  ambient: string;
  land: string;
  /** fog distance [near, far] */
  fogRange: [number, number];
};

export type WorldQuality = "low" | "medium" | "high";

export type ControlMode = "mouse" | "touch" | "scroll" | "auto";

export type WorldSettings = {
  quality: WorldQuality;
  /** prefers-reduced-motion ya config.animations === false */
  reducedMotion: boolean;
  controls: ControlMode[];
  /** 1.0 = normal */
  planeSpeed: number;
};

export type MoodPalettes = Record<StationMood, MoodPalette>;