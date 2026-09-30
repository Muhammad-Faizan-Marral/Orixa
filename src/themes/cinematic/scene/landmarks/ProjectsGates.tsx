"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Group, MeshBasicMaterial, MeshStandardMaterial } from "three";
import type { ProjectItem, ProjectsStation } from "../../schema";
import { placementsOf, type Placement } from "./placement";
import { C, flat } from "./materials";
import { Placed } from "./parts/Placed";
import { activeness } from "../lib/journey-math";
import { useScene } from "../state/scene-context";

const RING_R = 55;

function Gate({ item, placement }: { item: ProjectItem; placement: Placement }) {
  const { journey } = useScene();
  const group = useRef<Group>(null);

  const ringMat = useMemo(
    () => new MeshStandardMaterial({ color: item.accent, emissive: item.accent, emissiveIntensity: 0.15, flatShading: true, roughness: 0.6 }),
    [item.accent],
  );
  const discMat = useMemo(
    () => new MeshBasicMaterial({ color: item.accent, transparent: true, opacity: 0.06, side: DoubleSide, depthWrite: false }),
    [item.accent],
  );

  useFrame((s) => {
    const a = activeness(journey.progress, placement.progress, placement.width * 0.9);
    ringMat.emissiveIntensity = 0.15 + a * 1.6;
    discMat.opacity = 0.06 + a * 0.3;
    const pulse = journey.reducedMotion ? 0 : Math.sin(s.clock.elapsedTime * 2 + placement.index) * 0.015;
    group.current?.scale.setScalar(1 + a * 0.08 + pulse);
  });

  const pillarLen = placement.height - RING_R + 5;
  const r = item.featured ? RING_R + 6 : RING_R;

  return (
    <Placed p={placement}>
      <group ref={group}>
        {/* ring flight direction (local x) ke perpendicular */}
        <mesh material={ringMat} rotation={[0, Math.PI / 2, 0]} castShadow scale={r / RING_R}>
          <torusGeometry args={[RING_R, 5, 6, 28]} />
        </mesh>
        <mesh material={flat(C.white, { emissive: "#ffffff", emissiveIntensity: 0.3 })} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[RING_R - 10, 1.4, 4, 28]} />
        </mesh>
        <mesh material={discMat} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[RING_R - 6, 28]} />
        </mesh>
      </group>
      {pillarLen > 0 && (
        <mesh material={flat(C.steel)} position={[0, -RING_R - pillarLen / 2 + 2, 0]} castShadow>
          <cylinderGeometry args={[3, 5, pillarLen, 6]} />
        </mesh>
      )}
    </Placed>
  );
}

/** projects -> "Ring gates": har project ek gate, plane us me se guzarta hai. Paas aane par gate roshan hota hai. */
export function ProjectsGates({ station, placements }: { station: ProjectsStation; placements: Placement[] }) {
  const mine = placementsOf(placements, "projects");
  return (
    <>
      {station.data.items.map((item, i) => (
        <Gate key={item.id} item={item} placement={mine[i]} />
      ))}
    </>
  );
}