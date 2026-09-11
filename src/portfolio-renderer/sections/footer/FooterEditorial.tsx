// src/portfolio-renderer/sections/footer/FooterEditorial.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { trackContactClick } from "@/features/portfolio/components/use-portfolio-events";

export type FooterEditorialProps = {
  name?: string | null;
  username: string;
  headline?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  phone?: string | null;
  portfolioId?: string;
};

type NavLink = {
  key: string;
  label: string;
  href: string;
};

const SECTION_LINKS: NavLink[] = [
  { key: "about", label: "About", href: "#about" },
  { key: "projects", label: "Projects", href: "#projects" },
  { key: "experience", label: "Experience", href: "#experience" },
  { key: "skills", label: "Skills", href: "#skills" },
  { key: "contact", label: "Contact", href: "#contact" },
];

export const FooterEditorial: React.FC<FooterEditorialProps> = ({
  name,
  username,
  headline,
  githubUrl,
  linkedinUrl,
  phone,
  portfolioId,
}) => {
  const year = new Date().getFullYear();
  const displayName = name || username;

  const socials: NavLink[] = [];
  if (githubUrl) {
    socials.push({ key: "github", label: "GitHub", href: githubUrl });
  }
  if (linkedinUrl) {
    socials.push({ key: "linkedin", label: "LinkedIn", href: linkedinUrl });
  }

  return (
    <footer
      aria-label="Site footer"
      className="w-full border-t border-border bg-background"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-12 sm:grid-cols-[1.2fr_1fr] sm:gap-16 lg:grid-cols-[1.4fr_1fr_1fr]"
        >
          {/* Identity */}
          <div className="flex flex-col gap-4">
            <h2
              className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
              style={{ letterSpacing: "var(--pr-heading-tracking)" }}
            >
              {displayName}
            </h2>
            {headline ? (
              <p
                className="max-w-sm text-sm text-muted-foreground"
                style={{ lineHeight: "var(--pr-body-leading)" }}
              >
                {headline}
              </p>
            ) : (
              <p className="max-w-sm text-sm text-muted-foreground">
                Portfolio of {displayName}. Explore work, experience, and ways
                to connect.
              </p>
            )}
            {phone ? (
              <a
                href={`tel:${phone}`}
                className="mt-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {phone}
              </a>
            ) : null}
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
              Navigate
            </span>
            <nav
              className="flex flex-col gap-2.5"
              aria-label="Footer navigation"
            >
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

          {/* Social / Connect */}
          {socials.length > 0 ? (
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                Connect
              </span>
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          ) : null}
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start gap-2 border-t border-border pt-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground/70 sm:text-sm">
            © {year} {displayName}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Designed & built by {displayName}
          </p>
        </div>
      </div>
    </footer>
  );
};
