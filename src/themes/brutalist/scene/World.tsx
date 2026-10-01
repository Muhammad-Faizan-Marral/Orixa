"use client";

import { Atmosphere } from "./objects/Atmosphere";
import { CameraRig } from "./objects/CameraRig";
import { Clouds } from "./objects/Clouds";
import { Forest } from "./objects/Forest";
import { JourneyDriver } from "./objects/JourneyDriver";
import { Land } from "./objects/Land";
import { Landmarks } from "./landmarks/Landmarks";
import { Plane } from "./objects/Plane";

/**
 * 3D world ki composition.
 * NOTE: <JourneyDriver /> hamesha pehla rahe, baaqi sab uska update read karte hain.
 */
export function World() {
  return (
    <>
      <JourneyDriver />
      <CameraRig />
      <Atmosphere />
      <Clouds />
      <Land>
        <Forest />
        <Landmarks />
      </Land>
      <Plane />
    </>
  );
}