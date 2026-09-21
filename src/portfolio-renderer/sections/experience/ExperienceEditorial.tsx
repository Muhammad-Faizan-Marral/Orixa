"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

const ease = [0.22, 1, 0.36, 1] as const;

export const ExperienceEditorial: React.FC<
  ExperienceEditorialProps
> = ({ experience }) => {
  const valid = experience.filter(
    (job) => job.role?.trim() || job.company?.trim()
  );

  const [activeIndex, setActiveIndex] = useState(0);

  if (!valid.length) return null;

  const safeIndex = Math.min(activeIndex, valid.length - 1);

  return (
    <section
      aria-label="Experience"
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
    >
      {/* Header */}

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
            Experience
          </span>
        </div>

        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <h2
            className="text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.86] tracking-[-0.075em]"
            style={{
              letterSpacing: "var(--pr-heading-tracking)",
            }}
          >
            Work
            <span style={{ color: "var(--pr-accent)" }}>.</span>
          </h2>

          <span
            className="text-xs"
            style={{
              color: "var(--pr-muted, var(--muted-foreground))",
            }}
          >
            {String(valid.length).padStart(2, "0")}{" "}
            {valid.length === 1 ? "role" : "roles"}
          </span>
        </div>
      </motion.header>

      {/* Experience Archive */}

      <div
        className="border-t"
        style={{ borderColor: "var(--pr-border)" }}
      >
        {valid.map((job, index) => {
          const dateRange = formatDateRange(
            job.startDate,
            job.endDate,
            job.current
          );

          const isActive = index === safeIndex;

          return (
            <motion.article
              key={job.id ?? `${job.company}-${job.role}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: Math.min(index * 0.06, 0.3),
                ease,
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              className="group relative border-b"
              style={{ borderColor: "var(--pr-border)" }}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="block w-full text-left"
                aria-expanded={isActive}
              >
                {/* Main row */}

                <div className="relative grid gap-5 py-8 sm:grid-cols-[90px_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8 sm:py-10 lg:grid-cols-[120px_minmax(0,1fr)_180px] lg:gap-12">
                  {/* Index */}

                  <span
                    className="hidden text-[10px] font-medium tabular-nums sm:block"
                    style={{
                      color: isActive
                        ? "var(--pr-accent)"
                        : "var(--pr-muted, var(--muted-foreground))",
                    }}
                  >
                    / {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Role / Company */}

                  <div className="min-w-0">
                    <div className="flex items-start gap-4">
                      <span
                        className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-500 sm:hidden"
                        style={{
                          backgroundColor: isActive
                            ? "var(--pr-accent)"
                            : "var(--pr-border)",
                          transform: isActive
                            ? "scale(1)"
                            : "scale(0.7)",
                        }}
                      />

                      <div className="min-w-0">
                        <h3
                          className="text-[clamp(1.55rem,3.2vw,3.2rem)] font-medium leading-[0.95] tracking-[-0.055em] transition-transform duration-500"
                          style={{
                            transform: isActive
                              ? "translateX(6px)"
                              : "translateX(0)",
                          }}
                        >
                          {job.role || job.company}
                        </h3>

                        {job.role && job.company ? (
                          <p
                            className="mt-3 text-sm font-medium transition-colors duration-300"
                            style={{
                              color: isActive
                                ? "var(--pr-accent)"
                                : "var(--pr-muted, var(--muted-foreground))",
                            }}
                          >
                            {job.company}
                            {job.location ? (
                              <>
                                <span
                                  className="mx-2"
                                  style={{
                                    color: "var(--pr-border)",
                                  }}
                                >
                                  /
                                </span>
                                {job.location}
                              </>
                            ) : null}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Date */}

                  <div className="flex items-center justify-between gap-5 sm:block sm:text-right">
                    {dateRange ? (
                      <time
                        className="text-[10px] font-medium uppercase tracking-[0.16em]"
                        style={{
                          color:
                            "var(--pr-muted, var(--muted-foreground))",
                        }}
                      >
                        {dateRange}
                      </time>
                    ) : null}

                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-500 sm:ml-auto sm:mt-4"
                      style={{
                        borderColor: isActive
                          ? "var(--pr-accent)"
                          : "var(--pr-border)",
                        color: isActive
                          ? "var(--pr-accent)"
                          : "var(--pr-muted, var(--muted-foreground))",
                        transform: isActive
                          ? "rotate(-45deg)"
                          : "rotate(0deg)",
                      }}
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-3.5 w-3.5"
                      >
                        <path
                          d="M5 15L15 5M7 5H15V13"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </button>

              {/* Description Reveal */}

              <AnimatePresence initial={false}>
                {isActive && job.description ? (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      height: {
                        duration: 0.45,
                        ease,
                      },
                      opacity: {
                        duration: 0.25,
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="grid pb-9 sm:grid-cols-[90px_minmax(0,1fr)_180px] sm:gap-8 lg:grid-cols-[120px_minmax(0,1fr)_180px] lg:gap-12">
                      <div />

                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.08,
                          ease,
                        }}
                        className="max-w-2xl text-sm leading-7 sm:text-base"
                        style={{
                          color:
                            "var(--pr-muted, var(--muted-foreground))",
                          lineHeight: "var(--pr-body-leading)",
                        }}
                      >
                        {job.description}
                      </motion.p>

                      <div className="hidden lg:block" />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>

      {/* Footer accent */}

      <motion.div
        initial={{
          scaleX: 0,
          transformOrigin: "left",
        }}
        whileInView={{
          scaleX: 1,
        }}
        viewport={{ once: true }}
        transition={{
          duration: 0.9,
          delay: 0.15,
          ease,
        }}
        className="mt-10 h-px w-full"
        style={{
          background:
            "linear-gradient(to right, var(--pr-accent), var(--pr-border), transparent)",
        }}
      />
    </section>
  );
};

