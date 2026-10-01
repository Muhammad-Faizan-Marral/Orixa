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
/** Purani film jaisa look: warm tint + grain + vignette. Sirf CSS, GPU par halka. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

function FilmLook() {
  const layer = { position: "absolute", inset: 0, pointerEvents: "none" } as const;
  return (
    <>
      {/* garam sepia tint */}
      <div style={{ ...layer, background: "rgba(196,138,76,0.14)", mixBlendMode: "soft-light" }} />
      {/* film grain */}
      <div style={{ ...layer, backgroundImage: GRAIN, backgroundSize: "220px 220px", opacity: 0.16, mixBlendMode: "overlay" }} />
      {/* vignette */}
      <div
        style={{
          ...layer,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(34,16,6,0.5) 100%)",
        }}
      />
    </>
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
      <FilmLook />
    </div>
  );
}