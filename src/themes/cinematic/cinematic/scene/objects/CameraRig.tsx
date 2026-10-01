"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { Vector3 } from "three";
import { damp } from "../../shared/math";
import { CAMERA_BASE } from "../lib/world";
import { useScene } from "../state/scene-context";

/** Slow dolly forward with scroll + soft pointer parallax + idle "handheld" drift. */
export function CameraRig() {
  const { state } = useScene();
  const look = useMemo(() => new Vector3(), []);

  useFrame(({ camera, clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const k = state.motion;
    const t = clock.elapsedTime;
    const p = state.progress;

    state.pointer.x = damp(state.pointer.x, state.pointerTarget.x, 3, dt);
    state.pointer.y = damp(state.pointer.y, state.pointerTarget.y, 3, dt);

    camera.position.set(
      CAMERA_BASE.x + state.pointer.x * 0.7 * k + Math.sin(t * 0.13) * 0.12 * k,
      CAMERA_BASE.y + p * 1.2 + state.pointer.y * 0.25 * k + Math.sin(t * 0.17) * 0.06 * k,
      CAMERA_BASE.z - p * 3.5,
    );
    look.set(state.pointer.x * 0.6 * k, -0.6 + p * 0.8, -9);
    camera.lookAt(look);
  });

  return null;
}
