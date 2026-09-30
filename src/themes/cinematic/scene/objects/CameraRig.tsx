"use client";

import { useFrame } from "@react-three/fiber";
import { damp } from "../lib/journey-math";
import { useScene } from "../state/scene-context";

/** Original camera (0,150,100). Bas pointer ke hisaab se halka parallax. */
export function CameraRig() {
  const { journey } = useScene();
  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const k = journey.reducedMotion ? 0 : 1;
    const cam = state.camera;
    cam.position.x = damp(cam.position.x, journey.pointer.x * 10 * k, 3, dt);
    cam.position.y = damp(cam.position.y, 150 + journey.pointer.y * 6 * k, 3, dt);
  });
  return null;
}