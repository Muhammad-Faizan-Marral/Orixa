"use client";

import { useEffect, useMemo, useState } from "react";
import type { ThemeSectionProps } from "../../../types";

type NavItem = {
  id: string;
  label: string;
};

const ORANGE = "#ff5a00";
const ORANGE_SOFT = "rgba(255, 90, 0, 0.08)";
const ORANGE_BORDER = "rgba(255, 90, 0, 0.22)";

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

    if (selection?.enabled === false) return false;

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

export function NavbarDefault({ config, profile }: ThemeSectionProps) {
  const [activeId, setActiveId] = useState<string>("hero");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const name =
    config.name?.trim() ||
    profile.fullName?.trim() ||
    profile.username?.trim() ||
    "Portfolio";

  const links = useMemo(() => getNavigation(config), [config]);

  const hasResume = Boolean(config.resumeUrl);

  /*
   * ─────────────────────────────────────────────────────────────
   * SCROLL STATE
   * ─────────────────────────────────────────────────────────────
   */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
   * ─────────────────────────────────────────────────────────────
   * SCROLL SPY
   * ─────────────────────────────────────────────────────────────
   */

  useEffect(() => {
    const sectionIds = ["hero", ...links.map((link) => link.id)];

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-28% 0px -62% 0px",
        threshold: [0, 0.15, 0.35, 0.6],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [links]);

  /*
   * ─────────────────────────────────────────────────────────────
   * MOBILE MENU
   * ─────────────────────────────────────────────────────────────
   */

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;

      if (!target?.closest("[data-navbar-root]")) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileOpen]);

  /*
   * ─────────────────────────────────────────────────────────────
   * NAVIGATION
   * ─────────────────────────────────────────────────────────────
   */

  const handleNavigation = (id: string) => {
    setMobileOpen(false);

    const element = document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", `#${id}`);
  };

  /*
   * ─────────────────────────────────────────────────────────────
   * RENDER
   * ─────────────────────────────────────────────────────────────
   */

  return (
    <header
      data-navbar-root
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5"
    >
      <div className="mx-auto w-full max-w-[1480px]">
        <div
          className={[
            "relative",
            "flex items-center justify-between",
            "border",
            "backdrop-blur-2xl",
            "transition-all duration-500 ease-out",
            scrolled
              ? "px-3 py-2.5 sm:px-4"
              : "px-3 py-2.5 sm:px-4",
          ].join(" ")}
          style={{
            borderRadius: "var(--pr-radius, 16px)",

            borderColor: scrolled
              ? "color-mix(in srgb, var(--pr-border, currentColor) 82%, transparent)"
              : "color-mix(in srgb, var(--pr-border, currentColor) 55%, transparent)",

            background:
              "color-mix(in srgb, var(--pr-background, var(--background)) 88%, transparent)",

            boxShadow: scrolled
              ? "0 18px 55px rgba(0,0,0,0.10)"
              : "0 8px 30px rgba(0,0,0,0.045)",
          }}
        >
          {/* ============================================================
              BRAND
          ============================================================ */}

          <button
            type="button"
            onClick={() => handleNavigation("hero")}
            aria-label={`Back to ${name} home`}
            className="group relative flex min-w-0 items-center gap-3"
          >
            {/* Orange identity mark */}

            <span
              aria-hidden="true"
              className="
                relative
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                transition-all
                duration-500
                group-hover:rotate-[-8deg]
              "
              style={{
                borderColor: ORANGE_BORDER,
                background: ORANGE_SOFT,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: ORANGE,
                  boxShadow: `0 0 0 4px ${ORANGE_SOFT}`,
                }}
              />
            </span>

            <span className="min-w-0">
              <span
                className="
                  block
                  max-w-[145px]
                  truncate
                  text-[13px]
                  font-semibold
                  leading-none
                  tracking-[-0.025em]
                  sm:max-w-[220px]
                  sm:text-sm
                "
                style={{
                  color:
                    "var(--pr-foreground, var(--foreground, currentColor))",
                  fontFamily:
                    "var(--theme-font-display, var(--pr-font-display, sans-serif))",
                }}
              >
                {name}
              </span>

              <span
                className="
                  mt-1
                  hidden
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  sm:block
                "
                style={{
                  color: "var(--pr-muted, var(--muted-foreground, #777))",
                }}
              >
                Portfolio
              </span>
            </span>
          </button>

          {/* ============================================================
              DESKTOP NAVIGATION
          ============================================================ */}

          {links.length > 0 && (
            <nav
              aria-label="Portfolio navigation"
              className="
                absolute
                left-1/2
                hidden
                -translate-x-1/2
                items-center
                gap-1
                md:flex
              "
            >
              {links.map((link, index) => {
                const active = activeId === link.id;

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleNavigation(link.id)}
                    aria-current={active ? "location" : undefined}
                    className="
                      group/nav
                      relative
                      flex
                      items-center
                      gap-2
                      rounded-full
                      px-3
                      py-2
                      text-[10px]
                      font-medium
                      tracking-[-0.01em]
                      transition-all
                      duration-300
                    "
                    style={{
                      color: active
                        ? "var(--pr-foreground, var(--foreground))"
                        : "var(--pr-muted, var(--muted-foreground, #777))",

                      background: active
                        ? ORANGE_SOFT
                        : "transparent",
                    }}
                  >
                    <span
                      className="
                        text-[8px]
                        font-semibold
                        tabular-nums
                        opacity-35
                        transition-opacity
                        duration-300
                        group-hover/nav:opacity-60
                      "
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span>{link.label}</span>

                    {/* Active orange indicator */}

                    <span
                      aria-hidden="true"
                      className={[
                        "absolute bottom-[3px] left-1/2 h-[2px] -translate-x-1/2 rounded-full",
                        "transition-all duration-300",
                        active ? "w-5 opacity-100" : "w-0 opacity-0",
                      ].join(" ")}
                      style={{
                        background: ORANGE,
                      }}
                    />
                  </button>
                );
              })}
            </nav>
          )}

          {/* ============================================================
              RIGHT SIDE
          ============================================================ */}

          <div className="flex items-center gap-2">
            {hasResume ? (
              <a
                href={config.resumeUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  hidden
                  items-center
                  gap-2
                  rounded-full
                  px-4
                  py-2
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  transition-all
                  duration-300
                  hover:-translate-y-px
                  sm:inline-flex
                "
                style={{
                  color: "#ffffff",
                  background: ORANGE,
                  boxShadow: `0 8px 24px ${ORANGE_SOFT}`,
                }}
              >
                <span>Resume</span>

                <ArrowIcon
                  className="
                    -rotate-45
                    transition-transform
                    duration-300
                    group-hover:rotate-0
                  "
                />
              </a>
            ) : (
              links.some((link) => link.id === "contact") && (
                <button
                  type="button"
                  onClick={() => handleNavigation("contact")}
                  className="
                    hidden
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-4
                    py-2
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    transition-all
                    duration-300
                    hover:border-[#ff5a00]
                    sm:inline-flex
                  "
                  style={{
                    color:
                      "var(--pr-foreground, var(--foreground, currentColor))",
                    borderColor: ORANGE_BORDER,
                    background: ORANGE_SOFT,
                  }}
                >
                  <span>Contact</span>

                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: ORANGE,
                    }}
                  />
                </button>
              )
            )}

            {/* ==========================================================
                MOBILE MENU BUTTON
            ========================================================== */}

            <button
              type="button"
              aria-label={
                mobileOpen ? "Close navigation" : "Open navigation"
              }
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
              className="
                relative
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                transition-all
                duration-300
                md:hidden
              "
              style={{
                color:
                  "var(--pr-foreground, var(--foreground, currentColor))",
                borderColor: mobileOpen
                  ? ORANGE_BORDER
                  : "color-mix(in srgb, var(--pr-border, currentColor) 70%, transparent)",
                background: mobileOpen
                  ? ORANGE_SOFT
                  : "transparent",
              }}
            >
              <span className="relative flex h-3.5 w-4 flex-col justify-between">
                <span
                  className={[
                    "h-px w-full origin-center transition-transform duration-300",
                    mobileOpen
                      ? "translate-y-[6px] rotate-45"
                      : "",
                  ].join(" ")}
                  style={{
                    background: "currentColor",
                  }}
                />

                <span
                  className={[
                    "h-px w-full transition-opacity duration-200",
                    mobileOpen ? "opacity-0" : "",
                  ].join(" ")}
                  style={{
                    background: "currentColor",
                  }}
                />

                <span
                  className={[
                    "h-px w-full origin-center transition-transform duration-300",
                    mobileOpen
                      ? "-translate-y-[6px] -rotate-45"
                      : "",
                  ].join(" ")}
                  style={{
                    background: "currentColor",
                  }}
                />
              </span>
            </button>
          </div>

          {/* ============================================================
              MOBILE MENU
          ============================================================ */}

          <div
            className={[
              "absolute left-0 right-0 top-[calc(100%+10px)]",
              "origin-top",
              "overflow-hidden",
              "border",
              "backdrop-blur-2xl",
              "transition-all duration-300",
              "md:hidden",
              mobileOpen
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0",
            ].join(" ")}
            style={{
              borderRadius: "var(--pr-radius, 16px)",

              borderColor:
                "color-mix(in srgb, var(--pr-border, currentColor) 72%, transparent)",

              background:
                "color-mix(in srgb, var(--pr-background, var(--background)) 96%, transparent)",

              boxShadow: "0 24px 70px rgba(0,0,0,0.13)",
            }}
          >
            {/* Mobile header */}

            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--pr-border, currentColor) 55%, transparent)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: ORANGE,
                  }}
                />

                <span
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.24em]
                  "
                  style={{
                    color:
                      "var(--pr-muted, var(--muted-foreground, #777))",
                  }}
                >
                  Navigation
                </span>
              </div>

              <span
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                "
                style={{
                  color:
                    "var(--pr-muted, var(--muted-foreground, #777))",
                }}
              >
                {String(links.length).padStart(2, "0")} sections
              </span>
            </div>

            <nav
              aria-label="Mobile portfolio navigation"
              className="flex flex-col p-2"
            >
              {links.map((link, index) => {
                const active = activeId === link.id;

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleNavigation(link.id)}
                    aria-current={active ? "location" : undefined}
                    className={[
                      "group",
                      "flex items-center justify-between",
                      "rounded-xl px-3.5 py-3.5",
                      "text-left",
                      "transition-all duration-300",
                      index !== links.length - 1 ? "border-b" : "",
                    ].join(" ")}
                    style={{
                      color: active
                        ? ORANGE
                        : "var(--pr-foreground, var(--foreground))",

                      borderColor:
                        "color-mix(in srgb, var(--pr-border, currentColor) 32%, transparent)",

                      background: active
                        ? ORANGE_SOFT
                        : "transparent",
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="
                          text-[9px]
                          font-semibold
                          tabular-nums
                          opacity-35
                        "
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className="
                          text-sm
                          font-medium
                          tracking-[-0.015em]
                        "
                      >
                        {link.label}
                      </span>
                    </span>

                    <span
                      className={[
                        "flex h-6 w-6 items-center justify-center rounded-full",
                        "border transition-all duration-300",
                        active ? "rotate-0" : "-rotate-45",
                      ].join(" ")}
                      style={{
                        borderColor: active
                          ? ORANGE_BORDER
                          : "color-mix(in srgb, var(--pr-border, currentColor) 45%, transparent)",
                        background: active
                          ? ORANGE_SOFT
                          : "transparent",
                      }}
                      aria-hidden="true"
                    >
                      <ArrowIcon />
                    </span>
                  </button>
                );
              })}

              {/* Mobile resume */}

              {hasResume && (
                <a
                  href={config.resumeUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="
                    group
                    mt-2
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    px-4
                    py-3.5
                    text-sm
                    font-semibold
                  "
                  style={{
                    color: "#ffffff",
                    background: ORANGE,
                    boxShadow: `0 10px 30px ${ORANGE_SOFT}`,
                  }}
                >
                  <span>View Resume</span>

                  <span className="flex items-center gap-2">
                    <span
                      className="
                        text-[8px]
                        uppercase
                        tracking-[0.18em]
                        opacity-70
                      "
                    >
                      PDF
                    </span>

                    <ArrowIcon
                      className="
                        -rotate-45
                        transition-transform
                        duration-300
                        group-hover:rotate-0
                      "
                    />
                  </span>
                </a>
              )}

              {/* Mobile contact fallback */}

              {!hasResume &&
                links.some((link) => link.id === "contact") && (
                  <button
                    type="button"
                    onClick={() => handleNavigation("contact")}
                    className="
                      mt-2
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      px-4
                      py-3.5
                      text-sm
                      font-semibold
                    "
                    style={{
                      color: ORANGE,
                      borderColor: ORANGE_BORDER,
                      background: ORANGE_SOFT,
                    }}
                  >
                    <span>Start a conversation</span>

                    <ArrowIcon className="-rotate-45" />
                  </button>
                )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavbarDefault;