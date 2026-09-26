// ======================================================
// FILE: CertificatesEditorial.tsx
// Premium Editorial Certificates Section
// Orange Accent + Fully Dynamic
// ======================================================

"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { RendererCertificate } from "@/portfolio-renderer/types";
import { ThemeSectionProps } from "@/themes/types";

type Props = {
  certificates: RendererCertificate[];
};
const ORANGE = "#ff5a00";
const ORANGE_SOFT = "rgba(255, 90, 0, 0.08)";
const ORANGE_BORDER = "rgba(255, 90, 0, 0.22)";
const ease = [0.22, 1, 0.36, 1] as const;

function getYear(date?: string) {
  if (!date?.trim()) return "";
  const match = date.match(/\d{4}/);
  return match ? match[0] : date.trim();
}

export function CertificatesDefault({ config }: ThemeSectionProps) {
  const valid = useMemo(
    () =>
      (config.certificates ?? []).filter(
        (item) =>
          item.name?.trim() ||
          item.issueDate?.trim() ||
          item.credentialUrl?.trim(),
      ),
    [config.certificates],
  );

  if (!valid.length) return null;

  return (
    <section
      id="certificates"
      className="relative w-full "
      style={{
        fontFamily: "var(--pr-font)",
      }}
    >
      {/* ================= HEADER ================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.7,
          ease,
        }}
        className="mb-16"
      >
        <div className="mb-6 flex items-center gap-3">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: "var(--pr-accent)",
            }}
          />

          <span
            className="text-[10px] font-semibold uppercase tracking-[0.28em]"
            style={{
              color: ORANGE,
            }}
          >
            Credentials
          </span>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {/* Heading */}

          <div>
            <h2
              className="
                text-[clamp(3rem,7vw,7rem)]
                font-semibold
                leading-[0.85]
                tracking-[-0.07em]
               
              "
            >
              Certified
              <br />
              <span
                style={{
                  color: "var(--pr-accent)",
                }}
              >
                Knowledge
                <span style={{ color: ORANGE }}>.</span>
              </span>
            </h2>

            <p
              className="
                mt-8
                max-w-md
                text-sm
                leading-7
              "
              style={{
                color: "var(--pr-muted, var(--muted-foreground))",
              }}
            >
              Professional certifications and credentials that complement
              practical experience and continuous learning.
            </p>
          </div>

          {/* Count */}

          <div className="text-right">
            <div
              className="
                text-[clamp(3rem,5vw,5rem)]
                font-medium
                leading-none
                tracking-[-0.07em]
              "
            >
              {String(valid.length).padStart(2, "0")}
            </div>

            <div
              className="
                mt-2
                text-[10px]
                uppercase
                tracking-[0.18em]
              "
              style={{
                
                color: "var(--pr-muted, var(--muted-foreground))",
              }}
            >
              Credentials
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= CERTIFICATE LIST ================= */}

      <div
        className="border-t"
        style={{
          borderColor: "var(--pr-border)",
        }}
      >
        {valid.map((item, index) => {
          const year = getYear(item.issueDate);

          const title = item.name?.trim() || "Certification";

          const issuer = item.issuer?.trim();

          return (
            <motion.article
              key={
                item.id ??
                `${item.name}-${item.issuer}-${item.issueDate}-${index}`
              }
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                margin: "-80px",
              }}
              transition={{
                duration: 0.7,
                delay: Math.min(index * 0.08, 0.3),
                ease,
              }}
              className="
                group
                relative
                border-b
                py-10
              "
              style={{
                borderColor: "var(--pr-border)",
              }}
            >
              <div
                className="
                  grid
                  gap-8
                  lg:grid-cols-[100px_minmax(0,1fr)_220px]
                "
              >
                {/* ================= NUMBER ================= */}

                <div>
                  <span
                    className="
                      text-[10px]
                      font-medium
                      tabular-nums
                    "
                    style={{
                      color: "var(--pr-muted, var(--muted-foreground))",
                    }}
                  >
                    / {String(index + 1).padStart(2, "0")}
                  </span>

                  {year && (
                    <div
                      className="
                        mt-8
                        text-[11px]
                        font-medium
                        uppercase
                        tracking-[0.16em]
                      "
                      style={{
                        color: "var(--pr-accent)",
                      }}
                    >
                      {year}
                    </div>
                  )}
                </div>

                {/* ================= MAIN ================= */}

                <div className="min-w-0">
                  <motion.h3
                    whileHover={{
                      x: 8,
                    }}
                    transition={{
                      duration: 0.35,
                      ease,
                    }}
                    className="
                      max-w-4xl
                      text-[clamp(2rem,4vw,4.5rem)]
                      font-medium
                      leading-[0.95]
                      tracking-[-0.06em]
                    "
                  >
                    {title}
                  </motion.h3>

                  {/* Issuer */}

                  {issuer && (
                    <div className="mt-6 flex items-center gap-4">
                      <div
                        className="
                          h-px
                          w-8
                          transition-all
                          duration-500
                          group-hover:w-14
                        "
                        style={{
                          background: "var(--pr-accent)",
                        }}
                      />

                      <p
                        className="text-sm"
                        style={{
                          color: "var(--pr-muted, var(--muted-foreground))",
                        }}
                      >
                        {issuer}
                      </p>
                    </div>
                  )}

                  {/* If issuer is missing, still keep a small accent detail */}

                  {!issuer && (
                    <div
                      className="
                        mt-7
                        h-px
                        w-8
                        transition-all
                        duration-500
                        group-hover:w-14
                      "
                      style={{
                        background: "var(--pr-accent)",
                      }}
                    />
                  )}
                </div>

                {/* ================= META ================= */}

                <div className="flex flex-col justify-between lg:text-right">
                  <div>
                    {year && (
                      <>
                        <span
                          className="
                            text-[9px]
                            uppercase
                            tracking-[0.18em]
                          "
                          style={{
                            color: "var(--pr-muted, var(--muted-foreground))",
                          }}
                        >
                          Issued
                        </span>

                        <div
                          className="
                            mt-2
                            text-sm
                            font-medium
                          "
                          style={{
                            color: "var(--pr-foreground)",
                          }}
                        >
                          {year}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Credential Link */}

                  {item.credentialUrl?.trim() && (
                    <div className="mt-8 lg:mt-0">
                      <motion.a
                        href={item.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{
                          x: 4,
                        }}
                        transition={{
                          duration: 0.3,
                          ease,
                        }}
                        className="
                          group/link
                          inline-flex
                          items-center
                          gap-2
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                        "
                        style={{
                          color: "var(--pr-accent)",
                        }}
                      >
                        View Credential
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          className="
                            h-3.5
                            w-3.5
                            transition-transform
                            duration-300
                            group-hover/link:translate-x-1
                          "
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
                    </div>
                  )}
                </div>
              </div>

              {/* ================= HOVER LINE ================= */}

              <motion.div
                className="
                  absolute
                  bottom-0
                  left-0
                  h-px
                "
                initial={{
                  width: 0,
                }}
                whileHover={{
                  width: "100%",
                }}
                transition={{
                  duration: 0.6,
                  ease,
                }}
                style={{
                  background:
                    "linear-gradient(to right,var(--pr-accent),transparent)",
                }}
                aria-hidden="true"
              />
            </motion.article>
          );
        })}
      </div>

      {/* ================= FOOTER ================= */}

      <div className="mt-14 flex items-center gap-4">
        <div
          className="h-px flex-1"
          style={{
            background:
              "linear-gradient(to right,var(--pr-border),transparent)",
          }}
        />

        <span
          className="
            text-[9px]
            uppercase
            tracking-[0.22em]
          "
          style={{
            color: "var(--pr-muted, var(--muted-foreground))",
          }}
        >
          Professional Credentials
        </span>

        <div
          className="h-px w-10"
          style={{
            background: "var(--pr-accent)",
          }}
        />
      </div>
    </section>
  );
}

export default CertificatesDefault;
