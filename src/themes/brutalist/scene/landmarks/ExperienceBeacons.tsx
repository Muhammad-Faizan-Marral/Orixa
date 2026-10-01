"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Group, MeshBasicMaterial, MeshStandardMaterial } from "three";
import type { ExperienceStation, TimelineItem } from "../../schema";
import { placementsOf, type Placement } from "./placement";
import { C, flat } from "./materials";
import { Placed } from "./parts/Placed";
import { activeness } from "../lib/journey-math";
import { useScene } from "../state/scene-context";

function Beacon({ item, placement }: { item: TimelineItem; placement: Placement }) {
  const { journey } = useScene();
  const beam = useRef<Group>(null);
  const lampMat = useMemo(
    () => new MeshStandardMaterial({ color: C.amber, emissive: C.amber, emissiveIntensity: 0.4, flatShading: true }),
    [],
  );
  const beamMat = useMemo(
    () => new MeshBasicMaterial({ color: C.amber, transparent: true, opacity: 0.12, blending: AdditiveBlending, depthWrite: false }),
    [],
  );

  const scale = item.current ? 1.35 : 1;

  useFrame((s, dt) => {
    const a = activeness(journey.progress, placement.progress, placement.width);
    lampMat.emissiveIntensity = 0.4 + a * 2.2 + (item.current ? 0.6 : 0);
    beamMat.opacity = 0.1 + a * 0.3;
    if (beam.current && !journey.reducedMotion) beam.current.rotation.y += Math.min(dt, 0.05) * (item.current ? 1.6 : 0.9);
  });

  return (
    <Placed p={placement}>
      <group scale={scale}>
        <mesh material={flat(C.white)} position={[0, 20, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[9, 14, 40, 8]} />
        </mesh>
        <mesh material={flat(C.red)} position={[0, 46, 0]} castShadow>
          <cylinderGeometry args={[7, 9, 14, 8]} />
        </mesh>
        <mesh material={flat(C.white)} position={[0, 60, 0]} castShadow>
          <cylinderGeometry args={[9, 7, 14, 8]} />
        </mesh>
        <mesh material={lampMat} position={[0, 76, 0]}>
          <icosahedronGeometry args={[9, 1]} />
        </mesh>
        <mesh material={flat(C.red)} position={[0, 91, 0]} castShadow>
          <coneGeometry args={[12, 14, 8]} />
        </mesh>
        <group ref={beam} position={[0, 76, 0]}>
          <mesh material={beamMat} position={[55, 0, 0]}>
            <boxGeometry args={[110, 8, 16]} />
          </mesh>
        </group>
        {item.current && (
          <group position={[0, 108, 0]}>
            <mesh material={flat(C.brown)} position={[0, 0, 0]}><cylinderGeometry args={[0.8, 0.8, 26, 5]} /></mesh>
            <mesh material={flat(C.red)} position={[7, 8, 0]}><boxGeometry args={[14, 8, 1]} /></mesh>
          </group>
        )}
      </group>
    </Placed>
  );
}

/** experience -> "Beacon trail": har job ek lighthouse. Current job bara hai aur jhanda lehrata hai. */
export function ExperienceBeacons({ station, placements }: { station: ExperienceStation; placements: Placement[] }) {
  const mine = placementsOf(placements, "experience");
  return (
    <>
      {station.data.items.map((item, i) => (
        <Beacon key={item.id} item={item} placement={mine[i]} />
      ))}
    </>
  );
}