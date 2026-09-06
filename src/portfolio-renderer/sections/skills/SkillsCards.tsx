"use client";

import { motion } from "framer-motion";
import type { RendererSkill } from "../../types";
import { cardClass } from "../../theme";

type Props = {
  skills: RendererSkill[];
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

function levelBadge(level?: string) {
  if (!level) return null;
  const l = level.toLowerCase();
  if (["expert", "advanced", "pro", "master"].some((k) => l.includes(k)))
    return "Expert";
  if (["intermediate", "mid"].some((k) => l.includes(k))) return "Intermediate";
  if (["beginner", "basic", "learning"].some((k) => l.includes(k)))
    return "Learning";
  return level;
}

export function SkillsCards({ skills }: Props) {
  const valid = skills.filter((s) => s.name?.trim());
  if (!valid.length) return null;

  const card = cardClass("bordered");

  return (
    <div className="w-full">
      <div className="mb-10 space-y-3">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.3em]"
          style={{ color: "var(--pr-accent)" }}
        >
          Toolkit
        </p>
        <h2
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ letterSpacing: "var(--pr-heading-tracking)" }}
        >
          Skills
        </h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4"
      >
        {valid.map((skill, i) => {
          const badge = levelBadge(skill.level);

          return (
            <motion.div
              key={skill.id ?? `${skill.name}-${i}`}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`group relative flex flex-col items-start gap-3 overflow-hidden p-4 sm:p-5 ${card}`}
              style={{
                borderRadius: "var(--pr-radius)",
                boxShadow: "var(--pr-card-shadow)",
              }}
            >
              {/* Accent corner glow on hover */}
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
                style={{ backgroundColor: "var(--pr-accent)" }}
              />

              <div
                className="flex h-9 w-9 items-center justify-center text-sm font-semibold"
                style={{
                  backgroundColor: "var(--pr-accent-soft)",
                  color: "var(--pr-accent)",
                  borderRadius: "var(--pr-radius)",
                }}
              >
                {skill.name.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium leading-snug">{skill.name}</p>
                {badge && (
                  <p className="text-[11px] text-muted-foreground">{badge}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}