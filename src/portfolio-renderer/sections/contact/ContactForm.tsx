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

export type ContactFormProps = {
  config: PortfolioRenderConfig;
};

export const ContactForm: React.FC<ContactFormProps> = ({ config }) => {
  const portfolioId = config?.portfolioId;
  const recipientName = config?.name?.trim();

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
      <section aria-label="Contact" className="w-full py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          Contact form is not available.
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Contact" className="w-full py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Contact
          </h2>
          <div
            className="mt-3 h-1 w-12 rounded-full"
            style={{ backgroundColor: "var(--pr-accent)" }}
            aria-hidden="true"
          />
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            {recipientName
              ? `Have a project in mind or want to collaborate? Send a message to ${recipientName}.`
              : "Have a project in mind or want to collaborate? Send a message below."}
          </p>
        </div>

        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col gap-5 border border-border bg-surface p-6 sm:p-8"
          style={{
            borderRadius: "var(--pr-radius)",
            boxShadow: "var(--pr-card-shadow)",
          }}
        >
          <input type="hidden" name="portfolioId" value={portfolioId} />

          {/* Honeypot field for anti-spam protection */}
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

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-name"
              className="text-sm font-medium text-foreground"
            >
              Name
            </label>
            <input
              id="contact-name"
              name="visitorName"
              type="text"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              placeholder="Your name"
              className="w-full border border-border bg-transparent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-[var(--pr-accent)] sm:text-base"
              style={{ borderRadius: "var(--pr-radius)" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id="contact-email"
              name="visitorEmail"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full border border-border bg-transparent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-[var(--pr-accent)] sm:text-base"
              style={{ borderRadius: "var(--pr-radius)" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-subject"
              className="text-sm font-medium text-foreground"
            >
              Subject
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              maxLength={200}
              placeholder="Optional subject"
              className="w-full border border-border bg-transparent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-[var(--pr-accent)] sm:text-base"
              style={{ borderRadius: "var(--pr-radius)" }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-message"
              className="text-sm font-medium text-foreground"
            >
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              placeholder="Write your message here..."
              className="w-full resize-none border border-border bg-transparent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-[var(--pr-accent)] sm:text-base"
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
            className="mt-2 inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-opacity duration-200 disabled:opacity-60 sm:text-base"
            style={{
              backgroundColor: "var(--pr-accent)",
              borderRadius: "var(--pr-radius)",
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {isPending ? "Sending..." : "Send message"}
          </motion.button>
        </form>
      </div>
    </section>
  );
};
