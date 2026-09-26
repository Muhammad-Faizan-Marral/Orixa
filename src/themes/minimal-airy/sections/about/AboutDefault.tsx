"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

/* ============================================================================
   THEME
============================================================================ */

const ORANGE = "#ff5a00";
const INK = "#111111";
const PAPER = "#f4f1eb";
const MUTED = "#6d6963";
const BORDER = "rgba(17, 17, 17, 0.14)";

const ease = [0.22, 1, 0.36, 1] as const;

/* ============================================================================
   ANIMATION
============================================================================ */

const reveal = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease,
    },
  },
};

const imageReveal = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease,
    },
  },
};

/* ============================================================================
   META ITEM
============================================================================ */

function MetaItem({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="group relative flex min-w-0 flex-col gap-2 py-4">
      <span
        className="text-[9px] font-semibold uppercase tracking-[0.22em]"
        style={{
          color: MUTED,
        }}
      >
        {label}
      </span>

      <span
        className="truncate text-sm font-medium tracking-[-0.01em]"
        style={{
          color: INK,
        }}
      >
        {value}
      </span>

      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-100 transition-transform duration-500 group-hover:scale-x-[0.72]"
        style={{
          background: BORDER,
        }}
      />
    </div>
  );

  if (!href) return content;

  return (
    <a
      href={href}
      className="block no-underline"
      style={{
        color: "inherit",
      }}
    >
      {content}
    </a>
  );
}

/* ============================================================================
   ABOUT
============================================================================ */

export function AboutDefault({ config }: ThemeSectionProps) {
  const reduceMotion = useReducedMotion();

  const name = config.name?.trim() || "Creative Professional";

  const about = config.about?.trim();

  const avatarUrl = config.avatarUrl?.trim();

  const phone = config.phone?.trim();

  const location = config.location?.trim();

  /**
   * Empty About section should not render.
   */
  if (!about) {
    return null;
  }

  const initial = name.charAt(0).toUpperCase() || "O";

  const phoneHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : undefined;

  return (
    <section
      id="about"
      aria-label="About"
      className="relative w-full overflow-hidden"
      style={{
        background: PAPER,
        color: INK,
      }}
    >
      {/* ======================================================================
          TOP RULE
      ====================================================================== */}

      <div
        aria-hidden="true"
        className="mx-auto h-px w-[calc(100%-2.5rem)] max-w-[1500px]"
        style={{
          background: BORDER,
        }}
      />

      {/* ======================================================================
          AMBIENT ORANGE SHAPE
      ====================================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 h-[420px] w-[420px] rounded-full opacity-[0.08] blur-3xl"
        style={{
          background: ORANGE,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] top-[42%] h-2 w-2 rounded-full"
        style={{
          background: ORANGE,
          boxShadow: `0 0 28px ${ORANGE}`,
        }}
      />

      {/* ======================================================================
          MAIN CONTAINER
      ====================================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-[1500px]
          px-5
          py-20
          sm:px-8
          sm:py-24
          lg:px-12
          lg:py-32
          xl:px-16
          xl:py-36
        "
      >
        {/* ====================================================================
            SECTION HEADER
        ==================================================================== */}

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{
            once: true,
            margin: "-80px",
          }}
          variants={reveal}
          className="
            mb-14
            flex
            items-start
            justify-between
            gap-8
            lg:mb-20
          "
        >
          <div className="flex items-center gap-4">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.28em]"
              style={{
                color: ORANGE,
              }}
            >
              About
            </span>

            <span
              aria-hidden="true"
              className="h-px w-12"
              style={{
                background: ORANGE,
              }}
            />
          </div>

          <span
            className="hidden text-[10px] font-medium uppercase tracking-[0.25em] sm:block"
            style={{
              color: MUTED,
            }}
          >
            01 / Profile
          </span>
        </motion.div>

        {/* ====================================================================
            CONTENT GRID
        ==================================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-14
            lg:grid-cols-[0.72fr_1.28fr]
            lg:gap-20
            xl:grid-cols-[420px_minmax(0,1fr)]
            xl:gap-28
          "
        >
          {/* ==================================================================
              PORTRAIT
          ================================================================== */}

          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{
              once: true,
              margin: "-100px",
            }}
            variants={imageReveal}
            className="relative"
          >
            <div className="relative">
              {/* Orange offset frame */}

              <div
                aria-hidden="true"
                className="absolute -bottom-3 -left-3 h-full w-full"
                style={{
                  border: `1px solid ${ORANGE}`,
                }}
              />

              {/* Portrait */}

              <div
                className="
                  group
                  relative
                  aspect-[4/5]
                  w-full
                  overflow-hidden
                "
                style={{
                  background: "#dedad2",
                }}
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={`${name} portrait`}
                    fill
                    sizes="
                      (max-width: 1024px) 100vw,
                      420px
                    "
                    className="
                      object-cover
                      grayscale-[18%]
                      transition-transform
                      duration-1000
                      ease-out
                      group-hover:scale-[1.035]
                    "
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(145deg, #242424 0%, #111111 100%)",
                    }}
                  >
                    <span
                      className="
                        select-none
                        text-[clamp(7rem,18vw,12rem)]
                        font-bold
                        leading-none
                        tracking-[-0.09em]
                      "
                      style={{
                        color: ORANGE,
                      }}
                    >
                      {initial}
                    </span>
                  </div>
                )}

                {/* Image contrast */}

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-700 group-hover:opacity-30"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,90,0,0.10), transparent 38%, rgba(0,0,0,0.22))",
                  }}
                />

                {/* Image bottom label */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3
                  "
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.72), transparent)",
                  }}
                >
                  <span
                    className="text-[9px] font-semibold uppercase tracking-[0.2em]"
                    style={{
                      color: "rgba(255,255,255,0.78)",
                    }}
                  >
                    {name}
                  </span>

                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      background: ORANGE,
                      boxShadow: `0 0 14px ${ORANGE}`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Portrait caption */}

            <div className="mt-6 flex items-center justify-between">
              <span
                className="text-[9px] font-semibold uppercase tracking-[0.24em]"
                style={{
                  color: MUTED,
                }}
              >
                Personal profile
              </span>

              <span
                className="text-[9px] font-medium"
                style={{
                  color: MUTED,
                }}
              >
                01
              </span>
            </div>
          </motion.div>

          {/* ==================================================================
              CONTENT
          ================================================================== */}

          <motion.div
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{
              once: true,
              margin: "-80px",
            }}
            transition={{
              staggerChildren: 0.09,
              delayChildren: 0.08,
            }}
            className="
              flex
              min-w-0
              flex-col
              justify-center
            "
          >
            {/* Giant editorial heading */}

            <motion.h2
              variants={reduceMotion ? undefined : reveal}
              className="
                max-w-4xl
                text-[clamp(3rem,7vw,7.5rem)]
                font-bold
                leading-[0.86]
                tracking-[-0.075em]
              "
              style={{
                fontFamily:
                  "var(--theme-font-display, var(--pr-font-display, sans-serif))",
              }}
            >
              More than
              <br />
              <span
                style={{
                  color: ORANGE,
                }}
              >
                the work.
              </span>
            </motion.h2>

            {/* Divider */}

            <motion.div
              variants={reduceMotion ? undefined : reveal}
              aria-hidden="true"
              className="my-9 h-px w-full"
              style={{
                background: BORDER,
              }}
            />

            {/* About copy */}

            <motion.div
              variants={reduceMotion ? undefined : reveal}
              className="max-w-2xl"
            >
              <p
                className="
                  whitespace-pre-line
                  text-[clamp(1.05rem,1.5vw,1.3rem)]
                  leading-[1.75]
                  tracking-[-0.015em]
                "
                style={{
                  color: INK,
                }}
              >
                {about}
              </p>
            </motion.div>

            {/* ==================================================================
                META
            ================================================================== */}

            {(location || phone) && (
              <motion.div
                variants={reduceMotion ? undefined : reveal}
                className="
                  mt-12
                  grid
                  max-w-2xl
                  grid-cols-1
                  gap-x-10
                  sm:grid-cols-2
                "
              >
                {location ? (
                  <MetaItem label="Based in" value={location} />
                ) : null}

                {phone ? (
                  <MetaItem label="Phone" value={phone} href={phoneHref} />
                ) : null}
              </motion.div>
            )}

            {/* ==================================================================
                BOTTOM STATEMENT
            ================================================================== */}

            <motion.div
              variants={reduceMotion ? undefined : reveal}
              className="
                mt-12
                flex
                items-center
                gap-4
              "
            >
              <span
                className="h-10 w-[3px]"
                style={{
                  background: ORANGE,
                }}
              />

              <span
                className="
                  max-w-md
                  text-[9px]
                  font-semibold
                  uppercase
                  leading-[1.7]
                  tracking-[0.2em]
                "
                style={{
                  color: MUTED,
                }}
              >
                Building thoughtful digital experiences with purpose and
                personality.
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* ====================================================================
            BOTTOM SECTION INDEX
        ==================================================================== */}

        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{
            once: true,
          }}
          variants={reduceMotion ? undefined : reveal}
          className="
            mt-20
            flex
            items-center
            justify-between
            gap-5
            border-t
            pt-5
          "
          style={{
            borderColor: BORDER,
          }}
        >
          <span
            className="text-[9px] font-semibold uppercase tracking-[0.24em]"
            style={{
              color: MUTED,
            }}
          >
            About / 01
          </span>

          <div className="flex items-center gap-3">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: ORANGE,
              }}
            />

            <span
              className="text-[9px] font-medium uppercase tracking-[0.2em]"
              style={{
                color: MUTED,
              }}
            >
              {name}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutDefault;
