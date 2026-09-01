import { SectionHeading } from "../../shared/SectionHeading";
import type { RendererSkill } from "../../types";

export function SkillsGrid({ skills }: { skills: RendererSkill[] }) {
  if (!skills?.length) return null;

  return (
    <div>
      <SectionHeading title="Skills" />
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <span
            key={s.id || `${s.name}-${i}`}
            className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm"
          >
            {s.name}
            {s.level ? (
              <span className="ml-1 text-muted-foreground">· {s.level}</span>
            ) : null}
          </span>
        ))}
      </div>
    </div>
  );
}