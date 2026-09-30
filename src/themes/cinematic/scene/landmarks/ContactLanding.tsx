"use client";

import type { Placement } from "./placement";
import { C, flat } from "./materials";
import { Placed } from "./parts/Placed";
import { Arc } from "./parts/Arc";
import { RunwayStrip } from "./parts/RunwayStrip";

/** contact -> "Landing": roshan runway (chase lights) + terminal. Journey ka end (progress 1). */
export function ContactLanding({ placement }: { placement: Placement }) {
  return (
    <Placed p={placement}>
      <RunwayStrip length={520} width={56} lit />

      <Arc s={-40} z={-110}>
        <mesh material={flat(C.cream)} position={[0, 14, 0]} castShadow receiveShadow>
          <boxGeometry args={[120, 38, 44]} />
        </mesh>
        <mesh material={flat(C.glass, { emissive: C.glass, emissiveIntensity: 0.5, opacity: 0.85 })} position={[0, 18, 22.5]}>
          <boxGeometry args={[100, 18, 1]} />
        </mesh>
        <mesh material={flat(C.navy)} position={[0, 36, 0]} castShadow>
          <boxGeometry args={[128, 4, 52]} />
        </mesh>
      </Arc>

      {/* "H" pad ki jagah simple markers */}
      <Arc s={180} z={0}>
        <mesh material={flat(C.white)} position={[0, -2.9, 0]}>
          <boxGeometry args={[6, 0.4, 40]} />
        </mesh>
      </Arc>
    </Placed>
  );
}