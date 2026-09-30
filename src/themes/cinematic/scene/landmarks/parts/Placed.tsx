"use client";

import type { ReactNode } from "react";
import { SURFACE_RADIUS, surfacePoint } from "../../lib/journey-math";
import type { Placement } from "../placement";

/** Child ko land par placement ki jagah rakhta hai. Local +y = upar (surface se bahar). */
export function Placed({ p, children }: { p: Placement; children?: ReactNode }) {
  const pt = surfacePoint(p.angle, p.z, SURFACE_RADIUS + p.height);
  return (
    <group position={[pt.x, pt.y, pt.z]} rotation={[0, 0, pt.rotationZ]}>
      {children}
    </group>
  );
}