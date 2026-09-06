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

export function ContactGlass({ config }: { config: PortfolioRenderConfig }) {
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
    <div className="relative w-full overflow-hidden">
      {/* Soft glow background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-0 h-[320px] w-[320px] -translate-x-1/2 rounded-full opacity-25 blur-[100px]"
          style={{ backgroundColor: "var(--pr-accent)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-xl text-center"
      >
        <p
          className="text-[11px] font-medium uppercase tracking-[0.35em]"
          style={{ color: "var(--pr-accent)" }}
        >
          Contact
        </p>
        <h2
          className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ letterSpacing: "var(--pr-heading-tracking)" }}
        >
          Start a conversation
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          I usually reply within 24–48 hours.
        </p>
      </motion.div>

      <motion.form
        ref={formRef}
        action={formAction}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.12 }}
        className="relative mx-auto mt-10 max-w-xl space-y-4 border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8"
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
          <label htmlFor="website-glass">Website</label>
          <input
            id="website-glass"
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
            className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-[var(--pr-accent)]"
            style={{ borderRadius: "var(--pr-radius)" }}
          />
          <input
            name="visitorEmail"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder="Email"
            className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-[var(--pr-accent)]"
            style={{ borderRadius: "var(--pr-radius)" }}
          />
        </div>

        <input
          name="subject"
          type="text"
          maxLength={200}
          placeholder="Subject (optional)"
          className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-[var(--pr-accent)]"
          style={{ borderRadius: "var(--pr-radius)" }}
        />

        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          placeholder="Your message..."
          className="w-full resize-none border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-[var(--pr-accent)]"
          style={{ borderRadius: "var(--pr-radius)" }}
        />

        {/* Status Message (Auto-dismisses after 5s) */}
        {displayMessage?.text && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className={`text-center text-sm ${
              displayMessage.isSuccess ? "text-emerald-400" : "text-red-400"
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
          className="w-full py-3.5 text-sm font-semibold text-white transition-opacity duration-200 disabled:opacity-60"
          style={{
            backgroundColor: "var(--pr-accent)",
            borderRadius: "var(--pr-radius)",
            boxShadow: "0 12px 40px -14px var(--pr-accent)",
            opacity: isPending ? 0.6 : 1,
          }}
        >
          {isPending ? "Sending..." : "Send Message"}
        </motion.button>
      </motion.form>
    </div>
  );
}
