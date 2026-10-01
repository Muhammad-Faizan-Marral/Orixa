/**
 * Takeoff / landing ka flight profile. Pure maths, three.js dependency nahi.
 *
 * Idea:
 *  - Land ghoomti hai, plane screen par (almost) ek jagah rehta hai.
 *  - Plane runway par kahan hai = (progress se travel hui doori) -> `s` (runway ka local arc-length).
 *  - HERO runway ko is tarah shift kiya hai ke progress 0 par plane runway ke start ke paas khara ho.
 *  - CONTACT runway ko is tarah shift kiya hai ke progress 1 par plane runway par ruk jaye.
 *  - Beech me plane pointer ke hisaab se freely udta hai (purana behaviour).
 */
import type { StationId } from "../../schema";
import {
  SURFACE_RADIUS,
  WORLD_ARC,
  WORLD_OFFSET_Y,
  clamp,
  lerp,
  smoothstep,
} from "./journey-math";

/* ------------------------------ Plane model ------------------------------ */

/** Plane.tsx ka group scale */
export const PLANE_SCALE = 0.5;

/** Root se wheels ke neeche tak ki doori (world units), ground attitude par. */
export const GEAR_HEIGHT = 21.1;

/** Wheels dono zameen par hon to body itni nose-up hoti hai (radians) = tail-dragger 3-point attitude */
export const REST_PITCH = 0.0855;

/** Takeoff me nose itna extra uthta hai (rotation) */
export const ROTATE_PITCH = 0.06;

/* -------------------------------- Runway --------------------------------- */

/** Runway ki asphalt surface, SURFACE_RADIUS se itni neeche (RunwayStrip ke boxes se match) */
export const RUNWAY_SURFACE_RADIUS = SURFACE_RADIUS - 2.9;

/** Plane ground par is x par khara hota hai (idle range -100..-20 ke andar) */
export const GROUND_X = -34;

/** 1 progress = itne world units land ki surface par (runway ke s me) */
export const SURFACE_SPEED = SURFACE_RADIUS * WORLD_ARC;

/** Runway ke andar plane ki jagah (s = runway center se doori) */
const TAKEOFF = {
  startS: -170, // progress 0 par plane yahan khara hai
  rotateS: -30, // nose uthna shuru
  liftS: 30, // pahiye zameen chhorte hain
  climbEndS: 380, // cruise height par pohonch gaya
} as const;

const LANDING = {
  approachS: -640, // neeche aana shuru (runway se pehle)
  touchS: -130, // touchdown
  stopS: 170, // progress 1 par plane yahan hai
} as const;

/** Runway ka center kis progress par plane ke bilkul neeche (x = 0) se guzarta hai */
export const HERO_RUNWAY_PROGRESS = (GROUND_X - TAKEOFF.startS) / SURFACE_SPEED;
export const LANDING_RUNWAY_PROGRESS =
  1 - (LANDING.stopS - GROUND_X) / SURFACE_SPEED;

const heroP = (s: number) =>
  HERO_RUNWAY_PROGRESS + (s - GROUND_X) / SURFACE_SPEED;
const landP = (s: number) =>
  LANDING_RUNWAY_PROGRESS + (s - GROUND_X) / SURFACE_SPEED;

export const FLIGHT_P = {
  rotate: heroP(TAKEOFF.rotateS),
  lift: heroP(TAKEOFF.liftS),
  climbEnd: heroP(TAKEOFF.climbEndS),
  approach: landP(LANDING.approachS),
  touch: landP(LANDING.touchS),
} as const;

/** Takeoff/landing ke waqt pointer ka vertical asar kam rakhte hain taake slope natural rahe */
const TAKEOFF_REF_Y = 110;
const APPROACH_REF_Y = 100;

/* --------------------------------- Plan ---------------------------------- */

/** Sirf wahi takeoff/landing jo scene me runway ke saath maujood ho */
export type FlightPlan = { takeoff: boolean; landing: boolean };

export function flightPlanOf(
  stations: readonly { id: StationId }[],
): FlightPlan {
  return {
    takeoff: stations.some((s) => s.id === "hero"),
    landing: stations.some((s) => s.id === "contact"),
  };
}

/* --------------------------------- Maths --------------------------------- */

/** t: 0..1 -> 0..1. m0 = shuru ki slope (0 = bilkul flat start), end par slope 0 */
function hermite(t: number, m0: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return m0 * (t3 - 2 * t2 + t) + 3 * t2 - 2 * t3;
}

/** 0 = zameen par, 1 = poori tarah hawa me */
export function airFactor(p: number, plan: FlightPlan): number {
  const up = plan.takeoff
    ? hermite(
        clamp((p - FLIGHT_P.lift) / (FLIGHT_P.climbEnd - FLIGHT_P.lift), 0, 1),
        0.8,
      )
    : 1;
  const down = plan.landing
    ? hermite(
        clamp(
          (FLIGHT_P.touch - p) / (FLIGHT_P.touch - FLIGHT_P.approach),
          0,
          1,
        ),
        0.3,
      )
    : 1;
  return up * down;
}

/** Runway surface par khare plane ke root ki height (world y) */
export function groundRootY(x: number): number {
  const r = RUNWAY_SURFACE_RADIUS;
  return WORLD_OFFSET_Y + Math.sqrt(Math.max(r * r - x * x, 0)) + GEAR_HEIGHT;
}

/** Zameen ki tilt (x par): zameen gol hai, isliye left side thori upar ko dhalti hai */
export function groundTilt(x: number): number {
  return Math.asin(clamp(-x / RUNWAY_SURFACE_RADIUS, -1, 1));
}

/** Plane ki x position: zameen par GROUND_X, hawa me pointer wali x */
export function planeX(airX: number, a: number): number {
  return lerp(GROUND_X, airX, a);
}

/** Plane root ki y: zameen se cruise tak, takeoff/landing profile ke saath */
export function planeHeight(
  p: number,
  cruiseY: number,
  airX: number,
  plan: FlightPlan,
): number {
  const a = airFactor(p, plan);
  const climb = plan.takeoff
    ? smoothstep(FLIGHT_P.lift, FLIGHT_P.climbEnd, p)
    : 1;
  const appr = plan.landing
    ? smoothstep(FLIGHT_P.approach, FLIGHT_P.touch, p)
    : 0;
  const target = lerp(
    lerp(TAKEOFF_REF_Y, cruiseY, climb),
    APPROACH_REF_Y,
    appr,
  );
  return lerp(groundRootY(planeX(airX, a)), target, a);
}

/** dy/ds: plane ka path angle nikalne ke liye (nose isi taraf point karti hai) */
export function flightSlope(
  p: number,
  cruiseY: number,
  airX: number,
  plan: FlightPlan,
): number {
  const e = 0.0015;
  const y1 = planeHeight(p + e, cruiseY, airX, plan);
  const y0 = planeHeight(p - e, cruiseY, airX, plan);
  return (y1 - y0) / (2 * e * SURFACE_SPEED);
}

/** Zameen par plane ki natural pitch (3-point attitude + zameen ki tilt) */
export function groundPitch(x: number): number {
  return REST_PITCH + groundTilt(x);
}

/** Takeoff rotation: liftoff se pehle nose thori uthti hai, phir wapas path angle me ghul jati hai */
export function rotationBump(p: number, plan: FlightPlan): number {
  if (!plan.takeoff) return 0;
  return (
    smoothstep(FLIGHT_P.rotate, FLIGHT_P.lift, p) *
    (1 - smoothstep(FLIGHT_P.lift, FLIGHT_P.lift + 0.03, p))
  );
}
