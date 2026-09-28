"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  animate,
  motion,
  useMotionTemplate,
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

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
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

/* ========================================================================== */
/* THEME                                                                      */
/* ========================================================================== */

const DISPLAY =
  "font-[family-name:var(--font-display)]";

const TEXT =
  "font-[family-name:var(--font-text)]";

const EASE: [number, number, number, number] = [
  0.22,
  1,
  0.36,
  1,
];

/* ========================================================================== */
/* SMALL ICONS                                                                */
/* ========================================================================== */

function ArrowIcon({
  className = "",
}: {
  className?: string;
}) {
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

function PlusIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={`h-3.5 w-3.5 ${className}`}
    >
      <path
        d="M7 2V12M2 7H12"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="square"
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
          <motion.span
            variants={rise}
            className="block will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ========================================================================== */
/* FLOATING ORBIT                                                             */
/* ========================================================================== */

function OrbitSystem({
  reduced,
}: {
  reduced: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-[-8rem] top-[16%] hidden h-[34rem] w-[34rem] lg:block"
    >
      {/* Main ring */}
      <motion.div
        animate={
          reduced
            ? undefined
            : {
                rotate: 360,
              }
        }
        transition={{
          duration: 34,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 rounded-full border border-[#F6F2E7]/10"
      />

      {/* Dashed ring */}
      <motion.div
        animate={
          reduced
            ? undefined
            : {
                rotate: -360,
              }
        }
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-[9%] rounded-full border border-dashed border-[#F4E9A9]/25"
      />

      {/* Inner ring */}
      <motion.div
        animate={
          reduced
            ? undefined
            : {
                rotate: 360,
              }
        }
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-[23%] rounded-full border border-[#F6F2E7]/10"
      />

      {/* Orbital dot */}
      <motion.span
        animate={
          reduced
            ? undefined
            : {
                rotate: 360,
              }
        }
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0"
      >
        <span className="absolute left-1/2 top-[-2px] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#F4E9A9] shadow-[0_0_30px_rgba(244,233,169,0.65)]" />
      </motion.span>

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
/* HERO                                                                      */
/* ========================================================================== */

export default function HeroDefault({
  config,
  profile,
}: ThemeSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const animationsEnabled =
    config.animations !== false &&
    !shouldReduceMotion;

  /* ------------------------------------------------------------------------ */
  /* VIEW MODEL                                                               */
  /* ------------------------------------------------------------------------ */

  const view = useMemo(() => {
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
      ? config.projects.filter(
          (project) =>
            clean(project?.title) !== null,
        )
      : [];

    const experience = Array.isArray(
      config.experience,
    )
      ? config.experience.filter(
          (item) =>
            clean(item?.company) !== null &&
            clean(item?.role) !== null,
        )
      : [];

    return {
      name,
      headline,
      about,
      location,
      phone,
      resumeUrl,
      projectsCount: projects.length,
      experienceCount: experience.length,
      hasResume: Boolean(resumeUrl),
    };
  }, [config, profile]);

  const nameWords = view.name
    .split(/\s+/)
    .filter(Boolean);

  /* ------------------------------------------------------------------------ */
  /* EMPTY STATE                                                              */
  /* ------------------------------------------------------------------------ */

  if (
    !view.name &&
    !view.headline &&
    !view.about
  ) {
    return null;
  }

  /* ------------------------------------------------------------------------ */
  /* POINTER SYSTEM                                                           */
  /* ------------------------------------------------------------------------ */

  const heroRef =
    useRef<HTMLElement | null>(null);

  const nameRef =
    useRef<HTMLDivElement | null>(null);

  const rawPointerX = useMotionValue(50);
  const rawPointerY = useMotionValue(42);

  const pointerX = useSpring(rawPointerX, {
    stiffness: 70,
    damping: 22,
    mass: 0.7,
  });

  const pointerY = useSpring(rawPointerY, {
    stiffness: 70,
    damping: 22,
    mass: 0.7,
  });

  const spotlight = useMotionTemplate`
    radial-gradient(
      620px circle at ${pointerX}% ${pointerY}%,
      rgba(244,233,169,0.12),
      transparent 64%
    )
  `;

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

  const nameMask = useMotionTemplate`
    radial-gradient(
      circle 235px at ${nameLensX}px ${nameLensY}px,
      #000 44%,
      transparent 100%
    )
  `;

  /* ------------------------------------------------------------------------ */
  /* SCROLL                                                                  */
  /* ------------------------------------------------------------------------ */

  const { scrollYProgress } =
    useScroll({
      target: heroRef,
      offset: ["start start", "end start"],
    });

  const visualY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "12%"],
  );

  const visualOpacity = useTransform(
    scrollYProgress,
    [0, 0.75],
    [1, 0],
  );

  const nameScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 0.91],
  );

  const gridY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "6%"],
  );

  /* ------------------------------------------------------------------------ */
  /* OPENING LENS                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!animationsEnabled) {
      return;
    }

    const box = nameRef.current;

    if (!box) {
      return;
    }

    const { width, height } =
      box.getBoundingClientRect();

    nameRawY.set(height * 0.45);

    const controls = animate(
      nameRawX,
      [-280, width * 0.6],
      {
        duration: 2.4,
        delay: 0.6,
        ease: EASE,
      },
    );

    return () => {
      controls.stop();
    };
  }, [
    animationsEnabled,
    nameRawX,
    nameRawY,
  ]);

  /* ------------------------------------------------------------------------ */
  /* POINTER HANDLER                                                          */
  /* ------------------------------------------------------------------------ */

  function handlePointerMove(
    event: React.PointerEvent<HTMLElement>,
  ) {
    if (!animationsEnabled) {
      return;
    }

    const target =
      event.currentTarget;

    const rect =
      target.getBoundingClientRect();

    rawPointerX.set(
      ((event.clientX - rect.left) /
        rect.width) *
        100,
    );

    rawPointerY.set(
      ((event.clientY - rect.top) /
        rect.height) *
        100,
    );

    const nameBox =
      nameRef.current;

    if (!nameBox) {
      return;
    }

    const nameRect =
      nameBox.getBoundingClientRect();

    nameRawX.set(
      event.clientX -
        nameRect.left,
    );

    nameRawY.set(
      event.clientY -
        nameRect.top,
    );
  }

  /* ------------------------------------------------------------------------ */
  /* MOTION VARIANTS                                                          */
  /* ------------------------------------------------------------------------ */

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: animationsEnabled
          ? 0.1
          : 0,
        delayChildren: animationsEnabled
          ? 0.05
          : 0,
      },
    },
  };

  const rise: Variants = {
    hidden: {
      y: animationsEnabled
        ? "112%"
        : "0%",
    },
    visible: {
      y: "0%",
      transition: {
        duration: 1.05,
        ease: EASE,
      },
    },
  };

  const fade: Variants = {
    hidden: {
      opacity: animationsEnabled
        ? 0
        : 1,
      y: animationsEnabled ? 10 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: EASE,
      },
    },
  };

  const nameSize =
    "text-[clamp(4rem,14.5vw,15.5rem)] font-normal leading-[0.78] tracking-[-0.055em]";

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <section
      ref={heroRef}
      id="hero"
      onPointerMove={
        animationsEnabled
          ? handlePointerMove
          : undefined
      }
      className={`${TEXT} relative isolate flex min-h-[100svh] overflow-hidden bg-[#161F9C] text-[#F6F2E7]`}
    >
      {/* ================================================================== */}
      {/* ATMOSPHERE                                                           */}
      {/* ================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Pointer light */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: spotlight,
            opacity: visualOpacity,
          }}
        />

        {/* Large blue/cream atmosphere */}
        <motion.div
          style={{
            y: visualY,
          }}
          className="absolute -right-[18vw] top-[-18vw] h-[58vw] w-[58vw] rounded-full bg-[#2230D2]/65 blur-[100px]"
        />

        <motion.div
          style={{
            y: visualY,
          }}
          className="absolute -left-[20vw] bottom-[-20vw] h-[55vw] w-[55vw] rounded-full bg-[#2230D2]/55 blur-[110px]"
        />

        {/* Yellow sun */}
        <motion.div
          animate={
            reducedMotionSafe(shouldReduceMotion)
              ? undefined
              : {
                  scale: [1, 1.05, 1],
                  opacity: [0.45, 0.65, 0.45],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[36%] top-[17%] h-[28vw] w-[28vw] rounded-full bg-[#F4E9A9]/10 blur-[100px]"
        />

        {/* Blueprint grid */}
        <motion.div
          style={{
            y: gridY,
          }}
          className="absolute inset-0 opacity-[0.06]"
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(246,242,231,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(246,242,231,0.8) 1px, transparent 1px)",
              backgroundSize:
                "80px 80px",
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

      <OrbitSystem reduced={Boolean(shouldReduceMotion)} />

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
              {!shouldReduceMotion && (
                <span className="absolute inset-0 animate-ping rounded-full bg-[#F4E9A9]/60" />
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
                {view.location ??
                  "Available worldwide"}
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
          <div
            ref={nameRef}
            className="relative max-w-[1250px]"
          >
            <h1
              aria-label={view.name}
              className="relative z-10"
            >
              <NameLines
                words={nameWords}
                rise={rise}
                className={`${DISPLAY} ${nameSize} ${
                  animationsEnabled
                    ? "text-transparent [-webkit-text-stroke:1.4px_rgba(246,242,231,0.62)] sm:[-webkit-text-stroke:1.8px_rgba(246,242,231,0.62)]"
                    : "text-[#F6F2E7]"
                }`}
              />
            </h1>

            {/* Gold lens fill */}
            {animationsEnabled && (
              <motion.div
                aria-hidden="true"
                style={{
                  WebkitMaskImage:
                    nameMask,
                  maskImage: nameMask,
                }}
                className="pointer-events-none absolute inset-0 z-20"
              >
                <NameLines
                  words={nameWords}
                  rise={rise}
                  className={`${DISPLAY} ${nameSize} text-[#F4E9A9]`}
                />
              </motion.div>
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
              <p className={`${DISPLAY} text-[clamp(1.8rem,3.2vw,3.6rem)] leading-[0.98] tracking-[-0.035em] text-[#F6F2E7]/90`}>
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
                    {formatCount(
                      view.projectsCount,
                    )}
                  </span>{" "}
                  {view.projectsCount === 1
                    ? "Project"
                    : "Projects"}
                </span>
              )}

              {view.experienceCount > 0 && (
                <span>
                  <span className="text-[#F6F2E7]">
                    {formatCount(
                      view.experienceCount,
                    )}
                  </span>{" "}
                  {view.experienceCount === 1
                    ? "Role"
                    : "Roles"}
                </span>
              )}

              {view.phone && (
                <a
                  href={`tel:${view.phone.replace(
                    /[^\d+]/g,
                    "",
                  )}`}
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
                  Building / shipping /
                  learning
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

                <span className="relative">
                  See the work
                </span>

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

          <motion.span
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, 7, 0],
                    opacity: [0.35, 1, 0.35],
                  }
            }
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-7 w-px bg-gradient-to-b from-[#F4E9A9] to-transparent"
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
            style={{
              writingMode: "vertical-rl",
            }}
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

/* ========================================================================== */
/* MOTION HELPER                                                              */
/* ========================================================================== */

function reducedMotionSafe(
  value: boolean | null,
): boolean {
  return Boolean(value);
}

