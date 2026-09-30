"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { CertificateItem, CertificatesStation } from "../../schema";
import { placementsOf, type Placement } from "./placement";
import { C, flat } from "./materials";
import { Placed } from "./parts/Placed";
import { activeness } from "../lib/journey-math";
import { useScene } from "../state/scene-context";

function Balloon({
  item,
  placement,
}: {
  item: CertificateItem;
  placement: Placement;
}) {
  const { journey } = useScene();
  const ref = useRef<Group>(null);

  useFrame((s) => {
    const g = ref.current;
    if (!g) return;
    const t = journey.reducedMotion ? 0 : s.clock.elapsedTime;
    const a = activeness(
      journey.progress,
      placement.progress,
      placement.width * 1.2,
    );
    g.position.y = Math.sin(t * 0.8 + item.seed * 6.28) * 6;
    g.rotation.z = Math.sin(t * 0.6 + item.seed * 3) * 0.05;
    g.scale.setScalar(1 + a * 0.15);
  });

  return (
    <Placed p={placement}>
      <group ref={ref}>
        <mesh
          material={flat(item.accent, {
            emissive: item.accent,
            emissiveIntensity: 0.12,
          })}
          position={[0, 12, 0]}
          scale={[1, 1.2, 1]}
          castShadow
        >
          <icosahedronGeometry args={[26, 1]} />
        </mesh>
        <mesh
          material={flat(C.white)}
          position={[0, 12, 0]}
          scale={[1.02, 0.35, 1.02]}
        >
          <icosahedronGeometry args={[26, 1]} />
        </mesh>
        <mesh material={flat(C.brown)} position={[0, -34, 0]} castShadow>
          <boxGeometry args={[12, 9, 12]} />
        </mesh>
        {[-1, 1].map((d) => (
          <mesh
            key={d}
            material={flat(C.brown)}
            position={[d * 5, -16, 0]}
            rotation={[0, 0, d * 0.28]}
          >
            <cylinderGeometry args={[0.5, 0.5, 26, 4]} />
          </mesh>
        ))}
      </group>
    </Placed>
  );
}

/** certificates -> "Balloon field": har certificate ek hot-air balloon. */
export function CertificatesBalloons({
  station,
  placements,
}: {
  station: CertificatesStation;
  placements: Placement[];
}) {
  const mine = placementsOf(placements, "certificates");
  return (
    <>
      {station.data.items.map((item, i) => (
        <Balloon key={item.id} item={item} placement={mine[i]} />
      ))}
    </>
  );
}
