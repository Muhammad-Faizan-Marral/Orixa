"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

import type { ThemeSectionProps } from "@/themes/types";

/* ============================================================================
   HERO — "Designer" (orange circle · big name · stats left/right · pill CTAs)

   Responsive strategy
   - < lg  : simple vertical stack  (badge → heading → portrait → stats → CTA)
             the orange circle is clipped inside the portrait box, so it can
             never run under the content below it.
   - ≥ lg  : the original composed layout (absolute side blocks, portrait
             overlapping the role line, CTA pill over the circle).
   ========================================================================== */

const DEFAULT_ACCENT = "#FF4A17";
const INK = "#1c1c1c";
const MUTED = "#5f5f5f";

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";

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

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
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

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/* -------------------------------------------------------------------------- */
/* SMALL SVGS                                                                 */
/* -------------------------------------------------------------------------- */

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M0 24V13.6C0 6.1 4.3 1.3 11.5 0l1.4 3.4C9 4.7 7.2 7 7 10h5.3v14H0Zm18.7 0V13.6C18.7 6.1 23 1.3 30.2 0l1.4 3.4c-3.9 1.3-5.7 3.6-5.9 6.6H31v14H18.7Z" />
    </svg>
  );
}

function Stars({ color }: { color: string }) {
  return (
    <div className="flex gap-1" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill={color}>
          <path d="m10 1.5 2.5 5.6 6 .6-4.5 4 1.3 6-5.3-3.1-5.3 3.1 1.3-6-4.5-4 6-.6L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 14 14 6M7 6h7v7" />
    </svg>
  );
}

function CurvedArrow({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 70 70" className="h-14 w-14" fill="none" aria-hidden>
      <path
        d="M8 4c-2 22 6 42 40 50"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="m38 44 12 10-15 5"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Sparks({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      className="absolute -right-6 -top-4 h-7 w-7"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 22 12 12M15 24l4-9M20 14l5-5" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function HeroDesigner({ config, profile }: ThemeSectionProps) {
  const reduce = useReducedMotion();

  const view = useMemo(() => {
    const projects = Array.isArray(config.projects) ? config.projects : [];
    const experience = Array.isArray(config.experience)
      ? config.experience
      : [];
    const skills = Array.isArray(config.skills) ? config.skills : [];

    const fullName =
      clean(config.name) ??
      clean(profile.fullName) ??
      clean(profile.username) ??
      "Your Name";

    const currentRole =
      clean(experience.find((e) => e.current)?.role) ??
      clean(experience[0]?.role);

    const headline = clean(config.headline);
    const about = clean(config.about);
    const years = yearsOfExperience(experience);

    const leftStat =
      projects.length > 0
        ? { value: `${projects.length}+`, label: "Projects Delivered" }
        : skills.length > 0
          ? { value: `${skills.length}+`, label: "Skills" }
          : null;

    const certCount = Array.isArray(config.certificates)
      ? config.certificates.length
      : 0;
    const rightStat =
      years > 0
        ? { value: `${years} Years`, label: "Experience" }
        : certCount > 0
          ? { value: `${certCount}+`, label: "Certificates" }
          : null;

    const title = currentRole ?? headline ?? "Portfolio";

    return {
      fullName,
      firstName: fullName.split(/\s+/)[0],
      title,
      longTitle: title.length > 18,
      quote: about ?? (currentRole ? headline : null),
      avatarUrl: clean(config.avatarUrl),
      accent: DEFAULT_ACCENT,
      leftStat,
      rightStat,
      portfolioHref:
        projects.length > 0 ? "#projects" : cleanUrl(config.resumeUrl),
      hireHref:
        cleanUrl(config.linkedinUrl) ??
        (clean(config.phone) ? `tel:${clean(config.phone)}` : "#contact"),
    };
  }, [config, profile]);

  const { accent } = view;

  const rise = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
      };

  const grow = reduce
    ? {}
    : {
        initial: { scale: 0.7, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
      };

  const headingSize = view.longTitle
    ? "clamp(2rem, 6vw, 4rem)"
    : "clamp(2.4rem, 8vw, 5.25rem)";

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-white px-5 pt-10 sm:px-8 sm:pt-24 lg:px-10 lg:pb-0 lg:pt-26"
      style={{ color: INK, fontFamily: TEXT_FONT }}
    >
      <div className="relative mx-auto flex max-w-[1140px] flex-col items-center lg:block lg:h-[660px] xl:h-[700px]">
        {/* ── Heading ─────────────────────────────────────────────── */}
        <div className="relative z-0 flex w-full flex-col items-center text-center lg:absolute lg:inset-x-0 lg:top-0">
          <div className="relative">
            <span
              className="inline-block rounded-full border-2 px-4 py-1 text-sm font-medium"
              style={{ borderColor: INK }}
            >
              Hello!
            </span>
            <Sparks color={accent} />
          </div>

          <h1
            className="mt-4 max-w-full break-words font-bold leading-[1.05] tracking-tight"
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: headingSize,
              textWrap: "balance",
            }}
          >
            <span className="block">
              I&apos;m <span style={{ color: accent }}>{view.firstName},</span>
            </span>
            <span className="block">{view.title}</span>
          </h1>
        </div>

        {/* ── Portrait + orange circle ────────────────────────────── */}
        <div className="relative z-10 mt-6 h-[320px] w-full max-w-[420px] overflow-hidden sm:h-[400px] sm:max-w-[480px] lg:absolute lg:bottom-0 lg:left-1/2 lg:mt-0 lg:h-[540px] lg:w-[480px] lg:max-w-none lg:-translate-x-1/2 lg:overflow-visible xl:h-[580px] xl:w-[540px]">
          <motion.div
            {...grow}
            className="absolute bottom-[-38%] left-1/2 aspect-square w-[96%] -translate-x-1/2 rounded-full lg:bottom-[-36%] lg:w-[104%]"
            style={{ backgroundColor: accent }}
            aria-hidden
          />

          <motion.div
            {...rise}
            className="absolute inset-0 flex items-end justify-center"
          >
            {view.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={view.avatarUrl}
                alt={view.fullName}
                className="h-full w-auto max-w-full object-contain object-bottom"
                draggable={false}
              />
            ) : (
              <div
                className="mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-white text-5xl font-bold sm:h-48 sm:w-48 sm:text-6xl lg:mb-24"
                style={{ color: accent, fontFamily: DISPLAY_FONT }}
              >
                {initials(view.fullName)}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Quote + stats ───────────────────────────────────────── */}
        <div className="relative z-20 mx-auto mt-8 grid w-full max-w-[520px] grid-cols-2 gap-x-6 gap-y-6 lg:contents">
          {/* left cluster: quote + projects stat */}
          <div className="contents lg:absolute lg:left-0 lg:top-[240px] lg:block lg:w-[230px] xl:w-[280px]">
            {view.quote && (
              <div className="col-span-2 text-center lg:text-left">
                <QuoteIcon className="mx-auto h-6 w-6 lg:mx-0" />
                <p
                  className="mt-3 text-[15px] font-medium leading-snug"
                  style={{ color: MUTED }}
                >
                  {truncate(view.quote, 120)}
                </p>
              </div>
            )}

            {view.leftStat && (
              <div className="text-left lg:mt-8">
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: DISPLAY_FONT }}
                >
                  {view.leftStat.value}
                </div>
                <div className="text-sm" style={{ color: MUTED }}>
                  {view.leftStat.label}
                </div>
              </div>
            )}
          </div>

          {/* right stat */}
          {view.rightStat && (
            <div
              className={`flex flex-col items-end text-right lg:absolute lg:right-0 lg:top-[240px] ${
                view.leftStat
                  ? ""
                  : "col-span-2 items-center text-center lg:items-end lg:text-right"
              }`}
            >
              <Stars color={accent} />
              <div
                className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                {view.rightStat.value}
              </div>
              <div
                className="mt-1 w-[150px] border-b-2 pb-3 text-lg font-medium sm:w-[170px] sm:text-xl"
                style={{ borderColor: INK }}
              >
                {view.rightStat.label}
              </div>
            </div>
          )}
        </div>

        {/* ── CTAs ────────────────────────────────────────────────── */}
        <div className="relative z-20 mx-auto mt-8 flex items-end gap-2 pb-2 lg:absolute lg:bottom-9 lg:left-1/2 lg:mt-0 lg:-translate-x-1/2 lg:pb-0">
          <span className="mb-6 hidden lg:block">
            <CurvedArrow color={INK} />
          </span>

          <div className="flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            {view.portfolioHref && (
              <a
                href={view.portfolioHref}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-3 text-base font-semibold text-white transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-6"
                style={{ backgroundColor: accent, outlineColor: INK }}
              >
                Portfolio
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            <a
              href={view.hireHref}
              className="inline-flex items-center whitespace-nowrap rounded-full border-2 bg-white px-5 py-[10px] text-base font-semibold transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-6"
              style={{ borderColor: INK, outlineColor: accent }}
            >
              Hire Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
