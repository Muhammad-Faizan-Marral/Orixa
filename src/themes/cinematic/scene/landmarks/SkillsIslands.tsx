"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { SkillNode, SkillsStation } from "../../schema";
import { placementsOf, type Placement } from "./placement";
import { C, flat } from "./materials";
import { Placed } from "./parts/Placed";
import { activeness } from "../lib/journey-math";
import { useScene } from "../state/scene-context";

const SIZE = { core: 30, strong: 22, familiar: 15 } as const;

function Island({ node, placement }: { node: SkillNode; placement: Placement }) {
  const { journey } = useScene();
  const ref = useRef<Group>(null);
  const r = SIZE[node.tier];

  useFrame((s) => {
    const g = ref.current;
    if (!g) return;
    const a = activeness(journey.progress, placement.progress, placement.width * 1.5);
    g.position.y = journey.reducedMotion ? 0 : Math.sin(s.clock.elapsedTime * 0.8 + node.seed * 6.28) * 4;
    g.scale.setScalar(1 + a * 0.18);
    g.rotation.y = journey.reducedMotion ? 0 : s.clock.elapsedTime * 0.1 + node.seed * 6;
  });

  return (
    <Placed p={placement}>
      <group ref={ref}>
        <mesh material={flat(C.grass)} position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[r, r * 0.92, 4, 7]} />
        </mesh>
        <mesh material={flat(C.rock)} position={[0, -r * 0.6 - 2, 0]} castShadow>
          <cylinderGeometry args={[r * 0.92, r * 0.12, r * 1.2, 7]} />
        </mesh>

        {node.tier === "core" && (
          <group position={[0, 2, 0]}>
            <mesh material={flat(C.brown)} position={[0, 7, 0]}><boxGeometry args={[5, 14, 5]} /></mesh>
            <mesh material={flat(C.grassDark)} position={[0, 26, 0]} castShadow><coneGeometry args={[14, 28, 5]} /></mesh>
          </group>
        )}
        {node.tier === "strong" && (
          <mesh material={flat(C.glass, { emissive: C.glass, emissiveIntensity: 0.35 })} position={[0, 12, 0]} castShadow>
            <octahedronGeometry args={[9, 0]} />
          </mesh>
        )}
        {node.tier === "familiar" && (
          <mesh material={flat(C.grassDark)} position={[0, 5, 0]}><coneGeometry args={[5, 9, 4]} /></mesh>
        )}
      </group>
    </Placed>
  );
}

/** skills -> "Sky islands": tier ke hisaab se bara/chhota island, top par tree / crystal / tuft. */
export function SkillsIslands({ station, placements }: { station: SkillsStation; placements: Placement[] }) {
  const mine = placementsOf(placements, "skills");
  return (
    <>
      {station.data.nodes.map((node, i) => (
        <Island key={node.id} node={node} placement={mine[i]} />
      ))}
    </>
  );
}