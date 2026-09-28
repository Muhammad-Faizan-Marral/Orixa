
"use client";

import { useMemo, useState } from "react";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
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

type EducationView = {
  key: string;
  degree: string;
  institution: string;
  field: string | null;
  start: string | null;
  end: string | null;
  location: string | null;
  grade: string | null;
  description: string | null;
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

function toView(
  value: unknown,
  index: number,
): EducationView | null {
  const record = asRecord(value);

  const degree = firstString(
    record.degree,
    record.title,
    record.program,
    record.qualification,
    record.name,
  );

  const institution = firstString(
    record.institution,
    record.university,
    record.school,
    record.college,
    record.organization,
  );

  /*
   * Education entries may legitimately have partial data.
   * We only discard completely empty entries.
   */
  if (!degree && !institution) {
    return null;
  }

  return {
    key:
      firstString(
        record.id,
        record._id,
        degree,
        institution,
      ) ?? `education-${index}`,

    degree: degree ?? "Academic chapter",

    institution:
      institution ?? "Institution",

    field: firstString(
      record.field,
      record.fieldOfStudy,
      record.major,
      record.specialization,
    ),

    start: firstString(
      record.startDate,
      record.start,
      record.from,
      record.startYear,
    ),

    end: firstString(
      record.endDate,
      record.end,
      record.to,
      record.endYear,
    ),

    location: firstString(
      record.location,
      record.city,
      record.campus,
    ),

    grade: firstString(
      record.grade,
      record.cgpa,
      record.gpa,
      record.result,
      record.honors,
    ),

    description: firstString(
      record.description,
      record.summary,
      record.details,
      record.about,
    ),
  };
}

function periodLabel(
  start: string | null,
  end: string | null,
) {
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
/* ATLAS MARK                                                                 */
/* ========================================================================== */

function AtlasMark({
  active,
  reduced,
}: {
  active: boolean;
  reduced: boolean;
}) {
  return (
    <motion.div
      animate={
        reduced
          ? undefined
          : {
              rotate: active ? 180 : 0,
              scale: active ? 1 : 0.94,
            }
      }
      transition={{
        duration: 0.8,
        ease: EASE,
      }}
      className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#2230D2]/20 sm:h-24 sm:w-24"
    >
      <motion.div
        animate={
          reduced
            ? undefined
            : {
                rotate: active ? -180 : 0,
              }
        }
        transition={{
          duration: 1,
          ease: EASE,
        }}
        className="absolute inset-2 rounded-full border border-dashed border-[#161F9C]/20"
      />

      <div className="absolute inset-[30%] rounded-full border border-[#161F9C]/15" />

      <span className="absolute top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#F4E9A9]" />

      <span className="absolute bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#2230D2]" />

      <span className="text-[7px] uppercase tracking-[0.14em] text-[#161F9C]/45">
        Learn
      </span>
    </motion.div>
  );
}

/* ========================================================================== */
/* EDUCATION ROW                                                              */
/* ========================================================================== */

function EducationRow({
  item,
  index,
  active,
  onActivate,
  animationsEnabled,
}: {
  item: EducationView;
  index: number;
  active: boolean;
  onActivate: () => void;
  animationsEnabled: boolean;
}) {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const smoothX = useSpring(mouseX, {
    stiffness: 100,
    damping: 22,
    mass: 0.7,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 100,
    damping: 22,
    mass: 0.7,
  });

  const spotlight = useMotionTemplate`
    radial-gradient(
      500px circle at ${smoothX}% ${smoothY}%,
      rgba(34,48,210,${active ? 0.075 : 0.035}),
      transparent 62%
    )
  `;

  const handleMove = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (!animationsEnabled) return;

    const rect =
      event.currentTarget.getBoundingClientRect();

    mouseX.set(
      ((event.clientX - rect.left) / rect.width) * 100,
    );

    mouseY.set(
      ((event.clientY - rect.top) / rect.height) * 100,
    );
  };

  return (
    <motion.button
      type="button"
      layout
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onMouseMove={handleMove}
      className="group relative block w-full border-t border-[#161F9C]/15 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#2230D2]/30 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F6F2E7]"
    >
      {/* Interactive light */}
      <motion.div
        aria-hidden="true"
        style={{
          background: spotlight,
        }}
        className="pointer-events-none absolute inset-0"
      />

      {/* Active rail */}
      <motion.span
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
          "relative grid grid-cols-1 gap-7 py-8 sm:py-10 lg:grid-cols-[80px_1fr_150px] lg:gap-8",
          "transition-[padding] duration-500",
          active ? "lg:px-5" : "lg:px-0",
        ].join(" ")}
      >
        {/* Index */}
        <div className="flex items-center justify-between lg:block">
          <span
            className={[
              "text-[10px] tabular-nums tracking-[0.18em] transition-colors duration-300",
              active
                ? "text-[#2230D2]"
                : "text-[#161F9C]/30",
            ].join(" ")}
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          {periodLabel(item.start, item.end) && (
            <span className="text-[9px] uppercase tracking-[0.15em] text-[#161F9C]/35 lg:mt-7 lg:block">
              {periodLabel(item.start, item.end)}
            </span>
          )}
        </div>

        {/* Main */}
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <span
              className={[
                "mt-2 h-2 w-2 shrink-0 rounded-full transition-all duration-400",
                active
                  ? "scale-100 bg-[#F4E9A9]"
                  : "scale-75 bg-[#161F9C]/12 group-hover:bg-[#2230D2]/50",
              ].join(" ")}
            />

            <div className="min-w-0">
              <motion.h3
                animate={{
                  x:
                    active && animationsEnabled
                      ? 7
                      : 0,
                }}
                transition={{
                  duration: 0.45,
                  ease: EASE,
                }}
                className={`${DISPLAY} max-w-[11ch] text-[clamp(2.4rem,5vw,5.5rem)] font-normal leading-[0.83] tracking-[-0.055em] text-[#161F9C]`}
              >
                {item.degree}
              </motion.h3>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span
                  className={`${DISPLAY} text-xl tracking-[-0.025em] text-[#2230D2]`}
                >
                  {item.institution}
                </span>

                {item.field && (
                  <>
                    <span className="h-px w-5 bg-[#161F9C]/15" />

                    <span className="text-[9px] uppercase tracking-[0.17em] text-[#161F9C]/40">
                      {item.field}
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
                      duration: animationsEnabled
                        ? 0.5
                        : 0,
                      ease: EASE,
                    }}
                    className="overflow-hidden"
                  >
                    <p className="mt-7 max-w-[58ch] text-[14px] leading-[1.85] text-[#161F9C]/60 sm:text-[15px]">
                      {item.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-end justify-between gap-6 lg:block">
          <div className="space-y-5">
            {item.location && (
              <div>
                <p className="text-[8px] uppercase tracking-[0.2em] text-[#161F9C]/30">
                  Location
                </p>

                <p className="mt-2 max-w-[16ch] text-[11px] leading-5 text-[#161F9C]/55">
                  {item.location}
                </p>
              </div>
            )}

            {item.grade && (
              <div>
                <p className="text-[8px] uppercase tracking-[0.2em] text-[#161F9C]/30">
                  Result
                </p>

                <p className="mt-2 text-sm text-[#161F9C]/65">
                  {item.grade}
                </p>
              </div>
            )}
          </div>

          <motion.span
            animate={{
              rotate: active ? 45 : 0,
              scale: active ? 1 : 0.82,
            }}
            transition={{
              duration: 0.4,
              ease: EASE,
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#161F9C]/15 text-[#2230D2] lg:mt-7"
          >
            ↗
          </motion.span>
        </div>
      </div>

      {/* Bottom trace */}
      <motion.div
        initial={false}
        animate={{
          width: active ? "30%" : "0%",
          opacity: active ? 1 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: EASE,
        }}
        className="absolute bottom-0 right-0 h-px bg-[#2230D2]/30"
      />
    </motion.button>
  );
}

/* ========================================================================== */
/* SECTION                                                                    */
/* ========================================================================== */

export function EducationDefault({
  config,
}: ThemeSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const animationsEnabled =
    config.animations !== false &&
    !shouldReduceMotion;

  const [activeIndex, setActiveIndex] = useState(0);

  const valid = useMemo(
    () =>
      (config.education ?? [])
        .map(toView)
        .filter(
          (v): v is EducationView =>
            v !== null,
        ),
    [config.education],
  );

  if (!valid.length) {
    return null;
  }

  const active =
    valid[activeIndex] ?? valid[0];

  const total =
    valid.length;

  return (
    <section
      id="education"
      className={`${TEXT} relative isolate overflow-hidden bg-[#F6F2E7] text-[#161F9C]`}
    >
      {/* ================================================================== */}
      {/* BACKGROUND                                                          */}
      {/* ================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Ghost word */}
        <div className="absolute -right-[7vw] top-[3%] select-none">
          <span
            className={`${DISPLAY} block text-[clamp(10rem,22vw,24rem)] font-normal leading-[0.65] tracking-[-0.09em] text-[#2230D2]/[0.035]`}
          >
            LEARN
          </span>
        </div>

        {/* Structural lines */}
        <div className="absolute inset-y-0 left-[calc(50%-0.5px)] hidden w-px bg-[#161F9C]/[0.05] lg:block" />

        <div className="absolute left-0 right-0 top-[31%] h-px bg-[#161F9C]/[0.05]" />

        {/* Atmosphere */}
        <div className="absolute bottom-[10%] left-[-12vw] h-[38vw] w-[38vw] rounded-full bg-[#2230D2]/[0.025] blur-3xl" />

        <div className="absolute right-[-10vw] bottom-[-5vw] h-[34vw] w-[34vw] rounded-full bg-[#F4E9A9]/35 blur-3xl" />
      </div>

      {/* ================================================================== */}
      {/* HEADER                                                              */}
      {/* ================================================================== */}

      <div className="mx-auto w-full max-w-[1600px] px-6 pt-8 sm:px-10 sm:pt-10 lg:px-14 lg:pt-12">
        <Reveal enabled={animationsEnabled}>
          <div className="flex items-center justify-between border-t border-[#161F9C]/20 pt-4">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#161F9C]/60">
              <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

              <span>06</span>

              <span className="hidden sm:inline">
                Education
              </span>
            </div>

            <span className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/40">
              Academic atlas
            </span>
          </div>
        </Reveal>
      </div>

      {/* ================================================================== */}
      {/* MAIN                                                                */}
      {/* ================================================================== */}

      <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 pt-20 sm:px-10 sm:pb-32 sm:pt-28 lg:px-14 lg:pb-40 lg:pt-36">
        {/* Intro */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          <Reveal
            enabled={animationsEnabled}
            className="lg:col-span-8"
          >
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-3 -top-3 h-8 w-8 border-l border-t border-[#2230D2]/40"
              />

              <p className="mb-7 text-[11px] uppercase tracking-[0.2em] text-[#161F9C]/50 sm:mb-10">
                The academic record
              </p>

              <h2
                className={`${DISPLAY} max-w-[1000px] text-[clamp(4rem,9vw,10rem)] font-normal leading-[0.79] tracking-[-0.065em]`}
              >
                Built by
                <br />
                <span className="ml-[8vw] italic text-[#2230D2]">
                  learning.
                </span>
              </h2>
            </div>
          </Reveal>

          <Reveal
            enabled={animationsEnabled}
            delay={0.12}
            className="self-end lg:col-span-3 lg:col-start-10"
          >
            <div className="border-l border-[#161F9C]/25 pl-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                Atlas note
              </p>

              <p className="mt-5 max-w-[24ch] text-sm leading-7 text-[#161F9C]/65">
                Every institution marks a different coordinate in the
                journey.
              </p>
            </div>
          </Reveal>
        </div>

        {/* ================================================================ */}
        {/* ATLAS                                                              */}
        {/* ================================================================ */}

        <div className="relative mt-24 sm:mt-32 lg:mt-44">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10">
            {/* ---------------------------------------------------------------- */}
            {/* ACTIVE EDUCATION                                                  */}
            {/* ---------------------------------------------------------------- */}

            <div className="mb-14 lg:col-span-4 lg:mb-0">
              <div className="lg:sticky lg:top-20">
                <Reveal enabled={animationsEnabled}>
                  <div className="relative min-h-[420px] overflow-hidden border-y border-[#161F9C]/20 py-10 sm:min-h-[500px] sm:py-12 lg:min-h-[540px]">
                    {/* Giant number */}
                    <span
                      aria-hidden="true"
                      className={`${DISPLAY} absolute -right-4 top-0 text-[clamp(10rem,20vw,19rem)] leading-[0.65] tracking-[-0.09em] text-[#2230D2]/[0.045]`}
                    >
                      {String(
                        activeIndex + 1,
                      ).padStart(2, "0")}
                    </span>

                    <div className="relative flex min-h-[380px] flex-col justify-between sm:min-h-[455px]">
                      {/* Top */}
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                          Current coordinate
                        </span>
                      </div>

                      {/* Active */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={active.key}
                          initial={{
                            opacity: 0,
                            y: 25,
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
                            duration:
                              animationsEnabled
                                ? 0.55
                                : 0,
                            ease: EASE,
                          }}
                        >
                          <p className="text-[9px] uppercase tracking-[0.18em] text-[#161F9C]/40">
                            {periodLabel(
                              active.start,
                              active.end,
                            ) ??
                              "Academic chapter"}
                          </p>

                          <h3
                            className={`${DISPLAY} mt-5 max-w-[8ch] text-[clamp(3rem,5vw,5.8rem)] leading-[0.82] tracking-[-0.06em]`}
                          >
                            {active.institution}
                          </h3>

                          <p className="mt-5 max-w-[25ch] text-sm leading-6 text-[#161F9C]/60">
                            {active.degree}
                            {active.field
                              ? ` — ${active.field}`
                              : ""}
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      {/* Bottom */}
                      <div className="flex items-end justify-between gap-5">
                        <div>
                          <p className="text-[8px] uppercase tracking-[0.2em] text-[#161F9C]/30">
                            Archive
                          </p>

                          <p className={`${DISPLAY} mt-2 text-2xl tracking-[-0.04em]`}>
                            {String(
                              total,
                            ).padStart(2, "0")}{" "}
                            chapter
                            {total === 1
                              ? ""
                              : "s"}
                          </p>
                        </div>

                        <AtlasMark
                          active
                          reduced={!animationsEnabled}
                        />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-[14%] right-[-15%] h-px bg-[#2230D2]/30" />
                  </div>
                </Reveal>
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* EDUCATION INDEX                                                   */}
            {/* ---------------------------------------------------------------- */}

            <div className="lg:col-span-8 lg:col-start-5">
              <Reveal
                enabled={animationsEnabled}
                delay={0.08}
              >
                <div className="border-b border-[#161F9C]/20">
                  {valid.map((item, index) => (
                    <EducationRow
                      key={item.key}
                      item={item}
                      index={index}
                      active={
                        activeIndex === index
                      }
                      onActivate={() =>
                        setActiveIndex(index)
                      }
                      animationsEnabled={
                        animationsEnabled
                      }
                    />
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* CLOSING                                                            */}
        {/* ================================================================ */}

        <Reveal
          enabled={animationsEnabled}
          delay={0.12}
          className="mt-28 sm:mt-36 lg:mt-48"
        >
          <div className="relative overflow-hidden border-y border-[#161F9C]/20 py-11 sm:py-14 lg:py-16">
            <span
              aria-hidden="true"
              className={`${DISPLAY} pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 text-[clamp(9rem,21vw,22rem)] leading-none tracking-[-0.08em] text-[#2230D2]/[0.04]`}
            >
              KNOW
            </span>

            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                What remains
              </p>

              <p
                className={`${DISPLAY} mt-7 max-w-[11ch] text-[clamp(3.5rem,7vw,8rem)] leading-[0.84] tracking-[-0.06em]`}
              >
                Learning
                <br />
                changes
                <br />
                <span className="text-[#2230D2]">
                  the work.
                </span>
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
            06 — Education
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

export default EducationDefault;

