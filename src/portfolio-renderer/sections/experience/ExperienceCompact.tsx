import React from "react";

export type ExperienceCompactProps = {
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

export const ExperienceCompact: React.FC<ExperienceCompactProps> = ({
  experience,
}) => {
  if (!experience || experience.length === 0) return null;

  return (
    <section
      aria-label="Experience"
      className="w-full py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Experience
          </h2>
          <div
            className="mt-3 h-1 w-12 rounded-full"
            style={{ backgroundColor: "var(--pr-accent)" }}
            aria-hidden="true"
          />
        </div>

        <div className="flex flex-col divide-y divide-border border-t border-border">
          {experience.map((job, index) => {
            const dateRange = formatDateRange(
              job.startDate,
              job.endDate,
              job.current
            );
            const key = job.id ?? `${job.company}-${job.role}-${index}`;

            return (
              <div
                key={key}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:py-3.5"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                  <div className="flex min-w-0 items-baseline gap-2">
                    <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                      {job.role}
                    </h3>
                    <span
                      className="shrink-0 text-xs"
                      style={{ color: "var(--pr-accent)" }}
                      aria-hidden="true"
                    >
                      &middot;
                    </span>
                    <p className="truncate text-sm text-muted-foreground">
                      {job.company}
                      {job.location ? (
                        <span className="text-muted-foreground/70">
                          {" "}
                          · {job.location}
                        </span>
                      ) : null}
                    </p>
                  </div>

                  {job.description ? (
                    <p className="line-clamp-2 text-xs leading-snug text-muted-foreground/80 sm:hidden">
                      {job.description}
                    </p>
                  ) : null}
                </div>

                {dateRange ? (
                  <span className="shrink-0 whitespace-nowrap text-xs font-medium tracking-wide text-muted-foreground sm:text-sm">
                    {dateRange}
                  </span>
                ) : null}

                {job.description ? (
                  <p className="line-clamp-2 hidden w-full basis-full text-xs leading-snug text-muted-foreground/80 sm:block sm:whitespace-pre-line">
                    {job.description}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};