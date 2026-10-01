/**
 * Placement = land par kisi landmark/item ki jagah. Pure data, three.js nahi.
 * Landmarks aur Forest (trees ke liye clearing) dono isi ko use karte hain.
 */
import type { CinematicStation, StationId } from "../../schema";
import { SURFACE_RADIUS, stationAngle } from "../lib/journey-math";

export type Placement = {
  stationId: StationId;
  index: number;
  count: number;
  /** journey progress jab ye item plane ke bilkul samne aata hai */
  progress: number;
  /** is item ka progress-width (glow/active window) */
  width: number;
  /** land ke local space me angle */
  angle: number;
  z: number;
  /** surface se upar (floating cheezon ke liye) */
  height: number;
  /** ground clearing (world units): trees/flowers hataane ke liye. 0 = koi nahi */
  clearX: number;
  clearZ: number;
};

type Spec = { z: number; height: number; clearX: number; clearZ: number };

/** Plane z = -250. Landmarks ya to plane ke raaste par (z=-250) ya peeche (z<-300). */
const SPEC: Record<StationId, Spec> = {
  hero:         { z: -250, height: 0,   clearX: 290, clearZ: 75 },
  about:        { z: -340, height: 0,   clearX: 70,  clearZ: 60 },
  skills:       { z: -250, height: 0,   clearX: 0,   clearZ: 0 },   // per-node override
  projects:     { z: -250, height: 105, clearX: 30,  clearZ: 30 },
  experience:   { z: -330, height: 0,   clearX: 45,  clearZ: 45 },
  education:    { z: -370, height: 0,   clearX: 95,  clearZ: 95 },
  certificates: { z: -330, height: 90,  clearX: 0,   clearZ: 0 },   // per-item override
  contact:      { z: -250, height: 0,   clearX: 290, clearZ: 75 },
};

function itemCount(s: CinematicStation): number {
  switch (s.id) {
    case "skills": return s.data.nodes.length;
    case "projects":
    case "experience":
    case "education":
    case "certificates": return s.data.items.length;
    default: return 1;
  }
}

export function computePlacements(stations: readonly CinematicStation[]): Placement[] {
  const out: Placement[] = [];
  for (const s of stations) {
    const n = itemCount(s);
    const spec = SPEC[s.id];
    const span = s.range.end - s.range.start;

    for (let k = 0; k < n; k++) {
      // hero: takeoff (start), contact: landing (end), about: center, baaqi: range me barabar taqseem
      let progress = s.range.start + ((k + 0.5) / n) * span;
      if (s.id === "hero") progress = s.range.start;
      else if (s.id === "contact") progress = s.range.end;
      else if (s.id === "about") progress = s.range.center;

      let z = spec.z;
      let height = spec.height;
      if (s.id === "skills") {
        const seed = s.data.nodes[k].seed;
        z = -250 + (k % 2 === 0 ? -(90 + seed * 260) : 70 + seed * 40);
        height = 60 + seed * 130;
      } else if (s.id === "certificates") {
        const seed = s.data.items[k].seed;
        z = -320 - seed * 70;
        height = 80 + seed * 70;
      }

      out.push({
        stationId: s.id, index: k, count: n, progress,
        width: Math.max(span / n, 0.02),
        angle: stationAngle(progress),
        z, height, clearX: spec.clearX, clearZ: spec.clearZ,
      });
    }
  }
  return out;
}

export const placementsOf = <Id extends StationId>(all: Placement[], id: Id) =>
  all.filter((p) => p.stationId === id);

/** Is (angle, z) par tree/flower hataana hai? */
export function isCleared(angle: number, z: number, placements: readonly Placement[]): boolean {
  for (const p of placements) {
    if (p.clearX <= 0) continue;
    if (Math.abs(z - p.z) > p.clearZ) continue;
    let d = (angle - p.angle) % (Math.PI * 2);
    if (d > Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;
    if (Math.abs(d) * SURFACE_RADIUS < p.clearX) return true;
  }
  return false;
}