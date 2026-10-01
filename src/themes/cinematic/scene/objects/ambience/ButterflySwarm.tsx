"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, DoubleSide, InstancedBufferAttribute, InstancedMesh, Object3D, PlaneGeometry, ShaderMaterial } from "three";
import { QUALITY_BUDGETS } from "../../../data/mood.config";
import { clamp } from "../../../shared/math";
import { useScene } from "../../state/scene-context";

/**
 * Ambience "butterflies": a lazy swarm drifting through the dusk sky.
 * Seen like pinned specimens – wings spread toward the camera, body along +Y –
 * so the silhouette always reads. Wing shape + pattern are procedural (no textures);
 * flapping happens in the vertex shader, flight paths are analytic Lissajous curves.
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  attribute float aPhase;
  attribute float aMix;
  varying vec2 vUv;
  varying float vMix;
  varying float vShade;
  void main() {
    vUv = uv;
    vMix = aMix;
    float ang = sin(uTime * 11.0 + aPhase) * 0.95;      // flap angle
    vec3 p = position;
    float ax = abs(p.x);
    p.z += ax * sin(ang);                                // wing tips swing toward / away from camera
    p.x = sign(p.x) * ax * cos(ang);                     // ...and the span foreshortens
    vShade = 0.8 + 0.2 * cos(ang);
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uPresence;
  varying vec2 vUv;
  varying float vMix;
  varying float vShade;

  float ell(vec2 p, vec2 c, vec2 r) { vec2 q = (p - c) / r; return dot(q, q); }

  void main() {
    vec2 p = vec2(abs(vUv.x - 0.5) * 2.0, vUv.y);        // x: 0 body -> 1 wing tip, y: 0 tail -> 1 head
    float d = min(ell(p, vec2(0.52, 0.68), vec2(0.5, 0.34)),    // upper wing
                  ell(p, vec2(0.40, 0.27), vec2(0.36, 0.24)));  // lower wing
    float wing = 1.0 - smoothstep(0.82, 1.0, d);
    float body = step(p.x, 0.035) * step(0.14, p.y) * step(p.y, 0.86);
    float alpha = max(wing, body);
    if (alpha < 0.01) discard;

    vec3 base = mix(uA, uB, clamp(vMix * 0.7 + p.x * 0.5, 0.0, 1.0));
    base *= 0.8 + 0.2 * sin(p.y * 22.0 + p.x * 9.0);                      // faint veins
    base = mix(base, base * 0.3, smoothstep(0.62, 1.0, d));              // dark rim
    base = mix(base, vec3(1.0), (1.0 - smoothstep(0.06, 0.1, length(p - vec2(0.72, 0.7)))) * 0.75); // eye-spot
    base = mix(base, vec3(0.06, 0.05, 0.05), body);
    gl_FragColor = vec4(base * vShade, alpha * 0.96 * uPresence);
    #include <colorspace_fragment>
  }
`;

type Fly = {
  cx: number; cy: number; cz: number;
  ax: number; ay: number; az: number;
  w1: number; w2: number; w3: number;
  p1: number; p2: number; p3: number;
  att: number; size: number;
};

const rand = (a: number, b: number) => a + (b - a) * Math.random();

export function ButterflySwarm() {
  const { state } = useScene();
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const count = QUALITY_BUDGETS[state.quality].butterflies;

  const flies = useMemo<Fly[]>(
    () =>
      Array.from({ length: count }, () => ({
        cx: rand(-7, 7), cy: rand(-1, 4.5), cz: rand(-8, 2),
        ax: rand(1.5, 3.5), ay: rand(0.6, 1.4), az: rand(1, 2.5),
        w1: rand(0.12, 0.3), w2: rand(0.15, 0.35), w3: rand(0.1, 0.25),
        p1: rand(0, 6.28), p2: rand(0, 6.28), p3: rand(0, 6.28),
        att: Math.random(), size: rand(0.3, 0.55),
      })),
    [count],
  );

  const geometry = useMemo(() => {
    const g = new PlaneGeometry(2, 1.4, 10, 2);
    g.setAttribute("aPhase", new InstancedBufferAttribute(Float32Array.from({ length: count }, () => rand(0, 6.28)), 1));
    g.setAttribute("aMix", new InstancedBufferAttribute(Float32Array.from({ length: count }, () => Math.random()), 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uPresence: { value: 0 }, uA: { value: new Color() }, uB: { value: new Color() } },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
      }),
    [],
  );

  const clock = useRef({ path: 0, flap: 0 });

  useFrame((_, rawDt) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(rawDt, 0.05) * state.motion;
    const rush = 1 + clamp(Math.abs(state.velocity) * 4, 0, 1.5); // scrolling stirs the swarm
    clock.current.path += dt * rush;
    clock.current.flap += dt * (1 + (rush - 1) * 0.5);
    const t = clock.current.path;
    const pres = state.presence.butterflies;

    const u = material.uniforms;
    u.uTime.value = clock.current.flap;
    u.uPresence.value = pres;
    u.uA.value.copy(state.mood.accent);
    u.uB.value.copy(state.mood.particle);

    const px = state.pointer.x * 7; // gentle pull toward the pointer
    const py = state.pointer.y * 2.5 + 1.5;

    for (let i = 0; i < count; i++) {
      const f = flies[i];
      const cx = f.cx + (px - f.cx) * 0.1 * f.att;
      const cy = f.cy + (py - f.cy) * 0.1 * f.att;
      const a1 = f.w1 * t + f.p1;
      const a2 = f.w2 * t + f.p2;
      const a3 = f.w3 * t + f.p3;

      const x = cx + f.ax * Math.sin(a1);
      const y = cy + f.ay * (Math.sin(a2) + 0.4 * Math.sin(f.w2 * 2.3 * t + f.p1));
      const z = f.cz + f.az * Math.sin(a3);
      const vx = f.ax * f.w1 * Math.cos(a1);
      const vy = f.ay * f.w2 * (Math.cos(a2) + 0.92 * Math.cos(f.w2 * 2.3 * t + f.p1));

      dummy.position.set(x, y, z);
      dummy.rotation.set(0.35 + Math.sin(a3) * 0.15, 0, Math.atan2(vy, vx) - Math.PI / 2); // head toward travel direction
      dummy.scale.setScalar(f.size * pres);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} renderOrder={4} />;
}
