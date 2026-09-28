"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ==========================================================================
   NAVIGATION LOGIC
   ========================================================================== */

type NavItem = {
  id: string;
  label: string;
};

const SECTION_LABELS: Record<string, string> = {
  about: "About",
  skills: "Skills",
  projects: "Projects",
  experience: "Experience",
  education: "Education",
  certificates: "Certificates",
  contact: "Contact",
};

const SECTION_ORDER = [
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "certificates",
  "contact",
] as const;

function hasItems(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

function getNavigation(config: ThemeSectionProps["config"]): NavItem[] {
  const componentSelection = (
    config as ThemeSectionProps["config"] & {
      componentSelection?: Record<
        string,
        {
          enabled?: boolean;
          variant?: string;
        }
      >;
    }
  ).componentSelection;

  return SECTION_ORDER.filter((section) => {
    const selection = componentSelection?.[section];

    if (selection?.enabled === false) {
      return false;
    }

    switch (section) {
      case "about":
        return Boolean(config.about?.trim());

      case "skills":
        return hasItems(config.skills);

      case "projects":
        return hasItems(config.projects);

      case "experience":
        return hasItems(config.experience);

      case "education":
        return hasItems(config.education);

      case "certificates":
        return hasItems(config.certificates);

      case "contact":
        return Boolean(
          config.phone ||
          config.linkedinUrl ||
          config.githubUrl ||
          config.resumeUrl,
        );

      default:
        return false;
    }
  }).map((id) => ({
    id,
    label: SECTION_LABELS[id],
  }));
}

function getInitials(value: string): string {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (!words.length) {
    return "";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

/* ==========================================================================
   DESIGN TOKENS
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1] as const;

const CUT = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)";

const CUT_SM =
  "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)";

/* ==========================================================================
   ICONS
   ========================================================================== */

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width="12"
      height="12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 10L10 2M10 2H4.5M10 2V7.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ==========================================================================
   RESUME BUTTON
   ========================================================================== */

function ResumeButton({
  href,
  compact = false,
  onClick,
}: {
  href: string;
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      style={{
        clipPath: compact ? CUT_SM : CUT,
      }}
      className="group relative inline-flex bg-gradient-to-br from-blue-300/70 via-blue-500/40 to-blue-600/70 p-px outline-none transition-shadow duration-500 hover:shadow-[0_0_36px_-6px_rgba(59,130,246,0.7)] focus-visible:ring-2 focus-visible:ring-blue-300"
    >
      <span
        style={{
          clipPath: compact ? CUT_SM : CUT,
        }}
        className={`relative flex items-center gap-3 overflow-hidden bg-[#070B14] font-[var(--font-inter)] font-medium text-white ${
          compact ? "min-h-9 px-4 text-[13px]" : "min-h-12 px-6 text-sm"
        }`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-blue-300/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[320%]"
        />

        <span className="relative">Resume</span>

        <ArrowIcon className="relative text-blue-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

/* ==========================================================================
   NAVBAR
   ========================================================================== */

export function NavbarDefault({ config, profile }: ThemeSectionProps) {
  const reduced = Boolean(useReducedMotion());

  const [activeId, setActiveId] = useState<string>("hero");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /*
   * These refs are event/runtime state only.
   *
   * IMPORTANT:
   * We never mutate them during render.
   */
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  const name =
    config.name?.trim() ||
    profile.fullName?.trim() ||
    profile.username?.trim() ||
    "Portfolio";

  const links = useMemo(() => getNavigation(config), [config]);

  const hasResume = Boolean(config.resumeUrl);

  const initials = useMemo(() => getInitials(name), [name]);

  /* ==========================================================================
     READING PROGRESS
     ========================================================================== */

  const { scrollYProgress } = useScroll();

  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });

  /* ==========================================================================
     SCROLL SYSTEM
     ========================================================================== */

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    lastScrollYRef.current = window.scrollY;

    const updateScrollState = () => {
      tickingRef.current = false;

      const currentY = window.scrollY;
      const previousY = lastScrollYRef.current;

      const delta = currentY - previousY;

      /*
       * Navbar floating state.
       */
      const nextScrolled = currentY > 24;

      setScrolled((previous) =>
        previous === nextScrolled ? previous : nextScrolled,
      );

      /*
       * Hide navbar only after meaningful downward scrolling.
       *
       * Small movements are ignored to prevent jitter.
       */
      if (currentY <= 80) {
        setHidden(false);
      } else if (delta > 6 && currentY > 480) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }

      lastScrollYRef.current = currentY;

      /*
       * Scroll spy.
       *
       * The marker sits below the fixed navbar so the section becomes
       * active when the user has actually entered that section.
       */
      const marker = Math.max(96, window.innerHeight * 0.28);

      let currentSection = "hero";

      for (const link of links) {
        const element = document.getElementById(link.id);

        if (!element) {
          continue;
        }

        const rect = element.getBoundingClientRect();

        if (rect.top <= marker) {
          currentSection = link.id;
        }
      }

      setActiveId((previous) =>
        previous === currentSection ? previous : currentSection,
      );
    };

    const requestUpdate = () => {
      if (tickingRef.current) {
        return;
      }

      tickingRef.current = true;

      window.requestAnimationFrame(updateScrollState);
    };

    /*
     * Initial calculation.
     */
    updateScrollState();

    window.addEventListener("scroll", requestUpdate, {
      passive: true,
    });

    window.addEventListener("resize", requestUpdate, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", requestUpdate);

      window.removeEventListener("resize", requestUpdate);

      tickingRef.current = false;
    };
  }, [links]);

  /* ==========================================================================
     MOBILE MENU
     ========================================================================== */

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  /* ==========================================================================
     SMOOTH SECTION NAVIGATION
     ========================================================================== */

  const goTo = useCallback(
    (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();

      setMobileOpen(false);

      /*
       * HERO
       */
      if (id === "hero") {
        window.scrollTo({
          top: 0,
          behavior: reduced ? "auto" : "smooth",
        });

        window.history.replaceState(null, "", window.location.pathname);

        return;
      }

      const element = document.getElementById(id);

      if (!element) {
        return;
      }

      /*
       * Fixed navbar compensation.
       *
       * This avoids scrollIntoView() placing the section underneath
       * the fixed navbar.
       */
      const navbarOffset = 92;

      const elementTop = element.getBoundingClientRect().top + window.scrollY;

      const targetY = Math.max(0, elementTop - navbarOffset);

      window.scrollTo({
        top: targetY,
        behavior: reduced ? "auto" : "smooth",
      });

      window.history.replaceState(null, "", `#${id}`);
    },
    [reduced],
  );

  /* ==========================================================================
     NAVBAR VISIBILITY
     ========================================================================== */

  const showBar = !hidden || mobileOpen;

  /* ==========================================================================
     RENDER
     ========================================================================== */

  return (
    <>
      {/* ======================================================================
         DESKTOP / MAIN NAVBAR
         ====================================================================== */}

      <motion.header
        initial={{
          y: reduced ? 0 : -24,
          opacity: reduced ? 1 : 0,
        }}
        animate={{
          y: showBar ? 0 : "-120%",
          opacity: 1,
        }}
        transition={
          reduced
            ? {
                duration: 0,
              }
            : {
                duration: 0.52,
                ease: EASE,
              }
        }
        className="fixed inset-x-0 top-0 z-50 will-change-transform"
      >
        <div
          className={`mx-auto transition-[max-width,margin,padding] duration-500 ease-out ${
            scrolled
              ? "mt-3 max-w-[1180px] px-3 sm:px-5"
              : "mt-0 max-w-[1480px] px-0"
          }`}
        >
          {/* Gradient edge wrapper */}

          <div
            style={{
              clipPath: scrolled ? CUT : undefined,
            }}
            className={`relative transition-all duration-500 ${
              scrolled
                ? "bg-gradient-to-b from-blue-300/35 via-white/[0.07] to-blue-500/25 p-px"
                : "bg-transparent p-0"
            }`}
          >
            <nav
              aria-label="Primary"
              style={{
                clipPath: scrolled ? CUT : undefined,
              }}
              className={`relative flex items-center justify-between gap-4 transition-all duration-500 ${
                scrolled
                  ? "h-14 bg-[#05080F]/80 px-4 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:px-5"
                  : "h-16 border-b border-white/[0.07] bg-transparent px-5 sm:px-8 lg:px-12 xl:px-16"
              }`}
            >
              {/* ==============================================================
                 IDENTITY
                 ============================================================== */}

              <a
                href="#"
                onClick={goTo("hero")}
                aria-label={`${name} — back to top`}
                className="group flex min-w-0 items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
              >
                <span
                  aria-hidden="true"
                  style={{
                    clipPath: CUT_SM,
                  }}
                  className="relative flex h-8 w-8 shrink-0 items-center justify-center border border-blue-400/30 bg-blue-500/[0.07] transition-colors duration-300 group-hover:bg-blue-500/[0.16]"
                >
                  <span className="font-[var(--font-bricolage)] text-[11px] font-semibold tracking-[-0.02em] text-blue-100">
                    {initials}
                  </span>
                </span>

                <span className="truncate font-[var(--font-inter)] text-[13px] font-medium text-white/80 transition-colors duration-300 group-hover:text-white">
                  {name}
                </span>
              </a>

              {/* ==============================================================
                 DESKTOP LINKS
                 ============================================================== */}

              {links.length > 0 && (
                <ul className="hidden items-center gap-1 lg:flex">
                  {links.map((link) => {
                    const active = activeId === link.id;

                    return (
                      <li key={link.id} className="relative">
                        <a
                          href={`#${link.id}`}
                          onClick={goTo(link.id)}
                          aria-current={active ? "location" : undefined}
                          className={`relative flex h-9 items-center rounded-sm px-3.5 font-[var(--font-inter)] text-[13px] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-blue-400/70 ${
                            active
                              ? "text-white"
                              : "text-white/45 hover:text-white/85"
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="nav-active"
                              aria-hidden="true"
                              transition={
                                reduced
                                  ? {
                                      duration: 0,
                                    }
                                  : {
                                      type: "spring",
                                      stiffness: 380,
                                      damping: 32,
                                      mass: 0.7,
                                    }
                              }
                              className="absolute inset-0 rounded-sm bg-blue-500/[0.09]"
                            >
                              <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_2px_rgba(59,130,246,0.7)]" />
                            </motion.span>
                          )}

                          <span className="relative">{link.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* ==============================================================
                 RIGHT CLUSTER
                 ============================================================== */}

              <div className="flex items-center gap-3">
                {hasResume && (
                  <div className="hidden sm:block">
                    <ResumeButton href={config.resumeUrl as string} compact />
                  </div>
                )}

                {links.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMobileOpen((value) => !value)}
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-nav"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    className="relative flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 bg-white/[0.03] outline-none transition-colors hover:border-blue-400/40 focus-visible:ring-2 focus-visible:ring-blue-400/70 lg:hidden"
                  >
                    <span className="relative block h-3 w-5">
                      <span
                        className={`absolute left-0 h-px w-5 bg-white transition-all duration-300 ${
                          mobileOpen ? "top-1.5 rotate-45" : "top-0"
                        }`}
                      />

                      <span
                        className={`absolute left-0 h-px bg-white transition-all duration-300 ${
                          mobileOpen ? "top-1.5 w-5 -rotate-45" : "top-3 w-3"
                        }`}
                      />
                    </span>
                  </button>
                )}
              </div>

              {/* ==============================================================
                 READING PROGRESS
                 ============================================================== */}

              <motion.span
                aria-hidden="true"
                style={{
                  scaleX: reduced ? 0 : progress,
                }}
                className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-blue-500/0 via-blue-400 to-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
              />
            </nav>
          </div>
        </div>
      </motion.header>

      {/* ======================================================================
         MOBILE OVERLAY
         ====================================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={
              reduced
                ? {
                    duration: 0,
                  }
                : {
                    duration: 0.3,
                    ease: EASE,
                  }
            }
            className="fixed inset-0 z-40 flex flex-col bg-[#04060B]/95 px-5 pb-8 pt-28 backdrop-blur-2xl sm:px-8 lg:hidden"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(600px circle at 85% 12%, rgba(37,99,235,0.22), transparent 60%)",
              }}
            />

            <ul className="relative flex flex-1 flex-col justify-center gap-1">
              {links.map((link, index) => {
                const active = activeId === link.id;

                return (
                  <motion.li
                    key={link.id}
                    initial={{
                      opacity: 0,
                      y: reduced ? 0 : 22,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    transition={
                      reduced
                        ? {
                            duration: 0,
                          }
                        : {
                            duration: 0.5,
                            delay: 0.06 + index * 0.045,
                            ease: EASE,
                          }
                    }
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={goTo(link.id)}
                      aria-current={active ? "location" : undefined}
                      className="group flex items-center gap-4 border-b border-white/[0.06] py-4 outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                          active
                            ? "bg-blue-400 shadow-[0_0_12px_3px_rgba(59,130,246,0.75)]"
                            : "bg-white/15 group-hover:bg-blue-400/60"
                        }`}
                      />

                      <span
                        className={`font-[var(--font-bricolage)] text-[clamp(1.9rem,8vw,2.75rem)] font-medium tracking-[-0.045em] transition-colors duration-300 ${
                          active
                            ? "text-white"
                            : "text-white/45 group-hover:text-white/85"
                        }`}
                      >
                        {link.label}
                      </span>
                    </a>
                  </motion.li>
                );
              })}
            </ul>

            {hasResume && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: reduced ? 0 : 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                }}
                transition={
                  reduced
                    ? {
                        duration: 0,
                      }
                    : {
                        duration: 0.5,
                        delay: 0.08 + links.length * 0.045,
                        ease: EASE,
                      }
                }
                className="relative pt-8"
              >
                <ResumeButton
                  href={config.resumeUrl as string}
                  onClick={() => setMobileOpen(false)}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NavbarDefault;
