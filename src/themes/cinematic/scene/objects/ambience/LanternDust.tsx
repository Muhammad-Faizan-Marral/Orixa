"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, DoubleSide, ShaderMaterial } from "three";
import { QUALITY_BUDGETS } from "../../../data/mood.config";
import { useScene } from "../../state/scene-context";

/**
 * Ambience "dust": warm light motes rising through projector beams.
 * Quiet on purpose – it's the room the projects are screened in.
 */

const dustVert = /* glsl */ `
  uniform float uTime;
  uniform float uPresence;
  uniform float uPixel;
  attribute vec3 aSeed;               // x phase, y speed, z size
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y = mod(position.y + uTime * (0.05 + aSeed.y * 0.12) + 4.0, 10.0) - 4.0;   // rise, wrap in [-4, 6]
    p.x += sin(uTime * 0.2 + aSeed.x * 6.28) * 0.6;
    p.z += cos(uTime * 0.17 + aSeed.x * 9.0) * 0.5;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.55 + 0.45 * sin(uTime * 1.3 + aSeed.x * 40.0);
    vAlpha = twinkle * smoothstep(-4.0, -2.0, p.y) * (1.0 - smoothstep(4.0, 6.0, p.y)) * uPresence;
    gl_PointSize = aSeed.z * 6.0 * uPixel * (8.0 / -mv.z);
  }
`;

const dustFrag = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.0, 0.5, d);
    gl_FragColor = vec4(uColor, a * a * vAlpha);
    #include <colorspace_fragment>
  }
`;

const beamVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const beamFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uPresence;
  uniform float uSeed;
  varying vec2 vUv;
  void main() {
    float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
    float a = edge * edge * pow(vUv.y, 1.6);                       // soft sides, brightest at the source
    a *= 0.8 + 0.2 * sin(uTime * 0.3 + uSeed);                     // slow shimmer
    gl_FragColor = vec4(uColor, a * 0.085 * uPresence);
    #include <colorspace_fragment>
  }
`;

const BEAMS = [
  { x: 5.5, w: 4.2, rot: -0.5, seed: 0 },
  { x: 8.5, w: 3.0, rot: -0.38, seed: 2 },
  { x: 2.0, w: 2.4, rot: -0.62, seed: 4 },
];

const rand = (a: number, b: number) => a + (b - a) * Math.random();

export function LanternDust() {
  const { state } = useScene();
  const dpr = useThree((s) => s.viewport.dpr);
  const count = QUALITY_BUDGETS[state.quality].dust;

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos.set([rand(-12, 12), rand(-4, 6), rand(-14, 5)], i * 3);
      seed.set([Math.random(), Math.random(), rand(0.6, 2.2)], i * 3);
    }
    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new BufferAttribute(seed, 3));
    return g;
  }, [count]);

  const dust = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uPresence: { value: 0 }, uPixel: { value: 1 }, uColor: { value: new Color() } },
        vertexShader: dustVert,
        fragmentShader: dustFrag,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [],
  );

  const beams = useMemo(
    () =>
      BEAMS.map(
        (b) =>
          new ShaderMaterial({
            uniforms: { uTime: { value: 0 }, uPresence: { value: 0 }, uSeed: { value: b.seed }, uColor: { value: new Color() } },
            vertexShader: beamVert,
            fragmentShader: beamFrag,
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending,
            side: DoubleSide,
          }),
      ),
    [],
  );

  const time = useRef(0);

  useFrame((_, rawDt) => {
    time.current += Math.min(rawDt, 0.05) * state.motion;
    const pres = state.presence.dust;
    dust.uniforms.uTime.value = time.current;
    dust.uniforms.uPresence.value = pres;
    dust.uniforms.uPixel.value = dpr;
    dust.uniforms.uColor.value.copy(state.mood.particle);
    for (const m of beams) {
      m.uniforms.uTime.value = time.current;
      m.uniforms.uPresence.value = pres;
      m.uniforms.uColor.value.copy(state.mood.glow);
    }
  });

  return (
    <>
      {BEAMS.map((b, i) => (
        <mesh key={i} position={[b.x, 2.5, -9]} rotation={[0, 0, b.rot]} scale={[b.w, 26, 1]} renderOrder={5} frustumCulled={false}>
          <planeGeometry args={[1, 1]} />
          <primitive object={beams[i]} attach="material" />
        </mesh>
      ))}
      <points geometry={geometry} material={dust} frustumCulled={false} renderOrder={6} />
    </>
  );
}