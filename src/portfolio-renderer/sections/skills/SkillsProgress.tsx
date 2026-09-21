"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { RendererSkill } from "../../types";

type Props = {
  skills: RendererSkill[];
};

const INITIAL_VISIBLE = 12;

const ease = [0.22, 1, 0.36, 1] as const;

function getShortLabel(name: string) {
  const value = name.trim();

  if (value.length <= 18) return value;

  const words = value.split(" ");

  if (words.length > 1) {
    return words.slice(0, 2).join(" ");
  }

  return value;
}

function SkillMark({ index }: { index: number }) {
  return (
    <span
      className="
        relative
        flex
        h-8
        w-8
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-full
      "
      style={{
        background:
          "color-mix(in srgb, var(--pr-accent) 8%, transparent)",
        color: "var(--pr-accent)",
      }}
      aria-hidden="true"
    >
      <span className="text-[9px] font-medium tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>

      <span
        className="
          absolute
          inset-0
          rounded-full
          border
          opacity-60
        "
        style={{
          borderColor:
            "color-mix(in srgb, var(--pr-accent) 20%, transparent)",
        }}
      />
    </span>
  );
}

function SkillWord({
  skill,
  index,
}: {
  skill: RendererSkill;
  index: number;
}) {
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -8,
      }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.025, 0.25),
        ease,
      }}
      className="group relative"
    >
      <div
        className="
          flex
          items-center
          gap-4
          border-b
          py-5
          transition-all
          duration-300
        "
        style={{
          borderColor:
            "color-mix(in srgb, var(--pr-border) 65%, transparent)",
        }}
      >
        <SkillMark index={index} />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-4">
            <h3
              className="
                truncate
                text-[clamp(1.05rem,1.7vw,1.35rem)]
                font-medium
                tracking-[-0.035em]
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              {getShortLabel(skill.name)}
            </h3>

            {skill.level ? (
              <span
                className="
                  hidden
                  shrink-0
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  sm:block
                "
                style={{
                  color:
                    "var(--pr-muted, var(--muted-foreground))",
                }}
              >
                {skill.level}
              </span>
            ) : null}
          </div>

          {/* Minimal accent indicator */}
          <div
            className="
              mt-2
              h-px
              w-0
              transition-all
              duration-500
              group-hover:w-12
            "
            style={{
              background: "var(--pr-accent)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function SkillsProgress({ skills }: Props) {
  const [expanded, setExpanded] = useState(false);

  const valid = useMemo(
    () =>
      skills.filter(
        (skill) => skill.name?.trim()
      ),
    [skills]
  );

  if (!valid.length) return null;

  const hasMore = valid.length > INITIAL_VISIBLE;

  const visibleSkills = expanded
    ? valid
    : valid.slice(0, INITIAL_VISIBLE);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
       
      }}
      aria-label="Skills and expertise"
    >
      {/* =====================================================
          MAIN LAYOUT
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-14
          lg:grid-cols-[0.8fr_1.2fr]
          lg:gap-20
          xl:grid-cols-[0.72fr_1.28fr]
          xl:gap-28
        "
      >
        {/* ===================================================
            EDITORIAL SIDE
        ==================================================== */}

        <div
          className="
            flex
            flex-col
            justify-between
            lg:min-h-[520px]
          "
        >
          <div>
            {/* Section label */}
            <div className="mb-7 flex items-center gap-3">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background:
                    "var(--pr-accent)",
                }}
              />

              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.24em]
                "
                style={{
                  color:
                    "var(--pr-muted, var(--muted-foreground))",
                }}
              >
                Expertise
              </span>
            </div>

            {/* Large title */}
            <h2
              className="
                max-w-[520px]
                text-[clamp(3rem,6vw,6rem)]
                font-semibold
                leading-[0.88]
                tracking-[-0.065em]
              "
            >
              Things
              <br />
              I{" "}
              <span
                className="relative inline-block"
                style={{
                  color: "var(--pr-accent)",
                }}
              >
                know.
              </span>
            </h2>

            {/* Description */}
            <p
              className="
                mt-8
                max-w-[360px]
                text-sm
                leading-7
              "
              style={{
                color:
                  "var(--pr-muted, var(--muted-foreground))",
              }}
            >
              A selection of technologies and tools I use to
              turn ideas into thoughtful digital products.
            </p>
          </div>

          {/* Editorial metadata */}
          <div className="mt-12 lg:mt-0">
            <div className="flex items-end gap-4">
              <span
                className="
                  text-[clamp(3rem,5vw,5rem)]
                  font-medium
                  leading-none
                  tracking-[-0.07em]
                "
              >
                {String(valid.length).padStart(2, "0")}
              </span>

              <div className="pb-1">
                <div
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                  "
                  style={{
                    color:
                      "var(--pr-muted, var(--muted-foreground))",
                  }}
                >
                  Technologies
                </div>

                <div
                  className="mt-2 h-px w-16"
                  style={{
                    background:
                      "var(--pr-accent)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            SKILL FIELD
        ==================================================== */}

        <div>
          {/* Top rule */}
          <div
            className="mb-1 h-px w-full"
            style={{
              background:
                "var(--pr-border)",
            }}
          />

          {/* Skills */}
          <motion.div layout>
            <AnimatePresence initial={false}>
              {visibleSkills.map((skill, index) => (
                <SkillWord
                  key={
                    skill.id ??
                    `${skill.name}-${index}`
                  }
                  skill={skill}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* =================================================
              CONTROL
          ================================================== */}

          {hasMore ? (
            <div className="pt-7">
              <button
                type="button"
                onClick={() =>
                  setExpanded((value) => !value)
                }
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
                  color:
                    "var(--pr-foreground, var(--foreground))",
                }}
                aria-expanded={expanded}
              >
                <span
                  className="
                    relative
                    after:absolute
                    after:-bottom-1
                    after:left-0
                    after:h-px
                    after:w-0
                    after:transition-all
                    after:duration-300
                    group-hover:after:w-full
                  "
                  style={{
                    ["--tw-after-bg" as string]:
                      "var(--pr-accent)",
                  }}
                >
                  {expanded
                    ? "Show less"
                    : `View all ${valid.length}`}
                </span>

                <span
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    border
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                  style={{
                    borderColor:
                      "var(--pr-border)",
                  }}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    className={`
                      transition-transform
                      duration-300
                      ${
                        expanded
                          ? "rotate-180"
                          : ""
                      }
                    `}
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 4L5.5 7L8.5 4"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* =====================================================
          BOTTOM SIGNATURE
      ====================================================== */}

      <div
        className="
          mt-16
          flex
          items-center
          gap-5
        "
      >
        <div
          className="h-px flex-1"
          style={{
            background:
              "linear-gradient(to right, var(--pr-border), transparent)",
          }}
        />

        <span
          className="
            text-[9px]
            font-medium
            uppercase
            tracking-[0.22em]
          "
          style={{
            color:
              "var(--pr-muted, var(--muted-foreground))",
          }}
        >
          Technical toolkit
        </span>

        <div
          className="h-px w-8"
          style={{
            background:
              "var(--pr-accent)",
          }}
        />
      </div>
    </section>
  );
}

export default SkillsProgress;

