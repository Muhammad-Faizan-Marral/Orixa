import { clamp } from "./math";

/** 0..1 over the full scrollable range. THE single definition of "film progress". */
export function getScrollProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? clamp(window.scrollY / max) : 0;
}

/** rAF-batched scroll/resize subscription. Calls back once immediately. */
export function subscribeScroll(cb: (progress: number) => void): () => void {
  let raf = 0;
  const run = () => {
    raf = 0;
    cb(getScrollProgress());
  };
  const on = () => {
    if (!raf) raf = requestAnimationFrame(run);
  };
  window.addEventListener("scroll", on, { passive: true });
  window.addEventListener("resize", on);
  cb(getScrollProgress());
  return () => {
    window.removeEventListener("scroll", on);
    window.removeEventListener("resize", on);
    if (raf) cancelAnimationFrame(raf);
  };
}
