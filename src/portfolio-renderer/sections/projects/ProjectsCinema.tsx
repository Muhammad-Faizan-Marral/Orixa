"use client";

import { motion } from "framer-motion";
import type { RendererDesignPreferences, RendererProject } from "../../types";

type Props = {
  projects: RendererProject[];
  design?: RendererDesignPreferences;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ProjectsCinema({ projects }: Props) {
  const valid = projects.filter((p) => p.title?.trim());
  if (!valid.length) return null;

  return (
    <div className="w-full">
      <div className="mb-12 flex flex-col gap-3">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.35em]"
          style={{ color: "var(--pr-accent)" }}
        >
          Case Studies
        </p>
        <h2
          className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          style={{ letterSpacing: "var(--pr-heading-tracking)" }}
        >
          Projects
        </h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col"
      >
        {valid.map((project, i) => (
          <motion.article
            key={project.id ?? `${project.title}-${i}`}
            variants={item}
            className="group relative border-t border-border last:border-b"
          >
            <a
              href={project.url || undefined}
              target={project.url ? "_blank" : undefined}
              rel={project.url ? "noopener noreferrer" : undefined}
              className="grid items-center gap-6 py-8 sm:grid-cols-12 sm:gap-8 sm:py-10"
            >
              {/* Index */}
              <div className="sm:col-span-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Title + desc */}
              <div className="sm:col-span-5 space-y-2">
                <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-[var(--pr-accent)] sm:text-2xl">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
              </div>

              {/* Tech */}
              <div className="hidden sm:col-span-3 sm:block">
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Image preview (appears on hover) */}
              <div className="relative sm:col-span-3">
                <div
                  className="overflow-hidden"
                  style={{ borderRadius: "var(--pr-radius)" }}
                >
                  {project.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.imageUrl}
                      alt=""
                      className="aspect-[16/10] w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 sm:aspect-[4/3]"
                    />
                  ) : (
                    <div
                      className="flex aspect-[16/10] w-full items-center justify-center text-2xl font-semibold text-muted-foreground/20 sm:aspect-[4/3]"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--pr-accent-soft), transparent)",
                      }}
                    >
                      {project.title.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div
                  className="absolute -right-1 top-1/2 hidden -translate-y-1/2 text-lg opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 sm:block"
                  style={{ color: "var(--pr-accent)" }}
                >
                  →
                </div>
              </div>
            </a>

            {/* Hover accent line */}
            <div
              className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
              style={{ backgroundColor: "var(--pr-accent)" }}
            />
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}
