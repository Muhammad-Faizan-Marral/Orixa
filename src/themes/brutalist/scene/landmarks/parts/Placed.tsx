"use client";

import type { ReactNode } from "react";
import { SURFACE_RADIUS, surfacePoint } from "../../lib/journey-math";
import type { Placement } from "../placement";

/**
 * Places a child group directly on the journey surface.
 *
 * Local +Y represents "up" from the surface.
 * The actual world position and rotation are calculated
 * from the placement's angle, height and z values.
 */
export function Placed({
  p,
  children,
}: {
  p?: Placement;
  children?: ReactNode;
}) {
  // Gracefully skip rendering when a placement is unavailable.
  if (!p) return null;

  const radius = SURFACE_RADIUS + p.height;

  const pt = surfacePoint(p.angle, p.z, radius);

  return (
    <group
      position={[pt.x, pt.y, pt.z]}
      rotation={[0, 0, pt.rotationZ]}
    >
      {children}
    </group>
  );
}