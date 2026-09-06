// src/portfolio-renderer/sections/experience/ExperienceRail.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { cardClass } from "../../theme";
import type { RendererExperience } from "../../types";

export type ExperienceRailProps = {
  experience: RendererExperience[];
};

function formatDateRange(
  startDate?: string,
  endDate?: string,
  current?: boolean
): string | null {
  const end = current ? "Present" : endDate;
  if (startDate && end) return `${startDate} – ${end}`;
  if (startDate) return startDate;
  if (end) return end;
  return null;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const ExperienceRail: React.FC<ExperienceRailProps> = ({
  experience,
}) => {
  if (!experience || experience.length === 0) return null;

  return (
    <section
      aria-label="Experience"
      className="w-full py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 sm:mb-16"
        >
          <p
            className="mb-3 text-xs font-medium uppercase tracking-[0.2em]"
            style={{ color: "var(--pr-accent)" }}
          >
            Career
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            style={{ letterSpacing: "var(--pr-heading-tracking)" }}
          >
            Experience
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical rail */}
          <div
            className="absolute left-[11px] top-2 bottom-2 w-px sm:left-[15px]"
            style={{ backgroundColor: "var(--pr-accent-soft)" }}
            aria-hidden="true"
          />

          <motion.ul
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="relative flex flex-col gap-10 sm:gap-12"
          >
            {experience.map((job, index) => {
              const dateRange = formatDateRange(
                job.startDate,
                job.endDate,
                job.current
              );
              const key = job.id ?? `${job.company}-${job.role}-${index}`;

              return (
                <motion.li
                  key={key}
                  variants={item}
                  className="group relative flex gap-5 sm:gap-8"
                >
                  {/* Node */}
                  <div className="relative z-10 mt-1.5 flex shrink-0">
                    <span
                      className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 bg-background sm:h-[30px] sm:w-[30px]"
                      style={{ borderColor: "var(--pr-accent)" }}
                    >
                      <span
                        className="h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-125 sm:h-2.5 sm:w-2.5"
                        style={{ backgroundColor: "var(--pr-accent)" }}
                      />
                    </span>
                  </div>

                  {/* Content card */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.25 }}
                    className={`${cardClass} flex-1 p-5 sm:p-6`}
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-foreground sm:text-lg">
                          {job.role}
                        </h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {job.company}
                          {job.location ? (
                            <span className="text-muted-foreground/70">
                              {" "}
                              · {job.location}
                            </span>
                          ) : null}
                        </p>
                      </div>
                      {dateRange ? (
                        <span
                          className="mt-1 shrink-0 text-xs font-medium tracking-wide sm:mt-0 sm:text-sm"
                          style={{ color: "var(--pr-accent)" }}
                        >
                          {dateRange}
                        </span>
                      ) : null}
                    </div>

                    {job.description ? (
                      <p
                        className="mt-3 text-sm text-muted-foreground/90"
                        style={{ lineHeight: "var(--pr-body-leading)" }}
                      >
                        {job.description}
                      </p>
                    ) : null}
                  </motion.div>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
};