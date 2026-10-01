
"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { Vector3 } from "three";

import { damp } from "../lib/journey-math";
import { useScene } from "../state/scene-context";

/* ============================================================
   CAMERA CONFIG
============================================================ */

/**
 * Base camera position.
 *
 * Keep this synchronized with the camera
 * passed into <CinematicScene />.
 */
const BASE = {
  x: 0,
  y: 140,
  z: 100,
};

/**
 * Main visual target.
 *
 * This keeps the horizon / aircraft area in frame
 * instead of looking toward the mathematical world origin.
 */
const LOOK = {
  x: 0,
  y: 185,
  z: -300,
};

/**
 * Motion strength.
 */
const PARALLAX = {
  x: 10,
  y: 6,
};

const LOOK_PARALLAX = {
  x: 18,
  y: 9,
};

const SMOOTH = 3.4;

/**
 * Very subtle cinematic camera breathing.
 */
const BREATH = {
  x: 1.4,
  y: 1.8,
};

const BREATH_SPEED = {
  x: 0.18,
  y: 0.22,
};

/**
 * Camera response to journey velocity.
 *
 * Kept deliberately small so the camera does not
 * feel like a game camera.
 */
const VELOCITY = {
  x: 3,
  y: 5,
  z: 8,
};

/**
 * How much the camera slightly compresses toward
 * the scene during faster scrolling.
 */
const VELOCITY_LOOK = 12;

/* ============================================================
   CAMERA RIG
============================================================ */

/**
 * Premium cinematic camera controller.
 *
 * Features:
 *
 * - Smooth pointer parallax
 * - Smooth look-target parallax
 * - Subtle camera breathing
 * - Small journey-velocity response
 * - Reduced-motion support
 * - No allocations inside useFrame
 *
 * Visual behavior:
 *
 * Pointer movement
 *       ↓
 * subtle camera shift
 *
 * Scroll movement
 *       ↓
 * tiny cinematic push
 *
 * Idle
 *       ↓
 * almost invisible breathing
 */
export function CameraRig() {
  const { journey } = useScene();

  /*
   * Reused target vector.
   *
   * Avoid creating a new Vector3 every frame.
   */
  const lookTarget = useMemo(
    () =>
      new Vector3(
        LOOK.x,
        LOOK.y,
        LOOK.z,
      ),
    [],
  );

  useFrame((state, rawDt) => {
    const dt = Math.min(
      rawDt,
      0.05,
    );

    const camera = state.camera;
    const time =
      state.clock.elapsedTime;

    const motion =
      journey.reducedMotion
        ? 0
        : 1;

    /* ========================================================
       POINTER
    ======================================================== */

    const pointerX =
      journey.pointer.x;

    const pointerY =
      journey.pointer.y;

    /*
     * Clamp pointer influence defensively.
     */
    const px = Math.max(
      -1,
      Math.min(1, pointerX),
    );

    const py = Math.max(
      -1,
      Math.min(1, pointerY),
    );

    /* ========================================================
       CINEMATIC BREATHING
    ======================================================== */

    const breathingX =
      journey.reducedMotion
        ? 0
        : Math.sin(
            time * BREATH_SPEED.x,
          ) *
          BREATH.x;

    const breathingY =
      journey.reducedMotion
        ? 0
        : Math.sin(
            time * BREATH_SPEED.y,
          ) *
          BREATH.y;

    /* ========================================================
       JOURNEY VELOCITY
    ======================================================== */

    /*
     * Clamp velocity so accidental spikes do not
     * throw the camera around.
     */
    const velocity = Math.max(
      -1,
      Math.min(
        1,
        journey.velocity,
      ),
    );

    const velocityX =
      velocity * VELOCITY.x * motion;

    const velocityY =
      velocity * VELOCITY.y * motion;

    const velocityZ =
      Math.abs(velocity) *
      VELOCITY.z *
      motion;

    /* ========================================================
       TARGET CAMERA POSITION
    ======================================================== */

    const targetX =
      BASE.x +
      px * PARALLAX.x * motion +
      breathingX +
      velocityX;

    const targetY =
      BASE.y +
      py * PARALLAX.y * motion +
      breathingY +
      velocityY;

    /*
     * Keep z stable but allow a tiny cinematic push
     * during motion.
     */
    const targetZ =
      BASE.z -
      velocityZ;

    /* ========================================================
       SMOOTH POSITION
    ======================================================== */

    camera.position.x = damp(
      camera.position.x,
      targetX,
      SMOOTH,
      dt,
    );

    camera.position.y = damp(
      camera.position.y,
      targetY,
      SMOOTH,
      dt,
    );

    camera.position.z = damp(
      camera.position.z,
      targetZ,
      SMOOTH,
      dt,
    );

    /* ========================================================
       DYNAMIC LOOK TARGET
    ======================================================== */

    /*
     * Pointer creates a larger visual parallax on the
     * look target than on the camera itself.
     *
     * This produces depth rather than merely translating
     * the entire frame.
     */
    const targetLookX =
      LOOK.x +
      px *
        LOOK_PARALLAX.x *
        motion;

    const targetLookY =
      LOOK.y +
      py *
        LOOK_PARALLAX.y *
        motion;

    /*
     * During faster journey movement, subtly move
     * the visual horizon forward.
     */
    const targetLookZ =
      LOOK.z -
      velocity *
        VELOCITY_LOOK *
        motion;

    lookTarget.x = damp(
      lookTarget.x,
      targetLookX,
      SMOOTH,
      dt,
    );

    lookTarget.y = damp(
      lookTarget.y,
      targetLookY,
      SMOOTH,
      dt,
    );

    lookTarget.z = damp(
      lookTarget.z,
      targetLookZ,
      SMOOTH,
      dt,
    );

    camera.lookAt(
      lookTarget.x,
      lookTarget.y,
      lookTarget.z,
    );
  });

  return null;
}
