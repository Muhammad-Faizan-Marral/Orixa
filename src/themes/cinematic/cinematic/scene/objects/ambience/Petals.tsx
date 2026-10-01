"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Color, DoubleSide, InstancedMesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry } from "three";
import { QUALITY_BUDGETS } from "../../../data/mood.config";
import { clamp, smoothstep } from "../../../shared/math";
import { PETAL_BOUNDS, WATER_Y } from "../../lib/world";
import { useScene } from "../../state/scene-context";

type Petal = {
  x: number; y: number; z: number;
  vy: number; sway: number; swayPhase: number;
  theta: number; phi: number; dTheta: number; dPhi: number;
  landed: boolean; rest: number; scale: number;
};

const REST_LIFE = 10; // seconds a petal floats on the water before fading
const rand = (a: number, b: number) => a + (b - a) * Math.random();

/** Same notched silhouette as the reference sketch (heart-like cherry petal). */
function makePetalGeometry() {
  const s = new Shape();
  s.moveTo(0, -0.4);
  s.bezierCurveTo(-0.6, -0.2, -0.1, 0.6, 0, 0.2);
  s.bezierCurveTo(0.1, 0.6, 0.6, -0.2, 0, -0.4);
  return new ShapeGeometry(s, 8);
}

function spawn(p: Petal, scattered: boolean) {
  p.x = rand(PETAL_BOUNDS.x[0], PETAL_BOUNDS.x[1]);
  p.z = rand(PETAL_BOUNDS.z[0], PETAL_BOUNDS.z[1]);
  p.y = scattered ? rand(WATER_Y, PETAL_BOUNDS.top) : PETAL_BOUNDS.top + rand(0, 3);
  p.vy = rand(0.45, 1.0);
  p.sway = rand(0.15, 0.55);
  p.swayPhase = rand(0, Math.PI * 2);
  p.theta = rand(0, Math.PI * 2);
  p.phi = rand(0, Math.PI * 2);
  p.dTheta = rand(-1.2, 1.2);
  p.dPhi = rand(0.6, 1.8);
  p.landed = false;
  p.rest = 0;
  p.scale = rand(0.22, 0.38);
}

export function Petals({ onLand }: { onLand: (x: number, z: number) => void }) {
  const { state } = useScene();
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const geometry = useMemo(makePetalGeometry, []);
  const material = useMemo(
    () => new MeshBasicMaterial({ side: DoubleSide, transparent: true, opacity: 0.92, fog: true }),
    [],
  );

  const count = QUALITY_BUDGETS[state.quality].petals;
  const petals = useMemo(() => {
    const list = Array.from({ length: count }, () => ({}) as Petal);
    list.forEach((p) => spawn(p, true));
    return list;
  }, [count]);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const c = new Color();
    petals.forEach((_, i) => m.setColorAt(i, c.setScalar(rand(0.72, 1)))); // brightness variety; hue = mood.particle
  }, [petals]);

  useFrame(({ clock }, rawDt) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(rawDt, 0.05) * state.motion;
    const t = clock.elapsedTime;
    const rush = 1 + clamp(Math.abs(state.velocity) * 6, 0, 2); // scrolling fast = petals stream faster
    const active = Math.floor(count * (0.35 + 0.65 * state.mood.intensity));
    const pres = state.presence.petals;
    material.color.copy(state.mood.particle);
    material.opacity = 0.92 * pres;

    for (let i = 0; i < count; i++) {
      const p = petals[i];
      if (i >= active) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
        continue;
      }

      p.theta += p.dTheta * dt;
      p.phi += p.dPhi * dt;
      let s = p.scale * pres;

      if (!p.landed) {
        p.y -= p.vy * rush * dt;
        p.x += (Math.sin(t * 0.8 + p.swayPhase) * p.sway + 0.15) * dt;
        if (p.y <= WATER_Y) {
          p.y = WATER_Y + 0.006;
          p.landed = true;
          p.rest = 0;
          onLand(p.x, p.z);
        }
      } else {
        p.rest += dt;
        p.x += 0.05 * dt; // slow drift on the surface
        s *= 1 - smoothstep(REST_LIFE * 0.7, REST_LIFE, p.rest);
        if (p.rest >= REST_LIFE) spawn(p, false);
      }

      dummy.position.set(p.x, p.y, p.z);
      if (p.landed) dummy.rotation.set(-Math.PI / 2, 0, p.theta); // lies flat on the pond
      else dummy.rotation.set(p.phi, p.theta, p.theta * 0.5); // tumbles in the air
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} renderOrder={3} />;
}
