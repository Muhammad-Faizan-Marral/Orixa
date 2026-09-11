// src/portfolio-renderer/sections/footer/FooterMega.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { trackContactClick } from "@/features/portfolio/components/use-portfolio-events";

export type FooterMegaProps = {
  name?: string | null;
  username: string;
  headline?: string | null;
  about?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  phone?: string | null;
  resumeUrl?: string | null;
  portfolioId?:string
};

type LinkItem = {
  key: string;
  label: string;
  href: string;
  external?: boolean;
};

const SECTION_LINKS: LinkItem[] = [
  { key: "about", label: "About", href: "#about" },
  { key: "projects", label: "Projects", href: "#projects" },
  { key: "experience", label: "Experience", href: "#experience" },
  { key: "education", label: "Education", href: "#education" },
  { key: "skills", label: "Skills", href: "#skills" },
  { key: "certificates", label: "Certificates", href: "#certificates" },
  { key: "contact", label: "Contact", href: "#contact" },
];

export const FooterMega: React.FC<FooterMegaProps> = ({
  name,
  username,
  headline,
  about,
  githubUrl,
  linkedinUrl,
  phone,
  resumeUrl,
  portfolioId,
}) => {
  const year = new Date().getFullYear();
  const displayName = name || username;

  const socials: LinkItem[] = [];
  if (githubUrl) {
    socials.push({
      key: "github",
      label: "GitHub",
      href: githubUrl,
      external: true,
    });
  }
  if (linkedinUrl) {
    socials.push({
      key: "linkedin",
      label: "LinkedIn",
      href: linkedinUrl,
      external: true,
    });
  }
  if (resumeUrl) {
    socials.push({
      key: "resume",
      label: "Resume",
      href: resumeUrl,
      external: true,
    });
  }

  return (
    <footer
      aria-label="Site footer"
      className="w-full border-t border-border bg-background"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10"
        >
          {/* Brand + short about */}
          <div className="flex flex-col gap-5 lg:pr-8">
            <div>
              <h2
                className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                style={{ letterSpacing: "var(--pr-heading-tracking)" }}
              >
                {displayName}
              </h2>
              {headline ? (
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: "var(--pr-accent)" }}
                >
                  {headline}
                </p>
              ) : null}
            </div>

            {about ? (
              <p
                className="max-w-md text-sm text-muted-foreground line-clamp-4"
                style={{ lineHeight: "var(--pr-body-leading)" }}
              >
                {about}
              </p>
            ) : (
              <p className="max-w-md text-sm text-muted-foreground">
                Personal portfolio showcasing projects, experience, and ways to
                get in touch.
              </p>
            )}

            {phone ? (
              <a
                href={`tel:${phone}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {phone}
              </a>
            ) : null}
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
              Sections
            </span>
            <nav className="flex flex-col gap-2.5" aria-label="Footer sections">
              {SECTION_LINKS.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
              Connect
            </span>
            {socials.length > 0 ? (
              <nav className="flex flex-col gap-2.5" aria-label="Social links">
                {socials.map((link) => (
                  <a
                    onFocus={() => {
                      if (portfolioId) {
                        trackContactClick(portfolioId);
                      }
                    }}
                    key={link.key}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            ) : (
              <p className="text-sm text-muted-foreground/60">
                No social links added.
              </p>
            )}
          </div>

          {/* Quick contact CTA */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
              Get in touch
            </span>
            <p className="text-sm text-muted-foreground">
              Interested in working together or have a question?
            </p>
            <a
              href="#contact"
              className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--pr-accent-soft)",
                color: "var(--pr-accent)",
              }}
            >
              Contact me
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start gap-3 border-t border-border pt-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground/70 sm:text-sm">
            © {year} {displayName}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Crafted by {displayName}
          </p>
        </div>
      </div>
    </footer>
  );
};
