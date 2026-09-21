"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroSplit({
  config,
  profile,
}: {
  config: PortfolioRenderConfig;
  profile: PublicProfileMeta;
}) {
  const name = config.name || profile.fullName || profile.username;
  const avatar = config.avatarUrl || profile.avatarUrl;
  const headline = config.headline;
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative -mx-4 sm:-mx-6 lg:mx-0"
      style={{ fontFamily: "var(--pr-font)" }}
      aria-label="Introduction"
    >
      <div
        className="grid min-h-[min(78vh,720px)] overflow-hidden lg:grid-cols-2"
        style={{ borderRadius: "var(--pr-radius, 18px)" }}
      >
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease }}
          className="relative min-h-[320px] lg:min-h-0"
        >
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-7xl font-semibold"
              style={{
                background:
                  "color-mix(in srgb, var(--pr-accent) 16%, var(--pr-surface, #111))",
                color: "var(--pr-accent)",
              }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div
            className="absolute inset-0 lg:hidden"
            style={{
              background:
                "linear-gradient(to top, color-mix(in srgb, var(--pr-background, #000) 75%, transparent) 0%, transparent 55%)",
            }}
            aria-hidden="true"
          />
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease }}
          className="relative flex flex-col justify-end gap-6 p-8 sm:p-10 lg:justify-center lg:p-12 xl:p-16"
          style={{
            background:
              "color-mix(in srgb, var(--pr-surface, var(--surface)) 92%, transparent)",
          }}
        >
          <span
            className="text-[0.65rem] font-medium uppercase tracking-[0.28em]"
            style={{ color: "var(--pr-accent)" }}
          >
            Portfolio
          </span>

          <h1
            className="font-semibold text-foreground"
            style={{
              fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)",
              lineHeight: 1.05,
              letterSpacing: "var(--pr-heading-tracking, -0.03em)",
            }}
          >
            {name}
          </h1>

          {headline ? (
            <p
              className="max-w-md"
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.65,
                color: "var(--pr-muted, var(--muted-foreground))",
              }}
            >
              {headline}
            </p>
          ) : null}

          <div className="mt-2 flex flex-wrap gap-3">
            {config.resumeUrl && (
              <a
                href={config.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:brightness-110"
                style={{
                  background: "var(--pr-accent)",
                  borderRadius: "999px",
                  boxShadow:
                    "0 14px 36px -12px color-mix(in srgb, var(--pr-accent) 55%, transparent)",
                }}
              >
                Resume
              </a>
            )}
            {config.githubUrl && (
              <a
                href={config.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border px-5 py-3 text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--pr-foreground)_5%,transparent)]"
                style={{
                  borderColor: "var(--pr-border)",
                  borderRadius: "999px",
                }}
              >
                GitHub
              </a>
            )}
            {config.linkedinUrl && (
              <a
                href={config.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border px-5 py-3 text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--pr-foreground)_5%,transparent)]"
                style={{
                  borderColor: "var(--pr-border)",
                  borderRadius: "999px",
                }}
              >
                LinkedIn
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}