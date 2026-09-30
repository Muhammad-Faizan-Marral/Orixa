"use client";

import { Atmosphere } from "./objects/Atmosphere";
import { CameraRig } from "./objects/CameraRig";
import { Clouds } from "./objects/Clouds";
import { Forest } from "./objects/Forest";
import { JourneyDriver } from "./objects/JourneyDriver";
import { Land } from "./objects/Land";
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
        {/* Next step: <Landmarks /> yahin aayega (land ke saath ghoomne ke liye) */}
      </Land>
      <Plane />
    </>
  );
}