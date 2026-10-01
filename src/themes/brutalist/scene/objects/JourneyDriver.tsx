"use client";

import { useFrame } from "@react-three/fiber";
import { damp } from "../lib/journey-math";
import { sampleAtmosphere } from "../lib/atmosphere";
import { useScene } from "../state/scene-context";

/**
 * Har frame sab se pehle chalta hai (World me pehla child): progress ko ease karta hai
 * aur atmosphere sample update karta hai. Baaqi objects sirf read karte hain.
 */
export function JourneyDriver() {
  const { journey, model, atmosphere } = useScene();

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const prev = journey.progress;
    journey.progress = journey.reducedMotion
      ? journey.target
      : damp(journey.progress, journey.target, 5, dt);
    const v = dt > 0 ? (journey.progress - prev) / dt : 0;
    journey.velocity = damp(journey.velocity, v, 8, dt);
    sampleAtmosphere(model.stations, journey.progress, atmosphere);
  });

  return null;
}