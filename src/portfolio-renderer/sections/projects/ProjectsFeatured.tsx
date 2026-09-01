import React from "react";

type Project = {
  id?: string;
  title: string;
  description?: string;
  url?: string;
  technologies?: string[];
  imageUrl?: string;
};

type ProjectsFeaturedProps = {
  projects?: Project[];
  design?: {
    cardStyle?: "flat" | "bordered" | "elevated";
  };
};

const getCardStyleClasses = (
  cardStyle: "flat" | "bordered" | "elevated" = "bordered",
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

export const ProjectsFeatured: React.FC<ProjectsFeaturedProps> = ({
  projects,
  design,
}) => {
  if (!projects?.length) return null;

  const validProjects = projects.filter(
    (project) => project.title && project.title.trim().length > 0,
  );

  if (!validProjects.length) return null;

  const cardClasses = getCardStyleClasses(design?.cardStyle);
  const [featured, ...rest] = validProjects;
  const featuredKey = featured.id ?? `${featured.title}-0`;
  const featuredHasTech = Boolean(featured.technologies?.length);

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

      <div
        className={`flex flex-col md:flex-row overflow-hidden mb-8 ${cardClasses}`}
        style={{ borderRadius: "var(--pr-radius)" }}
      >
        {featured.imageUrl && (
          <div className="w-full md:w-1/2 aspect-[16/10] md:aspect-auto overflow-hidden bg-surface-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.imageUrl}
              alt={featured.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col gap-4 p-8 flex-1 justify-center">
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Featured
          </span>

          <h3 className="text-xl sm:text-2xl font-medium text-foreground">
            {featured.title}
          </h3>

          {featured.description && (
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-4">
              {featured.description}
            </p>
          )}

          {featuredHasTech && (
            <div className="flex flex-wrap gap-2">
              {featured.technologies!.map((tech, techIndex) => (
                <span
                  key={`${featuredKey}-tech-${techIndex}`}
                  className="text-xs text-muted-foreground bg-surface-3 px-2.5 py-1"
                  style={{ borderRadius: "var(--pr-radius)" }}
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
              className="text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground w-fit mt-1"
            >
              View project
            </a>
          )}
        </div>
      </div>

      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((project, index) => {
            const key = project.id ?? `${project.title}-${index + 1}`;
            const hasTech = Boolean(project.technologies?.length);

            return (
              <div
                key={key}
                className={`flex flex-col overflow-hidden ${cardClasses}`}
                style={{ borderRadius: "var(--pr-radius)" }}
              >
                {project.imageUrl && (
                  <div className="w-full aspect-[16/9] overflow-hidden bg-surface-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-3 p-6 flex-1">
                  <h3 className="text-base font-medium text-foreground">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
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
                      className="text-sm text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground mt-auto pt-2 w-fit"
                    >
                      View project
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
