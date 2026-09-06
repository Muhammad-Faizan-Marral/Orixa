"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  sendContactMessage,
  type ContactActionState,
} from "@/actions/contact/send-contact-message";
import { SectionHeading } from "../../shared/SectionHeading";
import type { PortfolioRenderConfig } from "../../types";

const initialState: ContactActionState = {
  success: false,
  message: "",
};

export function ContactSimple({ config }: { config: PortfolioRenderConfig }) {
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

  const hasLinks =
    config?.phone || config?.linkedinUrl || config?.githubUrl || config?.resumeUrl;

  if (!portfolioId && !hasLinks) return null;

  return (
    <div className="w-full space-y-6">
      <SectionHeading title="Contact" />

      {/* Direct Contact Links */}
      {hasLinks && (
        <div className="flex flex-wrap gap-3">
          {config?.phone && (
            <a
              href={`tel:${config.phone}`}
              className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              {config.phone}
            </a>
          )}
          {config?.linkedinUrl && (
            <a
              href={config.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              LinkedIn
            </a>
          )}
          {config?.githubUrl && (
            <a
              href={config.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              GitHub
            </a>
          )}
          {config?.resumeUrl && (
            <a
              href={config.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--pr-accent, #6c5cff)" }}
            >
              Resume
            </a>
          )}
        </div>
      )}

      {/* Form Submission Section */}
      {portfolioId && (
        <form
          ref={formRef}
          action={formAction}
          className="relative space-y-4 rounded-lg border border-border bg-surface p-5 sm:p-6"
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
            <label htmlFor="website-simple">Website</label>
            <input
              id="website-simple"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="visitorName"
              type="text"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              placeholder="Name"
              className="w-full border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-[var(--pr-accent)]"
              style={{ borderRadius: "var(--pr-radius)" }}
            />
            <input
              name="visitorEmail"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="Email"
              className="w-full border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-[var(--pr-accent)]"
              style={{ borderRadius: "var(--pr-radius)" }}
            />
          </div>

          <input
            name="subject"
            type="text"
            maxLength={200}
            placeholder="Subject (optional)"
            className="w-full border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-[var(--pr-accent)]"
            style={{ borderRadius: "var(--pr-radius)" }}
          />

          <textarea
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={4}
            placeholder="Your message..."
            className="w-full resize-none border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-[var(--pr-accent)]"
            style={{ borderRadius: "var(--pr-radius)" }}
          />

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
            className="px-5 py-2.5 text-sm font-semibold text-white transition-opacity duration-200 disabled:opacity-60"
            style={{
              backgroundColor: "var(--pr-accent)",
              borderRadius: "var(--pr-radius)",
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {isPending ? "Sending..." : "Send Message"}
          </motion.button>
        </form>
      )}
    </div>
  );
}