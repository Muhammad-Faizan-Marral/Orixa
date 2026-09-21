"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PortfolioRenderConfig, PublicProfileMeta } from "../../types";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroModern({
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

  const socials = [
    config.githubUrl && { href: config.githubUrl, label: "GitHub" },
    config.linkedinUrl && { href: config.linkedinUrl, label: "LinkedIn" },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <section
      className="relative"
      style={{ fontFamily: "var(--pr-font)" }}
      aria-label="Introduction"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 100% 0%, color-mix(in srgb, var(--pr-accent) 10%, transparent) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 0% 100%, color-mix(in srgb, var(--pr-accent) 6%, transparent) 0%, transparent 50%)
          `,
        }}
      />

      <div className="flex flex-col gap-8 lg:gap-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <h1
            className="font-semibold text-foreground"
            style={{
              fontSize: "clamp(2.75rem, 8vw, 5.5rem)",
              lineHeight: 0.95,
              letterSpacing: "var(--pr-heading-tracking, -0.035em)",
              maxWidth: "12ch",
            }}
          >
            {name}
          </h1>

          {headline ? (
            <p
              className="max-w-xs pb-1 sm:text-right"
              style={{
                fontSize: "1rem",
                lineHeight: 1.65,
                color: "var(--pr-muted, var(--muted-foreground))",
              }}
            >
              {headline}
            </p>
          ) : null}
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="h-px w-full origin-left"
          style={{
            background:
              "linear-gradient(90deg, var(--pr-accent), color-mix(in srgb, var(--pr-border) 80%, transparent) 40%, transparent)",
          }}
          aria-hidden="true"
        />

        <div className="grid items-center gap-8 md:grid-cols-[auto_1fr] md:gap-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.2, ease }}
            className="relative mx-auto md:mx-0"
          >
            <div
              className="relative overflow-hidden"
              style={{
                width: "min(220px, 55vw)",
                aspectRatio: "3 / 4",
                borderRadius: "var(--pr-radius, 18px)",
                boxShadow:
                  "var(--pr-card-shadow, 0 24px 60px -20px rgba(0,0,0,0.4))",
              }}
            >
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-4xl font-semibold"
                  style={{
                    background:
                      "color-mix(in srgb, var(--pr-accent) 14%, transparent)",
                    color: "var(--pr-accent)",
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div
              className="absolute -bottom-3 -right-3 -z-10 h-full w-full"
              style={{
                borderRadius: "var(--pr-radius, 18px)",
                background:
                  "color-mix(in srgb, var(--pr-accent) 12%, transparent)",
              }}
              aria-hidden="true"
            />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28, ease }}
            className="flex flex-col gap-6"
          >
            {config.about ? (
              <p
                className="max-w-lg"
                style={{
                  fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)",
                  lineHeight: "var(--pr-body-leading, 1.75)",
                  color: "var(--pr-muted, var(--muted-foreground))",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {config.about}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {config.resumeUrl ? (
                <a
                  href={config.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ color: "var(--pr-accent)" }}
                >
                  <span>Download resume</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ) : null}

              {socials.map((s, i) => (
                <span key={s.href} className="inline-flex items-center gap-6">
                  {i === 0 && config.resumeUrl ? (
                    <span
                      className="hidden h-3 w-px sm:block"
                      style={{ background: "var(--pr-border)" }}
                      aria-hidden="true"
                    />
                  ) : null}
                  {i > 0 ? (
                    <span
                      className="h-3 w-px"
                      style={{ background: "var(--pr-border)" }}
                      aria-hidden="true"
                    />
                  ) : null}
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors hover:text-foreground"
                    style={{
                      color: "var(--pr-muted, var(--muted-foreground))",
                    }}
                  >
                    {s.label}
                  </a>
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}