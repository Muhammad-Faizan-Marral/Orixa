"use client";

import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DodecahedronGeometry, Group, InstancedMesh, Matrix4, Object3D } from "three";
import { WORLD_OFFSET_Y, mulberry32 } from "../lib/journey-math";
import { useScene } from "../state/scene-context";

const geom = new DodecahedronGeometry(20, 0);
const parent = new Object3D();
const child = new Object3D();

/** Original Sky: ring of cloud groups jo hamesha dheere ghoomte hain (idle motion). */
export function Clouds() {
  const { preset, journey } = useScene();
  const spin = useRef<Group>(null);
  const mesh = useRef<InstancedMesh>(null);
  const nClouds = preset.clouds;
  const maxBlobs = nClouds * 5;

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const rand = mulberry32(99);
    const step = (Math.PI * 2) / nClouds;
    let idx = 0;

    for (let i = 0; i < nClouds; i++) {
      const a = step * i;
      const h = 800 + rand() * 200;
      const s = 1 + rand() * 2;
      parent.position.set(Math.cos(a) * h, Math.sin(a) * h, -400 - rand() * 400);
      parent.rotation.set(0, 0, a + Math.PI / 2);
      parent.scale.setScalar(s);
      parent.updateMatrix();

      const blobs = 3 + Math.floor(rand() * 3);
      for (let b = 0; b < blobs; b++) {
        child.position.set(b * 15, rand() * 10, rand() * 10);
        child.rotation.set(0, rand() * Math.PI * 2, rand() * Math.PI * 2);
        child.scale.setScalar(0.1 + rand() * 0.9);
        child.updateMatrix();
        m.setMatrixAt(idx++, new Matrix4().multiplyMatrices(parent.matrix, child.matrix));
      }
    }
    m.count = idx;
    m.instanceMatrix.needsUpdate = true;
  }, [nClouds]);

  useFrame((_, dt) => {
    if (!spin.current || journey.reducedMotion) return;
    // original: +0.003 rad/frame @60fps, scroll karne par thora tez
    spin.current.rotation.z += Math.min(dt, 0.05) * (0.18 + Math.abs(journey.velocity) * 2);
  });

  return (
    <group ref={spin} position={[0, WORLD_OFFSET_Y, 0]}>
      <instancedMesh key={nClouds} ref={mesh} args={[geom, undefined, maxBlobs]} castShadow frustumCulled={false}>
        <meshStandardMaterial color="#d8d0d1" roughness={1} flatShading />
      </instancedMesh>
    </group>
  );
}