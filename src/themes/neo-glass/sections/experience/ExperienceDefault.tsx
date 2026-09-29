"use client";

import { useMemo, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ============================================================================
   EXPERIENCE — centred heading · dashed centre timeline · company + dates on
   the left, role + description on the right. Stacks with a left rail on mobile.
   ========================================================================== */

const DEFAULT_ACCENT = "#FF4A17";
const INK = "#1c1c1c";
const MUTED = "#5f5f5f";
const INITIAL_COUNT = 4;

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";

type ConfigExperience = NonNullable<
  ThemeSectionProps["config"]["experience"]
>[number];

type ExperienceView = {
  key: string;
  company: string | null;
  role: string | null;
  location: string | null;
  period: string | null;
  current: boolean;
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
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function toView(
  item: Partial<ConfigExperience>,
  index: number,
): ExperienceView {
  const start = formatDate(item.startDate);
  const current = Boolean(item.current);
  const end = current ? "Present" : formatDate(item.endDate);

  const period =
    start && end ? `${start} - ${end}` : start ? `${start} - Present` : end;

  return {
    key: item.id ?? `${item.company ?? item.role ?? "exp"}-${index}`,
    company: clean(item.company),
    role: clean(item.role),
    location: clean(item.location),
    period,
    current,
    description: clean(item.description),
  };
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function ExperienceDefault({ config }: ThemeSectionProps) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);

  const accent = clean(config.designPreferences?.accentColor) ?? DEFAULT_ACCENT;

  const valid = useMemo(
    () =>
      ((config.experience ?? []) as (ConfigExperience | string)[]).filter(
        (item) =>
          typeof item === "string"
            ? Boolean(item.trim())
            : Boolean(item?.role?.trim() || item?.company?.trim()),
      ),
    [config.experience],
  );

  const views = useMemo(
    () =>
      valid.map((item, index) =>
        toView(typeof item === "string" ? { role: item } : item, index),
      ),
    [valid],
  );

  if (!views.length) {
    return null;
  }

  const visible = expanded ? views : views.slice(0, INITIAL_COUNT);
  const hiddenCount = views.length - INITIAL_COUNT;

  return (
    <section
      id="experience"
      className="w-full bg-white px-5 py-16 sm:px-8 lg:py-24"
      style={{ color: INK, fontFamily: TEXT_FONT }}
    >
      <div className="mx-auto max-w-[1040px]">
        <h2
          className="text-center font-bold tracking-tight"
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)",
          }}
        >
          My Work Experience
        </h2>

        <ol className="mt-14 lg:mt-16">
          <AnimatePresence initial={false}>
            {visible.map((item, i) => {
              const isLast = i === visible.length - 1;
              const dotColor = item.current || i % 2 === 0 ? accent : INK;

              return (
                <motion.li
                  key={item.key}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                  transition={{ duration: 0.3 }}
                  className="mb-12 grid grid-cols-[auto_1fr] gap-x-5 last:mb-0 md:grid-cols-[1fr_auto_1.5fr] md:gap-x-12"
                >
                  {/* timeline dot + dashed line */}
                  <div className="relative col-start-1 row-span-2 row-start-1 flex justify-center self-stretch md:col-start-2 md:row-span-1">
                    <span
                      className="relative z-10 mt-1 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-white"
                      style={{ border: `2px solid ${dotColor}` }}
                      aria-hidden
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: dotColor }}
                      />
                    </span>
                    {!isLast && (
                      <span
                        aria-hidden
                        className="absolute bottom-[-48px] left-1/2 top-7 -translate-x-1/2 border-l-2 border-dashed"
                        style={{ borderColor: "rgba(28,28,28,.22)" }}
                      />
                    )}
                  </div>

                  {/* company + dates */}
                  <div className="col-start-2 row-start-1 md:col-start-1">
                    {item.company && (
                      <h3
                        className="text-xl font-semibold sm:text-2xl"
                        style={{ fontFamily: DISPLAY_FONT }}
                      >
                        {item.company}
                      </h3>
                    )}
                    {item.period && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: MUTED }}
                      >
                        {item.period}
                      </p>
                    )}
                    {item.location && (
                      <p className="text-sm" style={{ color: MUTED }}>
                        {item.location}
                      </p>
                    )}
                  </div>

                  {/* role + description */}
                  <div className="col-start-2 row-start-2 mt-3 md:col-start-3 md:row-start-1 md:mt-0">
                    {item.role && (
                      <h4
                        className="text-xl font-semibold sm:text-2xl"
                        style={{ fontFamily: DISPLAY_FONT }}
                      >
                        {item.role}
                      </h4>
                    )}
                    {item.description && (
                      <p
                        className="mt-2 max-w-[520px] whitespace-pre-line text-[15px] leading-relaxed"
                        style={{ color: MUTED }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>

        {hiddenCount > 0 && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="rounded-full px-7 py-3 text-base font-semibold text-white transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: accent, outlineColor: INK }}
            >
              {expanded ? "Show Less" : `View all ${views.length} roles`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ExperienceDefault;