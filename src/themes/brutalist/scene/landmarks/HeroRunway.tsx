
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh, MeshStandardMaterial } from "three";

import type { Placement } from "./placement";
import { C, flat } from "./materials";
import { Placed } from "./parts/Placed";
import { Arc } from "./parts/Arc";
import { RunwayStrip } from "./parts/RunwayStrip";
import { useScene } from "../state/scene-context";

type Props = {
  placement: Placement;
};

/* ============================================================
   CONFIG
============================================================ */

const RUNWAY_LENGTH = 520;
const RUNWAY_WIDTH = 56;

const HANGAR_S = -120;
const HANGAR_Z = -95;

const WINDSOCK_S = 150;
const WINDSOCK_Z = -58;

/* ============================================================
   PREMIUM MATERIALS
============================================================ */

function useHeroMaterials() {
  return useMemo(
    () => ({
      cream: flat(C.cream, {
        roughness: 0.82,
        metalness: 0.03,
      }),

      creamLight: flat(C.cream, {
        roughness: 0.62,
        metalness: 0.04,
      }),

      red: flat(C.red, {
        roughness: 0.56,
        metalness: 0.08,
      }),

      redDark: flat(C.red, {
        roughness: 0.76,
        metalness: 0.03,
      }),

      navy: flat(C.navy, {
        roughness: 0.88,
        metalness: 0.08,
      }),

      navySoft: flat(C.navy, {
        roughness: 0.68,
        metalness: 0.12,
      }),

      white: flat(C.white, {
        roughness: 0.52,
        metalness: 0.04,
      }),

      orange: flat(C.orange, {
        roughness: 0.5,
        metalness: 0.06,
      }),

      beacon: flat(C.orange, {
        roughness: 0.24,
        metalness: 0.08,
        emissive: C.orange,
        emissiveIntensity: 1.15,
      }),

      dark: flat("#141211", {
        roughness: 0.96,
        metalness: 0.01,
      }),

      glass: flat(C.glass, {
        transparent: true,
        opacity: 0.68,
        roughness: 0.18,
        metalness: 0.2,
        emissive: C.glass,
        emissiveIntensity: 0.08,
      }),

      hangarDoor: flat(C.navy, {
        roughness: 0.72,
        metalness: 0.12,
      }),
    }),
    [],
  );
}

/* ============================================================
   HANGAR
============================================================ */

function Hangar({
  materials,
}: {
  materials: ReturnType<typeof useHeroMaterials>;
}) {
  const doorGlow = useRef<Mesh>(null);
  const doorMaterial =
    useRef<MeshStandardMaterial>(null);

  useFrame((state) => {
    const pulse =
      0.11 +
      Math.sin(state.clock.elapsedTime * 0.75) *
        0.025;

    if (doorMaterial.current) {
      doorMaterial.current.emissiveIntensity =
        pulse;
    }
  });

  return (
    <group>
      {/* ======================================================
          MAIN HANGAR BODY
      ====================================================== */}

      <mesh
        material={materials.cream}
        position={[0, 12, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[80, 34, 52]}
        />
      </mesh>

      {/* Main side extension */}
      <mesh
        material={materials.creamLight}
        position={[-30, 12, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[26, 28, 58]}
        />
      </mesh>

      {/* ======================================================
          ROOF
      ====================================================== */}

      <mesh
        material={materials.red}
        position={[0, 42, 0]}
        rotation={[0, Math.PI / 4, 0]}
        scale={[1.25, 1, 0.86]}
        castShadow
      >
        <coneGeometry
          args={[42, 22, 4]}
        />
      </mesh>

      {/* Roof cap */}
      <mesh
        material={materials.redDark}
        position={[0, 53, 0]}
        rotation={[0, Math.PI / 4, 0]}
      >
        <boxGeometry
          args={[15, 3, 15]}
        />
      </mesh>

      {/* ======================================================
          FRONT PORTAL
      ====================================================== */}

      <mesh
        material={materials.navySoft}
        position={[41.5, 10, 0]}
        castShadow
      >
        <boxGeometry
          args={[2.5, 28, 38]}
        />
      </mesh>

      {/* Hangar opening */}
      <mesh
        ref={doorGlow}
        position={[42.5, 10, 0]}
      >
        <boxGeometry
          args={[1.2, 21, 31]}
        />

        <meshStandardMaterial
          ref={doorMaterial}
          color={C.navy}
          emissive={C.navy}
          emissiveIntensity={0.11}
          roughness={0.58}
          metalness={0.16}
        />
      </mesh>

      {/* Door frame */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          material={materials.red}
          position={[
            43,
            10,
            side * 18,
          ]}
        >
          <boxGeometry
            args={[3, 25, 3]}
          />
        </mesh>
      ))}

      <mesh
        material={materials.red}
        position={[43, 23, 0]}
      >
        <boxGeometry
          args={[3, 3, 39]}
        />
      </mesh>

      {/* ======================================================
          HANGAR WINDOWS
      ====================================================== */}

      {[-17, 0, 17].map((z) => (
        <mesh
          key={z}
          material={materials.glass}
          position={[
            42.7,
            28,
            z,
          ]}
        >
          <boxGeometry
            args={[1.1, 5.5, 11]}
          />
        </mesh>
      ))}

      {/* ======================================================
          SIDE STRIPE
      ====================================================== */}

      <mesh
        material={materials.navy}
        position={[
          -0.5,
          14,
          26.6,
        ]}
      >
        <boxGeometry
          args={[68, 11, 2.2]}
        />
      </mesh>

      <mesh
        material={materials.red}
        position={[
          -2,
          14,
          27.8,
        ]}
      >
        <boxGeometry
          args={[42, 2.4, 1.2]}
        />
      </mesh>

      {/* ======================================================
          HANGAR FOUNDATION
      ====================================================== */}

      <mesh
        material={materials.dark}
        position={[0, -5, 0]}
        receiveShadow
      >
        <boxGeometry
          args={[88, 2, 62]}
        />
      </mesh>

      {/* Small entrance block */}
      <mesh
        material={materials.white}
        position={[24, 0, 34]}
        castShadow
      >
        <boxGeometry
          args={[24, 8, 11]}
        />
      </mesh>

      {/* Entrance light */}
      <mesh
        material={materials.beacon}
        position={[34, 6, 40]}
      >
        <sphereGeometry
          args={[2.2, 8, 6]}
        />
      </mesh>
    </group>
  );
}

/* ============================================================
   WINDSOCK
============================================================ */

function Windsock({
  materials,
  sock,
}: {
  materials: ReturnType<typeof useHeroMaterials>;
  sock: React.RefObject<Group | null>;
}) {
  return (
    <group>
      {/* Mast */}
      <mesh
        material={materials.white}
        position={[0, 20, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[1.2, 1.45, 50, 8]}
        />
      </mesh>

      {/* Mast base */}
      <mesh
        material={materials.dark}
        position={[0, -3, 0]}
        receiveShadow
      >
        <cylinderGeometry
          args={[4.2, 5.2, 5, 8]}
        />
      </mesh>

      {/* Support braces */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          material={materials.navy}
          position={[
            side * 3.3,
            5,
            0,
          ]}
          rotation={[
            0,
            0,
            side * -0.38,
          ]}
        >
          <boxGeometry
            args={[1.2, 10, 1.2]}
          />
        </mesh>
      ))}

      {/* ======================================================
          WINDSOCK HEAD
      ====================================================== */}

      <group
        ref={sock}
        position={[0, 45, 0]}
      >
        {/* Circular mounting ring */}
        <mesh
          material={materials.dark}
          rotation={[
            0,
            0,
            Math.PI / 2,
          ]}
        >
          <torusGeometry
            args={[6, 1.15, 7, 20]}
          />
        </mesh>

        {/* Main sock */}
        <mesh
          material={materials.orange}
          position={[10, 0, 0]}
          rotation={[
            0,
            0,
            -Math.PI / 2,
          ]}
          castShadow
        >
          <coneGeometry
            args={[6, 24, 10, 3, true]}
          />
        </mesh>

        {/* White band */}
        <mesh
          material={materials.white}
          position={[15, 0, 0]}
          rotation={[
            0,
            0,
            -Math.PI / 2,
          ]}
        >
          <cylinderGeometry
            args={[5.05, 4.1, 4.5, 10, 1, true]}
          />
        </mesh>

        {/* Outer orange tip */}
        <mesh
          material={materials.orange}
          position={[21, 0, 0]}
          rotation={[
            0,
            0,
            -Math.PI / 2,
          ]}
        >
          <coneGeometry
            args={[4.4, 8, 10, 2, true]}
          />
        </mesh>

        {/* Small signal light */}
        <mesh
          material={materials.beacon}
          position={[4, 0, 0]}
        >
          <sphereGeometry
            args={[1.7, 8, 6]}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ============================================================
   HERO RUNWAY
============================================================ */

/**
 * Hero → "Takeoff"
 *
 * World landmark hierarchy:
 *
 *               WINDSOCK
 *                  │
 *                  │
 *        ┌──────────────────┐
 *        │      HANGAR      │
 *        └──────────────────┘
 *
 * ══════════════════════════════════
 *           TAKEOFF RUNWAY
 * ══════════════════════════════════
 *
 * At progress ~0 this is the visual starting
 * point of the journey.
 */
export function HeroRunway({
  placement,
}: Props) {
  const { journey } = useScene();

  const materials = useHeroMaterials();

  const sock = useRef<Group>(null);

  /* ============================================================
     WINDSOCK MOTION
  ============================================================ */

  useFrame((state, rawDt) => {
    if (!sock.current) return;

    if (journey.reducedMotion) {
      sock.current.rotation.y = 0;
      sock.current.rotation.z = 0;
      return;
    }

    const dt = Math.min(
      rawDt,
      0.05,
    );

    const t =
      state.clock.elapsedTime;

    /*
     * Wind direction:
     * smooth horizontal sway + tiny pitch movement.
     */
    const wind =
      Math.sin(t * 1.15) * 0.32;

    const secondary =
      Math.sin(t * 2.05) * 0.06;

    sock.current.rotation.y =
      wind + secondary;

    /*
     * Slight vertical/forward flutter.
     */
    sock.current.rotation.z =
      Math.sin(t * 1.6) * 0.045;

    /*
     * Small smoothing influence from frame time.
     */
    sock.current.rotation.y *=
      Math.min(
        1,
        40 * dt,
      );
  });

  return (
    <Placed p={placement}>
      {/* ======================================================
          PRIMARY RUNWAY
      ====================================================== */}

      <RunwayStrip
        length={RUNWAY_LENGTH}
        width={RUNWAY_WIDTH}
        lit
      />

      {/* ======================================================
          HANGAR
      ====================================================== */}

      <Arc
        s={HANGAR_S}
        z={HANGAR_Z}
      >
        <Hangar
          materials={materials}
        />
      </Arc>

      {/* ======================================================
          WINDSOCK
      ====================================================== */}

      <Arc
        s={WINDSOCK_S}
        z={WINDSOCK_Z}
      >
        <Windsock
          materials={materials}
          sock={sock}
        />
      </Arc>

      {/* ======================================================
          RUNWAY SIDE MARKERS
      ====================================================== */}

      <Arc
        s={-205}
        z={42}
      >
        <mesh
          material={materials.white}
          position={[0, -1.8, 0]}
        >
          <boxGeometry
            args={[18, 0.7, 2]}
          />
        </mesh>
      </Arc>

      <Arc
        s={-145}
        z={42}
      >
        <mesh
          material={materials.white}
          position={[0, -1.8, 0]}
        >
          <boxGeometry
            args={[12, 0.7, 2]}
          />
        </mesh>
      </Arc>

      <Arc
        s={205}
        z={-42}
      >
        <mesh
          material={materials.white}
          position={[0, -1.8, 0]}
        >
          <boxGeometry
            args={[18, 0.7, 2]}
          />
        </mesh>
      </Arc>

      {/* ======================================================
          SMALL RUNWAY APPROACH LIGHTS
      ====================================================== */}

      {[-185, -120, 120, 185].map(
        (s, index) => (
          <Arc
            key={s}
            s={s}
            z={
              index % 2 === 0
                ? 38
                : -38
            }
          >
            <mesh
              material={
                materials.beacon
              }
              position={[
                0,
                -1.2,
                0,
              ]}
            >
              <sphereGeometry
                args={[
                  1.7,
                  8,
                  6,
                ]}
              />
            </mesh>
          </Arc>
        ),
      )}

      {/* ======================================================
          HANGAR SIDE POLES
      ====================================================== */}

      <Arc
        s={-92}
        z={-132}
      >
        <mesh
          material={materials.white}
          position={[0, 14, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[1.1, 1.3, 30, 7]}
          />
        </mesh>

        <mesh
          material={materials.beacon}
          position={[0, 30, 0]}
        >
          <sphereGeometry
            args={[2.1, 8, 6]}
          />
        </mesh>
      </Arc>

      {/* ======================================================
          SECONDARY HANGAR MARKER
      ====================================================== */}

      <Arc
        s={-52}
        z={-132}
      >
        <mesh
          material={materials.white}
          position={[0, 10, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[1, 1.2, 22, 7]}
          />
        </mesh>

        <mesh
          material={materials.red}
          position={[0, 22, 0]}
        >
          <coneGeometry
            args={[3, 5, 6]}
          />
        </mesh>
      </Arc>
    </Placed>
  );
}
