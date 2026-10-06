"use client";

import React, { useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { ThemeSectionProps } from "../../../types";

/* -------------------------------------------------------------------------- */
/* Typography                                                                 */
/* -------------------------------------------------------------------------- */

const DISPLAY = "font-[family-name:var(--font-display)]";
const TEXT = "font-[family-name:var(--font-text)]";

const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/* Theme DNA                                                                  */
/* -------------------------------------------------------------------------- */

const BLUE = "#2230D2";
const INDIGO = "#161F9C";
const CREAM = "#F6F2E7";
const YELLOW = "#F4E9A9";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const result = value.trim();

  return result.length > 0 ? result : null;
}

function cleanUrl(value: unknown): string | null {
  const valueString = clean(value);

  if (!valueString) return null;

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

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  return value as Record<string, unknown>;
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    const result = clean(value);

    if (result) return result;
  }

  return null;
}

function getInitials(name: string) {
  const words = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (words.length === 0) return "A";

  return words
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function formatCount(value: number) {
  return value < 10 ? `0${value}` : String(value);
}

function splitIntoSentences(value: string | null) {
  if (!value) return [];

  return value
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/* Small motion primitives                                                    */
/* -------------------------------------------------------------------------- */

function Reveal({
  children,
  enabled,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  enabled: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: enabled ? 0 : 1,
        y: enabled ? 24 : 0,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WordReveal({
  text,
  enabled,
}: {
  text: string;
  enabled: boolean;
}) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <span aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="mr-[0.24em] inline-block overflow-hidden align-top pb-[0.08em]"
        >
          <motion.span
            initial={{
              y: enabled ? "110%" : "0%",
              opacity: enabled ? 0 : 1,
            }}
            whileInView={{
              y: "0%",
              opacity: 1,
            }}
            viewport={{
              once: true,
              amount: 0.6,
            }}
            transition={{
              duration: 0.9,
              delay: Math.min(index * 0.035, 0.55),
              ease: EASE,
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function AboutDefault({
  config,
  profile,
}: ThemeSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  const animationsEnabled =
    config.animations !== false && !shouldReduceMotion;

  /* ------------------------------------------------------------------------ */
  /* View model                                                               */
  /* ------------------------------------------------------------------------ */

  const view = useMemo(() => {
    const rawConfig = asRecord(config);
    const rawProfile = asRecord(profile);

    const name =
      firstString(
        rawConfig.name,
        rawProfile.fullName,
        rawProfile.username,
      ) ?? "Portfolio";

    const headline = firstString(rawConfig.headline);

    const about = firstString(rawConfig.about);

    const location = firstString(
      rawConfig.location,
      rawProfile.location,
    );

    const phone = firstString(
      rawConfig.phone,
      rawProfile.phone,
    );

    const avatarUrl = cleanUrl(
      firstString(
        rawConfig.avatarUrl,
        rawConfig.profileImage,
        rawConfig.photoUrl,
      ),
    );

    const projects = Array.isArray(config.projects)
      ? config.projects.filter(
          (project) =>
            clean(asRecord(project).title) !== null,
        )
      : [];

    const experience = Array.isArray(config.experience)
      ? config.experience.filter(
          (item) => {
            const record = asRecord(item);

            return (
              clean(record.company) !== null &&
              clean(record.role) !== null
            );
          },
        )
      : [];

    return {
      name,
      headline,
      about,
      location,
      phone,
      avatarUrl,
      projectsCount: projects.length,
      experienceCount: experience.length,
    };
  }, [config, profile]);

  /* ------------------------------------------------------------------------ */
  /* Empty state                                                              */
  /* ------------------------------------------------------------------------ */

  if (!view.name && !view.headline && !view.about) {
    return null;
  }

  const aboutBlocks = splitIntoSentences(view.about);

  /* ------------------------------------------------------------------------ */
  /* Scroll choreography                                                      */
  /* ------------------------------------------------------------------------ */

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawPortraitY = useTransform(
    scrollYProgress,
    [0, 1],
    [48, -48],
  );

  const portraitY = useSpring(rawPortraitY, {
    stiffness: 90,
    damping: 22,
    mass: 0.7,
  });

  const rawRailY = useTransform(
    scrollYProgress,
    [0, 1],
    [20, -20],
  );

  const railY = useSpring(rawRailY, {
    stiffness: 100,
    damping: 24,
  });

  const rawWordX = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "-8%"],
  );

  const wordX = useSpring(rawWordX, {
    stiffness: 80,
    damping: 22,
  });

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`${TEXT} relative isolate overflow-hidden bg-[#F6F2E7] text-[#161F9C]`}
    >
      {/* -------------------------------------------------------------------- */}
      {/* Architectural background                                             */}
      {/* -------------------------------------------------------------------- */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-[8vw] top-[14%] h-[42vw] w-[42vw] max-w-[650px] rounded-full bg-[#2230D2]/[0.035] blur-3xl" />

        <div className="absolute right-[-10vw] top-[42%] h-[36vw] w-[36vw] rounded-full bg-[#F4E9A9]/40 blur-3xl" />

        <div className="absolute inset-y-0 left-[calc(50%-0.5px)] hidden w-px bg-[#161F9C]/[0.07] lg:block" />
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Top index bar                                                         */}
      {/* -------------------------------------------------------------------- */}

      <div className="mx-auto w-full max-w-[1600px] px-6 pt-8 sm:px-10 sm:pt-10 lg:px-14 lg:pt-12">
        <Reveal
          enabled={animationsEnabled}
          className="flex items-center justify-between border-t border-[#161F9C]/20 pt-4"
        >
          <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#161F9C]/60">
            <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />
            <span>02</span>
            <span className="hidden sm:inline">About</span>
          </div>

          <div className="text-[11px] uppercase tracking-[0.2em] text-[#161F9C]/45">
            Personal archive
          </div>
        </Reveal>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Main composition                                                      */}
      {/* -------------------------------------------------------------------- */}

      <div className="mx-auto w-full max-w-[1600px] px-6 pb-20 pt-16 sm:px-10 sm:pb-28 sm:pt-24 lg:px-14 lg:pb-36 lg:pt-32">
        <div className="relative">
          {/* --------------------------------------------------------------- */}
          {/* Giant background word                                           */}
          {/* --------------------------------------------------------------- */}

          <motion.div
            aria-hidden="true"
            style={{
              x: animationsEnabled ? wordX : 0,
            }}
            className="pointer-events-none absolute -right-[9vw] top-[3.5rem] hidden select-none lg:block"
          >
            <span
              className={`${DISPLAY} block text-[clamp(8rem,19vw,20rem)] font-normal uppercase leading-[0.73] tracking-[-0.07em] text-[#2230D2]/[0.055]`}
            >
              ABOUT
            </span>
          </motion.div>

          {/* --------------------------------------------------------------- */}
          {/* Identity heading                                                 */}
          {/* --------------------------------------------------------------- */}

          <div className="relative grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
            <Reveal
              enabled={animationsEnabled}
              className="lg:col-span-7"
            >
              <div className="max-w-[980px]">
                <p className="mb-7 text-[11px] uppercase tracking-[0.2em] text-[#161F9C]/55 sm:mb-10">
                  A little context
                </p>

                <h2
                  className={`${DISPLAY} text-[clamp(4rem,9vw,9rem)] font-normal leading-[0.82] tracking-[-0.055em] text-[#161F9C]`}
                >
                  Not just
                  <br />

                  <span className="ml-[11vw] italic text-[#2230D2] sm:ml-[15vw]">
                    a profile.
                  </span>
                </h2>
              </div>
            </Reveal>

            {/* ------------------------------------------------------------- */}
            {/* Right-side identity rail                                      */}
            {/* ------------------------------------------------------------- */}

            <motion.div
              style={{
                y: animationsEnabled ? railY : 0,
              }}
              className="relative self-end lg:col-span-3 lg:col-start-10 lg:pt-20"
            >
              <Reveal enabled={animationsEnabled} delay={0.12}>
                <div className="border-l border-[#161F9C]/25 pl-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#161F9C]/50">
                    Identity
                  </p>

                  <p className={`${DISPLAY} mt-5 text-4xl leading-none tracking-[-0.04em] sm:text-5xl`}>
                    {view.name}
                  </p>

                  {view.location && (
                    <p className="mt-5 max-w-[22ch] text-sm leading-6 text-[#161F9C]/65">
                      {view.location}
                    </p>
                  )}
                </div>
              </Reveal>
            </motion.div>
          </div>

      
          <div className="relative mt-20 sm:mt-28 lg:mt-32">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* ------------------------------------------------------------- */}
              {/* Editorial portrait                                            */}
              {/* ------------------------------------------------------------- */}

              <motion.div
                style={{
                  y: animationsEnabled ? portraitY : 0,
                }}
                className="relative z-10 lg:col-span-5 lg:col-start-2"
              >
                <Reveal enabled={animationsEnabled} delay={0.08}>
                  <div className="relative">
                    {/* yellow registration mark */}
                    <div
                      aria-hidden="true"
                      className="absolute -left-4 -top-4 z-20 h-8 w-8 border-l border-t border-[#2230D2]/45"
                    />

                    {/* actual image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#2230D2]">
                      {view.avatarUrl ? (
                        <img
                          src={view.avatarUrl}
                          alt={view.name}
                          className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                        />
                      ) : (
                        <div className="flex h-full w-full items-end p-7 sm:p-10">
                          <span
                            className={`${DISPLAY} text-[clamp(5rem,12vw,11rem)] leading-[0.78] tracking-[-0.06em] text-[#F6F2E7]`}
                          >
                            {getInitials(view.name)}
                          </span>
                        </div>
                      )}

                      {/* Image color wash */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#161F9C]/55 via-transparent to-transparent"
                      />

                      {/* corner number */}
                      <div className="absolute right-5 top-5 text-[10px] uppercase tracking-[0.2em] text-[#F6F2E7]/70">
                        02 / 01
                      </div>
                    </div>

                    {/* Offset blue line */}
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-5 left-[12%] right-[-22%] h-px bg-[#2230D2]/30"
                    />
                  </div>
                </Reveal>
              </motion.div>

              {/* ------------------------------------------------------------- */}
              {/* Statement                                                     */}
              {/* ------------------------------------------------------------- */}

              <div className="relative z-20 mt-14 lg:col-span-6 lg:col-start-7 lg:mt-[22%]">
                <Reveal enabled={animationsEnabled} delay={0.16}>
                  {view.headline && (
                    <div>
                      <div className="mb-6 flex items-center gap-3">
                        <span className="h-px w-10 bg-[#2230D2]" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/50">
                          Current focus
                        </span>
                      </div>

                      <p
                        className={`${DISPLAY} max-w-[13ch] text-[clamp(3rem,6vw,6.8rem)] font-normal leading-[0.9] tracking-[-0.045em] text-[#161F9C]`}
                      >
                        <WordReveal
                          text={view.headline}
                          enabled={animationsEnabled}
                        />
                      </p>
                    </div>
                  )}
                </Reveal>
              </div>
            </div>
          </div>

      

          {view.about && (
            <div className="relative mt-28 sm:mt-36 lg:mt-44">
              <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10">
                <Reveal
                  enabled={animationsEnabled}
                  className="lg:col-span-3"
                >
                  <div className="sticky top-20">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#161F9C]/50">
                      The story
                    </p>

                    <div className="mt-5 flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#F4E9A9]" />

                      <p className="max-w-[20ch] text-sm leading-6 text-[#161F9C]/60">
                        A closer look at the person behind the work.
                      </p>
                    </div>
                  </div>
                </Reveal>

                <div className="lg:col-span-8 lg:col-start-5">
                  <div className="max-w-[900px]">
                    {aboutBlocks.map((block, index) => (
                      <Reveal
                        key={`${block.slice(0, 20)}-${index}`}
                        enabled={animationsEnabled}
                        delay={Math.min(index * 0.08, 0.28)}
                        className={index > 0 ? "mt-8" : ""}
                      >
                        <p
                          className={
                            index === 0
                              ? `${DISPLAY} text-[clamp(2.1rem,4vw,4.8rem)] leading-[0.97] tracking-[-0.04em] text-[#2230D2]`
                              : "max-w-[62ch] text-[15px] leading-[1.9] text-[#161F9C]/72 sm:text-[17px]"
                          }
                        >
                          {block}
                        </p>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        
          {(view.projectsCount > 0 ||
            view.experienceCount > 0 ||
            view.location ||
            view.phone) && (
            <Reveal
              enabled={animationsEnabled}
              delay={0.12}
              className="mt-28 sm:mt-36 lg:mt-44"
            >
              <div className="border-y border-[#161F9C]/20">
                <div className="grid grid-cols-2 lg:grid-cols-12">
                  {/* --------------------------------------------------------- */}
                  {/* Projects                                                   */}
                  {/* --------------------------------------------------------- */}

                  {view.projectsCount > 0 && (
                    <div className="border-b border-r border-[#161F9C]/15 px-5 py-7 sm:px-7 lg:col-span-3 lg:border-b-0 lg:py-8">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                        Projects
                      </p>

                      <p
                        className={`${DISPLAY} mt-4 text-5xl leading-none tracking-[-0.05em] sm:text-6xl`}
                      >
                        {formatCount(view.projectsCount)}
                      </p>
                    </div>
                  )}

                  {/* --------------------------------------------------------- */}
                  {/* Experience                                                 */}
                  {/* --------------------------------------------------------- */}

                  {view.experienceCount > 0 && (
                    <div className="border-b border-[#161F9C]/15 px-5 py-7 sm:px-7 lg:col-span-3 lg:border-b-0 lg:border-r lg:py-8">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                        Experience
                      </p>

                      <p
                        className={`${DISPLAY} mt-4 text-5xl leading-none tracking-[-0.05em] sm:text-6xl`}
                      >
                        {formatCount(view.experienceCount)}
                      </p>
                    </div>
                  )}

                  {/* --------------------------------------------------------- */}
                  {/* Location                                                   */}
                  {/* --------------------------------------------------------- */}

                  {view.location && (
                    <div className="border-r border-[#161F9C]/15 px-5 py-7 sm:px-7 lg:col-span-3 lg:py-8">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                        Based in
                      </p>

                      <p className="mt-4 max-w-[20ch] text-sm leading-6 text-[#161F9C] sm:text-[15px]">
                        {view.location}
                      </p>
                    </div>
                  )}

                  {/* --------------------------------------------------------- */}
                  {/* Contact                                                    */}
                  {/* --------------------------------------------------------- */}

                  {view.phone && (
                    <div className="px-5 py-7 sm:px-7 lg:col-span-3 lg:py-8">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                        Direct
                      </p>

                      <a
                        href={`tel:${view.phone.replace(/[^\d+]/g, "")}`}
                        className="mt-4 inline-block break-all text-sm leading-6 text-[#161F9C] underline decoration-[#161F9C]/25 underline-offset-4 transition-colors duration-300 hover:decoration-[#2230D2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2230D2]"
                      >
                        {view.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          )}


          <div className="relative mt-24 overflow-hidden sm:mt-32 lg:mt-40">
            <div className="flex items-end justify-between gap-8 border-b border-[#161F9C]/20 pb-6">
              <Reveal enabled={animationsEnabled}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                  End of introduction
                </p>
              </Reveal>

              <Reveal
                enabled={animationsEnabled}
                delay={0.08}
              >
                <span
                  aria-hidden="true"
                  className="inline-block h-3 w-3 rounded-full bg-[#F4E9A9]"
                />
              </Reveal>
            </div>

            <Reveal
              enabled={animationsEnabled}
              delay={0.12}
            >
              <p
                className={`${DISPLAY} mt-8 max-w-[11ch] text-[clamp(3.3rem,7vw,8rem)] leading-[0.86] tracking-[-0.055em] text-[#161F9C]`}
              >
                The work
                <br />
                says the rest.
              </p>
            </Reveal>
          </div>
        </div>
      </div>



      <div className="relative bg-[#2230D2] text-[#F6F2E7]">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-14">
          <span className="text-[9px] uppercase tracking-[0.22em] text-[#F6F2E7]/65">
            02 — About
          </span>

          <span className="hidden text-[9px] uppercase tracking-[0.22em] text-[#F6F2E7]/55 sm:inline">
            Orixa Design Engine
          </span>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-[#F4E9A9]/70"
        />
      </div>
    </section>
  );
}