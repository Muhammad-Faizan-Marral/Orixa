"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

import type { ThemeSectionProps } from "@/themes/types";

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

function clean(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function cleanUrl(value: unknown): string | null {
  const valueString = clean(value);

  if (!valueString) {
    return null;
  }

  try {
    const url = new URL(valueString);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function formatCount(value: number): string {
  return value > 99 ? "99+" : String(value);
}

/** True while the element intersects the viewport (used to pause CSS loops). */
function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;

    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );

    io.observe(el);

    return () => io.disconnect();
  }, [ref]);

  return inView;
}

/* ========================================================================== */
/* SOFT GLOWS                                                                 */
/*                                                                            */
/* The old atmosphere used huge solid circles with blur-[100px]. A CSS blur   */
/* on elements this large is re-run by the GPU every frame while they move.   */
/* A blurred disc IS a gaussian-edged disc, so we build the same falloff as a */
/* plain radial-gradient (no filter at all). Computed once at module load.    */
/* ========================================================================== */

function erf(x: number): number {
  const sign = Math.sign(x);
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t -
      0.284496736) *
      t +
      0.254829592) *
      t) *
      Math.exp(-ax * ax);

  return sign * y;
}

const phi = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2));

/**
 * @param rgb    "r,g,b"
 * @param alpha  peak opacity of the original disc
 * @param rho    original disc radius / new element radius
 * @param sigma  blur sigma / new element radius
 */
function softDisc(rgb: string, alpha: number, rho: number, sigma: number) {
  const stops = [0, 0.4, 0.55, 0.65, 0.75, 0.85, 0.93, 1].map((t) => {
    const a = t === 1 ? 0 : alpha * phi((rho - t) / sigma);

    return `rgba(${rgb},${a.toFixed(3)}) ${(t * 100).toFixed(0)}%`;
  });

  return `radial-gradient(circle closest-side, ${stops.join(",")})`;
}

const GLOW_RIGHT = softDisc("34,48,210", 0.65, 0.769, 0.184);
const GLOW_LEFT = softDisc("34,48,210", 0.55, 0.769, 0.214);
const GLOW_SUN = softDisc("244,233,169", 0.1, 0.5, 0.248);

/** 620px circle, now a fixed bitmap that is moved with a transform (no repaint). */
const SPOTLIGHT_BG =
  "radial-gradient(620px circle at 50% 50%, rgba(244,233,169,0.12), transparent 64%)";

const GRID_BG =
  "linear-gradient(rgba(246,242,231,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(246,242,231,0.8) 1px, transparent 1px)";

/* ========================================================================== */
/* THEME                                                                      */
/* ========================================================================== */

const DISPLAY = "font-[family-name:var(--font-display)]";

const TEXT = "font-[family-name:var(--font-text)]";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NAME_SIZE =
  "text-[clamp(4rem,14.5vw,15.5rem)] font-normal leading-[0.78] tracking-[-0.055em]";

const LENS_D = 470; // 2 × 235px, same lens as before
const LENS_R = LENS_D / 2;
const LENS_MASK = "radial-gradient(circle closest-side, #000 44%, transparent 100%)";

/**
 * Infinite loops as pure CSS keyframes: compositor-only, no JS per frame,
 * not run at all inside display:none (orbit on phones), and pausable
 * off-screen via animation-play-state.
 */
const KEYFRAMES = `
@keyframes hero-spin{to{transform:rotate(360deg)}}
@keyframes hero-spin-rev{to{transform:rotate(-360deg)}}
@keyframes hero-sun{0%,100%{transform:scale(1);opacity:.45}50%{transform:scale(1.05);opacity:.65}}
@keyframes hero-cue{0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(7px);opacity:1}}
`;

/* ========================================================================== */
/* SMALL ICONS                                                                */
/* ========================================================================== */

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={`h-3.5 w-3.5 ${className}`}
    >
      <path
        d="M2 12L12 2M4 2H12V10"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/* ========================================================================== */
/* NAME LINES                                                                 */
/* ========================================================================== */

function NameLines({
  words,
  rise,
  className,
}: {
  words: string[];
  rise: Variants;
  className: string;
}) {
  return (
    <span className={`flex flex-col ${className}`}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className={[
            "block overflow-hidden pb-[0.1em] pr-[0.08em]",
            index % 2 === 1
              ? "ml-[8vw] italic sm:ml-[11vw] lg:ml-[14vw]"
              : "",
          ].join(" ")}
        >
          <motion.span variants={rise} className="block will-change-transform">
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ========================================================================== */
/* FLOATING ORBIT                                                             */
/*                                                                            */
/* The two solid circular rings used to be "rotated" by JS every frame, but a */
/* rotated circle outline looks identical, so they're static now. Only the    */
/* dashed ring and the orbital dot visibly rotate, and those run in CSS.      */
/* ========================================================================== */

function OrbitSystem({ animated, paused }: { animated: boolean; paused: boolean }) {
  const play = paused ? "paused" : "running";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-[-8rem] top-[16%] hidden h-[34rem] w-[34rem] lg:block"
    >
      {/* Main ring (static: rotation of a plain circle is invisible) */}
      <div className="absolute inset-0 rounded-full border border-[#F6F2E7]/10" />

      {/* Dashed ring */}
      <div
        className="absolute inset-[9%] rounded-full border border-dashed border-[#F4E9A9]/25"
        style={{
          animation: animated ? "hero-spin-rev 26s linear infinite" : undefined,
          animationPlayState: play,
        }}
      />

      {/* Inner ring (static) */}
      <div className="absolute inset-[23%] rounded-full border border-[#F6F2E7]/10" />

      {/* Orbital dot */}
      <span
        className="absolute inset-0"
        style={{
          animation: animated ? "hero-spin 11s linear infinite" : undefined,
          animationPlayState: play,
        }}
      >
        <span className="absolute left-1/2 top-[-2px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#F4E9A9] shadow-[0_0_30px_rgba(244,233,169,0.65)]" />
      </span>

      {/* Core */}
      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#F4E9A9]/20 bg-[#161F9C]/30 backdrop-blur-xl">
        <div className="absolute inset-3 rounded-full border border-[#F6F2E7]/10" />

        <div className="text-center">
          <span className="block text-[8px] uppercase tracking-[0.24em] text-[#F6F2E7]/45">
            Design
          </span>

          <span
            className={`${DISPLAY} mt-2 block text-2xl tracking-[-0.045em] text-[#F6F2E7]`}
          >
            Engine
          </span>
        </div>
      </div>

      {/* Tiny labels */}
      <span className="absolute left-[13%] top-[18%] text-[8px] uppercase tracking-[0.2em] text-[#F6F2E7]/25">
        01
      </span>

      <span className="absolute bottom-[19%] right-[12%] text-[8px] uppercase tracking-[0.2em] text-[#F6F2E7]/25">
        OX
      </span>
    </div>
  );
}

/* ========================================================================== */
/* HERO                                                                       */
/* ========================================================================== */

export default function HeroDefault({ config, profile }: ThemeSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const animationsEnabled = config.animations !== false && !shouldReduceMotion;

  /* ------------------------------------------------------------------------ */
  /* VIEW MODEL                                                               */
  /* ------------------------------------------------------------------------ */

  const view = useMemo(() => {
    /* `name` always has the "Portfolio" fallback, so the old
       "empty state → return null" branch could never run (and it sat before
       the hooks below, which breaks the rules of hooks). It is removed. */
    const name =
      clean(config.name) ??
      clean(profile.fullName) ??
      clean(profile.username) ??
      "Portfolio";

    const headline = clean(config.headline);
    const about = clean(config.about);
    const location = clean(config.location);
    const phone = clean(config.phone);
    const resumeUrl = cleanUrl(config.resumeUrl);

    const projects = Array.isArray(config.projects)
      ? config.projects.filter((project) => clean(project?.title) !== null)
      : [];

    const experience = Array.isArray(config.experience)
      ? config.experience.filter(
          (item) => clean(item?.company) !== null && clean(item?.role) !== null,
        )
      : [];

    return {
      name,
      nameWords: name.split(/\s+/).filter(Boolean),
      headline,
      about,
      location,
      phone,
      telHref: phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null,
      resumeUrl,
      projectsCount: projects.length,
      experienceCount: experience.length,
      hasResume: Boolean(resumeUrl),
    };
  }, [config, profile]);

  const nameWords = view.nameWords;

  /* ------------------------------------------------------------------------ */
  /* REFS + VISIBILITY                                                        */
  /* ------------------------------------------------------------------------ */

  const heroRef = useRef<HTMLElement | null>(null);
  const nameRef = useRef<HTMLDivElement | null>(null);

  const inView = useInView(heroRef);
  const playState = inView ? "running" : "paused";

  /* ------------------------------------------------------------------------ */
  /* POINTER SYSTEM                                                           */
  /* ------------------------------------------------------------------------ */

  /* Spotlight: offset from its resting point (50% / 42%), moved by transform. */
  const spotX = useSpring(useMotionValue(0), {
    stiffness: 70,
    damping: 22,
    mass: 0.7,
  });

  const spotY = useSpring(useMotionValue(0), {
    stiffness: 70,
    damping: 22,
    mass: 0.7,
  });

  const nameRawX = useMotionValue(-500);
  const nameRawY = useMotionValue(0);

  const nameLensX = useSpring(nameRawX, {
    stiffness: 110,
    damping: 23,
    mass: 0.7,
  });

  const nameLensY = useSpring(nameRawY, {
    stiffness: 110,
    damping: 23,
    mass: 0.7,
  });

  /*
    Gold lens. The lens box moves by transform; the gold copy of the name is
    moved by the exact opposite amount inside it, so it stays aligned with the
    outline text. The soft edge is a STATIC mask on the lens. Before, the mask
    gradient itself changed every pointer move (a full repaint of a huge
    text layer per frame). Values are rounded to whole pixels so both copies
    stay perfectly registered and crisp.
  */
  const lensX = useTransform(nameLensX, (v) => Math.round(v - LENS_R));
  const lensY = useTransform(nameLensY, (v) => Math.round(v - LENS_R));
  const counterX = useTransform(lensX, (v) => -v);
  const counterY = useTransform(lensY, (v) => -v);

  /* ------------------------------------------------------------------------ */
  /* SCROLL                                                                   */
  /* ------------------------------------------------------------------------ */

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const visualOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 0.91]);
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  /* ------------------------------------------------------------------------ */
  /* OPENING LENS + NAME WIDTH                                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!animationsEnabled) {
      return;
    }

    const box = nameRef.current;

    if (!box) {
      return;
    }

    /* The gold copy lives inside a 470px lens, so it needs the real name
       width; kept in a CSS variable (no React re-render on resize). */
    const syncWidth = () => {
      box.style.setProperty("--name-w", `${box.offsetWidth}px`);
    };

    syncWidth();

    const ro = new ResizeObserver(syncWidth);
    ro.observe(box);

    const { width, height } = box.getBoundingClientRect();

    nameRawY.set(height * 0.45);

    const controls = animate(nameRawX, [-280, width * 0.6], {
      duration: 2.4,
      delay: 0.6,
      ease: EASE,
    });

    return () => {
      ro.disconnect();
      controls.stop();
    };
  }, [animationsEnabled, nameRawX, nameRawY]);

  /* ------------------------------------------------------------------------ */
  /* POINTER HANDLER (native, rects cached)                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!animationsEnabled) {
      return;
    }

    const hero = heroRef.current;

    if (!hero) {
      return;
    }

    let heroRect = hero.getBoundingClientRect();
    let nameRect = nameRef.current?.getBoundingClientRect() ?? null;
    let dirty = false;

    const markDirty = () => {
      dirty = true;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      /* rects are only re-read after scroll/resize, not on every move */
      if (dirty) {
        heroRect = hero.getBoundingClientRect();
        nameRect = nameRef.current?.getBoundingClientRect() ?? null;
        dirty = false;
      }

      if (!heroRect.width || !heroRect.height) return;

      spotX.set(event.clientX - heroRect.left - heroRect.width * 0.5);
      spotY.set(event.clientY - heroRect.top - heroRect.height * 0.42);

      if (nameRect) {
        nameRawX.set(event.clientX - nameRect.left);
        nameRawY.set(event.clientY - nameRect.top);
      }
    };

    hero.addEventListener("pointerenter", markDirty, { passive: true });
    hero.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", markDirty, { passive: true });
    window.addEventListener("resize", markDirty, { passive: true });

    return () => {
      hero.removeEventListener("pointerenter", markDirty);
      hero.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", markDirty);
      window.removeEventListener("resize", markDirty);
    };
  }, [animationsEnabled, spotX, spotY, nameRawX, nameRawY]);

  /* ------------------------------------------------------------------------ */
  /* MOTION VARIANTS                                                          */
  /* ------------------------------------------------------------------------ */

  const { container, rise, fade } = useMemo(() => {
    const containerVariants: Variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: animationsEnabled ? 0.1 : 0,
          delayChildren: animationsEnabled ? 0.05 : 0,
        },
      },
    };

    const riseVariants: Variants = {
      hidden: {
        y: animationsEnabled ? "112%" : "0%",
      },
      visible: {
        y: "0%",
        transition: { duration: 1.05, ease: EASE },
      },
    };

    const fadeVariants: Variants = {
      hidden: {
        opacity: animationsEnabled ? 0 : 1,
        y: animationsEnabled ? 10 : 0,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.85, ease: EASE },
      },
    };

    return {
      container: containerVariants,
      rise: riseVariants,
      fade: fadeVariants,
    };
  }, [animationsEnabled]);

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <section
      ref={heroRef}
      id="hero"
      className={`${TEXT} relative isolate flex min-h-[100svh] overflow-hidden bg-[#161F9C] text-[#F6F2E7]`}
    >
      <style>{KEYFRAMES}</style>

      {/* ================================================================== */}
      {/* ATMOSPHERE                                                           */}
      {/* ================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Pointer light: fixed 1240px gradient, moved via transform */}
        <motion.div
          className="absolute"
          style={{
            left: "50%",
            top: "42%",
            width: 1240,
            height: 1240,
            marginLeft: -620,
            marginTop: -620,
            background: SPOTLIGHT_BG,
            x: spotX,
            y: spotY,
            opacity: visualOpacity,
            willChange: "transform, opacity",
          }}
        />

        {/* Large blue atmosphere (gradient glows, no blur filter) */}
        <motion.div
          style={{
            y: visualY,
            right: "-26.7vw",
            top: "-26.7vw",
            width: "75.4vw",
            height: "75.4vw",
            background: GLOW_RIGHT,
            willChange: "transform",
          }}
          className="absolute rounded-full"
        />

        <motion.div
          style={{
            y: visualY,
            left: "-28.25vw",
            bottom: "-28.25vw",
            width: "71.5vw",
            height: "71.5vw",
            background: GLOW_LEFT,
            willChange: "transform",
          }}
          className="absolute rounded-full"
        />

        {/* Yellow sun */}
        <div
          className="absolute rounded-full"
          style={{
            left: "calc(36% - 14vw)",
            top: "calc(17% - 14vw)",
            width: "56vw",
            height: "56vw",
            background: GLOW_SUN,
            willChange: animationsEnabled ? "transform, opacity" : undefined,
            animation: animationsEnabled
              ? "hero-sun 8s ease-in-out infinite"
              : undefined,
            animationPlayState: playState,
          }}
        />

        {/* Blueprint grid */}
        <motion.div
          style={{
            y: gridY,
            willChange: "transform",
          }}
          className="absolute inset-0 opacity-[0.06]"
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage: GRID_BG,
              backgroundSize: "80px 80px",
            }}
          />
        </motion.div>

        {/* Horizontal technical lines */}
        <div className="absolute left-0 right-0 top-[23%] h-px bg-[#F6F2E7]/[0.07]" />

        <div className="absolute left-0 right-0 top-[72%] h-px bg-[#F6F2E7]/[0.07]" />

        {/* Vertical center line */}
        <div className="absolute inset-y-0 left-1/2 hidden w-px bg-[#F6F2E7]/[0.06] lg:block" />
      </div>

      {/* ================================================================== */}
      {/* FRAME                                                                */}
      {/* ================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 z-30 rounded-[20px] border border-[#F6F2E7]/20 sm:inset-5 sm:rounded-[24px]"
      />

      {/* ================================================================== */}
      {/* ORBIT                                                                */}
      {/* ================================================================== */}

      <OrbitSystem animated={animationsEnabled} paused={!inView} />

      {/* ================================================================== */}
      {/* MAIN                                                                 */}
      {/* ================================================================== */}

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col justify-between px-7 py-9 sm:px-12 sm:py-14 lg:px-16 lg:py-16"
      >
        {/* ================================================================ */}
        {/* TOP CONTROL BAR                                                    */}
        {/* ================================================================ */}

        <motion.div
          variants={fade}
          className="relative z-40 flex items-start justify-between gap-5"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              {animationsEnabled && (
                <span
                  className="absolute inset-0 animate-ping rounded-full bg-[#F4E9A9]/60"
                  style={{ animationPlayState: playState }}
                />
              )}

              <span className="relative h-2 w-2 rounded-full bg-[#F4E9A9]" />
            </span>

            <span className="text-[9px] uppercase tracking-[0.22em] text-[#F6F2E7]/65 sm:text-[10px]">
              Open to new work
            </span>
          </div>

          <div className="flex items-center gap-5 text-right">
            <div className="hidden sm:block">
              <span className="block text-[8px] uppercase tracking-[0.2em] text-[#F6F2E7]/30">
                Based in
              </span>

              <span className="mt-1 block max-w-[25ch] truncate text-[10px] text-[#F6F2E7]/65">
                {view.location ?? "Available worldwide"}
              </span>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F6F2E7]/15">
              <span className="text-[8px] uppercase tracking-[0.15em] text-[#F6F2E7]/45">
                01
              </span>
            </div>
          </div>
        </motion.div>

        {/* ================================================================ */}
        {/* MAIN NAME                                                         */}
        {/* ================================================================ */}

        <motion.div
          style={{
            scale: nameScale,
            willChange: "transform",
          }}
          className="relative z-20 my-auto py-14 sm:py-16 lg:py-20"
        >
          {/* Editorial coordinates */}
          <div className="mb-8 flex items-center gap-4 sm:mb-12">
            <span className="h-px w-10 bg-[#F4E9A9]/70" />

            <span className="text-[8px] uppercase tracking-[0.22em] text-[#F6F2E7]/35">
              Digital portfolio
            </span>
          </div>

          {/* Name lens */}
          <div ref={nameRef} className="relative max-w-[1250px]">
            <h1 aria-label={view.name} className="relative z-10">
              <NameLines
                words={nameWords}
                rise={rise}
                className={`${DISPLAY} ${NAME_SIZE} ${
                  animationsEnabled
                    ? "text-transparent [-webkit-text-stroke:1.4px_rgba(246,242,231,0.62)] sm:[-webkit-text-stroke:1.8px_rgba(246,242,231,0.62)]"
                    : "text-[#F6F2E7]"
                }`}
              />
            </h1>

            {/* Gold lens fill */}
            {animationsEnabled && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20"
              >
                <motion.div
                  style={{
                    x: lensX,
                    y: lensY,
                    width: LENS_D,
                    height: LENS_D,
                    maskImage: LENS_MASK,
                    WebkitMaskImage: LENS_MASK,
                    willChange: "transform",
                  }}
                  className="absolute left-0 top-0"
                >
                  <motion.div
                    style={{
                      x: counterX,
                      y: counterY,
                      width: "var(--name-w, 100%)",
                      willChange: "transform",
                    }}
                    className="absolute left-0 top-0"
                  >
                    <NameLines
                      words={nameWords}
                      rise={rise}
                      className={`${DISPLAY} ${NAME_SIZE} text-[#F4E9A9]`}
                    />
                  </motion.div>
                </motion.div>
              </div>
            )}

            {/* Small index marker */}
            <div className="absolute -bottom-5 right-[10%] hidden items-center gap-3 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F4E9A9]" />

              <span className="text-[8px] uppercase tracking-[0.2em] text-[#F6F2E7]/30">
                Identity / 001
              </span>
            </div>
          </div>

          {/* Headline overlay */}
          {view.headline && (
            <motion.div
              variants={fade}
              className="mt-12 max-w-[720px] lg:mt-14"
            >
              <p
                className={`${DISPLAY} text-[clamp(1.8rem,3.2vw,3.6rem)] leading-[0.98] tracking-[-0.035em] text-[#F6F2E7]/90`}
              >
                {view.headline}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* ================================================================ */}
        {/* BOTTOM SYSTEM                                                      */}
        {/* ================================================================ */}

        <motion.div
          variants={fade}
          className="relative z-40 grid gap-8 border-t border-[#F6F2E7]/15 pt-6 lg:grid-cols-12 lg:gap-8"
        >
          {/* About */}
          <div className="lg:col-span-5">
            {view.about && (
              <p className="max-w-[50ch] text-[13px] leading-[1.8] text-[#F6F2E7]/62 sm:text-[14px]">
                {view.about}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[9px] uppercase tracking-[0.18em] text-[#F6F2E7]/35">
              {view.projectsCount > 0 && (
                <span>
                  <span className="text-[#F6F2E7]">
                    {formatCount(view.projectsCount)}
                  </span>{" "}
                  {view.projectsCount === 1 ? "Project" : "Projects"}
                </span>
              )}

              {view.experienceCount > 0 && (
                <span>
                  <span className="text-[#F6F2E7]">
                    {formatCount(view.experienceCount)}
                  </span>{" "}
                  {view.experienceCount === 1 ? "Role" : "Roles"}
                </span>
              )}

              {view.phone && view.telHref && (
                <a
                  href={view.telHref}
                  className="text-[#F6F2E7]/60 underline decoration-[#F6F2E7]/20 underline-offset-4 transition-colors duration-300 hover:text-[#F4E9A9] hover:decoration-[#F4E9A9]/50"
                >
                  {view.phone}
                </a>
              )}
            </div>
          </div>

          {/* Coordinates */}
          <div className="hidden lg:col-span-3 lg:flex lg:items-end">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-[#F6F2E7]/20" />

              <div>
                <span className="block text-[8px] uppercase tracking-[0.2em] text-[#F6F2E7]/25">
                  Current state
                </span>

                <span className="mt-1 block text-[10px] text-[#F6F2E7]/60">
                  Building / shipping / learning
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 lg:col-span-4 lg:justify-end">
            {view.projectsCount > 0 && (
              <a
                href="#projects"
                className="group relative inline-flex min-h-12 items-center gap-4 overflow-hidden bg-[#F4E9A9] px-6 text-[9px] uppercase tracking-[0.2em] text-[#161F9C] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4E9A9]"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/40 transition-transform duration-700 ease-out group-hover:translate-x-[320%]"
                />

                <span className="relative">See the work</span>

                <ArrowIcon className="relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}

            {view.hasResume ? (
              <a
                href={view.resumeUrl!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open resume in a new tab"
                className="group inline-flex min-h-12 items-center gap-3 border border-[#F6F2E7]/20 px-6 text-[9px] uppercase tracking-[0.2em] text-[#F6F2E7]/65 transition-all duration-300 hover:border-[#F4E9A9]/45 hover:text-[#F6F2E7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4E9A9]"
              >
                Resume
                <ArrowIcon className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ) : (
              <a
                href="#contact"
                className="group inline-flex min-h-12 items-center gap-3 border border-[#F6F2E7]/20 px-6 text-[9px] uppercase tracking-[0.2em] text-[#F6F2E7]/65 transition-all duration-300 hover:border-[#F4E9A9]/45 hover:text-[#F6F2E7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4E9A9]"
              >
                Get in touch
                <ArrowIcon className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
        </motion.div>

        {/* ================================================================ */}
        {/* SCROLL CUE                                                        */}
        {/* ================================================================ */}

        <motion.div
          variants={fade}
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        >
          <span className="text-[7px] uppercase tracking-[0.22em] text-[#F6F2E7]/25">
            Scroll
          </span>

          <span
            className="h-7 w-px bg-gradient-to-b from-[#F4E9A9] to-transparent"
            style={{
              animation: animationsEnabled
                ? "hero-cue 1.8s ease-in-out infinite"
                : undefined,
              animationPlayState: playState,
            }}
          />
        </motion.div>

        {/* ================================================================ */}
        {/* SIDE INDEX                                                         */}
        {/* ================================================================ */}

        <motion.div
          variants={fade}
          className="absolute bottom-[8rem] right-7 hidden flex-col items-center gap-3 xl:flex"
        >
          <span className="h-10 w-px bg-[#F6F2E7]/15" />

          <span
            style={{ writingMode: "vertical-rl" }}
            className="text-[7px] uppercase tracking-[0.24em] text-[#F6F2E7]/25"
          >
            Orixa Design Engine
          </span>

          <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />
        </motion.div>
      </motion.div>
    </section>
  );
}