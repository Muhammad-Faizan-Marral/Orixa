// src/portfolio-renderer/sections/education/EducationTimeline.tsx
import React from "react";

export type EducationTimelineProps = {
  education: Array<{
    id?: string;
    institution: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
};

function formatDateRange(startDate?: string, endDate?: string): string | null {
  if (startDate && endDate) return `${startDate} – ${endDate}`;
  if (startDate) return startDate;
  if (endDate) return endDate;
  return null;
}

function formatDegreeField(degree?: string, field?: string): string | null {
  if (degree && field) return `${degree} · ${field}`;
  if (degree) return degree;
  if (field) return field;
  return null;
}

export const EducationTimeline: React.FC<EducationTimelineProps> = ({
  education,
}) => {
  if (!education || education.length === 0) return null;

  return (
    <section aria-label="Education" className="w-full py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Education
          </h2>
          <div
            className="mt-3 h-1 w-12 rounded-full"
            style={{ backgroundColor: "var(--pr-accent)" }}
            aria-hidden="true"
          />
        </div>

        <ol className="relative flex flex-col gap-10 pl-8 sm:gap-12 sm:pl-10">
          <div
            className="absolute bottom-0 left-[7px] top-1.5 w-px bg-border sm:left-[9px]"
            aria-hidden="true"
          />

          {education.map((school, index) => {
            const degreeField = formatDegreeField(school.degree, school.field);
            const dateRange = formatDateRange(school.startDate, school.endDate);
            const key = school.id ?? `${school.institution}-${index}`;

            return (
              <li key={key} className="relative">
                <span
                  className="absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-background sm:-left-10"
                  style={{ backgroundColor: "var(--pr-accent)" }}
                  aria-hidden="true"
                />

                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-snug text-foreground sm:text-xl">
                      {school.institution}
                    </h3>
                    {degreeField ? (
                      <p className="mt-1 text-sm font-medium text-muted-foreground sm:text-base">
                        {degreeField}
                      </p>
                    ) : null}
                  </div>

                  {dateRange ? (
                    <span className="mt-1 shrink-0 whitespace-nowrap text-xs font-medium tracking-wide text-muted-foreground sm:mt-0 sm:text-sm">
                      {dateRange}
                    </span>
                  ) : null}
                </div>

                {school.description ? (
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {school.description}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};