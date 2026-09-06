"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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

export function ContactSplitMotion({
  config,
}: {
  config: PortfolioRenderConfig;
}) {
  const portfolioId = config.portfolioId;
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState,
  );

  // Message aur display state ko manage karne ke liye
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

    // Response message show karo
    setDisplayMessage({
      text: state.message,
      isSuccess: state.success,
    });

    // Message ko 5 seconds baad auto-remove kar do
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

  const name = config.name?.trim();

  return (
    <div className="w-full">
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Left — Statement */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="space-y-3">
            <p
              className="text-[11px] font-medium uppercase tracking-[0.3em]"
              style={{ color: "var(--pr-accent)" }}
            >
              Contact
            </p>
            <h2
              className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
              style={{ letterSpacing: "var(--pr-heading-tracking)" }}
            >
              {name ? `Say hello to ${name}` : "Let's connect"}
            </h2>
          </div>

          <p
            className="max-w-sm text-sm text-muted-foreground sm:text-base"
            style={{ lineHeight: "var(--pr-body-leading)" }}
          >
            Whether you have a question, a collaboration idea, or just want to
            chat — I&apos;m always open to interesting conversations.
          </p>

          <div className="space-y-3 pt-2">
            {config.phone && (
              <a
                href={`tel:${config.phone}`}
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "var(--pr-accent)" }}
                />
                {config.phone}
              </a>
            )}
            {config.linkedinUrl && (
              <a
                href={config.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "var(--pr-accent)" }}
                />
                LinkedIn
              </a>
            )}
            {config.githubUrl && (
              <a
                href={config.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "var(--pr-accent)" }}
                />
                GitHub
              </a>
            )}
          </div>
        </motion.div>

        {/* Right — Form */}
        <motion.form
          ref={formRef}
          action={formAction}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 space-y-4 border border-border bg-surface p-6 sm:p-8"
          style={{
            borderRadius: "var(--pr-radius)",
            boxShadow: "var(--pr-card-shadow)",
          }}
        >
          <input type="hidden" name="portfolioId" value={portfolioId} />

          {/* Honeypot field for bot protection */}
          <div
            aria-hidden="true"
            className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0"
            style={{ position: "absolute", left: "-10000px" }}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="visitorName-split"
                className="text-sm font-medium"
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
                className="w-full border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--pr-accent)]"
                style={{ borderRadius: "var(--pr-radius)" }}
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="visitorEmail-split"
                className="text-sm font-medium"
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
                className="w-full border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--pr-accent)]"
                style={{ borderRadius: "var(--pr-radius)" }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="subject-split" className="text-sm font-medium">
              Subject
            </label>
            <input
              id="subject-split"
              name="subject"
              type="text"
              maxLength={200}
              placeholder="Optional"
              className="w-full border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--pr-accent)]"
              style={{ borderRadius: "var(--pr-radius)" }}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message-split" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message-split"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              placeholder="Your message..."
              className="w-full resize-none border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--pr-accent)]"
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
            whileHover={{ scale: isPending ? 1 : 1.02 }}
            whileTap={{ scale: isPending ? 1 : 0.98 }}
            className="w-full py-3.5 text-sm font-semibold text-white disabled:opacity-60 sm:w-auto sm:px-8"
            style={{
              backgroundColor: "var(--pr-accent)",
              borderRadius: "var(--pr-radius)",
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {isPending ? "Sending..." : "Send Message"}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}
