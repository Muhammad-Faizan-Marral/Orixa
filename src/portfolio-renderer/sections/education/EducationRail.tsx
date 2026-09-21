"use client";

import React from "react";
import { motion } from "framer-motion";

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

  const match = dateStr.match(/\d{4}/);

  return match ? match[0] : dateStr;
}

function formatDegreeField(
  degree?: string,
  field?: string
): string | null {
  if (degree && field) return `${degree}, ${field}`;
  if (degree) return degree;
  if (field) return field;

  return null;
}

const ease = [0.22, 1, 0.36, 1] as const;

export const EducationRail: React.FC<EducationRailProps> = ({
  education,
}) => {
  const valid = education.filter(
    (item) => item.institution?.trim() || item.degree?.trim()
  );

  if (!valid.length) return null;

  return (
    <section
      aria-label="Education"
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
    >
      {/* ───────────────── Header ───────────────── */}

      <motion.header
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease }}
        className="mb-14 sm:mb-20"
      >
        <div className="mb-6 flex items-center gap-3">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "var(--pr-accent)" }}
          />

          <span
            className="text-[10px] font-semibold uppercase tracking-[0.28em]"
            style={{
              color: "var(--pr-muted, var(--muted-foreground))",
            }}
          >
            Education
          </span>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2
            className="text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.86] tracking-[-0.075em]"
            style={{
              letterSpacing: "var(--pr-heading-tracking)",
            }}
          >
            Academic
            <br />
            <span style={{ color: "var(--pr-accent)" }}>Background.</span>
          </h2>

          <span
            className="pb-1 text-xs"
            style={{
              color: "var(--pr-muted, var(--muted-foreground))",
            }}
          >
            {String(valid.length).padStart(2, "0")}{" "}
            {valid.length === 1 ? "entry" : "entries"}
          </span>
        </div>
      </motion.header>

      {/* ───────────────── Academic Entries ───────────────── */}

      <div>
        {valid.map((school, index) => {
          const startYear = getYear(school.startDate);
          const endYear = getYear(school.endDate);

          const yearLabel =
            startYear && endYear
              ? `${startYear}–${endYear}`
              : startYear || endYear || null;

          const degreeField = formatDegreeField(
            school.degree,
            school.field
          );

          const key =
            school.id ??
            `${school.institution}-${school.degree}-${index}`;

          return (
            <motion.article
              key={key}
              initial={{
                opacity: 0,
                y: 35,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                margin: "-70px",
              }}
              transition={{
                duration: 0.65,
                delay: Math.min(index * 0.08, 0.35),
                ease,
              }}
              className="group relative border-t py-9 sm:py-12 lg:py-14"
              style={{
                borderColor: "var(--pr-border)",
              }}
            >
              <div className="grid gap-8 lg:grid-cols-[minmax(0,0.28fr)_minmax(0,1fr)_minmax(180px,0.32fr)] lg:gap-12 xl:grid-cols-[minmax(0,0.24fr)_minmax(0,1fr)_minmax(220px,0.34fr)]">
                {/* ───────── Index ───────── */}

                <div className="flex items-start justify-between lg:block">
                  <span
                    className="text-[10px] font-medium tabular-nums"
                    style={{
                      color:
                        "var(--pr-muted, var(--muted-foreground))",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {yearLabel ? (
                    <time
                      className="text-[11px] font-semibold uppercase tracking-[0.16em] lg:mt-10 lg:block"
                      style={{
                        color: "var(--pr-accent)",
                      }}
                    >
                      {yearLabel}
                    </time>
                  ) : null}
                </div>

                {/* ───────── Main Academic Identity ───────── */}

                <div className="min-w-0">
                  {degreeField ? (
                    <motion.h3
                      className="max-w-4xl text-[clamp(2rem,4.5vw,4.8rem)] font-medium leading-[0.94] tracking-[-0.06em]"
                      whileHover={{ x: 6 }}
                      transition={{
                        duration: 0.35,
                        ease,
                      }}
                    >
                      {degreeField}
                    </motion.h3>
                  ) : (
                    <motion.h3
                      className="max-w-4xl text-[clamp(2rem,4.5vw,4.8rem)] font-medium leading-[0.94] tracking-[-0.06em]"
                      whileHover={{ x: 6 }}
                      transition={{
                        duration: 0.35,
                        ease,
                      }}
                    >
                      {school.institution}
                    </motion.h3>
                  )}

                  <div className="mt-6 flex items-center gap-3">
                    <span
                      className="h-px w-7 transition-all duration-500 group-hover:w-12"
                      style={{
                        backgroundColor: "var(--pr-accent)",
                      }}
                    />

                    <p
                      className="text-sm font-medium"
                      style={{
                        color:
                          "var(--pr-muted, var(--muted-foreground))",
                      }}
                    >
                      {school.institution}
                    </p>
                  </div>
                </div>

                {/* ───────── Supporting Information ───────── */}

                <div className="flex flex-col justify-between gap-7 lg:min-h-[120px]">
                  {school.description ? (
                    <p
                      className="max-w-sm text-sm leading-7"
                      style={{
                        color:
                          "var(--pr-muted, var(--muted-foreground))",
                        lineHeight: "var(--pr-body-leading)",
                      }}
                    >
                      {school.description}
                    </p>
                  ) : null}

                  {yearLabel ? (
                    <div className="hidden lg:flex lg:items-center lg:justify-end lg:gap-3">
                      <span
                        className="text-[9px] font-semibold uppercase tracking-[0.2em]"
                        style={{
                          color:
                            "var(--pr-muted, var(--muted-foreground))",
                        }}
                      >
                        Period
                      </span>

                      <span
                        className="h-px w-8"
                        style={{
                          backgroundColor: "var(--pr-border)",
                        }}
                      />

                      <span
                        className="text-[11px] font-medium"
                        style={{
                          color:
                            "var(--pr-foreground, var(--foreground))",
                        }}
                      >
                        {yearLabel}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Bottom hover accent */}

              <motion.div
                className="absolute bottom-0 left-0 h-px"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{
                  duration: 0.55,
                  ease,
                }}
                style={{
                  background:
                    "linear-gradient(to right, var(--pr-accent), transparent)",
                }}
                aria-hidden="true"
              />
            </motion.article>
          );
        })}
      </div>

      {/* ───────────────── Closing Accent ───────────────── */}

      <motion.div
        initial={{
          opacity: 0,
          scaleX: 0,
          transformOrigin: "left",
        }}
        whileInView={{
          opacity: 1,
          scaleX: 1,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay: 0.15,
          ease,
        }}
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, var(--pr-accent), var(--pr-border), transparent)",
        }}
      />
    </section>
  );
};

