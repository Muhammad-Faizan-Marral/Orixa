import type { QualityTier } from "../../schema";

/** Cheap device sniff -> particle budget tier. Client only. */
export function detectQuality(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  if (mem <= 2 || cores <= 2) return "low";
  if (coarse || mem <= 4 || cores <= 4) return "medium";
  return "high";
}
