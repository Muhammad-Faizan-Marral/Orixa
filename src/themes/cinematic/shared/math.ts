import type { Act } from "../schema";

/**
 * Longest frame step (seconds) the film simulation will take.
 * Unchanged behaviour at >= 20 fps (frames are < 0.05s). Below that the old 0.05 cap turned
 * low FPS into slow motion (10 fps = 50% speed, 2 fps = 10%) which reads as "frozen";
 * 0.1 keeps real-time pacing down to 10 fps while still stopping tab-switch spikes.
 */
export const MAX_FRAME_DT = 0.1;

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
