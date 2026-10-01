"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { trackProjectClick } from "@/features/portfolio/components/use-portfolio-events";
import type { ThemeSectionProps } from "../../../types";

const ORANGE = "#ff5a00";
const INK = "#111111";
const PAPER = "#f4f1eb";
const MUTED = "#6d6963";
const BORDER = "rgba(17, 17, 17, 0.14)";
const ease = [0.22, 1, 0.36, 1] as const;

const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease,
    },
  },
};

const cardReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 34,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease,
    },
  },
};

function getProjectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function ProjectCard({
  project,
  index,
  reduceMotion,
  portfolioId
}: {
  project: {
    id?: string | null;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    url?: string | null;
  };
  index: number;
  reduceMotion: boolean;
  portfolioId?: string | null;
}) {
  const imageUrl = project.imageUrl?.trim();
  const url = project.url?.trim();
 const handleProjectClick = () => {
    if (portfolioId) {
      trackProjectClick(portfolioId, project.title);
    }
  }
  return (
    <motion.article
      variants={cardReveal}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{
        once: true,
        margin: "-80px",
      }}
      className="
        group
        relative
        overflow-hidden
        border
        bg-[#f4f1eb]
        transition-colors
        duration-500
      "
      style={{
        borderColor: BORDER,
      }}
    >
      {/* ================================================================
          TOP PROJECT META
      ================================================================= */}
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          px-5
          py-4
          sm:px-7
        "
        style={{
          borderColor: BORDER,
        }}
      >
        <span
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.22em]
          "
          style={{
            color: MUTED,
          }}
        >
          Project / {getProjectNumber(index)}
        </span>
        <span
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            border
            transition-all
            duration-500
            group-hover:border-[#ff5a00]
            group-hover:bg-[#ff5a00]
          "
          style={{
            borderColor: BORDER,
          }}
          aria-hidden="true"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            className="
              -rotate-45
              transition-transform
              duration-500
              ease-out
              group-hover:rotate-0
            "
          >
            <path
              d="M2 9L9 2M9 2H3.5M9 2V7.5"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      {/* ================================================================
          PROJECT BODY
      ================================================================= */}
      <div
        className="
          relative
          flex
          min-h-[310px]
          flex-col
          justify-between
          p-6
          sm:min-h-[350px]
          sm:p-8
          lg:p-10
        "
      >
        {/* Large background number */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-3
            top-[-1.5rem]
            select-none
            text-[9rem]
            font-bold
            leading-none
            tracking-[-0.1em]
            opacity-[0.035]
            transition-all
            duration-700
            ease-out
            group-hover:translate-x-2
            group-hover:opacity-[0.07]
          "
        >
          {getProjectNumber(index)}
        </span>
        {imageUrl ? (
          <div
            className="relative z-10 mb-8 aspect-[16/9] w-full overflow-hidden border"
            style={{ borderColor: BORDER }}
          >
            <Image
              src={imageUrl}
              alt={`${project.title} preview`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              unoptimized
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        ) : null}
        <div className="relative z-10">
          {/* Small orange marker */}
          <div className="mb-8 flex items-center gap-3">
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                transition-transform
                duration-500
                group-hover:scale-150
              "
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
                color: MUTED,
              }}
            >
              Selected work
            </span>
          </div>
          {/* Title */}
          <h3
            className="
              max-w-[600px]
              text-[clamp(2rem,4vw,3.6rem)]
              font-semibold
              leading-[0.94]
              tracking-[-0.06em]
              transition-transform
              duration-500
              ease-out
              group-hover:translate-x-1
            "
            style={{
              fontFamily:
                "var(--theme-font-display, var(--pr-font-display, sans-serif))",
              color: INK,
            }}
          >
            {url ? (
              <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-inherit no-underline"
                onClick={handleProjectClick}
              >
                {project.title}
              </Link>
            ) : (
              project.title
            )}
          </h3>
          {/* Orange underline */}
          <div
            className="
              mt-7
              h-[2px]
              w-10
              transition-all
              duration-500
              ease-out
              group-hover:w-20
            "
            style={{
              background: ORANGE,
            }}
          />
          {/* Description */}
          {project.description?.trim() ? (
            <p
              className="
                mt-7
                max-w-[560px]
                whitespace-pre-line
                text-sm
                leading-7
                sm:text-[15px]
              "
              style={{
                color: MUTED,
              }}
            >
              {project.description}
            </p>
          ) : null}
        </div>
        {/* ================================================================
            BOTTOM PROJECT SIGNATURE
        ================================================================= */}
        <div
          className="
            relative
            z-10
            mt-12
            flex
            items-end
            justify-between
            gap-5
          "
        >
          <div>
            <span
              className="
                block
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.2em]
              "
              style={{
                color: MUTED,
              }}
            >
              Case study
            </span>
            <span
              className="
                mt-2
                block
                h-px
                w-10
                transition-all
                duration-500
                group-hover:w-16
              "
              style={{
                background: ORANGE,
              }}
            />
          </div>
          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.18em]
              transition-colors
              duration-300
              group-hover:text-[#ff5a00]
            "
            style={{
              color: MUTED,
            }}
          >
            0{index + 1}
          </span>
        </div>
        {/* ================================================================
            HOVER ACCENT
        ================================================================= */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            h-1
            w-0
            transition-all
            duration-700
            ease-out
            group-hover:w-full
          "
          style={{
            background: ORANGE,
          }}
        />
      </div>
    </motion.article>
  );
}

export function ProjectsDefault({ config }: ThemeSectionProps) {
  const reduceMotion = useReducedMotion();
  const portfolioId = config?.portfolioId;          // ← add this
  const projects = (config.projects ?? []).filter((project) =>
    project.title?.trim(),
  );
 
  if (!projects.length) {
    return null;
  }
  return (
    <section
      id="projects"
      aria-label="Selected projects"
      className="
        relative
        w-full
        overflow-hidden
      "
      style={{
        background: PAPER,
        color: INK,
      }}
    >
      {/* ==================================================================
          AMBIENT ORANGE LIGHT
      ================================================================== */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-48
          top-[15%]
          h-[520px]
          w-[520px]
          rounded-full
          opacity-[0.045]
          blur-3xl
        "
        style={{
          background: ORANGE,
        }}
      />
      {/* ==================================================================
          MAIN CONTAINER
      ================================================================== */}
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
        {/* ==================================================================
            HEADER
        ================================================================== */}
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
            grid
            grid-cols-1
            gap-8
            lg:mb-20
            lg:grid-cols-[0.72fr_1.28fr]
            lg:gap-20
            xl:grid-cols-[420px_minmax(0,1fr)]
            xl:gap-28
          "
        >
          {/* Left label */}
          <div className="flex items-start">
            <div className="flex items-center gap-4">
              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.28em]
                "
                style={{
                  color: ORANGE,
                }}
              >
                Portfolio
              </span>
              <span
                aria-hidden="true"
                className="h-px w-12"
                style={{
                  background: ORANGE,
                }}
              />
            </div>
          </div>
          {/* Right intro */}
          <div>
            <div className="flex items-center justify-between gap-6">
              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.24em]
                "
                style={{
                  color: MUTED,
                }}
              >
                Selected work
              </span>
              <span
                className="
                  hidden
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.24em]
                  sm:block
                "
                style={{
                  color: MUTED,
                }}
              >
                03 / Projects
              </span>
            </div>
            <h2
              className="
                mt-6
                max-w-[850px]
                text-[clamp(3rem,6.5vw,7rem)]
                font-bold
                leading-[0.84]
                tracking-[-0.075em]
              "
              style={{
                fontFamily:
                  "var(--theme-font-display, var(--pr-font-display, sans-serif))",
              }}
            >
              Work that
              <br />
              <span style={{ color: ORANGE }}>speaks.</span>
            </h2>
          </div>
        </motion.div>
        {/* ==================================================================
            PROJECT COUNT STRIP
        ================================================================== */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{
            once: true,
            margin: "-60px",
          }}
          variants={reveal}
          className="
            mb-10
            flex
            items-center
            justify-between
            border-y
            py-4
          "
          style={{
            borderColor: BORDER,
          }}
        >
          <div className="flex items-center gap-4">
            <span
              className="
                text-[clamp(2rem,4vw,3rem)]
                font-medium
                leading-none
                tracking-[-0.06em]
              "
            >
              {String(projects.length).padStart(2, "0")}
            </span>
            <span
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.2em]
              "
              style={{
                color: MUTED,
              }}
            >
              Projects
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="
                hidden
                text-[9px]
                font-medium
                uppercase
                tracking-[0.2em]
                sm:block
              "
              style={{
                color: MUTED,
              }}
            >
              Explore the work
            </span>
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: ORANGE,
              }}
            />
          </div>
        </motion.div>
        {/* ==================================================================
            PROJECT GRID
        ================================================================== */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
            lg:gap-5
          "
        >
         {projects.map((project, index) => (
    <ProjectCard
      key={project.id ?? `${project.title}-${index}`}
      project={project}
      index={index}
      reduceMotion={Boolean(reduceMotion)}
      portfolioId={portfolioId}                   
    />
  ))}
        </div>
        {/* ==================================================================
            BOTTOM SIGNATURE
        ================================================================== */}
        <motion.div
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{
            once: true,
            margin: "-60px",
          }}
          variants={reveal}
          className="
            mt-20
            flex
            items-center
            gap-5
          "
        >
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, rgba(17,17,17,0.14), transparent)",
            }}
          />
          <span
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.22em]
            "
            style={{
              color: MUTED,
            }}
          >
            Selected work / 03
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

export default ProjectsDefault;
