import React from "react";

export type ExperienceCardsProps = {
  experience: Array<{
    id?: string;
    company: string;
    role: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }>;
};

function formatDateRange(
  startDate?: string,
  endDate?: string,
  current?: boolean
): string | null {
  const end = current ? "Present" : endDate;

  if (startDate && end) return `${startDate} – ${end}`;
  if (startDate) return startDate;
  if (end) return end;
  return null;
}

export const ExperienceCards: React.FC<ExperienceCardsProps> = ({
  experience,
}) => {
  if (!experience || experience.length === 0) return null;

  return (
    <section
      aria-label="Experience"
      className="w-full py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Experience
          </h2>
          <div
            className="mt-3 h-1 w-12 rounded-full"
            style={{ backgroundColor: "var(--pr-accent)" }}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col gap-6 sm:gap-8">
          {experience.map((job, index) => {
            const dateRange = formatDateRange(
              job.startDate,
              job.endDate,
              job.current
            );
            const key = job.id ?? `${job.company}-${job.role}-${index}`;

            return (
              <article
                key={key}
                className="group relative overflow-hidden border border-border bg-surface p-6 transition-shadow duration-200 hover:shadow-md sm:p-8"
                style={{ borderRadius: "var(--pr-radius)" }}
              >
                <div
                  className="absolute inset-y-0 left-0 w-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ backgroundColor: "var(--pr-accent)" }}
                  aria-hidden="true"
                />

                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-snug text-foreground sm:text-xl">
                      {job.role}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-muted-foreground sm:text-base">
                      {job.company}
                      {job.location ? (
                        <span className="text-muted-foreground/70">
                          {" "}
                          · {job.location}
                        </span>
                      ) : null}
                    </p>
                  </div>

                  {dateRange ? (
                    <div className="mt-2 shrink-0 sm:mt-0">
                      <span className="inline-flex items-center whitespace-nowrap text-xs font-medium tracking-wide text-muted-foreground sm:text-sm">
                        {dateRange}
                      </span>
                    </div>
                  ) : null}
                </div>

                {job.description ? (
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {job.description}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};