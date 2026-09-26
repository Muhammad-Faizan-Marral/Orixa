"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ThemeSectionProps } from "../../../types";

const ease = [0.22, 1, 0.36, 1] as const;

const ORANGE = "#ff5a00";
const ORANGE_SOFT = "rgba(255, 90, 0, 0.08)";
const ORANGE_BORDER = "rgba(255, 90, 0, 0.22)";

export function FooterDefault({ config, profile }: ThemeSectionProps) {
  const displayName =
    config?.name?.trim() || profile?.username?.trim() || "Portfolio";

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{
        fontFamily: "var(--pr-font)",
        color: "var(--pr-foreground)",
      }}
    >
      {/* ======================================================
          TOP ACCENT
      ====================================================== */}

      <div className="relative h-px w-full overflow-hidden">
        <motion.div
          initial={{ scaleX: 0, transformOrigin: "left" }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="absolute inset-y-0 left-0 w-full"
          style={{
            background: `linear-gradient(
              90deg,
              ${ORANGE},
              ${ORANGE_BORDER} 35%,
              var(--pr-border) 65%,
              transparent
            )`,
          }}
        />
      </div>

      {/* ======================================================
          MAIN FOOTER
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease }}
        >
          {/* TOP META */}

          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: ORANGE,
                  boxShadow: `0 0 0 5px ${ORANGE_SOFT}`,
                }}
              />

              <span
                className="text-[9px] font-semibold uppercase tracking-[0.28em]"
                style={{
                  color: "var(--pr-muted, var(--muted-foreground))",
                }}
              >
                End of page
              </span>
            </div>

            <span
              className="text-[9px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--pr-muted, var(--muted-foreground))",
              }}
            >
              {currentYear} / Portfolio
            </span>
          </div>

          {/* ==================================================
              IDENTITY
          ================================================== */}

          <div
            className="relative border-t pt-8 sm:pt-10"
            style={{ borderColor: "var(--pr-border)" }}
          >
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
              <div className="min-w-0">
                <p
                  className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em]"
                  style={{
                    color: "var(--pr-muted, var(--muted-foreground))",
                  }}
                >
                  Personal portfolio
                </p>

                <h2
                  className="
                    max-w-6xl
                    break-words
                    text-[clamp(3.5rem,10vw,9rem)]
                    font-medium
                    leading-[0.78]
                    tracking-[-0.085em]
                  "
                >
                  {displayName}
                  <span style={{ color: ORANGE }}>.</span>
                </h2>
              </div>

              {/* ==================================================
                  SIDE META
              ================================================== */}

              <div className="flex flex-col justify-end">
                <div
                  className="border-t pt-4"
                  style={{
                    borderColor: "var(--pr-border)",
                  }}
                >
                  <span
                    className="block text-[9px] uppercase tracking-[0.2em]"
                    style={{
                      color: "var(--pr-muted, var(--muted-foreground))",
                    }}
                  >
                    Available online
                  </span>

                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: ORANGE,
                      }}
                    />

                    <span
                      className="text-sm"
                      style={{
                        color: "var(--pr-foreground)",
                      }}
                    >
                      {currentYear}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              ORANGE SIGNATURE LINE
          ================================================== */}

          <div className="mt-14 flex items-center gap-4 sm:mt-16">
            <span
              className="h-px w-12 sm:w-20"
              style={{
                background: ORANGE,
              }}
            />

            <span
              className="text-[9px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--pr-muted, var(--muted-foreground))",
              }}
            >
              Keep scrolling · Keep creating
            </span>
          </div>

          {/* ==================================================
              BOTTOM BAR
          ================================================== */}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="mt-16 border-t pt-5 sm:mt-20"
            style={{
              borderColor: "var(--pr-border)",
            }}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              {/* COPYRIGHT */}

              <div className="flex items-center gap-3">
                <span
                  className="text-[9px] tabular-nums"
                  style={{
                    color: "var(--pr-muted, var(--muted-foreground))",
                  }}
                >
                  © {currentYear}
                </span>

                <span
                  className="h-px w-5"
                  style={{
                    background: ORANGE,
                  }}
                />

                <span
                  className="text-[10px]"
                  style={{
                    color: "var(--pr-muted, var(--muted-foreground))",
                  }}
                >
                  {displayName}
                </span>
              </div>

              {/* ORIXAAI ATTRIBUTION */}

              {!profile?.isPremium && (
                <a
                  href="https://www.orixaai.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-fit items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] transition-opacity duration-300 hover:opacity-80"
                  style={{
                    color: "var(--pr-muted, var(--muted-foreground))",
                  }}
                >
                  <span>Built with</span>

                  <span
                    className="transition-colors duration-300"
                    style={{
                      color: "var(--pr-foreground)",
                    }}
                  >
                    OrixaAi
                  </span>

                  <span
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    style={{
                      color: ORANGE,
                    }}
                  >
                    →
                  </span>
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}

export default FooterDefault;
