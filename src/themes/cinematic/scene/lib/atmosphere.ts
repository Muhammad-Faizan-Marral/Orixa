import { Color } from "three";
import type { MoodPalette, StationMood } from "../../schema";
import { MOOD_PALETTES } from "../../data/world.config";
import { clamp, lerp, smoothstep } from "./journey-math";

/** Mutable sample: har frame isi object ko overwrite karte hain (garbage nahi banta). */
export type AtmosphereSample = {
  skyTop: Color;
  skyBottom: Color;
  fog: Color;
  sun: Color;
  ambient: Color;
  land: Color;
  fogNear: number;
  fogFar: number;
  sunY: number;
  /** 0..1 (raat me 1) */
  stars: number;
};

export const createAtmosphere = (): AtmosphereSample => ({
  skyTop: new Color(), skyBottom: new Color(), fog: new Color(),
  sun: new Color(), ambient: new Color(), land: new Color(),
  fogNear: 120, fogFar: 950, sunY: -30, stars: 0,
});

/** Sun ki height (world y) mood ke hisaab se. Original zip me -30. */
const SUN_Y: Record<StationMood, number> = {
  dawn: -200, morning: -80, noon: 40, golden: -110, dusk: -230, night: -520,
};

type Colors = Record<Exclude<keyof MoodPalette, "fogRange">, Color>;
let cache: Record<StationMood, Colors> | null = null;

function paletteColors(): Record<StationMood, Colors> {
  if (cache) return cache;
  const out = {} as Record<StationMood, Colors>;
  (Object.keys(MOOD_PALETTES) as StationMood[]).forEach((mood) => {
    const p = MOOD_PALETTES[mood];
    out[mood] = {
      skyTop: new Color(p.skyTop), skyBottom: new Color(p.skyBottom), fog: new Color(p.fog),
      sun: new Color(p.sun), ambient: new Color(p.ambient), land: new Color(p.land),
    };
  });
  cache = out;
  return out;
}

type StationLike = { mood: StationMood; range: { center: number } };

/**
 * Progress par do qareeb stations ke mood palettes blend karo.
 * Station ke center ke aas-paas mood "hold" hota hai, beech me smooth transition.
 */
export function sampleAtmosphere(stations: readonly StationLike[], progress: number, out: AtmosphereSample) {
  if (!stations.length) return out;
  const colors = paletteColors();
  const p = clamp(progress, 0, 1);

  let a = stations[0];
  let b = stations[0];
  let t = 0;
  if (p >= stations[stations.length - 1].range.center) {
    a = b = stations[stations.length - 1];
  } else if (p > stations[0].range.center) {
    for (let i = 0; i < stations.length - 1; i++) {
      const s0 = stations[i], s1 = stations[i + 1];
      if (p >= s0.range.center && p <= s1.range.center) {
        a = s0; b = s1;
        t = smoothstep(0.25, 0.75, (p - s0.range.center) / (s1.range.center - s0.range.center || 1));
        break;
      }
    }
  }

  const ca = colors[a.mood], cb = colors[b.mood];
  out.skyTop.lerpColors(ca.skyTop, cb.skyTop, t);
  out.skyBottom.lerpColors(ca.skyBottom, cb.skyBottom, t);
  out.fog.lerpColors(ca.fog, cb.fog, t);
  out.sun.lerpColors(ca.sun, cb.sun, t);
  out.ambient.lerpColors(ca.ambient, cb.ambient, t);
  out.land.lerpColors(ca.land, cb.land, t);

  const fa = MOOD_PALETTES[a.mood].fogRange, fb = MOOD_PALETTES[b.mood].fogRange;
  out.fogNear = lerp(fa[0], fb[0], t);
  out.fogFar = lerp(fa[1], fb[1], t);
  out.sunY = lerp(SUN_Y[a.mood], SUN_Y[b.mood], t);

  const lum = 0.2126 * out.skyTop.r + 0.7152 * out.skyTop.g + 0.0722 * out.skyTop.b;
  out.stars = 1 - smoothstep(0.004, 0.05, lum);
  return out;
}