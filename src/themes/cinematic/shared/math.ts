import type { Act } from "../schema";

export const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));

export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Frame-rate independent easing toward target. */
export const damp = (cur: number, target: number, lambda: number, dt: number) =>
  cur + (target - cur) * (1 - Math.exp(-lambda * dt));

export function actIndexAt(acts: Act[], progress: number): number {
  for (let i = 0; i < acts.length; i++) if (progress < acts[i].range.end) return i;
  return acts.length - 1;
}

export function localProgress(act: Act, progress: number): number {
  const span = act.range.end - act.range.start;
  return span > 0 ? clamp((progress - act.range.start) / span) : 0;
}
