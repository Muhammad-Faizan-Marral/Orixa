"use client";

import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import type { CinematicModel } from "../data";
import { Backdrop } from "./objects/Backdrop";
import { CameraRig } from "./objects/CameraRig";
import { JourneyDriver } from "./objects/JourneyDriver";
import { AmbienceHost } from "./objects/ambience";
import { detectQuality } from "./lib/quality";
import { CAMERA_BASE } from "./lib/world";
import { SceneProvider } from "./state/scene-context";
import { createJourneyState } from "./state/journey-state";
import { useJourneyInputs } from "./state/use-journey-inputs";

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

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas
        dpr={state.quality === "high" ? [1, 2] : [1, 1.5]}
        camera={{ fov: 50, near: 0.1, far: 120, position: [CAMERA_BASE.x, CAMERA_BASE.y, CAMERA_BASE.z] }}
        gl={{ antialias: state.quality !== "low", powerPreference: "high-performance", alpha: false }}
      >
        <SceneProvider value={{ model, state }}>
          <JourneyDriver />
          <Backdrop />
          <CameraRig />
          <AmbienceHost />
        </SceneProvider>
      </Canvas>
    </div>
  );
}
