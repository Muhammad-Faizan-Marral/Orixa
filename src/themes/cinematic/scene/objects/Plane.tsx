"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import { reshape } from "../lib/geometry";
import { damp, mapRange } from "../lib/journey-math";
import { useScene } from "../state/scene-context";

const C = {
  red: "#f25346", white: "#d8d0d1", brown: "#59332e", brownDark: "#23190f",
};
const flat = (color: string, extra: ConstructorParameters<typeof MeshStandardMaterial>[0] = {}) =>
  new MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0, ...extra });

const IDLE_AFTER_MS = 2500;

/** Original AirPlane (zip) ka modern port. Mouse/touch se control, pointer na ho to halka sway. */
export function Plane() {
  const { journey } = useScene();
  const root = useRef<Group>(null);
  const propeller = useRef<Mesh>(null);

  const m = useMemo(() => ({
    red: flat(C.red), white: flat(C.white), brown: flat(C.brown), dark: flat(C.brownDark),
    glass: flat(C.white, { transparent: true, opacity: 0.3 }),
  }), []);

  const g = useMemo(() => ({
    // cockpit: peeche (x<0) se patla, upar se uncha (original vertices[4..7] tweaks)
    cockpit: reshape(new BoxGeometry(80, 50, 50), (v) => {
      if (v.x < 0) { v.z *= 0.2; v.y += v.y < 0 ? -10 : 30; }
    }),
    propeller: reshape(new BoxGeometry(20, 10, 10), (v) => {
      if (v.x < 0) { v.z = 0; v.y += Math.sign(v.y) * 5; }
    }),
  }), []);

  const pos = useRef({ x: -40, y: 110, tx: -40, ty: 110 });

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const p = pos.current;
    const t = state.clock.elapsedTime;

    const active = !journey.reducedMotion && performance.now() - journey.pointerAt < IDLE_AFTER_MS;
    const px = active ? journey.pointer.x : journey.reducedMotion ? 0 : Math.sin(t * 0.6) * 0.45;
    const py = active ? journey.pointer.y : journey.reducedMotion ? 0 : Math.sin(t * 0.9) * 0.3 + 0.1;

    p.tx = mapRange(px, -0.75, 0.75, -100, -20);
    p.ty = mapRange(py, -0.75, 0.75, 50, 190);

    // original: position += (target - position) * 0.1  (60fps par)
    p.y = damp(p.y, p.ty, 6, dt);
    p.x = damp(p.x, p.tx, 6, dt);

    const r = root.current;
    if (r) {
      r.position.set(p.x, p.y, -250);
      r.rotation.z = (p.ty - p.y) * 0.0128;
      r.rotation.x = (p.y - p.ty) * 0.0064;
      r.rotation.y = (p.x - p.tx) * 0.0064;
    }
    if (propeller.current) {
      const boost = 1 + Math.min(Math.abs(journey.velocity) * 6, 2);
      propeller.current.rotation.x += 18 * dt * boost;
    }
  });

  const shadow = { castShadow: true, receiveShadow: true } as const;

  return (
    <group ref={root} scale={0.35} position={[-40, 110, -250]}>
      <mesh {...shadow} geometry={g.cockpit} material={m.red} />
      <mesh {...shadow} material={m.white} position={[40, 0, 0]}>
        <boxGeometry args={[20, 50, 50]} />
      </mesh>
      <mesh {...shadow} material={m.red} position={[-35, 25, 0]}>
        <boxGeometry args={[15, 20, 5]} />
      </mesh>
      <mesh {...shadow} material={m.red} position={[20, 12, 0]}>
        <boxGeometry args={[40, 4, 150]} />
      </mesh>
      <mesh {...shadow} material={m.red} position={[20, -3, 0]}>
        <boxGeometry args={[40, 4, 150]} />
      </mesh>
      <mesh {...shadow} material={m.glass} position={[5, 27, 0]}>
        <boxGeometry args={[3, 15, 20]} />
      </mesh>

      <mesh ref={propeller} {...shadow} geometry={g.propeller} material={m.brown} position={[50, 0, 0]}>
        <mesh {...shadow} material={m.dark} position={[8, 0, 0]}>
          <boxGeometry args={[1, 100, 10]} />
        </mesh>
        <mesh {...shadow} material={m.dark} position={[8, 0, 0]}>
          <boxGeometry args={[1, 10, 100]} />
        </mesh>
      </mesh>

      {[25, -25].map((z) => (
        <group key={z}>
          <mesh material={m.white} position={[25, -20, z]}>
            <boxGeometry args={[30, 15, 10]} />
          </mesh>
          <mesh material={m.dark} position={[25, -28, z]}>
            <boxGeometry args={[24, 24, 4]} />
            <mesh material={m.brown}>
              <boxGeometry args={[10, 10, 6]} />
            </mesh>
          </mesh>
        </group>
      ))}

      {/* peeche ka chhota pahiya + suspension */}
      <mesh material={m.dark} position={[-35, -5, 0]} scale={0.5}>
        <boxGeometry args={[24, 24, 4]} />
        <mesh material={m.brown}>
          <boxGeometry args={[10, 10, 6]} />
        </mesh>
      </mesh>
      <group position={[-35, -5, 0]} rotation={[0, 0, -0.3]}>
        <mesh material={m.red} position={[0, 10, 0]}>
          <boxGeometry args={[4, 20, 4]} />
        </mesh>
      </group>
    </group>
  );
}