"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* -------------------------------------------------------------------------- */
/* Typography + Theme                                                        */
/* -------------------------------------------------------------------------- */

const DISPLAY = "font-[family-name:var(--font-display)]";
const TEXT = "font-[family-name:var(--font-text)]";

const EASE = [0.22, 1, 0.36, 1] as const;

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

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  return value as Record<string, unknown>;
}

function getSkillName(value: unknown): string | null {
  return clean(asRecord(value).name);
}

function getSkillMeta(value: unknown): string | null {
  const record = asRecord(value);

  return clean(
    record.category ??
      record.type ??
      record.group ??
      record.domain ??
      record.level,
  );
}

function Reveal({
  children,
  enabled,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
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
        amount: 0.15,
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

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function SkillsDefault({ config }: ThemeSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const animationsEnabled =
    config.animations !== false && !shouldReduceMotion;

  const [activeIndex, setActiveIndex] = useState(0);

  const skills = useMemo(() => {
    return (config.skills ?? [])
      .map((skill) => ({
        name: getSkillName(skill),
        meta: getSkillMeta(skill),
      }))
      .filter(
        (skill): skill is { name: string; meta: string | null } =>
          Boolean(skill.name),
      );
  }, [config.skills]);

  if (!skills.length) {
    return null;
  }

  const activeSkill = skills[activeIndex] ?? skills[0];

  return (
    <section
      id="skills"
      className={`${TEXT} relative isolate overflow-hidden bg-[${CREAM}] text-[${INDIGO}]`}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Architectural background                                           */}
      {/* ------------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Giant ghost word */}
        <div className="absolute -right-[8vw] top-[2%] select-none">
          <span
            className={`${DISPLAY} block text-[clamp(9rem,22vw,23rem)] font-normal leading-[0.72] tracking-[-0.08em] text-[#2230D2]/[0.035]`}
          >
            SKILLS
          </span>
        </div>

        {/* Horizontal architectural rule */}
        <div className="absolute left-0 right-0 top-[31%] h-px bg-[#161F9C]/[0.055]" />

        {/* Center vertical guide */}
        <div className="absolute inset-y-0 left-[calc(50%-0.5px)] hidden w-px bg-[#161F9C]/[0.055] lg:block" />

        {/* Soft atmosphere */}
        <div className="absolute right-[-12vw] bottom-[8%] h-[38vw] w-[38vw] rounded-full bg-[#F4E9A9]/30 blur-3xl" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="mx-auto w-full max-w-[1600px] px-6 pt-8 sm:px-10 sm:pt-10 lg:px-14 lg:pt-12">
        <Reveal enabled={animationsEnabled}>
          <div className="flex items-center justify-between border-t border-[#161F9C]/20 pt-4">
            <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#161F9C]/60">
              <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

              <span>03</span>

              <span className="hidden sm:inline">
                Capabilities
              </span>
            </div>

            <span className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/40">
              Tools behind the work
            </span>
          </div>
        </Reveal>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main                                                                */}
      {/* ------------------------------------------------------------------ */}

      <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 pt-20 sm:px-10 sm:pb-32 sm:pt-28 lg:px-14 lg:pb-40 lg:pt-36">
        {/* ---------------------------------------------------------------- */}
        {/* Intro                                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          <Reveal enabled={animationsEnabled} className="lg:col-span-8">
            <div className="relative">
              {/* Registration mark */}
              <span
                aria-hidden="true"
                className="absolute -left-3 -top-3 h-8 w-8 border-l border-t border-[#2230D2]/40"
              />

              <p className="mb-7 text-[11px] uppercase tracking-[0.2em] text-[#161F9C]/50 sm:mb-10">
                Technical language
              </p>

              <h2
                className={`${DISPLAY} max-w-[1000px] text-[clamp(4rem,9vw,10rem)] font-normal leading-[0.79] tracking-[-0.065em]`}
              >
                Things
                <br />

                <span className="ml-[9vw] italic text-[#2230D2]">
                  I build with.
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
                Philosophy
              </p>

              <p className="mt-5 max-w-[24ch] text-sm leading-7 text-[#161F9C]/65">
                Technology should create possibilities, not become the
                visual focus.
              </p>
            </div>
          </Reveal>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Manifest                                                         */}
        {/* ---------------------------------------------------------------- */}

        <div className="relative mt-24 sm:mt-32 lg:mt-44">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10">
            {/* ------------------------------------------------------------ */}
            {/* Active Skill Stage                                            */}
            {/* ------------------------------------------------------------ */}

            <div className="lg:col-span-6">
              <div className="lg:sticky lg:top-16">
                <Reveal enabled={animationsEnabled}>
                  <div className="relative min-h-[430px] overflow-hidden border-y border-[#161F9C]/20 py-10 sm:min-h-[520px] sm:py-14 lg:min-h-[620px] lg:py-16">
                    {/* Giant number */}
                    <motion.div
                      aria-hidden="true"
                      initial={false}
                      animate={{
                        opacity: animationsEnabled ? 1 : 0.8,
                      }}
                      className="absolute right-0 top-0"
                    >
                      <span
                        className={`${DISPLAY} text-[clamp(10rem,19vw,19rem)] font-normal leading-[0.65] tracking-[-0.09em] text-[#161F9C]/[0.055]`}
                      >
                        {String(activeIndex + 1).padStart(2, "0")}
                      </span>
                    </motion.div>

                    {/* Corner detail */}
                    <div className="absolute left-0 top-0 flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                        Selected capability
                      </span>
                    </div>

                    {/* Active content */}
                    <div className="relative flex min-h-[430px] flex-col justify-between sm:min-h-[490px] lg:min-h-[590px]">
                      <div />

                      <div>
                        <div className="mb-7 flex items-center gap-4">
                          <span className="h-px w-12 bg-[#2230D2]" />

                          <span className="text-[10px] uppercase tracking-[0.18em] text-[#161F9C]/45">
                            {String(activeIndex + 1).padStart(2, "0")} /{" "}
                            {String(skills.length).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="relative min-h-[155px] sm:min-h-[190px]">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeSkill.name}
                              initial={{
                                opacity: 0,
                                y: 34,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              exit={{
                                opacity: 0,
                                y: -25,
                              }}
                              transition={{
                                duration: animationsEnabled ? 0.6 : 0,
                                ease: EASE,
                              }}
                            >
                              <h3
                                className={`${DISPLAY} max-w-[9ch] text-[clamp(4rem,7vw,8rem)] font-normal leading-[0.8] tracking-[-0.065em] text-[#161F9C]`}
                              >
                                {activeSkill.name}
                              </h3>
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        <div className="mt-8 flex items-end justify-between gap-8">
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.18em] text-[#161F9C]/40">
                              Focus
                            </p>

                            <p className="mt-3 max-w-[22ch] text-sm leading-6 text-[#161F9C]/65">
                              {activeSkill.meta ??
                                "Core technology used across selected work."}
                            </p>
                          </div>

                          {/* Arrow mark */}
                          <div className="hidden h-14 w-14 shrink-0 items-center justify-center border border-[#161F9C]/20 sm:flex">
                            <span className="text-xl text-[#2230D2]">
                              ↗
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom architectural line */}
                    <div className="absolute bottom-0 left-[12%] right-[-8%] h-px bg-[#2230D2]/25" />
                  </div>
                </Reveal>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Skill List                                                    */}
            {/* ------------------------------------------------------------ */}

            <div className="mt-16 lg:col-span-6 lg:col-start-7 lg:mt-0">
              <Reveal enabled={animationsEnabled} delay={0.08}>
                <div>
                  {/* list header */}
                  <div className="mb-6 flex items-center justify-between border-b border-[#161F9C]/20 pb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                      Complete index
                    </span>

                    <span className="text-[10px] tabular-nums tracking-[0.16em] text-[#161F9C]/35">
                      {String(skills.length).padStart(2, "0")} entries
                    </span>
                  </div>

                  {/* rows */}
                  <div className="border-b border-[#161F9C]/20">
                    {skills.map((skill, index) => {
                      const active = activeIndex === index;

                      return (
                        <motion.button
                          key={`${skill.name}-${index}`}
                          type="button"
                          onMouseEnter={() => setActiveIndex(index)}
                          onFocus={() => setActiveIndex(index)}
                          onClick={() => setActiveIndex(index)}
                          whileHover={
                            animationsEnabled
                              ? {
                                  x: 10,
                                }
                              : undefined
                          }
                          transition={{
                            duration: 0.45,
                            ease: EASE,
                          }}
                          className={[
                            "group relative block w-full border-t border-[#161F9C]/20 text-left outline-none",
                            "focus-visible:ring-2 focus-visible:ring-[#2230D2]/40 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F6F2E7]",
                          ].join(" ")}
                        >
                          {/* active bar */}
                          <motion.span
                            initial={false}
                            animate={{
                              scaleY: active ? 1 : 0,
                              opacity: active ? 1 : 0,
                            }}
                            transition={{
                              duration: 0.4,
                              ease: EASE,
                            }}
                            className="absolute bottom-0 left-0 top-0 w-[3px] origin-center bg-[#2230D2]"
                          />

                          <div
                            className={[
                              "relative grid grid-cols-[48px_1fr_auto] items-center gap-5 px-4 py-6",
                              "sm:grid-cols-[58px_1fr_auto] sm:px-5 sm:py-7",
                              "transition-[background-color] duration-500",
                              active
                                ? "bg-[#2230D2]/[0.035]"
                                : "bg-transparent",
                            ].join(" ")}
                          >
                            {/* Number */}
                            <span
                              className={[
                                "text-[10px] tabular-nums tracking-[0.18em] transition-colors duration-300",
                                active
                                  ? "text-[#2230D2]"
                                  : "text-[#161F9C]/35",
                              ].join(" ")}
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            {/* Name */}
                            <span
                              className={`${DISPLAY} block text-[clamp(2rem,3.4vw,4.4rem)] font-normal leading-[0.86] tracking-[-0.05em] transition-colors duration-300 ${
                                active
                                  ? "text-[#161F9C]"
                                  : "text-[#161F9C]/70 group-hover:text-[#161F9C]"
                              }`}
                            >
                              {skill.name}
                            </span>

                            {/* Indicator */}
                            <span className="flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10">
                              <motion.span
                                initial={false}
                                animate={{
                                  rotate: active ? 45 : 0,
                                  scale: active ? 1 : 0.7,
                                }}
                                transition={{
                                  duration: 0.4,
                                  ease: EASE,
                                }}
                                className={[
                                  "relative flex h-7 w-7 items-center justify-center rounded-full border",
                                  active
                                    ? "border-[#2230D2]/35"
                                    : "border-[#161F9C]/15",
                                ].join(" ")}
                              >
                                <span
                                  className={[
                                    "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                                    active
                                      ? "bg-[#2230D2]"
                                      : "bg-[#161F9C]/30",
                                  ].join(" ")}
                                />
                              </motion.span>
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Closing Statement                                                 */}
        {/* ---------------------------------------------------------------- */}

        <Reveal
          enabled={animationsEnabled}
          delay={0.12}
          className="mt-28 sm:mt-36 lg:mt-48"
        >
          <div className="relative overflow-hidden border-y border-[#161F9C]/20 py-10 sm:py-14 lg:py-16">
            {/* Ghost number */}
            <span
              aria-hidden="true"
              className={`${DISPLAY} pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 text-[clamp(9rem,20vw,20rem)] leading-none tracking-[-0.08em] text-[#2230D2]/[0.045]`}
            >
              03
            </span>

            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                The rule
              </p>

              <p
                className={`${DISPLAY} mt-7 max-w-[11ch] text-[clamp(3.5rem,7vw,8rem)] leading-[0.84] tracking-[-0.06em]`}
              >
                Skill is
                <br />
                <span className="text-[#2230D2]">
                  only useful
                </span>
                <br />
                when invisible.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Footer strip                                                       */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative bg-[#2230D2] text-[#F6F2E7]">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-14">
          <span className="text-[9px] uppercase tracking-[0.22em] text-[#F6F2E7]/65">
            03 — Skills
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

export default SkillsDefault;