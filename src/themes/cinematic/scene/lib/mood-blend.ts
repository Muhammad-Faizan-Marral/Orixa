import { Color } from "three";
import type { MoodPreset } from "../../schema";
import type { BlendedMood } from "../state/journey-state";

/**
 * Palette hex strings are parsed ONCE and cached. Previously every frame ran
 * Color.set(string) (regex + colour-space conversion) 10x => ~600 parses/s of pure garbage.
 * Output is bit-identical: same Color values, same lerp.
 */
const parsed = new Map<string, Color>();
const hex = (s: string): Color => {
  let c = parsed.get(s);
  if (!c) {
    c = new Color(s);
    parsed.set(s, c);
  }
  return c;
};

function mix(out: Color, from: string, to: string, t: number) {
  out.copy(hex(from)).lerp(hex(to), t);
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
