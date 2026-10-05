"use client";

import { useMemo, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ============================================================================
   EDUCATION — light grey band · heading + hairline · 2-col white cards.
   Card: period pill, institution, degree · field, description.
   ========================================================================== */

const DEFAULT_ACCENT = "#FF4A17";
const INK = "#1c1c1c";
const MUTED = "#5f5f5f";
const BAND = "#f1f1f1";
const INITIAL_COUNT = 4;

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";

type ConfigEducation = NonNullable<
  ThemeSectionProps["config"]["education"]
>[number];

type EducationView = {
  key: string;
  institution: string;
  degree: string | null;
  field: string | null;
  period: string | null;
  description: string | null;
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function clean(value: string | null | undefined) {
  if (typeof value !== "string") return null;
  const result = value.trim();
  return result.length ? result : null;
}

function formatDate(value: string | null | undefined) {
  const raw = clean(value);
  if (!raw) return null;
  if (/^\d{4}$/.test(raw)) return raw;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function toView(
  item: ConfigEducation | null | undefined,
  index: number,
): EducationView | null {
  const institution = clean(item?.institution);
  if (!item || !institution) return null;

  const start = formatDate(item.startDate);
  const end = formatDate(item.endDate);
  const period =
    start && end ? `${start} - ${end}` : start ? `${start} - Present` : end;

  return {
    key: item.id ?? `${institution}-${index}`,
    institution,
    degree: clean(item.degree),
    field: clean(item.field),
    period,
    description: clean(item.description),
  };
}

function CapIcon({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5M22 9v6" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function EducationDefault({ config }: ThemeSectionProps) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  const accent = DEFAULT_ACCENT;

  const valid = useMemo(
    () =>
      (config.education ?? [])
        .map(toView)
        .filter((v): v is EducationView => v !== null),
    [config.education],
  );

  if (!valid.length) {
    return null;
  }

  const visible = expanded ? valid : valid.slice(0, INITIAL_COUNT);
  const hiddenCount = valid.length - INITIAL_COUNT;

  return (
    <section
      id="education"
      className="w-full px-5 py-16 sm:px-8 lg:py-24"
      style={{ backgroundColor: BAND, color: INK, fontFamily: TEXT_FONT }}
    >
      <div className="mx-auto max-w-[1140px]">
        <div className="flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-end sm:justify-between" style={{ borderColor: "rgba(28,28,28,.15)" }}>
          <h2
            className="font-bold tracking-tight"
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)",
            }}
          >
            My <span style={{ color: accent }}>Education</span>
          </h2>
          <p className="max-w-[320px] text-sm leading-relaxed sm:text-right" style={{ color: MUTED }}>
            {valid.length} {valid.length === 1 ? "qualification" : "qualifications"} that shaped how I work.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          <AnimatePresence initial={false}>
            {visible.map((item) => (
              <motion.li
                key={item.key}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col rounded-3xl bg-white p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${accent}1f` }}
                    aria-hidden
                  >
                    <CapIcon color={accent} />
                  </span>

                  {item.period && (
                    <span
                      className="rounded-full border-2 px-4 py-1 text-[13px] font-medium"
                      style={{ borderColor: accent, color: accent }}
                    >
                      {item.period}
                    </span>
                  )}
                </div>

                <h3
                  className="mt-5 text-xl font-semibold sm:text-2xl"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  {item.institution}
                </h3>

                {(item.degree || item.field) && (
                  <p className="mt-1 text-[15px] font-medium">
                    {[item.degree, item.field].filter(Boolean).join(", ")}
                  </p>
                )}

                {item.description && (
                  <p
                    className="mt-3 whitespace-pre-line text-[15px] leading-relaxed"
                    style={{ color: MUTED }}
                  >
                    {item.description}
                  </p>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {hiddenCount > 0 && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="rounded-full px-7 py-3 text-base font-semibold text-white transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: accent, outlineColor: INK }}
            >
              {expanded ? "Show Less" : `View all ${valid.length}`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default EducationDefault;