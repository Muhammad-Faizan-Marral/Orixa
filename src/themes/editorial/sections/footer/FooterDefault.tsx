"use client";

import React from "react";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ========================================================================== */
/* THEME                                                                      */
/* ========================================================================== */

const DISPLAY = "font-[family-name:var(--font-display)]";
const TEXT = "font-[family-name:var(--font-text)]";

const EASE = [0.22, 1, 0.36, 1] as const;

const BLUE = "#2230D2";
const INDIGO = "#161F9C";
const CREAM = "#F6F2E7";
const YELLOW = "#F4E9A9";

/* ========================================================================== */
/* ICONS                                                                      */
/* ========================================================================== */

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={`h-3.5 w-3.5 ${className}`}
    >
      <path
        d="M2 12L12 2M4 2H12V10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/* ========================================================================== */
/* FOOTER                                                                     */
/* ========================================================================== */

export function FooterDefault({ config, profile }: ThemeSectionProps) {
  const reduced = Boolean(useReducedMotion());

  const displayName =
    config?.name?.trim() || profile?.username?.trim() || "Portfolio";

  const currentYear = new Date().getFullYear();

  /*
   * Keeps long names visually controlled while still
   * allowing short names to become dramatically large.
   */
  const wordmarkSize = `clamp(5rem, ${Math.min(
    16,
    Math.max(6, 170 / Math.max(displayName.length, 5)),
  )}vw, 15rem)`;

  /* ------------------------------------------------------------------------ */
  /* POINTER LIGHT                                                            */
  /* ------------------------------------------------------------------------ */

  const rawX = useMotionValue(50);
  const rawY = useMotionValue(50);

  const px = useSpring(rawX, {
    stiffness: 60,
    damping: 22,
    mass: 0.8,
  });

  const py = useSpring(rawY, {
    stiffness: 60,
    damping: 22,
    mass: 0.8,
  });

  const spotlight = useMotionTemplate`
    radial-gradient(
      700px circle at ${px}% ${py}%,
      rgba(244,233,169,0.13),
      transparent 62%
    )
  `;

  /* ------------------------------------------------------------------------ */
  /* PARALLAX                                                                 */
  /* ------------------------------------------------------------------------ */

  const nameY = useTransform(py, [0, 100], ["-1.5%", "1.5%"]);

  const orbRotate = useTransform(px, [0, 100], [-8, 8]);

  return (
    <footer
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();

        rawX.set(((event.clientX - rect.left) / rect.width) * 100);

        rawY.set(((event.clientY - rect.top) / rect.height) * 100);
      }}
      className={`${TEXT} relative isolate overflow-hidden bg-[#161F9C] text-[#F6F2E7]`}
    >
      {/* ================================================================== */}
      {/* BACKGROUND                                                          */}
      {/* ================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Cursor atmosphere */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: spotlight,
          }}
        />

        {/* Large architectural circles */}
        <div className="absolute -right-[14vw] -top-[18vw] h-[48vw] w-[48vw] rounded-full border border-[#F6F2E7]/[0.055]" />

        <div className="absolute -right-[9vw] -top-[13vw] h-[38vw] w-[38vw] rounded-full border border-[#F4E9A9]/[0.08]" />

        <div className="absolute -right-[4vw] -top-[8vw] h-[28vw] w-[28vw] rounded-full border border-[#F6F2E7]/[0.04]" />

        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(246,242,231,1) 1px, transparent 1px), linear-gradient(90deg, rgba(246,242,231,1) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* Bottom blue atmosphere */}
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(34,48,210,0.65),transparent_68%)]" />

        {/* Ghost text */}
        <span
          className={`${DISPLAY} absolute -left-[5vw] top-[26%] select-none text-[clamp(10rem,24vw,26rem)] leading-[0.65] tracking-[-0.09em] text-[#F6F2E7]/[0.025]`}
        >
          END
        </span>
      </div>

      {/* ================================================================== */}
      {/* TOP ARCHITECTURAL LINE                                              */}
      {/* ================================================================== */}

      <motion.div
        aria-hidden="true"
        initial={{
          scaleX: reduced ? 1 : 0,
        }}
        whileInView={{
          scaleX: 1,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 1.2,
          ease: EASE,
        }}
        className="h-px w-full origin-left bg-gradient-to-r from-[#F4E9A9]/80 via-[#F6F2E7]/20 to-transparent"
      />

      {/* ================================================================== */}
      {/* CONTENT                                                             */}
      {/* ================================================================== */}

      <div className="relative mx-auto w-full max-w-[1600px] px-6 pb-6 pt-8 sm:px-10 sm:pt-10 lg:px-14 lg:pb-8 lg:pt-12">
        {/* ---------------------------------------------------------------- */}
        {/* META                                                              */}
        {/* ---------------------------------------------------------------- */}

        <motion.div
          initial={{
            opacity: 0,
            y: reduced ? 0 : 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
            ease: EASE,
          }}
          className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <span className="h-2 w-2 rounded-full bg-[#F4E9A9]" />

            <span className="text-[9px] uppercase tracking-[0.22em] text-[#F6F2E7]/55">
              Closing frame
            </span>
          </div>

          <div className="flex items-center gap-6 text-[9px] uppercase tracking-[0.19em] text-[#F6F2E7]/35">
            <span>© {currentYear}</span>

            <span className="hidden h-px w-8 bg-[#F6F2E7]/20 sm:block" />

            <span>{displayName}</span>
          </div>
        </motion.div>

        {/* ---------------------------------------------------------------- */}
        {/* FINAL STATEMENT                                                   */}
        {/* ---------------------------------------------------------------- */}

        <div className="relative mt-20 sm:mt-28 lg:mt-36">
          <motion.div
            style={{
              y: reduced ? 0 : nameY,
            }}
            initial={{
              opacity: 0,
              y: reduced ? 0 : 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 1.1,
              ease: EASE,
            }}
            className="relative z-10"
          >
            {/* Small kicker */}
            <p className="mb-7 text-[10px] uppercase tracking-[0.22em] text-[#F6F2E7]/40 sm:mb-10">
              The work ends here.
            </p>

            <h2
              className={`${DISPLAY} max-w-[1200px] text-[clamp(3.5rem,8vw,9rem)] font-normal leading-[0.8] tracking-[-0.07em]`}
            >
              Keep the
              <br />
              <span className="ml-[8vw] italic text-[#F4E9A9]">
                idea moving.
              </span>
            </h2>
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* ORBITAL OBJECT                                                    */}
          {/* ---------------------------------------------------------------- */}

          <motion.div
            style={{
              rotate: reduced ? 0 : orbRotate,
            }}
            className="absolute -right-2 top-[-1rem] hidden sm:block lg:right-[7%] lg:top-[-2rem]"
          >
            <motion.div
              animate={
                reduced
                  ? undefined
                  : {
                      rotate: 360,
                    }
              }
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: "linear",
              }}
              className="relative flex h-36 w-36 items-center justify-center rounded-full border border-[#F6F2E7]/15 lg:h-48 lg:w-48"
            >
              <div className="absolute inset-3 rounded-full border border-dashed border-[#F4E9A9]/30" />

              <div className="absolute inset-8 rounded-full border border-[#F6F2E7]/10" />

              <span className="absolute top-[-3px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#F4E9A9]" />

              <span className="absolute bottom-[-3px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#2230D2]" />

              <div className="text-center">
                <span className="block text-[8px] uppercase tracking-[0.2em] text-[#F6F2E7]/40">
                  Orixa
                </span>

                <span
                  className={`${DISPLAY} mt-2 block text-2xl tracking-[-0.04em] text-[#F6F2E7]`}
                >
                  Studio
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* GIANT WORDMARK                                                     */}
        {/* ---------------------------------------------------------------- */}

        <div className="relative mt-20 overflow-hidden pb-[0.04em] sm:mt-28 lg:mt-36">
          {/* Baseline */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-[#F6F2E7]/15" />

          <motion.div
            initial={{
              y: reduced ? 0 : "35%",
              opacity: 0,
            }}
            whileInView={{
              y: 0,
              opacity: 1,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 1.3,
              ease: EASE,
            }}
            className="relative"
          >
            <p
              aria-label={displayName}
              className="relative whitespace-nowrap text-center"
              style={{
                fontSize: wordmarkSize,
              }}
            >
              {/* Base */}
              <span
                className={`${DISPLAY} block font-normal leading-[0.78] tracking-[-0.08em] text-transparent`}
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(246,242,231,0.96) 0%, rgba(246,242,231,0.42) 72%, rgba(246,242,231,0.08) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                {displayName}
              </span>

              {/* Moving highlight */}
              <motion.span
                aria-hidden="true"
                className={`${DISPLAY} absolute inset-0 block font-normal leading-[0.78] tracking-[-0.08em] text-transparent`}
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, transparent 35%, rgba(244,233,169,0.95) 50%, transparent 65%)",
                  backgroundSize: "240% 100%",
                  backgroundRepeat: "no-repeat",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
                animate={
                  reduced
                    ? {
                        backgroundPosition: "50% 0%",
                      }
                    : {
                        backgroundPosition: ["130% 0%", "-30% 0%"],
                      }
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
            </p>
          </motion.div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* CLOSING META                                                      */}
        {/* ---------------------------------------------------------------- */}

        <motion.div
          initial={{
            opacity: 0,
            y: reduced ? 0 : 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.8,
            delay: 0.15,
            ease: EASE,
          }}
          className="mt-7 flex flex-col gap-7 border-t border-[#F6F2E7]/10 pt-5 sm:flex-row sm:items-end sm:justify-between"
        >
          {/* Left */}
          <div>
            <p className="text-[8px] uppercase tracking-[0.2em] text-[#F6F2E7]/30">
              End of portfolio
            </p>

            <p
              className={`${DISPLAY} mt-2 text-lg tracking-[-0.03em] text-[#F6F2E7]/70`}
            >
              Thanks for making it this far.
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-5">
            {!profile?.isPremium && (
              <a
                href="https://www.orixaai.me"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Built with OrixaAi (opens in a new tab)"
                className="group inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.17em] text-[#F6F2E7]/40 outline-none transition-colors duration-300 hover:text-[#F6F2E7] focus-visible:text-[#F6F2E7]"
              >
                <span>Built with</span>

                <span className="text-[#F6F2E7]/70">OrixaAi</span>

                <ArrowIcon className="text-[#F4E9A9] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}

            <span className="hidden h-7 w-px bg-[#F6F2E7]/10 sm:block" />

            <span className="text-[9px] uppercase tracking-[0.17em] text-[#F6F2E7]/25">
              2026
            </span>
          </div>
        </motion.div>
      </div>

      {/* ================================================================== */}
      {/* FINAL BLUE STRIP                                                     */}
      {/* ================================================================== */}

      <div className="relative bg-[#2230D2]">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-3.5 sm:px-10 lg:px-14">
          <span className="text-[8px] uppercase tracking-[0.22em] text-[#F6F2E7]/55">
            09 — End
          </span>

          <span className="flex items-center gap-3 text-[8px] uppercase tracking-[0.22em] text-[#F6F2E7]/45">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F4E9A9]" />
            Portfolio complete
          </span>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-[#F4E9A9]/70"
        />
      </div>
    </footer>
  );
}

export default FooterDefault;
