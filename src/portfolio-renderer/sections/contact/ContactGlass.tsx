"use client";

import React, {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";

import {
  sendContactMessage,
  type ContactActionState,
} from "@/actions/contact/send-contact-message";

import type { PortfolioRenderConfig } from "../../types";

import { trackContactClick } from "@/features/portfolio/components/use-portfolio-events";

const initialState: ContactActionState = {
  success: false,
  message: "",
};

type ContactConfig = {
  linkedinUrl?: string;
  githubUrl?: string;
  phone?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className="h-3.5 w-3.5"
    >
      <path
        d="M4 12L12 4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M6 4H12V10"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M3 8H12"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M9 4.5L12.5 8L9 11.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ContactGlass({
  config,
}: {
  config: PortfolioRenderConfig;
}) {
  const portfolioId = config?.portfolioId;

  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState,
  );

  const [displayMessage, setDisplayMessage] = useState<{
    text: string;
    isSuccess: boolean;
  } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  /*
   * Contact details are optional.
   *
   * Expected config shape:
   *
   * config.contact?.linkedinUrl
   * config.contact?.githubUrl
   * config.contact?.phone
   *
   * If your actual config stores these somewhere else,
   * only change these three lines.
   */
  const contact = (
    config as PortfolioRenderConfig & {
      contact?: ContactConfig;
    }
  )?.contact;

  const linkedinUrl = contact?.linkedinUrl?.trim();
  const githubUrl = contact?.githubUrl?.trim();
  const phone = contact?.phone?.trim();

  const hasContactLinks = Boolean(linkedinUrl || githubUrl || phone);

  useEffect(() => {
    if (!state.message) return;

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

    return () => window.clearTimeout(timer);
  }, [state]);

  const handleContactClick = () => {
    if (!portfolioId) return;

    trackContactClick(portfolioId);
  };

  if (!portfolioId) {
    return (
      <div
        className="text-sm"
        style={{ color: "var(--pr-muted)" }}
      >
        Contact form is not available.
      </div>
    );
  }

  return (
    <section
      aria-label="Contact"
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
    >
      {/* ------------------------------------------------------------
          INTRO
      ------------------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease }}
        className="border-t pt-8 sm:pt-10"
        style={{ borderColor: "var(--pr-border)" }}
      >
        <div className="grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-12">
          <div className="flex items-start gap-3">
            <span
              className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--pr-accent)" }}
            />

            <span
              className="text-[10px] font-medium uppercase tracking-[0.28em]"
              style={{ color: "var(--pr-muted)" }}
            >
              Contact
            </span>
          </div>

          <div className="max-w-4xl">
            <h2
              className="text-[clamp(3rem,8vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.055em]"
              style={{
                letterSpacing: "var(--pr-heading-tracking)",
              }}
            >
              Let&apos;s
              <br />
              <span style={{ color: "var(--pr-accent)" }}>
                talk.
              </span>
            </h2>

            <p
              className="mt-8 max-w-lg text-sm leading-7 sm:text-base"
              style={{ color: "var(--pr-muted)" }}
            >
              Have a project, opportunity, or simply want to connect?
              Send a message and I&apos;ll get back to you.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ------------------------------------------------------------
          CONTACT LINKS
      ------------------------------------------------------------- */}
      {hasContactLinks && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.08, ease }}
          className="mt-12 lg:ml-[180px] lg:mt-16"
        >
          <div
            className="grid border-y sm:grid-cols-3"
            style={{ borderColor: "var(--pr-border)" }}
          >
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleContactClick}
                className="group flex items-center justify-between border-b px-0 py-5 transition-colors duration-300 hover:text-[var(--pr-accent)] sm:border-b-0 sm:border-r sm:px-6"
                style={{
                  borderColor: "var(--pr-border)",
                }}
                aria-label="Open LinkedIn profile"
              >
                <span>
                  <span
                    className="block text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: "var(--pr-muted)" }}
                  >
                    Connect
                  </span>

                  <span className="mt-1 block text-sm font-medium">
                    LinkedIn
                  </span>
                </span>

                <span
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  style={{ color: "var(--pr-accent)" }}
                >
                  <ArrowUpRight />
                </span>
              </a>
            )}

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleContactClick}
                className="group flex items-center justify-between border-b px-0 py-5 transition-colors duration-300 hover:text-[var(--pr-accent)] sm:border-b-0 sm:border-r sm:px-6"
                style={{
                  borderColor: "var(--pr-border)",
                }}
                aria-label="Open GitHub profile"
              >
                <span>
                  <span
                    className="block text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: "var(--pr-muted)" }}
                  >
                    Explore
                  </span>

                  <span className="mt-1 block text-sm font-medium">
                    GitHub
                  </span>
                </span>

                <span
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  style={{ color: "var(--pr-accent)" }}
                >
                  <ArrowUpRight />
                </span>
              </a>
            )}

            {phone && (
              <a
                href={`tel:${phone}`}
                onClick={handleContactClick}
                className="group flex items-center justify-between px-0 py-5 transition-colors duration-300 hover:text-[var(--pr-accent)] sm:px-6"
                aria-label="Call phone number"
              >
                <span>
                  <span
                    className="block text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: "var(--pr-muted)" }}
                  >
                    Call
                  </span>

                  <span className="mt-1 block text-sm font-medium">
                    {phone}
                  </span>
                </span>

                <span
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: "var(--pr-accent)" }}
                >
                  <ArrowRight />
                </span>
              </a>
            )}
          </div>
        </motion.div>
      )}

      {/* ------------------------------------------------------------
          MESSAGE FORM
      ------------------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, delay: 0.12, ease }}
        className="mt-16 lg:ml-[180px] lg:mt-20"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(180px,0.35fr)_minmax(0,1fr)] lg:gap-14">
          {/* Form label */}
          <div>
            <p
              className="text-[10px] font-medium uppercase tracking-[0.25em]"
              style={{ color: "var(--pr-muted)" }}
            >
              Send a message
            </p>

            <p
              className="mt-4 max-w-[220px] text-xs leading-6"
              style={{ color: "var(--pr-muted)" }}
            >
              Tell me a little about what you&apos;re working on.
            </p>
          </div>

          {/* Form */}
          <form
            ref={formRef}
            action={formAction}
            className="w-full"
          >
            <input
              type="hidden"
              name="portfolioId"
              value={portfolioId}
            />

            {/* Honeypot */}
            <div
              aria-hidden="true"
              className="absolute -left-[9999px] h-px w-px overflow-hidden"
            >
              <label htmlFor="website-editorial">
                Website
              </label>

              <input
                id="website-editorial"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <label className="group block">
                <span
                  className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em]"
                  style={{ color: "var(--pr-muted)" }}
                >
                  Name
                </span>

                <input
                  name="visitorName"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Your name"
                  className="w-full border-0 border-b bg-transparent px-0 py-3 text-sm outline-none transition placeholder:opacity-40 focus:border-[var(--pr-accent)]"
                  style={{
                    borderBottom:
                      "1px solid var(--pr-border)",
                  }}
                />
              </label>

              <label className="group block">
                <span
                  className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em]"
                  style={{ color: "var(--pr-muted)" }}
                >
                  Email
                </span>

                <input
                  name="visitorEmail"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full border-0 border-b bg-transparent px-0 py-3 text-sm outline-none transition placeholder:opacity-40 focus:border-[var(--pr-accent)]"
                  style={{
                    borderBottom:
                      "1px solid var(--pr-border)",
                  }}
                />
              </label>
            </div>

            <label className="mt-8 block">
              <span
                className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em]"
                style={{ color: "var(--pr-muted)" }}
              >
                Subject
              </span>

              <input
                name="subject"
                type="text"
                maxLength={200}
                placeholder="What would you like to discuss?"
                className="w-full border-0 border-b bg-transparent px-0 py-3 text-sm outline-none transition placeholder:opacity-40 focus:border-[var(--pr-accent)]"
                style={{
                  borderBottom:
                    "1px solid var(--pr-border)",
                }}
              />
            </label>

            <label className="mt-8 block">
              <span
                className="mb-2 block text-[10px] font-medium uppercase tracking-[0.2em]"
                style={{ color: "var(--pr-muted)" }}
              >
                Message
              </span>

              <textarea
                name="message"
                required
                minLength={10}
                maxLength={5000}
                rows={5}
                placeholder="Write your message..."
                className="w-full resize-none border-0 border-b bg-transparent px-0 py-3 text-sm leading-7 outline-none transition placeholder:opacity-40 focus:border-[var(--pr-accent)]"
                style={{
                  borderBottom:
                    "1px solid var(--pr-border)",
                }}
              />
            </label>

            {/* Status */}
            {displayMessage?.text && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                role="status"
                aria-live="polite"
                className="mt-5 text-sm"
                style={{
                  color: displayMessage.isSuccess
                    ? "var(--pr-accent)"
                    : "var(--pr-foreground)",
                }}
              >
                {displayMessage.text}
              </motion.p>
            )}

            <div className="mt-8 flex items-center justify-between gap-6">
              <span
                className="hidden text-[10px] uppercase tracking-[0.18em] sm:block"
                style={{ color: "var(--pr-muted)" }}
              >
                Usually replies within 24–48 hours
              </span>

              <motion.button
                type="submit"
                disabled={isPending}
                whileHover={{
                  x: isPending ? 0 : 4,
                }}
                whileTap={{
                  scale: isPending ? 1 : 0.98,
                }}
                className="group ml-auto inline-flex items-center gap-3 border-b pb-2 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  borderColor: "var(--pr-accent)",
                }}
              >
                <span>
                  {isPending ? "Sending..." : "Send message"}
                </span>

                {!isPending && (
                  <span
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    style={{
                      color: "var(--pr-accent)",
                    }}
                  >
                    <ArrowRight />
                  </span>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* ------------------------------------------------------------
          CLOSING LINE
      ------------------------------------------------------------- */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.2, ease }}
        className="mt-16 h-px origin-left sm:mt-24"
        style={{
          background:
            "linear-gradient(90deg, var(--pr-accent), transparent)",
        }}
      />
    </section>
  );
}
