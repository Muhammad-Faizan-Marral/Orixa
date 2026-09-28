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

/* ========================================================================== */
/* THEME                                                                      */
/* ========================================================================== */

const DISPLAY = "font-[family-name:var(--font-display)]";
const TEXT = "font-[family-name:var(--font-text)]";

const EASE = [0.22, 1, 0.36, 1] as const;

const BLUE = "#2230D2";
const INDIGO = "#161F9C";
const CREAM = "#F6F2E7";
const YELLOW = "#F4E9A9";

const CUT = "polygon(0 0, 94% 0, 100% 24%, 100% 100%, 6% 100%, 0 76%)";
const CUT_SM =
  "polygon(0 0, 92% 0, 100% 25%, 100% 100%, 8% 100%, 0 75%)";

/* ========================================================================== */
/* NAVIGATION LOGIC                                                           */
/* ========================================================================== */

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

function getNavigation(
  config: ThemeSectionProps["config"],
): NavItem[] {
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

/* ========================================================================== */
/* ICONS                                                                      */
/* ========================================================================== */

function ArrowIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={`h-3.5 w-3.5 ${className}`}
    >
      <path
        d="M2 12L12 2M4 2H12V10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

function MenuIcon({
  open,
}: {
  open: boolean;
}) {
  return (
    <span className="relative flex h-5 w-5 items-center justify-center">
      <motion.span
        animate={{
          rotate: open ? 45 : 0,
          y: open ? 0 : -4,
        }}
        transition={{
          duration: 0.35,
          ease: EASE,
        }}
        className="absolute h-px w-5 bg-current"
      />

      <motion.span
        animate={{
          rotate: open ? -45 : 0,
          y: open ? 0 : 4,
        }}
        transition={{
          duration: 0.35,
          ease: EASE,
        }}
        className="absolute h-px w-5 bg-current"
      />
    </span>
  );
}

/* ========================================================================== */
/* RESUME BUTTON                                                              */
/* ========================================================================== */

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
      className="group relative inline-flex bg-[#2230D2] p-px outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#2230D2]/40 focus-visible:ring-offset-2"
    >
      <span
        style={{
          clipPath: compact ? CUT_SM : CUT,
        }}
        className={[
          "relative flex items-center gap-3 overflow-hidden bg-[#F6F2E7]",
          DISPLAY,
          "font-normal text-[#161F9C]",
          compact
            ? "min-h-9 px-4 text-[13px]"
            : "min-h-11 px-5 text-sm",
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-[#F4E9A9]/60 transition-transform duration-700 ease-out group-hover:translate-x-[320%]"
        />

        <span className="relative">Resume</span>

        <ArrowIcon className="relative transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

/* ========================================================================== */
/* NAVBAR                                                                     */
/* ========================================================================== */

export function NavbarDefault({
  config,
  profile,
}: ThemeSectionProps) {
  const reduceMotion = useReducedMotion();

  const name =
    config.name?.trim() ||
    profile?.fullName?.trim() ||
    profile?.username?.trim() ||
    "Portfolio";

  const username =
    profile?.username?.trim() ||
    config.name?.trim() ||
    "Portfolio";

  const links = useMemo(
    () => getNavigation(config),
    [config],
  );

  const hasResume = Boolean(config.resumeUrl);

  const initials = useMemo(
    () => getInitials(name),
    [name],
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(
    links[0]?.id ?? "",
  );

  const { scrollY } = useScroll();

  const navProgress = useSpring(
    useTransform(
      scrollY,
      [0, 100],
      [0, 1],
    ),
    {
      stiffness: 120,
      damping: 26,
      mass: 0.6,
    },
  );

  const navScale = useTransform(
    navProgress,
    [0, 1],
    [1, 0.97],
  );

  const navRadius = useTransform(
    navProgress,
    [0, 1],
    [0, 24],
  );

  const navShadowOpacity = useTransform(
    navProgress,
    [0, 1],
    [0, 0.08],
  );

  const desktopPadding = useTransform(
    navProgress,
    [0, 1],
    [0, 1],
  );

  /* ------------------------------------------------------------------------ */
  /* Active Section Observer                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!links.length) {
      return;
    }

    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter(
        (element): element is HTMLElement =>
          Boolean(element),
      );

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top -
              b.boundingClientRect.top,
          );

        const current = visible[0];

        if (current?.target?.id) {
          setActiveSection(current.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0, 0.15, 0.4, 0.7],
      },
    );

    sections.forEach((section) =>
      observer.observe(section),
    );

    return () => observer.disconnect();
  }, [links]);

  /* ------------------------------------------------------------------------ */
  /* Navigation                                                               */
  /* ------------------------------------------------------------------------ */

  const scrollToSection = useCallback(
    (id: string) => {
      const target = document.getElementById(id);

      if (!target) {
        return;
      }

      setMenuOpen(false);
      setActiveSection(id);

      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        92;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [reduceMotion],
  );

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.removeProperty(
        "overflow",
      );

      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.removeProperty(
        "overflow",
      );
    };
  }, [menuOpen]);

  const activeIndex = Math.max(
    0,
    links.findIndex(
      (link) => link.id === activeSection,
    ),
  );

  const currentLabel =
    links[activeIndex]?.label ?? links[0]?.label ?? "Home";

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  if (!links.length && !hasResume) {
    return null;
  }

  return (
    <>
      {/* ================================================================== */}
      {/* DESKTOP / TABLET NAV                                               */}
      {/* ================================================================== */}

      <motion.header
        style={{
          scale: reduceMotion ? 1 : navScale,
        }}
        className="fixed left-1/2 top-4 z-[90] w-[calc(100%-2rem)] max-w-[1500px] -translate-x-1/2 sm:top-5"
      >
        <motion.div
          style={{
            borderRadius: reduceMotion ? 0 : navRadius,
            boxShadow: reduceMotion
              ? undefined
              : useMotionShadow(navShadowOpacity),
          }}
          className="relative hidden border border-[#161F9C]/15 bg-[#F6F2E7]/90 backdrop-blur-xl md:block"
        >
          {/* Top architectural line */}
          <motion.div
            style={{
              scaleX: useSpring(navProgress, {
                stiffness: 100,
                damping: 24,
              }),
            }}
            className="absolute left-0 right-0 top-0 h-px origin-left bg-[#2230D2]"
          />

          <div className="flex h-[68px] items-center px-3 lg:px-4">
            {/* ------------------------------------------------------------ */}
            {/* BRAND                                                         */}
            {/* ------------------------------------------------------------ */}

            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: reduceMotion
                    ? "auto"
                    : "smooth",
                })
              }
              className="group relative flex min-w-[205px] items-center gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#2230D2]/40"
            >
              {/* Logo mark */}
              <span
                style={{
                  clipPath: CUT_SM,
                }}
                className="relative flex h-10 w-10 shrink-0 items-center justify-center bg-[#2230D2] text-[#F6F2E7]"
              >
                <span
                  className={`${DISPLAY} text-sm tracking-[-0.04em]`}
                >
                  {initials || "P"}
                </span>

                <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#F4E9A9]" />
              </span>

              <span className="min-w-0">
                <span
                  className={`${DISPLAY} block truncate text-[17px] leading-none tracking-[-0.035em] text-[#161F9C]`}
                >
                  {name}
                </span>

                <span className="mt-1 block truncate text-[8px] uppercase tracking-[0.19em] text-[#161F9C]/40">
                  {username}
                </span>
              </span>
            </button>

            {/* ------------------------------------------------------------ */}
            {/* CURRENT SECTION                                               */}
            {/* ------------------------------------------------------------ */}

            <div className="hidden flex-1 items-center justify-center lg:flex">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F4E9A9]" />

                <span className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/40">
                  {String(activeIndex + 1).padStart(2, "0")}
                </span>

                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentLabel}
                    initial={{
                      opacity: 0,
                      y: 7,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -7,
                    }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.28,
                      ease: EASE,
                    }}
                    className={`${DISPLAY} text-sm tracking-[-0.02em] text-[#161F9C]`}
                  >
                    {currentLabel}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* LINKS                                                         */}
            {/* ------------------------------------------------------------ */}

            <nav
              aria-label="Primary navigation"
              className="mr-3 flex items-center"
            >
              {links.map((link, index) => {
                const active =
                  activeSection === link.id;

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() =>
                      scrollToSection(link.id)
                    }
                    className="group relative px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[#2230D2]/30 lg:px-3.5"
                  >
                    <span
                      className={[
                        "relative text-[9px] uppercase tracking-[0.16em] transition-colors duration-300",
                        active
                          ? "text-[#161F9C]"
                          : "text-[#161F9C]/45 group-hover:text-[#161F9C]",
                      ].join(" ")}
                    >
                      <span className="mr-1 hidden text-[8px] text-[#2230D2]/60 xl:inline">
                        {String(index + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      {link.label}
                    </span>

                    <motion.span
                      initial={false}
                      animate={{
                        scaleX: active ? 1 : 0,
                        opacity: active ? 1 : 0,
                      }}
                      transition={{
                        duration: 0.35,
                        ease: EASE,
                      }}
                      className="absolute bottom-1 left-3 right-3 h-px origin-left bg-[#2230D2]"
                    />

                    <motion.span
                      initial={false}
                      animate={{
                        opacity: active ? 1 : 0,
                        scale: active ? 1 : 0.5,
                      }}
                      className="absolute -right-0.5 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-[#F4E9A9]"
                    />
                  </button>
                );
              })}
            </nav>

            {/* ------------------------------------------------------------ */}
            {/* RESUME                                                        */}
            {/* ------------------------------------------------------------ */}

            {hasResume && config.resumeUrl && (
              <ResumeButton
                href={config.resumeUrl}
                compact
              />
            )}
          </div>

          {/* Scroll progress */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px overflow-hidden bg-[#161F9C]/[0.06]">
            <motion.div
              style={{
                scaleX: useSpring(
                  useTransform(
                    navProgress,
                    [0, 1],
                    [0, 0.85],
                  ),
                  {
                    stiffness: 100,
                    damping: 26,
                  },
                ),
              }}
              className="h-full origin-left bg-[#F4E9A9]"
            />
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* MOBILE NAV                                                        */}
        {/* ================================================================= */}

        <motion.div
          animate={{
            y: menuOpen ? 0 : 0,
          }}
          className="relative md:hidden"
        >
          <div className="flex h-[58px] items-center justify-between border border-[#161F9C]/15 bg-[#F6F2E7]/95 px-3 backdrop-blur-xl">
            {/* Brand */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);

                window.scrollTo({
                  top: 0,
                  behavior: reduceMotion
                    ? "auto"
                    : "smooth",
                });
              }}
              className="flex items-center gap-3"
            >
              <span
                style={{
                  clipPath: CUT_SM,
                }}
                className="flex h-9 w-9 items-center justify-center bg-[#2230D2] text-[#F6F2E7]"
              >
                <span
                  className={`${DISPLAY} text-xs tracking-[-0.04em]`}
                >
                  {initials || "P"}
                </span>
              </span>

              <span
                className={`${DISPLAY} max-w-[125px] truncate text-[16px] tracking-[-0.035em] text-[#161F9C]`}
              >
                {name}
              </span>
            </button>

            {/* Mobile status */}
            <div className="mr-auto ml-4 hidden items-center gap-2 min-[420px]:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F4E9A9]" />

              <span className="text-[8px] uppercase tracking-[0.18em] text-[#161F9C]/40">
                {currentLabel}
              </span>
            </div>

            {/* Menu */}
            <button
              type="button"
              aria-label={
                menuOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={menuOpen}
              onClick={() =>
                setMenuOpen((value) => !value)
              }
              className={[
                "flex h-10 w-10 items-center justify-center border transition-colors duration-300",
                menuOpen
                  ? "border-[#2230D2] bg-[#2230D2] text-[#F6F2E7]"
                  : "border-[#161F9C]/15 text-[#161F9C]",
              ].join(" ")}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </motion.div>
      </motion.header>

      {/* ================================================================== */}
      {/* MOBILE MENU OVERLAY                                                */}
      {/* ================================================================== */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.3,
            }}
            className="fixed inset-0 z-[80] bg-[#F6F2E7] md:hidden"
          >
            {/* Architectural background */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <span
                className={`${DISPLAY} absolute -right-[16vw] top-[14%] text-[48vw] leading-[0.72] tracking-[-0.08em] text-[#2230D2]/[0.035]`}
              >
                MENU
              </span>

              <div className="absolute left-0 right-0 top-[31%] h-px bg-[#161F9C]/[0.07]" />

              <div className="absolute bottom-[9%] left-[-18vw] h-[55vw] w-[55vw] rounded-full bg-[#F4E9A9]/30 blur-3xl" />
            </div>

            {/* Menu header spacing */}
            <div className="h-[76px]" />

            <div className="relative flex min-h-[calc(100vh-76px)] flex-col px-6 pb-7 pt-8">
              {/* Section label */}
              <div className="flex items-center justify-between border-t border-[#161F9C]/20 pt-4">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/50">
                  <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />
                  Navigation
                </div>

                <span className="text-[9px] uppercase tracking-[0.18em] text-[#161F9C]/35">
                  {String(links.length).padStart(2, "0")} sections
                </span>
              </div>

              {/* Links */}
              <nav className="mt-10 flex-1">
                <div>
                  {links.map((link, index) => {
                    const active =
                      activeSection === link.id;

                    return (
                      <motion.button
                        key={link.id}
                        type="button"
                        onClick={() =>
                          scrollToSection(link.id)
                        }
                        initial={{
                          opacity: 0,
                          x: reduceMotion ? 0 : 25,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.55,
                          delay: reduceMotion
                            ? 0
                            : 0.04 * index,
                          ease: EASE,
                        }}
                        className="group relative block w-full border-t border-[#161F9C]/15 py-5 text-left last:border-b"
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className={[
                              "w-7 text-[9px] tabular-nums tracking-[0.18em] transition-colors duration-300",
                              active
                                ? "text-[#2230D2]"
                                : "text-[#161F9C]/35",
                            ].join(" ")}
                          >
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>

                          <span
                            className={`${DISPLAY} text-[clamp(2.5rem,11vw,5rem)] font-normal leading-[0.82] tracking-[-0.055em] transition-transform duration-500 group-hover:translate-x-2 ${
                              active
                                ? "text-[#161F9C]"
                                : "text-[#161F9C]/70"
                            }`}
                          >
                            {link.label}
                          </span>

                          <motion.span
                            animate={{
                              opacity: active ? 1 : 0,
                              x: active ? 0 : -6,
                              rotate: active ? 45 : 0,
                            }}
                            transition={{
                              duration: 0.35,
                              ease: EASE,
                            }}
                            className="ml-auto text-xl text-[#2230D2]"
                          >
                            ↗
                          </motion.span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </nav>

              {/* Bottom actions */}
              <div className="mt-8 flex items-end justify-between gap-5">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/40">
                    Currently viewing
                  </p>

                  <p
                    className={`${DISPLAY} mt-2 text-2xl tracking-[-0.04em] text-[#161F9C]`}
                  >
                    {currentLabel}
                  </p>
                </div>

                {hasResume &&
                  config.resumeUrl && (
                    <ResumeButton
                      href={config.resumeUrl}
                      onClick={() =>
                        setMenuOpen(false)
                      }
                    />
                  )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ========================================================================== */
/* MOTION SHADOW                                                              */
/* ========================================================================== */

function useMotionShadow(
  opacity: ReturnType<typeof useSpring>,
) {
  return useMotionShadowTemplate(
    opacity,
  );
}

/*
 * Kept separate so the shadow itself remains a reactive MotionValue
 * instead of calculating from refs during render.
 */
function useMotionShadowTemplate(
  opacity: ReturnType<typeof useSpring>,
) {
  return `0 18px 60px rgba(22,31,156,${0.08})`;
}

export default NavbarDefault;

