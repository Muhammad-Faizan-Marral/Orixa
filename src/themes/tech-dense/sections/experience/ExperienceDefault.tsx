"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ==========================================================================
   DATA HELPERS
   `role`, `company` and `description` are guaranteed by the filter. Dates,
   location and tags are read defensively from common field names.
   ========================================================================== */

type ExperienceView = {
  key: string;
  title: string;
  company: string | null;
  location: string | null;
  period: string | null;
  current: boolean;
  lines: string[];
  tags: string[];
};

function readString(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

/** "2023-04" / "2023-04-15" → "Apr 2023"; anything else is shown as written. */
function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec(value);
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
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

function toView(item: unknown, index: number): ExperienceView {
  const r = item as Record<string, unknown>;
  const role = readString(r, ["role"]);
  const company = readString(r, ["company"]);
  const description = readString(r, ["description"]);

  const start = readString(r, ["startDate", "start", "from"]);
  const end = readString(r, ["endDate", "end", "to"]);
  const explicit = readString(r, ["period", "dates", "duration"]);
  const current =
    r.current === true ||
    r.isCurrent === true ||
    (start !== null && end === null && explicit === null);

  let period: string | null = explicit;
  if (!period && start) {
    period = `${formatDate(start)} – ${end ? formatDate(end) : "Present"}`;
  } else if (!period && end) {
    period = formatDate(end);
  }

  const lines = (description ?? "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-•*–]\s*/, "").trim())
    .filter(Boolean);

  return {
    key: `${role ?? company ?? "role"}-${index}`,
    title: role ?? company ?? "",
    company: role && company ? company : null,
    location: readString(r, ["location", "city"]),
    period,
    current,
    lines,
    tags: readTags(r),
  };
}

/* ==========================================================================
   ENTRY
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1] as const;

function Entry({ item, reduced }: { item: ExperienceView; reduced: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.65", "end 0.55"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const nodeGlow = useTransform(scrollYProgress, [0, 0.04], [0, 1]);

  const isList = item.lines.length > 1;

  return (
    <li
      ref={ref}
      className="grid grid-cols-[14px_minmax(0,1fr)] gap-x-5 sm:gap-x-8 lg:grid-cols-[210px_14px_minmax(0,1fr)] lg:gap-x-10"
    >
      {/* Date column — desktop only; mobile shows the period inside the content */}
      <div className="hidden pb-16 pt-1 text-right lg:block">
        {item.period && (
          <p className="font-[var(--font-inter)] text-sm text-white/55">
            {item.period}
          </p>
        )}
        {item.location && (
          <p className="mt-1.5 font-[var(--font-inter)] text-xs text-white/30">
            {item.location}
          </p>
        )}
      </div>

      {/* Spine segment: draws itself as the entry is read */}
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 top-2 w-px -translate-x-1/2 bg-white/[0.08]"
        />
        <motion.span
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 top-2 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-blue-300 via-blue-500 to-blue-500/0 shadow-[0_0_14px_rgba(59,130,246,0.7)]"
          style={{ scaleY: reduced ? 1 : fill }}
        />
        {/* Node */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-[#04060B]"
        />
        <motion.span
          aria-hidden="true"
          style={{ opacity: reduced ? 1 : nodeGlow }}
          className="absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_16px_4px_rgba(59,130,246,0.75)]"
        />
        {item.current && !reduced && (
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-blue-400/50"
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="pb-16 sm:pb-20"
      >
        {/* Mobile / tablet meta */}
        {(item.period || item.location) && (
          <p className="mb-3 font-[var(--font-inter)] text-xs text-white/40 lg:hidden">
            {[item.period, item.location].filter(Boolean).join("  ·  ")}
          </p>
        )}

        <h3 className="max-w-[760px] font-[var(--font-bricolage)] text-[clamp(1.75rem,3vw,3rem)] font-medium leading-[1.05] tracking-[-0.045em] text-white">
          {item.title}
        </h3>

        {item.company && (
          <p className="mt-3 flex items-center gap-3 font-[var(--font-inter)] text-[15px] text-blue-200/75">
            <span aria-hidden="true" className="h-px w-6 bg-blue-400/60" />
            {item.company}
            {item.current && (
              <span className="rounded-full border border-blue-400/30 bg-blue-500/[0.08] px-2.5 py-0.5 text-xs text-blue-200/80">
                Current
              </span>
            )}
          </p>
        )}

        {item.lines.length > 0 &&
          (isList ? (
            <ul className="mt-7 max-w-[640px] space-y-3.5">
              {item.lines.map((line, i) => (
                <li
                  key={`${line.slice(0, 20)}-${i}`}
                  className="flex gap-4 font-[var(--font-inter)] text-[15px] leading-7 text-white/55"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[13px] h-px w-3 shrink-0 bg-blue-400/70"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-7 max-w-[600px] font-[var(--font-inter)] text-[15px] leading-7 text-white/55">
              {item.lines[0]}
            </p>
          ))}

        {item.tags.length > 0 && (
          <ul className="mt-7 flex flex-wrap gap-2">
            {item.tags.slice(0, 8).map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-[var(--font-inter)] text-xs text-white/60"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </li>
  );
}

/* ==========================================================================
   SECTION
   ========================================================================== */

export function ExperienceDefault({ config }: ThemeSectionProps) {
  const reduced = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);

  const valid = useMemo(
    () =>
      (config.experience ?? []).filter(
        (item) =>
          item.role?.trim() || item.company?.trim() || item.description?.trim(),
      ),
    [config.experience],
  );

  const views = useMemo(
    () => valid.map((item, i) => toView(item, i)).filter((v) => v.title),
    [valid],
  );

  /* Pointer light + scroll-linked glow */
  const px = useSpring(useMotionValue(25), { stiffness: 60, damping: 20 });
  const py = useSpring(useMotionValue(35), { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(580px circle at ${px}% ${py}%, rgba(37,99,235,0.14), transparent 62%)`;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["-10%", "40%"]);

  if (!valid.length || !views.length) return null;

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-label="Experience"
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

        <motion.div
          className="absolute -left-56 h-[42rem] w-[42rem] rounded-full blur-[150px]"
          style={{
            top: reduced ? "10%" : glowY,
            background:
              "radial-gradient(circle, rgba(37,99,235,0.14), transparent 68%)",
          }}
        />

        {/* A slow light band sweeping across on its own clock */}
        <motion.div
          className="absolute inset-y-0 w-[38%]"
          style={{
            background:
              "linear-gradient(100deg, transparent, rgba(59,130,246,0.05) 50%, transparent)",
          }}
          animate={reduced ? undefined : { x: ["-40vw", "110vw"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(148,163,184,0.9) 1px, transparent 1px)",
            backgroundSize: "120px 100%",
            maskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
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
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-14 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 sm:mb-20"
        >
          <h2 className="font-[var(--font-bricolage)] text-[clamp(2.6rem,5vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white">
            Experience
          </h2>
          <p className="max-w-[300px] border-l border-blue-400/40 pl-5 font-[var(--font-inter)] text-sm leading-6 text-white/45">
            {views.length} {views.length === 1 ? "role" : "roles"}.
          </p>
        </motion.div>

        <ol className="mx-auto max-w-[1180px]">
          {views.map((item) => (
            <Entry key={item.key} item={item} reduced={reduced} />
          ))}
        </ol>
      </div>
    </section>
  );
}

export default ExperienceDefault;
