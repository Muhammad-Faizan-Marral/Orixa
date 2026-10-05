"use client";

import { useMemo, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { ThemeSectionProps } from "../../../types";
import { trackProjectClick } from "@/features/portfolio/components/use-portfolio-events";

/* ============================================================================
   PROJECTS — heading + "See More" · 2-up carousel with round arrows ·
   each card: image, tag pills, title + orange arrow, description.
   "See More" expands to a grid of every project.
   ========================================================================== */

const DEFAULT_ACCENT = "#FF4A17";
const INK = "#1c1c1c";
const MUTED = "#5f5f5f";
const PANEL = "#efefef";

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";

type ConfigProject = NonNullable<ThemeSectionProps["config"]["projects"]>[number];

type ProjectView = {
  key: string;
  title: string;
  description: string | null;
  url: string | null;
  tags: string[];
  imageUrl: string | null;
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function clean(value: string | null | undefined) {
  if (typeof value !== "string") return null;
  const result = value.trim();
  return result.length ? result : null;
}

function cleanUrl(value: string | null | undefined) {
  const result = clean(value);
  if (!result) return null;
  if (/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(result)) return result;
  return `https://${result}`;
}

function toView(project: ConfigProject, index: number): ProjectView {
  const tags = (project.technologies ?? [])
    .map((t) => clean(t))
    .filter((t): t is string => Boolean(t))
    .slice(0, 3);

  return {
    key: project.id ?? `${project.title}-${index}`,
    title: project.title.trim(),
    description: clean(project.description),
    url: cleanUrl(project.url),
    tags,
    imageUrl: clean(project.imageUrl),
  };
}

function ArrowIcon({ className, dir = "right" }: { className?: string; dir?: "left" | "right" | "up-right" }) {
  const d =
    dir === "left"
      ? "M19 12H5m6-6-6 6 6 6"
      : dir === "right"
        ? "M5 12h14m-6-6 6 6-6 6"
        : "M7 17 17 7M8 7h9v9";
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* CARD                                                                       */
/* -------------------------------------------------------------------------- */

function ProjectCard({
  project,
  accent,
  onOpen,
}: {
  project: ProjectView;
  accent: string;
  onOpen: (title: string) => void;
}) {
  const media = (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl"
      style={{ backgroundColor: accent }}
    >
      {project.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.imageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          draggable={false}
        />
      ) : (
        <span
          className="absolute inset-0 flex items-center justify-center px-6 text-center text-3xl font-bold text-white"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {project.title}
        </span>
      )}
    </div>
  );

  const handleClick = () => onOpen(project.title);

  return (
    <article className="group flex h-full flex-col">
      <div className="rounded-[28px] p-3 sm:p-4" style={{ backgroundColor: PANEL }}>
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            aria-label={`Open ${project.title}`}
            className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: accent }}
          >
            {media}
          </a>
        ) : (
          media
        )}
      </div>

      {project.tags.length > 0 && (
        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full px-4 py-1.5 text-[13px] font-medium"
              style={{ backgroundColor: PANEL, color: MUTED }}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-center gap-2.5">
        <h3
          className="text-center text-xl font-semibold sm:text-[22px]"
          style={{ fontFamily: DISPLAY_FONT, color: INK }}
        >
          {project.title}
        </h3>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            aria-label={`Visit ${project.title}`}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: accent, outlineColor: INK }}
          >
            <ArrowIcon dir="up-right" className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {project.description && (
        <p
          className="mx-auto mt-2 line-clamp-3 max-w-[520px] text-center text-[15px] leading-relaxed"
          style={{ color: MUTED }}
        >
          {project.description}
        </p>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* SECTION                                                                    */
/* -------------------------------------------------------------------------- */

export function ProjectsDefault({ config }: ThemeSectionProps) {
  const reduce = useReducedMotion();
  const projects = useMemo(
    () => (Array.isArray(config.projects) ? config.projects : []),
    [config.projects],
  );

  const views = useMemo(
    () =>
      projects
        .filter((project) => project.title?.trim())
        .map((project, index) => toView(project, index)),
    [projects],
  );

  const [start, setStart] = useState(0);
  const [dir, setDir] = useState(1);
  const [expanded, setExpanded] = useState(false);

  if (!views.length) {
    return null;
  }

  const portfolioId = (config as unknown as Record<string, unknown> | undefined)?.portfolioId;
  const accent =  DEFAULT_ACCENT;

  const onOpen = (title: string) => {
    if (typeof portfolioId === "string" && portfolioId) {
      trackProjectClick(portfolioId, title);
    }
  };

  const n = views.length;
  const perView = Math.min(2, n);
  const windowed = Array.from({ length: perView }, (_, i) => views[(start + i) % n]);
  const canSlide = n > 1;
  const arrowsOnDesktop = n > 2;

  const go = (step: 1 | -1) => {
    setDir(step);
    setStart((s) => (s + step + n) % n);
  };

  const arrowBase =
    "absolute top-[28%] z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <section
      id="projects"
      className="w-full bg-white px-5 py-16 sm:px-8 lg:py-24"
      style={{ color: INK, fontFamily: TEXT_FONT }}
    >
      <div className="mx-auto max-w-[1140px]">
        {/* header */}
        <div className="flex items-end justify-between gap-4">
          <h2
            className="font-bold leading-[1.1] tracking-tight"
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)",
            }}
          >
            Let&apos;s Have a Look at
            <br />
            my <span style={{ color: accent }}>Portfolio</span>
          </h2>

          {n > 2 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-6 py-3 text-base font-semibold text-white transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: accent, outlineColor: INK }}
            >
              {expanded ? "Show Less" : "See More"}
              <ArrowIcon dir="up-right" className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* body */}
        {expanded ? (
          <ul className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2">
            {views.map((project) => (
              <li key={project.key}>
                <ProjectCard project={project} accent={accent} onOpen={onOpen} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="relative mt-12">
            {canSlide && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous projects"
                  className={`${arrowBase} left-0 -translate-x-1/2 sm:-left-2 ${
                    arrowsOnDesktop ? "" : "md:hidden"
                  }`}
                  style={{ backgroundColor: INK, outlineColor: accent }}
                >
                  <ArrowIcon dir="left" className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next projects"
                  className={`${arrowBase} right-0 translate-x-1/2 sm:-right-2 ${
                    arrowsOnDesktop ? "" : "md:hidden"
                  }`}
                  style={{ backgroundColor: accent, outlineColor: INK }}
                >
                  <ArrowIcon dir="right" className="h-5 w-5" />
                </button>
              </>
            )}

            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={start}
                initial={reduce ? false : { opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-8 md:grid-cols-2"
              >
                {windowed.map((project, i) => (
                  <li key={project.key} className={i > 0 ? "hidden md:block" : ""}>
                    <ProjectCard project={project} accent={accent} onOpen={onOpen} />
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProjectsDefault;