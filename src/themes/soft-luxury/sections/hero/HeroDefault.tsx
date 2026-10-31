"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";

import type { ThemeSectionProps } from "@/themes/types";

/* ============================================================================
   ORIXA — GENERIC BITE HERO (v3 · warm paper / nostalgia)

   Landing state   : full headline + "GENERIC" (baked in the frames) visible,
                     T-Rex hidden behind the word.
   Scroll          : frames 1 → 145 play (emerge, bite, blood, retreat).
   After the bite  : headline + damaged GENERIC shrink into the top zone,
                     the identity card sits in its own zone below.
                     The two zones are MEASURED, so they can never overlap.

   PERFORMANCE NOTES
   - Frames are fetched as compressed blobs (small) and only a sliding window
     around the current frame is decoded (createImageBitmap, off the main
     thread). Before: 145 <img> elements, decoded lazily ON the main thread at
     draw time, with the browser free to evict + re-decode them.
   - Scroll work only runs while the hero is near the viewport and only when
     the progress actually changed.
   - One ResizeObserver replaces window resize + document.fonts hacks and
     reads the sticky container (svh) instead of window.innerHeight, so the
     mobile URL bar showing/hiding no longer re-measures during scroll.
   - Static grain + atmosphere are ONE element (background-blend-mode), not
     two layers with a mix-blend-mode composited every scroll frame.
   ========================================================================== */

const SECTION_HEIGHT = "420vh";

const FRAME_COUNT = 145;
const FRAME_EXTENSION = "webp";

/* Scroll ranges (0 → 1 of the section) */
const FRAME_START = 0.05; // frame 1 holds still first
const FRAME_END = 0.68;
const REVEAL_START = 0.7;
const REVEAL_END = 0.92;

/* Layout zones (px) */
const HEADER_ZONE = 84; // space reserved for the top bar
const ZONE_GAP = 18; // gap between shrunken hero and identity card
const BOTTOM_GAP_RATIO = 0.05; // bottom margin as share of viewport height
const MIN_SCALE = 0.26;
const MAX_SCALE = 0.62;

/* Frame streaming */
const MAX_FETCH = 6; // parallel downloads
const MAX_DECODE = 4; // parallel decodes
const DECODE_BACK = 3; // frames kept ready behind the current one
const DECODE_AHEAD = 14; // frames decoded ahead of the current one
const KEEP_BACK = 6; // eviction hysteresis (memory stays bounded)
const KEEP_AHEAD = 20;

/* Warm, sun-faded paper palette — sits well next to black line-art */
const PAPER = "#efe2c8"; // aged parchment (base)
const PAPER_DEEP = "#e5d3b0"; // card surface
const KRAFT = "#c9a877"; // borders / hairlines
const SEPIA = "#6d4d31"; // secondary text
const DUST = "#9a8060"; // muted text
const INK = "#1b130c"; // warm black
const BLOOD = "#a3271d"; // the only accent — matches the bite

const HAIRLINE = "rgba(109,77,49,.28)";

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";
const SERIF_FONT =
  "var(--font-instrument), 'Iowan Old Style', 'Palatino Linotype', Georgia, serif";

/*
  Grain tile. Alpha is baked in (.55 × the old layer opacity .4 = .22) so the
  grain can be multiplied into the gradients below with background-blend-mode,
  inside a single element. Same math as the old two-element mix-blend-mode.
*/
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .15  0 0 0 .22 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const PAPER_ATMOSPHERE: React.CSSProperties = {
  backgroundImage: `${GRAIN}, radial-gradient(ellipse 70% 55% at 50% 46%, rgba(255,246,224,.75), transparent 70%), radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(120,84,48,.22) 100%)`,
  backgroundSize: "160px 160px, auto, auto",
  backgroundBlendMode: "multiply, normal, normal",
};

/* -------------------------------------------------------------------------- */
/* TYPES + HELPERS                                                            */
/* -------------------------------------------------------------------------- */

type Drawable = ImageBitmap | HTMLImageElement;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

const range = (v: number, start: number, end: number) =>
  end <= start ? (v >= end ? 1 : 0) : clamp((v - start) / (end - start));

const easeOutCubic = (v: number) => 1 - Math.pow(1 - clamp(v), 3);

const easeInOut = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};

function clean(value: string | null | undefined) {
  if (typeof value !== "string") return null;
  const result = value.trim();
  return result.length ? result : null;
}

function cleanUrl(value: string | null | undefined) {
  const result = clean(value);
  if (!result) return null;
  if (/^(https?:\/\/|\/|#|mailto:)/i.test(result)) return result;
  return `https://${result}`;
}

function getFramePath(index: number) {
  const n = String(index + 1).padStart(4, "0");
  return `/trex-frames/frame-${n}.${FRAME_EXTENSION}`;
}

function dimsOf(src: Drawable) {
  return src instanceof HTMLImageElement
    ? { w: src.naturalWidth, h: src.naturalHeight }
    : { w: src.width, h: src.height };
}

function closeDrawable(src: Drawable) {
  if ("close" in src) src.close();
}

/** Fallback for browsers without createImageBitmap. */
function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new window.Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("frame decode failed"));
    };
    img.src = url;
  });
}

/* ============================================================================
   COMPONENT
   ========================================================================== */

export default function HeroDinoBite({ config, profile }: ThemeSectionProps) {
  const reduceMotion = useReducedMotion();
  const animated = !reduceMotion && config.animations !== false;

  /* ------------------------------------------------------------------------ */
  /* DATA                                                                     */
  /* ------------------------------------------------------------------------ */

  const view = useMemo(() => {
    const projects = Array.isArray(config.projects) ? config.projects : [];
    const experience = Array.isArray(config.experience)
      ? config.experience
      : [];

    return {
      name:
        clean(config.name) ??
        clean(profile.fullName) ??
        clean(profile.username) ??
        "Your Name",
      username: clean(profile.username),
      headline:
        clean(config.headline) ?? "Building thoughtful digital experiences.",
      about: clean(config.about),
      location: clean(config.location),
      resumeUrl: cleanUrl(config.resumeUrl),
      projectsCount: projects.length,
      experienceCount: experience.length,
    };
  }, [config, profile]);

  /* ------------------------------------------------------------------------ */
  /* REFS                                                                     */
  /* ------------------------------------------------------------------------ */

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null); // sticky 100svh container
  const stageRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const sourcesRef = useRef<(Drawable | null)[]>([]);
  const pumpRef = useRef<((center: number) => void) | null>(null);

  const targetFrameRef = useRef(0);
  const drawnFrameRef = useRef(-1);

  const totalRef = useRef(1); // scrollable distance of the pinned section
  const lastProgressRef = useRef(-1);
  const lastFrameRef = useRef(-1);
  const lastMoveRef = useRef(-1);
  const lastIdentityRef = useRef(-1);
  const lastCueRef = useRef(-1);

  /* Final resting pose of the hero group (measured, see measure()) */
  const metricsRef = useRef({ scale: 0.5, shift: 0 });

  /* ------------------------------------------------------------------------ */
  /* MEASURE — guarantees title and identity card never overlap               */
  /* ------------------------------------------------------------------------ */

  const measure = useCallback(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const group = groupRef.current;
    const reveal = revealRef.current;
    if (!section || !viewport || !group || !reveal) return;

    /* the sticky container (100svh) IS the coordinate space of the group,
       and its height does not jump when a mobile URL bar collapses */
    const vh = viewport.offsetHeight;
    const groupHeight = group.offsetHeight; // unaffected by transforms
    const cardHeight = reveal.offsetHeight;

    totalRef.current = section.offsetHeight - vh;

    const bottomGap = vh * BOTTOM_GAP_RATIO;
    const zoneTop = HEADER_ZONE;
    const zoneBottom = vh - bottomGap - cardHeight - ZONE_GAP;
    const zoneHeight = Math.max(zoneBottom - zoneTop, 40);

    const scale = clamp(zoneHeight / groupHeight, MIN_SCALE, MAX_SCALE);
    const targetCenter = zoneTop + zoneHeight / 2;

    /* group is anchored at top:50% with translateY(-50%) → its centre is vh/2 */
    metricsRef.current = { scale, shift: vh / 2 - targetCenter };

    /* poses depend on the metrics → force the next updateScene to apply */
    lastProgressRef.current = -1;
    lastMoveRef.current = -1;
  }, []);

  /* ------------------------------------------------------------------------ */
  /* CANVAS DRAW                                                              */
  /* ------------------------------------------------------------------------ */

  const drawFrame = useCallback((wanted: number) => {
    const canvas = canvasRef.current;
    const sources = sourcesRef.current;
    if (!canvas || !sources.length) return;

    /* closest already-decoded frame at or before the wanted one,
       so the canvas never flashes empty while frames stream in */
    let index = wanted;
    while (index > 0 && !sources[index]) index -= 1;

    const src = sources[index];
    if (!src) return;

    /* never step BACK to an older frame than the one already on screen
       while scrolling forward (decode of the exact frame is still pending) */
    const drawn = drawnFrameRef.current;
    if (drawn !== -1 && drawn <= wanted && drawn >= index) return;

    const ctx = (ctxRef.current ??= canvas.getContext("2d"));
    if (!ctx) return;

    const { w, h } = dimsOf(src);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      stageRef.current?.style.setProperty("--ar", String(w / h));
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(src, 0, 0);
    drawnFrameRef.current = index;
  }, []);

  /* ------------------------------------------------------------------------ */
  /* FRAME STREAMING ENGINE                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const N = FRAME_COUNT;

    const sources: (Drawable | null)[] = new Array(N).fill(null);
    const blobs: (Blob | null)[] = new Array(N).fill(null);
    const fetching: boolean[] = new Array(N).fill(false);
    const decoding: boolean[] = new Array(N).fill(false);

    sourcesRef.current = sources;
    drawnFrameRef.current = -1;
    lastFrameRef.current = -1;

    const abort = new AbortController();
    const canBitmap = typeof createImageBitmap === "function";

    let cancelled = false;
    let center = animated ? targetFrameRef.current : N - 1;
    let activeFetches = 0;
    let activeDecodes = 0;

    /* the frame that must never be evicted (always a safe fallback) */
    const pinned = animated ? 0 : N - 1;

    const inKeepWindow = (i: number) =>
      i === pinned || (i >= center - KEEP_BACK && i <= center + KEEP_AHEAD);

    const decode = async (i: number) => {
      const blob = blobs[i];
      if (!blob) return;

      decoding[i] = true;
      activeDecodes += 1;

      try {
        const src: Drawable = canBitmap
          ? await createImageBitmap(blob)
          : await blobToImage(blob);

        if (cancelled || !inKeepWindow(i)) {
          closeDrawable(src);
        } else {
          sources[i] = src;
          if (i <= targetFrameRef.current) drawFrame(targetFrameRef.current);
        }
      } catch {
        /* a missing/corrupt frame just keeps the previous one on screen */
      } finally {
        decoding[i] = false;
        activeDecodes -= 1;
        if (!cancelled) pump(center);
      }
    };

    /** Evict far frames, then decode the window nearest-first. */
    const pump = (c: number) => {
      center = c;

      for (let i = 0; i < N; i += 1) {
        const s = sources[i];
        if (s && !inKeepWindow(i)) {
          closeDrawable(s);
          sources[i] = null;
        }
      }

      if (blobs[pinned] && !sources[pinned] && !decoding[pinned]) {
        if (activeDecodes < MAX_DECODE) void decode(pinned);
      }

      const reach = Math.max(DECODE_AHEAD, DECODE_BACK);

      for (let d = 0; d <= reach && activeDecodes < MAX_DECODE; d += 1) {
        const candidates: number[] = [];
        if (d <= DECODE_AHEAD) candidates.push(c + d);
        if (d > 0 && d <= DECODE_BACK) candidates.push(c - d);

        for (const i of candidates) {
          if (activeDecodes >= MAX_DECODE) break;
          if (i < 0 || i >= N) continue;
          if (blobs[i] && !sources[i] && !decoding[i]) void decode(i);
        }
      }
    };

    pumpRef.current = pump;

    /** Next frame to download: from the scroll position forward, then wrap. */
    const nextFetchIndex = () => {
      if (!animated) return fetching[N - 1] ? -1 : N - 1;

      for (let i = center; i < N; i += 1) if (!fetching[i]) return i;
      for (let i = 0; i < center; i += 1) if (!fetching[i]) return i;
      return -1;
    };

    const runFetch = () => {
      while (!cancelled && activeFetches < MAX_FETCH) {
        const i = nextFetchIndex();
        if (i < 0) return;
        void fetchFrame(i);
      }
    };

    const fetchFrame = async (i: number) => {
      fetching[i] = true;
      activeFetches += 1;

      try {
        const res = await fetch(getFramePath(i), { signal: abort.signal });
        if (!res.ok) throw new Error(`frame ${i} ${res.status}`);

        const blob = await res.blob();
        if (cancelled) return;

        blobs[i] = blob;
      } catch {
        /* ignore: that frame is simply never shown */
      } finally {
        activeFetches -= 1;

        if (!cancelled) {
          pump(center);
          runFetch();
        }
      }
    };

    /* first frame alone (so it wins the bandwidth), the rest follow it */
    void fetchFrame(animated ? center : N - 1);

    return () => {
      cancelled = true;
      abort.abort();
      pumpRef.current = null;
      sourcesRef.current = [];
      ctxRef.current = null;

      for (const s of sources) {
        if (s) closeDrawable(s);
      }
    };
  }, [animated, drawFrame]);

  /* ------------------------------------------------------------------------ */
  /* SCENE                                                                    */
  /* ------------------------------------------------------------------------ */

  const updateScene = useCallback(
    (progress: number) => {
      /* nothing moved → nothing to do */
      if (Math.abs(progress - lastProgressRef.current) < 1e-5) return;
      lastProgressRef.current = progress;

      /* 1. Frames — linear so the bite lands where the video put it */
      const frameProgress = range(progress, FRAME_START, FRAME_END);
      const frameIndex = Math.round(frameProgress * (FRAME_COUNT - 1));

      if (frameIndex !== lastFrameRef.current) {
        lastFrameRef.current = frameIndex;
        targetFrameRef.current = frameIndex;
        pumpRef.current?.(frameIndex);
        drawFrame(frameIndex);
      }

      /* 2. Hero group settles into its measured top zone;
            identity card rises into its own zone underneath */
      const identity = easeOutCubic(range(progress, REVEAL_START, REVEAL_END));
      const move = easeInOut(range(progress, REVEAL_START, REVEAL_END));
      const { scale, shift } = metricsRef.current;

      if (groupRef.current && move !== lastMoveRef.current) {
        lastMoveRef.current = move;
        groupRef.current.style.transform = `translate3d(0, calc(-50% - ${(
          move * shift
        ).toFixed(2)}px), 0) scale(${(1 - move * (1 - scale)).toFixed(4)})`;
      }

      if (revealRef.current && identity !== lastIdentityRef.current) {
        lastIdentityRef.current = identity;
        revealRef.current.style.opacity = identity.toFixed(3);
        revealRef.current.style.transform = `translate3d(0, ${(
          (1 - identity) *
          40
        ).toFixed(2)}px, 0)`;
        revealRef.current.style.pointerEvents =
          identity > 0.6 ? "auto" : "none";
      }

      /* 3. Scroll cue */
      if (cueRef.current) {
        const cue = 1 - easeInOut(range(progress, 0.01, 0.1));

        if (cue !== lastCueRef.current) {
          lastCueRef.current = cue;
          cueRef.current.style.opacity = cue.toFixed(3);
        }
      }
    },
    [drawFrame],
  );

  /* ------------------------------------------------------------------------ */
  /* SCROLL ENGINE                                                            */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    let visible = true;

    const calculate = () => {
      raf = 0;

      const rect = section.getBoundingClientRect();
      const total = totalRef.current;

      updateScene(total > 0 ? clamp(-rect.top / total) : 0);
    };

    const schedule = () => {
      /* off-screen → no rAF, no layout read, no style writes */
      if (!visible || raf) return;
      raf = window.requestAnimationFrame(calculate);
    };

    /* size changes of the pinned container, the section, the title group
       (fonts, aspect ratio) or the identity card all land here */
    const refresh = () => {
      measure();

      if (animated) {
        if (visible) calculate();
      } else {
        targetFrameRef.current = FRAME_COUNT - 1;
        updateScene(1);
      }
    };

    const ro = new ResizeObserver(refresh);

    [viewportRef, sectionRef, groupRef, revealRef].forEach((ref) => {
      if (ref.current) ro.observe(ref.current);
    });

    let io: IntersectionObserver | null = null;

    if (animated) {
      window.addEventListener("scroll", schedule, { passive: true });

      io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) schedule();
        },
        { rootMargin: "100px 0px" },
      );
      io.observe(section);
    }

    refresh();

    return () => {
      window.removeEventListener("scroll", schedule);
      ro.disconnect();
      io?.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [animated, measure, updateScene]);

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <section
      ref={sectionRef}
      aria-label={`${view.name} — introduction`}
      className="relative"
      style={{
        height: animated ? SECTION_HEIGHT : "100svh",
        minHeight: animated ? undefined : 680,
        background: PAPER,
        color: INK,
      }}
    >
      <div
        ref={viewportRef}
        className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden"
      >
        {/* ------------------- paper atmosphere + grain (static) ------------------ */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={PAPER_ATMOSPHERE}
        />

        {/* ------------------------------ header ------------------------------ */}

        {/* --------------------------- hero group ---------------------------- */}
        <div
          ref={groupRef}
          className="absolute inset-x-0 top-1/2 z-20 flex flex-col items-center px-4 will-change-transform sm:px-8"
          style={{
            transform: "translate3d(0, -50%, 0) scale(1)",
            transformOrigin: "50% 50%",
          }}
        >
          <h1
            className="text-center font-semibold uppercase"
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: "clamp(1.9rem, 5.4vw, 5.4rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.055em",
              textWrap: "balance",
              maxWidth: "16ch",
              color: INK,
            }}
          >
            Some work is too good to look
          </h1>

          <div
            ref={stageRef}
            className="relative"
            style={
              {
                "--ar": 1.7778,
                width: "min(94vw, calc(46svh * var(--ar)))",
                aspectRatio: "var(--ar)",
                marginTop: "clamp(-1.5rem, -2vw, -0.5rem)",
              } as React.CSSProperties
            }
          >
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="The word GENERIC being bitten apart by a T-Rex"
              className="absolute inset-0 h-full w-full select-none"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
        </div>

        {/* ---------------------------- scroll cue --------------------------- */}
        <div
          ref={cueRef}
          aria-hidden
          className="absolute inset-x-0 bottom-8 z-30 flex flex-col items-center gap-3"
        >
          <span
            className="text-xs"
            style={{ fontFamily: TEXT_FONT, color: SEPIA }}
          >
            Scroll to break the generic
          </span>
          <span
            className="block h-9 w-px"
            style={{
              background: `linear-gradient(to bottom, ${BLOOD}, transparent)`,
            }}
          />
        </div>

        {/* ------------------------- identity card --------------------------- */}
        {/* Lives in its own zone below the shrunken hero — never overlaps it. */}
        <div
          ref={revealRef}
          className="absolute inset-x-4 bottom-[5svh] z-30 sm:inset-x-8 lg:inset-x-12"
          style={{
            opacity: 0,
            transform: "translate3d(0, 40px, 0)",
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        >
          <div
            className="mx-auto grid max-w-[1200px] gap-6 rounded-[22px] p-6 sm:p-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-12"
            style={{
              background: `linear-gradient(180deg, ${PAPER_DEEP}, #dfcaa2)`,
              border: `1px solid ${KRAFT}`,
              boxShadow:
                "0 1px 0 rgba(255,246,224,.7) inset, 0 24px 48px -24px rgba(87,58,30,.45)",
            }}
          >
            {/* who */}
            <div className="flex flex-col justify-between gap-4">
              <h2
                className="font-semibold"
                style={{
                  fontFamily: DISPLAY_FONT,
                  fontSize: "clamp(2.1rem, 4.8vw, 4.6rem)",
                  lineHeight: 0.94,
                  letterSpacing: "-0.055em",
                  color: INK,
                }}
              >
                {view.name}
              </h2>

              {view.username && (
                <p
                  className="text-sm"
                  style={{ fontFamily: TEXT_FONT, color: SEPIA }}
                >
                  @{view.username}
                </p>
              )}
            </div>

            {/* what */}
            <div className="flex flex-col justify-between gap-5">
              <div>
                <p
                  className="text-[19px] leading-[1.35] sm:text-[22px]"
                  style={{
                    fontFamily: SERIF_FONT,
                    color: INK,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {view.headline}
                </p>

                {view.about && (
                  <p
                    className="mt-3 line-clamp-2 hidden max-w-[52ch] text-sm leading-6 sm:block"
                    style={{ fontFamily: TEXT_FONT, color: SEPIA }}
                  >
                    {view.about}
                  </p>
                )}
              </div>

              <div
                className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-t pt-4"
                style={{ borderColor: HAIRLINE }}
              >
                <dl className="flex gap-9">
                  <div>
                    <dt
                      className="text-xs"
                      style={{ fontFamily: TEXT_FONT, color: DUST }}
                    >
                      Projects
                    </dt>
                    <dd
                      className="mt-1 text-[1.9rem] font-medium leading-none tabular-nums"
                      style={{
                        fontFamily: DISPLAY_FONT,
                        letterSpacing: "-0.05em",
                        color: INK,
                      }}
                    >
                      {view.projectsCount}
                    </dd>
                  </div>

                  <div>
                    <dt
                      className="text-xs"
                      style={{ fontFamily: TEXT_FONT, color: DUST }}
                    >
                      Roles
                    </dt>
                    <dd
                      className="mt-1 text-[1.9rem] font-medium leading-none tabular-nums"
                      style={{
                        fontFamily: DISPLAY_FONT,
                        letterSpacing: "-0.05em",
                        color: INK,
                      }}
                    >
                      {view.experienceCount}
                    </dd>
                  </div>
                </dl>

                {view.resumeUrl && (
                  <a
                    href={view.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full px-5 py-3 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      fontFamily: TEXT_FONT,
                      background: INK,
                      color: PAPER,
                      outlineColor: BLOOD,
                    }}
                  >
                    View résumé
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}