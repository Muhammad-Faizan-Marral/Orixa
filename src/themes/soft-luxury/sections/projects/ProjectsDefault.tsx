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

const PAPER = "#efe2c8";
const PAPER_DEEP = "#e5d3b0";
const PAPER_DARK = "#dfcaa2";
const KRAFT = "#c9a877";
const SEPIA = "#6d4d31";
const DUST = "#9a8060";
const INK = "#1b130c";
const BLOOD = "#a3271d";
const GLOW = "#fff6e0";
const VIGNETTE = "#785430";
const SHADOW = "#573a1e";
const RULE = "rgba(109,77,49,.32)";
const HAIRLINE = "rgba(109,77,49,.22)";

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";
const SERIF_FONT =
  "var(--font-instrument), 'Iowan Old Style', 'Palatino Linotype', Georgia, serif";

const EASE = [0.22, 1, 0.36, 1] as const;

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .15  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3271d]";

const LABEL_CLASS =
  "text-[11px] font-medium uppercase tracking-[0.2em]";

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

type RawProject = Record<string, unknown> & { title?: string };

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

function asText(value: unknown): string | null {
  if (typeof value === "string") {
    const t = value.trim();
    return t ? t : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    return (
      asText(o.name) ?? asText(o.title) ?? asText(o.label) ?? asText(o.value)
    );
  }
  return null;
}

function asUrl(value: unknown): string | null {
  const text = asText(
    value && typeof value === "object"
      ? ((value as Record<string, unknown>).url ??
          (value as Record<string, unknown>).href)
      : value,
  );
  if (!text) return null;
  return /^(https?:\/\/|mailto:)/i.test(text) ? text : null;
}

function asTags(value: unknown): string[] {
  let list: unknown[] = [];
  if (typeof value === "string") list = value.split(",");
  else if (Array.isArray(value)) list = value;
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    const t = asText(item);
    if (t && !seen.has(t.toLowerCase())) {
      seen.add(t.toLowerCase());
      out.push(t);
    }
  }
  return out;
}

function asYear(value: unknown): string | null {
  const t = asText(value);
  if (!t) return null;
  const m = t.match(/\b(19|20)\d{2}\b/);
  return m ? m[0] : t.length <= 10 ? t : null;
}

function normalizeProjects(value: unknown): RawProject[] {
  if (!Array.isArray(value)) return [];
  const out: RawProject[] = [];
  for (const item of value) {
    if (typeof item === "string") {
      out.push({ title: item });
    } else if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      const title = asText(o.title) ?? asText(o.name) ?? undefined;
      out.push({ ...o, title });
    }
  }
  return out;
}

function toView(project: RawProject, index: number): ProjectView {
  const p = project as Record<string, unknown>;
  return {
    key: asText(p.id) ?? asText(p._id) ?? `${asText(project.title)}-${index}`,
    title: asText(project.title) ?? "Untitled",
    description: asText(p.description) ?? asText(p.summary) ?? asText(p.about),
    imageUrl: asUrl(p.imageUrl) ?? asUrl(p.image) ?? asUrl(p.thumbnail),
    liveUrl:
      asUrl(p.liveUrl) ?? asUrl(p.url) ?? asUrl(p.link) ?? asUrl(p.demo),
    sourceUrl:
      asUrl(p.sourceUrl) ??
      asUrl(p.github) ??
      asUrl(p.repo) ??
      asUrl(p.repository),
    tags: asTags(p.tags ?? p.technologies ?? p.stack ?? p.techStack),
    year: asYear(p.year ?? p.date ?? p.createdAt),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/* ========================================================================== */
/* SMALL PIECES                                                               */
/* ========================================================================== */

function Label({
  children,
  color = DUST,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`${LABEL_CLASS} ${className}`}
      style={{ fontFamily: TEXT_FONT, color }}
    >
      {children}
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 9 9 3M4.5 3H9v4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m4 3-3 3 3 3M8 3l3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LedgerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt
        className={LABEL_CLASS}
        style={{ fontFamily: TEXT_FONT, color: DUST }}
      >
        {label}
      </dt>
      <span
        aria-hidden="true"
        className="min-w-4 flex-1 border-b border-dotted"
        style={{ borderColor: RULE }}
      />
      <dd
        className="m-0 max-w-[60%] truncate text-right text-[15px] italic"
        style={{ fontFamily: SERIF_FONT, color: SEPIA }}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}

/* ========================================================================== */
/* CARD                                                                       */
/* ========================================================================== */

function ProjectCard({
  view,
  index,
  reduceMotion,
  onOpen,
}: {
  view: ProjectView;
  index: number;
  reduceMotion: boolean;
  onOpen: (view: ProjectView, kind: "live" | "source") => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const sx = useSpring(mx, { stiffness: 180, damping: 26, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 180, damping: 26, mass: 0.6 });
  const glow = useMotionTemplate`radial-gradient(260px circle at ${sx}px ${sy}px, ${GLOW}cc, transparent 70%)`;

  const long = (view.description?.length ?? 0) > 150;
  const descId = `project-desc-${view.key.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <motion.li
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE, delay: (index % 3) * 0.08 }}
      className="list-none"
    >
      <motion.article
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={{ duration: 0.5, ease: EASE }}
        onPointerMove={(e) => {
          if (reduceMotion) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(e.clientX - r.left);
          my.set(e.clientY - r.top);
        }}
        onPointerLeave={() => {
          mx.set(-300);
          my.set(-300);
        }}
        className="group relative flex h-full flex-col overflow-hidden rounded-[20px] p-6 sm:p-7"
        style={{
          background: `linear-gradient(180deg, ${PAPER_DEEP}, ${PAPER_DARK})`,
          border: `1px solid ${KRAFT}`,
          boxShadow: `0 1px 0 ${GLOW}b3 inset, 0 18px 32px -22px ${SHADOW}80`,
        }}
      >
        {!reduceMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: glow }}
          />
        )}

        {/* punched hole */}
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 h-3 w-3 rounded-full"
          style={{
            background: PAPER,
            boxShadow: `inset 0 1px 2px ${SHADOW}99, 0 1px 0 ${GLOW}b3`,
          }}
        />

        <div className="relative flex flex-1 flex-col">
          {/* numbering */}
          <div className="flex items-center gap-3 pr-6">
            <span
              className="text-[15px] italic"
              style={{ fontFamily: SERIF_FONT, color: BLOOD }}
            >
              {pad(index + 1)}
            </span>
            <span
              aria-hidden="true"
              className="h-px flex-1"
              style={{ background: HAIRLINE }}
            />
            <Label>Case file</Label>
          </div>

          <h3
            className="mt-5 text-[1.75rem] font-medium leading-[1.02] sm:text-[2rem]"
            style={{
              fontFamily: DISPLAY_FONT,
              letterSpacing: "-0.045em",
              color: INK,
              textWrap: "balance",
              overflowWrap: "anywhere",
            }}
          >
            {view.title}
          </h3>

          {view.description && (
            <div className="mt-4">
              <p
                id={descId}
                className={`m-0 text-[17px] leading-[1.75] ${
                  expanded ? "" : "line-clamp-3"
                }`}
                style={{ fontFamily: TEXT_FONT, color: SEPIA }}
              >
                {view.description}
              </p>
              {long && (
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={descId}
                  onClick={() => setExpanded((v) => !v)}
                  className={`mt-2 rounded-sm text-[11px] font-medium uppercase tracking-[0.2em] underline decoration-dotted underline-offset-4 ${FOCUS}`}
                  style={{ fontFamily: TEXT_FONT, color: BLOOD }}
                >
                  {expanded ? "Read less" : "Read more"}
                </button>
              )}
            </div>
          )}

          {/* ledger */}
          {(view.year || view.tags.length > 0) && (
            <dl className="m-0 mt-6 space-y-2 border-t pt-4" style={{ borderColor: HAIRLINE }}>
              {view.year && <LedgerRow label="Year" value={view.year} />}
              {view.tags.length > 0 && (
                <LedgerRow
                  label="Stack"
                  value={view.tags.slice(0, 3).join(", ")}
                />
              )}
            </dl>
          )}

          {view.tags.length > 3 && (
            <ul
              className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0"
              aria-label={`${view.title} technologies`}
            >
              {view.tags.slice(3, 9).map((tag) => (
                <li
                  key={tag}
                  className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.14em]"
                  style={{
                    fontFamily: TEXT_FONT,
                    color: SEPIA,
                    boxShadow: `inset 0 0 0 1px ${KRAFT}`,
                  }}
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          {(view.liveUrl || view.sourceUrl) && (
            <div className="mt-auto flex flex-wrap gap-2.5 pt-7">
              {view.liveUrl && (
                <a
                  href={view.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${view.title} live (opens in a new tab)`}
                  onClick={() => onOpen(view, "live")}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-transform duration-300 hover:-translate-y-0.5 ${FOCUS}`}
                  style={{
                    fontFamily: TEXT_FONT,
                    background: INK,
                    color: PAPER,
                  }}
                >
                  View live
                  <ArrowIcon />
                </a>
              )}
              {view.sourceUrl && (
                <a
                  href={view.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${view.title} source code (opens in a new tab)`}
                  onClick={() => onOpen(view, "source")}
                  className={`inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-2.5 text-[13px] font-medium transition-transform duration-300 hover:-translate-y-0.5 ${FOCUS}`}
                  style={{
                    fontFamily: TEXT_FONT,
                    color: SEPIA,
                    boxShadow: `inset 0 0 0 1px ${KRAFT}`,
                  }}
                >
                  <CodeIcon />
                  Source
                </a>
              )}
            </div>
          )}
        </div>

        {/* blood underline */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-500 group-focus-within:scale-x-100 group-hover:scale-x-100"
          style={{ background: BLOOD, transitionTimingFunction: "cubic-bezier(.22,1,.36,1)" }}
        />
      </motion.article>
    </motion.li>
  );
}

/* ========================================================================== */
/* SECTION                                                                    */
/* ========================================================================== */

export function ProjectsDefault({ config }: ThemeSectionProps) {
  const reduceMotion = !!useReducedMotion();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const rawProjects = (config as unknown as Record<string, unknown> | undefined)
    ?.projects;

  const projects = useMemo(() => normalizeProjects(rawProjects), [rawProjects]);

  const views = useMemo(
    () =>
      projects
        .filter((project) => project.title?.trim())
        .map((project, index) => toView(project, index)),
    [projects],
  );

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of views) {
      for (const t of v.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([t]) => t);
  }, [views]);

  if (!views.length) {
    return null;
  }

  const portfolioId = (config as unknown as Record<string, unknown> | undefined)
    ?.portfolioId;

  const visible = activeTag
    ? views.filter((v) => v.tags.includes(activeTag))
    : views;

  const handleOpen = (view: ProjectView, kind: "live" | "source") => {
    try {
      (trackProjectClick as unknown as (...args: unknown[]) => void)(
        portfolioId,
        view.key,
        kind,
      );
    } catch {
      /* analytics must never break navigation */
    }
  };

  const rise = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section
      id="projects"
      aria-label="Projects"
      className="relative overflow-hidden px-5 py-24 sm:px-8 md:py-32 lg:px-12"
      style={{ background: PAPER, color: INK }}
    >
      {/* paper atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 30% 12%, ${GLOW}b3, transparent 70%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, ${VIGNETTE}38 100%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: GRAIN,
          backgroundSize: "160px 160px",
          mixBlendMode: "multiply",
          opacity: 0.4,
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        {/* masthead */}
        <motion.div {...rise(0)} className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-[6px] w-[6px] rounded-full"
            style={{ background: BLOOD }}
          />
          <Label color={SEPIA}>Case files</Label>
          <span
            aria-hidden="true"
            className="h-px flex-1"
            style={{ background: RULE }}
          />
          <Label>
            {views.length} {views.length === 1 ? "entry" : "entries"}
          </Label>
        </motion.div>

        {/* heading block */}
        <div className="mt-10 grid items-end gap-8 md:mt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <motion.h2
            {...rise(0.06)}
            className="m-0 font-semibold"
            style={{
              fontFamily: DISPLAY_FONT,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              fontSize: "clamp(2.6rem, 6.6vw, 6.2rem)",
              textWrap: "balance",
              color: INK,
            }}
          >
            Selected work,
            <br />
            <span style={{ color: BLOOD }}>filed</span> and indexed.
          </motion.h2>
          <motion.p
            {...rise(0.14)}
            className="m-0 max-w-[34ch] text-[1.2rem] italic leading-[1.5] sm:text-[1.35rem]"
            style={{ fontFamily: SERIF_FONT, color: SEPIA }}
          >
            A short archive of things designed, built and shipped, each one
            kept on its own card.
          </motion.p>
        </div>

        {/* filters */}
        {allTags.length > 1 && (
          <motion.div
            {...rise(0.2)}
            role="group"
            aria-label="Filter projects by technology"
            className="mt-12 flex flex-wrap items-center gap-2.5"
          >
            <Label className="mr-2">Filter</Label>
            {[null, ...allTags].map((tag) => {
              const pressed = activeTag === tag;
              return (
                <button
                  key={tag ?? "__all"}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-full px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] transition-transform duration-300 hover:-translate-y-0.5 ${FOCUS}`}
                  style={{
                    fontFamily: TEXT_FONT,
                    background: pressed ? INK : "transparent",
                    color: pressed ? PAPER : SEPIA,
                    boxShadow: pressed ? "none" : `inset 0 0 0 1px ${KRAFT}`,
                  }}
                >
                  {tag ?? "All"}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* grid */}
        <ul
          className={`m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3 ${
            allTags.length > 1 ? "mt-8" : "mt-14"
          }`}
          aria-live="polite"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((view, i) => (
              <ProjectCard
                key={view.key}
                view={view}
                index={i}
                reduceMotion={reduceMotion}
                onOpen={handleOpen}
              />
            ))}
          </AnimatePresence>
        </ul>

        {/* footer strip */}
        <div
          className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t pt-6 md:mt-24"
          style={{ borderColor: RULE }}
        >
          <Label> Projects</Label>
          <Label>
            {activeTag
              ? `${visible.length} of ${views.length} on record`
              : `${views.length} on record`}
          </Label>
        </div>
      </div>
    </section>
  );
}

export default ProjectsDefault;