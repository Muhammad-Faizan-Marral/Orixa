"use client";

import { motion,Variants } from "framer-motion";
import type { RendererSkill } from "../../types";

type Props = {
  skills: RendererSkill[];
};

/** Parse level string into 0–100 number */
function levelToPercent(level?: string): number {
  if (!level) return 70;
  const cleaned = level.trim().toLowerCase();

  if (cleaned.includes("%")) {
    const n = parseInt(cleaned, 10);
    return Number.isFinite(n) ? Math.min(100, Math.max(8, n)) : 70;
  }

  if (["expert", "advanced", "pro", "master"].some((k) => cleaned.includes(k)))
    return 92;
  if (["intermediate", "mid", "comfortable"].some((k) => cleaned.includes(k)))
    return 72;
  if (["beginner", "basic", "learning", "junior"].some((k) => cleaned.includes(k)))
    return 45;

  const n = parseInt(cleaned, 10);
  return Number.isFinite(n) ? Math.min(100, Math.max(8, n)) : 70;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item:Variants = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export function SkillsProgress({ skills }: Props) {
  const valid = skills.filter((s) => s.name?.trim());
  if (!valid.length) return null;

  return (
    <div className="w-full">
      <div className="mb-10 space-y-3">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.3em]"
          style={{ color: "var(--pr-accent)" }}
        >
          Expertise
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
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col gap-6"
      >
        {valid.map((skill, i) => {
          const percent = levelToPercent(skill.level);

          return (
            <motion.div
              key={skill.id ?? `${skill.name}-${i}`}
              variants={item}
              className="space-y-2"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm font-medium">{skill.name}</span>
                <span className="text-xs text-muted-foreground">
                  {skill.level || `${percent}%`}
                </span>
              </div>

              <div
                className="h-2 w-full overflow-hidden bg-surface-2"
                style={{ borderRadius: "var(--pr-radius)" }}
              >
                <motion.div
                  className="h-full"
                  style={{
                    backgroundColor: "var(--pr-accent)",
                    borderRadius: "var(--pr-radius)",
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percent}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.9,
                    delay: 0.1 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}