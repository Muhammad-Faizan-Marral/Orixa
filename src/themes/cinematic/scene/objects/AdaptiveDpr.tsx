"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

const WARMUP_S = 3; // shader compiles + hero intro happen here; don't judge it
const WINDOW_S = 2; // measure this long before deciding
const MIN_FPS = 24; // below this the film reads as "stuck"
const COOLDOWN_S = 2.5; // let a resolution change take effect before re-measuring

/**
 * Runtime safety net. Quality tier is picked from CPU cores / RAM only, which says nothing
 * about the GPU. If the measured frame rate stays under MIN_FPS this walks the canvas
 * resolution cap down `ladder` (one rung per measurement). On healthy machines it never
 * fires, so look and quality are unchanged there.
 */
export function AdaptiveDpr({ onStepDown }: { onStepDown: () => void }) {
  const warm = useRef(0);
  const acc = useRef({ t: 0, frames: 0, cool: 0 });

  // a hidden tab pauses rAF; the first frame back would otherwise poison the sample
  useEffect(() => {
    const reset = () => {
      acc.current.t = 0;
      acc.current.frames = 0;
    };
    document.addEventListener("visibilitychange", reset);
    return () => document.removeEventListener("visibilitychange", reset);
  }, []);

  useFrame((_, rawDt) => {
    const a = acc.current;
    if (warm.current < WARMUP_S) {
      warm.current += Math.min(rawDt, 1);
      return;
    }
    if (a.cool > 0) {
      a.cool -= Math.min(rawDt, 1);
      return;
    }
    a.t += Math.min(rawDt, 1);
    a.frames += 1;
    if (a.t >= WINDOW_S) {
      const fps = a.frames / a.t;
      a.t = 0;
      a.frames = 0;
      if (fps < MIN_FPS) {
        a.cool = COOLDOWN_S;
        onStepDown();
      }
    }
  });

  return null;
}
