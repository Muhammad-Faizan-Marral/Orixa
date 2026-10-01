"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { trackContactClick } from "@/features/portfolio/components/use-portfolio-events";
import type { SectionProps } from "../shared/types";

const at = (t: number): CSSProperties => ({ ["--at" as string]: t });

type Status = "idle" | "sending" | "sent" | "error";

export function ContactDefault({ portfolio, act }: SectionProps) {
  const { contact } = portfolio;
  const { links, location, canMessage, portfolioId } = contact;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  if (!canMessage && links.length === 0) return null;

  const onLinkClick = () => {
    if (portfolioId) trackContactClick(portfolioId);
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canMessage || status === "sending") return;
    setStatus("sending");

    try {
      if (portfolioId) trackContactClick(portfolioId);
      const detail = { portfolioId, name: name.trim(), email: email.trim(), message: message.trim() };
      window.dispatchEvent(new CustomEvent("cinematic:contact", { detail }));
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="cin-epilogue">
      <div className="cin-epilogue-inner">
        <p className="cin-eyebrow cin-reveal" style={at(0)}>
          {act.label}
        </p>
        <h2 className="cin-epilogue-title cin-reveal" style={at(0.05)}>
          {act.title}
        </h2>
        {location && (
          <p className="cin-caption cin-reveal" style={at(0.1)}>
            {location}
          </p>
        )}

        {links.length > 0 && (
          <ul className="cin-links cin-reveal" style={at(0.15)}>
            {links.map((l) => (
              <li key={l.kind + l.href}>
                <a
                  href={l.href}
                  target={l.kind === "phone" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  onClick={onLinkClick}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}

        {canMessage && (
          <form className="cin-form cin-reveal" style={at(0.22)} onSubmit={onSubmit} noValidate>
            <div className="cin-form-row">
              <label>
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === "sending"}
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "sending"}
                />
              </label>
            </div>
            <label>
              <span>Message</span>
              <textarea
                name="message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === "sending"}
              />
            </label>
            <div className="cin-form-actions">
              <button type="submit" disabled={status === "sending" || status === "sent"}>
                {status === "sending" ? "Sending…" : status === "sent" ? "Sent" : "Send message"}
              </button>
              {status === "error" && <p className="cin-form-err">Something went wrong — try again.</p>}
              {status === "sent" && <p className="cin-form-ok">Message received. Thank you.</p>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}