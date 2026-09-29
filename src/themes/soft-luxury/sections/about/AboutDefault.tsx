"use client";

import React, { useId, useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ==========================================================================
   ORIXA — FIELD RECORD
   Editorial identity page.
   ========================================================================== */

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

const HAIRLINE = "rgba(201,168,119,.28)";
const HAIRLINE_SOFT = "rgba(201,168,119,.17)";
const RULE = "rgba(109,77,49,.32)";

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";
const SERIF_FONT =
  "var(--font-instrument), 'Iowan Old Style', 'Palatino Linotype', Georgia, serif";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .15  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

type SafeProfile = {
  fullName?: string | null;
  username?: string | null;
  location?: string | null;
};

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length) return trimmed;
    }
  }
  return null;
}

function cleanUrl(value: unknown): string | null {
  const result = firstString(value);
  if (!result) return null;
  if (/^(https?:\/\/|\/|#|mailto:)/i.test(result)) return result;
  return `https://${result}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

/* -------------------------------------------------------------------------- */
/* SMALL PIECES                                                               */
/* -------------------------------------------------------------------------- */

function Label({
  children,
  color = DUST,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className="text-[11px] font-medium uppercase tracking-[0.2em]"
      style={{ fontFamily: TEXT_FONT, color }}
    >
      {children}
    </span>
  );
}

function LedgerRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-3 py-3">
      <span
        className="shrink-0 text-[11px] font-medium uppercase tracking-[0.18em]"
        style={{ fontFamily: TEXT_FONT, color: DUST }}
      >
        {label}
      </span>

      <span
        aria-hidden
        className="mb-[3px] h-px min-w-6 flex-1"
        style={{
          backgroundImage: `radial-gradient(circle, ${SEPIA} 0.8px, transparent 1px)`,
          backgroundSize: "6px 2px",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "left center",
          opacity: 0.55,
        }}
      />

      <span
        className="max-w-[60%] truncate text-right text-[15px] font-medium"
        style={{
          fontFamily: DISPLAY_FONT,
          color: INK,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Stamp({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      width="132"
      height="132"
      role="img"
      aria-label="Stamp: original work, not generic"
      style={{ mixBlendMode: "multiply" }}
    >
      <defs>
        <path
          id={`${id}-ring`}
          d="M80,80 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0"
        />
      </defs>

      <circle
        cx="80"
        cy="80"
        r="74"
        fill="none"
        stroke={BLOOD}
        strokeWidth="2.5"
        opacity=".85"
      />
      <circle
        cx="80"
        cy="80"
        r="42"
        fill="none"
        stroke={BLOOD}
        strokeWidth="1.2"
        opacity=".7"
      />

      <text
        fill={BLOOD}
        opacity=".9"
        fontSize="11.5"
        fontWeight="600"
        letterSpacing="3.4"
        style={{ fontFamily: TEXT_FONT }}
      >
        <textPath href={`#${id}-ring`} startOffset="0">
          NOT GENERIC · ORIGINAL WORK · NOT GENERIC · ORIGINAL WORK ·
        </textPath>
      </text>

      <text
        x="80"
        y="76"
        textAnchor="middle"
        fill={BLOOD}
        opacity=".92"
        fontSize="22"
        fontWeight="700"
        style={{ fontFamily: DISPLAY_FONT, letterSpacing: "-0.04em" }}
      >
        100%
      </text>
      <text
        x="80"
        y="94"
        textAnchor="middle"
        fill={BLOOD}
        opacity=".85"
        fontSize="9"
        fontWeight="600"
        letterSpacing="2.4"
        style={{ fontFamily: TEXT_FONT }}
      >
        HANDMADE
      </text>
    </svg>
  );
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export default function AboutEditorial({
  config,
  profile,
}: ThemeSectionProps) {
  const reduceMotion = useReducedMotion();
  const stampId = useId().replace(/:/g, "");
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const stampRotate = useTransform(scrollYProgress, [0, 1], [-14, 6]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  const view = useMemo(() => {
    const safeProfile = (profile ?? {}) as SafeProfile;

    const name =
      firstString(config.name, safeProfile.fullName, safeProfile.username) ??
      "Portfolio";

    const username = firstString(safeProfile.username, config.name);

    const headline = firstString(config.headline);
    const about = firstString(config.about);

    const location = firstString(config.location, safeProfile.location);

    const projects = Array.isArray(config.projects) ? config.projects : [];
    const experience = Array.isArray(config.experience)
      ? config.experience
      : [];

    const paragraphs = about
      ? about
          .split(/\n{1,}/)
          .map((p) => p.trim())
          .filter(Boolean)
      : [];

    return {
      name,
      username,
      headline,
      about,
      paragraphs,
      location,
      projectsCount: projects.length,
      experienceCount: experience.length,
      resumeUrl: cleanUrl(config.resumeUrl),
    };
  }, [config, profile]);

  if (
    !view.name &&
    !view.username &&
    !view.headline &&
    !view.about &&
    !view.location
  ) {
    return null;
  }

  const rise = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.9, ease: EASE, delay },
        };

  const [firstParagraph, ...restParagraphs] = view.paragraphs;
  const dropCap = firstParagraph?.charAt(0) ?? "";
  const firstRest = firstParagraph?.slice(1) ?? "";

  const ledger: { label: string; value: React.ReactNode }[] = [
    { label: "Name", value: view.name },
    ...(view.username ? [{ label: "Handle", value: `@${view.username}` }] : []),
    ...(view.location ? [{ label: "Based in", value: view.location }] : []),
    { label: "Projects", value: pad(view.projectsCount) },
    { label: "Roles", value: pad(view.experienceCount) },
    { label: "Status", value: "Open to work" },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label={`About ${view.name}`}
      className="relative overflow-hidden px-5 py-24 sm:px-8 md:py-32 lg:px-12"
      style={{ background: PAPER, color: INK }}
    >
      {/* ------------------------- paper atmosphere ------------------------ */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          y: reduceMotion ? 0 : glowY,
          background: `radial-gradient(ellipse 60% 45% at 30% 30%, ${GLOW}bf, transparent 70%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, ${VIGNETTE}38 100%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: GRAIN,
          backgroundSize: "160px 160px",
          mixBlendMode: "multiply",
          opacity: 0.4,
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        {/* ------------------------------ masthead ------------------------------ */}
        <motion.div
          {...rise(0)}
          className="flex items-center gap-4"
        >
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: BLOOD }}
          />
          <Label color={SEPIA}>Field record</Label>
          <span
            aria-hidden
            className="h-px flex-1"
            style={{ background: RULE }}
          />
          <Label>No. 001</Label>
        </motion.div>

        {/* -------------------------------- body -------------------------------- */}
        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:gap-20">
          {/* ---------------------------- left: story --------------------------- */}
          <div>
            <motion.h2
              {...rise(0.05)}
              className="font-semibold"
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: "clamp(2.8rem, 7.4vw, 7rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.06em",
                color: INK,
                textWrap: "balance",
              }}
            >
              {view.name}
            </motion.h2>

            {view.headline && (
              <motion.p
                {...rise(0.12)}
                className="mt-7 max-w-[26ch] text-[1.6rem] leading-[1.2] sm:text-[2rem]"
                style={{
                  fontFamily: SERIF_FONT,
                  fontStyle: "italic",
                  color: SEPIA,
                  letterSpacing: "-0.01em",
                  textWrap: "balance",
                }}
              >
                {view.headline}
              </motion.p>
            )}

            {view.paragraphs.length > 0 && (
              <motion.div
                {...rise(0.2)}
                className="mt-12 max-w-[62ch] border-t pt-8"
                style={{ borderColor: RULE }}
              >
                <p
                  className="text-[17px] leading-[1.75] sm:text-[18px]"
                  style={{ fontFamily: TEXT_FONT, color: INK }}
                >
                  <span
                    aria-hidden
                    className="float-left mr-3 mt-1 select-none"
                    style={{
                      fontFamily: SERIF_FONT,
                      fontSize: "5.2rem",
                      lineHeight: 0.78,
                      color: BLOOD,
                    }}
                  >
                    {dropCap}
                  </span>
                  <span className="sr-only">{dropCap}</span>
                  {firstRest}
                </p>

                {restParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="mt-5 text-[17px] leading-[1.75] sm:text-[18px]"
                    style={{ fontFamily: TEXT_FONT, color: SEPIA }}
                  >
                    {paragraph}
                  </p>
                ))}
              </motion.div>
            )}
          </div>

          {/* --------------------------- right: record --------------------------- */}
          <motion.aside
            {...rise(0.15)}
            aria-label="Record details"
            className="relative self-start"
          >
            <div
              className="relative rounded-[22px] p-7 pt-9 sm:p-9 sm:pt-11"
              style={{
                background: `linear-gradient(180deg, ${PAPER_DEEP}, ${PAPER_DARK})`,
                border: `1px solid ${KRAFT}`,
                boxShadow: `0 1px 0 ${GLOW}b3 inset, 0 30px 60px -30px ${SHADOW}73`,
              }}
            >
              {/* punched tab */}
              <span
                aria-hidden
                className="absolute left-1/2 top-3 h-1.5 w-12 -translate-x-1/2 rounded-full"
                style={{
                  background: PAPER,
                  boxShadow: `inset 0 1px 2px ${SHADOW}59`,
                }}
              />

              <div className="flex items-baseline justify-between">
                <Label color={SEPIA}>Specimen sheet</Label>
                <Label>Rev. 01</Label>
              </div>

              <div
                className="mt-4 divide-y"
                style={{ borderColor: HAIRLINE }}
              >
                {ledger.map((row) => (
                  <div
                    key={row.label}
                    style={{ borderColor: HAIRLINE_SOFT }}
                  >
                    <LedgerRow label={row.label} value={row.value} />
                  </div>
                ))}
              </div>

              <div
                className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-6"
                style={{ borderColor: RULE }}
              >
                <p
                  className="max-w-[20ch] text-[15px] leading-snug"
                  style={{ fontFamily: SERIF_FONT, color: SEPIA }}
                >
                  Filed under: work with a face.
                </p>

                {view.resumeUrl && (
                  <a
                    href={view.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full px-5 py-3 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      fontFamily: TEXT_FONT,
                      background: INK,
                      color: PAPER,
                      outlineColor: BLOOD,
                    }}
                  >
                    View résumé
                  </a>
                )}
              </div>
            </div>

            {/* stamp */}
            <motion.div
              aria-hidden={false}
              className="pointer-events-none absolute -right-3 -top-12 sm:-right-6 sm:-top-14"
              style={{ rotate: reduceMotion ? -8 : stampRotate }}
            >
              <Stamp id={stampId} />
            </motion.div>
          </motion.aside>
        </div>

        {/* -------------------------------- footer -------------------------------- */}
        <motion.div
          {...rise(0.1)}
          className="mt-20 flex items-center justify-between border-t pt-4 lg:mt-28"
          style={{ borderColor: RULE }}
        >
          <Label>Field record</Label>
          <Label>Personality over preset</Label>
        </motion.div>
      </div>
    </section>
  );
}