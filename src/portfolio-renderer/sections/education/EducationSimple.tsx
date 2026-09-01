import { SectionHeading } from "../../shared/SectionHeading";
import type { RendererEducation } from "../../types";

export function EducationSimple({
  education,
}: {
  education: RendererEducation[];
}) {
  if (!education?.length) return null;

  return (
    <div>
      <SectionHeading title="Education" />
      <div className="space-y-5">
        {education.map((ed, i) => (
          <div key={ed.id || i}>
            <p className="font-semibold">{ed.institution}</p>
            <p className="text-sm text-muted-foreground">
              {[ed.degree, ed.field].filter(Boolean).join(" · ")}
            </p>
            <p className="text-xs text-muted-foreground">
              {[ed.startDate, ed.endDate].filter(Boolean).join(" – ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}