"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import type { Placement } from "./placement";
import { C, flat } from "./materials";
import { Placed } from "./parts/Placed";
import { useScene } from "../state/scene-context";
import { activeness } from "../lib/journey-math";

/** about -> "Control tower": radar ghoomta hai, top par red light blink karti hai. */
export function AboutTower({ placement }: { placement: Placement }) {
  const { journey } = useScene();
  const radar = useRef<Group>(null);
  const beacon = useRef<Mesh>(null);
  const glass = useRef<MeshStandardMaterial>(null);

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    if (radar.current && !journey.reducedMotion) radar.current.rotation.y += Math.min(dt, 0.05) * 1.6;
    if (beacon.current) beacon.current.visible = Math.sin(t * 3) > -0.2;
    if (glass.current) glass.current.emissiveIntensity = 0.1 + activeness(journey.progress, placement.progress, placement.width) * 0.9;
  });

  return (
    <Placed p={placement}>
      <mesh material={flat(C.steel)} position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[78, 18, 78]} />
      </mesh>
      <mesh material={flat(C.white)} position={[0, 71, 0]} castShadow>
        <cylinderGeometry args={[14, 19, 110, 8]} />
      </mesh>
      <mesh position={[0, 138, 0]} castShadow>
        <cylinderGeometry args={[30, 24, 24, 8]} />
        <meshStandardMaterial ref={glass} color={C.glass} emissive={C.glass} emissiveIntensity={0.1} flatShading transparent opacity={0.8} roughness={0.3} />
      </mesh>
      <mesh material={flat(C.red)} position={[0, 160, 0]} castShadow>
        <coneGeometry args={[33, 18, 8]} />
      </mesh>
      <mesh material={flat(C.white)} position={[0, 184, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 34, 5]} />
      </mesh>
      <mesh ref={beacon} material={flat(C.red, { emissive: "#ff2a1a", emissiveIntensity: 2 })} position={[0, 203, 0]}>
        <sphereGeometry args={[3.5, 8, 6]} />
      </mesh>
      <group ref={radar} position={[0, 173, 0]}>
        <mesh material={flat(C.steel)} position={[9, 0, 0]}>
          <boxGeometry args={[20, 2.4, 5]} />
        </mesh>
      </group>
    </Placed>
  );
}