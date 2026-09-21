"use client";

import React from "react";
import { motion } from "framer-motion";

export type FooterDetailedProps = {
  name?: string;
  username: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
};

type QuickLink = {
  key: string;
  label: string;
  href: string;
};

const QUICK_LINKS: QuickLink[] = [
  {
    key: "projects",
    label: "Projects",
    href: "#projects",
  },
  {
    key: "experience",
    label: "Experience",
    href: "#experience",
  },
  {
    key: "contact",
    label: "Contact",
    href: "#contact",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export const FooterDetailed: React.FC<FooterDetailedProps> = ({
  name,
  username,
  githubUrl,
  linkedinUrl,
}) => {
  const year = new Date().getFullYear();
  const displayName = name?.trim() || username;

  const socialLinks: QuickLink[] = [];

  if (githubUrl?.trim()) {
    socialLinks.push({
      key: "github",
      label: "GitHub",
      href: githubUrl,
    });
  }

  if (linkedinUrl?.trim()) {
    socialLinks.push({
      key: "linkedin",
      label: "LinkedIn",
      href: linkedinUrl,
    });
  }

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{
        fontFamily: "var(--pr-font)",
        backgroundColor: "var(--pr-background)",
        color: "var(--pr-foreground)",
      }}
    >
      {/* ------------------------------------------------------------
          TOP ACCENT
      ------------------------------------------------------------- */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--pr-accent), transparent 55%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* ----------------------------------------------------------
            MAIN IDENTITY
        ----------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
          className="border-b py-16 sm:py-20 lg:py-24"
          style={{
            borderColor: "var(--pr-border)",
          }}
        >
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div className="max-w-5xl">
              <p
                className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em]"
                style={{ color: "var(--pr-muted)" }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: "var(--pr-accent)",
                  }}
                />

                End of the line
              </p>

              <h2
                className="text-[clamp(3rem,9vw,9rem)] font-medium leading-[0.84] tracking-[-0.065em]"
                style={{
                  letterSpacing: "var(--pr-heading-tracking)",
                }}
              >
                {displayName}
                <span
                  style={{
                    color: "var(--pr-accent)",
                  }}
                >
                  .
                </span>
              </h2>
            </div>

            <p
              className="max-w-xs text-sm leading-6 lg:pb-2"
              style={{
                color: "var(--pr-muted)",
              }}
            >
              Thanks for taking the time to explore this portfolio.
              <br />
              <span className="opacity-70">
                Let&apos;s build something meaningful.
              </span>
            </p>
          </div>
        </motion.div>

        {/* ----------------------------------------------------------
            NAVIGATION + SOCIALS
        ----------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.08, ease }}
          className="grid gap-12 border-b py-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr]"
          style={{
            borderColor: "var(--pr-border)",
          }}
        >
          {/* Index */}
          <div>
            <span
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{
                color: "var(--pr-muted)",
              }}
            >
              Portfolio
            </span>

            <p className="mt-3 text-sm font-medium">
              /{username}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <span
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{
                color: "var(--pr-muted)",
              }}
            >
              Navigate
            </span>

            <nav
              aria-label="Footer navigation"
              className="mt-3 flex flex-col items-start"
            >
              {QUICK_LINKS.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  className="group flex items-center gap-2 py-1 text-sm transition-colors duration-300"
                  style={{
                    color: "var(--pr-foreground)",
                  }}
                >
                  <span
                    className="h-px w-0 transition-all duration-300 group-hover:w-4"
                    style={{
                      backgroundColor: "var(--pr-accent)",
                    }}
                  />

                  <span className="transition-colors duration-300 group-hover:text-[var(--pr-accent)]">
                    {link.label}
                  </span>
                </a>
              ))}
            </nav>
          </div>

          {/* Socials */}
          {socialLinks.length > 0 ? (
            <div>
              <span
                className="text-[10px] uppercase tracking-[0.25em]"
                style={{
                  color: "var(--pr-muted)",
                }}
              >
                Elsewhere
              </span>

              <nav
                aria-label="Social links"
                className="mt-3 flex flex-col items-start"
              >
                {socialLinks.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 py-1 text-sm transition-colors duration-300"
                  >
                    <span className="transition-colors duration-300 group-hover:text-[var(--pr-accent)]">
                      {link.label}
                    </span>

                    <span
                      className="text-xs transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      style={{
                        color: "var(--pr-accent)",
                      }}
                    >
                      ↗
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          ) : null}
        </motion.div>

        {/* ----------------------------------------------------------
            ORIXA WATERMARK
        ----------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15 }}
          className="relative overflow-hidden py-12 sm:py-16 lg:py-20"
        >
          <a
            href="https://www.orixaai.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Built with Orixa AI"
            className="group block select-none"
          >
            <span
              aria-hidden="true"
              className="block whitespace-nowrap text-[clamp(5rem,18vw,18rem)] font-semibold leading-[0.7] tracking-[-0.08em] transition-transform duration-700 ease-out group-hover:translate-x-2"
              style={{
                color: "var(--pr-foreground)",
                opacity: 0.035,
              }}
            >
              ORIXA
            </span>

            <div className="relative z-10 -mt-4 flex items-center justify-between sm:-mt-8">
              <span
                className="text-[10px] font-medium uppercase tracking-[0.25em] transition-colors duration-300 group-hover:text-[var(--pr-accent)]"
                style={{
                  color: "var(--pr-muted)",
                }}
              >
                Built with Orixa AI
              </span>

              <span
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 group-hover:text-[var(--pr-accent)]"
                style={{
                  color: "var(--pr-muted)",
                }}
              >
                orixaai.me

                <span className="text-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  ↗
                </span>
              </span>
            </div>
          </a>
        </motion.div>

        {/* ----------------------------------------------------------
            COPYRIGHT
        ----------------------------------------------------------- */}
        <div
          className="flex flex-col gap-3 border-t py-6 sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: "var(--pr-border)",
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.15em] sm:text-xs"
            style={{
              color: "var(--pr-muted)",
            }}
          >
            © {year} {displayName}
          </p>

          <p
            className="text-[10px] uppercase tracking-[0.15em] sm:text-xs"
            style={{
              color: "var(--pr-muted)",
            }}
          >
            Designed &amp; developed with intention
          </p>
        </div>
      </div>
    </footer>
  );
};