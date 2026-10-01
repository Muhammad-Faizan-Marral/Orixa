import { MeshStandardMaterial } from "three";

type Opts = { emissive?: string; emissiveIntensity?: number; opacity?: number; roughness?: number };
const cache = new Map<string, MeshStandardMaterial>();

/** Shared flat-shaded material (same colour = same instance => kam draw state changes). */
export function flat(color: string, o: Opts = {}): MeshStandardMaterial {
  const key = `${color}|${o.emissive ?? ""}|${o.emissiveIntensity ?? 0}|${o.opacity ?? 1}|${o.roughness ?? 0.9}`;
  let m = cache.get(key);
  if (!m) {
    m = new MeshStandardMaterial({
      color,
      flatShading: true,
      roughness: o.roughness ?? 0.9,
      metalness: 0,
      emissive: o.emissive ?? "#000000",
      emissiveIntensity: o.emissiveIntensity ?? 0,
      transparent: (o.opacity ?? 1) < 1,
      opacity: o.opacity ?? 1,
    });
    cache.set(key, m);
  }
  return m;
}

export const C = {
  // Vintage / faded palette: saturation kam, warmth zyada
  asphalt: "#3a3733", white: "#efe4cf", cream: "#e3d2b0", red: "#c9553d", brown: "#59332e",
  rock: "#8a7863", grass: "#7a8f52", grassDark: "#5f7a45", glass: "#7fb0a6", steel: "#9a9486",
  amber: "#e9a94c", orange: "#e08a5c", navy: "#2f3a52",
} as const;