"use client";

import { createContext, useContext } from "react";
import type { CinematicModel, WorldQuality } from "../../schema";
import type { QualityPreset } from "../lib/quality";
import type { AtmosphereSample } from "../lib/atmosphere";
import type { JourneyState } from "./journey-state";

export type SceneContextValue = {
  model: CinematicModel;
  journey: JourneyState;
  atmosphere: AtmosphereSample;
  quality: WorldQuality;
  preset: QualityPreset;
};

export const SceneContext = createContext<SceneContextValue | null>(null);

export function useScene(): SceneContextValue {
  const ctx = useContext(SceneContext);
  if (!ctx) throw new Error("useScene() sirf <CinematicScene> ke andar use karo");
  return ctx;
}