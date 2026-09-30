import type { WorldQuality } from "../../schema";

export type QualityPreset = {
  trees: number;
  flowers: number;
  clouds: number;
  stars: number;
  dpr: number;
  shadows: boolean;
  shadowMapSize: number;
  antialias: boolean;
};

export const QUALITY_PRESETS: Record<WorldQuality, QualityPreset> = {
  high:   { trees: 300, flowers: 350, clouds: 25, stars: 600, dpr: 2,   shadows: true,  shadowMapSize: 2048, antialias: true },
  medium: { trees: 200, flowers: 220, clouds: 18, stars: 300, dpr: 1.5, shadows: true,  shadowMapSize: 1024, antialias: true },
  low:    { trees: 100, flowers: 100, clouds: 12, stars: 150, dpr: 1,   shadows: false, shadowMapSize: 512,  antialias: false },
};

const ORDER: WorldQuality[] = ["low", "medium", "high"];

/** Device weak ho to requested quality se ek/do level neeche. Sirf client par call karo. */
export function pickQuality(requested: WorldQuality): WorldQuality {
  if (typeof window === "undefined") return requested;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const cores = nav.hardwareConcurrency ?? 8;
  const mem = nav.deviceMemory ?? 8;

  let drop = 0;
  if (coarse) drop += 1;
  if (cores <= 4) drop += 1;
  if (mem <= 4) drop += 1;

  const idx = Math.max(0, ORDER.indexOf(requested) - Math.min(drop, 2));
  return ORDER[idx];
}

export function isWebGLAvailable(): boolean {
  if (typeof document === "undefined") return true;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}