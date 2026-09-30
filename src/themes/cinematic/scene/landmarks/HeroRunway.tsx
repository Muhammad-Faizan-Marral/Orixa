"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { Placement } from "./placement";
import { C, flat } from "./materials";
import { Placed } from "./parts/Placed";
import { Arc } from "./parts/Arc";
import { RunwayStrip } from "./parts/RunwayStrip";
import { useScene } from "../state/scene-context";

/** hero -> "Takeoff": runway + hangar + windsock. Progress 0 par plane isi ke upar hota hai. */
export function HeroRunway({ placement }: { placement: Placement }) {
  const { journey } = useScene();
  const sock = useRef<Group>(null);
  useFrame((s) => {
    if (sock.current && !journey.reducedMotion) sock.current.rotation.y = Math.sin(s.clock.elapsedTime * 1.3) * 0.35;
  });

  return (
    <Placed p={placement}>
      <RunwayStrip length={520} width={56} />

      {/* hangar, runway ke peeche */}
      <Arc s={-120} z={-95}>
        <mesh material={flat(C.cream)} position={[0, 12, 0]} castShadow receiveShadow>
          <boxGeometry args={[80, 34, 52]} />
        </mesh>
        <mesh material={flat(C.red)} position={[0, 42, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1.25, 1, 0.85]} castShadow>
          <coneGeometry args={[42, 22, 4]} />
        </mesh>
        <mesh material={flat(C.navy)} position={[41, 8, 0]}>
          <boxGeometry args={[1, 24, 34]} />
        </mesh>
      </Arc>

      {/* windsock */}
      <Arc s={150} z={-58}>
        <mesh material={flat(C.white)} position={[0, 20, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 50, 6]} />
        </mesh>
        <group ref={sock} position={[0, 44, 0]}>
          <mesh material={flat(C.orange)} position={[9, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[6, 20, 8, 1, true]} />
          </mesh>
        </group>
      </Arc>
    </Placed>
  );
}