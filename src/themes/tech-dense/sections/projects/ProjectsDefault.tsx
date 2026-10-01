"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
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
/* ==========================================================================
   DATA HELPERS
   Only `title` is guaranteed. Everything else is read defensively so the
   design adapts to whichever optional fields a project carries.
   ========================================================================== */

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

function readString(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function readUrl(source: Record<string, unknown>, keys: string[]) {
  const value = readString(source, keys);
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

function readTags(source: Record<string, unknown>): string[] {
  for (const key of ["technologies", "tech", "stack", "tags", "skills"]) {
    const value = source[key];
    if (!Array.isArray(value)) continue;
    const tags = value
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item === "object") {
          const name = (item as Record<string, unknown>).name;
          return typeof name === "string" ? name.trim() : "";
        }
        return "";
      })
      .filter(Boolean);
    if (tags.length) return tags;
  }
  return [];
}

function toView(project: unknown, index: number): ProjectView {
  const r = project as Record<string, unknown>;
  const title = String(r.title ?? "").trim();
  return {
    key: `${title}-${index}`,
    title,
    description: readString(r, ["description", "summary", "about"]),
    imageUrl: readUrl(r, [
      "imageUrl",
      "image_url",
      "image",
      "thumbnail",
      "thumbnailUrl",
      "thumbnail_url",
      "coverUrl",
      "cover_url",
      "coverImage",
      "coverImageUrl",
      "screenshot",
      "previewUrl",
      "previewImage",
    ]),
    liveUrl: readUrl(r, [
      "liveUrl",
      "demoUrl",
      "url",
      "link",
      "websiteUrl",
      "projectUrl",
    ]),
    sourceUrl: readUrl(r, [
      "githubUrl",
      "repoUrl",
      "repository",
      "sourceUrl",
      "codeUrl",
    ]),
    tags: readTags(r),
    year: readString(r, ["year", "date"]),
  };
}

/* ==========================================================================
   DESIGN TOKENS + SMALL PARTS
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1] as const;
const CUT = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)";
const CUT_SM =
  "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)";

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width="12"
      height="12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 10L10 2M10 2H4.5M10 2V7.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProjectLinks({ project,portfolioId }: { project: ProjectView,portfolioId?: string | null; }) {
  if (!project.liveUrl && !project.sourceUrl) return null;
  const handleClick = () => {
    if (portfolioId) {
      trackProjectClick(portfolioId, project.title);
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.title} live (opens in a new tab)`}
          style={{ clipPath: CUT_SM }}
          onClick={handleClick}
          className="group relative inline-flex bg-gradient-to-br from-blue-300/70 via-blue-500/40 to-blue-600/70 p-px outline-none transition-shadow duration-500 hover:shadow-[0_0_32px_-6px_rgba(59,130,246,0.7)] focus-visible:ring-2 focus-visible:ring-blue-300"
        >
          <span
            style={{ clipPath: CUT_SM }}
            className="relative flex min-h-9 items-center gap-2.5 overflow-hidden bg-[#070B14] px-4 font-[var(--font-inter)] text-[13px] font-medium text-white"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-blue-300/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[320%]"
            />
            <span className="relative">View project</span>
            <ArrowIcon className="relative text-blue-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </a>
      )}
      {project.sourceUrl && (
        <a
          href={project.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.title} source code (opens in a new tab)`}
          onClick={handleClick}
          className="group relative inline-flex min-h-9 items-center gap-2 font-[var(--font-inter)] text-[13px] text-white/55 outline-none transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-blue-400/60"
        >
          Source code
          <ArrowIcon className="opacity-60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-blue-400 transition-transform duration-500 group-hover:scale-x-100"
          />
        </a>
      )}
    </div>
  );
}

function TagList({ tags, max = 6 }: { tags: string[]; max?: number }) {
  if (!tags.length) return null;
  const shown = tags.slice(0, max);
  const rest = tags.length - shown.length;
  return (
    <ul className="flex flex-wrap gap-2">
      {shown.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-[var(--font-inter)] text-xs text-white/60"
        >
          {tag}
        </li>
      ))}
      {rest > 0 && (
        <li className="px-1 py-1 font-[var(--font-inter)] text-xs text-white/35">
          +{rest} more
        </li>
      )}
    </ul>
  );
}

/** Visual shown when a project has no image: the title itself, on a lit surface. */
function ImageFallback({ title }: { title: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-end overflow-hidden p-6"
      style={{
        background:
          "radial-gradient(circle at 70% 25%, rgba(59,130,246,0.28), transparent 50%), linear-gradient(160deg,#0C1220,#05070C)",
      }}
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-60"
        fill="none"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <path
            key={i}
            d={`M0 ${120 + i * 20} C 100 ${80 + i * 22}, 200 ${170 + i * 14}, 400 ${110 + i * 22}`}
            stroke="rgba(96,165,250,1)"
            strokeOpacity={0.06 + i * 0.03}
          />
        ))}
      </svg>
      <span className="relative line-clamp-3 font-[var(--font-bricolage)] text-3xl font-medium leading-none tracking-[-0.05em] text-white/85">
        {title}
      </span>
    </div>
  );
}

function ProjectImage({
  project,
  sizes,
}: {
  project: ProjectView;
  sizes: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const imageUrl = project.imageUrl;

  return (
    <>
      {imageUrl && !imageFailed ? (
        <Image
          key={imageUrl}
          src={imageUrl}
          alt={`${project.title} preview`}
          fill
          sizes={sizes}
          unoptimized
          onError={() => {
            console.error("Project image failed to load:", imageUrl);
            setImageFailed(true);
          }}
          className="object-cover saturate-[0.9] contrast-[1.04]"
        />
      ) : (
        <ImageFallback title={project.title} />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(4,7,14,0.7), rgba(4,7,14,0) 50%), linear-gradient(135deg, rgba(37,99,235,0.14), transparent 45%)",
        }}
      />
    </>
  );
}

/* ==========================================================================
   SECTION
   ========================================================================== */

export function ProjectsDefault({ config }: ThemeSectionProps) {
  const reduced = Boolean(useReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
const portfolioId = config?.portfolioId;          
  const projects = (config.projects ?? []).filter((project) =>
    project.title?.trim(),
  );
  

  const views = useMemo(
    () => projects.map((project, i) => toView(project, i)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.projects],
  );

  /* Pointer-following light for the whole section */
  const px = useSpring(useMotionValue(70), { stiffness: 60, damping: 20 });
  const py = useSpring(useMotionValue(30), { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(620px circle at ${px}% ${py}%, rgba(37,99,235,0.15), transparent 62%)`;

  if (!projects.length) {
    return null;
  }

  const safeIndex = Math.min(activeIndex, views.length - 1);
  const active = views[safeIndex];

  const glowTop = views.length > 1 ? (safeIndex / (views.length - 1)) * 60 : 20;

  const fade = {
    initial: { opacity: 0, y: reduced ? 0 : 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.9, ease: EASE },
  } as const;

  return (
    <section
      id="projects"
      aria-label="Projects"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 100);
        py.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative isolate overflow-hidden bg-[#04060B] text-white"
    >
      {/* ------------------------------ BACKGROUND ------------------------------ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{ background: spotlight }}
        />

        {/* A glow that travels down the section to follow the active project */}
        <motion.div
          className="absolute -right-40 h-[38rem] w-[38rem] rounded-full blur-[150px]"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.16), transparent 68%)",
          }}
          animate={{ top: `${glowTop + 8}%` }}
          transition={{ duration: reduced ? 0 : 1.4, ease: EASE }}
        />

        {/* Architectural grid, fading downward */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(148,163,184,0.9) 1px, transparent 1px), linear-gradient(180deg, rgba(148,163,184,0.9) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
            maskImage: "linear-gradient(to bottom, black, transparent 85%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black, transparent 85%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />

        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{
            background: "linear-gradient(to top, transparent, #04060B)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background: "linear-gradient(to bottom, transparent, #04060B)",
          }}
        />
      </div>

      {/* -------------------------------- CONTENT -------------------------------- */}
      <div className="relative mx-auto w-full max-w-[1480px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40 xl:px-16">
        {/* Heading */}
        <motion.div
          {...fade}
          className="mb-14 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 sm:mb-20"
        >
          <h2 className="font-[var(--font-bricolage)] text-[clamp(2.6rem,5vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white">
            Projects
          </h2>
          <p className="max-w-[300px] border-l border-blue-400/40 pl-5 font-[var(--font-inter)] text-sm leading-6 text-white/45">
            {views.length} selected{" "}
            {views.length === 1 ? "project" : "projects"}.
          </p>
        </motion.div>

        {/* ------------------------- DESKTOP: index + preview ------------------------- */}
        <div className="hidden gap-14 lg:grid lg:grid-cols-12 xl:gap-20">
          <ul className="lg:col-span-7">
            {views.map((project, i) => {
              const isActive = i === safeIndex;
              return (
                <li
                  key={project.key}
                  className="relative border-t border-white/[0.08] last:border-b"
                >
                  {isActive && (
                    <motion.span
                      layoutId="project-rail"
                      aria-hidden="true"
                      transition={
                        reduced
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 34 }
                      }
                      className="absolute -top-px left-0 h-[calc(100%+1px)] w-px bg-gradient-to-b from-blue-300 to-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.8)]"
                    />
                  )}

                  <button
                    type="button"
                    onPointerEnter={() => setActiveIndex(i)}
                    onFocus={() => setActiveIndex(i)}
                    onClick={() => setActiveIndex(i)}
                    aria-expanded={isActive}
                    aria-controls={`project-panel-${i}`}
                    className="group flex w-full items-center justify-between gap-6 py-6 pl-6 pr-2 text-left outline-none focus-visible:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400/60"
                  >
                    <span
                      className={`font-[var(--font-bricolage)] text-[clamp(1.75rem,2.8vw,2.9rem)] font-medium leading-[1.05] tracking-[-0.045em] transition-colors duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-white/35 group-hover:text-white/70"
                      }`}
                    >
                      {project.title}
                    </span>
                    {project.year && (
                      <span className="shrink-0 font-[var(--font-inter)] text-xs text-white/30">
                        {project.year}
                      </span>
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        id={`project-panel-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-6 pb-8 pl-6 pr-2">
                          {project.description && (
                            <p className="max-w-[560px] font-[var(--font-inter)] text-[15px] leading-7 text-white/55">
                              {project.description}
                            </p>
                          )}
                          <TagList tags={project.tags} />
                         <ProjectLinks project={project} portfolioId={portfolioId} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* Live preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <div
                style={{ clipPath: CUT }}
                className="bg-gradient-to-b from-blue-300/40 via-white/[0.08] to-blue-500/30 p-px"
              >
                <div
                  style={{ clipPath: CUT }}
                  className="relative aspect-[4/3] overflow-hidden bg-[#070A10]"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={active.key}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: reduced ? 1 : 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.7, ease: EASE }}
                    >
                      <ProjectImage
                        project={active}
                        sizes="(max-width: 1280px) 40vw, 560px"
                      />
                    </motion.div>
                  </AnimatePresence>

                  <span
                    aria-hidden="true"
                    className="absolute bottom-5 right-5 h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_14px_3px_rgba(59,130,246,0.75)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------- MOBILE / TABLET: stack ---------------------------- */}
        <ul className="space-y-14 lg:hidden">
          {views.map((project) => (
            <motion.li key={project.key} {...fade}>
              <div
                style={{ clipPath: CUT }}
                className="bg-gradient-to-b from-blue-300/40 via-white/[0.08] to-blue-500/30 p-px"
              >
                <div
                  style={{ clipPath: CUT }}
                  className="relative aspect-[16/10] overflow-hidden bg-[#070A10]"
                >
                  <ProjectImage
                    project={project}
                    sizes="(max-width: 1024px) 92vw, 720px"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-[var(--font-bricolage)] text-3xl font-medium leading-[1.05] tracking-[-0.045em] text-white">
                    {project.title}
                  </h3>
                  {project.year && (
                    <span className="shrink-0 font-[var(--font-inter)] text-xs text-white/30">
                      {project.year}
                    </span>
                  )}
                </div>
                {project.description && (
                  <p className="max-w-[560px] font-[var(--font-inter)] text-[15px] leading-7 text-white/55">
                    {project.description}
                  </p>
                )}
                <TagList tags={project.tags} max={5} />
               <ProjectLinks project={project} portfolioId={portfolioId} />
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ProjectsDefault;
