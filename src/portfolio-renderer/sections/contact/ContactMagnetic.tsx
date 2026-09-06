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

export function ContactMagnetic({ config }: { config: PortfolioRenderConfig }) {
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

  if (!portfolioId) {
    return (
      <div className="text-sm text-muted-foreground">
        Contact form is not available.
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 space-y-3 sm:mb-12"
      >
        <p
          className="text-[11px] font-medium uppercase tracking-[0.3em]"
          style={{ color: "var(--pr-accent)" }}
        >
          Get in touch
        </p>
        <h2
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ letterSpacing: "var(--pr-heading-tracking)" }}
        >
          Let&apos;s work together
        </h2>
        <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
          Have a project in mind or just want to say hello? Drop a message —
          I&apos;ll get back to you soon.
        </p>
      </motion.div>

      <motion.form
        ref={formRef}
        action={formAction}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="relative overflow-hidden border border-border bg-surface p-6 sm:p-8"
        style={{
          borderRadius: "var(--pr-radius)",
          boxShadow: "var(--pr-card-shadow)",
        }}
      >
        <input type="hidden" name="portfolioId" value={portfolioId} />

        {/* Honeypot field for anti-spam protection */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor="website-magnetic">Website</label>
          <input
            id="website-magnetic"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="visitorName-magnetic"
              className="text-sm font-medium"
            >
              Name
            </label>
            <input
              id="visitorName-magnetic"
              name="visitorName"
              type="text"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              placeholder="Your name"
              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--pr-accent)]"
              style={{ borderRadius: "var(--pr-radius)" }}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="visitorEmail-magnetic"
              className="text-sm font-medium"
            >
              Email
            </label>
            <input
              id="visitorEmail-magnetic"
              name="visitorEmail"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--pr-accent)]"
              style={{ borderRadius: "var(--pr-radius)" }}
            />
          </div>
        </div>

        <div className="mt-5 space-y-1.5">
          <label htmlFor="subject-magnetic" className="text-sm font-medium">
            Subject <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="subject-magnetic"
            name="subject"
            type="text"
            maxLength={200}
            placeholder="What's this about?"
            className="w-full border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--pr-accent)]"
            style={{ borderRadius: "var(--pr-radius)" }}
          />
        </div>

        <div className="mt-5 space-y-1.5">
          <label htmlFor="message-magnetic" className="text-sm font-medium">
            Message
          </label>
          <textarea
            id="message-magnetic"
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            placeholder="Tell me about your project or idea..."
            className="w-full resize-none border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--pr-accent)]"
            style={{ borderRadius: "var(--pr-radius)" }}
          />
        </div>

        {/* Status Message (Auto-dismisses after 5s) */}
        {displayMessage?.text && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className={`mt-4 text-sm ${
              displayMessage.isSuccess ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {displayMessage.text}
          </motion.p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <motion.button
            type="submit"
            disabled={isPending}
            whileHover={{ scale: isPending ? 1 : 1.03 }}
            whileTap={{ scale: isPending ? 1 : 0.98 }}
            className="inline-flex items-center justify-center px-7 py-3 text-sm font-semibold text-white transition-opacity duration-200 disabled:opacity-60"
            style={{
              backgroundColor: "var(--pr-accent)",
              borderRadius: "var(--pr-radius)",
              boxShadow: "0 12px 32px -12px var(--pr-accent)",
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {isPending ? "Sending..." : "Send Message"}
          </motion.button>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {config?.linkedinUrl && (
              <a
                href={config.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                LinkedIn
              </a>
            )}
            {config?.githubUrl && (
              <a
                href={config.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </motion.form>
    </div>
  );
}