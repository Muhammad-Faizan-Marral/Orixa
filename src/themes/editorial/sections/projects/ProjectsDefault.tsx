"use client";

import { useMemo, useState } from "react";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";
import { trackProjectClick } from "@/features/portfolio/components/use-portfolio-events";

/* ========================================================================== */
/* THEME                                                                      */
/* ========================================================================== */

const DISPLAY = "font-[family-name:var(--font-display)]";
const TEXT = "font-[family-name:var(--font-text)]";

const EASE = [0.22, 1, 0.36, 1] as const;

const BLUE = "#2230D2";
const INDIGO = "#161F9C";
const CREAM = "#F6F2E7";
const YELLOW = "#F4E9A9";

/* ========================================================================== */
/* TYPES                                                                      */
/* ========================================================================== */

type ProjectView = {
  key: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  liveUrl: string | null;
  sourceUrl: string | null;
  tags: string[];
  year: string | null;
};

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const result = value.trim();

  return result.length > 0 ? result : null;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  return value as Record<string, unknown>;
}

function safeUrl(value: unknown): string | null {
  const valueString = clean(value);

  if (!valueString) {
    return null;
  }

  try {
    const parsed = new URL(valueString);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => clean(item))
    .filter((item): item is string => Boolean(item))
    .slice(0, 8);
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    const result = clean(value);

    if (result) {
      return result;
    }
  }

  return null;
}

function toView(project: unknown, index: number): ProjectView {
  const record = asRecord(project);

  return {
    key:
      clean(record.id ?? record.slug ?? record._id ?? record.title) ??
      `project-${index}`,

    title:
      clean(record.title) ?? `Project ${String(index + 1).padStart(2, "0")}`,

    description: firstString(
      record.description,
      record.summary,
      record.overview,
    ),

    imageUrl: safeUrl(
      firstString(
        record.imageUrl,
        record.image,
        record.thumbnail,
        record.coverImage,
        record.cover,
      ),
    ),

    liveUrl: safeUrl(
      firstString(record.liveUrl, record.demoUrl, record.url, record.website),
    ),

    sourceUrl: safeUrl(
      firstString(
        record.sourceUrl,
        record.githubUrl,
        record.repositoryUrl,
        record.repoUrl,
      ),
    ),

    tags: stringArray(
      record.tags ?? record.technologies ?? record.techStack ?? record.stack,
    ),

    year: firstString(record.year, record.date, record.completedAt),
  };
}

/* ========================================================================== */
/* REVEAL                                                                     */
/* ========================================================================== */

function Reveal({
  children,
  enabled,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  enabled: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: enabled ? 0 : 1,
        y: enabled ? 30 : 0,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={{
        duration: 0.85,
        delay,
        ease: EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ========================================================================== */
/* IMAGE PLACEHOLDER                                                          */
/* ========================================================================== */

function ProjectVisual({
  project,
  featured,
  active,
  reduceMotion,
}: {
  project: ProjectView;
  featured?: boolean;
  active: boolean;
  reduceMotion: boolean;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useMotionValue(0), {
    stiffness: 180,
    damping: 22,
    mass: 0.6,
  });

  const rotateY = useSpring(useMotionValue(0), {
    stiffness: 180,
    damping: 22,
    mass: 0.6,
  });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;

    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    mouseX.set(x);
    mouseY.set(y);

    const nextRotateX = y * -2.5;
    const nextRotateY = x * 2.5;

    rotateX.set(nextRotateX);
    rotateY.set(nextRotateY);
  };

  const handleLeave = () => {
    if (reduceMotion) return;

    mouseX.set(0);
    mouseY.set(0);

    rotateX.set(0);
    rotateY.set(0);
  };

  const backgroundPosition = useMotionTemplate`
    ${mouseX}% ${mouseY}%
  `;

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: reduceMotion ? 0 : rotateX,
        rotateY: reduceMotion ? 0 : rotateY,
        transformPerspective: 1200,
      }}
      className="absolute inset-0"
    >
      {/* Image */}
      {project.imageUrl ? (
        <motion.img
          src={project.imageUrl}
          alt=""
          draggable={false}
          style={{
            transformOrigin: "center center",
          }}
          animate={{
            scale: active ? 1.045 : 1,
          }}
          transition={{
            duration: 0.8,
            ease: EASE,
          }}
          className={[
            "h-full w-full object-cover",
            "transition-[filter] duration-700",
            active ? "grayscale-0" : "grayscale-[0.35]",
          ].join(" ")}
        />
      ) : (
        <motion.div
          animate={{
            scale: active ? 1.04 : 1,
          }}
          transition={{
            duration: 0.8,
            ease: EASE,
          }}
          className="h-full w-full bg-[#2230D2]"
        >
          <div className="flex h-full items-end p-6 sm:p-8">
            <span
              className={`${DISPLAY} text-[clamp(6rem,13vw,12rem)] leading-[0.72] tracking-[-0.07em] text-[#F6F2E7]/90`}
            >
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>
        </motion.div>
      )}

      {/* Color atmosphere */}
      <motion.div
        aria-hidden="true"
        animate={{
          opacity: active ? 0.12 : 0.24,
        }}
        transition={{
          duration: 0.5,
        }}
        className="absolute inset-0 bg-[#161F9C] mix-blend-multiply"
      />

      {/* Interactive gradient */}
      <motion.div
        aria-hidden="true"
        style={{
          backgroundPosition,
        }}
        animate={{
          opacity: active ? 0.65 : 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,233,169,0.18),transparent_42%)] bg-[length:160%_160%] transition-opacity duration-500"
      />

      {/* Bottom darkness */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#161F9C]/70 via-[#161F9C]/20 to-transparent"
      />

      {/* Large project number */}
      <div className="absolute right-5 top-5 sm:right-7 sm:top-7">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#F6F2E7]/70">
          {featured ? "01" : "Project"}
        </span>
      </div>

      {/* Corner markers */}
      <span
        aria-hidden="true"
        className="absolute left-4 top-4 h-6 w-6 border-l border-t border-[#F6F2E7]/45 sm:left-6 sm:top-6"
      />

      <span
        aria-hidden="true"
        className="absolute bottom-4 right-4 h-6 w-6 border-b border-r border-[#F6F2E7]/45 sm:bottom-6 sm:right-6"
      />
    </motion.div>
  );
}

/* ========================================================================== */
/* PROJECT CARD                                                               */
/* ========================================================================== */

function ProjectCard({
  project,
  index,
  featured,
  animationsEnabled,
  onOpen,
}: {
  project: ProjectView;
  index: number;
  featured?: boolean;
  animationsEnabled: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.article
      layout
      onClick={onOpen}
      whileHover={
        animationsEnabled
          ? {
              y: -6,
            }
          : undefined
      }
      transition={{
        duration: 0.45,
        ease: EASE,
      }}
      className={[
        "group relative cursor-pointer",
        featured ? "lg:row-span-2" : "",
      ].join(" ")}
    >
      <div
        className={[
          "relative overflow-hidden border border-[#161F9C]/15 bg-[#2230D2]",
          featured ? "aspect-[0.86] lg:h-full" : "aspect-[1.18]",
        ].join(" ")}
      >
        <ProjectVisual
          project={project}
          featured={featured}
          active={false}
          reduceMotion={!animationsEnabled}
        />

        {/* Interactive overlay */}
        <div
          className={[
            "absolute inset-0",
            "bg-[#161F9C]/0 transition-colors duration-500",
            "group-hover:bg-[#161F9C]/[0.08]",
          ].join(" ")}
        />

        {/* Project content */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7">
          <div className="flex items-end justify-between gap-6">
            <div className="min-w-0">
              {project.year && (
                <p className="mb-3 text-[9px] uppercase tracking-[0.2em] text-[#F6F2E7]/60">
                  {project.year}
                </p>
              )}

              <h3
                className={`${DISPLAY} max-w-[10ch] text-[clamp(2.5rem,5vw,5.5rem)] font-normal leading-[0.82] tracking-[-0.055em] text-[#F6F2E7]`}
              >
                {project.title}
              </h3>
            </div>

            {/* Explore circle */}
            <motion.div
              whileHover={
                animationsEnabled
                  ? {
                      rotate: 45,
                      scale: 1.08,
                    }
                  : undefined
              }
              transition={{
                duration: 0.45,
                ease: EASE,
              }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#F6F2E7]/40 bg-[#F6F2E7]/5 backdrop-blur-sm sm:h-14 sm:w-14"
            >
              <span className="text-lg text-[#F6F2E7]">↗</span>
            </motion.div>
          </div>

          {project.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5">
              {project.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[8px] uppercase tracking-[0.17em] text-[#F6F2E7]/55"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* External project line */}
      <div className="flex items-center justify-between border-b border-[#161F9C]/15 py-3">
        <span className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/40">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/40 transition-colors duration-300 group-hover:text-[#2230D2]">
          View project
        </span>
      </div>
    </motion.article>
  );
}

/* ========================================================================== */
/* DETAIL PANEL                                                               */
/* ========================================================================== */

function ProjectDetail({
  project,
  index,
  animationsEnabled,
  onClose,
}: {
  project: ProjectView;
  index: number;
  animationsEnabled: boolean;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-y-auto"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 0.3,
      }}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close project"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-[#161F9C]/70 backdrop-blur-md"
      />

      {/* Panel */}
      <div className="relative min-h-full px-4 py-4 sm:px-8 sm:py-8 lg:px-14 lg:py-14">
        <motion.div
          initial={{
            y: animationsEnabled ? 50 : 0,
            opacity: animationsEnabled ? 0 : 1,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.65,
            ease: EASE,
          }}
          className="relative mx-auto max-w-[1450px] overflow-hidden bg-[#F6F2E7]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#161F9C]/15 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

              <span className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                Project {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/50"
            >
              Close
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#161F9C]/20 transition-transform duration-300 group-hover:rotate-45">
                ×
              </span>
            </button>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#2230D2] lg:col-span-7 lg:aspect-auto lg:min-h-[650px]">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[400px] items-end p-8">
                  <span
                    className={`${DISPLAY} text-[clamp(8rem,18vw,16rem)] leading-[0.7] tracking-[-0.08em] text-[#F6F2E7]`}
                  >
                    {project.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#161F9C]/35 to-transparent" />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-5 lg:p-14">
              <div>
                {project.year && (
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/40">
                    {project.year}
                  </p>
                )}

                <h2
                  className={`${DISPLAY} mt-7 max-w-[8ch] text-[clamp(4rem,7vw,7rem)] leading-[0.78] tracking-[-0.06em] text-[#161F9C]`}
                >
                  {project.title}
                </h2>

                {project.description && (
                  <p className="mt-10 max-w-[48ch] text-[15px] leading-[1.8] text-[#161F9C]/65">
                    {project.description}
                  </p>
                )}

                {project.tags.length > 0 && (
                  <div className="mt-10 border-t border-[#161F9C]/15 pt-5">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/40">
                      Built with
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`${DISPLAY} text-xl tracking-[-0.025em] text-[#2230D2]`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="mt-14 border-t border-[#161F9C]/15 pt-6">
                <div className="flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      className="inline-flex items-center gap-4 bg-[#2230D2] px-5 py-4 text-[9px] uppercase tracking-[0.18em] text-[#F6F2E7] transition-transform duration-300 hover:-translate-y-1"
                    >
                      Live project
                      <span className="text-sm">↗</span>
                    </a>
                  )}

                  {project.sourceUrl && (
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                      className="inline-flex items-center gap-4 border border-[#161F9C]/20 px-5 py-4 text-[9px] uppercase tracking-[0.18em] text-[#161F9C] transition-all duration-300 hover:border-[#2230D2] hover:text-[#2230D2]"
                    >
                      Source
                      <span className="text-sm">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ========================================================================== */
/* SECTION                                                                    */
/* ========================================================================== */

export function ProjectsDefault({ config }: ThemeSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const animationsEnabled = config.animations !== false && !shouldReduceMotion;

  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const projects = config.projects ?? [];

  const views = useMemo(
    () =>
      projects
        .filter((project) => project.title?.trim())
        .map((project, index) => toView(project, index)),
    [projects],
  );

  if (!views.length) {
    return null;
  }

  /*
   * This is intentionally extracted from config so every project
   * interaction can be tied to the current portfolio.
   */
  const portfolioId = config?.portfolioId;

  const openProject = (index: number) => {
    const project = views[index];

    if (!project) {
      return;
    }

    if (portfolioId) {
      trackProjectClick(portfolioId, project.title);
    }

    setSelectedProject(index);
  };

  const selected = selectedProject !== null ? views[selectedProject] : null;

  return (
    <>
      <section
        id="projects"
        className={`${TEXT} relative isolate overflow-hidden bg-[#F6F2E7] text-[#161F9C]`}
      >
        {/* ================================================================ */}
        {/* BACKGROUND                                                        */}
        {/* ================================================================ */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute left-[-12vw] top-[20%] h-[40vw] w-[40vw] rounded-full bg-[#2230D2]/[0.035] blur-3xl" />

          <div className="absolute right-[-10vw] bottom-[15%] h-[34vw] w-[34vw] rounded-full bg-[#F4E9A9]/35 blur-3xl" />

          <div className="absolute inset-y-0 left-[calc(50%-0.5px)] hidden w-px bg-[#161F9C]/[0.055] lg:block" />
        </div>

        {/* ================================================================ */}
        {/* INDEX BAR                                                         */}
        {/* ================================================================ */}

        <div className="mx-auto w-full max-w-[1600px] px-6 pt-8 sm:px-10 sm:pt-10 lg:px-14 lg:pt-12">
          <Reveal enabled={animationsEnabled}>
            <div className="flex items-center justify-between border-t border-[#161F9C]/20 pt-4">
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#161F9C]/60">
                <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

                <span>04</span>

                <span className="hidden sm:inline">Selected work</span>
              </div>

              <span className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/40">
                Project archive
              </span>
            </div>
          </Reveal>
        </div>

        {/* ================================================================ */}
        {/* CONTENT                                                           */}
        {/* ================================================================ */}

        <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 pt-20 sm:px-10 sm:pb-32 sm:pt-28 lg:px-14 lg:pb-40 lg:pt-36">
          {/* Intro */}
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
            <Reveal enabled={animationsEnabled} className="lg:col-span-8">
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-3 -top-3 h-8 w-8 border-l border-t border-[#2230D2]/40"
                />

                <p className="mb-7 text-[11px] uppercase tracking-[0.2em] text-[#161F9C]/50 sm:mb-10">
                  Work that made it out
                </p>

                <h2
                  className={`${DISPLAY} text-[clamp(4rem,9vw,10rem)] font-normal leading-[0.8] tracking-[-0.065em]`}
                >
                  Selected
                  <br />
                  <span className="ml-[8vw] italic text-[#2230D2]">work.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal
              enabled={animationsEnabled}
              delay={0.12}
              className="self-end lg:col-span-3 lg:col-start-10"
            >
              <div className="border-l border-[#161F9C]/25 pl-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                  Archive
                </p>

                <p className="mt-5 text-sm leading-7 text-[#161F9C]/65">
                  A collection of interfaces, products and experiments built
                  with curiosity and intent.
                </p>
              </div>
            </Reveal>
          </div>

          {/* ============================================================ */}
          {/* PROJECT GRID                                                    */}
          {/* ============================================================ */}

          <div className="mt-24 sm:mt-32 lg:mt-44">
            <div className="grid grid-cols-1 gap-x-7 gap-y-16 lg:grid-cols-12 lg:auto-rows-[minmax(320px,auto)]">
              {/* Featured project */}
              {views[0] && (
                <Reveal enabled={animationsEnabled} className="lg:col-span-7">
                  <ProjectCard
                    project={views[0]}
                    index={0}
                    featured
                    animationsEnabled={animationsEnabled}
                    onOpen={() => openProject(0)}
                  />
                </Reveal>
              )}

              {/* Project 2 */}
              {views[1] && (
                <Reveal
                  enabled={animationsEnabled}
                  delay={0.08}
                  className="lg:col-span-5 lg:pt-24"
                >
                  <ProjectCard
                    project={views[1]}
                    index={1}
                    animationsEnabled={animationsEnabled}
                    onOpen={() => openProject(1)}
                  />
                </Reveal>
              )}

              {/* Project 3 */}
              {views[2] && (
                <Reveal
                  enabled={animationsEnabled}
                  delay={0.12}
                  className="lg:col-span-5 lg:col-start-2 lg:-mt-12"
                >
                  <ProjectCard
                    project={views[2]}
                    index={2}
                    animationsEnabled={animationsEnabled}
                    onOpen={() => openProject(2)}
                  />
                </Reveal>
              )}

              {/* Project 4 */}
              {views[3] && (
                <Reveal
                  enabled={animationsEnabled}
                  delay={0.16}
                  className="lg:col-span-6 lg:col-start-7 lg:pt-20"
                >
                  <ProjectCard
                    project={views[3]}
                    index={3}
                    animationsEnabled={animationsEnabled}
                    onOpen={() => openProject(3)}
                  />
                </Reveal>
              )}

              {/* Remaining projects */}
              {views.slice(4).map((project, offset) => {
                const index = offset + 4;

                return (
                  <Reveal
                    key={project.key}
                    enabled={animationsEnabled}
                    delay={Math.min(0.08 + offset * 0.04, 0.25)}
                    className="lg:col-span-5"
                  >
                    <ProjectCard
                      project={project}
                      index={index}
                      animationsEnabled={animationsEnabled}
                      onOpen={() => openProject(index)}
                    />
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* ============================================================ */}
          {/* STATEMENT                                                       */}
          {/* ============================================================ */}

          <Reveal
            enabled={animationsEnabled}
            delay={0.1}
            className="mt-32 sm:mt-40 lg:mt-52"
          >
            <div className="relative overflow-hidden border-y border-[#161F9C]/20 py-10 sm:py-14 lg:py-16">
              <span
                aria-hidden="true"
                className={`${DISPLAY} pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 text-[clamp(10rem,23vw,23rem)] leading-none tracking-[-0.08em] text-[#2230D2]/[0.04]`}
              >
                WORK
              </span>

              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                  More than screenshots
                </p>

                <p
                  className={`${DISPLAY} mt-7 max-w-[10ch] text-[clamp(3.5rem,7vw,8rem)] leading-[0.84] tracking-[-0.06em]`}
                >
                  Good work
                  <br />
                  leaves a
                  <br />
                  <span className="text-[#2230D2]">trace.</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ================================================================ */}
        {/* FOOTER STRIP                                                      */}
        {/* ================================================================ */}

        <div className="relative bg-[#2230D2] text-[#F6F2E7]">
          <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-14">
            <span className="text-[9px] uppercase tracking-[0.22em] text-[#F6F2E7]/65">
              04 — Projects
            </span>

            <span className="hidden text-[9px] uppercase tracking-[0.22em] text-[#F6F2E7]/55 sm:inline">
              Orixa Design Engine
            </span>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px bg-[#F4E9A9]/70"
          />
        </div>
      </section>

      {/* ================================================================ */}
      {/* PROJECT DETAIL MODAL                                               */}
      {/* ================================================================ */}

      <AnimatePresence>
        {selected && selectedProject !== null && (
          <ProjectDetail
            project={selected}
            index={selectedProject}
            animationsEnabled={animationsEnabled}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default ProjectsDefault;
