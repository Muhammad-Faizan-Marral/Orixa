"use client";

import React, {
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import {
  sendContactMessage,
  type ContactActionState,
} from "@/actions/contact/send-contact-message";

import { trackContactClick } from "@/features/portfolio/components/use-portfolio-events";

import type { PortfolioRenderConfig } from "@/portfolio-renderer/types";

/* ============================================================================
   CONTACT — dark band · "Let's Discuss" copy + contact links (left) ·
   white form card with pill inputs and orange submit (right).
   ========================================================================== */

type Props = { config: PortfolioRenderConfig };

const DEFAULT_ACCENT = "#FF4A17";
const BAND = "#2a2a2a";
const INK = "#1c1c1c";
const MUTED = "#5f5f5f";
const FIELD = "#f1f1f1";
const SUCCESS = "#1f8a4c";
const EASE = [0.22, 1, 0.36, 1] as const;

const DISPLAY_FONT =
  "var(--font-bricolage), var(--font-display), var(--font-geist), Inter, ui-sans-serif, system-ui, sans-serif";
const TEXT_FONT =
  "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif";

const initialState = {} as unknown as ContactActionState;

type ContactLink = {
  kind: "phone" | "linkedin" | "github" | "resume" | "location";
  label: string;
  href: string | null;
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

function asText(value: unknown) {
  return clean(value);
}

function fieldError(errors: unknown, field: string): string | null {
  if (!errors || typeof errors !== "object") return null;
  const value = (errors as Record<string, unknown>)[field];
  if (Array.isArray(value)) return asText(value[0]);
  return asText(value);
}

function buildLinks(config: PortfolioRenderConfig | undefined): ContactLink[] {
  const links: ContactLink[] = [];

  const phone = clean(config?.phone);
  if (phone)
    links.push({
      kind: "phone",
      label: phone,
      href: `tel:${phone.replace(/[^\d+]/g, "")}`,
    });

  const linkedin = cleanUrl(config?.linkedinUrl);
  if (linkedin) links.push({ kind: "linkedin", label: "LinkedIn", href: linkedin });

  const github = cleanUrl(config?.githubUrl);
  if (github) links.push({ kind: "github", label: "GitHub", href: github });

  const resume = cleanUrl(config?.resumeUrl);
  if (resume) links.push({ kind: "resume", label: "Download resume", href: resume });

  const location = clean(config?.location);
  if (location) links.push({ kind: "location", label: location, href: null });

  return links;
}

function Icon({ kind }: { kind: ContactLink["kind"] }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (kind) {
    case "phone":
      return (
        <svg {...common}>
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 11v5M8 8v.01M12 16v-5m0 2.5c0-1.5 1-2.5 2.5-2.5S17 12 17 13.5V16" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M9 19c-4 1.5-4-2-6-2.5m12 4.5v-3.2a2.8 2.8 0 0 0-.8-2.2c2.700-.3 5.500-1.300 5.500-6a4.600 4.600 0 0 0-1.300-3.200 4.300 4.300 0 0 0-.1-3.200s-1-.3-3.300 1.300a11.400 11.400 0 0 0-6 0C6.700 2.700 5.700 3 5.700 3a4.300 4.300 0 0 0-.1 3.200A4.600 4.600 0 0 0 4.300 9.500c0 4.700 2.800 5.700 5.500 6a2.800 2.800 0 0 0-.8 2.200V21" />
        </svg>
      );
    case "resume":
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5ZM14 3v5h5M9 13h6M9 17h6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 21s7-6.100 7-11.500A7 7 0 0 0 5 9.500C5 14.900 12 21 12 21Z" />
          <circle cx="12" cy="9.500" r="2.500" />
        </svg>
      );
  }
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function ContactDefault({ config }: Props) {
  const reduceMotion = !!useReducedMotion();

  const portfolioId = config?.portfolioId;
  const name = config?.name?.trim() || "";
  const accent = DEFAULT_ACCENT;

  const links = useMemo(() => buildLinks(config), [config]);

  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState,
  );

  const [displayMessage, setDisplayMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const handled = useRef<unknown>(initialState);

  const rec = state as unknown as Record<string, unknown>;
  const errors = rec?.errors ?? rec?.fieldErrors;
  const isSuccess =
    rec?.success === true || rec?.status === "success" || rec?.ok === true;

  useEffect(() => {
    if (state === handled.current || state === initialState) return;
    handled.current = state;

    const text =
      asText(rec?.message) ??
      asText(rec?.error) ??
      (isSuccess
        ? "Your message has been delivered."
        : "Something went wrong. Please try again.");

    setDisplayMessage({ text, isSuccess });
    if (isSuccess) setValues({ name: "", email: "", message: "" });

    const timer = window.setTimeout(() => setDisplayMessage(null), 9000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const track = (kind: string) => {
    try {
      (trackContactClick as unknown as (...args: unknown[]) => void)(
        portfolioId,
        kind,
      );
    } catch {
      /* analytics must never break navigation */
    }
  };

  const rise = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  const nameErr = displayMessage && !isSuccess ? fieldError(errors, "name") : null;
  const emailErr = displayMessage && !isSuccess ? fieldError(errors, "email") : null;
  const messageErr =
    displayMessage && !isSuccess ? fieldError(errors, "message") : null;

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    fontFamily: TEXT_FONT,
    color: INK,
    backgroundColor: FIELD,
    boxShadow: hasError ? `inset 0 0 0 2px ${accent}` : "none",
  });

  const fieldCls =
    "w-full bg-transparent px-5 py-3.5 text-[15px] outline-none transition-shadow placeholder:text-black/40 focus-visible:ring-2";

  const linkCls =
    "inline-flex items-center gap-3 rounded-full px-5 py-3 text-[15px] font-medium text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="w-full px-5 py-16 sm:px-8 lg:py-24"
      style={{ backgroundColor: BAND, color: "#fff", fontFamily: TEXT_FONT }}
    >
      <div className="mx-auto grid max-w-[1140px] gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        {/* left: copy + links */}
        <motion.div {...rise(0)}>
          <h2
            className="font-bold leading-[1.1] tracking-tight"
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: "clamp(2rem, 4vw, 3.1rem)",
            }}
          >
            Have a Project Idea?
            <br />
            <span style={{ color: accent }}>Let&apos;s Discuss</span>
          </h2>

          <p className="mt-5 max-w-[420px] text-[15px] leading-relaxed text-white/70">
            {name
              ? `Send ${name.split(/\s+/)[0]} a message with what you have in mind and get a reply straight to your inbox.`
              : "Send a message with what you have in mind and get a reply straight to your inbox."}
          </p>

          {links.length > 0 && (
            <ul className="mt-8 flex flex-col items-start gap-3">
              {links.map((link) => (
                <li key={link.kind}>
                  {link.href ? (
                    <a
                      href={link.href}
                      target={link.kind === "phone" ? undefined : "_blank"}
                      rel={link.kind === "phone" ? undefined : "noopener noreferrer"}
                      onClick={() => track(link.kind)}
                      className={linkCls}
                      style={{ backgroundColor: "rgba(255,255,255,.08)" }}
                    >
                      <span style={{ color: accent }}>
                        <Icon kind={link.kind} />
                      </span>
                      {link.label}
                    </a>
                  ) : (
                    <span
                      className="inline-flex items-center gap-3 px-5 py-3 text-[15px] text-white/80"
                    >
                      <span style={{ color: accent }}>
                        <Icon kind={link.kind} />
                      </span>
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* right: form */}
        <motion.div {...rise(0.1)}>
          <form
            action={formAction}
            noValidate
            onSubmit={() => track("form")}
            className="rounded-[28px] bg-white p-6 sm:p-8"
            style={{ color: INK }}
          >
            {typeof portfolioId === "string" && (
              <input type="hidden" name="portfolioId" value={portfolioId} />
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-medium">
                  Your name
                </label>
                <div className="rounded-full" style={inputStyle(Boolean(nameErr))}>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Jane Doe"
                    value={values.name}
                    onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                    aria-invalid={Boolean(nameErr)}
                    aria-describedby={nameErr ? "contact-name-err" : undefined}
                    className={`${fieldCls} rounded-full`}
                    style={{ ["--tw-ring-color" as string]: accent }}
                  />
                </div>
                {nameErr && (
                  <p id="contact-name-err" role="alert" className="mt-1.5 text-sm" style={{ color: accent }}>
                    {nameErr}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-medium">
                  Email address
                </label>
                <div className="rounded-full" style={inputStyle(Boolean(emailErr))}>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                    aria-invalid={Boolean(emailErr)}
                    aria-describedby={emailErr ? "contact-email-err" : undefined}
                    className={`${fieldCls} rounded-full`}
                    style={{ ["--tw-ring-color" as string]: accent }}
                  />
                </div>
                {emailErr && (
                  <p id="contact-email-err" role="alert" className="mt-1.5 text-sm" style={{ color: accent }}>
                    {emailErr}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="contact-message" className="mb-2 block text-sm font-medium">
                Message
              </label>
              <div className="rounded-3xl" style={inputStyle(Boolean(messageErr))}>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell me about your project, timeline and budget."
                  value={values.message}
                  onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                  aria-invalid={Boolean(messageErr)}
                  aria-describedby={messageErr ? "contact-message-err" : undefined}
                  className={`${fieldCls} resize-none rounded-3xl`}
                  style={{ ["--tw-ring-color" as string]: accent }}
                />
              </div>
              {messageErr && (
                <p id="contact-message-err" role="alert" className="mt-1.5 text-sm" style={{ color: accent }}>
                  {messageErr}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-white transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                style={{ backgroundColor: accent, outlineColor: INK }}
              >
                {isPending ? "Sending…" : "Send Message"}
                {!isPending && (
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
                )}
              </button>

              <div aria-live="polite" className="min-h-[24px] flex-1">
                <AnimatePresence>
                  {displayMessage && (
                    <motion.p
                      key={displayMessage.text}
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm font-medium"
                      style={{ color: displayMessage.isSuccess ? SUCCESS : accent }}
                    >
                      {displayMessage.text}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactDefault;