"use client";

import dynamic from "next/dynamic";

/** three.js never ships in the server bundle or blocks first paint. */
export const CinematicSceneLazy = dynamic(() => import("./CinematicScene"), { ssr: false });
