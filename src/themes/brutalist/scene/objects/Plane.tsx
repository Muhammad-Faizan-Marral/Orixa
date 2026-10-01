"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
} from "three";

import { reshape } from "../lib/geometry";
import {
  GROUND_X,
  ROTATE_PITCH,
  airFactor,
  flightPlanOf,
  flightSlope,
  groundPitch,
  planeHeight,
  planeX,
  rotationBump,
} from "../lib/flight";
import { damp, lerp, mapRange, smoothstep } from "../lib/journey-math";
import { useScene } from "../state/scene-context";
const C = {
  // Vintage aviation palette
  body: "#D95A43",
  bodyDeep: "#963C31",
  bodyDark: "#6F2D27",

  ivory: "#EFE7DC",
  ivorySoft: "#D8CEC0",

  carbon: "#161413",
  carbonSoft: "#292421",

  brass: "#A67A52",
  brassBright: "#C49A6C",

  metal: "#AAA39B",
  metalDark: "#5E5852",

  glass: "#8EA9AE",
  glassDark: "#40565A",

  glow: "#F58A63",
  warmGlow: "#FFD0A8",

  wheel: "#0E0D0C",

  stripe: "#F2B18D",
};

const flat = (
  color: string,
  extra: ConstructorParameters<typeof MeshStandardMaterial>[0] = {},
) =>
  new MeshStandardMaterial({
    color,
    flatShading: true,
    roughness: 0.82,
    metalness: 0.08,
    ...extra,
  });

const IDLE_AFTER_MS = 2500;

export function Plane() {
    const { journey, model } = useScene();
  const plan = useMemo(() => flightPlanOf(model.stations), [model.stations]);
 

  const root = useRef<Group>(null);
  const propeller = useRef<Group>(null);
  const cockpitGlow = useRef<Mesh>(null);
  const navigationGlow = useRef<Mesh>(null);

  const m = useMemo(
    () => ({
      body: flat(C.body, {
        roughness: 0.62,
        metalness: 0.12,
      }),

      bodyDeep: flat(C.bodyDeep, {
        roughness: 0.68,
        metalness: 0.1,
      }),

      bodyDark: flat(C.bodyDark, {
        roughness: 0.72,
        metalness: 0.08,
      }),

      ivory: flat(C.ivory, {
        roughness: 0.74,
        metalness: 0.03,
      }),

      ivorySoft: flat(C.ivorySoft, {
        roughness: 0.8,
        metalness: 0.02,
      }),

      carbon: flat(C.carbon, {
        roughness: 0.94,
        metalness: 0,
      }),

      carbonSoft: flat(C.carbonSoft, {
        roughness: 0.9,
        metalness: 0.02,
      }),

      brass: flat(C.brass, {
        roughness: 0.48,
        metalness: 0.58,
      }),

      brassBright: flat(C.brassBright, {
        roughness: 0.36,
        metalness: 0.72,
      }),

      metal: flat(C.metal, {
        roughness: 0.3,
        metalness: 0.78,
      }),

      metalDark: flat(C.metalDark, {
        roughness: 0.56,
        metalness: 0.55,
      }),

      glass: flat(C.glass, {
        transparent: true,
        opacity: 0.3,
        roughness: 0.08,
        metalness: 0.2,
      }),

      glassDark: flat(C.glassDark, {
        transparent: true,
        opacity: 0.5,
        roughness: 0.12,
        metalness: 0.18,
      }),

      glow: flat(C.glow, {
        emissive: C.glow,
        emissiveIntensity: 1.1,
        roughness: 0.32,
        metalness: 0.1,
      }),

      warmGlow: flat(C.warmGlow, {
        emissive: C.warmGlow,
        emissiveIntensity: 0.9,
        roughness: 0.3,
        metalness: 0.08,
      }),

      stripe: flat(C.stripe, {
        roughness: 0.66,
        metalness: 0.08,
      }),

      wheel: flat(C.wheel, {
        roughness: 0.98,
        metalness: 0,
      }),
    }),
    [],
  );

  const g = useMemo(
    () => ({
      /**
       * Main fuselage
       * Long central body with softened nose and tapered rear.
       */
      fuselage: reshape(new BoxGeometry(112, 44, 42), (v) => {
        const front = Math.max(0, (v.x + 56) / 112);

        v.z *= 0.7 + front * 0.3;

        if (v.x > 28) {
          v.y *= 0.84;
        }

        if (v.x < -34) {
          v.y *= 0.88;
          v.z *= 0.9;
        }
      }),

      /**
       * Rear housing.
       */
      tailBody: reshape(new BoxGeometry(46, 33, 38), (v) => {
        if (v.x < 0) {
          v.z *= 0.72;
          v.y *= 0.88;
        }
      }),

      /**
       * Main swept wing.
       */
      wing: reshape(new BoxGeometry(56, 5, 178), (v) => {
        const side = Math.abs(v.z) / 89;

        v.y *= 0.94 - side * 0.18;
        v.x -= side * 8;
      }),

      /**
       * Tail stabilizer.
       */
      stabilizer: reshape(new BoxGeometry(32, 4, 88), (v) => {
        const side = Math.abs(v.z) / 44;

        v.x -= side * 5;
      }),

      /**
       * Vertical tail.
       */
      fin: reshape(new BoxGeometry(34, 50, 7), (v) => {
        if (v.x < 0) {
          v.y *= 0.68;
        }

        if (v.y > 0) {
          v.x -= (v.y / 25) * 5.5;
        }
      }),

      propellerHub: new CylinderGeometry(8.5, 8.5, 17, 20),
      engineRing: new CylinderGeometry(15, 15, 7, 24),
      noseRing: new CylinderGeometry(11, 11, 5, 24),

      canopy: new SphereGeometry(1, 28, 18),
    }),
    [],
  );

  const pos = useRef({
    x: -40,
    y: 110,
    tx: -40,
    ty: 110,
  });

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const p = pos.current;
    const t = state.clock.elapsedTime;
    const progress = journey.progress;

    const active =
      !journey.reducedMotion &&
      performance.now() - journey.pointerAt < IDLE_AFTER_MS;

    const px = active
      ? journey.pointer.x
      : journey.reducedMotion
        ? 0
        : Math.sin(t * 0.6) * 0.45;

    const py = active
      ? journey.pointer.y
      : journey.reducedMotion
        ? 0
        : Math.sin(t * 0.9) * 0.3 + 0.1;

    p.tx = mapRange(px, -0.75, 0.75, -100, -20);
    p.ty = mapRange(py, -0.75, 0.75, 50, 190);

    p.x = damp(p.x, p.tx, 5.2, dt);
    p.y = damp(p.y, p.ty, 5.2, dt);

    /* TAKEOFF / LANDING: a = 0 runway par, a = 1 poori tarah hawa me */
    const a = airFactor(progress, plan);
    const x = planeX(p.x, a);
    const baseY = planeHeight(progress, p.y, p.x, plan);

    /* zameen par scroll karte waqt halka engine rumble */
    const moving = Math.min(1, Math.abs(journey.velocity) * 40);
    const onGround = 1 - smoothstep(0, 0.12, a);
    const rumble = journey.reducedMotion
      ? 0
      : (Math.sin(t * 47) * 0.16 + Math.sin(t * 31 + 1.3) * 0.12) * onGround * moving;

    /* pitch: zameen par 3-point attitude (+ takeoff rotation), hawa me path angle ke saath */
    const pathPitch = Math.atan(flightSlope(progress, p.y, p.x, plan));
    const groundAttitude =
      groundPitch(x) + rotationBump(progress, plan) * ROTATE_PITCH;
    const airAttitude = pathPitch * 0.9 + (p.ty - p.y) * 0.01;
    const pitch = lerp(groundAttitude, airAttitude, smoothstep(0, 0.35, a));

    const r = root.current;

    if (r) {
      r.position.set(x, baseY + rumble, -250);

      /* Aircraft banking, sirf hawa me */
      r.rotation.z = pitch;
      r.rotation.x = (p.y - p.ty) * 0.0045 * a;
      r.rotation.y = (p.x - p.tx) * 0.006 * a;

      if (!active && !journey.reducedMotion) {
        r.rotation.z += Math.sin(t * 0.8) * 0.008 * a;
        r.rotation.y += Math.sin(t * 0.55) * 0.006 * a;
        r.position.y += Math.sin(t * 0.9) * 0.35 * a;
      }
    }

    /* Propeller: zameen par idle, scroll shuru hote hi full power */
    if (propeller.current) {
      const boost = 1 + Math.min(Math.abs(journey.velocity) * 6, 2.4);
      const throttle = Math.max(a, moving);

      propeller.current.rotation.x += lerp(7, 20, throttle) * dt * boost;
    }

    /* Soft cockpit pulse */
    if (cockpitGlow.current && !journey.reducedMotion) {
      const pulse = 0.78 + Math.sin(t * 1.7) * 0.12;
      const material = cockpitGlow.current.material as MeshStandardMaterial;
      material.emissiveIntensity = pulse;
    }

    /* Navigation light pulse */
    if (navigationGlow.current && !journey.reducedMotion) {
      const material = navigationGlow.current.material as MeshStandardMaterial;
      material.emissiveIntensity = 0.65 + Math.sin(t * 3.2) * 0.25;
    }
  });
  const shadow = {
    castShadow: true,
    receiveShadow: true,
  } as const;

  return (
    <group
      ref={root}
      scale={0.5}
       position={[GROUND_X, 22, -250]}
      rotation={[0, 0, 0]}
    >
      {/* =========================================================
          FUSELAGE
      ========================================================= */}

      <mesh
        {...shadow}
        geometry={g.fuselage}
        material={m.body}
      />

      <mesh
        {...shadow}
        geometry={g.tailBody}
        material={m.bodyDeep}
        position={[-48, 0, 0]}
      />

      {/* Lower belly */}
      <mesh
        {...shadow}
        material={m.carbonSoft}
        position={[0, -21, 0]}
      >
        <boxGeometry args={[78, 7, 29]} />
      </mesh>

      {/* Belly trim */}
      <mesh
        {...shadow}
        material={m.brass}
        position={[-2, -25, 0]}
      >
        <boxGeometry args={[60, 2, 18]} />
      </mesh>

      {/* Upper center spine */}
      <mesh
        {...shadow}
        material={m.ivory}
        position={[-3, 12, 0]}
      >
        <boxGeometry args={[80, 5, 21]} />
      </mesh>

      {/* Signature orange spine */}
      <mesh
        {...shadow}
        material={m.stripe}
        position={[-4, 15.5, 0]}
      >
        <boxGeometry args={[73, 2, 25]} />
      </mesh>

      {/* Dark underside line */}
      <mesh
        {...shadow}
        material={m.bodyDark}
        position={[-3, -14, 0]}
      >
        <boxGeometry args={[72, 3, 33]} />
      </mesh>

      {/* =========================================================
          COCKPIT
      ========================================================= */}

      {/* warm reflection behind canopy */}
      <mesh
        ref={cockpitGlow}
        material={m.glow}
        position={[8, 27, 0]}
        scale={[17, 8, 22]}
      >
        <sphereGeometry args={[1, 24, 16]} />
      </mesh>

      {/* smoked canopy */}
      <mesh
        {...shadow}
        geometry={g.canopy}
        material={m.glass}
        position={[8, 28, 0]}
        scale={[22, 10, 28]}
      />

      {/* Dark canopy base */}
      <mesh
        {...shadow}
        material={m.glassDark}
        position={[7, 23, 0]}
      >
        <boxGeometry args={[25, 4, 26]} />
      </mesh>

      {/* front canopy frame */}
      <mesh
        {...shadow}
        material={m.carbon}
        position={[21, 27, 0]}
      >
        <boxGeometry args={[4, 12, 27]} />
      </mesh>

      {/* rear canopy frame */}
      <mesh
        {...shadow}
        material={m.carbon}
        position={[-6, 29, 0]}
      >
        <boxGeometry args={[3, 8, 22]} />
      </mesh>

      {/* center canopy spine */}
      <mesh
        {...shadow}
        material={m.brass}
        position={[8, 35, 0]}
      >
        <boxGeometry args={[24, 2, 3]} />
      </mesh>

      {/* canopy side trims */}
      {[-1, 1].map((side) => (
        <mesh
          key={`canopy-trim-${side}`}
          {...shadow}
          material={m.brassBright}
          position={[7, 26, side * 24]}
          rotation={[0, 0, side * 0.05]}
        >
          <boxGeometry args={[24, 1.8, 2]} />
        </mesh>
      ))}

      {/* =========================================================
          WINGS
      ========================================================= */}

      <mesh
        {...shadow}
        geometry={g.wing}
        material={m.ivory}
        position={[1, 4, 0]}
      />

      {/* orange top wing stripe */}
      <mesh
        {...shadow}
        material={m.body}
        position={[0, 7, 0]}
      >
        <boxGeometry args={[46, 2, 156]} />
      </mesh>

      {/* central wing rib */}
      <mesh
        {...shadow}
        material={m.brass}
        position={[-4, 8.4, 0]}
      >
        <boxGeometry args={[7, 1.5, 148]} />
      </mesh>

      {/* lower carbon wing edge */}
      <mesh
        {...shadow}
        material={m.carbon}
        position={[1, 0, 0]}
      >
        <boxGeometry args={[38, 2, 154]} />
      </mesh>

      {/* Wingtip housings */}
      {[-1, 1].map((direction) => (
        <group key={`wingtip-${direction}`}>
          <mesh
            {...shadow}
            material={m.bodyDeep}
            position={[5, 5, direction * 84]}
            rotation={[0, 0, direction * -0.08]}
          >
            <boxGeometry args={[24, 4, 18]} />
          </mesh>

          {/* Brass cap */}
          <mesh
            {...shadow}
            material={m.brass}
            position={[9, 6.5, direction * 93]}
          >
            <boxGeometry args={[7, 2, 6]} />
          </mesh>

          {/* Navigation light */}
          <mesh
            ref={direction === 1 ? navigationGlow : undefined}
            material={m.warmGlow}
            position={[9, 7.5, direction * 97]}
          >
            <sphereGeometry args={[2.6, 12, 8]} />
          </mesh>
        </group>
      ))}

      {/* =========================================================
          TAIL
      ========================================================= */}

      <mesh
        {...shadow}
        geometry={g.stabilizer}
        material={m.ivory}
        position={[-39, 4, 0]}
      />

      <mesh
        {...shadow}
        material={m.body}
        position={[-39, 7, 0]}
      >
        <boxGeometry args={[24, 2, 74]} />
      </mesh>

      {/* Tail leading accents */}
      {[-1, 1].map((direction) => (
        <mesh
          key={`tail-accent-${direction}`}
          {...shadow}
          material={m.brass}
          position={[-40, 9, direction * 31]}
        >
          <boxGeometry args={[16, 2, 3]} />
        </mesh>
      ))}

      {/* Vertical fin */}
      <mesh
        {...shadow}
        geometry={g.fin}
        material={m.body}
        position={[-40, 24, 0]}
      />

      {/* Fin dark inset */}
      <mesh
        {...shadow}
        material={m.carbon}
        position={[-40, 36, 0]}
        rotation={[0, 0, -0.12]}
      >
        <boxGeometry args={[19, 3, 5]} />
      </mesh>

      {/* Fin brass badge */}
      <mesh
        {...shadow}
        material={m.brassBright}
        position={[-39, 21, 0]}
      >
        <boxGeometry args={[13, 3, 8]} />
      </mesh>

      {/* =========================================================
          ENGINE
      ========================================================= */}

      {/* Engine outer ring */}
      <mesh
        {...shadow}
        geometry={g.engineRing}
        material={m.brass}
        position={[56, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />

      {/* Engine dark housing */}
      <mesh
        {...shadow}
        material={m.carbon}
        position={[59.5, 0, 0]}
      >
        <cylinderGeometry args={[11, 11, 6, 24]} />
      </mesh>

      {/* Engine inner ring */}
      <mesh
        {...shadow}
        geometry={g.noseRing}
        material={m.metal}
        position={[62, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />

      {/* engine core */}
      <mesh
        {...shadow}
        material={m.warmGlow}
        position={[65, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <cylinderGeometry args={[4, 4, 3, 20]} />
      </mesh>

      {/* =========================================================
          PROPELLER
      ========================================================= */}

      <group
        ref={propeller}
        position={[67, 0, 0]}
      >
        {/* center hub */}
        <mesh
          {...shadow}
          geometry={g.propellerHub}
          material={m.brassBright}
          rotation={[0, 0, Math.PI / 2]}
        />

        {/* hub center */}
        <mesh
          {...shadow}
          material={m.metal}
          position={[9, 0, 0]}
        >
          <sphereGeometry args={[5, 16, 12]} />
        </mesh>

        {/* polished center cap */}
        <mesh
          {...shadow}
          material={m.brassBright}
          position={[11, 0, 0]}
        >
          <sphereGeometry args={[2.6, 14, 10]} />
        </mesh>

        {/* three blades */}
        {[0, 1, 2].map((index) => (
          <mesh
            key={index}
            {...shadow}
            material={index === 1 ? m.ivory : m.ivorySoft}
            position={[0, 0, 18]}
            rotation={[(index * Math.PI * 2) / 3, 0, 0]}
          >
            <boxGeometry args={[3, 6, 38]} />
          </mesh>
        ))}
      </group>


      <mesh
        {...shadow}
        material={m.brassBright}
        position={[43, 5, 0]}
      >
        <boxGeometry args={[11, 3, 22]} />
      </mesh>

      <mesh
        {...shadow}
        material={m.bodyDeep}
        position={[34, -17, 0]}
      >
        <boxGeometry args={[25, 5, 24]} />
      </mesh>

      {/* aerodynamic underside fin */}
      <mesh
        {...shadow}
        material={m.carbon}
        position={[35, -20, 0]}
        rotation={[0, 0, -0.1]}
      >
        <boxGeometry args={[13, 11, 6]} />
      </mesh>

      {/* =========================================================
          BODY PANELS
      ========================================================= */}

      {[-1, 1].map((side) => (
        <group key={`body-panel-${side}`}>
          {/* main brass panel line */}
          <mesh
            {...shadow}
            material={m.brass}
            position={[0, -1, side * 21]}
          >
            <boxGeometry args={[50, 2, 2]} />
          </mesh>

          {/* rear panel line */}
          <mesh
            {...shadow}
            material={m.bodyDark}
            position={[-35, 4, side * 18]}
          >
            <boxGeometry args={[23, 2, 2]} />
          </mesh>
        </group>
      ))}

      {/* =========================================================
          LANDING GEAR
      ========================================================= */}

      {[-1, 1].map((side) => (
        <group key={`main-gear-${side}`}>
          {/* strut */}
          <mesh
            {...shadow}
            material={m.brass}
            position={[18, -25, side * 24]}
            rotation={[0, 0, side * -0.16]}
          >
            <boxGeometry args={[5, 18, 5]} />
          </mesh>

          {/* fork */}
          <mesh
            {...shadow}
            material={m.metalDark}
            position={[18, -31, side * 24]}
          >
            <boxGeometry args={[4, 9, 4]} />
          </mesh>

          {/* tire */}
          <mesh
            {...shadow}
            material={m.wheel}
            position={[18, -35, side * 24]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[9, 9, 7, 24]} />
          </mesh>

          {/* tire hub */}
          <mesh
            {...shadow}
            material={m.metal}
            position={[18, -35, side * 24]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[4.2, 4.2, 7.5, 20]} />
          </mesh>

          {/* brass hub cap */}
          <mesh
            {...shadow}
            material={m.brass}
            position={[18, -35, side * 24.5]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[1.8, 1.8, 2, 16]} />
          </mesh>
        </group>
      ))}

      {/* =========================================================
          REAR WHEEL
      ========================================================= */}

      <mesh
        {...shadow}
        material={m.brass}
        position={[-37, -22, 0]}
        rotation={[0, 0, -0.24]}
      >
        <boxGeometry args={[5, 19, 5]} />
      </mesh>

      <mesh
        {...shadow}
        material={m.wheel}
        position={[-37, -33, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.7}
      >
        <cylinderGeometry args={[9, 9, 7, 24]} />
      </mesh>

      <mesh
        {...shadow}
        material={m.metal}
        position={[-37, -33, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.7}
      >
        <cylinderGeometry args={[4, 4, 7.5, 20]} />
      </mesh>

      {/* =========================================================
          SMALL LUXURY DETAILS
      ========================================================= */}

      {/* side vent */}
      {[-1, 1].map((side) => (
        <mesh
          key={`vent-${side}`}
          {...shadow}
          material={m.carbon}
          position={[27, 3, side * 20]}
        >
          <boxGeometry args={[12, 5, 3]} />
        </mesh>
      ))}

      {/* decorative brass pins */}
      {[-1, 1].map((side) => (
        <group key={`pins-${side}`}>
          {[17, 23, 29].map((x) => (
            <mesh
              key={x}
              material={m.brassBright}
              position={[x, 7, side * 21.5]}
            >
              <sphereGeometry args={[1.1, 8, 8]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}