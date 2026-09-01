import React from "react";

type SkillsListProps = {
  skills: Array<{
    id?: string;
    name: string;
    level?: string;
  }>;
};

export const SkillsList: React.FC<SkillsListProps> = ({ skills }) => {
  if (!skills?.length) return null;

  const validSkills = skills.filter(
    (skill) => skill.name && skill.name.trim().length > 0
  );

  if (!validSkills.length) return null;

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
        {validSkills.map((skill, index) => (
          <div
            key={skill.id ?? `${skill.name}-${index}`}
            className="flex items-center justify-between gap-4 border-b border-border py-2.5"
          >
            <span className="text-sm text-foreground">{skill.name}</span>
            {skill.level && (
              <span className="text-xs text-muted-foreground shrink-0">
                {skill.level}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};