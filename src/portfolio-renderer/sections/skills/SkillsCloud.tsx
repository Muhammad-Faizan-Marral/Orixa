"use client";

import { motion,Variants } from "framer-motion";
import type { RendererSkill } from "../../types";

type Props = {
  skills: RendererSkill[];
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const item:Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export function SkillsCloud({ skills }: Props) {
  const valid = skills.filter((s) => s.name?.trim());
  if (!valid.length) return null;

  return (
    <div className="w-full">
      <div className="mb-10 space-y-3">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.3em]"
          style={{ color: "var(--pr-accent)" }}
        >
          Capabilities
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
        className="flex flex-wrap gap-3"
      >
        {valid.map((skill, i) => (
          <motion.span
            key={skill.id ?? `${skill.name}-${i}`}
            variants={item}
            whileHover={{
              y: -4,
              scale: 1.04,
              transition: { duration: 0.2 },
            }}
            className="inline-flex items-center gap-2 border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors"
            style={{
              borderRadius: "var(--pr-radius)",
              boxShadow: "var(--pr-card-shadow)",
            }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--pr-accent)" }}
            />
            {skill.name}
            {skill.level && (
              <span className="text-xs font-normal text-muted-foreground">
                {skill.level}
              </span>
            )}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}