"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { BoxGeometry, Color, CylinderGeometry, InstancedMesh, Matrix4, Object3D } from "three";
import { mul, reshape } from "../lib/geometry";
import { SURFACE_RADIUS, mulberry32 } from "../lib/journey-math";
import { isCleared } from "../landmarks/placement";
import { useScene } from "../state/scene-context";

const dummy = new Object3D();

/** Land ki surface par ek point + scale ka matrix (original: angle, radius 605, z random). */
function surfaceMatrix(i: number, n: number, z: number, scale: number, cleared = false): Matrix4 {
  const a = ((Math.PI * 2) / n) * i;
  dummy.position.set(Math.cos(a) * SURFACE_RADIUS, Math.sin(a) * SURFACE_RADIUS, z);
  dummy.rotation.set(0, 0, a + (Math.PI / 2) * 3);
  dummy.scale.setScalar(cleared ? 0 : scale); // landmark ke neeche tree/flower nahi
  dummy.updateMatrix();
  return dummy.matrix.clone();
}

const T = (x: number, y: number, z: number) => new Matrix4().makeTranslation(x, y, z);

const PETAL_COLORS = ["#f25346", "#edeb27", "#68c3c0"].map((c) => new Color(c));

/**
 * 300 trees + 350 flowers = pehle ~1500 meshes the, ab InstancedMesh se sirf ~8 draw calls.
 * Seeded PRNG => har baar same forest.
 */
export function Forest() {
  const { preset, placements } = useScene();
  const { trees: nTrees, flowers: nFlowers } = preset;

  const trunk = useRef<InstancedMesh>(null);
  const l1 = useRef<InstancedMesh>(null);
  const l2 = useRef<InstancedMesh>(null);
  const l3 = useRef<InstancedMesh>(null);
  const stem = useRef<InstancedMesh>(null);
  const core = useRef<InstancedMesh>(null);
  const petals = useRef<InstancedMesh>(null);

  const geo = useMemo(() => ({
    trunk: new BoxGeometry(10, 20, 10),
    leaf1: new CylinderGeometry(1, 36, 36, 4),
    leaf2: new CylinderGeometry(1, 27, 27, 4),
    leaf3: new CylinderGeometry(1, 18, 18, 4),
    stem: new BoxGeometry(5, 50, 5),
    core: new BoxGeometry(10, 10, 10),
    petal: reshape(new BoxGeometry(15, 20, 5), (v) => {
      if (v.x < 0) v.y += Math.sign(v.y) * 4;
    }).translate(12.5, 0, 3),
  }), []);

  useLayoutEffect(() => {
    const rand = mulberry32(1337);

    const parts: Array<[React.RefObject<InstancedMesh | null>, Matrix4]> = [
      [trunk, new Matrix4()],
      [l1, T(0, 20, 0)],
      [l2, T(0, 40, 0)],
      [l3, T(0, 55, 0)],
    ];
    for (let i = 0; i < nTrees; i++) {
      const z = -rand() * 600;
      const sc = 0.3 + rand() * 0.75;
      const angle = ((Math.PI * 2) / nTrees) * i;
      const parent = surfaceMatrix(i, nTrees, z, sc, isCleared(angle, z, placements));
      parts.forEach(([ref, local]) => ref.current?.setMatrixAt(i, mul(parent, local)));
    }
    parts.forEach(([ref]) => {
      if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
    });

    const coreLocal = T(0, 25, 3);
    for (let i = 0; i < nFlowers; i++) {
      const z = -rand() * 600;
      const sc = 0.1 + rand() * 0.3;
      const angle = ((Math.PI * 2) / nFlowers) * i;
      const parent = surfaceMatrix(i, nFlowers, z, sc, isCleared(angle, z, placements));
      const color = PETAL_COLORS[Math.floor(rand() * 3)];
      stem.current?.setMatrixAt(i, parent);
      const coreM = mul(parent, coreLocal);
      core.current?.setMatrixAt(i, coreM);
      for (let k = 0; k < 4; k++) {
        const rot = new Matrix4().makeRotationZ((k * Math.PI) / 2);
        petals.current?.setMatrixAt(i * 4 + k, mul(coreM, rot));
        petals.current?.setColorAt(i * 4 + k, color);
      }
    }
    [stem, core, petals].forEach((ref) => {
      if (!ref.current) return;
      ref.current.instanceMatrix.needsUpdate = true;
      if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    });
  }, [nTrees, nFlowers, placements]);

  const common = { castShadow: true, receiveShadow: true, frustumCulled: false } as const;

  return (
    <group>
      <instancedMesh key={`t0-${nTrees}`} ref={trunk} args={[geo.trunk, undefined, nTrees]} {...common}>
        <meshStandardMaterial color="#59332e" roughness={1} />
      </instancedMesh>
      {[
        [l1, geo.leaf1],
        [l2, geo.leaf2],
        [l3, geo.leaf3],
      ].map(([ref, g], idx) => (
        <instancedMesh
          key={`leaf-${idx}-${nTrees}`}
          ref={ref as React.RefObject<InstancedMesh>}
          args={[g as CylinderGeometry, undefined, nTrees]}
          {...common}
        >
          <meshStandardMaterial color="#458248" flatShading roughness={1} />
        </instancedMesh>
      ))}

      <instancedMesh key={`st-${nFlowers}`} ref={stem} args={[geo.stem, undefined, nFlowers]} receiveShadow frustumCulled={false}>
        <meshStandardMaterial color="#458248" flatShading roughness={1} />
      </instancedMesh>
      <instancedMesh key={`co-${nFlowers}`} ref={core} args={[geo.core, undefined, nFlowers]} receiveShadow frustumCulled={false}>
        <meshStandardMaterial color="#edeb27" flatShading roughness={1} />
      </instancedMesh>
      <instancedMesh key={`pe-${nFlowers}`} ref={petals} args={[geo.petal, undefined, nFlowers * 4]} {...common}>
        <meshBasicMaterial color="#ffffff" />
      </instancedMesh>
    </group>
  );
}