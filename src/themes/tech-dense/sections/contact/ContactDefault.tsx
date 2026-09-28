"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import {
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

/* ==========================================================================
   FORM STATE + TYPES (unchanged)
   ========================================================================== */

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

/* ==========================================================================
   DESIGN TOKENS + PARTS
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1] as const;
const CUT = "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)";
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

function SendIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 8H13M9 4L13 8L9 12"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const fieldClass =
  "w-full border-0 bg-transparent px-0 py-3 font-[var(--font-inter)] text-base text-white outline-none placeholder:text-white/25 focus:ring-0";

/** Underlined field whose blue rule draws in on focus. */
function Field({
  label,
  optional = false,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="group/field">
      <span className="mb-1 flex items-baseline justify-between font-[var(--font-inter)] text-[13px] text-white/45 transition-colors duration-300 group-focus-within/field:text-blue-200">
        {label}
        {optional && <span className="text-xs text-white/25">Optional</span>}
      </span>
      <div className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-white/[0.12]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-blue-300 to-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-transform duration-500 ease-out group-focus-within/field:scale-x-100"
        />
      </div>
    </div>
  );
}

/* ==========================================================================
   SECTION
   ========================================================================== */

export function ContactDefault({ config }: Props) {
  const reduced = Boolean(useReducedMotion());

  const portfolioId = config?.portfolioId;
  const name = config?.name?.trim() || "";
  const links = buildLinks(config);

  /* ------------------------------ contact form ------------------------------ */

  const [state, formAction, isPending] = useActionState(sendContactMessage,initialState);

  const [displayMessage, setDisplayMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  // Prevent repeated analytics events from multiple interactions
  const contactTrackedRef = useRef(false);

  const handleContactInteraction = () => {
    if (!portfolioId) return;
    if (contactTrackedRef.current) return;
    contactTrackedRef.current = true;
    trackContactClick(portfolioId);
  };

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      formRef.current?.reset();
    }

    setDisplayMessage({
      text: state.message,
      isSuccess: state.success,
    });

    const timer = setTimeout(() => {
      setDisplayMessage(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [state]);

  /* Pointer-following light */
  const px = useSpring(useMotionValue(50), { stiffness: 60, damping: 20 });
  const py = useSpring(useMotionValue(40), { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(620px circle at ${px}% ${py}%, rgba(37,99,235,0.16), transparent 62%)`;

  if (!portfolioId && links.length === 0) {
    return null;
  }

  const goTop = () =>
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });

  return (
    <section
      id="contact"
      aria-label="Contact"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 100);
        py.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative isolate w-full overflow-hidden bg-[#04060B] text-white"
    >
      {/* ------------------------------ BACKGROUND ------------------------------ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{ background: spotlight }}
        />

        {/* Rising glow at the base: the page's closing light */}
        <motion.div
          className="absolute -bottom-72 left-1/2 h-[36rem] w-[70rem] max-w-none -translate-x-1/2 rounded-full blur-[140px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(37,99,235,0.28), rgba(30,64,175,0.08) 45%, transparent 70%)",
          }}
          animate={
            reduced
              ? undefined
              : { opacity: [0.7, 1, 0.7], scale: [1, 1.06, 1] }
          }
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Contour lines drifting along the lower third */}
        <div
          className="absolute inset-x-0 bottom-0 h-[420px] opacity-60"
          style={{
            maskImage: "linear-gradient(to top, black 10%, transparent 90%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 10%, transparent 90%)",
          }}
        >
          <motion.svg
            viewBox="0 0 2800 420"
            preserveAspectRatio="none"
            className="h-full w-[2800px] max-w-none"
            animate={reduced ? undefined : { x: [0, -400] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            fill="none"
          >
            {Array.from({ length: 10 }, (_, row) => {
              let d = "";
              const y = 200 + row * 22;
              const amp = 8 + row * 2.4;
              for (let x = 0; x <= 2800; x += 20) {
                const yy =
                  y + Math.sin((x / 400) * Math.PI * 2 + row * 0.5) * amp;
                d += `${x === 0 ? "M" : "L"}${x} ${yy.toFixed(1)} `;
              }
              return (
                <path
                  key={row}
                  d={d}
                  stroke="rgba(96,165,250,1)"
                  strokeOpacity={0.05 + row * 0.02}
                />
              );
            })}
          </motion.svg>
        </div>

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
      </div>

      {/* -------------------------------- CONTENT -------------------------------- */}
      <div className="relative mx-auto w-full max-w-[1480px] px-5 pb-8 pt-24 sm:px-8 sm:pt-32 lg:px-12 lg:pt-40 xl:px-16">
        {/* Headline */}
        <div className="mb-16 grid gap-8 sm:mb-24 lg:grid-cols-12 lg:items-end">
          <h2
            className="font-[var(--font-bricolage)] text-[clamp(3.6rem,10vw,9.5rem)] font-medium leading-[0.86] tracking-[-0.06em] text-transparent lg:col-span-9"
            style={{
              backgroundImage:
                "linear-gradient(180deg,#fff 0%,#F1F5FF 45%,rgba(147,197,253,0.6) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            {["Let\u2019s", "talk."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={{ y: reduced ? 0 : "108%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1.1, delay: i * 0.1, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            className="max-w-[300px] border-l border-blue-400/40 pl-5 font-[var(--font-inter)] text-sm leading-7 text-white/50 lg:col-span-3 lg:pb-3"
          >
            Have a project, opportunity or idea worth discussing? Send a message
            and let&apos;s start a conversation.
          </motion.p>
        </div>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* -------------------------- LEFT: availability + links -------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="lg:col-span-4"
          >
            <p className="font-[var(--font-inter)] text-sm text-blue-200/70">
              Available for
            </p>
            <p className="mt-4 max-w-sm font-[var(--font-bricolage)] text-2xl font-medium leading-[1.2] tracking-[-0.035em] text-white">
              Roles, freelance projects, collaborations and interesting
              conversations.
            </p>

            {links.length > 0 && (
              <ul className="mt-14 border-t border-white/[0.08]">
                {links.map((link) => (
                  <li key={link.key}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      onClick={handleContactInteraction}
                      aria-label={
                        link.external
                          ? `${link.label} (opens in a new tab)`
                          : undefined
                      }
                      className="group relative flex items-center justify-between gap-4 border-b border-white/[0.08] py-5 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-400/60"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/[0.08] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <span className="relative truncate font-[var(--font-bricolage)] text-xl font-medium tracking-[-0.03em] text-white/75 transition-colors duration-300 group-hover:text-white">
                        {link.label}
                      </span>
                      <ArrowIcon className="relative shrink-0 text-blue-300/70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-300" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* ------------------------------- RIGHT: form ------------------------------- */}
          <div className="lg:col-span-8">
            {portfolioId ? (
              <motion.div
                initial={{ opacity: 0, y: reduced ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                style={{ clipPath: CUT }}
                className="bg-gradient-to-b from-blue-300/40 via-white/[0.08] to-blue-500/30 p-px"
              >
                <form
                  ref={formRef}
                  action={formAction}
                  onFocus={handleContactInteraction}
                  style={{ clipPath: CUT }}
                  className="relative overflow-hidden bg-[#060911]/95 p-6 backdrop-blur-xl sm:p-10"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-[90px]"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(59,130,246,0.22), transparent 70%)",
                    }}
                  />

                  <div className="relative mb-10 flex items-start justify-between gap-6">
                    <div>
                      <h3 className="font-[var(--font-bricolage)] text-3xl font-medium tracking-[-0.045em] text-white sm:text-4xl">
                        Send a message
                      </h3>
                      <p className="mt-3 max-w-sm font-[var(--font-inter)] text-sm leading-6 text-white/45">
                        Delivered directly
                        {name ? ` to ${name}` : " to the portfolio owner"}.
                      </p>
                    </div>
                    <span className="mt-1.5 inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-2.5 pr-3.5 font-[var(--font-inter)] text-xs text-white/60">
                      <span className="relative flex h-1.5 w-1.5">
                        {!reduced && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400/60" />
                        )}
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-400" />
                      </span>
                      Open to messages
                    </span>
                  </div>

                  <input type="hidden" name="portfolioId" value={portfolioId} />

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

                  <div className="relative space-y-8">
                    <div className="grid gap-8 sm:grid-cols-2">
                      <label htmlFor="visitorName-contact" className="block">
                        <Field label="Name">
                          <input
                            id="visitorName-contact"
                            name="visitorName"
                            type="text"
                            required
                            minLength={2}
                            maxLength={100}
                            autoComplete="name"
                            placeholder="Your name"
                            className={fieldClass}
                            onFocus={handleContactInteraction}
                          />
                        </Field>
                      </label>

                      <label htmlFor="visitorEmail-contact" className="block">
                        <Field label="Email">
                          <input
                            id="visitorEmail-contact"
                            name="visitorEmail"
                            type="email"
                            required
                            maxLength={254}
                            autoComplete="email"
                            placeholder="you@example.com"
                            className={fieldClass}
                            onFocus={handleContactInteraction}
                          />
                        </Field>
                      </label>
                    </div>

                    <label htmlFor="subject-contact" className="block">
                      <Field label="Subject" optional>
                        <input
                          id="subject-contact"
                          name="subject"
                          type="text"
                          maxLength={200}
                          placeholder="What's this about?"
                          className={fieldClass}
                          onFocus={handleContactInteraction}
                        />
                      </Field>
                    </label>

                    <label htmlFor="message-contact" className="block">
                      <Field label="Message">
                        <textarea
                          id="message-contact"
                          name="message"
                          required
                          minLength={10}
                          maxLength={5000}
                          rows={6}
                          placeholder="Tell me a little about your project..."
                          className={`${fieldClass} resize-none leading-7`}
                          onFocus={handleContactInteraction}
                        />
                      </Field>
                    </label>

                    {/* Status */}
                    <div aria-live="polite">
                      {displayMessage?.text && (
                        <motion.div
                          initial={{ opacity: 0, y: reduced ? 0 : -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          role="status"
                          style={{ clipPath: CUT_SM }}
                          className={`border px-4 py-3 font-[var(--font-inter)] text-sm ${
                            displayMessage.isSuccess
                              ? "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300"
                              : "border-red-400/20 bg-red-500/[0.07] text-red-300"
                          }`}
                        >
                          {displayMessage.text}
                        </motion.div>
                      )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isPending}
                        aria-busy={isPending}
                        style={{ clipPath: CUT }}
                        className="group relative inline-flex bg-gradient-to-br from-blue-300/70 via-blue-500/40 to-blue-600/70 p-px outline-none transition-shadow duration-500 hover:shadow-[0_0_44px_-6px_rgba(59,130,246,0.65)] focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:shadow-none"
                      >
                        <span
                          style={{ clipPath: CUT }}
                          className="relative flex min-h-12 min-w-[200px] items-center justify-center gap-4 overflow-hidden bg-[#070B14] px-7 font-[var(--font-inter)] text-sm font-medium text-white"
                        >
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-blue-300/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[320%]"
                          />
                          <span className="relative">
                            {isPending ? "Sending..." : "Send message"}
                          </span>
                          {!isPending && (
                            <SendIcon className="relative text-blue-300 transition-transform duration-300 group-hover:translate-x-1" />
                          )}
                          {isPending && (
                            <span
                              aria-hidden="true"
                              className="absolute inset-x-0 bottom-0 h-px overflow-hidden bg-blue-400/20"
                            >
                              <motion.span
                                className="block h-px w-1/3 bg-blue-300"
                                animate={
                                  reduced ? undefined : { x: ["-100%", "300%"] }
                                }
                                transition={{
                                  duration: 1.2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            </span>
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div
                style={{ clipPath: CUT }}
                className="bg-gradient-to-b from-blue-300/30 via-white/[0.06] to-blue-500/20 p-px"
              >
                <div
                  style={{ clipPath: CUT }}
                  className="bg-[#060911] p-6 sm:p-8"
                >
                  <p className="font-[var(--font-inter)] text-sm leading-7 text-white/55">
                    Direct messaging is not available for this portfolio.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Closing bar */}
        {/* <div className="mt-24 flex items-center justify-between gap-6 border-t border-white/[0.08] pt-5 sm:mt-32">
          {name ? (
            <span className="truncate font-[var(--font-inter)] text-xs text-white/35">
              {name}
            </span>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={goTop}
            className="group inline-flex items-center gap-2 rounded-sm font-[var(--font-inter)] text-xs text-white/45 outline-none transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-blue-400/60"
          >
            Back to top
            <svg
              viewBox="0 0 12 12"
              width="12"
              height="12"
              fill="none"
              aria-hidden="true"
              className="text-blue-300 transition-transform duration-300 group-hover:-translate-y-0.5"
            >
              <path
                d="M6 10V2M2.5 5.5L6 2L9.5 5.5"
                stroke="currentColor"
                strokeWidth="1.15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div> */}
      </div>
    </section>
  );
}

export default ContactDefault;
