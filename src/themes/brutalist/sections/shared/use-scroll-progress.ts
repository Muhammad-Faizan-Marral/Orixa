"use client";

import { useEffect } from "react";

/** scene ke `use-journey-inputs` jaisa hi formula: scrollY / (scrollHeight - innerHeight). */
export function readProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

/** Scroll par rAF-throttled callback. React state nahi, taake har frame re-render na ho. */
export function useScrollProgress(cb: (progress: number) => void) {
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      cb(readProgress());
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [cb]);
}

export function scrollToProgress(p: number, reduced = false) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: p * max, behavior: reduced ? "auto" : "smooth" });
}
