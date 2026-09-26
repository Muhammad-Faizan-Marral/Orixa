// ======================================================
// FILE: ContactDefault.tsx
// Premium Editorial Contact Section
// Existing Contact + Analytics Logic
// Orange Accent Theme
// ======================================================

"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  sendContactMessage,
  type ContactActionState,
} from "@/actions/contact/send-contact-message";
import { trackContactClick } from "@/features/portfolio/components/use-portfolio-events";
import type { PortfolioRenderConfig } from "@/portfolio-renderer/types";

// ======================================================
// THEME
// ======================================================

const ORANGE = "#ff5a00";
const ORANGE_SOFT = "rgba(255, 90, 0, 0.08)";
const ORANGE_BORDER = "rgba(255, 90, 0, 0.22)";

const ease = [0.22, 1, 0.36, 1] as const;

// ======================================================
// FORM STATE
// ======================================================

const initialState: ContactActionState = {
  success: false,
  message: "",
};

// ======================================================
// TYPES
// ======================================================

type Props = {
  config: PortfolioRenderConfig;
};

type ContactLink = {
  key: string;
  label: string;
  href: string;
  external: boolean;
};

// ======================================================
// HELPERS
// ======================================================

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

// ======================================================
// ICONS
// ======================================================

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M5 15L15 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M7 5H15V13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 10H15"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M10.5 5.5L15 10L10.5 14.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ======================================================
// COMPONENT
// ======================================================

export function ContactDefault({ config }: Props) {
  const portfolioId = config?.portfolioId;
  const name = config?.name?.trim() || "";
  const links = buildLinks(config);

  // ====================================================
  // CONTACT FORM
  // ====================================================

  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState,
  );

  const [displayMessage, setDisplayMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  // Prevent repeated analytics events
  // from multiple interactions in the same render.
  const contactTrackedRef = useRef(false);

  // ====================================================
  // TRACK CONTACT INTERACTION
  // ====================================================

  const handleContactInteraction = () => {
    if (!portfolioId) return;
    if (contactTrackedRef.current) return;

    contactTrackedRef.current = true;

    trackContactClick(portfolioId);
  };

  // ====================================================
  // FORM RESPONSE
  // ====================================================

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

  // ====================================================
  // NOTHING TO RENDER
  // ====================================================

  if (!portfolioId && links.length === 0) {
    return null;
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative w-full overflow-hidden"
      style={{
        fontFamily: "var(--pr-font)",
      }}
    >
      {/* ==================================================
          TOP EDGE
      ================================================== */}

      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(
            to right,
            ${ORANGE},
            ${ORANGE_BORDER} 32%,
            var(--pr-border) 65%,
            transparent
          )`,
        }}
      />

      <div className="py-24 sm:py-28 lg:py-36">
        {/* ==================================================
            HEADER
        ================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 0.8,
            ease,
          }}
          className="mb-20"
        >
          <div className="mb-8 flex items-center gap-3">
            <span
              className="h-1.5 w-1.5 shrink-0"
              style={{
                backgroundColor: ORANGE,
              }}
            />

            <span
              className="text-[10px] font-semibold uppercase tracking-[0.3em]"
              style={{
                color: "var(--pr-muted, var(--muted-foreground))",
              }}
            >
              Contact
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <h2
                className="
                  max-w-5xl
                  text-[clamp(4rem,10vw,9rem)]
                  font-medium
                  leading-[0.78]
                  tracking-[-0.085em]
                "
              >
                Let&apos;s
                <br />
                <span
                  style={{
                    color: ORANGE,
                  }}
                >
                  talk.
                </span>
              </h2>
            </div>

            <div className="lg:pb-3">
              <p
                className="max-w-xs text-sm leading-7"
                style={{
                  color: "var(--pr-muted, var(--muted-foreground))",
                }}
              >
                Have a project, opportunity or idea worth discussing? Send a
                message and let&apos;s start a conversation.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ==================================================
            CONTACT CONTENT
        ================================================== */}

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              margin: "-80px",
            }}
            transition={{
              duration: 0.8,
              ease,
            }}
            className="lg:col-span-4"
          >
            {/* Availability */}
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="h-px w-8"
                  style={{
                    backgroundColor: ORANGE,
                  }}
                />

                <span
                  className="text-[9px] font-semibold uppercase tracking-[0.24em]"
                  style={{
                    color: "var(--pr-muted, var(--muted-foreground))",
                  }}
                >
                  Available for
                </span>
              </div>

              <p
                className="max-w-sm text-xl leading-8 tracking-[-0.025em]"
                style={{
                  color: "var(--pr-foreground)",
                }}
              >
                Roles, freelance projects, collaborations and interesting
                conversations.
              </p>
            </div>

            {/* Orange info block */}
            <div
              className="mt-14 border p-6"
              style={{
                backgroundColor: ORANGE_SOFT,
                borderColor: ORANGE_BORDER,
                borderRadius: "var(--pr-radius)",
              }}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <span
                    className="text-[9px] font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: ORANGE,
                    }}
                  >
                    Get in touch
                  </span>

                  <p
                    className="mt-4 text-sm leading-6"
                    style={{
                      color: "var(--pr-muted, var(--muted-foreground))",
                    }}
                  >
                    {name
                      ? `Send a message directly to ${name}.`
                      : "Send a message directly through this portfolio."}
                  </p>
                </div>

                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: ORANGE,
                    color: "#fff",
                  }}
                >
                  <ArrowUpRightIcon />
                </div>
              </div>
            </div>

            {/* ==================================================
                SOCIAL / CONTACT LINKS
            ================================================== */}

            {links.length > 0 && (
              <div className="mt-14">
                <div
                  className="mb-4 flex items-center justify-between border-b pb-3"
                  style={{
                    borderColor: "var(--pr-border)",
                  }}
                >
                  <span
                    className="text-[9px] font-semibold uppercase tracking-[0.22em]"
                    style={{
                      color: "var(--pr-muted, var(--muted-foreground))",
                    }}
                  >
                    Elsewhere
                  </span>

                  <span
                    className="text-[9px] tabular-nums"
                    style={{
                      color: "var(--pr-muted, var(--muted-foreground))",
                    }}
                  >
                    {String(links.length).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  {links.map((link, index) => (
                    <motion.a
                      key={link.key}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      onClick={handleContactInteraction}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: Math.min(index * 0.06, 0.25),
                        ease,
                      }}
                      className="group flex items-center justify-between border-b py-4"
                      style={{
                        borderColor: "var(--pr-border)",
                      }}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span
                          className="text-[9px] tabular-nums"
                          style={{
                            color: "var(--pr-muted, var(--muted-foreground))",
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                          className="truncate text-sm font-medium transition-colors duration-300"
                          style={{
                            color: "var(--pr-foreground)",
                          }}
                        >
                          {link.label}
                        </span>
                      </div>

                      <span
                        className="shrink-0 transition-all duration-300 group-hover:translate-x-1"
                        style={{
                          color: "var(--pr-muted, var(--muted-foreground))",
                        }}
                      >
                        <ArrowRightIcon />
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* ==================================================
              RIGHT — FORM
          ================================================== */}

          {portfolioId ? (
            <motion.form
              ref={formRef}
              action={formAction}
              onFocus={handleContactInteraction}
              initial={{
                opacity: 0,
                x: 30,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                margin: "-80px",
              }}
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease,
              }}
              className="relative lg:col-span-8"
            >
              {/* ==================================================
                  FORM TOP
              ================================================== */}

              <div
                className="mb-8 flex items-end justify-between border-b pb-5"
                style={{
                  borderColor: "var(--pr-border)",
                }}
              >
                <div>
                  <span
                    className="text-[9px] font-semibold uppercase tracking-[0.24em]"
                    style={{
                      color: "var(--pr-muted, var(--muted-foreground))",
                    }}
                  >
                    Send a message
                  </span>

                  <h3
                    className="mt-3 text-2xl font-medium tracking-[-0.04em] sm:text-3xl"
                    style={{
                      color: "var(--pr-foreground)",
                    }}
                  >
                    Start something.
                  </h3>
                </div>

                <span
                  className="hidden border px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.2em] sm:block"
                  style={{
                    color: ORANGE,
                    borderColor: ORANGE_BORDER,
                    backgroundColor: ORANGE_SOFT,
                    borderRadius: "999px",
                  }}
                >
                  Open
                </span>
              </div>

              <input type="hidden" name="portfolioId" value={portfolioId} />

              {/* ==================================================
                  HONEYPOT
              ================================================== */}

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

              {/* ==================================================
                  FORM FIELDS
              ================================================== */}

              <div className="space-y-8">
                {/* NAME + EMAIL */}
                <div className="grid gap-8 sm:grid-cols-2">
                  {/* NAME */}
                  <div>
                    <label
                      htmlFor="visitorName-contact"
                      className="mb-3 block text-[9px] font-semibold uppercase tracking-[0.2em]"
                      style={{
                        color: "var(--pr-muted, var(--muted-foreground))",
                      }}
                    >
                      01 / Name
                    </label>

                    <input
                      id="visitorName-contact"
                      name="visitorName"
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      autoComplete="name"
                      placeholder="Your name"
                      className="
                        w-full
                        border-0
                        border-b
                        bg-transparent
                        px-0
                        py-3
                        text-base
                        outline-none
                        transition-colors
                        duration-300
                        placeholder:opacity-40
                        focus:ring-0
                      "
                      style={{
                        borderColor: "var(--pr-border)",
                        color: "var(--pr-foreground)",
                      }}
                      onFocus={handleContactInteraction}
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="visitorEmail-contact"
                      className="mb-3 block text-[9px] font-semibold uppercase tracking-[0.2em]"
                      style={{
                        color: "var(--pr-muted, var(--muted-foreground))",
                      }}
                    >
                      02 / Email
                    </label>

                    <input
                      id="visitorEmail-contact"
                      name="visitorEmail"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="
                        w-full
                        border-0
                        border-b
                        bg-transparent
                        px-0
                        py-3
                        text-base
                        outline-none
                        transition-colors
                        duration-300
                        placeholder:opacity-40
                        focus:ring-0
                      "
                      style={{
                        borderColor: "var(--pr-border)",
                        color: "var(--pr-foreground)",
                      }}
                      onFocus={handleContactInteraction}
                    />
                  </div>
                </div>

                {/* SUBJECT */}
                <div>
                  <label
                    htmlFor="subject-contact"
                    className="mb-3 block text-[9px] font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: "var(--pr-muted, var(--muted-foreground))",
                    }}
                  >
                    03 / Subject
                  </label>

                  <input
                    id="subject-contact"
                    name="subject"
                    type="text"
                    maxLength={200}
                    placeholder="What's this about?"
                    className="
                      w-full
                      border-0
                      border-b
                      bg-transparent
                      px-0
                      py-3
                      text-base
                      outline-none
                      transition-colors
                      duration-300
                      placeholder:opacity-40
                      focus:ring-0
                    "
                    style={{
                      borderColor: "var(--pr-border)",
                      color: "var(--pr-foreground)",
                    }}
                    onFocus={handleContactInteraction}
                  />
                </div>

                {/* MESSAGE */}
                <div>
                  <label
                    htmlFor="message-contact"
                    className="mb-3 block text-[9px] font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: "var(--pr-muted, var(--muted-foreground))",
                    }}
                  >
                    04 / Message
                  </label>

                  <textarea
                    id="message-contact"
                    name="message"
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={6}
                    placeholder="Tell me a little about your project..."
                    className="
                      w-full
                      resize-none
                      border-0
                      border-b
                      bg-transparent
                      px-0
                      py-3
                      text-base
                      leading-7
                      outline-none
                      transition-colors
                      duration-300
                      placeholder:opacity-40
                      focus:ring-0
                    "
                    style={{
                      borderColor: "var(--pr-border)",
                      color: "var(--pr-foreground)",
                    }}
                    onFocus={handleContactInteraction}
                  />
                </div>

                {/* ==================================================
                    STATUS MESSAGE
                ================================================== */}

                {displayMessage?.text && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    role="status"
                    className="border px-4 py-3 text-sm"
                    style={{
                      color: displayMessage.isSuccess
                        ? "rgb(16 185 129)"
                        : "rgb(239 68 68)",
                      backgroundColor: displayMessage.isSuccess
                        ? "rgba(16, 185, 129, 0.06)"
                        : "rgba(239, 68, 68, 0.06)",
                      borderColor: displayMessage.isSuccess
                        ? "rgba(16, 185, 129, 0.18)"
                        : "rgba(239, 68, 68, 0.18)",
                      borderRadius: "var(--pr-radius)",
                    }}
                  >
                    {displayMessage.text}
                  </motion.div>
                )}

                {/* ==================================================
                    SUBMIT AREA
                ================================================== */}

                <div className="flex flex-col gap-6 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className="max-w-xs text-[10px] leading-5"
                    style={{
                      color: "var(--pr-muted, var(--muted-foreground))",
                    }}
                  >
                    Your message will be delivered directly
                    {name ? ` to ${name}` : " to the portfolio owner"}.
                  </p>

                  <motion.button
                    type="submit"
                    disabled={isPending}
                    whileHover={{
                      scale: isPending ? 1 : 1.015,
                    }}
                    whileTap={{
                      scale: isPending ? 1 : 0.985,
                    }}
                    className="
                      group
                      flex
                      min-w-[190px]
                      items-center
                      justify-center
                      gap-4
                      px-7
                      py-4
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-white
                      transition-all
                      duration-300
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                    style={{
                      backgroundColor: ORANGE,
                      borderRadius: "var(--pr-radius)",
                      boxShadow: "0 12px 30px rgba(255, 90, 0, 0.16)",
                    }}
                  >
                    <span>{isPending ? "Sending..." : "Send message"}</span>

                    {!isPending && (
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        <ArrowRightIcon />
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.form>
          ) : (
            <div className="lg:col-span-8">
              <div
                className="border p-6 sm:p-8"
                style={{
                  borderColor: ORANGE_BORDER,
                  backgroundColor: ORANGE_SOFT,
                  borderRadius: "var(--pr-radius)",
                }}
              >
                <span
                  className="text-[9px] font-semibold uppercase tracking-[0.22em]"
                  style={{
                    color: ORANGE,
                  }}
                >
                  Contact
                </span>

                <p
                  className="mt-4 text-sm leading-7"
                  style={{
                    color: "var(--pr-muted, var(--muted-foreground))",
                  }}
                >
                  Direct messaging is not available for this portfolio.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================
            BOTTOM SIGNATURE
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          className="mt-24 flex items-center gap-4"
        >
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, var(--pr-border), transparent)",
            }}
          />

          <span
            className="text-[9px] uppercase tracking-[0.24em]"
            style={{
              color: "var(--pr-muted, var(--muted-foreground))",
            }}
          >
            Start a conversation
          </span>

          <div
            className="h-px w-10"
            style={{
              backgroundColor: ORANGE,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

export default ContactDefault;
