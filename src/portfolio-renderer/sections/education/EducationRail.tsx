"use client";

import React from "react";
import { motion,Variants } from "framer-motion";

export type EducationRailProps = {
  education: Array<{
    id?: string;
    institution: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
};

function getYear(dateStr?: string): string {
  if (!dateStr) return "";
  // Accept "2019", "2019-06", "Jun 2019", "2019–2021" etc — extract first 4-digit year
  const match = dateStr.match(/\d{4}/);
  return match ? match[0] : dateStr;
}

function formatDegreeField(degree?: string, field?: string): string | null {
  if (degree && field) return `${degree}, ${field}`;
  if (degree) return degree;
  if (field) return field;
  return null;
}

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.1,
    },
  }),
};

export const EducationRail: React.FC<EducationRailProps> = ({ education }) => {
  if (!education || education.length === 0) return null;

  return (
    <section
      aria-label="Education"
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
    >
      {/* Section heading */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          className="text-foreground font-semibold"
          style={{
            fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
            letterSpacing: "var(--pr-heading-tracking, -0.025em)",
          }}
        >
          Education
        </h2>
      </motion.div>

      {/* Rail: continuous horizontal rule with nodes */}
      {/* Desktop: horizontal scrollable rail */}
      {/* Mobile: vertical stack */}

      {/* ── Desktop rail ── */}
      <div className="hidden md:block relative">
        {/* Continuous baseline rule */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-border"
          style={{ top: "2.75rem" }}
          initial={{ scaleX: 0, originX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          aria-hidden="true"
        />

        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${education.length}, minmax(180px, 1fr))`,
          }}
        >
          {education.map((school, i) => {
            const startYear = getYear(school.startDate);
            const endYear = getYear(school.endDate);
            const yearLabel =
              startYear && endYear
                ? `${startYear}–${endYear}`
                : startYear || endYear || null;
            const degreeField = formatDegreeField(school.degree, school.field);
            const key = school.id ?? `${school.institution}-${i}`;

            return (
              <motion.article
                key={key}
                className="relative flex flex-col pr-6"
                custom={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                {/* Year above the line */}
                <div className="h-10 flex items-start">
                  {yearLabel && (
                    <span
                      className="font-semibold tabular-nums leading-none text-foreground"
                      style={{
                        fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {yearLabel}
                    </span>
                  )}
                </div>

                {/* Node on the rule */}
                <motion.div
                  className="relative z-10 w-2.5 h-2.5 rounded-full border-2 my-1.5"
                  style={{
                    borderColor: "var(--pr-accent)",
                    background: "var(--background, #fff)",
                  }}
                  whileHover={{ scale: 1.6 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                />

                {/* Content below the line */}
                <div className="mt-4 flex flex-col gap-1.5">
                  <h3
                    className="font-semibold text-foreground leading-snug"
                    style={{ fontSize: "clamp(0.9rem, 1.2vw, 1rem)" }}
                  >
                    {school.institution}
                  </h3>
                  {degreeField && (
                    <p
                      className="text-muted-foreground leading-snug"
                      style={{ fontSize: "0.8125rem" }}
                    >
                      {degreeField}
                    </p>
                  )}
                  {school.description && (
                    <p
                      className="text-muted-foreground mt-1 whitespace-pre-line"
                      style={{
                        fontSize: "0.8125rem",
                        lineHeight: "var(--pr-body-leading, 1.65)",
                        maxWidth: "28ch",
                      }}
                    >
                      {school.description}
                    </p>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* ── Mobile: vertical timeline ── */}
      <div className="md:hidden relative flex flex-col gap-0">
        {/* Continuous vertical rule */}
        <div
          className="absolute left-3 top-0 bottom-0 w-px bg-border"
          aria-hidden="true"
        />

        {education.map((school, i) => {
          const startYear = getYear(school.startDate);
          const endYear = getYear(school.endDate);
          const yearLabel =
            startYear && endYear
              ? `${startYear}–${endYear}`
              : startYear || endYear || null;
          const degreeField = formatDegreeField(school.degree, school.field);
          const key = school.id ?? `${school.institution}-${i}`;

          return (
            <motion.article
              key={key}
              className="relative flex gap-5 pb-8 pl-10"
              custom={i}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {/* Node */}
              <div
                className="absolute left-[7px] top-1 w-2.5 h-2.5 rounded-full border-2 z-10"
                style={{
                  borderColor: "var(--pr-accent)",
                  background: "var(--background, #fff)",
                }}
                aria-hidden="true"
              />

              <div className="flex flex-col gap-1">
                {yearLabel && (
                  <span
                    className="font-semibold tabular-nums text-foreground"
                    style={{ fontSize: "1.05rem", letterSpacing: "-0.02em" }}
                  >
                    {yearLabel}
                  </span>
                )}
                <h3
                  className="font-semibold text-foreground leading-snug"
                  style={{ fontSize: "0.9375rem" }}
                >
                  {school.institution}
                </h3>
                {degreeField && (
                  <p className="text-sm text-muted-foreground">{degreeField}</p>
                )}
                {school.description && (
                  <p
                    className="text-sm text-muted-foreground mt-1 whitespace-pre-line"
                    style={{ lineHeight: "var(--pr-body-leading, 1.65)" }}
                  >
                    {school.description}
                  </p>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};
