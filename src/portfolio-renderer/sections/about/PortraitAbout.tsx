"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

type PortraitAboutProps = {
  config: {
    name?: string | null;
    about?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
    location?: string | null;
  };
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const fadeSlide: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

type MetaRowProps = {
  label: string;
  value: string;
};

const MetaRow: React.FC<MetaRowProps> = ({ label, value }) => (
  <motion.div
    variants={fadeSlide}
    className="grid grid-cols-[80px_1fr] gap-2 items-baseline border-t border-border pt-3"
  >
    <span className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">
      {label}
    </span>
    <span className="text-sm text-foreground">{value}</span>
  </motion.div>
);

export const PortraitAbout: React.FC<PortraitAboutProps> = ({ config }) => {
  const { name, about, avatarUrl, phone, location } = config;

  if (!about) return null;

  const initial = (name ?? "").trim().charAt(0).toUpperCase() || "?";

  return (
    <section
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
      aria-label="About"
    >
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,320px)_1fr] gap-0 items-stretch">
        {/* ── Left: tall portrait card ── */}
        <motion.div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "3 / 4",
            minHeight: "360px",
            borderRadius: `var(--pr-radius) 0 0 var(--pr-radius)`,
          }}
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          whileHover="hovered"
        >
          {avatarUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                src={avatarUrl}
                alt={name ? `${name} portrait` : "Portrait"}
                className="w-full h-full object-cover"
                variants={{
                  hovered: { scale: 1.04 },
                }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
              {/* Bottom gradient overlay for name legibility */}
              <div
                className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
                }}
                aria-hidden="true"
              />
              {/* Name over portrait, bottom-left */}
              {name && (
                <div className="absolute bottom-0 left-0 p-5">
                  <p
                    className="text-white font-semibold leading-tight"
                    style={{
                      fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                      letterSpacing: "var(--pr-heading-tracking, -0.02em)",
                      textShadow: "0 1px 8px rgba(0,0,0,0.4)",
                    }}
                  >
                    {name}
                  </p>
                </div>
              )}
            </>
          ) : (
            /* No avatar: accent-filled placeholder with giant initial */
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-4"
              style={{
                background:
                  "color-mix(in srgb, var(--pr-accent) 10%, var(--surface-2, hsl(var(--muted))))",
              }}
            >
              <span
                className="font-bold leading-none select-none"
                style={{
                  fontSize: "clamp(5rem, 15vw, 10rem)",
                  color: "var(--pr-accent)",
                  opacity: 0.25,
                  letterSpacing: "-0.05em",
                }}
                aria-hidden="true"
              >
                {initial}
              </span>
              {name && (
                <p
                  className="font-semibold text-foreground text-center px-4"
                  style={{
                    fontSize: "clamp(1rem, 2vw, 1.25rem)",
                    letterSpacing: "var(--pr-heading-tracking, -0.02em)",
                  }}
                >
                  {name}
                </p>
              )}
            </div>
          )}

          {/* Left accent stripe */}
          <div
            className="absolute top-0 left-0 w-1 h-full"
            style={{ background: "var(--pr-accent)" }}
            aria-hidden="true"
          />
        </motion.div>

        {/* ── Right: text + metadata column ── */}
        <motion.div
          className="flex flex-col justify-between gap-8 border border-l-0 border-border p-7 md:p-10"
          style={{
            borderRadius: `0 var(--pr-radius) var(--pr-radius) 0`,
          }}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Section label */}
          <motion.div variants={fadeSlide} className="flex items-center gap-3">
            <div
              className="h-px w-6"
              style={{ background: "var(--pr-accent)" }}
              aria-hidden="true"
            />
            <span className="text-xs text-muted-foreground font-medium tracking-widest">
              ABOUT
            </span>
          </motion.div>

          {/* About text */}
          <motion.p
            variants={fadeSlide}
            className="whitespace-pre-line text-foreground flex-1"
            style={{
              fontSize: "clamp(0.975rem, 1.4vw, 1.1rem)",
              lineHeight: "var(--pr-body-leading, 1.8)",
              maxWidth: "55ch",
            }}
          >
            {about}
          </motion.p>

          {/* Metadata grid */}
          {(location || phone) && (
            <motion.div
              variants={stagger}
              className="flex flex-col gap-0 mt-auto"
            >
              {location && <MetaRow label="Location" value={location} />}
              {phone && <MetaRow label="Contact" value={phone} />}
              {/* Decorative bottom cap */}
              <motion.div
                variants={fadeSlide}
                className="border-t border-border pt-3"
              >
                <div
                  className="h-0.5 w-10 rounded-full"
                  style={{ background: "var(--pr-accent)" }}
                  aria-hidden="true"
                />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
