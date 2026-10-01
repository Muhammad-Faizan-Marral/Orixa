import { Color } from "three";
import type { MoodPreset } from "../../schema";
import type { BlendedMood } from "../state/journey-state";

const a = new Color();
const b = new Color();

function mix(out: Color, from: string, to: string, t: number) {
  a.set(from);
  b.set(to);
  out.copy(a).lerp(b, t);
}

/** Writes lerp(from, to, t) into `out` (no allocations per frame). */
export function blendMoods(out: BlendedMood, from: MoodPreset, to: MoodPreset, t: number) {
  mix(out.skyTop, from.palette.skyTop, to.palette.skyTop, t);
  mix(out.skyBottom, from.palette.skyBottom, to.palette.skyBottom, t);
  mix(out.accent, from.palette.accent, to.palette.accent, t);
  mix(out.glow, from.palette.glow, to.palette.glow, t);
  mix(out.particle, from.palette.particle, to.palette.particle, t);
  out.intensity = from.intensity + (to.intensity - from.intensity) * t;
  out.haze = from.haze + (to.haze - from.haze) * t;
}
