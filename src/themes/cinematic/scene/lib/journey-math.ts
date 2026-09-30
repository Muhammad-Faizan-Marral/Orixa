/** Journey ka maths: progress <-> world rotation <-> station angle. Koi three.js dependency nahi. */

/** Poori journey me land kitna ghoomti hai (radians). 270 degree. */
export const WORLD_ARC = Math.PI * 1.5;

export const WORLD_RADIUS = 600;
/** Trees/landmarks land ki surface se thora upar */
export const SURFACE_RADIUS = 605;
/** Land ka center neeche hai taake uski top surface y≈0 par aaye (original zip jaisa) */
export const WORLD_OFFSET_Y = -600;
/** Land ki lambai (z axis) 1700 => z ∈ [-850, 850] */
export const WORLD_HALF_LENGTH = 850;

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Frame-rate independent smoothing. lambda ~ 4..10 */
export const damp = (
  current: number,
  target: number,
  lambda: number,
  dt: number,
) => lerp(current, target, 1 - Math.exp(-lambda * dt));

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Original zip ka normalize(): v ko [vmin,vmax] me clamp karke [tmin,tmax] me map. */
export function mapRange(
  v: number,
  vmin: number,
  vmax: number,
  tmin: number,
  tmax: number,
): number {
  const nv = clamp(v, vmin, vmax);
  return tmin + ((nv - vmin) / (vmax - vmin)) * (tmax - tmin);
}

/** Deterministic PRNG (Math.random ki jagah) */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Land ki rotation.z jab journey progress = p */
export const worldRotation = (progress: number) => progress * WORLD_ARC;

/**
 * Land ke local space me station ka angle.
 * Jab progress == station.range.center, ye landmark bilkul plane ke neeche/samne (top, π/2) par hoga.
 */
export const stationAngle = (center: number) =>
  Math.PI / 2 - center * WORLD_ARC;

/** Land surface par angle+z se local position (landmarks ke liye) */
export function surfacePoint(
  angle: number,
  z: number,
  radius = SURFACE_RADIUS,
) {
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    z,
    rotationZ: angle - Math.PI / 2,
  };
}
