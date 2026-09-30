"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, MeshStandardMaterial } from "three";
import { WORLD_OFFSET_Y, WORLD_RADIUS, worldRotation } from "../lib/journey-math";
import { useScene } from "../state/scene-context";

/**
 * Ghoomti hui zameen. Rotation = scroll progress.
 * Landmarks/Forest `children` ke taur par isi group ke andar rakho taake land ke saath ghoomein.
 */
export function Land({ children }: { children?: ReactNode }) {
  const { journey, atmosphere } = useScene();
  const spin = useRef<Group>(null);
  const mat = useRef<MeshStandardMaterial>(null);

  useFrame(() => {
    if (spin.current) spin.current.rotation.z = worldRotation(journey.progress);
    mat.current?.color.copy(atmosphere.land);
  });

  return (
    <group ref={spin} position={[0, WORLD_OFFSET_Y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[WORLD_RADIUS, WORLD_RADIUS, 1700, 40, 10]} />
        <meshStandardMaterial ref={mat} color="#629265" flatShading roughness={1} />
      </mesh>
      {children}
    </group>
  );
}