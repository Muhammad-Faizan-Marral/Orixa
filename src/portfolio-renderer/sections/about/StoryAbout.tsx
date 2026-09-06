"use client";

import React from "react";
import { motion } from "framer-motion";

type StoryAboutProps = {
  config: {
    name?: string | null;
    about?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
    location?: string | null;
  };
};

// Split about text into paragraphs for staggered reveal
function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// Fallback: treat long single-block text as one paragraph
function getParagraphs(about: string): string[] {
  const paras = splitParagraphs(about);
  return paras.length > 0 ? paras : [about];
}

export const StoryAbout: React.FC<StoryAboutProps> = ({ config }) => {
  const { name, about, avatarUrl, phone, location } = config;

  if (!about) return null;

  const paragraphs = getParagraphs(about);
  const initial = (name ?? "").trim().charAt(0).toUpperCase() || "?";

  return (
    <section
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
      aria-label="About"
    >
      {/* Header row: name left, location/phone right */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div>
          {name && (
            <h2
              className="font-semibold text-foreground leading-tight"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                letterSpacing: "var(--pr-heading-tracking, -0.025em)",
              }}
            >
              {name}
            </h2>
          )}
          <div
            className="mt-2 h-0.5 w-8"
            style={{ background: "var(--pr-accent)", borderRadius: "9999px" }}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col sm:items-end gap-1">
          {location && (
            <span className="text-sm text-muted-foreground">{location}</span>
          )}
          {phone && (
            <span className="text-sm text-muted-foreground">{phone}</span>
          )}
        </div>
      </motion.div>

      {/* Story body: avatar medallion + paragraph stream */}
      <div className="relative flex flex-col md:flex-row gap-10 md:gap-14 items-start">
        {/* Continuous vertical accent line (desktop) */}
        <div
          className="hidden md:block absolute left-[140px] top-0 bottom-0 w-px"
          style={{
            background: "color-mix(in srgb, var(--pr-accent) 18%, transparent)",
          }}
          aria-hidden="true"
        />

        {/* Left: avatar column */}
        <motion.div
          className="flex flex-col items-center md:items-start gap-4 md:w-[140px] shrink-0"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {/* Avatar circle */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Accent ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                outline: "2px solid var(--pr-accent)",
                outlineOffset: "4px",
              }}
              aria-hidden="true"
            />
            <div
              className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-surface-2 border border-border flex items-center justify-center"
              aria-hidden={!avatarUrl}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={name ? `${name} portrait` : "Portrait"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="text-3xl font-bold text-muted-foreground select-none"
                  aria-label={name ?? ""}
                >
                  {initial}
                </span>
              )}
            </div>
          </motion.div>

          {/* Vertical label — rotated, desktop only */}
          <span
            className="hidden md:block text-[10px] tracking-[0.22em] text-muted-foreground font-medium uppercase mt-2"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            aria-hidden="true"
          >
            story
          </span>
        </motion.div>

        {/* Right: paragraph stream */}
        <div className="flex flex-col gap-6 flex-1 md:pl-10">
          {paragraphs.map((para, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.12 + i * 0.1,
              }}
            >
              {/* Accent node on the vertical line (desktop) */}
              <div
                className="hidden md:block absolute -left-[calc(2.5rem+0.5px)] top-[0.65em] w-2 h-2 rounded-full border-2"
                style={{
                  borderColor: "var(--pr-accent)",
                  background: "var(--background, #fff)",
                  transform: "translateX(-3px)",
                }}
                aria-hidden="true"
              />

              <p
                className="text-foreground"
                style={{
                  fontSize: "clamp(1rem, 1.4vw, 1.125rem)",
                  lineHeight: "var(--pr-body-leading, 1.78)",
                  maxWidth: "60ch",
                }}
              >
                {/* First paragraph: first word styled as drop cap accent */}
                {i === 0 ? (
                  <>
                    <span
                      className="font-semibold"
                      style={{ color: "var(--pr-accent)" }}
                    >
                      {para.split(" ")[0]}
                    </span>
                    {para.slice(para.split(" ")[0].length)}
                  </>
                ) : (
                  para
                )}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
