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

type Props = {
  config: PortfolioRenderConfig;
};

type ContactKind =
  | "email"
  | "phone"
  | "location"
  | "github"
  | "linkedin"
  | "twitter"
  | "website"
  | "other";

type ContactLink = {
  key: string;
  kind: ContactKind;
  label: string;
  value: string;
  href: string | null;
};

const initialState = {
  success: false,
  message: "",
} as unknown as ContactActionState;

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
  if (/^(https?:\/\/|mailto:|tel:)/i.test(text)) return text;
  if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(text)) return `https://${text}`;
  return null;
}

function prettyUrl(href: string) {
  return href
    .replace(/^(https?:\/\/|mailto:|tel:)/i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

function detectKind(text: string): ContactKind {
  const t = text.toLowerCase();
  if (t.includes("github")) return "github";
  if (t.includes("linkedin")) return "linkedin";
  if (t.includes("twitter") || t.includes("x.com")) return "twitter";
  if (t.includes("mail")) return "email";
  return "other";
}

const KIND_LABEL: Record<ContactKind, string> = {
  email: "Email",
  phone: "Phone",
  location: "Based in",
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  website: "Website",
  other: "Elsewhere",
};

function buildLinks(config: unknown): ContactLink[] {
  const c = (config && typeof config === "object" ? config : {}) as Record<
    string,
    unknown
  >;
  const out: ContactLink[] = [];
  const seen = new Set<string>();

  const push = (
    kind: ContactKind,
    value: string | null,
    href: string | null,
    label?: string | null,
  ) => {
    if (!value) return;
    const id = (href ?? value).toLowerCase();
    if (seen.has(id)) return;
    seen.add(id);
    out.push({
      key: `${kind}-${out.length}`,
      kind,
      label: label ?? KIND_LABEL[kind],
      value,
      href,
    });
  };

  const email = asText(c.email) ?? asText(c.contactEmail);
  if (email) push("email", email, `mailto:${email}`);

  const phone = asText(c.phone) ?? asText(c.phoneNumber);
  if (phone) push("phone", phone, `tel:${phone.replace(/[^\d+]/g, "")}`);

  const location = asText(c.location) ?? asText(c.city) ?? asText(c.address);
  if (location) push("location", location, null);

  const direct: Array<[ContactKind, unknown]> = [
    ["github", c.github ?? c.githubUrl],
    ["linkedin", c.linkedin ?? c.linkedinUrl],
    ["twitter", c.twitter ?? c.twitterUrl ?? c.x],
    ["website", c.website ?? c.websiteUrl ?? c.portfolioUrl],
  ];
  for (const [kind, raw] of direct) {
    const href = asUrl(raw);
    if (href) push(kind, prettyUrl(href), href);
  }

  const socials = c.socials ?? c.socialLinks ?? c.links ?? c.social;
  if (Array.isArray(socials)) {
    for (const item of socials) {
      const href = asUrl(item);
      if (!href) continue;
      const o =
        item && typeof item === "object"
          ? (item as Record<string, unknown>)
          : {};
      const name =
        asText(o.platform) ?? asText(o.name) ?? asText(o.label) ?? null;
      const kind = detectKind(`${name ?? ""} ${href}`);
      push(kind, prettyUrl(href), href, name && kind === "other" ? name : null);
    }
  } else if (socials && typeof socials === "object") {
    for (const [name, raw] of Object.entries(
      socials as Record<string, unknown>,
    )) {
      const href = asUrl(raw);
      if (!href) continue;
      const kind = detectKind(`${name} ${href}`);
      push(kind, prettyUrl(href), href, kind === "other" ? name : null);
    }
  }

  return out;
}

function fieldError(errors: unknown, field: string): string | null {
  if (!errors || typeof errors !== "object") return null;
  const v = (errors as Record<string, unknown>)[field];
  if (Array.isArray(v)) return asText(v[0]);
  return asText(v);
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

function SendIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.5 6h8M6.5 2.5 10 6 6.5 9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Card({
  children,
  className = "",
  reduceMotion,
}: {
  children: React.ReactNode;
  className?: string;
  reduceMotion: boolean;
}) {
  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const sx = useSpring(mx, { stiffness: 180, damping: 26, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 180, damping: 26, mass: 0.6 });
  const glow = useMotionTemplate`radial-gradient(260px circle at ${sx}px ${sy}px, ${GLOW}cc, transparent 70%)`;

  return (
    <motion.div
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
      className={`group relative overflow-hidden rounded-[20px] ${className}`}
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
      <div className="relative">{children}</div>
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-500 group-focus-within:scale-x-100 group-hover:scale-x-100"
        style={{
          background: BLOOD,
          transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
        }}
      />
    </motion.div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={LABEL_CLASS}
        style={{ fontFamily: TEXT_FONT, color: DUST }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="m-0 mt-2 text-[14px] italic"
          style={{ fontFamily: SERIF_FONT, color: BLOOD }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

const INPUT_CLASS = `mt-2 block w-full rounded-[10px] bg-transparent px-4 py-3 text-[17px] leading-[1.6] placeholder:text-[#9a8060] ${FOCUS}`;

/* ========================================================================== */
/* SECTION                                                                    */
/* ========================================================================== */

export function ContactDefault({ config }: Props) {
  const reduceMotion = !!useReducedMotion();
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");

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
    boxShadow: `inset 0 0 0 1px ${hasError ? BLOOD : KRAFT}`,
  });

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative overflow-hidden px-5 py-24 sm:px-8 md:py-32 lg:px-12"
      style={{ background: PAPER, color: INK }}
    >
      {/* paper atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 84% 92%, ${GLOW}b3, transparent 70%)`,
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
          <Label color={SEPIA}>Correspondence</Label>
          <span
            aria-hidden="true"
            className="h-px flex-1"
            style={{ background: RULE }}
          />
          <Label>No. 001</Label>
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
            Write to me,
            <br />
            <span style={{ color: BLOOD }}>plainly</span> and soon.
          </motion.h2>
          <motion.p
            {...rise(0.14)}
            className="m-0 max-w-[34ch] text-[1.2rem] italic leading-[1.5] sm:text-[1.35rem]"
            style={{ fontFamily: SERIF_FONT, color: SEPIA }}
          >
            {name ? `Send ${name} a note` : "Send a note"} about work,
            collaboration, or anything worth a reply.
          </motion.p>
        </div>

        {/* body */}
        <div className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* directory */}
          {links.length > 0 && (
            <motion.div {...rise(0.1)} className="h-full">
              <Card reduceMotion={reduceMotion} className="h-full p-6 sm:p-8">
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
                  <Label>Directory</Label>
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
                  Where to find me
                </h3>

                <ul
                  className="m-0 mt-6 list-none space-y-3 border-t p-0 pt-5"
                  style={{ borderColor: HAIRLINE }}
                  aria-label="Contact details"
                >
                  {links.map((link) => (
                    <li
                      key={link.key}
                      className="flex items-baseline gap-2"
                    >
                      <span
                        className={LABEL_CLASS}
                        style={{ fontFamily: TEXT_FONT, color: DUST }}
                      >
                        {link.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="min-w-4 flex-1 border-b border-dotted"
                        style={{ borderColor: RULE }}
                      />
                      {link.href ? (
                        <a
                          href={link.href}
                          {...(/^https?:/i.test(link.href)
                            ? {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              }
                            : {})}
                          aria-label={`${link.label}: ${link.value}`}
                          onClick={() => track(link.kind)}
                          className={`inline-flex max-w-[62%] items-center gap-1.5 rounded-sm text-[15px] italic underline decoration-dotted underline-offset-4 ${FOCUS}`}
                          style={{ fontFamily: SERIF_FONT, color: SEPIA }}
                        >
                          <span className="truncate">{link.value}</span>
                          <ArrowIcon />
                        </a>
                      ) : (
                        <span
                          className="max-w-[62%] truncate text-right text-[15px] italic"
                          style={{ fontFamily: SERIF_FONT, color: SEPIA }}
                          title={link.value}
                        >
                          {link.value}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <p
                  className="m-0 mt-8 text-[1.1rem] italic leading-[1.5]"
                  style={{ fontFamily: SERIF_FONT, color: SEPIA }}
                >
                  <span
                    aria-hidden="true"
                    className="mr-1 float-left text-[3.4rem] leading-[0.8]"
                    style={{ color: BLOOD }}
                  >
                    R
                  </span>
                  eplies are written by hand, usually within a couple of days.
                </p>
              </Card>
            </motion.div>
          )}

          {/* letter form */}
          <motion.div
            {...rise(0.18)}
            className={links.length > 0 ? "" : "lg:col-span-2"}
          >
            <Card reduceMotion={reduceMotion} className="p-6 sm:p-8">
              <div className="flex items-center gap-3 pr-6">
                <span
                  className="text-[15px] italic"
                  style={{ fontFamily: SERIF_FONT, color: BLOOD }}
                >
                  {links.length > 0 ? "02" : "01"}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1"
                  style={{ background: HAIRLINE }}
                />
                <Label>New letter</Label>
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
                Compose a message
              </h3>

              <form
                action={formAction}
                noValidate={false}
                aria-label="Contact form"
                className="mt-6 space-y-5 border-t pt-6"
                style={{ borderColor: HAIRLINE }}
              >
                {portfolioId != null && (
                  <input
                    type="hidden"
                    name="portfolioId"
                    value={String(portfolioId)}
                  />
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id={`${uid}-name`} label="Your name" error={nameErr}>
                    <input
                      id={`${uid}-name`}
                      name="name"
                      type="text"
                      required
                      maxLength={120}
                      autoComplete="name"
                      placeholder="Jane Doe"
                      value={values.name}
                      onChange={(e) =>
                        setValues((v) => ({ ...v, name: e.target.value }))
                      }
                      aria-invalid={!!nameErr}
                      aria-describedby={
                        nameErr ? `${uid}-name-error` : undefined
                      }
                      className={INPUT_CLASS}
                      style={inputStyle(!!nameErr)}
                    />
                  </Field>
                  <Field id={`${uid}-email`} label="Your email" error={emailErr}>
                    <input
                      id={`${uid}-email`}
                      name="email"
                      type="email"
                      required
                      maxLength={200}
                      autoComplete="email"
                      placeholder="jane@example.com"
                      value={values.email}
                      onChange={(e) =>
                        setValues((v) => ({ ...v, email: e.target.value }))
                      }
                      aria-invalid={!!emailErr}
                      aria-describedby={
                        emailErr ? `${uid}-email-error` : undefined
                      }
                      className={INPUT_CLASS}
                      style={inputStyle(!!emailErr)}
                    />
                  </Field>
                </div>

                <Field id={`${uid}-message`} label="Message" error={messageErr}>
                  <textarea
                    id={`${uid}-message`}
                    name="message"
                    required
                    rows={6}
                    maxLength={4000}
                    placeholder="Dear friend, I would like to talk about..."
                    value={values.message}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, message: e.target.value }))
                    }
                    aria-invalid={!!messageErr}
                    aria-describedby={
                      messageErr ? `${uid}-message-error` : undefined
                    }
                    className={`${INPUT_CLASS} resize-y`}
                    style={inputStyle(!!messageErr)}
                  />
                </Field>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button
                    type="submit"
                    disabled={isPending}
                    aria-busy={isPending}
                    className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-medium transition-transform duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70 ${FOCUS}`}
                    style={{
                      fontFamily: TEXT_FONT,
                      background: INK,
                      color: PAPER,
                    }}
                  >
                    {isPending ? "Sending…" : "Send message"}
                    {!isPending && <SendIcon />}
                  </button>

                  <div
                    role="status"
                    aria-live="polite"
                    className="min-h-[1.5rem] flex-1"
                  >
                    <AnimatePresence initial={false}>
                      {displayMessage && (
                        <motion.p
                          key={displayMessage.text}
                          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                          transition={{ duration: 0.5, ease: EASE }}
                          className="m-0 flex items-start gap-2 text-[15px] italic leading-[1.4]"
                          style={{
                            fontFamily: SERIF_FONT,
                            color: displayMessage.isSuccess ? SEPIA : BLOOD,
                          }}
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.5em] h-[6px] w-[6px] shrink-0 rounded-full"
                            style={{
                              background: displayMessage.isSuccess
                                ? DUST
                                : BLOOD,
                            }}
                          />
                          {displayMessage.text}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>

        {/* footer strip */}
        <div
          className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t pt-6 md:mt-24"
          style={{ borderColor: RULE }}
        >
          <Label>Orixa / Contact</Label>
          <Label>
            {links.length > 0
              ? `${links.length} ${links.length === 1 ? "channel" : "channels"} open`
              : "Open for letters"}
          </Label>
        </div>
      </div>
    </section>
  );
}

export default ContactDefault;