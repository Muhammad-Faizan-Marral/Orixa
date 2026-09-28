"use client";

import { useMemo, useRef, useState } from "react";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ========================================================================== */
/* THEME                                                                      */
/* ========================================================================== */

const DISPLAY = "font-[family-name:var(--font-display)]";
const TEXT = "font-[family-name:var(--font-text)]";

const EASE = [0.22, 1, 0.36, 1] as const;

const BLUE = "#2230D2";
const INDIGO = "#161F9C";
const CREAM = "#F6F2E7";
const YELLOW = "#F4E9A9";

/* ========================================================================== */
/* TYPES                                                                      */
/* ========================================================================== */

type ExperienceView = {
  key: string;
  role: string;
  company: string;
  description: string | null;
  start: string | null;
  end: string | null;
  location: string | null;
  type: string | null;
};

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const result = value.trim();

  return result.length > 0 ? result : null;
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

    if (result) {
      return result;
    }
  }

  return null;
}

function toView(item: unknown, index: number): ExperienceView {
  const record = asRecord(item);

  return {
    key:
      firstString(record.id, record._id, record.company, record.role) ??
      `experience-${index}`,

    role:
      firstString(
        record.role,
        record.position,
        record.title,
        record.jobTitle,
      ) ?? "Experience",

    company:
      firstString(record.company, record.organization, record.companyName) ??
      "Independent",

    description: firstString(record.description, record.summary, record.about),

    start: firstString(
      record.startDate,
      record.start,
      record.from,
      record.year,
    ),

    end: firstString(record.endDate, record.end, record.to),

    location: firstString(record.location, record.city, record.place),

    type: firstString(record.type, record.employmentType, record.workType),
  };
}

function formatPeriod(start: string | null, end: string | null) {
  if (!start && !end) {
    return null;
  }

  if (start && end) {
    return `${start} — ${end}`;
  }

  if (start) {
    return `${start} — Present`;
  }

  return end;
}

/* ========================================================================== */
/* REVEAL                                                                     */
/* ========================================================================== */

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
        y: enabled ? 28 : 0,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.12,
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

/* ========================================================================== */
/* EXPERIENCE ITEM                                                            */
/* ========================================================================== */

function ExperienceItem({
  item,
  index,
  active,
  onActivate,
  animationsEnabled,
}: {
  item: ExperienceView;
  index: number;
  active: boolean;
  onActivate: () => void;
  animationsEnabled: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const smoothX = useSpring(mouseX, {
    stiffness: 120,
    damping: 22,
    mass: 0.6,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 120,
    damping: 22,
    mass: 0.6,
  });

  const spotlight = useMotionTemplate`
    radial-gradient(
      circle at ${smoothX}% ${smoothY}%,
      rgba(34, 48, 210, ${active ? 0.09 : 0.045}),
      transparent 38%
    )
  `;

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!animationsEnabled) return;

    const element = containerRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;

    const y = ((event.clientY - rect.top) / rect.height) * 100;

    mouseX.set(x);
    mouseY.set(y);
  };

  const period = formatPeriod(item.start, item.end);

  return (
    <motion.article
      ref={containerRef}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onMouseMove={handleMove}
      tabIndex={0}
      layout
      className={[
        "group relative border-t border-[#161F9C]/15 outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#2230D2]/30 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F6F2E7]",
      ].join(" ")}
    >
      {/* Spotlight */}
      <motion.div
        aria-hidden="true"
        style={{
          background: spotlight,
        }}
        className="pointer-events-none absolute inset-0 -z-10"
      />

      {/* Active blue rail */}
      <motion.div
        initial={false}
        animate={{
          scaleY: active ? 1 : 0,
          opacity: active ? 1 : 0,
        }}
        transition={{
          duration: 0.5,
          ease: EASE,
        }}
        className="absolute bottom-0 left-0 top-0 w-[3px] origin-center bg-[#2230D2]"
      />

      <div
        className={[
          "relative grid grid-cols-1 gap-8 py-9 sm:py-11 lg:grid-cols-[110px_1fr_170px] lg:gap-10",
          "transition-[padding] duration-500",
          active ? "lg:px-6" : "lg:px-0",
        ].join(" ")}
      >
        {/* ---------------------------------------------------------------- */}
        {/* INDEX                                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-start justify-between lg:block">
          <span
            className={[
              "text-[10px] tabular-nums tracking-[0.18em] transition-colors duration-300",
              active ? "text-[#2230D2]" : "text-[#161F9C]/35",
            ].join(" ")}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {period && (
            <span className="text-[9px] uppercase tracking-[0.16em] text-[#161F9C]/40 lg:mt-7 lg:block">
              {period}
            </span>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* MAIN CONTENT                                                      */}
        {/* ---------------------------------------------------------------- */}

        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <span
              className={[
                "mt-2 h-2 w-2 shrink-0 rounded-full transition-all duration-400",
                active
                  ? "scale-100 bg-[#F4E9A9]"
                  : "scale-75 bg-[#161F9C]/15 group-hover:bg-[#2230D2]/50",
              ].join(" ")}
            />

            <div className="min-w-0">
              <motion.h3
                animate={{
                  x: active && animationsEnabled ? 7 : 0,
                }}
                transition={{
                  duration: 0.45,
                  ease: EASE,
                }}
                className={`${DISPLAY} text-[clamp(2.5rem,5vw,5.6rem)] font-normal leading-[0.84] tracking-[-0.055em] text-[#161F9C]`}
              >
                {item.role}
              </motion.h3>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span
                  className={`${DISPLAY} text-xl tracking-[-0.025em] text-[#2230D2]`}
                >
                  {item.company}
                </span>

                {item.type && (
                  <>
                    <span className="h-px w-5 bg-[#161F9C]/20" />

                    <span className="text-[9px] uppercase tracking-[0.17em] text-[#161F9C]/40">
                      {item.type}
                    </span>
                  </>
                )}
              </div>

              <AnimatePresence initial={false}>
                {active && item.description && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      y: 10,
                    }}
                    transition={{
                      duration: animationsEnabled ? 0.5 : 0,
                      ease: EASE,
                    }}
                    className="overflow-hidden"
                  >
                    <p className="mt-7 max-w-[58ch] text-[14px] leading-[1.85] text-[#161F9C]/62 sm:text-[15px]">
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* RIGHT META                                                        */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-start justify-between gap-5 lg:block">
          {item.location && (
            <div>
              <p className="text-[8px] uppercase tracking-[0.2em] text-[#161F9C]/35">
                Location
              </p>

              <p className="mt-2 text-[11px] leading-5 text-[#161F9C]/58 lg:max-w-[16ch]">
                {item.location}
              </p>
            </div>
          )}

          <motion.div
            animate={{
              rotate: active ? 45 : 0,
              scale: active ? 1 : 0.8,
            }}
            transition={{
              duration: 0.45,
              ease: EASE,
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#161F9C]/15 text-[#2230D2]"
          >
            <span className="text-base">↗</span>
          </motion.div>
        </div>
      </div>

      {/* Bottom offset line */}
      <motion.div
        initial={false}
        animate={{
          width: active ? "32%" : "0%",
          opacity: active ? 1 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: EASE,
        }}
        className="absolute bottom-0 right-0 h-px bg-[#2230D2]/35"
      />
    </motion.article>
  );
}

/* ========================================================================== */
/* SECTION                                                                    */
/* ========================================================================== */

export function ExperienceDefault({ config }: ThemeSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const animationsEnabled = config.animations !== false && !shouldReduceMotion;

  const [activeIndex, setActiveIndex] = useState(0);

  const valid = useMemo(
    () =>
      (config.experience ?? []).filter(
        (item) =>
          item.role?.trim() || item.company?.trim() || item.description?.trim(),
      ),
    [config.experience],
  );

  const views = useMemo(
    () => valid.map((item, index) => toView(item, index)),
    [valid],
  );

  if (!views.length) {
    return null;
  }

  const activeExperience = views[activeIndex] ?? views[0];

  const totalYears = views.length;

  return (
    <section
      id="experience"
      className={`${TEXT} relative isolate overflow-hidden bg-[#F6F2E7] text-[#161F9C]`}
    >
      {/* ================================================================== */}
      {/* BACKGROUND                                                          */}
      {/* ================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Giant ghost word */}
        <div className="absolute -left-[7vw] top-[4%] select-none">
          <span
            className={`${DISPLAY} block text-[clamp(10rem,22vw,24rem)] font-normal leading-[0.68] tracking-[-0.08em] text-[#2230D2]/[0.035]`}
          >
            WORK
          </span>
        </div>

        {/* Vertical axis */}
        <div className="absolute inset-y-0 left-[calc(50%-0.5px)] hidden w-px bg-[#161F9C]/[0.055] lg:block" />

        {/* Horizontal guide */}
        <div className="absolute left-0 right-0 top-[32%] h-px bg-[#161F9C]/[0.05]" />

        {/* Atmosphere */}
        <div className="absolute right-[-15vw] bottom-[12%] h-[38vw] w-[38vw] rounded-full bg-[#F4E9A9]/35 blur-3xl" />

        <div className="absolute left-[-10vw] top-[38%] h-[30vw] w-[30vw] rounded-full bg-[#2230D2]/[0.025] blur-3xl" />
      </div>

      {/* ================================================================== */}
      {/* HEADER                                                               */}
      {/* ================================================================== */}

      <div className="mx-auto w-full max-w-[1600px] px-6 pt-8 sm:px-10 sm:pt-10 lg:px-14 lg:pt-12">
        <Reveal enabled={animationsEnabled}>
          <div className="flex items-center justify-between border-t border-[#161F9C]/20 pt-4">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#161F9C]/60">
              <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

              <span>05</span>

              <span className="hidden sm:inline">Experience</span>
            </div>

            <span className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/40">
              Career archive
            </span>
          </div>
        </Reveal>
      </div>

      {/* ================================================================== */}
      {/* CONTENT                                                              */}
      {/* ================================================================== */}

      <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 pt-20 sm:px-10 sm:pb-32 sm:pt-28 lg:px-14 lg:pb-40 lg:pt-36">
        {/* ---------------------------------------------------------------- */}
        {/* INTRO                                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          <Reveal enabled={animationsEnabled} className="lg:col-span-8">
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-3 -top-3 h-8 w-8 border-l border-t border-[#2230D2]/40"
              />

              <p className="mb-7 text-[11px] uppercase tracking-[0.2em] text-[#161F9C]/50 sm:mb-10">
                The path so far
              </p>

              <h2
                className={`${DISPLAY} max-w-[980px] text-[clamp(4rem,9vw,10rem)] font-normal leading-[0.8] tracking-[-0.065em]`}
              >
                Built
                <br />
                through
                <br />
                <span className="ml-[8vw] italic text-[#2230D2]">
                  experience.
                </span>
              </h2>
            </div>
          </Reveal>

          {/* Summary */}
          <Reveal
            enabled={animationsEnabled}
            delay={0.12}
            className="self-end lg:col-span-3 lg:col-start-10"
          >
            <div className="border-l border-[#161F9C]/25 pl-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                Overview
              </p>

              <p className="mt-5 text-sm leading-7 text-[#161F9C]/65">
                {String(totalYears).padStart(2, "0")} chapters of work, learning
                and increasingly ambitious problems.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-7 bg-[#2230D2]" />

                <span className="text-[9px] uppercase tracking-[0.18em] text-[#161F9C]/40">
                  Hover to explore
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* EXPERIENCE SPINE                                                  */}
        {/* ---------------------------------------------------------------- */}

        <div className="relative mt-24 sm:mt-32 lg:mt-44">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10">
            {/* ------------------------------------------------------------ */}
            {/* LEFT ACTIVE DISPLAY                                           */}
            {/* ------------------------------------------------------------ */}

            <div className="mb-14 lg:col-span-4 lg:mb-0">
              <div className="lg:sticky lg:top-20">
                <Reveal enabled={animationsEnabled}>
                  <div className="relative overflow-hidden border-y border-[#161F9C]/20 py-10 sm:py-12 lg:min-h-[490px] lg:py-14">
                    {/* Giant number */}
                    <span
                      aria-hidden="true"
                      className={`${DISPLAY} absolute -right-3 top-0 text-[clamp(10rem,20vw,19rem)] leading-[0.65] tracking-[-0.09em] text-[#2230D2]/[0.045]`}
                    >
                      {String(activeIndex + 1).padStart(2, "0")}
                    </span>

                    <div className="relative flex min-h-[390px] flex-col justify-between lg:min-h-[430px]">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

                          <span className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                            Selected chapter
                          </span>
                        </div>
                      </div>

                      <div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeExperience.key}
                            initial={{
                              opacity: 0,
                              y: 30,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: -20,
                            }}
                            transition={{
                              duration: animationsEnabled ? 0.55 : 0,
                              ease: EASE,
                            }}
                          >
                            <p className="text-[9px] uppercase tracking-[0.18em] text-[#161F9C]/40">
                              {formatPeriod(
                                activeExperience.start,
                                activeExperience.end,
                              ) ?? "Career chapter"}
                            </p>

                            <h3
                              className={`${DISPLAY} mt-5 max-w-[8ch] text-[clamp(3rem,5vw,5.7rem)] leading-[0.82] tracking-[-0.06em]`}
                            >
                              {activeExperience.company}
                            </h3>

                            <p className="mt-5 max-w-[28ch] text-sm leading-6 text-[#161F9C]/60">
                              {activeExperience.role}
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <div className="flex items-end justify-between">
                        {activeExperience.location ? (
                          <div>
                            <p className="text-[8px] uppercase tracking-[0.2em] text-[#161F9C]/35">
                              Based
                            </p>

                            <p className="mt-2 text-xs text-[#161F9C]/55">
                              {activeExperience.location}
                            </p>
                          </div>
                        ) : (
                          <span />
                        )}

                        <span className="text-2xl text-[#2230D2]">↗</span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-[14%] right-[-15%] h-px bg-[#2230D2]/30" />
                  </div>
                </Reveal>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* RIGHT EXPERIENCE LIST                                         */}
            {/* ------------------------------------------------------------ */}

            <div className="lg:col-span-8 lg:col-start-5">
              <Reveal enabled={animationsEnabled} delay={0.08}>
                <div className="border-b border-[#161F9C]/20">
                  {views.map((item, index) => (
                    <ExperienceItem
                      key={item.key}
                      item={item}
                      index={index}
                      active={activeIndex === index}
                      onActivate={() => setActiveIndex(index)}
                      animationsEnabled={animationsEnabled}
                    />
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* CLOSING                                                           */}
        {/* ---------------------------------------------------------------- */}

        <Reveal
          enabled={animationsEnabled}
          delay={0.12}
          className="mt-28 sm:mt-36 lg:mt-48"
        >
          <div className="relative overflow-hidden border-y border-[#161F9C]/20 py-11 sm:py-14 lg:py-16">
            <span
              aria-hidden="true"
              className={`${DISPLAY} pointer-events-none absolute -right-3 top-1/2 -translate-y-1/2 text-[clamp(9rem,21vw,22rem)] leading-none tracking-[-0.08em] text-[#2230D2]/[0.04]`}
            >
              05
            </span>

            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                The takeaway
              </p>

              <p
                className={`${DISPLAY} mt-7 max-w-[11ch] text-[clamp(3.5rem,7vw,8rem)] leading-[0.84] tracking-[-0.06em]`}
              >
                Every role
                <br />
                leaves a
                <br />
                <span className="text-[#2230D2]">mark.</span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ================================================================== */}
      {/* FOOTER STRIP                                                        */}
      {/* ================================================================== */}

      <div className="relative bg-[#2230D2] text-[#F6F2E7]">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-14">
          <span className="text-[9px] uppercase tracking-[0.22em] text-[#F6F2E7]/65">
            05 — Experience
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

export default ExperienceDefault;
