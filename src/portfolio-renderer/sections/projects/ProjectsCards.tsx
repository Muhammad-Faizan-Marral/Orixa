import { SectionHeading } from "../../shared/SectionHeading";
import { cardClass } from "../../theme";
import type { RendererDesignPreferences, RendererProject } from "../../types";

export function ProjectsCards({
  projects,
  design,
}: {
  projects: RendererProject[];
  design?: RendererDesignPreferences;
}) {
  if (!projects?.length) return null;

  return (
    <div>
      <SectionHeading title="Projects" />
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <article
            key={p.id || `${p.title}-${i}`}
            className={`overflow-hidden ${cardClass(design?.cardStyle)}`}
            style={{ borderRadius: "var(--pr-radius, 12px)" }}
          >
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.title}
                className="h-40 w-full object-cover"
              />
            )}
            <div className="space-y-2 p-5">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              {p.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {p.description}
                </p>
              )}
              {p.technologies && p.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-surface-3 px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block pt-1 text-sm font-medium"
                  style={{ color: "var(--pr-accent, #6c5cff)" }}
                >
                  View project →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}