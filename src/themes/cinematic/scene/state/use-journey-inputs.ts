"use client";

import { useEffect } from "react";
import { getScrollProgress } from "../../shared/scroll";
import type { JourneyState } from "./journey-state";

/** Window scroll + pointer -> journey state. The page scrolls natively; the canvas is fixed. */
export function useJourneyInputs(state: JourneyState) {
  useEffect(() => {
    const readScroll = () => {
      state.targetProgress = getScrollProgress();
    };
    const onMove = (e: PointerEvent) => {
      state.pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      state.pointerTarget.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    readScroll();
    state.progress = state.targetProgress; // reload mid-page: no long glide from 0

    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", readScroll);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", readScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, [state]);
}
