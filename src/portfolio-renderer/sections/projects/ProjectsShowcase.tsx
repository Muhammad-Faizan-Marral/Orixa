"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { RendererDesignPreferences, RendererProject } from "../../types";

type Props = {
  projects: RendererProject[];
  design?: RendererDesignPreferences;
};

const ease = [0.22, 1, 0.36, 1] as const;

const imageVariants = {
  initial: {
    opacity: 0,
    scale: 1.045,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    transition: {
      duration: 0.35,
      ease,
    },
  },
};

const contentVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.25,
      ease,
    },
  },
};

export function ProjectsShowcase({ projects, design: _design }: Props) {
  const valid = useMemo(
    () => projects.filter((project) => project.title?.trim()),
    [projects],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  if (!valid.length) return null;

  const safeIndex = Math.min(activeIndex, valid.length - 1);
  const activeProject = valid[safeIndex];

  return (
    <section
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
      aria-label="Selected projects"
    >
      {/* ───────────────── Header ───────────────── */}

      <motion.header
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease }}
        className="mb-12 flex flex-col gap-5 sm:mb-16"
      >
        <div className="flex items-center gap-3">
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
            Selected Work
          </span>
        </div>

        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <h2
            className="max-w-[760px] text-[clamp(2.8rem,6vw,6.4rem)] font-semibold leading-[0.9] tracking-[-0.07em]"
            style={{
              letterSpacing: "var(--pr-heading-tracking)",
            }}
          >
            Projects
          </h2>

          <span
            className="pb-1 text-xs"
            style={{
              color: "var(--pr-muted, var(--muted-foreground))",
            }}
          >
            {String(valid.length).padStart(2, "0")}{" "}
            {valid.length === 1 ? "project" : "projects"}
          </span>
        </div>
      </motion.header>

      {/* ───────────────── Main Gallery ───────────────── */}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:gap-16 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        {/* ───────── Visual Stage ───────── */}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{
            duration: 0.7,
            delay: 0.05,
            ease,
          }}
          className="relative"
        >
          <div
            className="relative aspect-[16/10] w-full overflow-hidden"
            style={{
              borderRadius: "var(--pr-radius)",
              background:
                "color-mix(in srgb, var(--pr-accent) 5%, var(--pr-surface))",
            }}
          >
            <AnimatePresence mode="wait">
              {activeProject.imageUrl ? (
                <motion.img
                  key={`image-${activeProject.id ?? activeProject.title}`}
                  src={activeProject.imageUrl}
                  alt={activeProject.title}
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <motion.div
                  key={`placeholder-${activeProject.id ?? activeProject.title}`}
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, color-mix(in srgb, var(--pr-accent) 15%, transparent), transparent 70%)",
                  }}
                >
                  <span
                    className="select-none text-[clamp(7rem,18vw,15rem)] font-semibold leading-none tracking-[-0.1em]"
                    style={{
                      color:
                        "color-mix(in srgb, var(--pr-accent) 25%, transparent)",
                    }}
                  >
                    {activeProject.title.charAt(0)}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subtle image treatment */}

            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.28))",
              }}
            />

            {/* Active project label */}

            <AnimatePresence mode="wait">
              <motion.div
                key={`label-${activeProject.id ?? activeProject.title}`}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7"
              >
                <div className="min-w-0">
                  <p className="mb-1 text-[9px] font-medium uppercase tracking-[0.2em] text-white/60">
                    Selected project
                  </p>

                  <p className="truncate text-lg font-medium tracking-[-0.025em] text-white sm:text-xl">
                    {activeProject.title}
                  </p>
                </div>

                {activeProject.url ? (
                  <a
                    href={activeProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${activeProject.title}`}
                    className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/10 backdrop-blur-md transition-all duration-300 hover:border-white/60 hover:bg-white/10"
                  >
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-4 w-4 text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    >
                      <path
                        d="M5.5 14.5L14.5 5.5M7 5.5h7.5V13"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ───────── Active Project Information ───────── */}

          <AnimatePresence mode="wait">
            <motion.div
              key={`info-${activeProject.id ?? activeProject.title}`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-7 grid gap-7 sm:grid-cols-[1fr_auto] sm:items-start"
            >
              <div className="max-w-2xl">
                {activeProject.description ? (
                  <p
                    className="text-sm leading-7 sm:text-base"
                    style={{
                      color: "var(--pr-muted, var(--muted-foreground))",
                      lineHeight: "var(--pr-body-leading)",
                    }}
                  >
                    {activeProject.description}
                  </p>
                ) : null}
              </div>

              {activeProject.technologies?.length ? (
                <div className="flex max-w-sm flex-wrap justify-start gap-x-4 gap-y-2 sm:justify-end">
                  {activeProject.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="text-[10px] font-medium uppercase tracking-[0.12em]"
                      style={{
                        color: "var(--pr-muted, var(--muted-foreground))",
                      }}
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ───────── Project Index ───────── */}

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{
            duration: 0.65,
            delay: 0.12,
            ease,
          }}
          className="flex flex-col"
        >
          <div
            className="mb-2 h-px w-full"
            style={{ backgroundColor: "var(--pr-border)" }}
          />

          {valid.map((project, index) => {
            const isActive = index === safeIndex;

            return (
              <button
                key={project.id ?? `${project.title}-${index}`}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className="group relative w-full text-left"
                aria-current={isActive ? "true" : undefined}
              >
                <div
                  className="relative flex items-center gap-5 border-b py-6 transition-all duration-300 sm:py-7"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--pr-border) 75%, transparent)",
                  }}
                >
                  {/* Active indicator */}

                  <span
                    className="absolute left-0 top-0 h-px transition-all duration-500"
                    style={{
                      width: isActive ? "100%" : "0%",
                      backgroundColor: "var(--pr-accent)",
                    }}
                  />

                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: isActive
                        ? "var(--pr-accent)"
                        : "var(--pr-border)",
                      transform: isActive ? "scale(1)" : "scale(0.7)",
                    }}
                  />

                  <span
                    className="min-w-0 flex-1 text-[clamp(1.1rem,2vw,1.5rem)] font-medium tracking-[-0.035em] transition-transform duration-300"
                    style={{
                      color: isActive
                        ? "var(--pr-foreground, var(--foreground))"
                        : "var(--pr-muted, var(--muted-foreground))",
                      transform: isActive ? "translateX(4px)" : "translateX(0)",
                    }}
                  >
                    {project.title}
                  </span>

                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4 shrink-0 transition-all duration-300"
                    style={{
                      color: isActive
                        ? "var(--pr-accent)"
                        : "var(--pr-muted, var(--muted-foreground))",
                      opacity: isActive ? 1 : 0.45,
                      transform: isActive
                        ? "translate(2px, -2px)"
                        : "translate(0, 0)",
                    }}
                    aria-hidden="true"
                  >
                    <path
                      d="M5.5 14.5L14.5 5.5M7 5.5h7.5V13"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* ───────── Bottom Accent ───────── */}

      <motion.div
        initial={{ scaleX: 0, transformOrigin: "left" }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease,
        }}
        className="mt-14 h-px w-full"
        style={{
          background:
            "linear-gradient(to right, var(--pr-accent), var(--pr-border), transparent)",
        }}
      />
    </section>
  );
}
