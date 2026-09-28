"use client";

import { useMemo } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ==========================================================================
   DATA HELPERS
   `name`, `issueDate` and `credentialUrl` come from your filter. Issuer,
   expiry and credential ID are read defensively from common field names.
   ========================================================================== */

type CertificateView = {
  key: string;
  title: string;
  issuer: string | null;
  issued: string | null;
  expires: string | null;
  credentialId: string | null;
  url: string | null;
  monogram: string;
};

function readString(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value))
      return String(value);
  }
  return null;
}

function readUrl(source: Record<string, unknown>, keys: string[]) {
  const value = readString(source, keys);
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

/** "2024-03" → "Mar 2024"; anything else is shown as written. */
function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec(value);
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getMonogram(value: string): string {
  const words = value
    .replace(
      /\b(of|the|and|for|at|certified|certificate|certification)\b/gi,
      "",
    )
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function toView(item: unknown, index: number): CertificateView {
  const r = item as Record<string, unknown>;

  const name = readString(r, ["name", "title"]);
  const issuer = readString(r, [
    "issuer",
    "issuingOrganization",
    "organization",
    "authority",
    "provider",
  ]);
  const issued = readString(r, ["issueDate", "issuedAt", "date"]);
  const expires = readString(r, ["expiryDate", "expirationDate", "expiresAt"]);
  const title = name ?? issuer ?? "Certificate";

  return {
    key: `${title}-${index}`,
    title,
    issuer,
    issued: issued ? formatDate(issued) : null,
    expires: expires ? formatDate(expires) : null,
    credentialId: readString(r, [
      "credentialId",
      "credentialID",
      "certificateId",
    ]),
    url: readUrl(r, ["credentialUrl", "url", "link"]),
    monogram: getMonogram(issuer ?? title),
  };
}

/* ==========================================================================
   DESIGN TOKENS + PARTS
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1] as const;
const CUT = "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)";
const CUT_SM =
  "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)";

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

/** One credential. The verify link stretches over the whole plate. */
function Plate({
  item,
  index,
  reduced,
}: {
  item: CertificateView;
  index: number;
  reduced: boolean;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: reduced ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.9,
        delay: Math.min(index, 5) * 0.06,
        ease: EASE,
      }}
      className="h-full"
    >
      <article
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.setProperty("--mx", "-999px");
          e.currentTarget.style.setProperty("--my", "-999px");
        }}
        style={
          {
            "--mx": "-999px",
            "--my": "-999px",
            clipPath: CUT,
            background:
              "radial-gradient(260px circle at var(--mx) var(--my), rgba(147,197,253,0.75), transparent 70%), linear-gradient(to bottom, rgba(147,197,253,0.28), rgba(255,255,255,0.07) 50%, rgba(59,130,246,0.2))",
          } as React.CSSProperties
        }
        className="group relative h-full p-px"
      >
        <div
          style={{ clipPath: CUT }}
          className="relative flex h-full min-h-[240px] flex-col justify-between gap-10 overflow-hidden bg-[#060911] p-6"
        >
          {/* Light that follows the pointer inside the plate */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(320px circle at var(--mx) var(--my), rgba(59,130,246,0.16), transparent 60%)",
            }}
          />

          {/* Top: issuer mark + issue date */}
          <div className="relative flex items-start justify-between gap-4">
            <span
              aria-hidden="true"
              style={{ clipPath: CUT_SM }}
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-blue-400/25 bg-blue-500/[0.06] transition-colors duration-500 group-hover:bg-blue-500/[0.14]"
            >
              <span className="font-[var(--font-bricolage)] text-sm font-medium tracking-[-0.03em] text-blue-100">
                {item.monogram}
              </span>
            </span>

            {item.issued && (
              <p className="pt-1 text-right font-[var(--font-inter)] text-xs text-white/45">
                {item.issued}
              </p>
            )}
          </div>

          {/* Middle: what it is */}
          <div className="relative">
            <h3 className="font-[var(--font-bricolage)] text-[clamp(1.35rem,1.9vw,1.75rem)] font-medium leading-[1.12] tracking-[-0.035em] text-white">
              {item.title}
            </h3>
            {item.issuer && (
              <p className="mt-2.5 font-[var(--font-inter)] text-sm text-blue-200/70">
                {item.issuer}
              </p>
            )}
          </div>

          {/* Bottom: credential details + verify */}
          <div className="relative flex items-end justify-between gap-4 border-t border-white/[0.07] pt-4">
            <div className="min-w-0 space-y-1">
              {item.credentialId && (
                <p className="truncate font-[var(--font-inter)] text-xs text-white/40">
                  ID {item.credentialId}
                </p>
              )}
              {item.expires && (
                <p className="font-[var(--font-inter)] text-xs text-white/40">
                  Expires {item.expires}
                </p>
              )}
              {!item.credentialId && !item.expires && (
                <p className="font-[var(--font-inter)] text-xs text-white/30">
                  {item.url ? "Credential available" : "Certified"}
                </p>
              )}
            </div>

            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Verify ${item.title} credential (opens in a new tab)`}
                className="inline-flex shrink-0 items-center gap-2 font-[var(--font-inter)] text-[13px] font-medium text-white/70 outline-none transition-colors duration-300 after:absolute after:inset-0 after:content-[''] group-hover:text-white focus-visible:text-white focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-blue-400/70"
              >
                Verify
                <ArrowIcon className="text-blue-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
        </div>
      </article>
    </motion.li>
  );
}

/* ==========================================================================
   SECTION
   ========================================================================== */

export function CertificatesDefault({ config }: ThemeSectionProps) {
  const reduced = Boolean(useReducedMotion());

  const valid = useMemo(
    () =>
      (config.certificates ?? []).filter(
        (item) =>
          item.name?.trim() ||
          item.issueDate?.trim() ||
          item.credentialUrl?.trim(),
      ),
    [config.certificates],
  );

  const views = useMemo(() => valid.map(toView), [valid]);

  /* Pointer-following light for the whole section */
  const px = useSpring(useMotionValue(50), { stiffness: 60, damping: 20 });
  const py = useSpring(useMotionValue(30), { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${px}% ${py}%, rgba(37,99,235,0.14), transparent 62%)`;

  if (!valid.length) return null;

  return (
    <section
      id="certificates"
      aria-label="Certificates"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 100);
        py.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative isolate overflow-hidden bg-[#04060B] text-white"
    >
      {/* ------------------------------ BACKGROUND ------------------------------ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{ background: spotlight }}
        />

        {/* Fine diagonal weave that drifts slowly, like security-print guilloche */}
        <motion.div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(148,163,184,1) 0 1px, transparent 1px 28px), repeating-linear-gradient(-45deg, rgba(148,163,184,1) 0 1px, transparent 1px 28px)",
            maskImage:
              "radial-gradient(ellipse at 50% 45%, black 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 45%, black 0%, transparent 70%)",
          }}
          animate={
            reduced
              ? undefined
              : { backgroundPosition: ["0px 0px", "56px 56px"] }
          }
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />

        {/* Diagonal light band */}
        <motion.div
          className="absolute inset-y-0 w-[34%]"
          style={{
            background:
              "linear-gradient(100deg, transparent, rgba(59,130,246,0.06) 50%, transparent)",
          }}
          animate={reduced ? undefined : { x: ["-40vw", "110vw"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        />

        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />

        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{
            background: "linear-gradient(to top, transparent, #04060B)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background: "linear-gradient(to bottom, transparent, #04060B)",
          }}
        />
      </div>

      {/* -------------------------------- CONTENT -------------------------------- */}
      <div className="relative mx-auto w-full max-w-[1480px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-14 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 sm:mb-20"
        >
          <h2 className="font-[var(--font-bricolage)] text-[clamp(2.6rem,5vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white">
            Certificates
          </h2>
          <p className="max-w-[300px] border-l border-blue-400/40 pl-5 font-[var(--font-inter)] text-sm leading-6 text-white/45">
            {views.length} {views.length === 1 ? "credential" : "credentials"}
            {views.some((v) => v.url)
              ? `, ${views.filter((v) => v.url).length} with a verification link.`
              : "."}
          </p>
        </motion.div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {views.map((item, i) => (
            <Plate key={item.key} item={item} index={i} reduced={reduced} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default CertificatesDefault;
