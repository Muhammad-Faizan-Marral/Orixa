"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  sendContactMessage,
  type ContactActionState,
} from "@/actions/contact/send-contact-message";

type ContactFormProps = {
  portfolioId: string;
};

const initialState: ContactActionState = {
  success: false,
  message: "",
};

export function ContactForm({ portfolioId }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <section id="contact" aria-labelledby="contact-heading">
      <div>
        <h2 id="contact-heading">Get in touch</h2>

        <p>Have a question or want to work together? Send me a message.</p>
      </div>

      <form ref={formRef} action={formAction} noValidate={false}>
        <input type="hidden" name="portfolioId" value={portfolioId} />

        {/* Honeypot */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-10000px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          <label htmlFor="website">Website</label>

          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="visitorName">Name</label>

          <input
            id="visitorName"
            name="visitorName"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="visitorEmail">Email</label>

          <input
            id="visitorEmail"
            name="visitorEmail"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={254}
            required
          />
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject">Subject</label>

          <input
            id="subject"
            name="subject"
            type="text"
            placeholder="Subject"
            maxLength={200}
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message">Message</label>

          <textarea
            id="message"
            name="message"
            rows={7}
            placeholder="Write your message..."
            minLength={10}
            maxLength={5000}
            required
          />
        </div>

        {/* Result */}
        {state.message && (
          <p role="status" aria-live="polite">
            {state.message}
          </p>
        )}

        <button type="submit" disabled={isPending}>
          {isPending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}
