"use client";

import { useMemo, useRef, useState } from "react";

import {
  AnimatePresence,
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
/* TYPES                                                                      */
/* ========================================================================== */

type ExperienceView = {
  key: string;
  role: string;
  company: string;
  location: string | null;
  period: string | null;
  start: string | null;
  end: string | null;
  current: boolean;
  description: string | null;
  points: string[];
  tags: string[];
};

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

function asText(value: unknown): string | null {
  if (typeof value === "string") {
    const t = value.trim();
    return t ? t : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    return (
      asText(o.name) ?? asText(o.title) ?? asText(o.label) ?? asText(o.value)
    );
  }
  return null;
}

function asList(value: unknown): string[] {
  let list: unknown[] = [];
  if (typeof value === "string") {
    list = value.split(/\r?\n|;|•/);
  } else if (Array.isArray(value)) {
    list = value;
  }
  const out: string[] = [];
  for (const item of list) {
    const t = asText(item);
    if (t) out.push(t);
  }
  return out;
}

function asTags(value: unknown): string[] {
  let list: unknown[] = [];
  if (typeof value === "string") list = value.split(",");
  else if (Array.isArray(value)) list = value;
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    const t = asText(item);
    if (t && !seen.has(t.toLowerCase())) {
      seen.add(t.toLowerCase());
      out.push(t);
    }
  }
  return out;
}

function formatDate(value: unknown): string | null {
  const t = asText(value);
  if (!t) return null;
  if (/^(present|now|current|ongoing)$/i.test(t)) return "Present";
  const d = new Date(t);
  if (!Number.isNaN(d.getTime()) && /\d{4}/.test(t)) {
    try {
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return t;
    }
  }
  return t;
}

function toView(item: unknown, index: number): ExperienceView {
  const p = (item && typeof item === "object" ? item : {}) as Record<
    string,
    unknown
  >;
  const start = formatDate(p.startDate ?? p.start ?? p.from);
  const rawEnd = p.endDate ?? p.end ?? p.to;
  const current =
    p.current === true ||
    p.isCurrent === true ||
    p.present === true ||
    (asText(rawEnd) !== null &&
      /^(present|now|current|ongoing)$/i.test(asText(rawEnd) ?? ""));
  const end = current ? "Present" : formatDate(rawEnd);
  const explicit = asText(p.period) ?? asText(p.duration) ?? asText(p.dates);
  const period =
    explicit ??
    (start && end ? `${start} — ${end}` : start ? `${start} — Present` : end);

  const description = asText(p.description) ?? asText(p.summary);
  const points = asList(
    p.highlights ?? p.achievements ?? p.responsibilities ?? p.bullets,
  );

  return {
    key: asText(p.id) ?? asText(p._id) ?? `exp-${index}`,
    role: asText(p.role) ?? asText(p.position) ?? asText(p.title) ?? "Role",
    company:
      asText(p.company) ?? asText(p.organization) ?? asText(p.employer) ?? "",
    location: asText(p.location) ?? asText(p.city),
    period,
    start,
    end,
    current,
    description,
    points,
    tags: asTags(p.tags ?? p.technologies ?? p.skills ?? p.stack),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      style={{
        transform: open ? "rotate(180deg)" : "none",
        transition: "transform .4s cubic-bezier(.22,1,.36,1)",
      }}
    >
      <path
        d="m2.5 4.5 3.5 3.5 3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LedgerRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt
        className={LABEL_CLASS}
        style={{ fontFamily: TEXT_FONT, color: DUST }}
      >
        {label}
      </dt>
      <span
        aria-hidden="true"
        className="min-w-4 flex-1 border-b border-dotted"
        style={{ borderColor: RULE }}
      />
      <dd
        className="m-0 max-w-[65%] truncate text-right text-[15px] italic"
        style={{ fontFamily: SERIF_FONT, color: SEPIA }}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}

/* ========================================================================== */
/* ENTRY                                                                      */
/* ========================================================================== */

function ExperienceEntry({
  view,
  index,
  total,
  reduceMotion,
}: {
  view: ExperienceView;
  index: number;
  total: number;
  reduceMotion: boolean;
}) {
  const [open, setOpen] = useState(index === 0);

  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const sx = useSpring(mx, { stiffness: 180, damping: 26, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 180, damping: 26, mass: 0.6 });
  const glow = useMotionTemplate`radial-gradient(260px circle at ${sx}px ${sy}px, ${GLOW}cc, transparent 70%)`;

  const hasDetail = view.points.length > 0 || view.tags.length > 0;
  const detailId = `exp-detail-${view.key.replace(/[^a-zA-Z0-9_-]/g, "")}-${index}`;
  const isLast = index === total - 1;

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.04 }}
      className="relative m-0 list-none pl-9 sm:pl-14"
    >
      {/* spine segment */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute bottom-[-28px] left-[7px] top-6 w-px sm:left-[11px]"
          style={{
            backgroundImage: `linear-gradient(${RULE} 50%, transparent 50%)`,
            backgroundSize: "1px 6px",
          }}
        />
      )}

      {/* spine node */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-[26px] flex h-[15px] w-[15px] items-center justify-center rounded-full sm:left-1 sm:h-[15px] sm:w-[15px]"
        style={{
          background: PAPER,
          boxShadow: `inset 0 1px 2px ${SHADOW}99, 0 1px 0 ${GLOW}b3, 0 0 0 1px ${KRAFT}`,
        }}
      >
        <span
          className="h-[6px] w-[6px] rounded-full"
          style={{ background: view.current ? BLOOD : DUST }}
        />
      </span>

      <motion.article
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={{ duration: 0.5, ease: EASE }}
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
        className="group relative overflow-hidden rounded-[20px] p-6 sm:p-8"
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

        {/* punched hole */}
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 h-3 w-3 rounded-full"
          style={{
            background: PAPER,
            boxShadow: `inset 0 1px 2px ${SHADOW}99, 0 1px 0 ${GLOW}b3`,
          }}
        />

        <div className="relative">
          {/* numbering row */}
          <div className="flex items-center gap-3 pr-6">
            <span
              className="text-[15px] italic"
              style={{ fontFamily: SERIF_FONT, color: BLOOD }}
            >
              {pad(index + 1)}
            </span>
            <span
              aria-hidden="true"
              className="h-px flex-1"
              style={{ background: HAIRLINE }}
            />
            <Label color={view.current ? BLOOD : DUST}>
              {view.current ? "Current post" : "Filed record"}
            </Label>
          </div>

          <h3
            className="mt-5 text-[1.75rem] font-medium leading-[1.02] sm:text-[2.1rem]"
            style={{
              fontFamily: DISPLAY_FONT,
              letterSpacing: "-0.045em",
              color: INK,
              textWrap: "balance",
              overflowWrap: "anywhere",
            }}
          >
            {view.role}
          </h3>

          {view.company && (
            <p
              className="m-0 mt-2 text-[1.15rem] italic leading-[1.4] sm:text-[1.3rem]"
              style={{ fontFamily: SERIF_FONT, color: SEPIA }}
            >
              {view.company}
            </p>
          )}

          {/* ledger */}
          {(view.period || view.location) && (
            <dl
              className="m-0 mt-6 space-y-2 border-t pt-4"
              style={{ borderColor: HAIRLINE }}
            >
              {view.period && <LedgerRow label="Period" value={view.period} />}
              {view.location && (
                <LedgerRow label="Place" value={view.location} />
              )}
            </dl>
          )}

          {view.description && (
            <p
              className="m-0 mt-5 text-[17px] leading-[1.75]"
              style={{ fontFamily: TEXT_FONT, color: SEPIA }}
            >
              {view.description}
            </p>
          )}

          {hasDetail && (
            <>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={detailId}
                onClick={() => setOpen((v) => !v)}
                className={`mt-5 inline-flex items-center gap-2 rounded-sm text-[11px] font-medium uppercase tracking-[0.2em] underline decoration-dotted underline-offset-4 ${FOCUS}`}
                style={{ fontFamily: TEXT_FONT, color: BLOOD }}
              >
                {open ? "Hide notes" : "Field notes"}
                <ChevronIcon open={open} />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={detailId}
                    key="detail"
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="overflow-hidden"
                  >
                    {view.points.length > 0 && (
                      <ul
                        className="m-0 mt-5 list-none space-y-3 p-0"
                        aria-label={`${view.role} highlights`}
                      >
                        {view.points.map((pt, i) => (
                          <li key={`${pt}-${i}`} className="flex gap-3">
                            <span
                              aria-hidden="true"
                              className="mt-[0.7em] h-[5px] w-[5px] shrink-0 rounded-full"
                              style={{ background: BLOOD }}
                            />
                            <span
                              className="text-[16px] leading-[1.7]"
                              style={{ fontFamily: TEXT_FONT, color: SEPIA }}
                            >
                              {pt}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {view.tags.length > 0 && (
                      <ul
                        className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0"
                        aria-label={`${view.role} technologies`}
                      >
                        {view.tags.slice(0, 12).map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.14em]"
                            style={{
                              fontFamily: TEXT_FONT,
                              color: SEPIA,
                              boxShadow: `inset 0 0 0 1px ${KRAFT}`,
                            }}
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* blood underline */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-500 group-focus-within:scale-x-100 group-hover:scale-x-100"
          style={{
            background: BLOOD,
            transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
          }}
        />
      </motion.article>
    </motion.li>
  );
}

/* ========================================================================== */
/* SECTION                                                                    */
/* ========================================================================== */

export function ExperienceDefault({ config }: ThemeSectionProps) {
  const reduceMotion = !!useReducedMotion();
  const listRef = useRef<HTMLOListElement | null>(null);

  const rawExperience = (
    config as unknown as Record<string, unknown> | undefined
  )?.experience;

  const valid = useMemo(
    () =>
      (Array.isArray(rawExperience) ? (rawExperience as unknown[]) : []).filter(
        (item) => {
          if (typeof item === "string") return item.trim().length > 0;
          if (!item || typeof item !== "object") return false;
          const o = item as Record<string, unknown>;
          return !!(
            asText(o.role) ||
            asText(o.position) ||
            asText(o.title) ||
            asText(o.company) ||
            asText(o.organization) ||
            asText(o.description)
          );
        },
      ),
    [rawExperience],
  );

  const views = useMemo(
    () =>
      valid.map((item, index) =>
        toView(typeof item === "string" ? { role: item } : item, index),
      ),
    [valid],
  );

  const yearsSpan = useMemo(() => {
    const years: number[] = [];
    for (const v of views) {
      for (const s of [v.start, v.end]) {
        const m = s?.match(/\b(19|20)\d{2}\b/);
        if (m) years.push(Number(m[0]));
      }
    }
    if (!years.length) return null;
    const min = Math.min(...years);
    const max = v_max(years);
    return min === max ? String(min) : `${min} — ${max}`;
  }, [views]);

  // scroll-linked rule fill
  const progress = useMotionValue(0);
  const smooth = useSpring(progress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const fillHeight = useTransform(smooth, (v) => `${Math.round(v * 100)}%`);

  if (!views.length) {
    return null;
  }

  const rise = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section
      id="experience"
      aria-label="Experience"
      className="relative overflow-hidden px-5 py-24 sm:px-8 md:py-32 lg:px-12"
      style={{ background: PAPER, color: INK }}
    >
      {/* paper atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 80% 8%, ${GLOW}b3, transparent 70%)`,
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
          <Label color={SEPIA}>Service record</Label>
          <span
            aria-hidden="true"
            className="h-px flex-1"
            style={{ background: RULE }}
          />
          <Label>
            {views.length} {views.length === 1 ? "post" : "posts"}
          </Label>
        </motion.div>

        {/* heading block */}
        <div className="mt-10 grid items-end gap-8 md:mt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <motion.h2
            {...rise(0.06)}
            className="m-0 font-semibold"
            style={{
              fontFamily: DISPLAY_FONT,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              fontSize: "clamp(2.6rem, 6.6vw, 6.2rem)",
              textWrap: "balance",
              color: INK,
            }}
          >
            Where the work
            <br />
            was <span style={{ color: BLOOD }}>done</span>.
          </motion.h2>
          <motion.p
            {...rise(0.14)}
            className="m-0 max-w-[34ch] text-[1.2rem] italic leading-[1.5] sm:text-[1.35rem]"
            style={{ fontFamily: SERIF_FONT, color: SEPIA }}
          >
            A dated record of roles held, teams joined and things learned along
            the way, newest entry first.
          </motion.p>
        </div>

        {/* timeline */}
        <div className="relative mt-14 md:mt-20">
          <ol
            ref={listRef}
            className="m-0 list-none space-y-7 p-0"
            aria-label="Experience timeline"
          >
            {views.map((view, i) => (
              <ExperienceEntry
                key={`${view.key}-${i}`}
                view={view}
                index={i}
                total={views.length}
                reduceMotion={reduceMotion}
              />
            ))}
          </ol>
          {/* unused scroll fill kept hidden for future use */}
          <motion.span
            aria-hidden="true"
            className="hidden"
            style={{ height: fillHeight }}
          />
        </div>

        {/* footer strip */}
        <div
          className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t pt-6 md:mt-24"
          style={{ borderColor: RULE }}
        >
          <Label>Orixa / Experience</Label>
          <Label>{yearsSpan ? yearsSpan : `${views.length} on record`}</Label>
        </div>
      </div>
    </section>
  );
}

function v_max(values: number[]) {
  return Math.max(...values);
}

export default ExperienceDefault;
