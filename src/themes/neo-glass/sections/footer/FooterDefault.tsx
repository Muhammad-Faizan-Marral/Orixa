"use client";

import React, { useMemo } from "react";

import { motion, useReducedMotion } from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ============================================================================
   FOOTER — dark band · "Let's Connect there" + Hire me · brand blurb ·
   Navigation / Contact columns · social icons · copyright + back to top.
   ========================================================================== */

const DEFAULT_ACCENT = "#FF4A17";
const BAND = "#1f1f1f";
const EASE = [0.22, 1, 0.36, 1] as const;

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";

type NavLink = { label: string; id: string };

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function clean(value: unknown) {
  if (typeof value !== "string") return null;
  const result = value.trim();
  return result.length ? result : null;
}

function cleanUrl(value: unknown) {
  const result = clean(value);
  if (!result) return null;
  if (/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(result)) return result;
  return `https://${result}`;
}

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "P"
  );
}

function buildNav(config: ThemeSectionProps["config"]): NavLink[] {
  const has = (v: unknown[] | undefined) => Array.isArray(v) && v.length > 0;
  const links: NavLink[] = [{ label: "Home", id: "home" }];
  if (clean(config?.about) || clean(config?.headline))
    links.push({ label: "About", id: "about" });
  if (has(config?.skills)) links.push({ label: "Skills", id: "skills" });
  if (has(config?.projects)) links.push({ label: "Projects", id: "projects" });
  if (has(config?.experience))
    links.push({ label: "Experience", id: "experience" });
  if (has(config?.education))
    links.push({ label: "Education", id: "education" });
  if (has(config?.certificates))
    links.push({ label: "Certificates", id: "certificates" });
  links.push({ label: "Contact", id: "contact" });
  return links;
}

function SocialIcon({ kind }: { kind: "linkedin" | "github" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {kind === "linkedin" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 11v5M8 8v.01M12 16v-5m0 2.5c0-1.5 1-2.5 2.5-2.5S17 12 17 13.5V16" />
        </>
      ) : (
        <path d="M9 19c-4 1.5-4-2-6-2.5m12 4.5v-3.2a2.8 2.8 0 0 0-.8-2.2c2.7-.3 5.5-1.3 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.3 1.3a11.4 11.4 0 0 0-6 0C6.7 2.7 5.7 3 5.7 3a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.3 9.5c0 4.7 2.8 5.7 5.5 6a2.8 2.8 0 0 0-.8 2.2V21" />
      )}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function FooterDefault({ config, profile }: ThemeSectionProps) {
  const reduceMotion = !!useReducedMotion();

  const displayName =
    config?.name?.trim() || profile?.username?.trim() || "Portfolio";

  const accent =
    clean(config?.designPreferences?.accentColor) ?? DEFAULT_ACCENT;
  const currentYear = new Date().getFullYear();

  const nav = useMemo(() => buildNav(config), [config]);
  const blurb = clean(config?.headline) ?? clean(config?.about);

  const phone = clean(config?.phone);
  const location = clean(config?.location);
  const resume = cleanUrl(config?.resumeUrl);
  const linkedin = cleanUrl(config?.linkedinUrl);
  const github = cleanUrl(config?.githubUrl);

  const contactItems = [
    phone && { label: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` },
    location && { label: location, href: null as string | null },
    resume && { label: "Download resume", href: resume },
  ].filter(Boolean) as { label: string; href: string | null }[];

  const socials = [
    linkedin && {
      kind: "linkedin" as const,
      label: "LinkedIn",
      href: linkedin,
    },
    github && { kind: "github" as const, label: "GitHub", href: github },
  ].filter(Boolean) as {
    kind: "linkedin" | "github";
    label: string;
    href: string;
  }[];

  const rise = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  const goTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof document === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    try {
      window.history.replaceState(null, "", `#${id}`);
    } catch {
      /* ignore */
    }
  };

  const toTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const linkCls =
    "text-[15px] text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

  return (
    <footer
      aria-label="Footer"
      className="w-full px-5 pt-16 sm:px-8 lg:pt-20"
      style={{ backgroundColor: BAND, color: "#fff", fontFamily: TEXT_FONT }}
    >
      <div className="mx-auto max-w-[1140px]">
        {/* top row */}
        <motion.div
          {...rise(0)}
          className="flex flex-wrap items-center justify-between gap-5 border-b border-white/15 pb-8"
        >
          <h2
            className="font-bold tracking-tight"
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: "clamp(1.7rem, 3.2vw, 2.3rem)",
            }}
          >
            Let&apos;s Connect there
          </h2>
          <a
            href="#contact"
            onClick={goTo("contact")}
            className="inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-base font-semibold text-white transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{ backgroundColor: accent }}
          >
            Hire me
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M6 14 14 6M7 6h7v7" />
            </svg>
          </a>
        </motion.div>

        {/* columns */}
        <motion.div
          {...rise(0.08)}
          className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]"
        >
          {/* brand */}
          <div>
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: accent, fontFamily: DISPLAY_FONT }}
              >
                {initialsOf(displayName)}
              </span>
              <span
                className="max-w-[220px] truncate text-xl font-semibold"
                style={{ fontFamily: DISPLAY_FONT }}
                title={displayName}
              >
                {displayName}
              </span>
            </div>

            {blurb && (
              <p className="mt-5 line-clamp-4 max-w-[380px] text-[15px] leading-relaxed text-white/65">
                {blurb}
              </p>
            )}

            {socials.length > 0 && (
              <ul className="mt-6 flex gap-3">
                {socials.map((s) => (
                  <li key={s.kind}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-[#1f1f1f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <SocialIcon kind={s.kind} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* navigation */}
          <nav aria-label="Footer navigation">
            <h3 className="text-base font-semibold" style={{ color: accent }}>
              Navigation
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {nav.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={goTo(l.id)} className={linkCls}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact */}
          {contactItems.length > 0 && (
            <div>
              <h3 className="text-base font-semibold" style={{ color: accent }}>
                Contact
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {contactItems.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("tel:") ? undefined : "_blank"
                        }
                        rel={
                          item.href.startsWith("tel:")
                            ? undefined
                            : "noopener noreferrer"
                        }
                        className={linkCls}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span className="text-[15px] text-white/70">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 py-6 text-sm text-white/60">
          <p>
            Copyright © {currentYear}{" "}
            <span style={{ color: accent }}>{displayName}</span>. All Rights
            Reserved.
          </p>
          <button
            type="button"
            onClick={toTop}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Back to top
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M10 16V4m-5 5 5-5 5 5" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default FooterDefault;
