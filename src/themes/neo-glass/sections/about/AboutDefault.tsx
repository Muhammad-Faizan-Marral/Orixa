"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ============================================================================
   ABOUT (minimal) — white · hairline top · small label left ·
   lead paragraph + muted copy right · inline stats · two text links.
   ========================================================================== */

const DEFAULT_ACCENT = "#FF4A17";
const INK = "#1c1c1c";
const MUTED = "#6b6b6b";
const HAIRLINE = "rgba(28,28,28,.14)";
const EASE = [0.22, 1, 0.36, 1] as const;

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";

type SafeProfile = {
  username?: string | null;
  fullName?: string | null;
  location?: string | null;
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function firstString(...values: (string | null | undefined)[]) {
  for (const v of values) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function cleanUrl(value: string | null | undefined) {
  const result = firstString(value);
  if (!result) return null;
  if (/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(result)) return result;
  return `https://${result}`;
}

function yearsOfExperience(
  list: { startDate?: string; endDate?: string; current?: boolean }[],
) {
  const starts = list
    .map((e) => (e.startDate ? new Date(e.startDate).getTime() : NaN))
    .filter((t) => !Number.isNaN(t));
  if (!starts.length) return 0;

  const hasCurrent = list.some((e) => e.current || !e.endDate);
  const ends = list
    .map((e) => (e.endDate ? new Date(e.endDate).getTime() : NaN))
    .filter((t) => !Number.isNaN(t));

  const end = hasCurrent || !ends.length ? Date.now() : Math.max(...ends);
  const years = (end - Math.min(...starts)) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.floor(years));
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function AboutEditorial({
  config,
  profile,
}: ThemeSectionProps) {
  const reduce = useReducedMotion();

  const view = useMemo(() => {
    const safeProfile = (profile ?? {}) as SafeProfile;

    const headline = firstString(config.headline);
    const about = firstString(config.about);
    const location = firstString(config.location, safeProfile.location);

    const projects = Array.isArray(config.projects) ? config.projects : [];
    const experience = Array.isArray(config.experience)
      ? config.experience
      : [];
    const skills = Array.isArray(config.skills) ? config.skills : [];

    const paragraphs = about
      ? about
          .split(/\n+/)
          .map((p) => p.trim())
          .filter(Boolean)
      : [];

    const lead = paragraphs[0] ?? headline;
    const rest = paragraphs.slice(1, 3);

    const years = yearsOfExperience(experience);
    const stats: { value: string; label: string }[] = [];
    if (projects.length)
      stats.push({ value: `${projects.length}+`, label: "Projects" });
    if (years > 0) stats.push({ value: `${years}+`, label: "Years" });
    if (skills.length) stats.push({ value: `${skills.length}+`, label: "Skills" });

    return {
      lead,
      rest,
      location,
      stats,
      accent:DEFAULT_ACCENT,
      resumeUrl: cleanUrl(config.resumeUrl),
    };
  }, [config, profile]);

  if (!view.lead && !view.location) {
    return null;
  }

  const { accent } = view;

  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  const linkCls =
    "text-base font-semibold underline underline-offset-[6px] decoration-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

  return (
    <section
      id="about"
      className="w-full bg-white px-5 py-20 sm:px-8 lg:py-28"
      style={{ color: INK, fontFamily: TEXT_FONT }}
    >
      <div
        className="mx-auto grid max-w-[1140px] gap-8 border-t pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16"
        style={{ borderColor: HAIRLINE }}
      >
        {/* label */}
        <motion.h2
          {...rise(0)}
          className="flex items-center gap-2 text-base font-semibold"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          <span
            aria-hidden
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: accent }}
          />
          About
        </motion.h2>

        {/* content */}
        <div>
          {view.lead && (
            <motion.p
              {...rise(0.05)}
              className="max-w-[760px] font-medium leading-[1.35] tracking-tight"
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: "clamp(1.5rem, 2.8vw, 2.15rem)",
                textWrap: "pretty",
              }}
            >
              {view.lead}
            </motion.p>
          )}

          {view.rest.length > 0 && (
            <motion.div
              {...rise(0.1)}
              className="mt-6 max-w-[620px] space-y-4 text-base leading-relaxed"
              style={{ color: MUTED }}
            >
              {view.rest.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>
          )}

          {view.stats.length > 0 && (
            <motion.dl
              {...rise(0.15)}
              className="mt-12 flex flex-wrap gap-x-14 gap-y-6 border-t pt-8"
              style={{ borderColor: HAIRLINE }}
            >
              {view.stats.map((s) => (
                <div key={s.label}>
                  <dt
                    className="text-3xl font-semibold leading-none sm:text-4xl"
                    style={{ fontFamily: DISPLAY_FONT }}
                  >
                    {s.value}
                  </dt>
                  <dd className="mt-2 text-sm" style={{ color: MUTED }}>
                    {s.label}
                  </dd>
                </div>
              ))}
              {view.location && (
                <div>
                  <dt
                    className="text-3xl font-semibold leading-none sm:text-4xl"
                    style={{ fontFamily: DISPLAY_FONT }}
                  >
                    {view.location}
                  </dt>
                  <dd className="mt-2 text-sm" style={{ color: MUTED }}>
                    Based in
                  </dd>
                </div>
              )}
            </motion.dl>
          )}

          {!view.stats.length && view.location && (
            <motion.p {...rise(0.15)} className="mt-8 text-sm" style={{ color: MUTED }}>
              Based in {view.location}
            </motion.p>
          )}

          <motion.div {...rise(0.2)} className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            <a
              href="#contact"
              className={linkCls}
              style={{ textDecorationColor: accent, outlineColor: accent }}
            >
              Hire me
            </a>
            {view.resumeUrl && (
              <a
                href={view.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
                style={{ textDecorationColor: HAIRLINE, outlineColor: accent }}
              >
                Download resume
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}