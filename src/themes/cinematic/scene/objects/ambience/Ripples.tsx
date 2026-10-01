"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { AdditiveBlending, Color, InstancedMesh, Object3D, RingGeometry } from "three";
import type { RipplePool } from "../../lib/ripples";
import { WATER_Y } from "../../lib/world";
import { useScene } from "../../state/scene-context";

/** Expanding rings (additive: dimming the colour == fading the ring). */
export function Ripples({ pool }: { pool: RipplePool }) {
  const { state } = useScene();
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);
  const geometry = useMemo(() => {
    const g = new RingGeometry(0.93, 1, 64);
    g.rotateX(-Math.PI / 2); // lay flat on the water
    return g;
  }, []);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    color.setRGB(0, 0, 0);
    pool.items.forEach((_, i) => m.setColorAt(i, color)); // creates instanceColor attribute
  }, [pool, color]);

  useFrame((_, rawDt) => {
    const m = mesh.current;
    if (!m) return;
    pool.update(Math.min(rawDt, 0.05));

    pool.items.forEach((r, i) => {
      if (!r.active) {
        dummy.scale.setScalar(0);
        color.setRGB(0, 0, 0);
      } else {
        const k = r.age / pool.life;
        const ease = 1 - (1 - k) * (1 - k);
        dummy.position.set(r.x, WATER_Y + 0.01, r.z);
        dummy.scale.setScalar(0.12 + ease * pool.maxRadius);
        color.copy(state.mood.accent).multiplyScalar(Math.pow(1 - k, 1.6) * 0.9 * state.presence.petals);
      }
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, color);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geometry, undefined, pool.items.length]} frustumCulled={false} renderOrder={2}>
      <meshBasicMaterial transparent blending={AdditiveBlending} depthWrite={false} fog={false} />
    </instancedMesh>
  );
}
