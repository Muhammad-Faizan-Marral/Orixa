"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type PortraitAboutProps = {
  config: {
    name?: string | null;
    about?: string | null;
    avatarUrl?: string | null;
    phone?: string | null;
    location?: string | null;
  };
};

const ease = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease,
    },
  },
};

function MetaItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="group relative flex flex-col gap-1.5 py-4"
    >
      <div
        className="absolute left-0 top-0 h-px w-full"
        style={{
          background:
            "color-mix(in srgb, var(--pr-border) 75%, transparent)",
        }}
      />

      <span
        className="text-[0.62rem] font-semibold uppercase tracking-[0.2em]"
        style={{
          color: "var(--pr-muted, var(--muted-foreground))",
        }}
      >
        {label}
      </span>

      <span
        className="text-sm font-medium tracking-[-0.01em]"
        style={{
          color: "var(--pr-foreground, var(--foreground))",
        }}
      >
        {value}
      </span>
    </motion.div>
  );
}

export function PortraitAbout({ config }: PortraitAboutProps) {
  const {
    name,
    about,
    avatarUrl,
    phone,
    location,
  } = config;

  const reduceMotion = useReducedMotion();

  if (!about) return null;

  const initial =
    name?.trim().charAt(0).toUpperCase() || "?";

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
       
        color: "var(--pr-foreground, var(--foreground))",
      }}
      aria-label="About"
    >
      {/* Ambient accent glow */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full blur-3xl"
        // style={{ background:"color-mix(in srgb, var(--pr-accent) 7%, transparent)",}}
        aria-hidden="true"
      />

      <div
        className="
          relative
          grid
          grid-cols-1
          gap-12
          lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]
          lg:gap-16
          xl:grid-cols-[380px_minmax(0,1fr)]
          xl:gap-24
        "
      >
        {/* =========================================================
            PORTRAIT
        ========================================================== */}

        <motion.div
          className="relative"
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  x: -24,
                  scale: 0.98,
                }
          }
          whileInView={
            reduceMotion
              ? undefined
              : {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                }
          }
          viewport={{
            once: true,
            margin: "-80px",
          }}
          transition={{
            duration: 0.8,
            ease,
          }}
        >
          {/* Decorative accent line */}
          <div
            className="absolute -left-3 top-8 hidden h-20 w-px lg:block"
            style={{
              background:
                "linear-gradient(to bottom, var(--pr-accent), transparent)",
            }}
            aria-hidden="true"
          />

          {/* Image frame */}
          <div
            className="
              group
              relative
              aspect-[4/5]
              w-full
              overflow-hidden
            "
            style={{
              borderRadius: "var(--pr-radius, 20px)",
              border: "var(--pr-card-border, 1px solid var(--pr-border))",
              background:
                "var(--pr-surface, var(--surface))",
              boxShadow:
                "var(--pr-card-shadow, 0 24px 70px -30px rgba(0,0,0,0.35))",
            }}
          >
            {/* Image */}
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={
                  name
                    ? `${name} portrait`
                    : "Portrait"
                }
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  group-hover:scale-[1.035]
                "
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--pr-accent) 18%, transparent), transparent 55%), var(--pr-surface, var(--surface))",
                }}
              >
                <span
                  className="
                    select-none
                    text-7xl
                    font-semibold
                    tracking-[-0.06em]
                  "
                  style={{
                    color: "var(--pr-accent)",
                  }}
                  aria-label={name ?? ""}
                >
                  {initial}
                </span>
              </div>
            )}

            {/* Image tint */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-70
                transition-opacity
                duration-500
                group-hover:opacity-40
              "
              style={{
                background:
                  "linear-gradient(145deg, color-mix(in srgb, var(--pr-accent) 8%, transparent), transparent 45%, color-mix(in srgb, var(--pr-background, #000) 20%, transparent))",
              }}
              aria-hidden="true"
            />

            {/* Bottom glass information */}
            {name ? (
              <div
                className="
                  absolute
                  inset-x-4
                  bottom-4
                  overflow-hidden
                  rounded-xl
                  px-4
                  py-3
                  backdrop-blur-md
                "
                style={{
                  background:
                    "color-mix(in srgb, var(--pr-background, #000) 62%, transparent)",
                  border:
                    "1px solid color-mix(in srgb, white 14%, transparent)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <p
                    className="
                      min-w-0
                      truncate
                      text-sm
                      font-medium
                      tracking-[-0.01em]
                      text-white
                    "
                  >
                    {name}
                  </p>

                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      background: "var(--pr-accent)",
                      boxShadow:
                        "0 0 12px color-mix(in srgb, var(--pr-accent) 70%, transparent)",
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* Small visual index */}
          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              px-1
            "
          >
            <span
              className="text-[0.6rem] font-medium uppercase tracking-[0.2em]"
              style={{
                color:
                  "var(--pr-muted, var(--muted-foreground))",
              }}
            >
              About / 01
            </span>

            <div
              className="h-px w-12"
              style={{
                background:
                  "color-mix(in srgb, var(--pr-border) 80%, transparent)",
              }}
            />
          </div>
        </motion.div>

        {/* =========================================================
            CONTENT
        ========================================================== */}

        <motion.div
          className="
            flex
            min-w-0
            flex-col
            justify-center
            lg:py-8
            xl:py-12
          "
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            margin: "-60px",
          }}
          variants={reduceMotion ? undefined : stagger}
        >
          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            className="mb-7 flex items-center gap-3"
          >
            <span
              className="
                text-[0.64rem]
                font-semibold
                uppercase
                tracking-[0.24em]
              "
              style={{
                color:
                  "var(--pr-muted, var(--muted-foreground))",
              }}
            >
              About me
            </span>

            <span
              className="h-px w-10"
              style={{
                background: "var(--pr-accent)",
              }}
              aria-hidden="true"
            />
          </motion.div>

          {/* Heading */}
          <motion.div
            variants={fadeUp}
            className="max-w-3xl"
          >
            <h2
              className="
                text-[clamp(2.4rem,5vw,4.8rem)]
                font-semibold
                leading-[0.98]
                tracking-[-0.055em]
              "
            >
              A little
              <span
                className="relative mx-2 inline-block"
                style={{
                  color: "var(--pr-accent)",
                }}
              >
                about
              </span>
              me.
            </h2>
          </motion.div>

          {/* Accent divider */}
          <motion.div
            variants={fadeUp}
            className="my-8 h-px w-full max-w-2xl"
            style={{
              background:
                "linear-gradient(to right, var(--pr-border), transparent)",
            }}
            aria-hidden="true"
          />

          {/* Main paragraph */}
          <motion.div
            variants={fadeUp}
            className="max-w-2xl"
          >
            <p
              className="
                whitespace-pre-line
                text-[clamp(1.05rem,1.5vw,1.25rem)]
                leading-[1.75]
                tracking-[-0.015em]
              "
              style={{
                color:
                  "var(--pr-foreground, var(--foreground))",
              }}
            >
              {about}
            </p>
          </motion.div>

          {/* Metadata */}
          {(location || phone) && (
            <motion.div
              variants={fadeUp}
              className="
                mt-10
                grid
                max-w-2xl
                grid-cols-1
                gap-x-10
                sm:grid-cols-2
              "
            >
              {location ? (
                <MetaItem
                  label="Based in"
                  value={location}
                />
              ) : null}

              {phone ? (
                <MetaItem
                  label="Phone"
                  value={phone}
                />
              ) : null}
            </motion.div>
          )}

          {/* Bottom accent */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex items-center gap-4"
          >
            <div
              className="h-8 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, var(--pr-accent), transparent)",
              }}
              aria-hidden="true"
            />

            <span
              className="
                text-[0.62rem]
                font-medium
                uppercase
                tracking-[0.2em]
              "
              style={{
                color:
                  "var(--pr-muted, var(--muted-foreground))",
              }}
            >
              Personal profile
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default PortraitAbout;