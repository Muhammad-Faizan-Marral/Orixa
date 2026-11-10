"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PCFShadowMap } from "three";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CinematicModel, WorldQuality } from "../schema";
import { World } from "./World";
import { createAtmosphere } from "./lib/atmosphere";
import { computePlacements } from "./landmarks/placement";
import { QUALITY_PRESETS, isWebGLAvailable, lowerQuality, resolveInitialQuality, storeQuality } from "./lib/quality";
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

/**
 * Runtime safety net: agar scene lagatar ~28fps se neeche chale to quality ek step neeche
 * (Canvas remount, same design). Sirf slow machines par trigger hota hai; capable GPU par kuch nahi badalta.
 */
function FrameGovernor({ onSlow }: { onSlow: (fps: number) => void }) {
  const a = useRef({ warm: 0, t: 0, n: 0, strikes: 0 });
  useEffect(() => {
    const reset = () => { a.current.t = 0; a.current.n = 0; a.current.strikes = 0; };
    document.addEventListener("visibilitychange", reset);
    return () => document.removeEventListener("visibilitychange", reset);
  }, []);
  useFrame((_, rawDt) => {
    const s = a.current;
    if (document.hidden) return;
    s.warm += rawDt;
    if (s.warm < 2) return; // shader compile / first frames
    s.t += Math.min(rawDt, 3);
    s.n += 1;
    if (s.t < 2) return;
    const fps = s.n / s.t;
    s.t = 0; s.n = 0;
    if (fps < 28) {
      if (++s.strikes >= 2) { s.strikes = 0; s.warm = 0; onSlow(fps); }
    } else s.strikes = 0;
  });
  return null;
}

export default function CinematicScene({ model, className }: Props) {
  // Client-only component (ssr:false) => initial state seedha sahi nikaalo. Pehle "high" Canvas mount hota
  // tha phir effect me remount: slow devices par 2x context + 2x shader compile.
  const [init] = useState(() => (isWebGLAvailable() ? resolveInitialQuality(model.world.quality) : "off"));
  const [quality, setQuality] = useState<WorldQuality>(init === "off" ? "low" : init);
  const [webgl, setWebgl] = useState(init !== "off");
  const [epoch, setEpoch] = useState(0); // context restore par remount

  const journey = useMemo(() => createJourneyState(model.world.reducedMotion), [model.world.reducedMotion]);
  const atmosphere = useMemo(() => createAtmosphere(), []);
  const placements = useMemo(() => computePlacements(model.stations), [model.stations]);

  useJourneyInputs(journey);

  useEffect(() => {
    // OS-level reduced motion (Windows "Animation effects" off bhi isi se true hota hai), live updates ke saath
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { journey.reducedMotion = model.world.reducedMotion || mq.matches; };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [model.world.reducedMotion, journey]);

  const qualityRef = useRef(quality);
  useEffect(() => { qualityRef.current = quality; }, [quality]);
  const onSlow = useCallback((fps: number) => {
    const next = lowerQuality(qualityRef.current);
    if (next !== qualityRef.current) {
      storeQuality(next);
      setQuality(next);
    } else if (fps < 12) {
      storeQuality("off");
      setWebgl(false); // lowest tier par bhi unusable: gradient fallback
    }
  }, []);

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
        key={`${quality}-${epoch}`} // quality badle ya context restore ho to canvas dobara
        shadows={preset.shadows ? { type: PCFShadowMap } : false}
        dpr={[1, preset.dpr]}
        camera={{ fov: 60, near: 1, far: 10000, position: [0, 150, 100] }}
        gl={{ antialias: preset.antialias, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          const el = gl.domElement;
          el.addEventListener("webglcontextlost", (e) => e.preventDefault(), false); // restore event aane do
          el.addEventListener("webglcontextrestored", () => setEpoch((n) => n + 1), false);
        }}
      >
        <FrameGovernor onSlow={onSlow} />
        {/* Context Canvas ke andar dobara provide karna zaroori hai (reconciler boundary) */}
        <SceneContext.Provider value={value}>
          <World />
        </SceneContext.Provider>
      </Canvas>
      <FilmLook />
    </div>
  );
}