"use client";

import { useFrame } from "@react-three/fiber";
import { AMBIENCE_IDS, MOODS } from "../../data/mood.config";
import { actIndexAt, damp, localProgress, smoothstep } from "../../shared/math";
import { blendMoods } from "../lib/mood-blend";
import { useScene } from "../state/scene-context";

const CROSSFADE_LAMBDA = 2.2; // ~1.5s to settle

/** The single "clock" of the film: eases scroll, finds the active act, blends mood + ambience presence. */
export function JourneyDriver() {
  const { state } = useScene();

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05); // tab-switch spikes shouldn't teleport the camera
    const { acts } = state.journey;

    const prev = state.progress;
    state.progress = damp(state.progress, state.targetProgress, 4, dt);
    state.velocity = dt > 0 ? (state.progress - prev) / dt : 0;

    const idx = actIndexAt(acts, state.progress);
    const act = acts[idx];
    state.actLocal = localProgress(act, state.progress);
    if (idx !== state.actIndex) {
      state.actIndex = idx;
      state.notify();
    }

    // last third of an act melts into the next act's mood
    const next = acts[Math.min(idx + 1, acts.length - 1)];
    blendMoods(state.mood, MOODS[act.mood], MOODS[next.mood], smoothstep(0.65, 1, state.actLocal));

    // ambience crossfade: active one -> 1, everything else -> 0
    const active = MOODS[act.mood].ambience;
    const mounted: string[] = [];
    for (const id of AMBIENCE_IDS) {
      const target = id === active ? 1 : 0;
      let v = state.motion === 0 ? target : damp(state.presence[id], target, CROSSFADE_LAMBDA, dt);
      if (target === 0 && v < 0.01) v = 0;
      if (target === 1 && v > 0.99) v = 1;
      state.presence[id] = v;
      if (v > 0) mounted.push(id);
    }
    const key = mounted.join(",");
    if (key !== state.mountedKey) {
      state.mountedKey = key;
      state.notify();
    }
  });

  return null;
}
