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

type CertificateView = {
  key: string;
  name: string;
  issuer: string | null;
  issued: string | null;
  expires: string | null;
  year: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  description: string | null;
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
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const o = value as Record<string, unknown>;
    return (
      asText(o.name) ?? asText(o.title) ?? asText(o.label) ?? asText(o.value)
    );
  }
  return null;
}

function asUrl(value: unknown): string | null {
  const text = asText(
    value && typeof value === "object" && !Array.isArray(value)
      ? ((value as Record<string, unknown>).url ??
          (value as Record<string, unknown>).href)
      : value,
  );
  if (!text) return null;
  if (/^https?:\/\//i.test(text)) return text;
  if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(text)) return `https://${text}`;
  return null;
}

function formatDate(value: unknown): string | null {
  const t = asText(value);
  if (!t) return null;
  if (/^(none|never|no expiry|no expiration)$/i.test(t)) return "No expiry";
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

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function safeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "");
}

function toView(item: unknown, index: number): CertificateView {
  if (typeof item === "string") {
    return {
      key: `cert-${index}`,
      name: item.trim() || "Certificate",
      issuer: null,
      issued: null,
      expires: null,
      year: null,
      credentialId: null,
      credentialUrl: null,
      description: null,
    };
  }

  const p = (item && typeof item === "object" ? item : {}) as Record<
    string,
    unknown
  >;

  const issued = formatDate(p.issueDate ?? p.issuedAt ?? p.date ?? p.issued);
  const url = asUrl(p.credentialUrl ?? p.url ?? p.link ?? p.verifyUrl);

  return {
    key: asText(p.id) ?? asText(p._id) ?? `cert-${index}`,
    name:
      asText(p.name) ?? asText(p.title) ?? asText(p.certificate) ?? "Certificate",
    issuer:
      asText(p.issuer) ??
      asText(p.issuedBy) ??
      asText(p.organization) ??
      asText(p.authority) ??
      asText(p.provider),
    issued,
    expires: formatDate(p.expiryDate ?? p.expirationDate ?? p.expiresAt),
    year: yearOf(issued),
    credentialId: asText(p.credentialId) ?? asText(p.credentialID),
    credentialUrl: url,
    description: asText(p.description) ?? asText(p.summary),
  };
}

function hasContent(item: unknown): boolean {
  if (typeof item === "string") return item.trim().length > 0;
  if (!item || typeof item !== "object") return false;
  const o = item as Record<string, unknown>;
  return !!(
    asText(o.name) ||
    asText(o.title) ||
    asText(o.certificate) ||
    asText(o.issueDate) ||
    asText(o.date) ||
    asText(o.credentialUrl) ||
    asText(o.url)
  );
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

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 9 9 3M4.5 3H9v4.5"
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

function Stamp({ text, id }: { text: string; id: string }) {
  const pathId = `cert-stamp-${id}`;
  return (
    <svg
      aria-hidden="true"
      width="96"
      height="96"
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
          Orixa · Verified · Orixa · Verified ·
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
        {text}
      </text>
    </svg>
  );
}

/* ========================================================================== */
/* FEATURED SHEET                                                             */
/* ========================================================================== */

function FeaturedSheet({
  view,
  index,
  reduceMotion,
}: {
  view: CertificateView;
  index: number;
  reduceMotion: boolean;
}) {
  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const sx = useSpring(mx, { stiffness: 180, damping: 26, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 180, damping: 26, mass: 0.6 });
  const glow = useMotionTemplate`radial-gradient(260px circle at ${sx}px ${sy}px, ${GLOW}cc, transparent 70%)`;

  const hasLedger =
    !!view.issuer || !!view.issued || !!view.expires || !!view.credentialId;

  return (
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
      className="group relative h-full overflow-hidden rounded-[22px] p-6 sm:p-8"
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

      <div className="relative flex h-full flex-col">
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
          <Label>Certificate</Label>
        </div>

        {/* inner frame */}
        <div
          className="mt-6 flex flex-1 flex-col rounded-[14px] p-5 sm:p-7"
          style={{ boxShadow: `inset 0 0 0 1px ${HAIRLINE}` }}
        >
          <h3
            className="m-0 text-[1.75rem] font-medium leading-[1.02] sm:text-[2.2rem]"
            style={{
              fontFamily: DISPLAY_FONT,
              letterSpacing: "-0.045em",
              color: INK,
              textWrap: "balance",
              overflowWrap: "anywhere",
            }}
          >
            {view.name}
          </h3>

          {view.issuer && (
            <p
              className="m-0 mt-2 text-[1.15rem] italic leading-[1.4] sm:text-[1.3rem]"
              style={{ fontFamily: SERIF_FONT, color: SEPIA }}
            >
              Issued by {view.issuer}
            </p>
          )}

          {hasLedger && (
            <dl
              className="m-0 mt-6 space-y-2 border-t pt-4"
              style={{ borderColor: HAIRLINE }}
            >
              {view.issuer && <LedgerRow label="Issuer" value={view.issuer} />}
              {view.issued && <LedgerRow label="Issued" value={view.issued} />}
              {view.expires && (
                <LedgerRow label="Expires" value={view.expires} />
              )}
              {view.credentialId && (
                <LedgerRow label="Credential" value={view.credentialId} />
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

          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-7">
            {view.credentialUrl ? (
              <a
                href={view.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${view.name} credential (opens in a new tab)`}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-transform duration-300 hover:-translate-y-0.5 ${FOCUS}`}
                style={{
                  fontFamily: TEXT_FONT,
                  background: INK,
                  color: PAPER,
                }}
              >
                Verify credential
                <ArrowIcon />
              </a>
            ) : (
              <span aria-hidden="true" />
            )}
            <Stamp text={view.year ?? "Filed"} id={safeId(view.key) + index} />
          </div>
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
  );
}

/* ========================================================================== */
/* SECTION                                                                    */
/* ========================================================================== */

export function CertificatesDefault({ config }: ThemeSectionProps) {
  const reduceMotion = !!useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const rawCertificates = (
    config as unknown as Record<string, unknown> | undefined
  )?.certificates;

  const valid = useMemo(
    () =>
      (Array.isArray(rawCertificates) ? (rawCertificates as unknown[]) : []).filter(
        hasContent,
      ),
    [rawCertificates],
  );

  const views = useMemo(
    () => valid.map((item, index) => toView(item, index)),
    [valid],
  );

  const yearsSpan = useMemo(() => {
    const years = views
      .map((v) => (v.year ? Number(v.year) : null))
      .filter((y): y is number => y !== null);
    if (!years.length) return null;
    const min = Math.min(...years);
    const max = Math.max(...years);
    return min === max ? String(min) : `${min} — ${max}`;
  }, [views]);

  if (!views.length) {
    return null;
  }

  const safeIndex = views[activeIndex] ? activeIndex : 0;
  const active = views[safeIndex] ?? views[0];
  const panelId = "certificates-panel";

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
      id="certificates"
      aria-label="Certificates"
      className="relative overflow-hidden px-5 py-24 sm:px-8 md:py-32 lg:px-12"
      style={{ background: PAPER, color: INK }}
    >
      {/* paper atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 12% 14%, ${GLOW}b3, transparent 70%)`,
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
          <Label color={SEPIA}>Credentials</Label>
          <span
            aria-hidden="true"
            className="h-px flex-1"
            style={{ background: RULE }}
          />
          <Label>
            {views.length} {views.length === 1 ? "certificate" : "certificates"}
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
            Proof of study,
            <br />
            <span style={{ color: BLOOD }}>stamped</span> and on file.
          </motion.h2>
          <motion.p
            {...rise(0.14)}
            className="m-0 max-w-[34ch] text-[1.2rem] italic leading-[1.5] sm:text-[1.35rem]"
            style={{ fontFamily: SERIF_FONT, color: SEPIA }}
          >
            Courses completed and credentials earned, each one kept with its
            issuer and a way to check it.
          </motion.p>
        </div>

        {/* body */}
        <div className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
          {/* index list */}
          <motion.div {...rise(0.1)}>
            <div
              role="group"
              aria-label="Select a certificate"
              className="rounded-[20px] p-2 sm:p-3"
              style={{ boxShadow: `inset 0 0 0 1px ${HAIRLINE}` }}
            >
              <ul className="m-0 list-none space-y-1 p-0">
                {views.map((view, i) => {
                  const pressed = i === safeIndex;
                  return (
                    <li key={`${view.key}-${i}`} className="m-0">
                      <button
                        type="button"
                        aria-pressed={pressed}
                        aria-controls={panelId}
                        onClick={() => setActiveIndex(i)}
                        className={`flex w-full items-baseline gap-3 rounded-[14px] px-4 py-3.5 text-left transition-colors duration-300 ${FOCUS}`}
                        style={{
                          background: pressed ? INK : "transparent",
                          color: pressed ? PAPER : INK,
                        }}
                      >
                        <span
                          className="text-[14px] italic"
                          style={{
                            fontFamily: SERIF_FONT,
                            color: pressed ? PAPER : BLOOD,
                          }}
                        >
                          {pad(i + 1)}
                        </span>
                        <span
                          className="min-w-0 flex-1 truncate text-[1.1rem] font-medium"
                          style={{
                            fontFamily: DISPLAY_FONT,
                            letterSpacing: "-0.03em",
                          }}
                          title={view.name}
                        >
                          {view.name}
                        </span>
                        <span
                          aria-hidden="true"
                          className="hidden min-w-4 flex-none basis-6 border-b border-dotted sm:block"
                          style={{
                            borderColor: pressed ? KRAFT : RULE,
                          }}
                        />
                        <span
                          className="shrink-0 text-[14px] italic"
                          style={{
                            fontFamily: SERIF_FONT,
                            color: pressed ? KRAFT : SEPIA,
                          }}
                        >
                          {view.year ?? view.issuer ?? ""}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>

          {/* featured sheet */}
          <motion.div {...rise(0.18)}>
            <div
              id={panelId}
              role="region"
              aria-live="polite"
              aria-label={`${active.name} details`}
              className="h-full"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${active.key}-${safeIndex}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="h-full"
                >
                  <FeaturedSheet
                    view={active}
                    index={safeIndex}
                    reduceMotion={reduceMotion}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* footer strip */}
        <div
          className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t pt-6 md:mt-24"
          style={{ borderColor: RULE }}
        >
          <Label>Orixa / Certificates</Label>
          <Label>{yearsSpan ? yearsSpan : `${views.length} on file`}</Label>
        </div>
      </div>
    </section>
  );
}

export default CertificatesDefault;