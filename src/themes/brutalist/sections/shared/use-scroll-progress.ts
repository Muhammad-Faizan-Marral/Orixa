"use client";

import { useEffect } from "react";

/** scene ke `use-journey-inputs` jaisa hi formula: scrollY / (scrollHeight - innerHeight). */
export function readProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

/*
 * Ek shared listener + ek rAF + frame me sirf ek scrollHeight read, phir sab subscribers likhte hain.
 * Pehle har StationFrame/HudNav apna read karta aur style likhta tha: write -> read -> write -> read
 * = frame me ~9 forced synchronous layouts (backdrop-filter wale fixed layers ke saath).
 */
type Cb = (progress: number) => void;
const subs = new Set<Cb>();
let raf = 0;

function flush() {
  raf = 0;
  const p = readProgress(); // saare reads pehle (layout clean), phir writes
  subs.forEach((cb) => cb(p));
}
function schedule() {
  if (!raf) raf = requestAnimationFrame(flush);
}

/** Scroll par rAF-throttled callback. React state nahi, taake har frame re-render na ho. */
export function useScrollProgress(cb: (progress: number) => void) {
  useEffect(() => {
    subs.add(cb);
    if (subs.size === 1) {
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
    }
    cb(readProgress());
    return () => {
      subs.delete(cb);
      if (subs.size === 0) {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      }
    };
  }, [cb]);
}

export function scrollToProgress(p: number, reduced = false) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: p * max, behavior: reduced ? "auto" : "smooth" });
}
