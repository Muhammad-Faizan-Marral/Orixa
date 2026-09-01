import { SectionHeading } from "../../shared/SectionHeading";
import type { RendererExperience } from "../../types";

export function ExperienceTimeline({
  experience,
}: {
  experience: RendererExperience[];
}) {
  if (!experience?.length) return null;

  return (
    <div>
      <SectionHeading title="Experience" />
      <ol className="relative space-y-8 border-l border-border pl-6">
        {experience.map((e, i) => (
          <li key={e.id || i} className="relative">
            <span
              className="absolute -left-[1.55rem] top-1.5 h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--pr-accent, #6c5cff)" }}
            />
            <p className="font-semibold">
              {e.role} · {e.company}
            </p>
            <p className="text-xs text-muted-foreground">
              {[e.startDate, e.current ? "Present" : e.endDate]
                .filter(Boolean)
                .join(" – ")}
              {e.location ? ` · ${e.location}` : ""}
            </p>
            {e.description && (
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">
                {e.description}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}