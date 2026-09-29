"use client";

import { useMemo, useState } from "react";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
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

type EducationView = {
  key: string;
  degree: string;
  institution: string;
  field: string | null;
  location: string | null;
  period: string | null;
  start: string | null;
  end: string | null;
  year: string | null;
  current: boolean;
  grade: string | null;
  description: string | null;
  points: string[];
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
    list = value.split(/\r?\n|;|•|,/);
  } else if (Array.isArray(value)) {
    list = value;
  }
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

const PRESENT_RE = /^(present|now|current|ongoing|in progress)$/i;

function formatDate(value: unknown): string | null {
  const t = asText(value);
  if (!t) return null;
  if (PRESENT_RE.test(t)) return "Present";
  if (/^\d{4}$/.test(t)) return t;
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

function yearOf(value: string | null): string | null {
  if (!value) return null;
  const m = value.match(/\b(19|20)\d{2}\b/);
  return m ? m[0] : null;
}

function toView(item: unknown, index?: number): EducationView | null {
  const i = typeof index === "number" ? index : 0;

  if (typeof item === "string") {
    const t = item.trim();
    if (!t) return null;
    return {
      key: `edu-${i}`,
      degree: t,
      institution: "",
      field: null,
      location: null,
      period: null,
      start: null,
      end: null,
      year: null,
      current: false,
      grade: null,
      description: null,
      points: [],
    };
  }

  if (!item || typeof item !== "object") return null;
  const p = item as Record<string, unknown>;

  const degree =
    asText(p.degree) ??
    asText(p.qualification) ??
    asText(p.title) ??
    asText(p.program) ??
    asText(p.course) ??
    "";
  const institution =
    asText(p.institution) ??
    asText(p.school) ??
    asText(p.university) ??
    asText(p.college) ??
    asText(p.organization) ??
    "";
  const description = asText(p.description) ?? asText(p.summary);

  if (!degree && !institution && !description) return null;

  const start = formatDate(p.startDate ?? p.start ?? p.from ?? p.startYear);
  const rawEnd = p.endDate ?? p.end ?? p.to ?? p.endYear ?? p.graduationYear;
  const rawEndText = asText(rawEnd);
  const current =
    p.current === true ||
    p.isCurrent === true ||
    p.present === true ||
    p.ongoing === true ||
    (rawEndText !== null && PRESENT_RE.test(rawEndText));
  const end = current ? "Present" : formatDate(rawEnd);

  const explicit = asText(p.period) ?? asText(p.duration) ?? asText(p.dates);
  const period =
    explicit ??
    (start && end ? `${start} — ${end}` : start ? `${start} — Present` : end);

  const year = current
    ? null
    : (yearOf(end) ?? yearOf(start) ?? yearOf(explicit));

  const gradeRaw = asText(p.grade) ?? asText(p.gpa) ?? asText(p.score) ?? asText(p.honors);

  return {
    key: asText(p.id) ?? asText(p._id) ?? `edu-${i}`,
    degree: degree || institution,
    institution: degree ? institution : "",
    field:
      asText(p.field) ??
      asText(p.fieldOfStudy) ??
      asText(p.major) ??
      asText(p.subject) ??
      asText(p.specialization),
    location: asText(p.location) ?? asText(p.city),
    period,
    start,
    end,
    year,
    current,
    grade: gradeRaw,
    description,
    points: asList(
      p.highlights ??
        p.achievements ??
        p.courses ??
        p.coursework ??
        p.activities ??
        p.bullets,
    ),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function safeId(value: string) {
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
        className="m-0 max-w-[62%] truncate text-right text-[15px] italic"
        style={{ fontFamily: SERIF_FONT, color: SEPIA }}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}

function Stamp({ year, id }: { year: string; id: string }) {
  const pathId = `stamp-path-${id}`;
  return (
    <svg
      aria-hidden="true"
      width="88"
      height="88"
      viewBox="0 0 96 96"
      className="shrink-0"
      style={{
        color: BLOOD,
        transform: "rotate(-12deg)",
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
      <circle cx="48" cy="48" r="44" fill="none" stroke={BLOOD} strokeWidth="1.6" />
      <circle cx="48" cy="48" r="40" fill="none" stroke={BLOOD} strokeWidth="0.6" />
      <circle cx="48" cy="48" r="24" fill="none" stroke={BLOOD} strokeWidth="0.6" />
      <text
        fill={BLOOD}
        fontSize="8.4"
        fontWeight="600"
        letterSpacing="2.4"
        style={{ fontFamily: TEXT_FONT, textTransform: "uppercase" }}
      >
        <textPath href={`#${pathId}`} startOffset="0">
          Orixa · Conferred · Orixa · Conferred ·
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
/* CARD                                                                       */
/* ========================================================================== */

function EducationCard({
  view,
  index,
  reduceMotion,
}: {
  view: EducationView;
  index: number;
  reduceMotion: boolean;
}) {
  const [open, setOpen] = useState(false);

  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const sx = useSpring(mx, { stiffness: 180, damping: 26, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 180, damping: 26, mass: 0.6 });
  const glow = useMotionTemplate`radial-gradient(260px circle at ${sx}px ${sy}px, ${GLOW}cc, transparent 70%)`;

  const longDesc = (view.description?.length ?? 0) > 150;
  const hasPoints = view.points.length > 0;
  const expandable = longDesc || hasPoints;

  const base = `${safeId(view.key)}-${index}`;
  const descId = `edu-desc-${base}`;
  const detailId = `edu-detail-${base}`;
  const controls = [view.description ? descId : null, hasPoints ? detailId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE, delay: (index % 2) * 0.08 }}
      className="m-0 list-none"
    >
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
        className="group relative flex h-full flex-col overflow-hidden rounded-[20px] p-6 sm:p-8"
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

        <div className="relative flex flex-1 flex-col">
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
              {view.current ? "In progress" : "Completed"}
            </Label>
          </div>

          <h3
            className="mt-5 text-[1.75rem] font-medium leading-[1.02] sm:text-[2.05rem]"
            style={{
              fontFamily: DISPLAY_FONT,
              letterSpacing: "-0.045em",
              color: INK,
              textWrap: "balance",
              overflowWrap: "anywhere",
            }}
          >
            {view.degree}
          </h3>

          {view.institution && (
            <p
              className="m-0 mt-2 text-[1.15rem] italic leading-[1.4] sm:text-[1.3rem]"
              style={{ fontFamily: SERIF_FONT, color: SEPIA }}
            >
              {view.institution}
            </p>
          )}

          {/* ledger */}
          {(view.field || view.period || view.location || view.grade) && (
            <dl
              className="m-0 mt-6 space-y-2 border-t pt-4"
              style={{ borderColor: HAIRLINE }}
            >
              {view.field && <LedgerRow label="Field" value={view.field} />}
              {view.period && <LedgerRow label="Period" value={view.period} />}
              {view.location && (
                <LedgerRow label="Place" value={view.location} />
              )}
              {view.grade && <LedgerRow label="Standing" value={view.grade} />}
            </dl>
          )}

          {view.description && (
            <p
              id={descId}
              className={`m-0 mt-5 text-[17px] leading-[1.75] ${
                open ? "" : "line-clamp-3"
              }`}
              style={{ fontFamily: TEXT_FONT, color: SEPIA }}
            >
              {view.description}
            </p>
          )}

          <AnimatePresence initial={false}>
            {open && hasPoints && (
              <motion.div
                id={detailId}
                key="detail"
                initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="overflow-hidden"
              >
                <ul
                  className="m-0 mt-5 list-none space-y-3 p-0"
                  aria-label={`${view.degree} notes`}
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* bottom row: toggle + stamp */}
          <div className="mt-auto flex items-end justify-between gap-4 pt-6">
            {expandable ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls={controls || undefined}
                onClick={() => setOpen((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-sm text-[11px] font-medium uppercase tracking-[0.2em] underline decoration-dotted underline-offset-4 ${FOCUS}`}
                style={{ fontFamily: TEXT_FONT, color: BLOOD }}
              >
                {open ? "Close file" : hasPoints ? "Open file" : "Read more"}
                <ChevronIcon open={open} />
              </button>
            ) : (
              <span aria-hidden="true" />
            )}
            {view.year && <Stamp year={view.year} id={base} />}
          </div>
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

export function EducationDefault({
  config,
}: ThemeSectionProps) {
  const reduceMotion = !!useReducedMotion();

  const valid = useMemo(
    () =>
      (config.education ?? [])
        .map(toView)
        .filter(
          (v): v is EducationView =>
            v !== null,
        ),
    [config.education],
  );

  const yearsSpan = useMemo(() => {
    const years: number[] = [];
    for (const v of valid) {
      for (const s of [v.start, v.end]) {
        const y = yearOf(s);
        if (y) years.push(Number(y));
      }
      if (v.year) years.push(Number(v.year));
    }
    if (!years.length) return null;
    const min = Math.min(...years);
    const max = Math.max(...years);
    return min === max ? String(min) : `${min} — ${max}`;
  }, [valid]);

  if (!valid.length) {
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
      id="education"
      aria-label="Education"
      className="relative overflow-hidden px-5 py-24 sm:px-8 md:py-32 lg:px-12"
      style={{ background: PAPER, color: INK }}
    >
      {/* paper atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 18% 88%, ${GLOW}b3, transparent 70%)`,
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
          <Label color={SEPIA}>Academic record</Label>
          <span
            aria-hidden="true"
            className="h-px flex-1"
            style={{ background: RULE }}
          />
          <Label>
            {valid.length} {valid.length === 1 ? "credential" : "credentials"}
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
            Learning,
            <br />
            <span style={{ color: BLOOD }}>signed</span> and sealed.
          </motion.h2>
          <motion.p
            {...rise(0.14)}
            className="m-0 max-w-[34ch] text-[1.2rem] italic leading-[1.5] sm:text-[1.35rem]"
            style={{ fontFamily: SERIF_FONT, color: SEPIA }}
          >
            The schools, subjects and study behind the work, kept as
            transcripts and stamped where completed.
          </motion.p>
        </div>

        {/* grid */}
        <ol
          className="m-0 mt-14 grid list-none grid-cols-1 gap-6 p-0 md:mt-20 md:grid-cols-2"
          aria-label="Education records"
        >
          {valid.map((view, i) => (
            <EducationCard
              key={`${view.key}-${i}`}
              view={view}
              index={i}
              reduceMotion={reduceMotion}
            />
          ))}
        </ol>

        {/* footer strip */}
        <div
          className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t pt-6 md:mt-24"
          style={{ borderColor: RULE }}
        >
          <Label>Orixa / Education</Label>
          <Label>{yearsSpan ? yearsSpan : `${valid.length} on record`}</Label>
        </div>
      </div>
    </section>
  );
}

export default EducationDefault;