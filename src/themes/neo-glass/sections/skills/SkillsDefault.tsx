"use client";

import { useMemo } from "react";

import { motion, useReducedMotion } from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ============================================================================
   SKILLS (variant 2) — centred heading · two crossing tilted marquee bands
   (orange + black, scrolling in opposite directions) · chip list underneath
   that carries the readable name + level.
   ========================================================================== */

const DEFAULT_ACCENT = "#FF4A17";
const INK = "#1c1c1c";
const MUTED = "#5f5f5f";
const PANEL = "#f1f1f1";

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";

type ConfigSkill = NonNullable<ThemeSectionProps["config"]["skills"]>[number];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function getSkillName(skill: ConfigSkill | string | null | undefined) {
  if (typeof skill === "string") return skill.trim() || null;
  const name = skill?.name;
  return typeof name === "string" && name.trim() ? name.trim() : null;
}

function getSkillMeta(skill: ConfigSkill | string | null | undefined) {
  if (!skill || typeof skill === "string") return null;
  const level = skill.level;
  return typeof level === "string" && level.trim() ? level.trim() : null;
}

/** Repeats the list until it is long enough to fill a wide band. */
function fill(names: string[], min = 8) {
  const out: string[] = [];
  while (out.length < min) out.push(...names);
  return out;
}

function Plus({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mx-6 h-6 w-6 shrink-0"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 4v16M4 12h16" />
    </svg>
  );
}

function Band({
  names,
  direction,
  background,
  color,
  plusColor,
  rotate,
  duration,
  reduce,
}: {
  names: string[];
  direction: 1 | -1;
  background: string;
  color: string;
  plusColor: string;
  rotate: number;
  duration: number;
  reduce: boolean;
}) {
  const row = fill(names);

  return (
    <div
      aria-hidden
      className="absolute left-[-6%] w-[112%] overflow-hidden py-4 sm:py-5"
      style={{
        backgroundColor: background,
        color,
        transform: `rotate(${rotate}deg)`,
        top: rotate < 0 ? "0%" : "18%",
      }}
    >
      <motion.div
        className="flex w-max items-center"
        animate={
          reduce
            ? undefined
            : { x: direction < 0 ? ["0%", "-50%"] : ["-50%", "0%"] }
        }
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {row.map((name, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span
                  className="whitespace-nowrap text-2xl font-semibold sm:text-3xl"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  {name}
                </span>
                <Plus color={plusColor} />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function SkillsDefault({ config }: ThemeSectionProps) {
  const reduce = !!useReducedMotion();

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

  const accent =DEFAULT_ACCENT;

  if (!skills.length) {
    return null;
  }

  const names = skills.map((s) => s.name);
  const reversed = [...names].reverse();

  return (
    <section
      id="skills"
      className="w-full overflow-hidden bg-white py-16 lg:py-24"
      style={{ color: INK, fontFamily: TEXT_FONT }}
    >
      <div className="mx-auto max-w-[1140px] px-5 text-center sm:px-8">
        <h2
          className="font-bold tracking-tight"
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)",
          }}
        >
          My <span style={{ color: accent }}>Skills</span>
        </h2>
        <p className="mx-auto mt-3 max-w-[420px] text-[15px] leading-relaxed" style={{ color: MUTED }}>
          {skills.length} {skills.length === 1 ? "skill" : "skills"} I use in
          my day-to-day work.
        </p>
      </div>

      {/* crossing marquee bands (decorative) */}
      <div className="relative mt-14 h-[210px] sm:h-[230px]">
        <Band
          names={reversed}
          direction={1}
          background={INK}
          color="#fff"
          plusColor={accent}
          rotate={2.5}
          duration={38}
          reduce={reduce}
        />
        <Band
          names={names}
          direction={-1}
          background={accent}
          color="#fff"
          plusColor="#fff"
          rotate={-2.5}
          duration={30}
          reduce={reduce}
        />
      </div>

      {/* readable list */}
      <ul className="mx-auto mt-14 flex max-w-[900px] flex-wrap justify-center gap-3 px-5 sm:px-8">
        {skills.map((skill, i) => (
          <li
            key={`${skill.name}-${i}`}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px]"
            style={{ backgroundColor: PANEL }}
          >
            <span
              aria-hidden
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <span className="font-semibold">{skill.name}</span>
            {skill.meta && (
              <span style={{ color: MUTED }}>· {skill.meta}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SkillsDefault;