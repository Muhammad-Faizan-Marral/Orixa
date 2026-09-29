"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ==========================================================================
   ORIXA — SKILL INDEX
   Card-catalogue drawer of tools and disciplines.
   ========================================================================== */

const PAPER = "#efe2c8";
const PAPER_DEEP = "#e5d3b0";
const PAPER_DARK = "#dfcaa2";
const KRAFT = "#c9a877";
const SEPIA = "#6d4d31";
const DUST = "#9a8060";
const INK = "#1b130c";
const BLOOD = "#a3271d";
const GLOW = "#fff6e0";
const VIGNETTE = "#785430";
const SHADOW = "#573a1e";

const RULE = "rgba(109,77,49,.32)";
const HAIRLINE = "rgba(109,77,49,.22)";

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";
const SERIF_FONT =
  "var(--font-instrument), 'Iowan Old Style', 'Palatino Linotype', Georgia, serif";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .15  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function asText(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return null;
}

function getSkillName(skill: unknown): string | null {
  if (typeof skill === "string") return asText(skill);
  if (skill && typeof skill === "object") {
    const record = skill as Record<string, unknown>;
    return (
      asText(record.name) ??
      asText(record.title) ??
      asText(record.label) ??
      asText(record.skill)
    );
  }
  return null;
}

function getSkillMeta(skill: unknown): string | null {
  if (skill && typeof skill === "object") {
    const record = skill as Record<string, unknown>;
    return (
      asText(record.category) ??
      asText(record.group) ??
      asText(record.type) ??
      asText(record.level) ??
      asText(record.proficiency) ??
      asText(record.years)
    );
  }
  return null;
}

const pad = (n: number) => String(n).padStart(2, "0");

function Label({
  children,
  color = DUST,
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <span
      className="text-[11px] font-medium uppercase tracking-[0.2em]"
      style={{ fontFamily: TEXT_FONT, color }}
    >
      {children}
    </span>
  );
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export function SkillsDefault({ config }: ThemeSectionProps) {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<string>("All");

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

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(skills.map((s) => s.meta).filter((m): m is string => Boolean(m))),
    );
    /* filters only make sense for a small, meaningful set of groups */
    return unique.length >= 2 && unique.length <= 8 ? unique : [];
  }, [skills]);

  const visible = useMemo(() => {
    const active = categories.includes(filter) ? filter : "All";
    const list = skills.map((skill, index) => ({ ...skill, index }));
    return active === "All" ? list : list.filter((s) => s.meta === active);
  }, [skills, categories, filter]);

  if (!skills.length) {
    return null;
  }

  const rise = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.85, ease: EASE, delay },
        };

  const activeFilter = categories.includes(filter) ? filter : "All";

  return (
    <section
      id="skills"
      aria-label="Skills"
      className="relative overflow-hidden px-5 py-24 sm:px-8 md:py-32 lg:px-12"
      style={{ background: PAPER, color: INK }}
    >
      {/* ------------------------- paper atmosphere ------------------------ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 70% 20%, ${GLOW}b3, transparent 70%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, ${VIGNETTE}38 100%)`,
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

      <div className="relative mx-auto max-w-[1200px]">
        {/* ------------------------------ masthead ------------------------------ */}
        <motion.div {...rise(0)} className="flex items-center gap-4">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: BLOOD }}
          />
          <Label color={SEPIA}>Skill index</Label>
          <span
            aria-hidden
            className="h-px flex-1"
            style={{ background: RULE }}
          />
          <Label>{pad(skills.length)} entries</Label>
        </motion.div>

        {/* ------------------------------ heading ------------------------------ */}
        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)] lg:items-end lg:gap-16">
          <motion.h2
            {...rise(0.05)}
            className="font-semibold"
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: "clamp(2.6rem, 6.6vw, 6.2rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.06em",
              textWrap: "balance",
            }}
          >
            Tools of the trade
          </motion.h2>

          <motion.p
            {...rise(0.12)}
            className="max-w-[34ch] text-[1.25rem] leading-[1.3] sm:text-[1.5rem]"
            style={{
              fontFamily: SERIF_FONT,
              fontStyle: "italic",
              color: SEPIA,
              textWrap: "balance",
            }}
          >
            Each one filed, worn in, and used on real work.
          </motion.p>
        </div>

        {/* ------------------------------- filters ------------------------------- */}
        {categories.length > 0 && (
          <motion.div
            {...rise(0.18)}
            role="group"
            aria-label="Filter skills by category"
            className="mt-12 flex flex-wrap gap-2"
          >
            {["All", ...categories].map((category) => {
              const isActive = activeFilter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  aria-pressed={isActive}
                  className="rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    fontFamily: TEXT_FONT,
                    background: isActive ? INK : "transparent",
                    color: isActive ? PAPER : SEPIA,
                    boxShadow: isActive ? "none" : `inset 0 0 0 1px ${KRAFT}`,
                    outlineColor: BLOOD,
                  }}
                >
                  {category}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* ------------------------------- drawer ------------------------------- */}
        <motion.ul
          {...rise(0.22)}
          layout={!reduceMotion}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((skill, position) => (
              <motion.li
                key={`${skill.name}-${skill.index}`}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                transition={{
                  duration: 0.45,
                  ease: EASE,
                  delay: reduceMotion ? 0 : Math.min(position, 12) * 0.025,
                }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group relative flex min-h-[132px] flex-col justify-between rounded-[18px] p-4 sm:min-h-[148px] sm:p-5"
                style={{
                  background: `linear-gradient(180deg, ${PAPER_DEEP}, ${PAPER_DARK})`,
                  border: `1px solid ${KRAFT}`,
                  boxShadow: `0 1px 0 ${GLOW}b3 inset, 0 18px 32px -22px ${SHADOW}80`,
                }}
              >
                {/* index number + punched hole */}
                <div className="flex items-start justify-between">
                  <span
                    className="text-[11px] font-medium tracking-[0.2em]"
                    style={{ fontFamily: TEXT_FONT, color: DUST }}
                  >
                    {pad(skill.index + 1)}
                  </span>

                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-full transition-colors duration-300"
                    style={{
                      background: PAPER,
                      boxShadow: `inset 0 1px 2px ${SHADOW}66`,
                    }}
                  />
                </div>

                {/* name */}
                <div>
                  <p
                    className="text-[1.35rem] font-medium leading-[1.05] sm:text-[1.55rem]"
                    style={{
                      fontFamily: DISPLAY_FONT,
                      color: INK,
                      letterSpacing: "-0.045em",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {skill.name}
                  </p>

                  {/* ruled line like an index card */}
                  <span
                    aria-hidden
                    className="mt-3 block h-px w-full"
                    style={{ background: HAIRLINE }}
                  />

                  <div className="mt-2 flex h-4 items-center gap-2">
                    {skill.meta ? (
                      <>
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: BLOOD }}
                        />
                        <span
                          className="truncate text-[12px]"
                          style={{ fontFamily: SERIF_FONT, color: SEPIA }}
                        >
                          {skill.meta}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                {/* hover: red edge */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-5 bottom-0 h-[2px] origin-left scale-x-0 rounded-full transition-transform duration-500 group-hover:scale-x-100"
                  style={{ background: BLOOD }}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* -------------------------------- footer -------------------------------- */}
        <motion.div
          {...rise(0.1)}
          className="mt-16 flex items-center justify-between border-t pt-4 lg:mt-24"
          style={{ borderColor: RULE }}
        >
          <Label>Skill index</Label>
          <Label>
            Showing {pad(visible.length)} of {pad(skills.length)}
          </Label>
        </motion.div>
      </div>
    </section>
  );
}

export default SkillsDefault;