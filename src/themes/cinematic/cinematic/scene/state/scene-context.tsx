"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import type { CinematicModel } from "../../data";
import type { JourneyState } from "./journey-state";

type SceneValue = { model: CinematicModel; state: JourneyState };

const Ctx = createContext<SceneValue | null>(null);

export function SceneProvider({ value, children }: { value: SceneValue; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useScene(): SceneValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useScene must be used inside <SceneProvider>");
  return v;
}

/** Re-renders ONLY when the active act changes. */
export function useActiveActIndex(): number {
  const { state } = useScene();
  return useSyncExternalStore(state.subscribe, () => state.actIndex, () => 0);
}
