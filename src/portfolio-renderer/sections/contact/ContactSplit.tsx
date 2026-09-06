"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  sendContactMessage,
  type ContactActionState,
} from "@/actions/contact/send-contact-message";
import type { PortfolioRenderConfig } from "../../types";

const initialState: ContactActionState = {
  success: false,
  message: "",
};

export type ContactSplitProps = {
  config: PortfolioRenderConfig;
};

type ContactLink = {
  key: string;
  label: string;
  href: string;
  external: boolean;
};

function buildLinks(config: ContactSplitProps["config"]): ContactLink[] {
  const links: ContactLink[] = [];

  if (config?.phone) {
    links.push({
      key: "phone",
      label: config.phone,
      href: `tel:${config.phone.replace(/[^\d+]/g, "")}`,
      external: false,
    });
  }

  if (config?.linkedinUrl) {
    links.push({
      key: "linkedin",
      label: "LinkedIn",
      href: config.linkedinUrl,
      external: true,
    });
  }

  if (config?.githubUrl) {
    links.push({
      key: "github",
      label: "GitHub",
      href: config.githubUrl,
      external: true,
    });
  }

  if (config?.resumeUrl) {
    links.push({
      key: "resume",
      label: "Resume",
      href: config.resumeUrl,
      external: true,
    });
  }

  return links;
}

export const ContactSplit: React.FC<ContactSplitProps> = ({ config }) => {
  const portfolioId = config?.portfolioId;
  const links = buildLinks(config);
  const name = config?.name?.trim() || undefined;

  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState,
  );

  const [displayMessage, setDisplayMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

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

  if (!portfolioId && links.length === 0) return null;

  return (
    <section aria-label="Contact" className="w-full py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Contact
          </h2>
          <div
            className="mt-3 h-1 w-12 rounded-full"
            style={{ backgroundColor: "var(--pr-accent)" }}
            aria-hidden="true"
          />
        </div>

        <div
          className="grid grid-cols-1 gap-8 border border-border bg-surface p-6 sm:gap-10 sm:p-10 md:grid-cols-2 md:gap-12"
          style={{
            borderRadius: "var(--pr-radius)",
            boxShadow: "var(--pr-card-shadow)",
          }}
        >
          {/* Left Column: Info & Links */}
          <div className="flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                {name ? `Let's connect, I'm ${name}` : "Let's connect"}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Reach out through any of the channels below or send a direct
                message — happy to talk about roles, projects, or collaboration.
              </p>
            </div>

            {links.length > 0 && (
              <div className="flex flex-col gap-3 sm:gap-3.5">
                {links.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group flex items-center justify-between gap-3 border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-[var(--pr-accent)] sm:px-5 sm:py-3.5 sm:text-base"
                    style={{ borderRadius: "var(--pr-radius)" }}
                  >
                    <span className="truncate">{link.label}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
                      style={{ color: "var(--pr-accent)" }}
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Contact Form */}
          {portfolioId ? (
            <form
              ref={formRef}
              action={formAction}
              className="relative flex flex-col gap-4 border border-border bg-background/50 p-5 sm:p-6"
              style={{ borderRadius: "var(--pr-radius)" }}
            >
              <input type="hidden" name="portfolioId" value={portfolioId} />

              {/* Honeypot field for anti-spam protection */}
              <div
                aria-hidden="true"
                className="absolute -left-[9999px] h-px w-px overflow-hidden"
              >
                <label htmlFor="website-split">Website</label>
                <input
                  id="website-split"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="visitorName-split"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Name
                </label>
                <input
                  id="visitorName-split"
                  name="visitorName"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Your name"
                  className="w-full border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[var(--pr-accent)]"
                  style={{ borderRadius: "var(--pr-radius)" }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="visitorEmail-split"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Email
                </label>
                <input
                  id="visitorEmail-split"
                  name="visitorEmail"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[var(--pr-accent)]"
                  style={{ borderRadius: "var(--pr-radius)" }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="subject-split"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Subject
                </label>
                <input
                  id="subject-split"
                  name="subject"
                  type="text"
                  maxLength={200}
                  placeholder="Optional subject"
                  className="w-full border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[var(--pr-accent)]"
                  style={{ borderRadius: "var(--pr-radius)" }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="message-split"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message-split"
                  name="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={4}
                  placeholder="Your message..."
                  className="w-full resize-none border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[var(--pr-accent)]"
                  style={{ borderRadius: "var(--pr-radius)" }}
                />
              </div>

              {/* Status Message (Auto-dismisses after 5s) */}
              {displayMessage?.text && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  className={`text-sm ${
                    displayMessage.isSuccess ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {displayMessage.text}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={isPending}
                whileHover={{ scale: isPending ? 1 : 1.01 }}
                whileTap={{ scale: isPending ? 1 : 0.99 }}
                className="mt-2 w-full py-2.5 text-sm font-semibold text-white transition-opacity duration-200 disabled:opacity-60"
                style={{
                  backgroundColor: "var(--pr-accent)",
                  borderRadius: "var(--pr-radius)",
                  opacity: isPending ? 0.6 : 1,
                }}
              >
                {isPending ? "Sending..." : "Send message"}
              </motion.button>
            </form>
          ) : null}
        </div>
      </div>
    </section>
  );
};