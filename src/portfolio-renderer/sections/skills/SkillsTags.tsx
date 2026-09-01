import React from "react";

type SkillsTagsProps = {
  skills: Array<{
    id?: string;
    name: string;
    level?: string;
  }>;
};

export const SkillsTags: React.FC<SkillsTagsProps> = ({ skills }) => {
  if (!skills?.length) return null;

  const validSkills = skills.filter(
    (skill) => skill.name && skill.name.trim().length > 0
  );

  if (!validSkills.length) return null;

  const opacityForIndex = (index: number): number => {
    const pattern = [1, 0.75, 0.6, 0.85, 0.7];
    return pattern[index % pattern.length];
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 mb-8">
        <h2 className="text-sm font-medium tracking-[0.18em] uppercase text-muted-foreground">
          Skills
        </h2>
        <div
          className="h-[3px] w-10 rounded-full"
          style={{
            background: "var(--pr-accent)",
            borderRadius: "var(--pr-radius)",
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2.5">
        {validSkills.map((skill, index) => (
          <span
            key={skill.id ?? `${skill.name}-${index}`}
            className="inline-flex items-center border border-border bg-surface-3 px-3 py-1.5 text-sm text-foreground"
            style={{
              borderRadius: "var(--pr-radius)",
              opacity: opacityForIndex(index),
            }}
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
};