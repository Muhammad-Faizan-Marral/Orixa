"use client";

import { Canvas } from "@react-three/fiber";
import { useCallback, useMemo, useState } from "react";
import type { CinematicModel } from "../data";
import { AdaptiveDpr } from "./objects/AdaptiveDpr";
import { Backdrop } from "./objects/Backdrop";
import { CameraRig } from "./objects/CameraRig";
import { JourneyDriver } from "./objects/JourneyDriver";
import { AmbienceHost } from "./objects/ambience";
import { detectQuality } from "./lib/quality";
import { CAMERA_BASE } from "./lib/world";
import { SceneBoundary } from "./SceneBoundary";
import { SceneProvider } from "./state/scene-context";
import { createJourneyState } from "./state/journey-state";
import { useJourneyInputs } from "./state/use-journey-inputs";

/** Canvas resolution cap, per tier (unchanged) + the rungs AdaptiveDpr may fall back through. */
const DPR_LADDER = [2, 1.5, 1.25, 1, 0.8];

/**
 * Fixed, full-screen, non-interactive stage. The page scrolls natively
 * (ThemePage gives it height = journey.totalScrollVh); this only reacts to it.
 */
export default function CinematicScene({ model }: { model: CinematicModel }) {
  const state = useMemo(
    () => createJourneyState(model.journey, detectQuality(), model.portfolio.flags.reducedMotion),
    [model],
  );
  useJourneyInputs(state);

  const tierMax = state.quality === "high" ? 2 : 1.5;
  const [dprMax, setDprMax] = useState(tierMax);
  const stepDown = useCallback(
    () => setDprMax((cur) => DPR_LADDER.find((r) => r < cur) ?? cur),
    [],
  );
  const dpr = useMemo<[number, number]>(() => [Math.min(1, dprMax), dprMax], [dprMax]);

  const value = useMemo(() => ({ model, state }), [model, state]);

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <SceneBoundary>
        <Canvas
          dpr={dpr}
          camera={{ fov: 50, near: 0.1, far: 120, position: [CAMERA_BASE.x, CAMERA_BASE.y, CAMERA_BASE.z] }}
          gl={{ antialias: state.quality !== "low", powerPreference: "high-performance", alpha: false }}
        >
          <SceneProvider value={value}>
            <JourneyDriver />
            <Backdrop />
            <CameraRig />
            <AmbienceHost />
            <AdaptiveDpr onStepDown={stepDown} />
          </SceneProvider>
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
