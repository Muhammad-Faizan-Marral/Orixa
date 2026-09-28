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

const DISPLAY = "font-[family-name:var(--font-display)]";
const TEXT = "font-[family-name:var(--font-text)]";

const EASE = [0.22, 1, 0.36, 1] as const;

const BLUE = "#2230D2";
const INDIGO = "#161F9C";
const CREAM = "#F6F2E7";
const YELLOW = "#F4E9A9";

/* ========================================================================== */
/* TYPES                                                                      */
/* ========================================================================== */

type CertificateView = {
  key: string;
  name: string;
  issuer: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  description: string | null;
};

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const result = value.trim();

  return result.length > 0 ? result : null;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  return value as Record<string, unknown>;
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    const result = clean(value);

    if (result) {
      return result;
    }
  }

  return null;
}

function safeUrl(value: unknown): string | null {
  const input = clean(value);

  if (!input) {
    return null;
  }

  try {
    const url = new URL(input);

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function toView(
  item: unknown,
  index: number,
): CertificateView {
  const record = asRecord(item);

  return {
    key:
      firstString(
        record.id,
        record._id,
        record.credentialId,
        record.name,
      ) ?? `certificate-${index}`,

    name:
      firstString(
        record.name,
        record.title,
        record.certificateName,
      ) ?? `Certificate ${index + 1}`,

    issuer: firstString(
      record.issuer,
      record.issuingOrganization,
      record.organization,
      record.provider,
      record.institution,
    ),

    issueDate: firstString(
      record.issueDate,
      record.issuedDate,
      record.date,
      record.issued,
    ),

    expiryDate: firstString(
      record.expiryDate,
      record.expirationDate,
      record.expires,
      record.validUntil,
    ),

    credentialId: firstString(
      record.credentialId,
      record.credentialID,
      record.id,
      record.certificateId,
    ),

    credentialUrl: safeUrl(
      firstString(
        record.credentialUrl,
        record.url,
        record.verifyUrl,
        record.verificationUrl,
      ),
    ),

    description: firstString(
      record.description,
      record.summary,
      record.details,
    ),
  };
}

/* ========================================================================== */
/* REVEAL                                                                     */
/* ========================================================================== */

function Reveal({
  children,
  enabled,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  enabled: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: enabled ? 0 : 1,
        y: enabled ? 28 : 0,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ========================================================================== */
/* ARCHIVE SEAL                                                               */
/* ========================================================================== */

function ArchiveSeal({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      animate={
        reduceMotion
          ? undefined
          : {
              rotate: active ? 90 : 0,
              scale: active ? 1 : 0.94,
            }
      }
      transition={{
        duration: 0.8,
        ease: EASE,
      }}
      className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#2230D2]/25 sm:h-24 sm:w-24"
    >
      {/* Outer dashed ring */}
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                rotate: active ? -90 : 0,
              }
        }
        transition={{
          duration: 1,
          ease: EASE,
        }}
        className="absolute inset-2 rounded-full border border-dashed border-[#161F9C]/20"
      />

      {/* Yellow core */}
      <span className="absolute h-2.5 w-2.5 rounded-full bg-[#F4E9A9]" />

      {/* Cross */}
      <span className="absolute h-px w-5 bg-[#2230D2]/40" />
      <span className="absolute h-5 w-px bg-[#2230D2]/40" />

      {/* Text ring */}
      <span
        className={`${TEXT} absolute inset-0 flex items-center justify-center text-[6px] uppercase tracking-[0.18em] text-[#161F9C]/50`}
      >
        Verified • Archive •
      </span>
    </motion.div>
  );
}

/* ========================================================================== */
/* CERTIFICATE OBJECT                                                         */
/* ========================================================================== */

function CertificateObject({
  certificate,
  index,
  active,
  animationsEnabled,
  onActivate,
  onOpen,
}: {
  certificate: CertificateView;
  index: number;
  active: boolean;
  animationsEnabled: boolean;
  onActivate: () => void;
  onOpen: () => void;
}) {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  const springX = useSpring(mouseX, {
    stiffness: 110,
    damping: 22,
    mass: 0.7,
  });

  const springY = useSpring(mouseY, {
    stiffness: 110,
    damping: 22,
    mass: 0.7,
  });

  const glow = useMotionTemplate`
    radial-gradient(
      circle at ${springX}% ${springY}%,
      rgba(34,48,210,${active ? 0.10 : 0.045}),
      transparent 42%
    )
  `;

  const period =
    certificate.issueDate ||
    certificate.expiryDate
      ? `${certificate.issueDate ?? "—"}${
          certificate.expiryDate
            ? ` → ${certificate.expiryDate}`
            : ""
        }`
      : null;

  const handleMove = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (!animationsEnabled) return;

    const rect =
      event.currentTarget.getBoundingClientRect();

    mouseX.set(
      ((event.clientX - rect.left) / rect.width) * 100,
    );

    mouseY.set(
      ((event.clientY - rect.top) / rect.height) * 100,
    );
  };

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onMouseMove={handleMove}
      layout
      whileHover={
        animationsEnabled
          ? {
              y: -7,
            }
          : undefined
      }
      transition={{
        duration: 0.45,
        ease: EASE,
      }}
      className={[
        "group relative block w-full text-left outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#2230D2]/35 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F6F2E7]",
      ].join(" ")}
    >
      {/* Object */}
      <div
        className={[
          "relative overflow-hidden border bg-[#F6F2E7]",
          "transition-[border-color,box-shadow] duration-500",
          active
            ? "border-[#2230D2]/25 shadow-[0_18px_50px_rgba(22,31,156,0.07)]"
            : "border-[#161F9C]/15",
        ].join(" ")}
      >
        {/* Spotlight */}
        <motion.div
          aria-hidden="true"
          style={{
            background: glow,
          }}
          className="pointer-events-none absolute inset-0"
        />

        {/* Top strip */}
        <div className="relative flex items-center justify-between border-b border-[#161F9C]/12 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-[9px] tabular-nums tracking-[0.18em] text-[#161F9C]/35">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="h-px w-6 bg-[#161F9C]/15" />

            <span className="text-[8px] uppercase tracking-[0.2em] text-[#161F9C]/40">
              Credential
            </span>
          </div>

          <span className="text-[8px] uppercase tracking-[0.16em] text-[#161F9C]/35">
            {certificate.credentialUrl
              ? "Verified"
              : "Archive"}
          </span>
        </div>

        {/* Main paper composition */}
        <div className="relative px-5 py-7 sm:px-7 sm:py-9">
          {/* Corner registration */}
          <span
            aria-hidden="true"
            className="absolute left-3 top-3 h-5 w-5 border-l border-t border-[#2230D2]/30"
          />

          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 h-5 w-5 border-b border-r border-[#2230D2]/20"
          />

          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              {certificate.issuer && (
                <p className="text-[9px] uppercase tracking-[0.19em] text-[#2230D2]/75">
                  {certificate.issuer}
                </p>
              )}

              <h3
                className={`${DISPLAY} mt-6 max-w-[10ch] text-[clamp(2.5rem,5vw,5.4rem)] font-normal leading-[0.83] tracking-[-0.055em] text-[#161F9C]`}
              >
                {certificate.name}
              </h3>
            </div>

            <ArchiveSeal
              active={active}
              reduceMotion={!animationsEnabled}
            />
          </div>

          {/* Metadata */}
          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-[#161F9C]/12 pt-5">
            <div>
              <p className="text-[8px] uppercase tracking-[0.2em] text-[#161F9C]/35">
                Issued
              </p>

              <p className="mt-2 text-xs leading-5 text-[#161F9C]/65">
                {period ?? "Date unavailable"}
              </p>
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-[0.2em] text-[#161F9C]/35">
                Credential
              </p>

              <p className="mt-2 break-all text-xs leading-5 text-[#161F9C]/55">
                {certificate.credentialId ??
                  "Reference on request"}
              </p>
            </div>
          </div>

          {/* Description */}
          <AnimatePresence initial={false}>
            {active && certificate.description && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                transition={{
                  duration: animationsEnabled ? 0.45 : 0,
                  ease: EASE,
                }}
                className="overflow-hidden"
              >
                <p className="mt-6 max-w-[55ch] border-t border-[#161F9C]/10 pt-5 text-[13px] leading-[1.8] text-[#161F9C]/60">
                  {certificate.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom action */}
        <div className="relative border-t border-[#161F9C]/12 px-5 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <span className="text-[8px] uppercase tracking-[0.18em] text-[#161F9C]/35">
              Open credential
            </span>

            <motion.span
              animate={{
                x: active ? 3 : 0,
                rotate: active ? 45 : 0,
              }}
              transition={{
                duration: 0.35,
                ease: EASE,
              }}
              className="text-sm text-[#2230D2]"
            >
              ↗
            </motion.span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ========================================================================== */
/* DETAIL OVERLAY                                                             */
/* ========================================================================== */

function CertificateDetail({
  certificate,
  index,
  animationsEnabled,
  onClose,
}: {
  certificate: CertificateView;
  index: number;
  animationsEnabled: boolean;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-y-auto"
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
        duration: 0.3,
      }}
    >
      <button
        type="button"
        aria-label="Close certificate"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-[#161F9C]/70 backdrop-blur-md"
      />

      <div className="relative min-h-full px-4 py-5 sm:px-8 sm:py-8 lg:px-14 lg:py-14">
        <motion.div
          initial={{
            opacity: animationsEnabled ? 0 : 1,
            y: animationsEnabled ? 40 : 0,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            ease: EASE,
          }}
          className="relative mx-auto max-w-[1200px] overflow-hidden bg-[#F6F2E7]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#161F9C]/15 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

              <span className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/40">
                Credential {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-[#161F9C]/45"
            >
              Close

              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#161F9C]/20 text-base transition-transform duration-300 group-hover:rotate-45">
                ×
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Editorial side */}
            <div className="relative overflow-hidden bg-[#2230D2] p-7 text-[#F6F2E7] sm:p-10 lg:col-span-5 lg:min-h-[620px] lg:p-14">
              <span
                aria-hidden="true"
                className={`${DISPLAY} absolute -right-4 bottom-0 text-[clamp(11rem,20vw,18rem)] leading-[0.65] tracking-[-0.09em] text-[#F6F2E7]/[0.08]`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="relative flex h-full min-h-[440px] flex-col justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-[#F6F2E7]/55">
                    Credential archive
                  </p>

                  <div className="mt-10">
                    <ArchiveSeal
                      active
                      reduceMotion={!animationsEnabled}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[#F6F2E7]/45">
                    Issuing body
                  </p>

                  <p
                    className={`${DISPLAY} mt-4 max-w-[10ch] text-[clamp(2.8rem,5vw,5rem)] leading-[0.82] tracking-[-0.055em]`}
                  >
                    {certificate.issuer ??
                      "Independent credential"}
                  </p>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-7 lg:p-14">
              <div>
                {certificate.issueDate && (
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/40">
                    Issued {certificate.issueDate}
                  </p>
                )}

                <h2
                  className={`${DISPLAY} mt-7 max-w-[9ch] text-[clamp(4rem,7vw,7rem)] leading-[0.78] tracking-[-0.06em] text-[#161F9C]`}
                >
                  {certificate.name}
                </h2>

                {certificate.description && (
                  <p className="mt-10 max-w-[54ch] text-[15px] leading-[1.85] text-[#161F9C]/63">
                    {certificate.description}
                  </p>
                )}

                <div className="mt-12 grid grid-cols-1 gap-7 border-y border-[#161F9C]/12 py-6 sm:grid-cols-2">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[#161F9C]/35">
                      Credential ID
                    </p>

                    <p className="mt-3 break-all text-sm leading-6 text-[#161F9C]/65">
                      {certificate.credentialId ??
                        "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[#161F9C]/35">
                      Validity
                    </p>

                    <p className="mt-3 text-sm leading-6 text-[#161F9C]/65">
                      {certificate.expiryDate
                        ? `${certificate.issueDate ?? "—"} → ${certificate.expiryDate}`
                        : "No expiry specified"}
                    </p>
                  </div>
                </div>
              </div>

              {certificate.credentialUrl && (
                <div className="mt-14 border-t border-[#161F9C]/12 pt-6">
                  <a
                    href={certificate.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-5 bg-[#2230D2] px-6 py-4 text-[9px] uppercase tracking-[0.2em] text-[#F6F2E7] transition-transform duration-300 hover:-translate-y-1"
                  >
                    Verify credential

                    <span className="text-base transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ========================================================================== */
/* SECTION                                                                    */
/* ========================================================================== */

export function CertificatesDefault({
  config,
}: ThemeSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const animationsEnabled =
    config.animations !== false &&
    !shouldReduceMotion;

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<
    number | null
  >(null);

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

  const views = useMemo(
    () =>
      valid.map((item, index) =>
        toView(item, index),
      ),
    [valid],
  );

  if (!views.length) {
    return null;
  }

  const active =
    views[activeIndex] ?? views[0];

  return (
    <>
      <section
        id="certificates"
        className={`${TEXT} relative isolate overflow-hidden bg-[#F6F2E7] text-[#161F9C]`}
      >
        {/* ================================================================ */}
        {/* BACKGROUND                                                         */}
        {/* ================================================================ */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -right-[8vw] top-[8%]">
            <span
              className={`${DISPLAY} select-none text-[clamp(10rem,23vw,25rem)] leading-[0.66] tracking-[-0.09em] text-[#2230D2]/[0.035]`}
            >
              CRED
            </span>
          </div>

          <div className="absolute inset-y-0 left-[calc(50%-0.5px)] hidden w-px bg-[#161F9C]/[0.05] lg:block" />

          <div className="absolute left-[-12vw] bottom-[10%] h-[38vw] w-[38vw] rounded-full bg-[#F4E9A9]/35 blur-3xl" />

          <div className="absolute left-0 right-0 top-[31%] h-px bg-[#161F9C]/[0.05]" />
        </div>

        {/* ================================================================ */}
        {/* HEADER                                                             */}
        {/* ================================================================ */}

        <div className="mx-auto w-full max-w-[1600px] px-6 pt-8 sm:px-10 sm:pt-10 lg:px-14 lg:pt-12">
          <Reveal enabled={animationsEnabled}>
            <div className="flex items-center justify-between border-t border-[#161F9C]/20 pt-4">
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#161F9C]/60">
                <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

                <span>07</span>

                <span className="hidden sm:inline">
                  Credentials
                </span>
              </div>

              <span className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/40">
                Certified archive
              </span>
            </div>
          </Reveal>
        </div>

        {/* ================================================================ */}
        {/* MAIN                                                               */}
        {/* ================================================================ */}

        <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 pt-20 sm:px-10 sm:pb-32 sm:pt-28 lg:px-14 lg:pb-40 lg:pt-36">
          {/* Intro */}
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
            <Reveal
              enabled={animationsEnabled}
              className="lg:col-span-8"
            >
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-3 -top-3 h-8 w-8 border-l border-t border-[#2230D2]/40"
                />

                <p className="mb-7 text-[11px] uppercase tracking-[0.2em] text-[#161F9C]/50 sm:mb-10">
                  Proof of practice
                </p>

                <h2
                  className={`${DISPLAY} max-w-[950px] text-[clamp(4rem,9vw,10rem)] font-normal leading-[0.79] tracking-[-0.065em]`}
                >
                  Earned,
                  <br />
                  <span className="ml-[8vw] italic text-[#2230D2]">
                    not claimed.
                  </span>
                </h2>
              </div>
            </Reveal>

            <Reveal
              enabled={animationsEnabled}
              delay={0.12}
              className="self-end lg:col-span-3 lg:col-start-10"
            >
              <div className="border-l border-[#161F9C]/25 pl-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                  Archive note
                </p>

                <p className="mt-5 max-w-[24ch] text-sm leading-7 text-[#161F9C]/65">
                  A curated record of learning, recognition and
                  technical milestones.
                </p>
              </div>
            </Reveal>
          </div>

          {/* ============================================================ */}
          {/* ARCHIVE                                                         */}
          {/* ============================================================ */}

          <div className="relative mt-24 sm:mt-32 lg:mt-44">
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10">
              {/* Active credential */}
              <div className="mb-14 lg:col-span-4 lg:mb-0">
                <div className="lg:sticky lg:top-20">
                  <Reveal enabled={animationsEnabled}>
                    <div className="relative min-h-[400px] overflow-hidden border-y border-[#161F9C]/20 py-10 sm:min-h-[470px] sm:py-12">
                      <span
                        aria-hidden="true"
                        className={`${DISPLAY} absolute -right-3 top-0 text-[clamp(10rem,20vw,19rem)] leading-[0.65] tracking-[-0.09em] text-[#2230D2]/[0.045]`}
                      >
                        {String(
                          activeIndex + 1,
                        ).padStart(2, "0")}
                      </span>

                      <div className="relative flex min-h-[360px] flex-col justify-between sm:min-h-[420px]">
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

                          <span className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                            Currently selected
                          </span>
                        </div>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={active.key}
                            initial={{
                              opacity: 0,
                              y: 25,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: -20,
                            }}
                            transition={{
                              duration: animationsEnabled
                                ? 0.55
                                : 0,
                              ease: EASE,
                            }}
                          >
                            <p className="text-[9px] uppercase tracking-[0.18em] text-[#161F9C]/40">
                              {active.issuer ??
                                "Certificate"}
                            </p>

                            <h3
                              className={`${DISPLAY} mt-5 max-w-[8ch] text-[clamp(3rem,5vw,5.8rem)] leading-[0.82] tracking-[-0.06em]`}
                            >
                              {active.name}
                            </h3>

                            {active.issueDate && (
                              <p className="mt-6 text-sm text-[#2230D2]">
                                {active.issueDate}
                              </p>
                            )}
                          </motion.div>
                        </AnimatePresence>

                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[8px] uppercase tracking-[0.2em] text-[#161F9C]/35">
                              Archive
                            </p>

                            <p className="mt-2 text-sm text-[#161F9C]/55">
                              {String(
                                views.length,
                              ).padStart(2, "0")}{" "}
                              credentials
                            </p>
                          </div>

                          <ArchiveSeal
                            active
                            reduceMotion={!animationsEnabled}
                          />
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-[14%] right-[-16%] h-px bg-[#2230D2]/30" />
                    </div>
                  </Reveal>
                </div>
              </div>

              {/* Certificate list */}
              <div className="lg:col-span-8 lg:col-start-5">
                <Reveal
                  enabled={animationsEnabled}
                  delay={0.08}
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {views.map((certificate, index) => (
                      <CertificateObject
                        key={certificate.key}
                        certificate={certificate}
                        index={index}
                        active={
                          activeIndex === index
                        }
                        animationsEnabled={
                          animationsEnabled
                        }
                        onActivate={() =>
                          setActiveIndex(index)
                        }
                        onOpen={() =>
                          setSelectedIndex(index)
                        }
                      />
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* CLOSING                                                         */}
          {/* ============================================================ */}

          <Reveal
            enabled={animationsEnabled}
            delay={0.1}
            className="mt-28 sm:mt-36 lg:mt-48"
          >
            <div className="relative overflow-hidden border-y border-[#161F9C]/20 py-11 sm:py-14 lg:py-16">
              <span
                aria-hidden="true"
                className={`${DISPLAY} pointer-events-none absolute -right-3 top-1/2 -translate-y-1/2 text-[clamp(9rem,21vw,22rem)] leading-none tracking-[-0.08em] text-[#2230D2]/[0.04]`}
              >
                PROOF
              </span>

              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                  More than paper
                </p>

                <p
                  className={`${DISPLAY} mt-7 max-w-[11ch] text-[clamp(3.5rem,7vw,8rem)] leading-[0.84] tracking-[-0.06em]`}
                >
                  Knowledge
                  <br />
                  leaves a
                  <br />
                  <span className="text-[#2230D2]">
                    record.
                  </span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ================================================================ */}
        {/* FOOTER                                                            */}
        {/* ================================================================ */}

        <div className="relative bg-[#2230D2] text-[#F6F2E7]">
          <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-14">
            <span className="text-[9px] uppercase tracking-[0.22em] text-[#F6F2E7]/65">
              07 — Certificates
            </span>

            <span className="hidden text-[9px] uppercase tracking-[0.22em] text-[#F6F2E7]/55 sm:inline">
              Orixa Design Engine
            </span>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px bg-[#F4E9A9]/70"
          />
        </div>
      </section>

      {/* ================================================================ */}
      {/* DETAIL                                                             */}
      {/* ================================================================ */}

      <AnimatePresence>
        {selectedIndex !== null &&
          views[selectedIndex] && (
            <CertificateDetail
              certificate={views[selectedIndex]}
              index={selectedIndex}
              animationsEnabled={
                animationsEnabled
              }
              onClose={() =>
                setSelectedIndex(null)
              }
            />
          )}
      </AnimatePresence>
    </>
  );
}

export default CertificatesDefault;

