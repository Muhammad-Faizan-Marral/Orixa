"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type CertificatesWallProps = {
  certificates: Array<{
    id?: string;
    name: string;
    issuer?: string;
    issueDate?: string;
    credentialUrl?: string;
  }>;
};

const ease = [0.22, 1, 0.36, 1] as const;

export const CertificatesWall: React.FC<CertificatesWallProps> = ({
  certificates,
}) => {
  const valid = useMemo(
    () => certificates.filter((certificate) => certificate.name?.trim()),
    [certificates]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  if (!valid.length) return null;

  const safeIndex = Math.min(activeIndex, valid.length - 1);
  const active = valid[safeIndex];

  return (
    <section
      aria-label="Certificates"
      className="w-full"
      style={{ fontFamily: "var(--pr-font)" }}
    >
      {/* ───────────────── Intro ───────────────── */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease }}
        className="mb-14 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"
      >
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--pr-accent)" }}
            />

            <span
              className="text-[10px] font-semibold uppercase tracking-[0.28em]"
              style={{
                color:
                  "var(--pr-muted, var(--muted-foreground))",
              }}
            >
              Credentials
            </span>
          </div>

          <h2
            className="max-w-4xl text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.84] tracking-[-0.075em]"
            style={{
              letterSpacing: "var(--pr-heading-tracking)",
            }}
          >
            Certified
            <br />
            <span style={{ color: "var(--pr-accent)" }}>Knowledge.</span>
          </h2>
        </div>

        <div className="flex items-center gap-4 lg:pb-2">
          <span
            className="text-[clamp(2rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.06em]"
          >
            {String(valid.length).padStart(2, "0")}
          </span>

          <span
            className="max-w-[90px] text-[9px] font-semibold uppercase leading-4 tracking-[0.2em]"
            style={{
              color:
                "var(--pr-muted, var(--muted-foreground))",
            }}
          >
            Verified
            <br />
            credentials
          </span>
        </div>
      </motion.div>

      {/* ───────────────── Credential Index ───────────────── */}

      <div
        className="relative border-t"
        style={{ borderColor: "var(--pr-border)" }}
      >
        {valid.map((certificate, index) => {
          const isActive = index === safeIndex;

          return (
            <motion.div
              key={
                certificate.id ??
                `${certificate.name}-${certificate.issuer}-${index}`
              }
              initial={{
                opacity: 0,
                y: 18,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                margin: "-50px",
              }}
              transition={{
                duration: 0.55,
                delay: Math.min(index * 0.055, 0.3),
                ease,
              }}
              className="relative border-b"
              style={{
                borderColor: "var(--pr-border)",
              }}
            >
              <button
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className="group w-full text-left"
                aria-expanded={isActive}
              >
                <div className="grid gap-5 py-7 sm:grid-cols-[70px_minmax(0,1fr)_auto] sm:items-center sm:gap-8 sm:py-9 lg:grid-cols-[100px_minmax(0,1fr)_220px] lg:gap-12">
                  {/* Index */}

                  <span
                    className="text-[10px] font-medium tabular-nums transition-colors duration-300"
                    style={{
                      color: isActive
                        ? "var(--pr-accent)"
                        : "var(--pr-muted, var(--muted-foreground))",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Certificate */}

                  <div className="min-w-0">
                    <motion.h3
                      className="max-w-4xl text-[clamp(1.5rem,3.4vw,3.6rem)] font-medium leading-[0.95] tracking-[-0.055em]"
                      animate={{
                        x: isActive ? 7 : 0,
                      }}
                      transition={{
                        duration: 0.4,
                        ease,
                      }}
                    >
                      {certificate.name}
                    </motion.h3>

                    {certificate.issuer ? (
                      <p
                        className="mt-3 text-xs font-medium transition-colors duration-300 sm:text-sm"
                        style={{
                          color: isActive
                            ? "var(--pr-accent)"
                            : "var(--pr-muted, var(--muted-foreground))",
                        }}
                      >
                        {certificate.issuer}
                      </p>
                    ) : null}
                  </div>

                  {/* Date + indicator */}

                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    {certificate.issueDate ? (
                      <time
                        className="text-[10px] font-medium uppercase tracking-[0.16em]"
                        style={{
                          color:
                            "var(--pr-muted, var(--muted-foreground))",
                        }}
                      >
                        {certificate.issueDate}
                      </time>
                    ) : null}

                    <motion.span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
                      animate={{
                        borderColor: isActive
                          ? "var(--pr-accent)"
                          : "var(--pr-border)",
                        rotate: isActive ? -45 : 0,
                      }}
                      transition={{
                        duration: 0.35,
                        ease,
                      }}
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-3.5 w-3.5"
                        style={{
                          color: isActive
                            ? "var(--pr-accent)"
                            : "var(--pr-muted, var(--muted-foreground))",
                        }}
                      >
                        <path
                          d="M5 15L15 5M7 5H15V13"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.span>
                  </div>
                </div>
              </button>

              {/* ───────── Active Credential Detail ───────── */}

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      height: {
                        duration: 0.45,
                        ease,
                      },
                      opacity: {
                        duration: 0.25,
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="grid pb-8 sm:grid-cols-[70px_minmax(0,1fr)_220px] sm:gap-8 lg:grid-cols-[100px_minmax(0,1fr)_220px] lg:gap-12">
                      <div />

                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          duration: 0.4,
                          delay: 0.08,
                          ease,
                        }}
                        className="flex flex-wrap items-center gap-x-6 gap-y-3"
                      >
                        {active.issuer ? (
                          <span
                            className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                            style={{
                              color:
                                "var(--pr-muted, var(--muted-foreground))",
                            }}
                          >
                            Issued by{" "}
                            <span
                              style={{
                                color:
                                  "var(--pr-foreground, var(--foreground))",
                              }}
                            >
                              {active.issuer}
                            </span>
                          </span>
                        ) : null}

                        {active.issueDate ? (
                          <span
                            className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                            style={{
                              color:
                                "var(--pr-muted, var(--muted-foreground))",
                            }}
                          >
                            {active.issueDate}
                          </span>
                        ) : null}
                      </motion.div>

                      <div className="pt-5 sm:pt-0 sm:text-right">
                        {active.credentialUrl ? (
                          <motion.a
                            href={active.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{
                              opacity: 0,
                            }}
                            animate={{
                              opacity: 1,
                            }}
                            transition={{
                              duration: 0.35,
                              delay: 0.12,
                            }}
                            className="group/link inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em]"
                            style={{
                              color: "var(--pr-accent)",
                            }}
                          >
                            View credential

                            <svg
                              viewBox="0 0 20 20"
                              fill="none"
                              className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1"
                              aria-hidden="true"
                            >
                              <path
                                d="M4.5 10H15.5M10.5 5L15.5 10L10.5 15"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </motion.a>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active underline */}

              <motion.div
                className="absolute bottom-0 left-0 h-px"
                animate={{
                  width: isActive ? "100%" : "0%",
                }}
                transition={{
                  duration: 0.55,
                  ease,
                }}
                style={{
                  background:
                    "linear-gradient(to right, var(--pr-accent), transparent)",
                }}
                aria-hidden="true"
              />
            </motion.div>
          );
        })}
      </div>

      {/* ───────────────── Footer ───────────────── */}

      <div className="mt-8 flex items-center justify-between">
        <span
          className="text-[9px] font-medium uppercase tracking-[0.22em]"
          style={{
            color:
              "var(--pr-muted, var(--muted-foreground))",
          }}
        >
          Professional credentials
        </span>

        <span
          className="h-px w-16"
          style={{
            backgroundColor: "var(--pr-accent)",
          }}
        />
      </div>
    </section>
  );
};

