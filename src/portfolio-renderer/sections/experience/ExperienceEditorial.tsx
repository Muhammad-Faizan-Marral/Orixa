// src/portfolio-renderer/sections/experience/ExperienceEditorial.tsx
"use client";

import React from "react";
import { motion,Variants } from "framer-motion";
import type { RendererExperience } from "../../types";

export type ExperienceEditorialProps = {
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
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const item:Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const ExperienceEditorial: React.FC<ExperienceEditorialProps> = ({
  experience,
}) => {
  if (!experience || experience.length === 0) return null;

  return (
    <section
      aria-label="Experience"
      className="w-full py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 grid gap-6 border-b border-border pb-10 sm:mb-20 sm:grid-cols-[1fr_auto] sm:items-end sm:pb-12"
        >
          <div>
            <p
              className="mb-2 text-xs font-medium uppercase tracking-[0.25em]"
              style={{ color: "var(--pr-accent)" }}
            >
              Path
            </p>
            <h2
              className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl"
              style={{ letterSpacing: "var(--pr-heading-tracking)" }}
            >
              Experience
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground sm:text-right">
            Selected roles and the work that shaped them.
          </p>
        </motion.header>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="flex flex-col"
        >
          {experience.map((job, index) => {
            const dateRange = formatDateRange(
              job.startDate,
              job.endDate,
              job.current
            );
            const key = job.id ?? `${job.company}-${job.role}-${index}`;
            const isLast = index === experience.length - 1;

            return (
              <motion.article
                key={key}
                variants={item}
                className={`group grid gap-6 py-10 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-12 sm:py-14 ${
                  !isLast ? "border-b border-border" : ""
                }`}
              >
                {/* Meta column */}
                <div className="flex flex-col gap-3 sm:sticky sm:top-24 sm:self-start">
                  {dateRange ? (
                    <time
                      className="text-xs font-medium uppercase tracking-[0.18em]"
                      style={{ color: "var(--pr-accent)" }}
                    >
                      {dateRange}
                    </time>
                  ) : null}
                  <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                    {job.role}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {job.company}
                    {job.location ? (
                      <span className="block text-muted-foreground/70 sm:inline sm:before:content-['·_']">
                        {job.location}
                      </span>
                    ) : null}
                  </p>
                </div>

                {/* Description column */}
                <div className="min-w-0">
                  {job.description ? (
                    <motion.p
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.3 }}
                      className="text-base text-muted-foreground/95 sm:text-lg"
                      style={{ lineHeight: "var(--pr-body-leading)" }}
                    >
                      {job.description}
                    </motion.p>
                  ) : (
                    <p className="text-sm italic text-muted-foreground/60">
                      No description provided.
                    </p>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};