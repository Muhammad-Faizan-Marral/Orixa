"use client";

import React, { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

const ORANGE = "#ff5a00";
const INK = "#111111";
const PAPER = "#f4f1eb";
const MUTED = "#6d6963";
const BORDER = "rgba(17, 17, 17, 0.14)";

const INITIAL_VISIBLE = 12;

const ease = [0.22, 1, 0.36, 1] as const;

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease,
    },
  },
};

function getShortLabel(name: string) {
  const value = name.trim();

  if (value.length <= 24) {
    return value;
  }

  const words = value.split(/\s+/);

  if (words.length > 1) {
    return words.slice(0, 3).join(" ");
  }

  return value.slice(0, 24);
}

function SkillIndex({ index, active }: { index: number; active: boolean }) {
  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
      <span
        className="text-[9px] font-semibold tabular-nums tracking-[0.08em] transition-colors duration-300"
        style={{
          color: active ? ORANGE : MUTED,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border transition-all duration-500"
        style={{
          borderColor: active ? ORANGE : BORDER,
          transform: active ? "scale(1)" : "scale(0.82)",
          opacity: active ? 1 : 0.65,
        }}
      />
    </div>
  );
}

function SkillRow({
  skill,
  index,
  reduceMotion,
}: {
  skill: {
    id?: string | null;
    name: string;
    level?: string | null;
  };
  index: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
      transition={{
        duration: 0.5,
        delay: reduceMotion ? 0 : Math.min(index * 0.025, 0.2),
        ease,
      }}
      className="group relative"
    >
      <div
        className="
          relative
          flex
          items-center
          gap-4
          py-5
          sm:gap-5
        "
        style={{
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <SkillIndex index={index} active={false} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-5">
            <h3
              className="
                min-w-0
                truncate
                text-[clamp(1.1rem,2vw,1.45rem)]
                font-medium
                leading-tight
                tracking-[-0.035em]
                transition-transform
                duration-500
                ease-out
                group-hover:translate-x-1
              "
              style={{
                color: INK,
              }}
            >
              {getShortLabel(skill.name)}
            </h3>

            {skill.level?.trim() ? (
              <span
                className="
                  hidden
                  shrink-0
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  sm:block
                "
                style={{
                  color: MUTED,
                }}
              >
                {skill.level}
              </span>
            ) : null}
          </div>

          <div
            aria-hidden="true"
            className="
              mt-2
              h-[2px]
              w-0
              transition-all
              duration-500
              ease-out
              group-hover:w-16
            "
            style={{
              background: ORANGE,
            }}
          />
        </div>

        <span
          aria-hidden="true"
          className="
            absolute
            bottom-[-1px]
            left-0
            h-px
            w-0
            transition-all
            duration-500
            group-hover:w-full
          "
          style={{
            background: ORANGE,
          }}
        />
      </div>
    </motion.div>
  );
}

export function SkillsDefault({ config }: ThemeSectionProps) {
  const reduceMotion = useReducedMotion();

  const [expanded, setExpanded] = useState(false);

  const validSkills = useMemo(() => {
    return (config.skills ?? []).filter((skill) => skill.name?.trim());
  }, [config.skills]);

  if (!validSkills.length) {
    return null;
  }

  const hasMore = validSkills.length > INITIAL_VISIBLE;

  const visibleSkills = expanded
    ? validSkills
    : validSkills.slice(0, INITIAL_VISIBLE);

  return (
    <section
      id="skills"
      aria-label="Skills and expertise"
      className="
        relative
        w-full
        overflow-hidden
      "
      style={{
        background: PAPER,
        color: INK,
      }}
    >
      {/* ======================================================================
          AMBIENT ORANGE DETAIL
      ====================================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-48
          top-20
          h-[460px]
          w-[460px]
          rounded-full
          opacity-[0.055]
          blur-3xl
        "
        style={{
          background: ORANGE,
        }}
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[7%]
          top-[22%]
          h-1.5
          w-1.5
          rounded-full
        "
        style={{
          background: ORANGE,
          boxShadow: `0 0 24px ${ORANGE}`,
        }}
      />

      {/* ======================================================================
          CONTAINER
      ====================================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-[1500px]
          px-5
          py-20
          sm:px-8
          sm:py-24
          lg:px-12
          lg:py-32
          xl:px-16
          xl:py-36
        "
      >
        {/* ====================================================================
            HEADER
        ==================================================================== */}

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{
            once: true,
            margin: "-80px",
          }}
          variants={reveal}
          className="
            mb-14
            flex
            items-start
            justify-between
            gap-8
            lg:mb-20
          "
        >
          <div className="flex items-center gap-4">
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.28em]
              "
              style={{
                color: ORANGE,
              }}
            >
              Expertise
            </span>

            <span
              aria-hidden="true"
              className="h-px w-12"
              style={{
                background: ORANGE,
              }}
            />
          </div>

          <span
            className="
              hidden
              text-[10px]
              font-medium
              uppercase
              tracking-[0.25em]
              sm:block
            "
            style={{
              color: MUTED,
            }}
          >
            02 / Skills
          </span>
        </motion.div>

        {/* ====================================================================
            MAIN GRID
        ==================================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-14
            lg:grid-cols-[0.72fr_1.28fr]
            lg:gap-20
            xl:grid-cols-[420px_minmax(0,1fr)]
            xl:gap-28
          "
        >
          {/* ==================================================================
              LEFT EDITORIAL COLUMN
          ================================================================== */}

          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{
              once: true,
              margin: "-80px",
            }}
            variants={reveal}
            className="
              flex
              flex-col
              justify-between
              lg:min-h-[560px]
            "
          >
            <div>
              <h2
                className="
                  max-w-[520px]
                  text-[clamp(3.2rem,6.5vw,7rem)]
                  font-bold
                  leading-[0.84]
                  tracking-[-0.075em]
                "
                style={{
                  fontFamily:
                    "var(--theme-font-display, var(--pr-font-display, sans-serif))",
                }}
              >
                Things
                <br />I{" "}
                <span
                  style={{
                    color: ORANGE,
                  }}
                >
                  know.
                </span>
              </h2>

              <p
                className="
                  mt-8
                  max-w-[370px]
                  text-sm
                  leading-7
                "
                style={{
                  color: MUTED,
                }}
              >
                A focused collection of technologies, tools, and disciplines
                used to turn ideas into useful digital experiences.
              </p>
            </div>

            {/* ================================================================
                SKILL COUNT
            ================================================================ */}

            <div className="mt-14 lg:mt-0">
              <div className="flex items-end gap-5">
                <span
                  className="
                    text-[clamp(4rem,7vw,7rem)]
                    font-medium
                    leading-none
                    tracking-[-0.08em]
                  "
                >
                  {String(validSkills.length).padStart(2, "0")}
                </span>

                <div className="pb-2">
                  <span
                    className="
                      block
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                    "
                    style={{
                      color: MUTED,
                    }}
                  >
                    Skills
                  </span>

                  <span
                    aria-hidden="true"
                    className="mt-3 block h-px w-16"
                    style={{
                      background: ORANGE,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ==================================================================
              RIGHT SKILL LIST
          ================================================================== */}

          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{
              once: true,
              margin: "-80px",
            }}
            className="min-w-0"
          >
            {/* Top rule */}

            <div
              aria-hidden="true"
              className="h-px w-full"
              style={{
                background: BORDER,
              }}
            />

            {/* Skill rows */}

            <motion.div layout>
              <AnimatePresence initial={false}>
                {visibleSkills.map((skill, index) => (
                  <SkillRow
                    key={skill.id ?? `${skill.name}-${index}`}
                    skill={skill}
                    index={index}
                    reduceMotion={Boolean(reduceMotion)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* ==================================================================
                SHOW MORE
            ================================================================== */}

            {hasMore ? (
              <div className="pt-8">
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  aria-expanded={expanded}
                  className="
                    group
                    inline-flex
                    items-center
                    gap-4
                    py-2
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                  "
                  style={{
                    color: INK,
                  }}
                >
                  <span className="relative">
                    {expanded ? "Show less" : `View all ${validSkills.length}`}

                    <span
                      aria-hidden="true"
                      className="
                        absolute
                        -bottom-1
                        left-0
                        h-px
                        w-0
                        transition-all
                        duration-300
                        group-hover:w-full
                      "
                      style={{
                        background: ORANGE,
                      }}
                    />
                  </span>

                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition-all
                      duration-300
                      group-hover:translate-x-1
                    "
                    style={{
                      borderColor: BORDER,
                    }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      aria-hidden="true"
                      className={`
                        transition-transform
                        duration-300
                        ${expanded ? "rotate-180" : ""}
                      `}
                    >
                      <path
                        d="M2.5 4L5.5 7L8.5 4"
                        stroke={INK}
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            ) : null}
          </motion.div>
        </div>

        {/* ====================================================================
            BOTTOM SIGNATURE
        ==================================================================== */}

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{
            once: true,
            margin: "-60px",
          }}
          variants={reveal}
          className="
            mt-20
            flex
            items-center
            gap-5
          "
        >
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, rgba(17,17,17,0.14), transparent)",
            }}
          />

          <span
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.22em]
            "
            style={{
              color: MUTED,
            }}
          >
            Technical toolkit
          </span>

          <div
            className="h-px w-8"
            style={{
              background: ORANGE,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

export default SkillsDefault;
