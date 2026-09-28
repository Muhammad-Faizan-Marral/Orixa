"use client";

import { useMemo } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ==========================================================================
   DATA HELPERS
   The education entry shape isn't assumed: every field is read defensively
   from common names, so the design adapts to whatever the data carries.
   ========================================================================== */

type EducationView = {
  key: string;
  title: string;
  degree: string | null;
  location: string | null;
  period: string | null;
  grade: { label: string; value: string } | null;
  description: string | null;
  monogram: string;
};

function readString(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return null;
}

/** "2023-04" → "Apr 2023"; anything else is shown as written. */
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

function getMonogram(value: string): string {
  const words = value
    .replace(/\b(of|the|and|for|at)\b/gi, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

const INSTITUTION_KEYS = ["institution", "school", "university", "college", "organization"];
const DEGREE_KEYS = ["degree", "qualification", "title", "program"];
const FIELD_KEYS = ["field", "fieldOfStudy", "major", "course", "subject"];

function toView(item: unknown, index: number): EducationView | null {
  const r = item as Record<string, unknown>;

  const institution = readString(r, INSTITUTION_KEYS);
  const degreeBase = readString(r, DEGREE_KEYS);
  const field = readString(r, FIELD_KEYS);
  const description = readString(r, ["description", "summary", "details"]);

  const degree =
    degreeBase && field && !degreeBase.toLowerCase().includes(field.toLowerCase())
      ? `${degreeBase}, ${field}`
      : (degreeBase ?? field);

  const title = institution ?? degree;
  if (!title) return null;

  const start = readString(r, ["startDate", "start", "from", "startYear"]);
  const end = readString(r, ["endDate", "end", "to", "endYear", "graduationYear", "year"]);
  const explicit = readString(r, ["period", "dates", "duration"]);
  let period: string | null = explicit;
  if (!period && start && end) period = `${formatDate(start)} – ${formatDate(end)}`;
  else if (!period && start) period = `${formatDate(start)} – Present`;
  else if (!period && end) period = formatDate(end);

  const gpa = readString(r, ["gpa", "cgpa"]);
  const gradeText = readString(r, ["grade", "score", "honors", "result"]);
  const grade = gpa
    ? { label: "GPA", value: gpa }
    : gradeText
      ? { label: "Grade", value: gradeText }
      : null;

  return {
    key: `${title}-${index}`,
    title,
    degree: institution ? degree : null,
    location: readString(r, ["location", "city"]),
    period,
    grade,
    description,
    monogram: getMonogram(title),
  };
}

/* ==========================================================================
   DESIGN TOKENS
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1] as const;
const CUT = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)";
const CUT_SM = "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)";

/* ==========================================================================
   ROW
   ========================================================================== */

function Row({ item, reduced }: { item: EducationView; reduced: boolean }) {
  return (
    <motion.li
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="group relative"
    >
      {/* Top hairline draws itself in when the row arrives */}
      <motion.span
        aria-hidden="true"
        variants={{
          hidden: { scaleX: reduced ? 1 : 0 },
          visible: { scaleX: 1 },
        }}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-blue-400/70 via-white/[0.12] to-white/[0.06]"
      />

      {/* Hover wash */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/[0.07] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <motion.div
        variants={{
          hidden: { opacity: 0, y: reduced ? 0 : 22 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        className="relative grid gap-x-10 gap-y-6 py-10 sm:py-12 lg:grid-cols-12"
      >
        {/* Monogram + period */}
        <div className="flex items-center gap-4 lg:col-span-3 lg:flex-col lg:items-start lg:gap-5">
          <span
            aria-hidden="true"
            style={{ clipPath: CUT_SM }}
            className="flex h-14 w-14 shrink-0 items-center justify-center border border-blue-400/25 bg-blue-500/[0.06] transition-colors duration-500 group-hover:bg-blue-500/[0.14]"
          >
            <span className="font-[var(--font-bricolage)] text-lg font-medium tracking-[-0.04em] text-blue-100">
              {item.monogram}
            </span>
          </span>

          <div>
            {item.period && (
              <p className="font-[var(--font-inter)] text-sm text-white/60">
                {item.period}
              </p>
            )}
            {item.location && (
              <p className="mt-1 font-[var(--font-inter)] text-xs text-white/30">
                {item.location}
              </p>
            )}
          </div>
        </div>

        {/* Institution + degree + description */}
        <div className="lg:col-span-6">
          <h3 className="font-[var(--font-bricolage)] text-[clamp(1.75rem,3vw,3rem)] font-medium leading-[1.05] tracking-[-0.045em] text-white">
            {item.title}
          </h3>

          {item.degree && (
            <p className="mt-3 flex items-start gap-3 font-[var(--font-inter)] text-[15px] leading-6 text-blue-200/75">
              <span
                aria-hidden="true"
                className="mt-3 h-px w-6 shrink-0 bg-blue-400/60"
              />
              {item.degree}
            </p>
          )}

          {item.description && (
            <p className="mt-6 max-w-[560px] font-[var(--font-inter)] text-[15px] leading-7 text-white/50">
              {item.description}
            </p>
          )}
        </div>

        {/* Result — shown only when the entry has one */}
        {item.grade && (
          <div className="lg:col-span-3 lg:justify-self-end lg:text-right">
            <p className="font-[var(--font-inter)] text-xs text-white/35">
              {item.grade.label}
            </p>
            <p
              className="mt-1 font-[var(--font-bricolage)] text-[clamp(2rem,3.2vw,3.25rem)] font-medium leading-none tracking-[-0.05em] text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(180deg,#fff 0%,rgba(147,197,253,0.7) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              {item.grade.value}
            </p>
          </div>
        )}
      </motion.div>
    </motion.li>
  );
}

/* ==========================================================================
   SECTION
   ========================================================================== */

export function EducationDefault({ config }: ThemeSectionProps) {
  const reduced = Boolean(useReducedMotion());

  const valid = useMemo(
    () =>
      (config.education ?? []).map(toView).filter((v): v is EducationView => v !== null),
    [config.education],
  );

  /* Pointer-following light */
  const px = useSpring(useMotionValue(70), { stiffness: 60, damping: 20 });
  const py = useSpring(useMotionValue(40), { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${px}% ${py}%, rgba(37,99,235,0.14), transparent 62%)`;

  if (!valid.length) return null;

  return (
    <section
      id="education"
      aria-label="Education"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 100);
        py.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative isolate overflow-hidden bg-[#04060B] text-white"
    >
      {/* ------------------------------ BACKGROUND ------------------------------ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />

        {/* Horizontal light lines rising slowly, each on its own clock */}
        {[
          { left: "8%", w: "34%", d: 19, delay: 0 },
          { left: "52%", w: "40%", d: 26, delay: 6 },
          { left: "24%", w: "28%", d: 22, delay: 12 },
          { left: "62%", w: "24%", d: 30, delay: 3 },
        ].map((line, i) => (
          <motion.span
            key={i}
            className="absolute h-px"
            style={{
              left: line.left,
              width: line.w,
              top: 0,
              background:
                "linear-gradient(90deg, transparent, rgba(96,165,250,0.4), transparent)",
              boxShadow: "0 0 18px rgba(59,130,246,0.25)",
            }}
            initial={{ y: "100vh", opacity: 0 }}
            animate={
              reduced
                ? { y: `${20 + i * 18}vh`, opacity: 0.4 }
                : { y: ["100vh", "-10vh"], opacity: [0, 0.8, 0.8, 0] }
            }
            transition={{
              duration: line.d,
              delay: line.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(148,163,184,0.9) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            maskImage:
              "radial-gradient(ellipse at 30% 50%, black 0%, transparent 65%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 30% 50%, black 0%, transparent 65%)",
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
          style={{ background: "linear-gradient(to top, transparent, #04060B)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: "linear-gradient(to bottom, transparent, #04060B)" }}
        />
      </div>

      {/* -------------------------------- CONTENT -------------------------------- */}
      <div className="relative mx-auto w-full max-w-[1480px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 sm:mb-16"
        >
          <h2 className="font-[var(--font-bricolage)] text-[clamp(2.6rem,5vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white">
            Education
          </h2>
          <p className="max-w-[300px] border-l border-blue-400/40 pl-5 font-[var(--font-inter)] text-sm leading-6 text-white/45">
            {valid.length} {valid.length === 1 ? "qualification" : "qualifications"}.
          </p>
        </motion.div>

        <ol className="border-b border-white/[0.07]">
          {valid.map((item) => (
            <Row key={item.key} item={item} reduced={reduced} />
          ))}
        </ol>
      </div>
    </section>
  );
}

export default EducationDefault;