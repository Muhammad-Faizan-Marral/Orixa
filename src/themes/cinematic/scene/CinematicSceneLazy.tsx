"use client";

import dynamic from "next/dynamic";

/** three.js sirf client par load ho (SSR / initial bundle me nahi). ThemePage isi ko import kare. */
export const CinematicSceneLazy = dynamic(() => import("./CinematicScene"), {
  ssr: false,
  loading: () => null,
});