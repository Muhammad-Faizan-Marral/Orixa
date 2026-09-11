"use client";

import { motion,Variants } from "framer-motion";
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
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item:Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ProjectsShowcase({ projects, design }: Props) {
  const valid = projects.filter((p) => p.title?.trim());
  if (!valid.length) return null;

  const [featured, ...rest] = valid;
  const card = cardClass(design?.cardStyle);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-3 sm:mb-14">
        <p
          className="text-[11px] font-medium uppercase tracking-[0.3em]"
          style={{ color: "var(--pr-accent)" }}
        >
          Selected Work
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
        viewport={{ once: true, margin: "-80px" }}
        className="space-y-8"
      >
        {/* Featured Project */}
        <motion.article
          variants={item}
          className={`group relative overflow-hidden ${card}`}
          style={{ borderRadius: "var(--pr-radius)" }}
        >
          <div className="grid lg:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-[16/11] overflow-hidden bg-surface-2 lg:aspect-auto lg:min-h-[340px]">
              {featured.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featured.imageUrl}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <div
                  className="flex h-full min-h-[240px] items-center justify-center text-5xl font-bold text-muted-foreground/30"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--pr-accent-soft), transparent)",
                  }}
                >
                  {featured.title.charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 lg:opacity-40" />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
              <div className="space-y-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  Featured
                </span>
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {featured.title}
                </h3>
              </div>

              {featured.description && (
                <p
                  className="text-sm text-muted-foreground sm:text-base"
                  style={{ lineHeight: "var(--pr-body-leading)" }}
                >
                  {featured.description}
                </p>
              )}

              {featured.technologies && featured.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {featured.technologies.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {featured.url && (
                <a
                  href={featured.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex w-fit items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ color: "var(--pr-accent)" }}
                >
                  View Project
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              )}
            </div>
          </div>
        </motion.article>

        {/* Rest of projects */}
        {rest.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((project, i) => (
              <motion.article
                key={project.id ?? `${project.title}-${i}`}
                variants={item}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className={`group flex flex-col overflow-hidden ${card}`}
                style={{ borderRadius: "var(--pr-radius)" }}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
                  {project.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="flex h-full items-center justify-center text-3xl font-semibold text-muted-foreground/25"
                      style={{
                        background:
                          "linear-gradient(145deg, var(--pr-accent-soft), transparent)",
                      }}
                    >
                      {project.title.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  )}

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                      {project.technologies.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[11px] text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium opacity-0 transition-all group-hover:opacity-100"
                      style={{ color: "var(--pr-accent)" }}
                    >
                      View <span aria-hidden>→</span>
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}