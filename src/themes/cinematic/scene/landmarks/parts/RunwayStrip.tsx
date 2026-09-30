"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { Arc } from "./Arc";
import { C, flat } from "../materials";

type Props = { length: number; width: number; lit?: boolean };

const SEG = 40;

/** Curved-surface ke saath mudti runway. `lit` = landing lights chase animation. */
export function RunwayStrip({ length, width, lit = false }: Props) {
  const n = Math.ceil(length / SEG);
  const lights = useRef<Array<Mesh | null>>([]);

  useFrame((state) => {
    if (!lit) return;
    const t = state.clock.elapsedTime;
    lights.current.forEach((m, i) => m?.scale.setScalar(0.7 + 0.7 * Math.max(0, Math.sin(t * 5 - i * 0.45))));
  });

  const asphalt = flat(C.asphalt);
  const dash = flat(C.white);
  const light = lit
    ? flat("#ffd27a", { emissive: "#ffb347", emissiveIntensity: 1.4 })
    : flat(C.white, { emissive: "#ffffff", emissiveIntensity: 0.15 });

  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const s = -length / 2 + SEG / 2 + i * SEG;
        return (
          <Arc key={i} s={s}>
            <mesh material={asphalt} position={[0, -4, 0]} receiveShadow>
              <boxGeometry args={[SEG + 1, 2, width]} />
            </mesh>
            {i % 2 === 0 && (
              <mesh material={dash} position={[0, -2.9, 0]}>
                <boxGeometry args={[16, 0.4, 2.4]} />
              </mesh>
            )}
            {[-1, 1].map((side) => (
              <mesh
                key={side}
                material={light}
                position={[0, -2, side * (width / 2 + 5)]}
                ref={(el) => { lights.current[i * 2 + (side > 0 ? 1 : 0)] = el; }}
              >
                <sphereGeometry args={[2.2, 6, 4]} />
              </mesh>
            ))}
          </Arc>
        );
      })}
    </group>
  );
}