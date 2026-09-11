"use client";

import React from "react";
import { motion,Variants } from "framer-motion";

export type EducationCardsProps = {
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

function formatDateRange(startDate?: string, endDate?: string): string | null {
  if (startDate && endDate) return `${startDate} – ${endDate}`;
  if (startDate) return startDate;
  if (endDate) return endDate;
  return null;
}

// Truncate field label for background wash — first meaningful word(s)
function fieldWash(field?: string, degree?: string): string {
  const source = field ?? degree ?? "";
  // Take up to first two words
  return source.split(/\s+/).slice(0, 2).join(" ");
}

const cardVariants:Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.08,
    },
  }),
};

export const EducationCards: React.FC<EducationCardsProps> = ({
  education,
}) => {
  if (!education || education.length === 0) return null;

  return (
    <section
      aria-label="Education"
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
    >
      {/* Section heading */}
      <motion.div
        className="mb-10 flex items-end justify-between gap-4"
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
        <div
          className="h-px flex-1 max-w-[120px] bg-border"
          aria-hidden="true"
        />
      </motion.div>

      {/* Card grid — two columns on md+, single on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {education.map((school, i) => {
          const dateRange = formatDateRange(school.startDate, school.endDate);
          const wash = fieldWash(school.field, school.degree);
          const key = school.id ?? `${school.institution}-${i}`;

          // Alternating inset: even cards push right by one column-gap on desktop
          // achieved via md:mt-8 on odd-indexed cards for a stagger feel
          const isOdd = i % 2 !== 0;

          return (
            <motion.article
              key={key}
              className={`relative overflow-hidden border border-border bg-surface flex flex-col gap-4 p-6 sm:p-7${isOdd ? " md:mt-8" : ""}`}
              style={{
                borderRadius: "var(--pr-radius)",
                boxShadow: "var(--pr-card-shadow, none)",
              }}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Background field wash — typographic ghost */}
              {wash && (
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-bold leading-none select-none pointer-events-none"
                  style={{
                    fontSize: "clamp(3.5rem, 10vw, 6rem)",
                    color:
                      "color-mix(in srgb, var(--pr-accent) 7%, transparent)",
                    letterSpacing: "-0.05em",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    maxWidth: "70%",
                    overflow: "hidden",
                    textOverflow: "clip",
                  }}
                  aria-hidden="true"
                >
                  {wash}
                </span>
              )}

              {/* Accent top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: "var(--pr-accent)" }}
                aria-hidden="true"
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col gap-1">
                <h3
                  className="font-semibold text-foreground leading-snug"
                  style={{
                    fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
                    letterSpacing: "var(--pr-heading-tracking, -0.015em)",
                  }}
                >
                  {school.institution}
                </h3>

                {(school.degree || school.field) && (
                  <p
                    className="text-muted-foreground font-medium"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {school.degree}
                    {school.degree && school.field && (
                      <span className="mx-1.5 text-border">·</span>
                    )}
                    {school.field}
                  </p>
                )}
              </div>

              {school.description && (
                <p
                  className="relative z-10 text-muted-foreground whitespace-pre-line"
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: "var(--pr-body-leading, 1.7)",
                    maxWidth: "42ch",
                  }}
                >
                  {school.description}
                </p>
              )}

              {/* Date — bottom right, anchored */}
              {dateRange && (
                <div className="relative z-10 flex justify-end mt-auto pt-2">
                  <span
                    className="text-xs text-muted-foreground tabular-nums"
                    style={{ letterSpacing: "0.04em" }}
                  >
                    {dateRange}
                  </span>
                </div>
              )}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};
