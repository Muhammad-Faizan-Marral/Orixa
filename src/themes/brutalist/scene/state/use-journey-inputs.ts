"use client";

import { useEffect } from "react";
import { clamp } from "../lib/journey-math";
import type { JourneyState } from "./journey-state";

/**
 * Window-level inputs: page scroll -> target progress, pointer -> plane.
 * Canvas pointer-events:none rakha hai, isliye listeners window par hain.
 */
export function useJourneyInputs(state: JourneyState) {
  useEffect(() => {
    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      state.target = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    };
    const onPointer = (e: PointerEvent) => {
      state.pointer.x = -1 + (e.clientX / window.innerWidth) * 2;
      state.pointer.y = 1 - (e.clientY / window.innerHeight) * 2;
      state.pointerAt = performance.now();
    };

    readScroll();
    // page load par browser scroll restore kare to scene wahin se shuru ho
    state.progress = state.target;

    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [state]);
}