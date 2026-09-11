// src/portfolio-renderer/sections/experience/ExperienceStack.tsx
"use client";

import React from "react";
import { motion,Variants } from "framer-motion";
import { cardClass } from "../../theme";
import type { RendererExperience } from "../../types";

export type ExperienceStackProps = {
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
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const item:Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const ExperienceStack: React.FC<ExperienceStackProps> = ({
  experience,
}) => {
  if (!experience || experience.length === 0) return null;

  return (
    <section
      aria-label="Experience"
      className="w-full py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            style={{ letterSpacing: "var(--pr-heading-tracking)" }}
          >
            Experience
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-14 rounded-full"
            style={{ backgroundColor: "var(--pr-accent)" }}
            aria-hidden="true"
          />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col gap-5 sm:gap-6"
        >
          {experience.map((job, index) => {
            const dateRange = formatDateRange(
              job.startDate,
              job.endDate,
              job.current
            );
            const key = job.id ?? `${job.company}-${job.role}-${index}`;

            return (
              <motion.article
                key={key}
                variants={item}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.25 }}
                className={`${cardClass} group relative overflow-hidden p-6 sm:p-7`}
              >
                {/* Accent bar on hover */}
                <div
                  className="absolute inset-y-0 left-0 w-1 origin-bottom scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
                  style={{ backgroundColor: "var(--pr-accent)" }}
                  aria-hidden="true"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {job.role}
                      </h3>
                      {job.current ? (
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                          style={{
                            backgroundColor: "var(--pr-accent-soft)",
                            color: "var(--pr-accent)",
                          }}
                        >
                          Current
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">
                      {job.company}
                      {job.location ? (
                        <span className="font-normal text-muted-foreground/70">
                          {" "}
                          · {job.location}
                        </span>
                      ) : null}
                    </p>
                  </div>

                  {dateRange ? (
                    <time className="shrink-0 text-xs font-medium tracking-wide text-muted-foreground sm:text-sm">
                      {dateRange}
                    </time>
                  ) : null}
                </div>

                {job.description ? (
                  <p
                    className="mt-4 text-sm text-muted-foreground/90"
                    style={{ lineHeight: "var(--pr-body-leading)" }}
                  >
                    {job.description}
                  </p>
                ) : null}
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};