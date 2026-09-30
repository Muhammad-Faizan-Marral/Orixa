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
  asphalt: "#2b2f3a", white: "#f1ece4", cream: "#eadfc8", red: "#f25346", brown: "#59332e",
  rock: "#7a6a5a", grass: "#629265", grassDark: "#458248", glass: "#68c3c0", steel: "#8a94a6",
  amber: "#ffb347", orange: "#f5986e", navy: "#23305a",
} as const;