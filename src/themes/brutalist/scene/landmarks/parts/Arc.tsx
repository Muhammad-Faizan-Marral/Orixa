
"use client";

import type { ReactNode } from "react";
import { SURFACE_RADIUS } from "../../lib/journey-math";

/**
 * Places content along the surface of the spherical world.
 *
 * WHY:
 * The world is curved, so long flat elements like runways,
 * roads, landmarks, and platforms should follow the surface
 * instead of floating above / clipping through the ground.
 *
 * HOW:
 * `s` = distance travelled along the surface.
 * The helper converts that distance into an angular offset
 * and positions + rotates the group so its local X-axis
 * follows the surface tangent.
 *
 * Coordinate model:
 *
 *                 surface tangent
 *                       →
 *                ┌───────────────
 *             .-´
 *          .-´
 *       .-´
 *    ●
 *
 * Only use this directly for objects that live on the
 * ground plane (`height = 0` world groups).
 */

const EPSILON = 1e-6;

type ArcProps = {
  /** Distance along the curved surface. */
  s: number;

  /** Lateral Z offset from the center line. */
  z?: number;

  /** Optional local Y lift for small surface details. */
  y?: number;

  /** Optional extra rotation around the local Z axis. */
  tilt?: number;

  /** Child content attached to the curved surface. */
  children?: ReactNode;
};

export function Arc({
  s,
  z = 0,
  y = 0,
  tilt = 0,
  children,
}: ArcProps) {
  /*
   * Prevent invalid values from producing NaN transforms.
   * This is especially useful when content is generated
   * dynamically from portfolio/config data.
   */
  const safeS = Number.isFinite(s) ? s : 0;
  const safeZ = Number.isFinite(z) ? z : 0;
  const safeY = Number.isFinite(y) ? y : 0;
  const safeTilt = Number.isFinite(tilt) ? tilt : 0;

  /*
   * Surface arc-length -> angle.
   *
   * Clamp only near zero to avoid meaningless floating-point
   * noise when s is extremely small.
   */
  const d =
    Math.abs(safeS) < EPSILON
      ? 0
      : safeS / SURFACE_RADIUS;

  /*
   * Surface position.
   *
   * X moves along the spherical arc.
   * Y rises/falls with the sphere.
   * Z remains the optional lateral offset used by the scene.
   */
  const x =
    SURFACE_RADIUS * Math.sin(d);

  const surfaceY =
    SURFACE_RADIUS * Math.cos(d) -
    SURFACE_RADIUS;

  /*
   * Tangent rotation.
   *
   * -d aligns the child's local forward direction
   * with the direction of travel around the surface.
   */
  const rotationZ =
    -d + safeTilt;

  return (
    <group
      position={[
        x,
        surfaceY + safeY,
        safeZ,
      ]}
      rotation={[
        0,
        0,
        rotationZ,
      ]}
    >
      {children}
    </group>
  );
}
