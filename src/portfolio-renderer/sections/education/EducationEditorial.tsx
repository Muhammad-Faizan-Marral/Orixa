"use client";

import React from "react";
import { motion,Variants } from "framer-motion";

export type EducationEditorialProps = {
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

const rowVariants:Variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
      delay: 0.05 + i * 0.07,
    },
  }),
};

export const EducationEditorial: React.FC<EducationEditorialProps> = ({
  education,
}) => {
  if (!education || education.length === 0) return null;

  return (
    <section
      aria-label="Education"
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
    >
      {/* Ledger header row */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45 }}
      >
        {/* Top rule — heavy */}
        <div className="border-t-2 border-foreground pt-4 pb-3">
          {/* Column labels row */}
          <div
            className="hidden md:grid text-xs text-muted-foreground font-medium"
            style={{
              gridTemplateColumns: "120px 1fr 1fr auto",
              gap: "0 2rem",
              letterSpacing: "0.06em",
            }}
          >
            <span>Period</span>
            <span>Institution</span>
            <span>Qualification</span>
            <span className="text-right">Notes</span>
          </div>
        </div>

        {/* Thin rule under header */}
        <div className="border-t border-border" aria-hidden="true" />
      </motion.div>

      {/* Section label — left-anchored, positioned against the ledger */}
      <div className="flex items-center justify-between mb-0">
        <h2
          className="sr-only"
        >
          Education
        </h2>
      </div>

      {/* Ledger rows */}
      <div className="flex flex-col">
        {education.map((school, i) => {
          const dateRange = formatDateRange(school.startDate, school.endDate);
          const key = school.id ?? `${school.institution}-${i}`;

          return (
            <motion.article
              key={key}
              className="group relative"
              custom={i}
              variants={rowVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
            >
              {/* Hover fill — full row */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                style={{
                  background:
                    "color-mix(in srgb, var(--pr-accent) 5%, transparent)",
                }}
                aria-hidden="true"
              />

              {/* ── Desktop: strict grid row ── */}
              <div
                className="hidden md:grid items-start py-5 relative z-10"
                style={{
                  gridTemplateColumns: "120px 1fr 1fr auto",
                  gap: "0 2rem",
                }}
              >
                {/* Date column */}
                <div className="flex flex-col gap-0.5">
                  {dateRange ? (
                    <span
                      className="text-muted-foreground tabular-nums leading-snug"
                      style={{ fontSize: "0.8125rem", letterSpacing: "0.02em" }}
                    >
                      {dateRange}
                    </span>
                  ) : (
                    <span className="text-border">—</span>
                  )}
                </div>

                {/* Institution column */}
                <div>
                  <h3
                    className="font-semibold text-foreground leading-snug"
                    style={{
                      fontSize: "clamp(0.9375rem, 1.2vw, 1rem)",
                      letterSpacing: "var(--pr-heading-tracking, -0.015em)",
                    }}
                  >
                    {school.institution}
                  </h3>
                </div>

                {/* Qualification column */}
                <div className="flex flex-col gap-0.5">
                  {school.degree && (
                    <span
                      className="text-foreground"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {school.degree}
                    </span>
                  )}
                  {school.field && (
                    <span
                      className="text-muted-foreground"
                      style={{ fontSize: "0.8125rem" }}
                    >
                      {school.field}
                    </span>
                  )}
                  {!school.degree && !school.field && (
                    <span className="text-border">—</span>
                  )}
                </div>

                {/* Notes column — description, right-aligned, constrained */}
                <div className="text-right" style={{ maxWidth: "22ch" }}>
                  {school.description ? (
                    <p
                      className="text-muted-foreground whitespace-pre-line text-right"
                      style={{
                        fontSize: "0.8125rem",
                        lineHeight: "var(--pr-body-leading, 1.6)",
                      }}
                    >
                      {school.description}
                    </p>
                  ) : (
                    <span className="text-border text-sm">—</span>
                  )}
                </div>
              </div>

              {/* ── Mobile: stacked within hairline rows ── */}
              <div className="md:hidden py-5 flex flex-col gap-2 relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="font-semibold text-foreground leading-snug"
                    style={{ fontSize: "0.9375rem" }}
                  >
                    {school.institution}
                  </h3>
                  {dateRange && (
                    <span
                      className="text-xs text-muted-foreground tabular-nums shrink-0"
                      style={{ letterSpacing: "0.02em" }}
                    >
                      {dateRange}
                    </span>
                  )}
                </div>

                {(school.degree || school.field) && (
                  <p className="text-sm text-muted-foreground">
                    {[school.degree, school.field].filter(Boolean).join(", ")}
                  </p>
                )}

                {school.description && (
                  <p
                    className="text-sm text-muted-foreground whitespace-pre-line mt-0.5"
                    style={{ lineHeight: "var(--pr-body-leading, 1.65)" }}
                  >
                    {school.description}
                  </p>
                )}
              </div>

              {/* Row separator */}
              <div className="border-t border-border" aria-hidden="true" />

              {/* Accent left edge on hover */}
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: "var(--pr-accent)" }}
                aria-hidden="true"
              />
            </motion.article>
          );
        })}

        {/* Bottom rule — heavy */}
        <div className="border-t-2 border-foreground mt-0" aria-hidden="true" />
      </div>

      {/* Footer: entry count */}
      <motion.p
        className="mt-3 text-xs text-muted-foreground"
        style={{ letterSpacing: "0.04em" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: education.length * 0.07 + 0.1 }}
      >
        {education.length} {education.length === 1 ? "institution" : "institutions"}
      </motion.p>
    </section>
  );
};