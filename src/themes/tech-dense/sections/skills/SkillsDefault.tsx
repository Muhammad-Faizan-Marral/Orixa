"use client";

import { useMemo, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ==========================================================================
   DATA HELPERS
   Only `name` is required. Optional `category` and `level` are read
   defensively, so the design adapts to whatever the skill objects carry.
   ========================================================================== */

type SkillView = {
  key: string;
  name: string;
  category: string | null;
  /** 0–1, or null when the skill has no usable level */
  level: number | null;
};

function readString(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function readLevel(source: Record<string, unknown>): number | null {
  for (const key of ["level", "proficiency", "score", "percentage"]) {
    const value = source[key];
    const n =
      typeof value === "number"
        ? value
        : typeof value === "string" && value.trim() !== ""
          ? Number(value)
          : NaN;
    if (!Number.isFinite(n) || n <= 0) continue;
    if (n <= 1) return n;
    if (n <= 5) return n / 5;
    if (n <= 10) return n / 10;
    return Math.min(n, 100) / 100;
  }
  return null;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/* ==========================================================================
   SKILL ITEM
   ========================================================================== */

function SkillItem({
  skill,
  index,
  dimmed,
  active,
  reduced,
  onEnter,
  onLeave,
}: {
  skill: SkillView;
  index: number;
  dimmed: boolean;
  active: boolean;
  reduced: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: reduced ? 0 : 18 }}
      whileInView={{ opacity: dimmed ? 0.22 : 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      animate={{ opacity: dimmed ? 0.22 : 1 }}
      transition={{
        opacity: { duration: 0.35 },
        y: { duration: 0.8, ease: EASE, delay: Math.min(index, 12) * 0.03 },
      }}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className="relative cursor-default"
    >
      <span
        className={`block font-[var(--font-bricolage)] text-[clamp(1.6rem,3.1vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.045em] transition-colors duration-300 ${
          active ? "text-white" : "text-white/85"
        }`}
      >
        {skill.name}
      </span>

      {/* Level meter — rendered only when the skill actually has a level */}
      {skill.level !== null && (
        <span
          aria-hidden="true"
          className="mt-2 block h-px w-full bg-white/[0.08]"
        >
          <span
            className={`block h-px origin-left bg-gradient-to-r from-blue-500 to-blue-300 transition-all duration-500 ${
              active
                ? "opacity-100 shadow-[0_0_10px_rgba(59,130,246,0.9)]"
                : "opacity-40"
            }`}
            style={{ width: `${Math.round(skill.level * 100)}%` }}
          />
        </span>
      )}
      {skill.level !== null && (
        <span className="sr-only">
          , proficiency {Math.round(skill.level * 100)} percent
        </span>
      )}
    </motion.li>
  );
}

/* ==========================================================================
   SECTION
   ========================================================================== */

export function SkillsDefault({ config }: ThemeSectionProps) {
  const reduced = Boolean(useReducedMotion());
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const validSkills = useMemo(() => {
    return (config.skills ?? []).filter((skill) => skill.name?.trim());
  }, [config.skills]);

  /* Normalise + group by category, preserving first-seen order */
  const groups = useMemo(() => {
    const views: SkillView[] = validSkills.map((skill, i) => {
      const record = skill as unknown as Record<string, unknown>;
      return {
        key: `${skill.name.trim()}-${i}`,
        name: skill.name.trim(),
        category: readString(record, ["category", "group", "type"]),
        level: readLevel(record),
      };
    });

    const map = new Map<string, SkillView[]>();
    for (const view of views) {
      const label = view.category ?? "";
      map.set(label, [...(map.get(label) ?? []), view]);
    }
    return Array.from(map, ([label, items]) => ({ label, items }));
  }, [validSkills]);

  /* Pointer-following light, scoped to this section */
  const px = useSpring(useMotionValue(30), { stiffness: 60, damping: 20 });
  const py = useSpring(useMotionValue(40), { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${px}% ${py}%, rgba(37,99,235,0.14), transparent 62%)`;

  if (!validSkills.length) {
    return null;
  }

  const total = validSkills.length;
  let runningIndex = 0;

  return (
    <section
      id="skills"
      aria-label="Skills"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 100);
        py.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative isolate overflow-hidden bg-[#04060B] text-white"
    >
      {/* ------------------------------ BACKGROUND ------------------------------ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{ background: spotlight }}
        />

        {/* Two thin beams sweeping across on offset clocks */}
        {[0, 1].map((i) => (
          <motion.span
            key={i}
            className="absolute top-0 h-full w-px"
            style={{
              left: `${18 + i * 44}%`,
              background:
                "linear-gradient(to bottom, transparent, rgba(96,165,250,0.35) 40%, rgba(59,130,246,0.15) 70%, transparent)",
              boxShadow: "0 0 32px rgba(59,130,246,0.18)",
            }}
            animate={
              reduced
                ? undefined
                : { x: [0, i === 0 ? 90 : -90, 0], opacity: [0.35, 0.9, 0.35] }
            }
            transition={{
              duration: 16 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Faint dotted field that fades toward the edges */}
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(148,163,184,0.9) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            maskImage:
              "radial-gradient(ellipse at 65% 45%, black 0%, transparent 65%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 65% 45%, black 0%, transparent 65%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />

        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{
            background: "linear-gradient(to top, transparent, #04060B)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background: "linear-gradient(to bottom, transparent, #04060B)",
          }}
        />
      </div>

      {/* -------------------------------- CONTENT -------------------------------- */}
      <div className="relative mx-auto w-full max-w-[1480px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40 xl:px-16">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Heading — stays in view while the index scrolls */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: reduced ? 0 : 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="lg:sticky lg:top-28"
            >
              <h2 className="font-[var(--font-bricolage)] text-[clamp(2.6rem,5vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white">
                Skills
              </h2>

              <p className="mt-6 max-w-[300px] border-l border-blue-400/40 pl-5 font-[var(--font-inter)] text-sm leading-6 text-white/45">
                {total} {total === 1 ? "tool" : "tools"} and technologies
                {groups.length > 1 && groups[0].label
                  ? `, across ${groups.length} areas.`
                  : "."}
              </p>
            </motion.div>
          </div>

          {/* Index */}
          <div className="lg:col-span-8">
            <div className="space-y-14 sm:space-y-16">
              {groups.map((group) => (
                <div
                  key={group.label || "all"}
                  className="grid gap-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-10"
                >
                  {/* Group label only exists when categories do */}
                  {group.label ? (
                    <div className="flex items-center gap-3 sm:block sm:pt-3">
                      <span
                        aria-hidden="true"
                        className="block h-px w-8 bg-blue-400/60 sm:mb-3"
                      />
                      <h3 className="font-[var(--font-inter)] text-sm text-blue-200/70">
                        {group.label}
                      </h3>
                    </div>
                  ) : (
                    <span className="hidden sm:block" aria-hidden="true" />
                  )}

                  <ul
                    className="flex flex-wrap gap-x-9 gap-y-6 sm:gap-x-12 sm:gap-y-8"
                    onPointerLeave={() => setActiveKey(null)}
                  >
                    {group.items.map((skill) => {
                      const index = runningIndex++;
                      return (
                        <SkillItem
                          key={skill.key}
                          skill={skill}
                          index={index}
                          reduced={reduced}
                          active={activeKey === skill.key}
                          dimmed={activeKey !== null && activeKey !== skill.key}
                          onEnter={() => setActiveKey(skill.key)}
                          onLeave={() => setActiveKey(null)}
                        />
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SkillsDefault;
