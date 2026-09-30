"use client";

import type { EducationStation } from "../../schema";
import { ACCENT_CYCLE } from "../../data/world.config";
import { placementsOf, type Placement } from "./placement";
import { C, flat } from "./materials";
import { Placed } from "./parts/Placed";

/** education -> "Academy peak": har institution ek pahari, upar building aur jhanda. */
export function EducationPeaks({ station, placements }: { station: EducationStation; placements: Placement[] }) {
  const mine = placementsOf(placements, "education");
  return (
    <>
      {station.data.items.map((item, i) => {
        const flag = ACCENT_CYCLE[(i + 1) % ACCENT_CYCLE.length];
        return (
          <Placed key={item.id} p={mine[i]}>
            <mesh material={flat(C.rock)} position={[0, 26, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[8, 80, 62, 6]} />
            </mesh>
            <mesh material={flat(C.grass)} position={[0, 61, 0]} receiveShadow>
              <cylinderGeometry args={[22, 28, 6, 6]} />
            </mesh>
            {/* building */}
            <mesh material={flat(C.cream)} position={[0, 76, 0]} castShadow>
              <boxGeometry args={[34, 22, 24]} />
            </mesh>
            <mesh material={flat(C.navy)} position={[0, 95, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1.2, 1, 0.85]} castShadow>
              <coneGeometry args={[26, 16, 4]} />
            </mesh>
            {[-10, 0, 10].map((x) => (
              <mesh key={x} material={flat(C.white)} position={[x, 74, 12.5]}>
                <boxGeometry args={[3, 16, 3]} />
              </mesh>
            ))}
            {/* flag */}
            <mesh material={flat(C.white)} position={[22, 82, 0]}><cylinderGeometry args={[0.8, 0.8, 34, 5]} /></mesh>
            <mesh material={flat(flag, { emissive: flag, emissiveIntensity: 0.2 })} position={[29, 92, 0]}>
              <boxGeometry args={[14, 9, 1]} />
            </mesh>
          </Placed>
        );
      })}
    </>
  );
}