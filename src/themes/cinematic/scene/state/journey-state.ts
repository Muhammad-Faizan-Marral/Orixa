import { Color } from "three";
import type { AmbienceId, Journey, QualityTier } from "../../schema";
import { AMBIENCE_IDS, MOODS } from "../../data/mood.config";

export type BlendedMood = {
  skyTop: Color;
  skyBottom: Color;
  accent: Color;
  glow: Color;
  particle: Color;
  intensity: number;
  haze: number;
};

/**
 * Mutable, per-scene state read inside useFrame (NO React re-renders per frame).
 * Only `actIndex` changes notify React (via subscribe) so ambience can swap.
 */
export type JourneyState = {
  journey: Journey;
  quality: QualityTier;
  /** 1 = full motion, 0 = reduced motion (static frame) */
  motion: number;
  /** raw scroll 0..1 (written by DOM listeners) */
  targetProgress: number;
  /** eased scroll 0..1 (written by JourneyDriver) */
  progress: number;
  /** progress units / second */
  velocity: number;
  actIndex: number;
  actLocal: number;
  pointerTarget: { x: number; y: number };
  pointer: { x: number; y: number };
  mood: BlendedMood;
  /** 0..1 per ambience; eased by JourneyDriver => crossfade between acts */
  presence: Record<AmbienceId, number>;
  /** comma list of ambiences currently mounted (presence > 0) */
  mountedKey: string;
  subscribe: (fn: () => void) => () => void;
  notify: () => void;
};

export function createJourneyState(journey: Journey, quality: QualityTier, reducedMotion: boolean): JourneyState {
  const listeners = new Set<() => void>();
  const first = MOODS[journey.acts[0].mood].palette;
  const m = MOODS[journey.acts[0].mood];
  const presence = Object.fromEntries(AMBIENCE_IDS.map((id) => [id, id === m.ambience ? 1 : 0])) as Record<AmbienceId, number>;

  return {
    journey,
    quality,
    motion: reducedMotion ? 0 : 1,
    targetProgress: 0,
    progress: 0,
    velocity: 0,
    actIndex: 0,
    actLocal: 0,
    pointerTarget: { x: 0, y: 0 },
    pointer: { x: 0, y: 0 },
    mood: {
      skyTop: new Color(first.skyTop),
      skyBottom: new Color(first.skyBottom),
      accent: new Color(first.accent),
      glow: new Color(first.glow),
      particle: new Color(first.particle),
      intensity: m.intensity,
      haze: m.haze,
    },
    presence,
    mountedKey: m.ambience,
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    notify() {
      listeners.forEach((fn) => fn());
    },
  };
}
