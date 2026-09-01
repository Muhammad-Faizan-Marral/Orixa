import React from "react";

type Project = {
  id?: string;
  title: string;
  description?: string;
  url?: string;
  technologies?: string[];
  imageUrl?: string;
};

type ProjectsListProps = {
  projects?: Project[];
  design?: {
    cardStyle?: "flat" | "bordered" | "elevated";
  };
};

const getRowStyleClasses = (
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

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  design,
}) => {
  if (!projects?.length) return null;

  const validProjects = projects.filter(
    (project) => project.title && project.title.trim().length > 0
  );

  if (!validProjects.length) return null;

  const rowClasses = getRowStyleClasses(design?.cardStyle);

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

      <div className="flex flex-col gap-4">
        {validProjects.map((project, index) => {
          const key = project.id ?? `${project.title}-${index}`;
          const hasTech = Boolean(project.technologies?.length);

          return (
            <div
              key={key}
              className={`flex flex-col sm:flex-row gap-5 p-5 ${rowClasses}`}
              style={{ borderRadius: "var(--pr-radius)" }}
            >
              {project.imageUrl && (
                <div
                  className="w-full sm:w-32 h-40 sm:h-32 shrink-0 overflow-hidden bg-surface-3"
                  style={{ borderRadius: "var(--pr-radius)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                <h3 className="text-base font-medium text-foreground">
                  {project.title}
                </h3>

                {project.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-1">
                  {hasTech && (
                    <div className="flex flex-wrap gap-2">
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
                      className="text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground ml-auto"
                    >
                      View project
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};