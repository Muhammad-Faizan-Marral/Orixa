"use client";

import React from "react";
import { motion } from "framer-motion";

type EditorialAboutProps = {
  config: {
    name?: string | null;
    about?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
    location?: string | null;
  };
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
};

export const EditorialAbout: React.FC<EditorialAboutProps> = ({ config }) => {
  const { name, about, avatarUrl, phone, location } = config;

  if (!about) return null;

  const firstName = (name ?? "").trim().split(" ")[0] ?? "";
  const lastName = (name ?? "").trim().split(" ").slice(1).join(" ") ?? "";
  const initial = (name ?? "").trim().charAt(0).toUpperCase() || "?";

  return (
    <section
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
      aria-label="About"
    >
      {/* Top rule */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-border" aria-hidden="true" />
        <span className="text-xs tracking-widest text-muted-foreground font-medium">
          ABOUT
        </span>
        <div
          className="h-px w-8"
          style={{ background: "var(--pr-accent)" }}
          aria-hidden="true"
        />
      </div>

      {/* Editorial grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,520px)] gap-10 lg:gap-16 items-start">
        {/* Left: typographic name block + avatar */}
        <motion.div
          className="flex flex-col gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Large display name — letterforms as design element */}
          {name && (
            <div aria-label={name} className="select-none">
              {firstName && (
                <motion.div
                  custom={0}
                  variants={fadeUp}
                  className="leading-none font-bold text-foreground"
                  style={{
                    fontSize: "clamp(3rem, 8vw, 6rem)",
                    letterSpacing: "var(--pr-heading-tracking, -0.03em)",
                  }}
                >
                  {firstName}
                </motion.div>
              )}
              {lastName && (
                <motion.div
                  custom={0.5}
                  variants={fadeUp}
                  className="leading-none font-bold"
                  style={{
                    fontSize: "clamp(3rem, 8vw, 6rem)",
                    letterSpacing: "var(--pr-heading-tracking, -0.03em)",
                    color: "var(--pr-accent)",
                    WebkitTextStroke: "0",
                  }}
                >
                  {lastName}
                </motion.div>
              )}
            </div>
          )}

          {/* Avatar — editorial crop */}
          {avatarUrl && (
            <motion.div
              custom={1}
              variants={fadeUp}
              className="relative overflow-hidden w-full max-w-[280px]"
              style={{
                aspectRatio: "4 / 5",
                borderRadius: "var(--pr-radius)",
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt={name ? `${name} portrait` : "Portrait"}
                className="w-full h-full object-cover"
              />
              {/* Subtle accent overlay strip */}
              <div
                className="absolute bottom-0 left-0 w-1 h-full"
                style={{ background: "var(--pr-accent)" }}
                aria-hidden="true"
              />
            </motion.div>
          )}

          {/* No avatar: large decorative initial */}
          {!avatarUrl && (
            <motion.div
              custom={1}
              variants={fadeUp}
              className="flex items-center justify-start"
              aria-hidden="true"
            >
              <span
                className="font-bold leading-none select-none"
                style={{
                  fontSize: "clamp(6rem, 20vw, 14rem)",
                  color:
                    "var(--pr-accent-soft, color-mix(in srgb, var(--pr-accent) 12%, transparent))",
                  letterSpacing: "-0.06em",
                  lineHeight: 1,
                }}
              >
                {initial}
              </span>
            </motion.div>
          )}

          {/* Contact metadata — inline chips */}
          {(phone || location) && (
            <motion.div
              custom={2}
              variants={fadeUp}
              className="flex flex-wrap gap-2 mt-2"
            >
              {location && (
                <span
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground border border-border px-3 py-1"
                  style={{ borderRadius: "var(--pr-radius)" }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 1a3.5 3.5 0 0 1 3.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 0 1 6 1Z"
                      stroke="currentColor"
                      strokeWidth="1.1"
                    />
                    <circle
                      cx="6"
                      cy="4.5"
                      r="1.2"
                      stroke="currentColor"
                      strokeWidth="1.1"
                    />
                  </svg>
                  {location}
                </span>
              )}
              {phone && (
                <span
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground border border-border px-3 py-1"
                  style={{ borderRadius: "var(--pr-radius)" }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 2h2.5l1 2.5-1.5 1a6 6 0 0 0 3 3l1-1.5L10.5 8V10.5A8.5 8.5 0 0 1 2 2Z"
                      stroke="currentColor"
                      strokeWidth="1.1"
                    />
                  </svg>
                  {phone}
                </span>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Right: about text — editorial large setting */}
        <motion.div
          className="flex flex-col justify-end h-full pt-0 lg:pt-[calc(clamp(3rem,8vw,6rem)*2*0.9)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Thin accent bar above text */}
          <motion.div
            custom={0}
            variants={fadeUp}
            className="h-px w-12 mb-8"
            style={{ background: "var(--pr-accent)" }}
            aria-hidden="true"
          />

          <motion.p
            custom={1}
            variants={fadeUp}
            className="whitespace-pre-line text-foreground font-normal"
            style={{
              fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)",
              lineHeight: "var(--pr-body-leading, 1.75)",
              maxWidth: "58ch",
            }}
          >
            {about}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
