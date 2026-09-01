"use client"
import React from "react";

export type ContactFormProps = {
  config: {
    name?: string | null;
    phone?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    resumeUrl?: string | null;
  };
};

export const ContactForm: React.FC<ContactFormProps> = ({ config }) => {
  const recipientName = config?.name?.trim() || undefined;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const senderName = String(formData.get("name") ?? "").trim();
    const senderEmail = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const subject = `Portfolio inquiry from ${senderName || "a visitor"}`;
    const bodyLines = [
      senderName ? `Name: ${senderName}` : null,
      senderEmail ? `Email: ${senderEmail}` : null,
      "",
      message,
    ].filter((line): line is string => line !== null);

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = mailtoUrl;
  };

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
              ? `Send a message to ${recipientName}. This opens your email client with the message pre-filled.`
              : "Send a message. This opens your email client with the message pre-filled."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 border border-border bg-surface p-6 sm:p-8"
          style={{ borderRadius: "var(--pr-radius)" }}
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="contact-name"
              className="text-sm font-medium text-foreground"
            >
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
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
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
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
              rows={5}
              placeholder="Write your message here..."
              className="w-full resize-none border border-border bg-transparent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-[var(--pr-accent)] sm:text-base"
              style={{ borderRadius: "var(--pr-radius)" }}
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 sm:text-base"
            style={{
              backgroundColor: "var(--pr-accent)",
              borderRadius: "var(--pr-radius)",
            }}
          >
            Send message
          </button>

          <p className="text-xs text-muted-foreground/70 sm:text-sm">
            Submitting opens your default email app with this message ready
            to send.
          </p>
        </form>
      </div>
    </section>
  );
};