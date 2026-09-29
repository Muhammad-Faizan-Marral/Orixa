"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

const PAPER = "#efe2c8";
const PAPER_DEEP = "#e5d3b0";
const KRAFT = "#c9a877";
const SEPIA = "#6d4d31";
const DUST = "#9a8060";
const INK = "#1b130c";
const BLOOD = "#a3271d";

const GLASS = "rgba(239,226,200,.82)";
const HAIRLINE = "rgba(109,77,49,.22)";
const SHADOW = "rgba(87,58,30,.35)";

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";
const SERIF_FONT =
  "var(--font-instrument), 'Iowan Old Style', 'Palatino Linotype', Georgia, serif";

const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

type NavLink = {
  id: string;
  label: string;
  href: string;
};

function getNavigation(config: ThemeSectionProps["config"]): NavLink[] {
  const projects = Array.isArray(config.projects) ? config.projects : [];
  const experience = Array.isArray(config.experience)
    ? config.experience
    : [];

  const links: NavLink[] = [{ id: "about", label: "About", href: "#about" }];

  if (projects.length > 0) {
    links.push({ id: "projects", label: "Work", href: "#projects" });
  }

  if (experience.length > 0) {
    links.push({
      id: "experience",
      label: "Experience",
      href: "#experience",
    });
  }

  return links;
}

function getInitials(name: string) {
  const parts = name
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "O";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function cleanUrl(value: string | null | undefined) {
  const result = typeof value === "string" ? value.trim() : "";
  if (!result) return null;
  if (/^(https?:\/\/|\/|#|mailto:)/i.test(result)) return result;
  return `https://${result}`;
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

export function NavbarDefault({ config, profile }: ThemeSectionProps) {
  const reduceMotion = useReducedMotion();

  const name =
    config.name?.trim() ||
    profile?.fullName?.trim() ||
    profile?.username?.trim() ||
    "Portfolio";

  const username =
    profile?.username?.trim() || config.name?.trim() || "Portfolio";

  const links = useMemo(() => getNavigation(config), [config]);

  const hasResume = Boolean(config.resumeUrl);
  const resumeUrl = cleanUrl(config.resumeUrl);

  const initials = useMemo(() => getInitials(name), [name]);

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>("home");

  /* ----------------------------- scroll progress ----------------------------- */

  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.3,
  });
  const progress = useTransform(smooth, (v) => Math.min(1, Math.max(0, v)));

  /* --------------------------- compact + auto-hide --------------------------- */

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);

      const delta = y - last;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 320);
        last = y;
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  /* ------------------------------ active section ----------------------------- */

  useEffect(() => {
    const elements = links
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));

    const onTop = () => {
      if (window.scrollY < 200) setActive("home");
    };
    window.addEventListener("scroll", onTop, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [links]);

  /* ---------------------------------- menu ---------------------------------- */

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      setOpen(false);
      if (!href.startsWith("#")) return;

      const target =
        href === "#" ? null : document.getElementById(href.slice(1));

      if (href === "#") {
        event.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: reduceMotion ? "auto" : "smooth",
        });
        return;
      }

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    },
    [reduceMotion],
  );

  /* --------------------------------- render --------------------------------- */

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-3 sm:px-6 sm:pt-4"
      initial={reduceMotion ? false : { y: -80, opacity: 0 }}
      animate={{
        y: hidden && !open ? -110 : 0,
        opacity: 1,
      }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="relative w-full max-w-[1080px]">
        <nav
          aria-label="Primary"
          className="relative flex items-center justify-between gap-3 overflow-hidden rounded-full pl-2 pr-2 transition-[padding,box-shadow] duration-500 sm:pl-2.5 sm:pr-2.5"
          style={{
            paddingTop: scrolled ? 6 : 9,
            paddingBottom: scrolled ? 6 : 9,
            background: GLASS,
            backdropFilter: "blur(16px) saturate(1.15)",
            WebkitBackdropFilter: "blur(16px) saturate(1.15)",
            border: `1px solid ${KRAFT}`,
            boxShadow: scrolled
              ? `0 1px 0 rgba(255,246,224,.7) inset, 0 18px 40px -18px ${SHADOW}`
              : `0 1px 0 rgba(255,246,224,.7) inset, 0 8px 24px -16px ${SHADOW}`,
          }}
        >
          {/* -------------------------------- brand -------------------------------- */}
          <a
            href="#"
            onClick={(e) => go(e, "#")}
            aria-label={`${name} — back to top`}
            className="group flex min-w-0 items-center gap-3 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: BLOOD }}
          >
            <span
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full text-[13px] font-semibold transition-transform duration-300 group-hover:-rotate-6"
              style={{
                background: INK,
                color: PAPER,
                fontFamily: DISPLAY_FONT,
                letterSpacing: "-0.03em",
                boxShadow: `0 0 0 3px ${PAPER_DEEP}`,
              }}
            >
              {initials}
              <span
                aria-hidden
                className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full"
                style={{
                  background: BLOOD,
                  boxShadow: `0 0 0 2px ${PAPER}`,
                }}
              />
            </span>

            <span className="hidden min-w-0 flex-col leading-none sm:flex">
              <span
                className="truncate text-[15px] font-semibold"
                style={{
                  fontFamily: DISPLAY_FONT,
                  color: INK,
                  letterSpacing: "-0.03em",
                }}
              >
                {name}
              </span>
              <span
                className="mt-1 truncate text-[11px]"
                style={{ fontFamily: TEXT_FONT, color: DUST }}
              >
                @{username}
              </span>
            </span>
          </a>

          {/* ------------------------------ desktop links ------------------------------ */}
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={(e) => go(e, link.href)}
                    aria-current={isActive ? "location" : undefined}
                    className="relative inline-flex items-center rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                    style={{
                      fontFamily: TEXT_FONT,
                      color: isActive ? INK : SEPIA,
                      outlineColor: BLOOD,
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: PAPER_DEEP,
                          boxShadow: `inset 0 0 0 1px ${KRAFT}`,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      {isActive && (
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: BLOOD }}
                        />
                      )}
                      {link.label}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* -------------------------------- actions -------------------------------- */}
          <div className="flex items-center gap-2">
            {hasResume && resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center rounded-full px-5 py-2.5 text-[14px] font-medium transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:inline-flex"
                style={{
                  fontFamily: TEXT_FONT,
                  background: INK,
                  color: PAPER,
                  outlineColor: BLOOD,
                }}
              >
                Résumé
              </a>
            )}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid h-10 w-10 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden"
              style={{
                background: PAPER_DEEP,
                boxShadow: `inset 0 0 0 1px ${KRAFT}`,
                outlineColor: BLOOD,
              }}
            >
              <span
                aria-hidden
                className="absolute h-px w-[18px] transition-transform duration-300"
                style={{
                  background: INK,
                  transform: open
                    ? "translateY(0) rotate(45deg)"
                    : "translateY(-3.5px)",
                }}
              />
              <span
                aria-hidden
                className="absolute h-px w-[18px] transition-transform duration-300"
                style={{
                  background: INK,
                  transform: open
                    ? "translateY(0) rotate(-45deg)"
                    : "translateY(3.5px)",
                }}
              />
            </button>
          </div>

          {/* ------------------------------ scroll progress ------------------------------ */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-6 right-6 h-px origin-left"
            style={{
              background: BLOOD,
              scaleX: reduceMotion ? 0 : progress,
              opacity: scrolled ? 0.85 : 0,
            }}
          />
        </nav>

        {/* --------------------------------- mobile sheet --------------------------------- */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav"
              key="sheet"
              className="absolute inset-x-0 top-[calc(100%+10px)] overflow-hidden rounded-[28px] md:hidden"
              initial={
                reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }
              }
              transition={{ duration: 0.35, ease: EASE }}
              style={{
                background: PAPER,
                border: `1px solid ${KRAFT}`,
                boxShadow: `0 30px 60px -24px ${SHADOW}`,
                transformOrigin: "top center",
              }}
            >
              <ul className="p-3">
                {links.map((link, index) => {
                  const isActive = active === link.id;
                  return (
                    <motion.li
                      key={link.id}
                      initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: EASE,
                        delay: 0.05 + index * 0.05,
                      }}
                    >
                      <a
                        href={link.href}
                        onClick={(e) => go(e, link.href)}
                        className="flex items-baseline justify-between rounded-2xl px-4 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                        style={{
                          background: isActive ? PAPER_DEEP : "transparent",
                          outlineColor: BLOOD,
                        }}
                      >
                        <span
                          className="text-[1.75rem] leading-none"
                          style={{
                            fontFamily: SERIF_FONT,
                            color: INK,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {link.label}
                        </span>
                        <span
                          className="text-[11px] font-medium tracking-[0.2em]"
                          style={{
                            fontFamily: TEXT_FONT,
                            color: isActive ? BLOOD : DUST,
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              {hasResume && resumeUrl && (
                <div
                  className="border-t p-3"
                  style={{ borderColor: HAIRLINE }}
                >
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-center rounded-full px-5 py-3.5 text-[15px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      fontFamily: TEXT_FONT,
                      background: INK,
                      color: PAPER,
                      outlineColor: BLOOD,
                    }}
                  >
                    View résumé
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

export default NavbarDefault;