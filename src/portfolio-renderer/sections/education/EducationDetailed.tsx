// src/portfolio-renderer/sections/education/EducationDetailed.tsx
import React from "react";

export type EducationDetailedProps = {
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

export const EducationDetailed: React.FC<EducationDetailedProps> = ({
  education,
}) => {
  if (!education || education.length === 0) return null;

  return (
    <section aria-label="Education" className="w-full py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
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

        <div className="flex flex-col gap-6 sm:gap-8">
          {education.map((school, index) => {
            const degreeField = formatDegreeField(school.degree, school.field);
            const dateRange = formatDateRange(school.startDate, school.endDate);
            const key = school.id ?? `${school.institution}-${index}`;

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
                      {school.institution}
                    </h3>
                    {degreeField ? (
                      <p className="mt-1 text-sm font-medium text-muted-foreground sm:text-base">
                        {degreeField}
                      </p>
                    ) : null}
                  </div>

                  {dateRange ? (
                    <div className="mt-2 shrink-0 sm:mt-0">
                      <span className="inline-flex items-center whitespace-nowrap text-xs font-medium tracking-wide text-muted-foreground sm:text-sm">
                        {dateRange}
                      </span>
                    </div>
                  ) : null}
                </div>

                {school.description ? (
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {school.description}
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