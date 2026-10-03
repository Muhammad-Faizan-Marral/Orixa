"use client";
import { RoundedBox, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { CanvasTexture, MathUtils, SRGBColorSpace, type Group } from "three";
import { LOGOS } from "../Logo";
import CanvasBoundary from "./CanvasBoundary";

/** Brand "ion" arc (primary -> accent) painted once to a tiny canvas texture. */
function useIonTexture() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 64;
    const g = c.getContext("2d")!;
    const gr = g.createLinearGradient(0, 0, 256, 0);
    gr.addColorStop(0, "#6c5cff"); gr.addColorStop(1, "#22d3ee");
    g.fillStyle = gr; g.fillRect(0, 0, 256, 64);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

function LogoPlane() {
  const map = useTexture(LOGOS.mark);
  return (
    <mesh position={[-0.95, 1.45, 0.2]}>
      <planeGeometry args={[0.66, 0.66]} />
      <meshBasicMaterial map={map} transparent toneMapped={false} />
    </mesh>
  );
}

/** ~90 deterministic dust motes (no Math.random during render). */
function Dust({ animate }: { animate: boolean }) {
  const ref = useRef<Group>(null);
  const positions = useMemo(() => {
    let s = 7;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const a = new Float32Array(90 * 3);
    for (let i = 0; i < a.length; i += 3) { a[i] = (rnd() - 0.5) * 7; a[i + 1] = (rnd() - 0.5) * 6; a[i + 2] = (rnd() - 0.5) * 3 - 0.5; }
    return a;
  }, []);
  useFrame((st) => { if (animate && ref.current) ref.current.rotation.y = st.clock.elapsedTime * 0.04; });
  return (
    <group ref={ref}>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
        <pointsMaterial size={0.035} color="#22d3ee" transparent opacity={0.65} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

function Artifact({ animate }: { animate: boolean }) {
  const root = useRef<Group>(null);
  const orbit = useRef<Group>(null);
  const tiles = useRef<Group>(null);
  const ion = useIonTexture();
  const { viewport } = useThree();
  const scale = Math.min(1, viewport.width / 5.8);

  useFrame((state, dt) => {
    const g = root.current;
    if (!g || !animate) return;
    const t = state.clock.elapsedTime;
    const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.5);
    g.rotation.y = MathUtils.damp(g.rotation.y, -0.42 + state.pointer.x * 0.35 + scroll * 0.7, 4, dt);
    g.rotation.x = MathUtils.damp(g.rotation.x, 0.1 - state.pointer.y * 0.18, 4, dt);
    g.position.y = Math.sin(t * 0.8) * 0.07;
    if (orbit.current) orbit.current.rotation.z = t * 0.6;
    if (tiles.current) tiles.current.position.z = 0.16 + Math.sin(t * 1.2) * 0.035;
  });

  return (
    <group ref={root} scale={scale} rotation={[0.1, -0.42, 0]}>
      <Dust animate={animate} />
      {/* ghost drafts behind the published page */}
      {[-0.55, -1.05].map((z, i) => (
        <RoundedBox key={z} args={[3.1, 4.1, 0.05]} radius={0.12} position={[0.12 * (i + 1), -0.08 * (i + 1), z]}>
          <meshStandardMaterial color="#6c5cff" transparent opacity={0.18 - i * 0.06} roughness={0.8} />
        </RoundedBox>
      ))}
      {/* glowing rim */}
      <RoundedBox args={[3.18, 4.18, 0.12]} radius={0.14} position={[0, 0, -0.04]}>
        <meshStandardMaterial color="#6c5cff" emissive="#6c5cff" emissiveIntensity={0.9} roughness={0.4} />
      </RoundedBox>
      {/* the page */}
      <RoundedBox args={[3.1, 4.1, 0.14]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#161922" roughness={0.5} metalness={0} />
      </RoundedBox>
      <RoundedBox args={[2.7, 0.9, 0.08]} radius={0.06} position={[0, 1.45, 0.11]}>
        <meshBasicMaterial map={ion} toneMapped={false} />
      </RoundedBox>
      <CanvasBoundary fallback={null}><Suspense fallback={null}><LogoPlane /></Suspense></CanvasBoundary>
      {[0.12, -0.12].map((y, i) => (
        <RoundedBox key={y} args={[i ? 0.8 : 1.2, 0.1, 0.04]} radius={0.02} position={[0.25 - (i ? 0.2 : 0), 1.45 + y, 0.17]}>
          <meshBasicMaterial color="#08090c" />
        </RoundedBox>
      ))}
      <group ref={tiles} position={[0, 0, 0.16]}>
        {[[-0.7, 0.35], [0.7, 0.35], [-0.7, -0.75], [0.7, -0.75]].map(([x, y], i) => (
          <RoundedBox key={i} args={[1.2, 0.95, 0.08]} radius={0.06} position={[x, y, 0]}>
            <meshStandardMaterial color={i === 0 ? "#6c5cff" : i === 3 ? "#22d3ee" : "#2a2f3d"}
              emissive={i === 0 ? "#6c5cff" : i === 3 ? "#22d3ee" : "#000000"} emissiveIntensity={i === 0 || i === 3 ? 0.35 : 0} roughness={0.45} />
          </RoundedBox>
        ))}
      </group>
      {[-0.95, -0.35, 0.3, 0.95].map((x, i) => (
        <RoundedBox key={x} args={[0.5 + (i % 2) * 0.12, 0.2, 0.05]} radius={0.08} position={[x, -1.75, 0.12]}>
          <meshStandardMaterial color="#f5f6f8" roughness={0.6} />
        </RoundedBox>
      ))}
      {/* orbiting ion ring + publish beacon */}
      <group rotation={[1.15, 0, 0.35]}>
        <mesh><torusGeometry args={[2.5, 0.012, 8, 96]} /><meshBasicMaterial color="#22d3ee" transparent opacity={0.5} /></mesh>
        <group ref={orbit}>
          <mesh position={[2.5, 0, 0]}><sphereGeometry args={[0.12, 20, 20]} /><meshBasicMaterial color="#9af0ff" toneMapped={false} /></mesh>
        </group>
      </group>
    </group>
  );
}

export default function PortfolioArtifact({ active, animate }: { active: boolean; animate: boolean }) {
  return (
    <Canvas frameloop={active && animate ? "always" : "demand"} dpr={[1, 1.5]} camera={{ position: [0, 0, 8.5], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} aria-hidden="true">
      <ambientLight intensity={0.8} />
      <hemisphereLight args={["#8f86ff", "#0b0d14", 0.9]} />
      <directionalLight position={[-3, 4, 5]} intensity={2.2} color="#cfeeff" />
      <pointLight position={[3.5, -1, -2]} intensity={45} distance={14} color="#6c5cff" />
      <Artifact animate={animate} />
    </Canvas>
  );
}
