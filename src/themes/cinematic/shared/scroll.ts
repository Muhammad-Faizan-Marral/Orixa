import { clamp } from "./math";

/**
 * Same-microtask cache: every subscriber that mounts in one commit would otherwise
 * read `scrollHeight` itself, and each read can force a synchronous layout after the
 * previous subscriber's style writes. Scroll position / document height cannot change
 * inside one task of effects, so one read is exact for all of them.
 */
let cachedMax = -1;
function scrollMax(): number {
  if (cachedMax < 0) {
    cachedMax = document.documentElement.scrollHeight - window.innerHeight;
    queueMicrotask(() => {
      cachedMax = -1;
    });
  }
  return cachedMax;
}

/** 0..1 over the full scrollable range. THE single definition of "film progress". */
export function getScrollProgress(): number {
  const max = scrollMax();
  return max > 0 ? clamp(window.scrollY / max) : 0;
}

/* ------------------------------------------------------------------ */
/* One shared scroll/resize bus: ONE rAF + ONE layout read per frame, */
/* fanned out to every subscriber (was: one rAF + one read each).     */
/* ------------------------------------------------------------------ */
type Listener = (progress: number) => void;

const listeners = new Set<Listener>();
let raf = 0;
let attached = false;

function flush() {
  raf = 0;
  const p = getScrollProgress(); // single read BEFORE any subscriber writes to the DOM
  listeners.forEach((cb) => cb(p));
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(flush);
}

function attach() {
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  attached = true;
}

function detach() {
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  attached = false;
}

/** rAF-batched scroll/resize subscription. Calls back once immediately. */
export function subscribeScroll(cb: (progress: number) => void): () => void {
  listeners.add(cb);
  if (!attached) attach();
  cb(getScrollProgress());
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0 && attached) detach();
  };
}

/** Smooth-scroll the page so that film progress == p (0..1). */
export function scrollToProgress(p: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: clamp(p) * max, behavior: "smooth" });
}
