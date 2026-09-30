"use client";

import type { ReactNode } from "react";
import { SURFACE_RADIUS } from "../../lib/journey-math";

/**
 * Land gol hai, isliye lambi flat cheez (runway) ke kinare hawa me latak jate hain.
 * <Arc s={...}> child ko surface ke saath `s` units aage/peeche rakhta aur jhukata hai.
 * Sirf height=0 wale (zameen par) groups ke andar use karo.
 */
export function Arc({ s, z = 0, children }: { s: number; z?: number; children?: ReactNode }) {
  const d = s / SURFACE_RADIUS;
  return (
    <group
      position={[SURFACE_RADIUS * Math.sin(d), SURFACE_RADIUS * Math.cos(d) - SURFACE_RADIUS, z]}
      rotation={[0, 0, -d]}
    >
      {children}
    </group>
  );
}