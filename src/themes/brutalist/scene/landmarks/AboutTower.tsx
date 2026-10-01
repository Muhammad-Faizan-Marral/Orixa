
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type {
  Group,
  Mesh,
  MeshStandardMaterial,
} from "three";

import type { Placement } from "./placement";
import { C, flat } from "./materials";
import { Placed } from "./parts/Placed";
import { useScene } from "../state/scene-context";
import { activeness } from "../lib/journey-math";

type Props = {
  placement: Placement;
};

const BEACON_SPEED = 3.4;
const RADAR_SPEED = 1.6;

/**
 * Premium "Control Tower" landmark.
 *
 * Design language:
 * - Brutalist architectural base
 * - Tapered central tower
 * - Floating glass command deck
 * - Layered observation rings
 * - Rotating radar assembly
 * - High-visibility aviation beacon
 * - Subtle responsive emissive glass
 *
 * The object remains fully procedural and continues to use
 * the existing Placement / Placed journey architecture.
 */
export function AboutTower({ placement }: Props) {
  const { journey } = useScene();

  const radar = useRef<Group>(null);
  const beacon = useRef<Mesh>(null);
  const beaconMaterial =
    useRef<MeshStandardMaterial>(null);

  const glassMaterial =
    useRef<MeshStandardMaterial>(null);

  const accentMaterial =
    useRef<MeshStandardMaterial>(null);

  /* ============================================================
     MATERIAL SYSTEM
  ============================================================ */

  const materials = useMemo(
    () => ({
      steel: flat(C.steel, {
        roughness: 0.76,
        metalness: 0.24,
      }),

      steelDark: flat(C.steel, {
        roughness: 0.9,
        metalness: 0.08,
      }),

      steelSoft: flat(C.steel, {
        roughness: 0.58,
        metalness: 0.32,
      }),

      white: flat(C.white, {
        roughness: 0.6,
        metalness: 0.08,
      }),

      red: flat(C.red, {
        roughness: 0.54,
        metalness: 0.1,
      }),

      redDark: flat(C.red, {
        roughness: 0.72,
        metalness: 0.04,
      }),

      black: flat("#141211", {
        roughness: 0.94,
        metalness: 0,
      }),

      glass: flat(C.glass, {
        transparent: true,
        opacity: 0.76,
        roughness: 0.22,
        metalness: 0.2,

        emissive: C.glass,
        emissiveIntensity: 0.08,
      }),

      glassDark: flat("#6E7778", {
        transparent: true,
        opacity: 0.48,
        roughness: 0.18,
        metalness: 0.28,
      }),

      glow: flat(C.red, {
        roughness: 0.24,
        metalness: 0.08,

        emissive: "#ff2819",
        emissiveIntensity: 1.8,
      }),

      signal: flat("#F2C26B", {
        roughness: 0.28,
        metalness: 0.2,

        emissive: "#F2A83B",
        emissiveIntensity: 1.1,
      }),
    }),
    [],
  );

  /* ============================================================
     ANIMATION
  ============================================================ */

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const t = state.clock.elapsedTime;

    const active = activeness(
      journey.progress,
      placement.progress,
      placement.width,
    );

    /* ----------------------------------------------------------
       Radar
    ---------------------------------------------------------- */

    if (
      radar.current &&
      !journey.reducedMotion
    ) {
      radar.current.rotation.y +=
        dt * RADAR_SPEED * (0.55 + active * 0.9);
    }

    /* ----------------------------------------------------------
       Beacon
    ---------------------------------------------------------- */

    const pulse = journey.reducedMotion
      ? 0.78
      : Math.max(
          0.16,
          Math.sin(t * BEACON_SPEED),
        );

    const beaconIntensity =
      0.55 + pulse * 1.75;

    if (beaconMaterial.current) {
      beaconMaterial.current.emissiveIntensity =
        beaconIntensity;
    }

    if (beacon.current) {
      const scale =
        0.9 +
        Math.max(0, pulse) * 0.28;

      beacon.current.scale.setScalar(scale);

      /*
       * Keep the beacon always present. The original
       * visible toggle felt harsh; emissive breathing
       * creates a more premium signal-light effect.
       */
      beacon.current.visible = true;
    }

    /* ----------------------------------------------------------
       Glass
    ---------------------------------------------------------- */

    if (glassMaterial.current) {
      glassMaterial.current.emissiveIntensity =
        0.07 +
        active * 0.95;

      glassMaterial.current.opacity =
        0.58 +
        active * 0.18;
    }

    /* ----------------------------------------------------------
       Accent / active state
    ---------------------------------------------------------- */

    if (accentMaterial.current) {
      accentMaterial.current.emissiveIntensity =
        0.2 + active * 1.0;
    }
  });

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <Placed p={placement}>
      {/* ======================================================
          FOUNDATION
      ====================================================== */}

      <mesh
        material={materials.steelDark}
        position={[0, 3, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[102, 14, 102]}
        />
      </mesh>

      {/* Foundation upper slab */}
      <mesh
        material={materials.white}
        position={[0, 11, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[88, 5, 88]}
        />
      </mesh>

      {/* Foundation dark inset */}
      <mesh
        material={materials.black}
        position={[0, 14, 0]}
        receiveShadow
      >
        <boxGeometry
          args={[72, 3, 72]}
        />
      </mesh>

      {/* Corner architectural pillars */}
      {[
        [-40, -40],
        [-40, 40],
        [40, -40],
        [40, 40],
      ].map(([x, z]) => (
        <mesh
          key={`${x}-${z}`}
          material={materials.steel}
          position={[x, 16, z]}
          castShadow
        >
          <boxGeometry
            args={[10, 12, 10]}
          />
        </mesh>
      ))}

      {/* ======================================================
          LOWER TOWER
      ====================================================== */}

      <mesh
        material={materials.steel}
        position={[0, 47, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[60, 72, 60]}
        />
      </mesh>

      {/* Front vertical panel */}
      <mesh
        material={materials.white}
        position={[0, 48, 31]}
        castShadow
      >
        <boxGeometry
          args={[38, 64, 3]}
        />
      </mesh>

      {/* Side vertical panel */}
      <mesh
        material={materials.white}
        position={[31, 48, 0]}
        castShadow
      >
        <boxGeometry
          args={[3, 64, 38]}
        />
      </mesh>

      {/* Vertical red architectural stripe */}
      <mesh
        material={materials.red}
        position={[0, 48, 33]}
        castShadow
      >
        <boxGeometry
          args={[5, 68, 2]}
        />
      </mesh>

      {/* Lower dark service band */}
      <mesh
        material={materials.black}
        position={[0, 22, 31.5]}
      >
        <boxGeometry
          args={[42, 5, 2]}
        />
      </mesh>

      {/* ======================================================
          TAPERED OBSERVATION SHAFT
      ====================================================== */}

      <mesh
        material={materials.white}
        position={[0, 92, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[21, 31, 82, 8]}
        />
      </mesh>

      {/* Carbon inner shaft */}
      <mesh
        material={materials.black}
        position={[0, 93, 0]}
      >
        <cylinderGeometry
          args={[15, 24, 72, 8]}
        />
      </mesh>

      {/* Red vertical support */}
      <mesh
        material={materials.redDark}
        position={[0, 92, 24]}
        castShadow
      >
        <boxGeometry
          args={[4, 74, 4]}
        />
      </mesh>

      {/* ======================================================
          OBSERVATION RING
      ====================================================== */}

      <mesh
        material={materials.steelDark}
        position={[0, 130, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[38, 38, 7, 32]}
        />
      </mesh>

      <mesh
        material={materials.white}
        position={[0, 134, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[34, 34, 4, 32]}
        />
      </mesh>

      {/* ======================================================
          GLASS COMMAND DECK
      ====================================================== */}

      <mesh
        position={[0, 150, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[31, 34, 28, 12]}
        />

        <meshStandardMaterial
          ref={glassMaterial}
          color={C.glass}
          emissive={C.glass}
          emissiveIntensity={0.08}
          flatShading
          transparent
          opacity={0.76}
          roughness={0.22}
          metalness={0.2}
        />
      </mesh>

      {/* Dark lower glass belt */}
      <mesh
        material={materials.glassDark}
        position={[0, 139, 0]}
      >
        <cylinderGeometry
          args={[34, 34, 5, 12]}
        />
      </mesh>

      {/* Glass top ring */}
      <mesh
        material={materials.steelSoft}
        position={[0, 164, 0]}
        castShadow
      >
        <torusGeometry
          args={[30, 2.8, 8, 32]}
        />
      </mesh>

      {/* Glass vertical mullions */}
      {Array.from(
        { length: 12 },
        (_, i) => {
          const angle =
            (i / 12) * Math.PI * 2;

          const radius = 31;

          return (
            <mesh
              key={i}
              material={
                i % 3 === 0
                  ? materials.red
                  : materials.steelSoft
              }
              position={[
                Math.cos(angle) * radius,
                150,
                Math.sin(angle) * radius,
              ]}
              rotation={[
                0,
                -angle,
                0,
              ]}
            >
              <boxGeometry
                args={[1.5, 25, 2.4]}
              />
            </mesh>
          );
        },
      )}

      {/* ======================================================
          COMMAND ROOF
      ====================================================== */}

      <mesh
        material={materials.red}
        position={[0, 171, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[33, 25, 14, 8]}
        />
      </mesh>

      {/* Roof dark inset */}
      <mesh
        material={materials.black}
        position={[0, 178, 0]}
      >
        <cylinderGeometry
          args={[24, 24, 3, 24]}
        />
      </mesh>

      {/* ======================================================
          RADAR MAST
      ====================================================== */}

      <mesh
        material={materials.white}
        position={[0, 198, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[2.2, 3.2, 38, 10]}
        />
      </mesh>

      <mesh
        material={materials.red}
        position={[0, 214, 0]}
      >
        <cylinderGeometry
          args={[1.2, 1.2, 8, 8]}
        />
      </mesh>

      {/* ======================================================
          ROTATING RADAR
      ====================================================== */}

      <group
        ref={radar}
        position={[0, 190, 0]}
      >
        {/* Radar hub */}
        <mesh
          material={materials.steelSoft}
          castShadow
        >
          <cylinderGeometry
            args={[6, 6, 8, 16]}
          />
        </mesh>

        {/* Main horizontal arm */}
        <mesh
          material={materials.steel}
          position={[17, 0, 0]}
          castShadow
        >
          <boxGeometry
            args={[36, 2.8, 4]}
          />
        </mesh>

        {/* Radar counterweight */}
        <mesh
          material={materials.black}
          position={[-13, 0, 0]}
        >
          <boxGeometry
            args={[10, 4, 6]}
          />
        </mesh>

        {/* Radar dish */}
        <mesh
          material={materials.white}
          position={[35, 4, 0]}
          rotation={[
            0,
            0.28,
            -0.18,
          ]}
          castShadow
        >
          <coneGeometry
            args={[10, 17, 10, 1, true]}
          />
        </mesh>

        {/* Radar dish center */}
        <mesh
          material={materials.red}
          position={[42, 7, 0]}
          rotation={[
            0,
            0.28,
            -0.18,
          ]}
        >
          <sphereGeometry
            args={[2.7, 10, 8]}
          />
        </mesh>

        {/* Receiver arm */}
        <mesh
          material={materials.steelSoft}
          position={[44, 10, 0]}
          rotation={[
            0,
            0.28,
            0.08,
          ]}
        >
          <boxGeometry
            args={[15, 1.6, 2]}
          />
        </mesh>
      </group>

      {/* ======================================================
          TOP BEACON
      ====================================================== */}

      <mesh
        material={materials.white}
        position={[0, 219, 0]}
      >
        <cylinderGeometry
          args={[1.1, 1.1, 9, 8]}
        />
      </mesh>

      <mesh
        ref={beacon}
        position={[0, 226, 0]}
      >
        <sphereGeometry
          args={[4.4, 12, 8]}
        />

        <meshStandardMaterial
          ref={beaconMaterial}
          color={C.red}
          emissive="#ff2819"
          emissiveIntensity={1.8}
          roughness={0.22}
          metalness={0.08}
        />
      </mesh>

      {/* Beacon halo */}
      <mesh
        material={materials.glow}
        position={[0, 226, 0]}
        scale={1.8}
      >
        <sphereGeometry
          args={[4.5, 12, 8]}
        />
      </mesh>

      {/* ======================================================
          SIGNAL LIGHTS
      ====================================================== */}

      {[
        [0, 178, 25],
        [25, 178, 0],
        [0, 178, -25],
        [-25, 178, 0],
      ].map(([x, y, z], index) => (
        <mesh
          key={index}
          material={
            index % 2 === 0
              ? materials.signal
              : materials.red
          }
          position={[x, y, z]}
        >
          <sphereGeometry
            args={[2.2, 8, 6]}
          />
        </mesh>
      ))}

      {/* ======================================================
          SMALL ARCHITECTURAL ACCENTS
      ====================================================== */}

      <mesh
        ref={accentMaterial.current ? undefined : undefined}
        material={materials.red}
        position={[0, 122, 28]}
        castShadow
      >
        <boxGeometry
          args={[18, 4, 3]}
        />
      </mesh>

      <mesh
        material={materials.steelSoft}
        position={[0, 118, 27]}
      >
        <boxGeometry
          args={[8, 2, 2]}
        />
      </mesh>

      {/* Corner lights beneath command deck */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          material={materials.signal}
          position={[
            side * 27,
            128,
            0,
          ]}
        >
          <sphereGeometry
            args={[1.8, 8, 6]}
          />
        </mesh>
      ))}
    </Placed>
  );
}