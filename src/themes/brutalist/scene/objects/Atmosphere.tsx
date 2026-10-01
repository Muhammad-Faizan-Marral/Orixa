"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending, BackSide, BufferGeometry, Color, DirectionalLight, Float32BufferAttribute,
  Fog, HemisphereLight, Mesh, MeshBasicMaterial, PointsMaterial, ShaderMaterial,
} from "three";
import { mulberry32 } from "../lib/journey-math";
import { useScene } from "../state/scene-context";

const SKY_VERT = /* glsl */ `
  varying float vY;
  void main() {
    vY = normalize(position).y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const SKY_FRAG = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uBottom;
  varying float vY;
  void main() {
    float t = smoothstep(-0.05, 0.65, vY);
    gl_FragColor = vec4(mix(uBottom, uTop, t), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/** Sky gradient + sun + stars + fog + lights: sab mood palette (atmosphere) se chalte hain. */
export function Atmosphere() {
  const { atmosphere: atmo, preset } = useScene();
  const scene = useThree((s) => s.scene);

  const fog = useMemo(() => new Fog(new Color("#f7d9aa"), 120, 950), []);
  useEffect(() => {
    scene.fog = fog;
    return () => { scene.fog = null; };
  }, [scene, fog]);

  const skyMat = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uTop: { value: new Color() }, uBottom: { value: new Color() } },
        vertexShader: SKY_VERT,
        fragmentShader: SKY_FRAG,
        side: BackSide,
        depthWrite: false,
        fog: false,
      }),
    [],
  );

  const sunRef = useRef<Mesh>(null);
  const sunMat = useMemo(() => new MeshBasicMaterial({ color: "#fff1b8", fog: false, toneMapped: false }), []);

  const starGeom = useMemo(() => {
    const rand = mulberry32(7);
    const pos: number[] = [];
    for (let i = 0; i < preset.stars; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(0.05 + rand() * 0.95); // sirf upar wala hissa
      const r = 4200;
      pos.push(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), -Math.abs(r * Math.sin(phi) * Math.sin(theta)));
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    return g;
  }, [preset.stars]);
  const starMat = useMemo(
    () => new PointsMaterial({ color: "#ffffff", size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false, blending: AdditiveBlending }),
    [],
  );

  const hemi = useRef<HemisphereLight>(null);
  const dir = useRef<DirectionalLight>(null);

  useFrame(() => {
    fog.color.copy(atmo.fog);
    fog.near = atmo.fogNear;
    fog.far = atmo.fogFar;

    skyMat.uniforms.uTop.value.copy(atmo.skyTop);
    skyMat.uniforms.uBottom.value.copy(atmo.skyBottom);

    sunMat.color.copy(atmo.sun);
    if (sunRef.current) sunRef.current.position.y = atmo.sunY;

    starMat.opacity = atmo.stars;

    if (hemi.current) {
      hemi.current.color.copy(atmo.ambient);
      hemi.current.intensity = 1.4 - atmo.stars * 0.6;
    }
    if (dir.current) {
      dir.current.color.copy(atmo.sun).lerp(new Color("#ffffff"), 0.5);
      dir.current.intensity = 2.2 - atmo.stars * 1.6;
    }
  });

  return (
    <>
      <mesh material={skyMat} renderOrder={-10} frustumCulled={false}>
        <sphereGeometry args={[5000, 24, 16]} />
      </mesh>

      <points geometry={starGeom} material={starMat} renderOrder={-9} frustumCulled={false} />

      {/* Original: scale (1,1,.3) at (0,-30,-850) */}
      <mesh ref={sunRef} material={sunMat} position={[0, -30, -850]} scale={[1, 1, 0.3]} frustumCulled={false}>
        <sphereGeometry args={[170, 64, 32]} />
      </mesh>

      <hemisphereLight ref={hemi} args={["#aaaaaa", "#000000", 1.4]} />
      <directionalLight
        ref={dir}
        position={[0, 350, 350]}
        intensity={2.2}
        castShadow={preset.shadows}
        shadow-mapSize-width={preset.shadowMapSize}
        shadow-mapSize-height={preset.shadowMapSize}
        shadow-camera-left={-650}
        shadow-camera-right={650}
        shadow-camera-top={650}
        shadow-camera-bottom={-650}
        shadow-camera-near={1}
        shadow-camera-far={1000}
      />
    </>
  );
}