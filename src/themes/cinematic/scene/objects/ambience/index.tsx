"use client";

import { useSyncExternalStore, type ComponentType } from "react";
import type { AmbienceId } from "../../../schema";
import { useScene } from "../../state/scene-context";
import { ButterflySwarm } from "./ButterflySwarm";
import { LanternDust } from "./LanternDust";
import { PetalPond } from "./PetalPond";

/** Registry. Missing ids render nothing (sky/fog still blend) until implemented. */
export const AMBIENCES: Partial<Record<AmbienceId, ComponentType>> = {
  petals: PetalPond,
  butterflies: ButterflySwarm,
  dust: LanternDust,
  // wavefield: WaveField,  // next
};

/**
 * Mounts every ambience that still has presence > 0, so the outgoing one
 * fades while the incoming one fades in. Each component reads
 * state.presence[id] itself (scale / opacity) – no props, no re-render per frame.
 */
export function AmbienceHost() {
  const { state } = useScene();
  const key = useSyncExternalStore(state.subscribe, () => state.mountedKey, () => state.mountedKey);
  return (
    <>
      {key
        .split(",")
        .filter(Boolean)
        .map((id) => {
          const Comp = AMBIENCES[id as AmbienceId];
          return Comp ? <Comp key={id} /> : null;
        })}
    </>
  );
}