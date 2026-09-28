"use client";

import React, {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import {
  sendContactMessage,
  type ContactActionState,
} from "@/actions/contact/send-contact-message";

import { trackContactClick } from "@/features/portfolio/components/use-portfolio-events";

import type { PortfolioRenderConfig } from "@/portfolio-renderer/types";

/* ========================================================================== */
/* TYPES                                                                      */
/* ========================================================================== */

const initialState: ContactActionState = {
  success: false,
  message: "",
};

type Props = {
  config: PortfolioRenderConfig;
};

type ContactLink = {
  key: string;
  label: string;
  href: string;
  external: boolean;
};

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
/* CONTACT LINKS                                                              */
/* ========================================================================== */

function buildLinks(config: PortfolioRenderConfig): ContactLink[] {
  const links: ContactLink[] = [];

  if (config?.phone?.trim()) {
    links.push({
      key: "phone",
      label: config.phone.trim(),
      href: `tel:${config.phone.replace(/[^\d+]/g, "")}`,
      external: false,
    });
  }

  if (config?.linkedinUrl?.trim()) {
    links.push({
      key: "linkedin",
      label: "LinkedIn",
      href: config.linkedinUrl.trim(),
      external: true,
    });
  }

  if (config?.githubUrl?.trim()) {
    links.push({
      key: "github",
      label: "GitHub",
      href: config.githubUrl.trim(),
      external: true,
    });
  }

  if (config?.resumeUrl?.trim()) {
    links.push({
      key: "resume",
      label: "Resume",
      href: config.resumeUrl.trim(),
      external: true,
    });
  }

  return links;
}

/* ========================================================================== */
/* ICONS                                                                      */
/* ========================================================================== */

function ArrowIcon({ className = "" }: { className?: string }) {
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

function SendIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={`h-4 w-4 ${className}`}
    >
      <path
        d="M3 9H14M10 4.5L14.5 9L10 13.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M3 3L13 13M13 3L3 13"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
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
/* FIELD                                                                      */
/* ========================================================================== */

function Field({
  number,
  label,
  optional = false,
  children,
}: {
  number: string;
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="group/field relative">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-[9px] tabular-nums tracking-[0.18em] text-[#2230D2]">
          {number}
        </span>

        <span className="h-px w-5 bg-[#161F9C]/15" />

        <span className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/45 transition-colors duration-300 group-focus-within/field:text-[#2230D2]">
          {label}
        </span>

        {optional && (
          <span className="ml-auto text-[8px] uppercase tracking-[0.16em] text-[#161F9C]/25">
            Optional
          </span>
        )}
      </div>

      <div className="relative">
        {children}

        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-[#161F9C]/15"
        />

        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#2230D2] transition-transform duration-500 group-focus-within/field:scale-x-100"
        />
      </div>
    </div>
  );
}

/* ========================================================================== */
/* SECTION                                                                    */
/* ========================================================================== */

export function ContactDefault({ config }: Props) {
  const reduced = Boolean(useReducedMotion());

  const portfolioId = config?.portfolioId;
  const name = config?.name?.trim() || "";

  const links = useMemo(() => buildLinks(config), [config]);

  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState,
  );

  const [displayMessage, setDisplayMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const [composerOpen, setComposerOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const contactTrackedRef = useRef(false);

  /* ------------------------------------------------------------------------ */
  /* Analytics                                                                */
  /* ------------------------------------------------------------------------ */

  const handleContactInteraction = () => {
    if (!portfolioId) {
      return;
    }

    if (contactTrackedRef.current) {
      return;
    }

    contactTrackedRef.current = true;

    trackContactClick(portfolioId);
  };

  /* ------------------------------------------------------------------------ */
  /* Action state                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.success) {
      formRef.current?.reset();
    }

    setDisplayMessage({
      text: state.message,
      isSuccess: state.success,
    });

    const timer = window.setTimeout(() => {
      setDisplayMessage(null);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [state]);

  /* ------------------------------------------------------------------------ */
  /* Pointer atmosphere                                                      */
  /* ------------------------------------------------------------------------ */

  const rawX = useMotionValue(50);
  const rawY = useMotionValue(35);

  const px = useSpring(rawX, {
    stiffness: 70,
    damping: 22,
    mass: 0.7,
  });

  const py = useSpring(rawY, {
    stiffness: 70,
    damping: 22,
    mass: 0.7,
  });

  const spotlight = useMotionTemplate`
    radial-gradient(
      600px circle at ${px}% ${py}%,
      rgba(34,48,210,0.075),
      transparent 66%
    )
  `;

  /* ------------------------------------------------------------------------ */
  /* Actions                                                                  */
  /* ------------------------------------------------------------------------ */

  const openComposer = () => {
    handleContactInteraction();
    setComposerOpen(true);
  };

  const closeComposer = () => {
    if (isPending) {
      return;
    }

    setComposerOpen(false);
  };

  const goTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  if (!portfolioId && links.length === 0) {
    return null;
  }

  return (
    <section
      id="contact"
      aria-label="Contact"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();

        rawX.set(((event.clientX - rect.left) / rect.width) * 100);

        rawY.set(((event.clientY - rect.top) / rect.height) * 100);
      }}
      className={`${TEXT} relative isolate overflow-hidden bg-[#F6F2E7] text-[#161F9C]`}
    >
      {/* ================================================================== */}
      {/* ARCHITECTURAL BACKGROUND                                            */}
      {/* ================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Mouse atmosphere */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: spotlight,
          }}
        />

        {/* Giant word */}
        <div className="absolute -right-[8vw] top-[7%] select-none">
          <span
            className={`${DISPLAY} text-[clamp(11rem,25vw,27rem)] leading-[0.65] tracking-[-0.09em] text-[#2230D2]/[0.035]`}
          >
            TALK
          </span>
        </div>

        {/* Vertical guide */}
        <div className="absolute inset-y-0 left-[calc(50%-0.5px)] hidden w-px bg-[#161F9C]/[0.05] lg:block" />

        {/* Horizontal guide */}
        <div className="absolute left-0 right-0 top-[31%] h-px bg-[#161F9C]/[0.05]" />

        {/* Soft yellow atmosphere */}
        <div className="absolute bottom-[-12vw] left-[-10vw] h-[40vw] w-[40vw] rounded-full bg-[#F4E9A9]/35 blur-3xl" />

        {/* Blueprint corner */}
        <div className="absolute bottom-[12%] right-[7%] hidden h-28 w-28 border-b border-r border-[#2230D2]/10 lg:block" />

        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#161F9C 1px, transparent 1px), linear-gradient(90deg, #161F9C 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* ================================================================== */}
      {/* MAIN CONTENT                                                        */}
      {/* ================================================================== */}

      <div className="mx-auto w-full max-w-[1600px] px-6 pb-10 pt-20 sm:px-10 sm:pb-14 sm:pt-28 lg:px-14 lg:pt-36">
        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                            */}
        {/* ---------------------------------------------------------------- */}

        <Reveal enabled={!reduced}>
          <div className="flex items-center justify-between border-t border-[#161F9C]/20 pt-4">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#161F9C]/60">
              <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

              <span>08</span>

              <span className="hidden sm:inline">Contact</span>
            </div>

            <span className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/35">
              Open channel
            </span>
          </div>
        </Reveal>

        {/* ---------------------------------------------------------------- */}
        {/* HERO COPY                                                        */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-20 grid grid-cols-1 gap-14 lg:mt-28 lg:grid-cols-12 lg:gap-10">
          <Reveal enabled={!reduced} className="lg:col-span-8">
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-3 -top-3 h-8 w-8 border-l border-t border-[#2230D2]/40"
              />

              <p className="mb-7 text-[11px] uppercase tracking-[0.2em] text-[#161F9C]/50">
                No formalities
              </p>

              <h2
                className={`${DISPLAY} max-w-[1000px] text-[clamp(4rem,9vw,10rem)] font-normal leading-[0.78] tracking-[-0.068em]`}
              >
                Let&apos;s make
                <br />
                <span className="ml-[8vw] italic text-[#2230D2]">
                  something.
                </span>
              </h2>
            </div>
          </Reveal>

          <Reveal
            enabled={!reduced}
            delay={0.12}
            className="self-end lg:col-span-3 lg:col-start-10"
          >
            <div className="border-l border-[#161F9C]/25 pl-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                Available for
              </p>

              <p className="mt-5 max-w-[25ch] text-sm leading-7 text-[#161F9C]/65">
                Roles, freelance work, collaborations, ambitious products and
                interesting conversations.
              </p>

              {name && (
                <p className="mt-7 text-[9px] uppercase tracking-[0.18em] text-[#161F9C]/35">
                  Direct to {name}
                </p>
              )}
            </div>
          </Reveal>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* CONTACT DESK                                                     */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-24 sm:mt-32 lg:mt-44">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10">
            {/* ============================================================ */}
            {/* LEFT — DIRECT CHANNELS                                        */}
            {/* ============================================================ */}

            <Reveal enabled={!reduced} className="mb-14 lg:col-span-4 lg:mb-0">
              <div className="lg:sticky lg:top-20">
                <div className="border-y border-[#161F9C]/20 py-8 sm:py-10">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                      Direct channels
                    </span>
                  </div>

                  <p
                    className={`${DISPLAY} mt-6 max-w-[9ch] text-[clamp(2.8rem,5vw,5rem)] leading-[0.82] tracking-[-0.055em]`}
                  >
                    Or find
                    <br />
                    me elsewhere.
                  </p>

                  {links.length > 0 && (
                    <div className="mt-10 border-t border-[#161F9C]/12">
                      {links.map((link, index) => (
                        <a
                          key={link.key}
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={
                            link.external ? "noopener noreferrer" : undefined
                          }
                          onClick={handleContactInteraction}
                          aria-label={
                            link.external
                              ? `${link.label} (opens in a new tab)`
                              : undefined
                          }
                          className="group relative flex items-center gap-4 border-b border-[#161F9C]/12 py-5 outline-none"
                        >
                          <span className="text-[9px] tabular-nums tracking-[0.18em] text-[#161F9C]/30">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="h-px w-6 bg-[#161F9C]/12 transition-all duration-500 group-hover:w-10 group-hover:bg-[#2230D2]" />

                          <span
                            className={`${DISPLAY} min-w-0 flex-1 truncate text-xl tracking-[-0.025em] text-[#161F9C]/70 transition-colors duration-300 group-hover:text-[#161F9C]`}
                          >
                            {link.label}
                          </span>

                          <ArrowIcon className="shrink-0 text-[#2230D2]/55 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#2230D2]" />

                          <span className="pointer-events-none absolute inset-y-0 left-0 right-0 -z-10 bg-[#2230D2]/[0.025] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Small coordinate system */}
                <div className="mt-8 flex items-center justify-between text-[8px] uppercase tracking-[0.18em] text-[#161F9C]/30">
                  <span>Personal archive</span>

                  <span>{String(links.length).padStart(2, "0")} channels</span>
                </div>
              </div>
            </Reveal>

            {/* ============================================================ */}
            {/* RIGHT — CONVERSATION PORTAL                                   */}
            {/* ============================================================ */}

            <div className="lg:col-span-8 lg:col-start-5">
              <Reveal enabled={!reduced} delay={0.08}>
                <AnimatePresence mode="wait">
                  {!composerOpen ? (
                    /* ====================================================== */
                    /* CLOSED STATE                                           */
                    /* ====================================================== */
                    <motion.div
                      key="portal"
                      initial={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.97,
                        y: -15,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: EASE,
                      }}
                    >
                      <button
                        type="button"
                        onClick={openComposer}
                        className="group relative block w-full overflow-hidden border border-[#161F9C]/15 bg-[#2230D2] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#2230D2]/40 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F6F2E7]"
                      >
                        {/* Atmosphere */}
                        <motion.div
                          aria-hidden="true"
                          className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(244,233,169,0.16),transparent_32%)]"
                          animate={
                            reduced
                              ? undefined
                              : {
                                  scale: [1, 1.08, 1],
                                  opacity: [0.8, 1, 0.8],
                                }
                          }
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />

                        {/* Giant text */}
                        <span
                          aria-hidden="true"
                          className={`${DISPLAY} absolute -right-4 bottom-[-3rem] text-[clamp(10rem,23vw,23rem)] leading-[0.65] tracking-[-0.09em] text-[#F6F2E7]/[0.06]`}
                        >
                          TALK
                        </span>

                        {/* Top bar */}
                        <div className="relative flex items-center justify-between border-b border-[#F6F2E7]/15 px-5 py-4 sm:px-7">
                          <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

                            <span className="text-[9px] uppercase tracking-[0.2em] text-[#F6F2E7]/55">
                              Communication portal
                            </span>
                          </div>

                          <span className="text-[9px] uppercase tracking-[0.18em] text-[#F6F2E7]/35">
                            Ready
                          </span>
                        </div>

                        {/* Main */}
                        <div className="relative min-h-[470px] p-6 sm:min-h-[560px] sm:p-10 lg:p-12">
                          <div className="flex h-full min-h-[420px] flex-col justify-between">
                            <div>
                              <p className="text-[9px] uppercase tracking-[0.2em] text-[#F6F2E7]/45">
                                Step 01
                              </p>

                              <h3
                                className={`${DISPLAY} mt-6 max-w-[8ch] text-[clamp(4rem,7vw,8rem)] leading-[0.78] tracking-[-0.065em] text-[#F6F2E7]`}
                              >
                                Start a conversation.
                              </h3>
                            </div>

                            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                              <p className="max-w-[32ch] text-sm leading-7 text-[#F6F2E7]/55">
                                No account. No unnecessary steps. Just tell me
                                what you&apos;re building.
                              </p>

                              {/* Orbital button */}
                              <div className="relative shrink-0">
                                <motion.div
                                  animate={
                                    reduced
                                      ? undefined
                                      : {
                                          rotate: 360,
                                        }
                                  }
                                  transition={{
                                    duration: 18,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                  className="absolute -inset-3 rounded-full border border-dashed border-[#F4E9A9]/35"
                                />

                                <motion.div
                                  whileHover={
                                    reduced
                                      ? undefined
                                      : {
                                          scale: 1.06,
                                          rotate: 8,
                                        }
                                  }
                                  transition={{
                                    duration: 0.45,
                                    ease: EASE,
                                  }}
                                  className="relative flex h-28 w-28 items-center justify-center rounded-full bg-[#F6F2E7] text-[#161F9C] sm:h-32 sm:w-32"
                                >
                                  <div className="text-center">
                                    <span className="block text-[8px] uppercase tracking-[0.18em]">
                                      Open
                                    </span>

                                    <span
                                      className={`${DISPLAY} mt-1 block text-2xl leading-none tracking-[-0.04em]`}
                                    >
                                      Channel
                                    </span>

                                    <ArrowIcon className="mx-auto mt-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                  </div>
                                </motion.div>
                              </div>
                            </div>
                          </div>

                          {/* Corner marks */}
                          <span
                            aria-hidden="true"
                            className="absolute left-5 top-5 h-7 w-7 border-l border-t border-[#F6F2E7]/30 sm:left-7 sm:top-7"
                          />

                          <span
                            aria-hidden="true"
                            className="absolute bottom-5 right-5 h-7 w-7 border-b border-r border-[#F6F2E7]/30 sm:bottom-7 sm:right-7"
                          />
                        </div>
                      </button>
                    </motion.div>
                  ) : (
                    /* ====================================================== */
                    /* OPEN STATE                                             */
                    /* ====================================================== */
                    <motion.div
                      key="composer"
                      initial={{
                        opacity: 0,
                        y: 25,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 15,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.65,
                        ease: EASE,
                      }}
                      className="relative overflow-hidden border border-[#161F9C]/15 bg-[#F6F2E7]"
                    >
                      {/* Top navigation */}
                      <div className="flex items-center justify-between border-b border-[#161F9C]/12 px-5 py-4 sm:px-7">
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-[#2230D2]" />

                          <span className="text-[9px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                            New conversation
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={closeComposer}
                          disabled={isPending}
                          className="group flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-[#161F9C]/40 outline-none transition-colors duration-300 hover:text-[#161F9C] disabled:pointer-events-none disabled:opacity-30"
                        >
                          Close
                          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#161F9C]/15 transition-transform duration-300 group-hover:rotate-45">
                            <CloseIcon />
                          </span>
                        </button>
                      </div>

                      <form
                        ref={formRef}
                        action={formAction}
                        onFocus={handleContactInteraction}
                        className="relative p-6 sm:p-9 lg:p-11"
                      >
                        {/* Hidden metadata */}
                        <input
                          type="hidden"
                          name="portfolioId"
                          value={portfolioId ?? ""}
                        />

                        {/* Honeypot */}
                        <div
                          aria-hidden="true"
                          className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0"
                        >
                          <label htmlFor="fax_number">Fax</label>

                          <input
                            id="fax_number"
                            name="fax_number"
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                            defaultValue=""
                          />
                        </div>

                        {/* Intro */}
                        <div className="mb-12">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-[#2230D2]">
                            01 — Identify yourself
                          </p>

                          <h3
                            className={`${DISPLAY} mt-5 max-w-[8ch] text-[clamp(3rem,5.5vw,6rem)] leading-[0.8] tracking-[-0.06em] text-[#161F9C]`}
                          >
                            Tell me who you are.
                          </h3>
                        </div>

                        <div className="space-y-10">
                          {/* Identity */}
                          <div className="grid gap-8 sm:grid-cols-2">
                            <label
                              htmlFor="visitorName-contact"
                              className="block"
                            >
                              <Field number="01" label="Name">
                                <input
                                  id="visitorName-contact"
                                  name="visitorName"
                                  type="text"
                                  required
                                  minLength={2}
                                  maxLength={100}
                                  autoComplete="name"
                                  placeholder="Your name"
                                  className="w-full border-0 bg-transparent px-0 py-3 text-base text-[#161F9C] outline-none placeholder:text-[#161F9C]/20 focus:ring-0"
                                  onFocus={handleContactInteraction}
                                />
                              </Field>
                            </label>

                            <label
                              htmlFor="visitorEmail-contact"
                              className="block"
                            >
                              <Field number="02" label="Email">
                                <input
                                  id="visitorEmail-contact"
                                  name="visitorEmail"
                                  type="email"
                                  required
                                  maxLength={254}
                                  autoComplete="email"
                                  placeholder="you@example.com"
                                  className="w-full border-0 bg-transparent px-0 py-3 text-base text-[#161F9C] outline-none placeholder:text-[#161F9C]/20 focus:ring-0"
                                  onFocus={handleContactInteraction}
                                />
                              </Field>
                            </label>
                          </div>

                          {/* Context */}
                          <div>
                            <p className="mb-7 text-[9px] uppercase tracking-[0.2em] text-[#2230D2]">
                              02 — Set the context
                            </p>

                            <label htmlFor="subject-contact" className="block">
                              <Field number="03" label="Subject" optional>
                                <input
                                  id="subject-contact"
                                  name="subject"
                                  type="text"
                                  maxLength={200}
                                  placeholder="What are we talking about?"
                                  className="w-full border-0 bg-transparent px-0 py-3 text-base text-[#161F9C] outline-none placeholder:text-[#161F9C]/20 focus:ring-0"
                                  onFocus={handleContactInteraction}
                                />
                              </Field>
                            </label>
                          </div>

                          {/* Message */}
                          <div>
                            <p className="mb-7 text-[9px] uppercase tracking-[0.2em] text-[#2230D2]">
                              03 — Say the thing
                            </p>

                            <label htmlFor="message-contact" className="block">
                              <Field number="04" label="Message">
                                <textarea
                                  id="message-contact"
                                  name="message"
                                  required
                                  minLength={10}
                                  maxLength={5000}
                                  rows={7}
                                  placeholder="Tell me what you're building, what you need, or simply say hello."
                                  className="w-full resize-none border-0 bg-transparent px-0 py-3 text-[15px] leading-8 text-[#161F9C] outline-none placeholder:text-[#161F9C]/20 focus:ring-0"
                                  onFocus={handleContactInteraction}
                                />
                              </Field>
                            </label>
                          </div>

                          {/* Status */}
                          <div aria-live="polite" className="min-h-[1px]">
                            <AnimatePresence>
                              {displayMessage?.text && (
                                <motion.div
                                  initial={{
                                    opacity: 0,
                                    y: reduced ? 0 : -8,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    y: 0,
                                  }}
                                  exit={{
                                    opacity: 0,
                                    y: -5,
                                  }}
                                  role="status"
                                  className={[
                                    "border px-4 py-4 text-sm leading-6",
                                    displayMessage.isSuccess
                                      ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-700"
                                      : "border-red-500/20 bg-red-500/[0.06] text-red-700",
                                  ].join(" ")}
                                >
                                  {displayMessage.text}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Submit */}
                          <div className="flex flex-col gap-5 border-t border-[#161F9C]/12 pt-7 sm:flex-row sm:items-end sm:justify-between">
                            <p className="max-w-[30ch] text-[11px] leading-5 text-[#161F9C]/40">
                              Your message goes directly to the portfolio owner.
                            </p>

                            <button
                              type="submit"
                              disabled={isPending}
                              aria-busy={isPending}
                              className="group relative inline-flex min-h-14 items-center justify-center gap-4 overflow-hidden bg-[#2230D2] px-7 text-[10px] uppercase tracking-[0.18em] text-[#F6F2E7] outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#2230D2]/40 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F6F2E7] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                              {/* Sweep */}
                              <span
                                aria-hidden="true"
                                className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-[#F4E9A9]/20 transition-transform duration-700 ease-out group-hover:translate-x-[320%]"
                              />

                              <span className="relative">
                                {isPending ? "Sending" : "Send message"}
                              </span>

                              {!isPending && (
                                <SendIcon className="relative transition-transform duration-300 group-hover:translate-x-1" />
                              )}

                              {isPending && (
                                <motion.span
                                  aria-hidden="true"
                                  className="absolute inset-x-0 bottom-0 h-px bg-[#F4E9A9]"
                                  animate={
                                    reduced
                                      ? undefined
                                      : {
                                          opacity: [0.25, 1, 0.25],
                                        }
                                  }
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                />
                              )}
                            </button>
                          </div>
                        </div>
                      </form>

                      {/* Architectural bottom marker */}
                      <div className="absolute bottom-0 left-[12%] right-[-10%] h-px bg-[#2230D2]/30" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* CLOSING STATEMENT                                                 */}
        {/* ---------------------------------------------------------------- */}

        <Reveal
          enabled={!reduced}
          delay={0.1}
          className="mt-28 sm:mt-36 lg:mt-48"
        >
          <div className="relative overflow-hidden border-y border-[#161F9C]/20 py-11 sm:py-14 lg:py-16">
            <span
              aria-hidden="true"
              className={`${DISPLAY} pointer-events-none absolute -right-3 top-1/2 -translate-y-1/2 text-[clamp(9rem,21vw,22rem)] leading-none tracking-[-0.08em] text-[#2230D2]/[0.04]`}
            >
              END
            </span>

            <div className="relative flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#161F9C]/45">
                  Whenever you&apos;re ready
                </p>

                <p
                  className={`${DISPLAY} mt-7 max-w-[10ch] text-[clamp(3.5rem,7vw,8rem)] leading-[0.84] tracking-[-0.06em]`}
                >
                  The next
                  <br />
                  <span className="text-[#2230D2]">idea starts here.</span>
                </p>
              </div>

              <button
                type="button"
                onClick={goTop}
                className="group flex items-center gap-3 self-start text-[9px] uppercase tracking-[0.18em] text-[#161F9C]/45 outline-none transition-colors duration-300 hover:text-[#161F9C] focus-visible:text-[#161F9C] sm:self-end"
              >
                Back to top
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#161F9C]/15 transition-transform duration-300 group-hover:-translate-y-1">
                  ↑
                </span>
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ================================================================== */}
      {/* FOOTER STRIP                                                        */}
      {/* ================================================================== */}

      <div className="relative bg-[#2230D2] text-[#F6F2E7]">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-14">
          <span className="text-[9px] uppercase tracking-[0.22em] text-[#F6F2E7]/65">
            08 — Contact
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
  );
}

export default ContactDefault;
