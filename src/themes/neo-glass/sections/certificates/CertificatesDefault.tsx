"use client";

import { useMemo, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ============================================================================
   CERTIFICATES — white band · heading + hairline · certificate list (left)
   with a featured orange sheet (right) that follows the selected row.
   ========================================================================== */

const DEFAULT_ACCENT = "#FF4A17";
const INK = "#1c1c1c";
const MUTED = "#5f5f5f";
const PANEL = "#f1f1f1";
const EASE = [0.22, 1, 0.36, 1] as const;

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";

type CertificateView = {
  key: string;
  name: string;
  issuer: string | null;
  date: string | null;
  year: string | null;
  url: string | null;
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function clean(value: unknown) {
  if (typeof value !== "string") return null;
  const result = value.trim();
  return result.length ? result : null;
}

function cleanUrl(value: unknown) {
  const result = clean(value);
  if (!result) return null;
  if (/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(result)) return result;
  return `https://${result}`;
}

function hasContent(item: unknown): item is Record<string, unknown> {
  if (typeof item === "string") return Boolean(item.trim());
  if (!item || typeof item !== "object") return false;
  return Boolean(clean((item as Record<string, unknown>).name));
}

function toView(item: unknown, index: number): CertificateView {
  const data: Record<string, unknown> =
    typeof item === "string" ? { name: item } : (item as Record<string, unknown>);

  const name = clean(data.name) ?? "Certificate";
  const rawDate = clean(data.issueDate);

  let date: string | null = null;
  let year: string | null = null;
  if (rawDate) {
    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) {
      date = rawDate;
      year = rawDate.match(/\d{4}/)?.[0] ?? null;
    } else {
      date = parsed.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      year = String(parsed.getFullYear());
    }
  }

  return {
    key: clean(data.id) ?? `${name}-${index}`,
    name,
    issuer: clean(data.issuer),
    date,
    year,
    url: cleanUrl(data.credentialUrl),
  };
}

function Seal() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 opacity-[0.18] sm:h-80 sm:w-80"
      fill="none"
      stroke="#fff"
      strokeWidth="4"
      aria-hidden
    >
      <circle cx="100" cy="100" r="92" />
      <circle cx="100" cy="100" r="72" strokeDasharray="6 8" />
      <circle cx="100" cy="100" r="50" />
      <path d="m76 102 18 18 32-38" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function CertificatesDefault({ config }: ThemeSectionProps) {
  const reduceMotion = !!useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const accent =DEFAULT_ACCENT;

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
    return min === max ? String(min) : `${min} - ${max}`;
  }, [views]);

  if (!views.length) {
    return null;
  }

  const safeIndex = views[activeIndex] ? activeIndex : 0;
  const active = views[safeIndex] ?? views[0];
  const panelId = "certificates-panel";

  return (
    <section
      id="certificates"
      aria-label="Certificates"
      className="w-full bg-white px-5 py-16 sm:px-8 lg:py-24"
      style={{ color: INK, fontFamily: TEXT_FONT }}
    >
      <div className="mx-auto max-w-[1140px]">
        {/* header */}
        <div
          className="flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-end sm:justify-between"
          style={{ borderColor: "rgba(28,28,28,.15)" }}
        >
          <h2
            className="font-bold tracking-tight"
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)",
            }}
          >
            My <span style={{ color: accent }}>Certificates</span>
          </h2>
          <p
            className="text-sm leading-relaxed sm:text-right"
            style={{ color: MUTED }}
          >
            {views.length} {views.length === 1 ? "certificate" : "certificates"}
            {yearsSpan ? ` · ${yearsSpan}` : ""}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
          {/* list */}
          <ul role="list" className="m-0 flex list-none flex-col gap-2 p-0">
            {views.map((view, i) => {
              const pressed = i === safeIndex;
              return (
                <li key={`${view.key}-${i}`}>
                  <button
                    type="button"
                    aria-pressed={pressed}
                    aria-controls={panelId}
                    onClick={() => setActiveIndex(i)}
                    className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      backgroundColor: pressed ? INK : PANEL,
                      color: pressed ? "#fff" : INK,
                      outlineColor: accent,
                    }}
                  >
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: pressed ? accent : "rgba(28,28,28,.25)" }}
                    />
                    <span
                      className="min-w-0 flex-1 truncate text-base font-semibold"
                      style={{ fontFamily: DISPLAY_FONT }}
                      title={view.name}
                    >
                      {view.name}
                    </span>
                    <span
                      className="shrink-0 text-sm"
                      style={{ color: pressed ? "rgba(255,255,255,.7)" : MUTED }}
                    >
                      {view.year ?? view.issuer ?? ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* featured sheet */}
          <div
            id={panelId}
            role="region"
            aria-live="polite"
            aria-label={`${active.name} details`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${active.key}-${safeIndex}`}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[28px] p-7 text-white sm:p-10"
                style={{ backgroundColor: accent }}
              >
                <Seal />

                <div className="relative flex flex-wrap items-center gap-2">
                  {active.date && (
                    <span className="rounded-full border-2 border-white px-4 py-1 text-[13px] font-medium">
                      {active.date}
                    </span>
                  )}
                </div>

                <div className="relative mt-10">
                  <h3
                    className="max-w-[18ch] font-bold leading-[1.08] tracking-tight"
                    style={{
                      fontFamily: DISPLAY_FONT,
                      fontSize: "clamp(1.7rem, 3.2vw, 2.6rem)",
                    }}
                  >
                    {active.name}
                  </h3>
                  {active.issuer && (
                    <p className="mt-3 text-base text-white/85">
                      Issued by {active.issuer}
                    </p>
                  )}

                  {active.url && (
                    <a
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      style={{ color: INK }}
                    >
                      Verify credential
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M6 14 14 6M7 6h7v7" />
                      </svg>
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CertificatesDefault;