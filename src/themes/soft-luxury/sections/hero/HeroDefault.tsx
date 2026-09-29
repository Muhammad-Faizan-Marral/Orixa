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

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .15  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

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
  const stageRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const targetFrameRef = useRef(0);
  const drawnFrameRef = useRef(-1);

  /* Final resting pose of the hero group (measured, see measure()) */
  const metricsRef = useRef({ scale: 0.5, shift: 0 });

  /* ------------------------------------------------------------------------ */
  /* MEASURE — guarantees title and identity card never overlap               */
  /* ------------------------------------------------------------------------ */

  const measure = useCallback(() => {
    const group = groupRef.current;
    const reveal = revealRef.current;
    if (!group || !reveal) return;

    const vh = window.innerHeight;
    const groupHeight = group.offsetHeight; // unaffected by transforms
    const cardHeight = reveal.offsetHeight;

    const bottomGap = vh * BOTTOM_GAP_RATIO;
    const zoneTop = HEADER_ZONE;
    const zoneBottom = vh - bottomGap - cardHeight - ZONE_GAP;
    const zoneHeight = Math.max(zoneBottom - zoneTop, 40);

    const scale = clamp(zoneHeight / groupHeight, MIN_SCALE, MAX_SCALE);
    const targetCenter = zoneTop + zoneHeight / 2;

    /* group is anchored at top:50% with translateY(-50%) → its centre is vh/2 */
    metricsRef.current = { scale, shift: vh / 2 - targetCenter };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* CANVAS DRAW                                                              */
  /* ------------------------------------------------------------------------ */

  const drawFrame = useCallback((wanted: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* closest already-loaded frame at or before the wanted one,
       so the canvas never flashes empty while frames stream in */
    let index = wanted;
    while (index > 0 && !loadedRef.current[index]) index -= 1;

    const img = framesRef.current[index];
    if (!img || !loadedRef.current[index]) return;
    if (drawnFrameRef.current === index) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (
      canvas.width !== img.naturalWidth ||
      canvas.height !== img.naturalHeight
    ) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      stageRef.current?.style.setProperty(
        "--ar",
        String(img.naturalWidth / img.naturalHeight),
      );
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    drawnFrameRef.current = index;
  }, []);

  /* ------------------------------------------------------------------------ */
  /* PRELOAD                                                                  */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    const frames: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(
      null,
    );
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false);

    framesRef.current = frames;
    loadedRef.current = loaded;
    drawnFrameRef.current = -1;

    const load = (index: number) => {
      const img = new window.Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        loaded[index] = true;
        if (index === 0) {
          drawFrame(targetFrameRef.current);
          measure(); // aspect ratio known → group height changed
        } else if (index <= targetFrameRef.current) {
          drawFrame(targetFrameRef.current);
        }
      };
      img.src = getFramePath(index);
      frames[index] = img;
    };

    load(0);
    if (animated) {
      for (let i = 1; i < FRAME_COUNT; i += 1) load(i);
    } else {
      load(FRAME_COUNT - 1);
    }

    return () => {
      cancelled = true;
      for (const img of frames) {
        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      }
    };
  }, [animated, drawFrame, measure]);

  /* ------------------------------------------------------------------------ */
  /* SCENE                                                                    */
  /* ------------------------------------------------------------------------ */

  const updateScene = useCallback(
    (progress: number) => {
      /* 1. Frames — linear so the bite lands where the video put it */
      const frameProgress = range(progress, FRAME_START, FRAME_END);
      const frameIndex = Math.round(frameProgress * (FRAME_COUNT - 1));
      targetFrameRef.current = frameIndex;
      drawFrame(frameIndex);

      /* 2. Hero group settles into its measured top zone;
            identity card rises into its own zone underneath */
      const identity = easeOutCubic(range(progress, REVEAL_START, REVEAL_END));
      const move = easeInOut(range(progress, REVEAL_START, REVEAL_END));
      const { scale, shift } = metricsRef.current;

      if (groupRef.current) {
        groupRef.current.style.transform = `translate3d(0, calc(-50% - ${(
          move * shift
        ).toFixed(2)}px), 0) scale(${(1 - move * (1 - scale)).toFixed(4)})`;
      }

      if (revealRef.current) {
        revealRef.current.style.opacity = identity.toFixed(3);
        revealRef.current.style.transform = `translate3d(0, ${(
          (1 - identity) *
          40
        ).toFixed(2)}px, 0)`;
        revealRef.current.style.pointerEvents =
          identity > 0.6 ? "auto" : "none";
      }

      /* 3. Progress line */
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      }

      /* 4. Scroll cue */
      if (cueRef.current) {
        const fade = easeInOut(range(progress, 0.01, 0.1));
        cueRef.current.style.opacity = (1 - fade).toFixed(3);
      }
    },
    [drawFrame],
  );

  /* ------------------------------------------------------------------------ */
  /* SCROLL ENGINE                                                            */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!animated) {
      targetFrameRef.current = FRAME_COUNT - 1;
      measure();
      updateScene(1);

      const onResize = () => {
        measure();
        updateScene(1);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let raf = 0;

    const calculate = () => {
      raf = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      updateScene(total > 0 ? clamp(-rect.top / total) : 0);
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(calculate);
    };

    const onResize = () => {
      measure();
      schedule();
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);

    measure();
    calculate();

    /* fonts change text height → re-measure once they are ready */
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        measure();
        schedule();
      });
    }

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [animated, measure, updateScene]);

  /* Static mode: paint the last frame as soon as it has loaded */
  useEffect(() => {
    if (animated) return;
    const t = window.setInterval(() => {
      if (loadedRef.current[FRAME_COUNT - 1]) {
        drawFrame(FRAME_COUNT - 1);
        measure();
        updateScene(1);
        window.clearInterval(t);
      }
    }, 120);
    return () => window.clearInterval(t);
  }, [animated, drawFrame, measure, updateScene]);

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
      <div className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden">
        {/* ------------------------- paper atmosphere ------------------------ */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 50% 46%, rgba(255,246,224,.75), transparent 70%),
              radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(120,84,48,.22) 100%)
            `,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: GRAIN,
            backgroundSize: "160px 160px",
            mixBlendMode: "multiply",
            opacity: 0.4,
          }}
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