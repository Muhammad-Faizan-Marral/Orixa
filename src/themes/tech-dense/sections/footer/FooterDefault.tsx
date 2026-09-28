"use client";

import React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import type { ThemeSectionProps } from "../../../types";

const EASE = [0.16, 1, 0.3, 1] as const;

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width="12"
      height="12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 10L10 2M10 2H4.5M10 2V7.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FooterDefault({ config, profile }: ThemeSectionProps) {
  const reduced = Boolean(useReducedMotion());

  const displayName =
    config?.name?.trim() || profile?.username?.trim() || "Portfolio";

  const currentYear = new Date().getFullYear();

  /* Size the wordmark so the full name always fits on one line */
  const wordmarkSize = `min(15vw, ${(170 / Math.max(displayName.length, 6)).toFixed(2)}vw, 13rem)`;

  /* Pointer-following light */
  const px = useSpring(useMotionValue(50), { stiffness: 60, damping: 20 });
  const py = useSpring(useMotionValue(70), { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${px}% ${py}%, rgba(37,99,235,0.16), transparent 62%)`;

  return (
    <footer
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 100);
        py.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative isolate w-full overflow-hidden bg-[#04060B] text-white"
    >
      {/* ------------------------------ BACKGROUND ------------------------------ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{ background: spotlight }}
        />

        <div
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(37,99,235,0.2), transparent 65%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
      </div>

      {/* Top edge draws in once */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleX: reduced ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE }}
        className="h-px w-full origin-left bg-gradient-to-r from-blue-400/70 via-white/[0.12] to-transparent"
      />

      <div className="relative mx-auto w-full max-w-[1480px] px-5 pt-8 sm:px-8 lg:px-12 xl:px-16">
        {/* Meta bar */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex flex-col gap-4 font-[var(--font-inter)] text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>
            © {currentYear} {displayName}
          </p>

          {!profile?.isPremium && (
            <a
              href="https://www.orixaai.me"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Built with OrixaAi (opens in a new tab)"
              className="group inline-flex w-fit items-center gap-2 rounded-sm outline-none transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:ring-2 focus-visible:ring-blue-400/60"
            >
              Built with
              <span className="text-white/70 transition-colors duration-300 group-hover:text-white">
                OrixaAi
              </span>
              <ArrowIcon className="text-blue-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}
        </motion.div>

        {/* Wordmark: the page's floor. A band of light passes through the letters. */}
        <div
          className="relative mt-10 overflow-hidden pb-[0.02em] sm:mt-14"
          style={{
            maskImage: "linear-gradient(to bottom, black 45%, transparent 98%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 45%, transparent 98%)",
          }}
        >
          <motion.p
            initial={{ y: reduced ? 0 : "40%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.3, ease: EASE }}
            aria-label={displayName}
            className="relative whitespace-nowrap text-center font-[var(--font-bricolage)] font-medium leading-[0.92] tracking-[-0.065em]"
            style={{ fontSize: wordmarkSize }}
          >
            {/* Base fill */}
            <span
              aria-hidden="true"
              className="block text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(147,197,253,0.4) 60%, rgba(59,130,246,0.12) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              {displayName}
            </span>

            {/* Moving highlight */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 block text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(100deg, transparent 35%, rgba(191,219,254,0.95) 50%, transparent 65%)",
                backgroundSize: "250% 100%",
                backgroundRepeat: "no-repeat",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
              animate={
                reduced
                  ? { backgroundPosition: "50% 0%" }
                  : { backgroundPosition: ["130% 0%", "-30% 0%"] }
              }
              transition={{
                duration: 7,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: "easeInOut",
              }}
            >
              {displayName}
            </motion.span>
          </motion.p>
        </div>
      </div>
    </footer>
  );
}

export default FooterDefault;
