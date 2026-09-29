"use client";

import React from "react";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ========================================================================== */
/* THEME                                                                      */
/* ========================================================================== */

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
const RULE = "rgba(109,77,49,.32)";
const HAIRLINE = "rgba(109,77,49,.22)";

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";
const SERIF_FONT =
  "var(--font-instrument), 'Iowan Old Style', 'Palatino Linotype', Georgia, serif";

const EASE = [0.22, 1, 0.36, 1] as const;

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .15  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3271d]";

const LABEL_CLASS = "text-[11px] font-medium uppercase tracking-[0.2em]";

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

type NavItem = { id: string; label: string; index: string };

const NAV: NavItem[] = [
  { id: "about", label: "About", index: "01" },
  { id: "skills", label: "Skills", index: "02" },
  { id: "projects", label: "Projects", index: "03" },
  { id: "experience", label: "Experience", index: "04" },
  { id: "education", label: "Education", index: "05" },
  { id: "contact", label: "Contact", index: "06" },
];

function asText(value: unknown): string | null {
  if (typeof value === "string") {
    const t = value.trim();
    return t ? t : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return null;
}

function slugify(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

/* ========================================================================== */
/* SMALL PIECES                                                               */
/* ========================================================================== */

function Label({
  children,
  color = DUST,
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`${LABEL_CLASS} ${className}`}
      style={{ fontFamily: TEXT_FONT, color }}
    >
      {children}
    </span>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 10V2.5M2.75 5.5 6 2.25 9.25 5.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Seal({ year, id }: { year: number; id: string }) {
  const pathId = `footer-seal-${id}`;
  return (
    <svg
      aria-hidden="true"
      width="104"
      height="104"
      viewBox="0 0 96 96"
      className="shrink-0"
      style={{
        color: BLOOD,
        transform: "rotate(-10deg)",
        mixBlendMode: "multiply",
        opacity: 0.85,
      }}
    >
      <defs>
        <path
          id={pathId}
          d="M48,48 m-33,0 a33,33 0 1,1 66,0 a33,33 0 1,1 -66,0"
        />
      </defs>
      <circle
        cx="48"
        cy="48"
        r="44"
        fill="none"
        stroke={BLOOD}
        strokeWidth="1.6"
      />
      <circle
        cx="48"
        cy="48"
        r="40"
        fill="none"
        stroke={BLOOD}
        strokeWidth="0.6"
      />
      <circle
        cx="48"
        cy="48"
        r="24"
        fill="none"
        stroke={BLOOD}
        strokeWidth="0.6"
      />
      <text
        fill={BLOOD}
        fontSize="8.4"
        fontWeight="600"
        letterSpacing="2.4"
        style={{ fontFamily: TEXT_FONT, textTransform: "uppercase" }}
      >
        <textPath href={`#${pathId}`} startOffset="0">
          Orixa · End of file · Orixa · End of file ·
        </textPath>
      </text>
      <text
        x="48"
        y="53"
        textAnchor="middle"
        fill={BLOOD}
        fontSize="15"
        fontStyle="italic"
        style={{ fontFamily: SERIF_FONT }}
      >
        {year}
      </text>
    </svg>
  );
}

/* ========================================================================== */
/* SECTION                                                                    */
/* ========================================================================== */

export function FooterDefault({ config, profile }: ThemeSectionProps) {
  const reduceMotion = !!useReducedMotion();

  const displayName =
    config?.name?.trim() || profile?.username?.trim() || "Portfolio";

  const currentYear = new Date().getFullYear();
  const uid = slugify(React.useId());

  // pointer glow on the paper slip
  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const sx = useSpring(mx, { stiffness: 180, damping: 26, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 180, damping: 26, mass: 0.6 });
  const glow = useMotionTemplate`radial-gradient(260px circle at ${sx}px ${sy}px, ${GLOW}cc, transparent 70%)`;

  // subtle parallax on the giant wordmark
  const wx = useMotionValue(0);
  const wxSmooth = useSpring(wx, { stiffness: 90, damping: 22, mass: 0.6 });
  const wordX = useTransform(wxSmooth, (v) => `${v}px`);

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

  const wordmark =
    displayName.length > 22 ? displayName.slice(0, 22) : displayName;

  return (
    <footer
      id="footer"
      aria-label="Site footer"
      className="relative overflow-hidden px-5 pb-10 pt-24 sm:px-8 md:pt-32 lg:px-12"
      style={{ background: PAPER, color: INK }}
    >
      {/* paper atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${GLOW}b3, transparent 70%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, ${VIGNETTE}38 100%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: GRAIN,
          backgroundSize: "160px 160px",
          mixBlendMode: "multiply",
          opacity: 0.4,
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        {/* masthead */}
        <motion.div {...rise(0)} className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-[6px] w-[6px] rounded-full"
            style={{ background: BLOOD }}
          />
          <Label color={SEPIA}>Colophon</Label>
          <span
            aria-hidden="true"
            className="h-px flex-1"
            style={{ background: RULE }}
          />
          <Label>End of file</Label>
        </motion.div>

        {/* wordmark */}
        <div
          className="mt-10 md:mt-14"
          onPointerMove={(e) => {
            if (reduceMotion) return;
            const r = e.currentTarget.getBoundingClientRect();
            wx.set(((e.clientX - r.left) / r.width - 0.5) * 16);
          }}
          onPointerLeave={() => wx.set(0)}
        >
          <motion.h2
            {...rise(0.06)}
            className="m-0 font-semibold"
            aria-label={displayName}
            style={{
              fontFamily: DISPLAY_FONT,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              fontSize: "clamp(2.6rem, 6.6vw, 6.2rem)",
              textWrap: "balance",
              color: INK,
              overflowWrap: "anywhere",
            }}
          >
            <motion.span
              style={
                reduceMotion ? undefined : { x: wordX, display: "inline-block" }
              }
            >
              {wordmark}
              <span style={{ color: BLOOD }}>.</span>
            </motion.span>
          </motion.h2>
        </div>

        {/* body */}
        <div className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          {/* index card: navigation */}
          <motion.div {...rise(0.1)} className="h-full">
            <div
              onPointerMove={(e) => {
                if (reduceMotion) return;
                const r = e.currentTarget.getBoundingClientRect();
                mx.set(e.clientX - r.left);
                my.set(e.clientY - r.top);
              }}
              onPointerLeave={() => {
                mx.set(-300);
                my.set(-300);
              }}
              className="group relative h-full overflow-hidden rounded-[20px] p-6 sm:p-8"
              style={{
                background: `linear-gradient(180deg, ${PAPER_DEEP}, ${PAPER_DARK})`,
                border: `1px solid ${KRAFT}`,
                boxShadow: `0 1px 0 ${GLOW}b3 inset, 0 18px 32px -22px ${SHADOW}80`,
              }}
            >
              {!reduceMotion && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: glow }}
                />
              )}
              <span
                aria-hidden="true"
                className="absolute right-4 top-4 h-3 w-3 rounded-full"
                style={{
                  background: PAPER,
                  boxShadow: `inset 0 1px 2px ${SHADOW}99, 0 1px 0 ${GLOW}b3`,
                }}
              />

              <div className="relative">
                <div className="flex items-center gap-3 pr-6">
                  <span
                    className="text-[15px] italic"
                    style={{ fontFamily: SERIF_FONT, color: BLOOD }}
                  >
                    01
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1"
                    style={{ background: HAIRLINE }}
                  />
                  <Label>Index</Label>
                </div>

                <h3
                  className="m-0 mt-5 text-[1.75rem] font-medium leading-[1.02] sm:text-[2rem]"
                  style={{
                    fontFamily: DISPLAY_FONT,
                    letterSpacing: "-0.045em",
                    color: INK,
                    textWrap: "balance",
                  }}
                >
                  Turn to a page
                </h3>

                <nav
                  aria-label="Footer navigation"
                  className="mt-6 border-t pt-5"
                  style={{ borderColor: HAIRLINE }}
                >
                  <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-3 p-0 sm:grid-cols-2">
                    {NAV.map((item) => (
                      <li key={item.id} className="flex items-baseline gap-2">
                        <span
                          className="text-[13px] italic"
                          style={{ fontFamily: SERIF_FONT, color: BLOOD }}
                        >
                          {item.index}
                        </span>
                        <span
                          aria-hidden="true"
                          className="min-w-4 flex-1 border-b border-dotted"
                          style={{ borderColor: RULE }}
                        />
                        <a
                          href={`#${item.id}`}
                          onClick={goTo(item.id)}
                          aria-label={`Go to ${item.label} section`}
                          className={`rounded-sm text-[16px] italic underline decoration-transparent decoration-dotted underline-offset-4 transition-[text-decoration-color] duration-300 hover:decoration-current ${FOCUS}`}
                          style={{ fontFamily: SERIF_FONT, color: SEPIA }}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-500 group-focus-within:scale-x-100 group-hover:scale-x-100"
                style={{
                  background: BLOOD,
                  transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
                }}
              />
            </div>
          </motion.div>

          {/* sign-off */}
          <motion.div
            {...rise(0.18)}
            className="flex flex-col justify-between gap-8"
          >
            <p
              className="m-0 max-w-[34ch] text-[1.2rem] italic leading-[1.5] sm:text-[1.35rem]"
              style={{ fontFamily: SERIF_FONT, color: SEPIA }}
            >
              <span
                aria-hidden="true"
                className="float-left mr-2 text-[3.6rem] leading-[0.8]"
                style={{ color: BLOOD }}
              >
                T
              </span>
              hank you for reading the file this far. Every page was set by
              hand, and every reply is written the same way.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <button
                type="button"
                onClick={toTop}
                aria-label="Back to top of page"
                className={`inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-2.5 text-[13px] font-medium transition-transform duration-300 hover:-translate-y-0.5 ${FOCUS}`}
                style={{
                  fontFamily: TEXT_FONT,
                  color: SEPIA,
                  boxShadow: `inset 0 0 0 1px ${KRAFT}`,
                }}
              >
                Back to top
                <ArrowUpIcon />
              </button>
              <Seal year={currentYear} id={uid} />
            </div>
          </motion.div>
        </div>

        {/* footer strip */}
        <div
          className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t pt-6 md:mt-24"
          style={{ borderColor: RULE }}
        >
          <Label>Orixa / Footer</Label>
          <Label>
            &copy; {currentYear} {displayName}
          </Label>
        </div>
      </div>
    </footer>
  );
}

export default FooterDefault;
