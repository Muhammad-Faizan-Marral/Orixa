import React from "react";

type Project = {
  id?: string;
  title: string;
  description?: string;
  url?: string;
  technologies?: string[];
  imageUrl?: string;
};

type ProjectsMasonryProps = {
  projects?: Project[];
  design?: {
    cardStyle?: "flat" | "bordered" | "elevated";
  };
};

const getCardStyleClasses = (
  cardStyle: "flat" | "bordered" | "elevated" = "bordered"
): string => {
  switch (cardStyle) {
    case "flat":
      return "bg-surface-2";
    case "elevated":
      return "bg-surface-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]";
    case "bordered":
    default:
      return "bg-surface-2 border border-border";
  }
};

export const ProjectsMasonry: React.FC<ProjectsMasonryProps> = ({
  projects,
  design,
}) => {
  if (!projects?.length) return null;

  const validProjects = projects.filter(
    (project) => project.title && project.title.trim().length > 0
  );

  if (!validProjects.length) return null;

  const cardClasses = getCardStyleClasses(design?.cardStyle);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 mb-8">
        <h2 className="text-sm font-medium tracking-[0.18em] uppercase text-muted-foreground">
          Projects
        </h2>
        <div
          className="h-[3px] w-10 rounded-full"
          style={{
            background: "var(--pr-accent)",
            borderRadius: "var(--pr-radius)",
          }}
        />
      </div>

      <div className="[column-fill:_balance] sm:columns-2 lg:columns-3 gap-6">
        {validProjects.map((project, index) => {
          const key = project.id ?? `${project.title}-${index}`;
          const hasTech = Boolean(project.technologies?.length);

          return (
            <div
              key={key}
              className={`flex flex-col overflow-hidden mb-6 break-inside-avoid ${cardClasses}`}
              style={{ borderRadius: "var(--pr-radius)" }}
            >
              {project.imageUrl && (
                <div className="w-full overflow-hidden bg-surface-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              <div className="flex flex-col gap-3 p-6">
                <h3 className="text-base font-medium text-foreground">
                  {project.title}
                </h3>

                {project.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                )}

                {hasTech && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.technologies!.map((tech, techIndex) => (
                      <span
                        key={`${key}-tech-${techIndex}`}
                        className="text-xs text-muted-foreground bg-surface-3 px-2.5 py-1"
                        style={{ borderRadius: "var(--pr-radius)" }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground w-fit"
                  >
                    View project
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};