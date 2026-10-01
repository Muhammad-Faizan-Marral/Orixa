"use client";

import { Canvas } from "@react-three/fiber";
import { PCFShadowMap } from "three";
import { useEffect, useMemo, useState } from "react";
import type { CinematicModel, WorldQuality } from "../schema";
import { World } from "./World";
import { createAtmosphere } from "./lib/atmosphere";
import { computePlacements } from "./landmarks/placement";
import { QUALITY_PRESETS, isWebGLAvailable, pickQuality } from "./lib/quality";
import { SceneContext, type SceneContextValue } from "./state/scene-context";
import { createJourneyState } from "./state/journey-state";
import { useJourneyInputs } from "./state/use-journey-inputs";

type Props = { model: CinematicModel; className?: string };

/** WebGL na ho to sirf mood-gradient (scene ke bina bhi page kaam kare) */
function GradientFallback({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{ position: "fixed", inset: 0, zIndex: 0, background: "linear-gradient(#2b2a5e, #f4a77b)" }}
    />
  );
}

export default function CinematicScene({ model, className }: Props) {
  const [quality, setQuality] = useState<WorldQuality>(model.world.quality);
  const [webgl, setWebgl] = useState(true);

  const journey = useMemo(() => createJourneyState(model.world.reducedMotion), [model.world.reducedMotion]);
  const atmosphere = useMemo(() => createAtmosphere(), []);
  const placements = useMemo(() => computePlacements(model.stations), [model.stations]);

  useJourneyInputs(journey);

  useEffect(() => {
    setQuality(pickQuality(model.world.quality));
    setWebgl(isWebGLAvailable());
    // OS-level reduced motion bhi respect karo
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) journey.reducedMotion = true;
  }, [model.world.quality, journey]);

  const preset = QUALITY_PRESETS[quality];
  const value: SceneContextValue = useMemo(
    () => ({ model, journey, atmosphere, placements, quality, preset }),
    [model, journey, atmosphere, placements, quality, preset],
  );

  if (!webgl) return <GradientFallback className={className} />;

  return (
    <div
      aria-hidden
      className={className}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <Canvas
        key={quality} // quality badle to canvas dobara (shadow/AA settings)
        shadows={preset.shadows ? { type: PCFShadowMap } : false}
        dpr={[1, preset.dpr]}
        camera={{ fov: 60, near: 1, far: 10000, position: [0, 150, 100] }}
        gl={{ antialias: preset.antialias, alpha: false, powerPreference: "high-performance" }}
      >
        {/* Context Canvas ke andar dobara provide karna zaroori hai (reconciler boundary) */}
        <SceneContext.Provider value={value}>
          <World />
        </SceneContext.Provider>
      </Canvas>
    </div>
  );
}