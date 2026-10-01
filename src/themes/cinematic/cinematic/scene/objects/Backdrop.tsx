"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type FogExp2 } from "three";
import { useScene } from "../state/scene-context";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0); // full-screen, pinned to far plane
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uBottom;
  uniform vec3 uGlow;
  varying vec2 vUv;
  void main() {
    vec3 c = mix(uBottom, uTop, smoothstep(0.0, 1.0, vUv.y));
    vec2 d = vUv - vec2(0.5, 0.36);          // soft "moon / lantern" bloom near the horizon
    c += uGlow * exp(-dot(d, d) * 6.0) * 0.16;
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }
`;

/** Gradient sky + matching fog, both driven by the blended mood. */
export function Backdrop() {
  const { state } = useScene();
  const fog = useRef<FogExp2>(null);
  const uniforms = useMemo(
    () => ({ uTop: { value: new Color() }, uBottom: { value: new Color() }, uGlow: { value: new Color() } }),
    [],
  );

  useFrame(() => {
    const m = state.mood;
    uniforms.uTop.value.copy(m.skyTop);
    uniforms.uBottom.value.copy(m.skyBottom);
    uniforms.uGlow.value.copy(m.glow);
    if (fog.current) {
      fog.current.color.copy(m.skyBottom);
      fog.current.density = 0.012 + m.haze * 0.045;
    }
  });

  return (
    <>
      <fogExp2 ref={fog} attach="fog" args={[0x000000, 0.03]} />
      <mesh frustumCulled={false} renderOrder={-10}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
