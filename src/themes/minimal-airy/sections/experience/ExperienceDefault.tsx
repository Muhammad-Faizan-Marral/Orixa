"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { ThemeSectionProps } from "../../../types";

const ORANGE = "#ff5a00";
const ORANGE_SOFT = "rgba(255, 90, 0, 0.08)";
const ORANGE_BORDER = "rgba(255, 90, 0, 0.22)";

const ease = [0.22, 1, 0.36, 1] as const;

function formatDateRange(
  startDate?: string | null,
  endDate?: string | null,
  current?: boolean | null,
) {
  const start = startDate?.trim();
  const end = current ? "Present" : endDate?.trim();

  if (start && end) return `${start} — ${end}`;
  if (start) return start;
  if (end) return end;

  return null;
}

function getInitials(role?: string | null, company?: string | null): string {
  const source = company?.trim() || role?.trim() || "";

  if (!source) return "EX";

  const words = source.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function getDurationLabel(
  startDate?: string | null,
  endDate?: string | null,
  current?: boolean | null,
) {
  if (!startDate) return null;

  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return null;

  const end = current ? new Date() : endDate ? new Date(endDate) : null;

  if (!end || Number.isNaN(end.getTime())) return null;

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (months < 1) return "< 1 month";
  if (months === 1) return "1 month";

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years > 0 && remainingMonths > 0) {
    return `${years}y ${remainingMonths}m`;
  }

  if (years > 0) {
    return `${years} ${years === 1 ? "year" : "years"}`;
  }

  return `${months} months`;
}

function ExperienceMark({ index, active }: { index: number; active: boolean }) {
  return (
    <div
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500"
      style={{
        background: active ? ORANGE : ORANGE_SOFT,
        color: active ? "#fff" : ORANGE,
        boxShadow: active
          ? "0 0 0 6px rgba(255,90,0,0.08), 0 10px 30px rgba(255,90,0,0.18)"
          : "none",
      }}
      aria-hidden="true"
    >
      <span className="text-[9px] font-semibold tabular-nums tracking-[0.08em]">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

export function ExperienceDefault({ config }: ThemeSectionProps) {
  const valid = useMemo(
    () =>
      (config.experience ?? []).filter(
        (item) =>
          item.role?.trim() || item.company?.trim() || item.description?.trim(),
      ),
    [config.experience],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  if (!valid.length) return null;


  const safeIndex = Math.min(activeIndex, valid.length - 1);
  const activeExperience = valid[safeIndex];

  return (
    <section
      id="experience"
      className="relative w-full overflow-hidden px-12"
      aria-label="Professional experience"
    >
      {/* =========================================================
          BACKGROUND DETAIL
      ========================================================== */}

      <div
        className="pointer-events-none absolute -right-48 top-20 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,90,0,0.07) 0%, transparent 68%)",
        }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute left-0 top-[30%] h-40 w-px"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(255,90,0,0.35), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative">
        {/* =========================================================
            HEADER
        ========================================================== */}

        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="mb-14 sm:mb-20"
        >
          <div className="mb-7 flex items-center gap-3">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: ORANGE,
                boxShadow: "0 0 12px rgba(255,90,0,0.45)",
              }}
            />

            <span
              className="text-[10px] font-semibold uppercase tracking-[0.28em]"
              style={{
                color: "rgba(0,0,0,0.48)",
              }}
            >
              Experience
            </span>

            <span
              className="h-px w-10"
              style={{
                background: ORANGE,
              }}
            />
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2
                className="
                  text-[clamp(3.4rem,8vw,8rem)]
                  font-semibold
                  leading-[0.82]
                  tracking-[-0.075em]
                "
              >
                Work
                <span style={{ color: ORANGE }}>.</span>
              </h2>

              <p
                className="mt-7 max-w-xl text-sm leading-7 sm:text-base"
                style={{
                  color: "rgba(0,0,0,0.52)",
                }}
              >
                A timeline of roles, responsibilities and places where
                experience turned into meaningful work.
              </p>
            </div>

            <div className="flex items-end gap-4">
              <span
                className="
                  text-[clamp(3.5rem,6vw,5.5rem)]
                  font-medium
                  leading-none
                  tracking-[-0.075em]
                "
              >
                {String(valid.length).padStart(2, "0")}
              </span>

              <div className="pb-1">
                <div
                  className="text-[9px] font-semibold uppercase tracking-[0.2em]"
                  style={{
                    color: "rgba(0,0,0,0.42)",
                  }}
                >
                  {valid.length === 1 ? "Role" : "Roles"}
                </div>

                <div
                  className="mt-2 h-px w-12"
                  style={{
                    background: ORANGE,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.header>

        {/* =========================================================
            EXPERIENCE LAYOUT
        ========================================================== */}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* =======================================================
              TIMELINE
          ======================================================== */}

          <div
            className="border-t"
            style={{
              borderColor: "rgba(0,0,0,0.12)",
            }}
          >
            {valid.map((job, index) => {
              const isActive = index === safeIndex;

              const dateRange = formatDateRange(
                job.startDate,
                job.endDate,
                job.current,
              );

              const duration = getDurationLabel(
                job.startDate,
                job.endDate,
                job.current,
              );

              return (
                <motion.article
                  key={
                    job.id ??
                    `${job.company ?? "company"}-${job.role ?? "role"}-${index}`
                  }
                  initial={{
                    opacity: 0,
                    y: 24,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    margin: "-70px",
                  }}
                  transition={{
                    duration: 0.6,
                    delay: Math.min(index * 0.07, 0.35),
                    ease,
                  }}
                  className="group border-b"
                  style={{
                    borderColor: "rgba(0,0,0,0.12)",
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    className="w-full text-left"
                    aria-expanded={isActive}
                  >
                    <div
                      className="
                        relative
                        grid
                        gap-5
                        py-7
                        sm:grid-cols-[52px_minmax(0,1fr)_auto]
                        sm:items-start
                        sm:gap-7
                        sm:py-9
                        lg:grid-cols-[52px_minmax(0,1fr)_150px]
                        lg:gap-8
                      "
                    >
                      {/* Number */}

                      <ExperienceMark index={index} active={isActive} />

                      {/* Main information */}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          {job.current ? (
                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                px-2.5
                                py-1
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.16em]
                              "
                              style={{
                                background: ORANGE_SOFT,
                                color: ORANGE,
                              }}
                            >
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{
                                  background: ORANGE,
                                  boxShadow: "0 0 8px rgba(255,90,0,0.65)",
                                }}
                              />
                              Current
                            </span>
                          ) : null}
                        </div>

                        <h3
                          className="
                            mt-2
                            text-[clamp(1.55rem,3.4vw,3rem)]
                            font-medium
                            leading-[0.95]
                            tracking-[-0.055em]
                            transition-transform
                            duration-500
                          "
                          style={{
                            transform: isActive
                              ? "translateX(5px)"
                              : "translateX(0)",
                          }}
                        >
                          {job.role || job.company}
                        </h3>

                        {job.company ? (
                          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span
                              className="text-sm font-medium transition-colors duration-300"
                              style={{
                                color: isActive ? ORANGE : "rgba(0,0,0,0.55)",
                              }}
                            >
                              {job.company}
                            </span>

                            {job.location ? (
                              <>
                                <span
                                  className="text-xs"
                                  style={{
                                    color: "rgba(0,0,0,0.22)",
                                  }}
                                >
                                  /
                                </span>

                                <span
                                  className="text-xs"
                                  style={{
                                    color: "rgba(0,0,0,0.42)",
                                  }}
                                >
                                  {job.location}
                                </span>
                              </>
                            ) : null}
                          </div>
                        ) : null}

                        {/* Mobile date */}

                        {dateRange ? (
                          <div className="mt-4 sm:hidden">
                            <time
                              className="text-[9px] font-medium uppercase tracking-[0.16em]"
                              style={{
                                color: "rgba(0,0,0,0.4)",
                              }}
                            >
                              {dateRange}
                            </time>
                          </div>
                        ) : null}

                        {/* Mobile description */}

                        <AnimatePresence initial={false}>
                          {isActive && job.description ? (
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
                              className="overflow-hidden sm:hidden"
                            >
                              <p
                                className="pt-5 text-sm leading-7"
                                style={{
                                  color: "rgba(0,0,0,0.58)",
                                }}
                              >
                                {job.description}
                              </p>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>

                      {/* Date / Arrow */}

                      <div className="hidden sm:block sm:text-right">
                        {dateRange ? (
                          <time
                            className="
                              text-[9px]
                              font-medium
                              uppercase
                              tracking-[0.16em]
                            "
                            style={{
                              color: "rgba(0,0,0,0.42)",
                            }}
                          >
                            {dateRange}
                          </time>
                        ) : null}

                        {duration ? (
                          <div
                            className="mt-2 text-[9px]"
                            style={{
                              color: "rgba(0,0,0,0.32)",
                            }}
                          >
                            {duration}
                          </div>
                        ) : null}

                        <span
                          className="
                            mt-5
                            inline-flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            border
                            transition-all
                            duration-500
                          "
                          style={{
                            borderColor: isActive ? ORANGE : "rgba(0,0,0,0.14)",
                            color: isActive ? ORANGE : "rgba(0,0,0,0.35)",
                            transform: isActive
                              ? "rotate(-45deg)"
                              : "rotate(0deg)",
                          }}
                          aria-hidden="true"
                        >
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            className="h-3.5 w-3.5"
                          >
                            <path
                              d="M5 15L15 5M7 5H15V13"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Desktop description */}

                  <AnimatePresence initial={false}>
                    {isActive && job.description ? (
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
                        className="hidden overflow-hidden sm:block"
                      >
                        <div className="grid pb-9 sm:grid-cols-[52px_minmax(0,1fr)_150px] sm:gap-7 lg:grid-cols-[52px_minmax(0,1fr)_150px] lg:gap-8">
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
                            className="max-w-2xl"
                          >
                            <div
                              className="mb-4 h-px w-12"
                              style={{
                                background: ORANGE,
                              }}
                            />

                            <p
                              className="text-sm leading-7 md:text-base"
                              style={{
                                color: "rgba(0,0,0,0.58)",
                              }}
                            >
                              {job.description}
                            </p>
                          </motion.div>

                          <div />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>

          {/* =======================================================
              ACTIVE EXPERIENCE DETAIL
          ======================================================== */}

          <motion.aside
            key={safeIndex}
            initial={{
              opacity: 0,
              x: 18,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.55,
              ease,
            }}
            className="hidden lg:block"
          >
            <div className="sticky top-28">
              {/* Small label */}

              <div className="mb-6 flex items-center justify-between">
                <span
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                  "
                  style={{
                    color: "rgba(0,0,0,0.4)",
                  }}
                >
                  Selected role
                </span>

                <span
                  className="text-[9px] font-medium tabular-nums"
                  style={{
                    color: ORANGE,
                  }}
                >
                  {String(safeIndex + 1).padStart(2, "0")} /{" "}
                  {String(valid.length).padStart(2, "0")}
                </span>
              </div>

              {/* Detail card */}

              <div
                className="relative overflow-hidden rounded-[24px] border p-7 xl:p-8"
                style={{
                  borderColor: ORANGE_BORDER,
                  background:
                    "linear-gradient(145deg, rgba(255,90,0,0.055), rgba(255,255,255,0.5))",
                  boxShadow: "0 24px 70px -40px rgba(255,90,0,0.3)",
                }}
              >
                {/* Decorative number */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    -right-3
                    -top-8
                    text-[9rem]
                    font-semibold
                    leading-none
                    tracking-[-0.09em]
                  "
                  style={{
                    color: "rgba(255,90,0,0.055)",
                  }}
                  aria-hidden="true"
                >
                  {String(safeIndex + 1).padStart(2, "0")}
                </span>

                <div className="relative">
                  <div
                    className="mb-8 h-1 w-12 rounded-full"
                    style={{
                      background: ORANGE,
                    }}
                  />

                  <span
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                    "
                    style={{
                      color: ORANGE,
                    }}
                  >
                    {activeExperience.current
                      ? "Currently working"
                      : "Professional experience"}
                  </span>

                  <h3
                    className="
                      mt-4
                      text-2xl
                      font-semibold
                      leading-[1]
                      tracking-[-0.045em]
                      xl:text-3xl
                    "
                  >
                    {activeExperience.role ||
                      activeExperience.company ||
                      "Experience"}
                  </h3>

                  {activeExperience.company ? (
                    <p
                      className="mt-3 text-sm font-medium"
                      style={{
                        color: "rgba(0,0,0,0.55)",
                      }}
                    >
                      {activeExperience.company}
                    </p>
                  ) : null}

                  {activeExperience.location ? (
                    <p
                      className="mt-1 text-xs"
                      style={{
                        color: "rgba(0,0,0,0.38)",
                      }}
                    >
                      {activeExperience.location}
                    </p>
                  ) : null}

                  <div
                    className="my-7 h-px"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(255,90,0,0.28), transparent)",
                    }}
                  />

                  {activeExperience.description ? (
                    <p
                      className="text-sm leading-7"
                      style={{
                        color: "rgba(0,0,0,0.58)",
                      }}
                    >
                      {activeExperience.description}
                    </p>
                  ) : null}

                  {formatDateRange(
                    activeExperience.startDate,
                    activeExperience.endDate,
                    activeExperience.current,
                  ) ? (
                    <div className="mt-8">
                      <span
                        className="
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                        "
                        style={{
                          color: "rgba(0,0,0,0.36)",
                        }}
                      >
                        Timeline
                      </span>

                      <p
                        className="mt-2 text-xs font-medium"
                        style={{
                          color: "rgba(0,0,0,0.62)",
                        }}
                      >
                        {formatDateRange(
                          activeExperience.startDate,
                          activeExperience.endDate,
                          activeExperience.current,
                        )}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Progress */}

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className="text-[8px] font-medium uppercase tracking-[0.18em]"
                    style={{
                      color: "rgba(0,0,0,0.35)",
                    }}
                  >
                    Experience archive
                  </span>

                  <span
                    className="text-[8px] tabular-nums"
                    style={{
                      color: "rgba(0,0,0,0.35)",
                    }}
                  >
                    {Math.round(((safeIndex + 1) / valid.length) * 100)}%
                  </span>
                </div>

                <div
                  className="h-px w-full overflow-hidden"
                  style={{
                    background: "rgba(0,0,0,0.1)",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((safeIndex + 1) / valid.length) * 100}%`,
                    }}
                    transition={{
                      duration: 0.55,
                      ease,
                    }}
                    className="h-full"
                    style={{
                      background: ORANGE,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* =========================================================
            FOOTER SIGNATURE
        ========================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            scaleX: 0,
            transformOrigin: "left",
          }}
          whileInView={{
            opacity: 1,
            scaleX: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.9,
            delay: 0.15,
            ease,
          }}
          className="mt-16 flex origin-left items-center gap-5"
        >
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, rgba(255,90,0,0.35), rgba(0,0,0,0.1), transparent)",
            }}
          />

          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.22em]
            "
            style={{
              color: "rgba(0,0,0,0.36)",
            }}
          >
            Career timeline
          </span>

          <div
            className="h-px w-8"
            style={{
              background: ORANGE,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

export default ExperienceDefault;
