// ======================================================
// FILE: EducationEditorial.tsx
// Premium Editorial Education Section
// Orange Accent + Fully Dynamic
// ======================================================

"use client";

import React from "react";
import { motion } from "framer-motion";
import { RendererEducation } from "@/portfolio-renderer/types";

type Props = {
  education: RendererEducation[];
};

const ease = [0.22, 1, 0.36, 1] as const;

function getYear(date?: string) {
  if (!date) return "";
  const match = date.match(/\d{4}/);
  return match ? match[0] : date;
}

function formatDegree(degree?: string, field?: string) {
  if (degree && field) return `${degree} • ${field}`;
  if (degree) return degree;
  if (field) return field;
  return null;
}

export function EducationDefault({ education }: Props) {
  const valid = education.filter(
    (item) =>
      item.institution?.trim() || item.degree?.trim() || item.field?.trim(),
  );

  if (!valid.length) return null;

  return (
    <section
      id="education"
      className="relative w-full"
      style={{
        fontFamily: "var(--pr-font)",
      }}
    >
      {/* ================= HEADER ================= */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
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
              color: "var(--pr-muted, var(--muted-foreground))",
            }}
          >
            Education
          </span>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2
              className="
                text-[clamp(3rem,7vw,7rem)]
                font-semibold
                leading-[0.85]
                tracking-[-0.07em]
              "
            >
              Learning
              <br />
              <span
                style={{
                  color: "var(--pr-accent)",
                }}
              >
                Journey.
              </span>
            </h2>

            <p
              className="mt-8 max-w-md text-sm leading-7"
              style={{
                color: "var(--pr-muted, var(--muted-foreground))",
              }}
            >
              Academic foundation, specialized studies and continuous learning
              experiences.
            </p>
          </div>

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
              Qualifications
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= EDUCATION LIST ================= */}

      <div
        className="border-t"
        style={{
          borderColor: "var(--pr-border)",
        }}
      >
        {valid.map((item, index) => {
          const degree = formatDegree(item.degree, item.field);

          const startYear = getYear(item.startDate);

          const endYear = getYear(item.endDate);

          const period =
            startYear && endYear
              ? `${startYear} — ${endYear}`
              : startYear || endYear || null;

          return (
            <motion.article
              key={item.id ?? `${item.institution}-${index}`}
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
                  lg:grid-cols-[100px_1fr_220px]
                "
              >
                {/* Number */}

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

                  {period && (
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
                      {period}
                    </div>
                  )}
                </div>

                {/* Main */}

                <div>
                  <motion.h3
                    whileHover={{
                      x: 8,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="
                      text-[clamp(2rem,4vw,4.5rem)]
                      font-medium
                      leading-[0.95]
                      tracking-[-0.06em]
                    "
                  >
                    {degree || item.institution}
                  </motion.h3>

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
                      {item.institution}
                    </p>
                  </div>
                </div>

                {/* Description */}

                <div className="flex flex-col justify-between">
                  {item.description && (
                    <p
                      className="
                        text-sm
                        leading-7
                      "
                      style={{
                        color: "var(--pr-muted, var(--muted-foreground))",
                      }}
                    >
                      {item.description}
                    </p>
                  )}

                  {period && (
                    <div className="mt-8 flex items-center gap-3">
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
                        Period
                      </span>

                      <div
                        className="h-px flex-1"
                        style={{
                          background: "var(--pr-border)",
                        }}
                      />

                      <span
                        className="text-xs"
                        style={{
                          color: "var(--pr-foreground)",
                        }}
                      >
                        {period}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Line */}

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
                }}
                style={{
                  background:
                    "linear-gradient(to right,var(--pr-accent),transparent)",
                }}
              />
            </motion.article>
          );
        })}
      </div>

      {/* Footer */}

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
          Academic Background
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

export default EducationDefault;
