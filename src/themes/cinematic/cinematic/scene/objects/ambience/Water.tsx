"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh, MeshBasicMaterial } from "three";
import { WATER_Y } from "../../lib/world";
import { useScene } from "../../state/scene-context";

/** Dark still pond. Far water dissolves into the fog = soft horizon. Fades with ambience presence. */
export function Water() {
  const { state } = useScene();
  const mesh = useRef<Mesh>(null);
  const mat = useRef<MeshBasicMaterial>(null);

  useFrame(() => {
    const pres = state.presence.petals;
    if (mesh.current) mesh.current.visible = pres > 0.005;
    if (mat.current) {
      mat.current.color.copy(state.mood.skyBottom).multiplyScalar(0.55);
      mat.current.opacity = pres;
    }
  });

  return (
    <mesh ref={mesh} rotation-x={-Math.PI / 2} position-y={WATER_Y} renderOrder={1}>
      <planeGeometry args={[120, 120]} />
      <meshBasicMaterial ref={mat} fog transparent depthWrite={false} />
    </mesh>
  );
}
