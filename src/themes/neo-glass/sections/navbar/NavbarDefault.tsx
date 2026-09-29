"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ============================================================================
   NAVBAR — black floating pill · logo in the centre · scroll-spy · progress
   Section ids it links to: #home #about #skills #projects #experience
   #education #certificates #contact  (links only appear if the data exists)
   ========================================================================== */

const DEFAULT_ACCENT = "#FF4A17";
const PILL = "#1f1f1f";

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";

type NavLink = { label: string; href: string };

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

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "P"
  );
}

function getNavigation(config: ThemeSectionProps["config"]): NavLink[] {
  const has = (v: unknown[] | undefined) => Array.isArray(v) && v.length > 0;

  const links: NavLink[] = [{ label: "Home", href: "#home" }];
  if (clean(config.about) || clean(config.headline))
    links.push({ label: "About", href: "#about" });
  if (has(config.skills)) links.push({ label: "Skills", href: "#skills" });
  if (has(config.projects)) links.push({ label: "Projects", href: "#projects" });
  if (has(config.experience))
    links.push({ label: "Experience", href: "#experience" });
  if (has(config.education))
    links.push({ label: "Education", href: "#education" });
  if (has(config.certificates))
    links.push({ label: "Certificates", href: "#certificates" });
  links.push({ label: "Contact", href: "#contact" });
  return links;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function NavbarDefault({ config, profile }: ThemeSectionProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  const name =
    config.name?.trim() ||
    profile?.fullName?.trim() ||
    profile?.username?.trim() ||
    "Portfolio";

  const accent = clean(config.designPreferences?.accentColor) ?? DEFAULT_ACCENT;

  const links = useMemo(() => getNavigation(config), [config]);
  const resumeUrl = cleanUrl(config.resumeUrl);
  const initials = useMemo(() => getInitials(name), [name]);
  const brand = name.split(/\s+/)[0];

  /* Split links around the centred logo */
  const mid = Math.ceil(links.length / 2);
  const left = links.slice(0, mid);
  const right = links.slice(mid);

  /* Scroll progress line inside the pill */
  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });
  const progress = reduce ? scrollYProgress : spring;

  /* Scroll-spy */
  useEffect(() => {
    const els = links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) setActive(`#${best.target.id}`);
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [links]);

  const go = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      setOpen(false);
      const target = document.getElementById(href.slice(1));
      if (!target) return; // let the browser handle it
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      setActive(href);
    },
    [reduce],
  );

  const linkEl = (l: NavLink) => {
    const on = active === l.href;
    return (
      <li key={l.href}>
        <a
          href={l.href}
          onClick={(e) => go(e, l.href)}
          aria-current={on ? "true" : undefined}
          className="rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            color: on ? accent : "rgba(255,255,255,.78)",
            outlineColor: accent,
          }}
        >
          {l.label}
        </a>
      </li>
    );
  };

  return (
    <header
      className="absolute top-0 z-50 px-4 pt-4 sm:px-6 w-full"
      style={{ fontFamily: TEXT_FONT }}
    >
      <nav
        aria-label="Primary"
        className="relative mx-auto max-w-[1140px]"
      >
        <div
          className="relative overflow-hidden rounded-full px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)] sm:px-6"
          style={{ backgroundColor: PILL }}
        >
          <div className="flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
            {/* left links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {left.map(linkEl)}
            </ul>

            {/* logo */}
            <a
              href="#home"
              onClick={(e) => go(e, "#home")}
              className="flex items-center gap-2.5 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ outlineColor: accent }}
              aria-label={`${name} — home`}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: accent, fontFamily: DISPLAY_FONT }}
              >
                {initials}
              </span>
              <span
                className="max-w-[140px] truncate text-lg font-semibold text-white"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                {brand}
              </span>
            </a>

            {/* right links */}
            <ul className="hidden items-center justify-end gap-1 lg:flex">
              {right.map(linkEl)}
              {resumeUrl && (
                <li>
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ backgroundColor: accent, outlineColor: "#fff" }}
                  >
                    Resume
                  </a>
                </li>
              )}
            </ul>

            {/* mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 lg:hidden"
              style={{ outlineColor: accent }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                {open ? (
                  <path d="M6 6l12 12M18 6 6 18" />
                ) : (
                  <path d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>

          <motion.span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[2px] origin-left"
            style={{ scaleX: progress, backgroundColor: accent }}
          />
        </div>

        {/* mobile panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full mt-2 rounded-3xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.2)] lg:hidden"
              style={{ backgroundColor: PILL }}
            >
              <ul className="flex flex-col">
                {links.map((l) => {
                  const on = active === l.href;
                  return (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        onClick={(e) => go(e, l.href)}
                        className="block rounded-2xl px-4 py-3 text-base font-medium"
                        style={{
                          color: on ? accent : "rgba(255,255,255,.85)",
                        }}
                      >
                        {l.label}
                      </a>
                    </li>
                  );
                })}
                {resumeUrl && (
                  <li className="p-1 pt-2">
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-full px-4 py-3 text-center text-base font-semibold text-white"
                      style={{ backgroundColor: accent }}
                    >
                      Resume
                    </a>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

export default NavbarDefault;