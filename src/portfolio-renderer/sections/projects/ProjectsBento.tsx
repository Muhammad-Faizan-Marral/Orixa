"use client";

import { motion } from "framer-motion";
import type {
  RendererDesignPreferences,
  RendererProject,
} from "../../types";
import { cardClass } from "../../theme";

type Props = {
  projects: RendererProject[];
  design?: RendererDesignPreferences;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Different sizes for bento feel */
function getSpan(index: number) {
  const patterns = [
    "sm:col-span-2 sm:row-span-2", // big
    "sm:col-span-1 sm:row-span-1",
    "sm:col-span-1 sm:row-span-1",
    "sm:col-span-1 sm:row-span-2", // tall
    "sm:col-span-2 sm:row-span-1", // wide
    "sm:col-span-1 sm:row-span-1",
  ];
  return patterns[index % patterns.length];
}

export function ProjectsBento({ projects, design }: Props) {
  const valid = projects.filter((p) => p.title?.trim());
  if (!valid.length) return null;

  const card = cardClass(design?.cardStyle);

  return (
    <div className="w-full">
      <div className="mb-10 flex flex-col gap-3 sm:mb-12">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.3em]"
          style={{ color: "var(--pr-accent)" }}
        >
          Work
        </p>
        <h2
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ letterSpacing: "var(--pr-heading-tracking)" }}
        >
          Projects
        </h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid auto-rows-[180px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:auto-rows-[200px]"
      >
        {valid.map((project, i) => {
          const isBig = i % 6 === 0;
          const isTall = i % 6 === 3;

          return (
            <motion.a
              key={project.id ?? `${project.title}-${i}`}
              href={project.url || undefined}
              target={project.url ? "_blank" : undefined}
              rel={project.url ? "noopener noreferrer" : undefined}
              variants={item}
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.25 }}
              className={`group relative flex flex-col overflow-hidden ${card} ${getSpan(i)}`}
              style={{ borderRadius: "var(--pr-radius)" }}
            >
              {/* Background image / fallback */}
              <div className="absolute inset-0">
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.imageUrl}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{
                      background: `linear-gradient(145deg, var(--pr-accent-soft), color-mix(in srgb, var(--pr-accent) 8%, transparent))`,
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative mt-auto flex flex-col gap-2 p-5">
                <h3
                  className={`font-semibold tracking-tight text-white ${
                    isBig || isTall ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                  }`}
                >
                  {project.title}
                </h3>

                {project.description && (isBig || isTall) && (
                  <p className="line-clamp-2 text-sm text-white/70">
                    {project.description}
                  </p>
                )}

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technologies.slice(0, isBig ? 4 : 2).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] text-white/80 backdrop-blur-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.a>
          );
        })}
      </motion.div>
    </div>
  );
}