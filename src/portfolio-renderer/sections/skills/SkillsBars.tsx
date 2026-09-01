import React from "react";

type SkillsBarsProps = {
  skills: Array<{
    id?: string;
    name: string;
    level?: string;
  }>;
};

const parseLevelToWidth = (level?: string): number | null => {
  if (!level) return null;
  const trimmed = level.trim();
  const percentMatch = trimmed.match(/^(\d{1,3})\s*%?$/);
  if (percentMatch) {
    const value = parseInt(percentMatch[1], 10);
    if (!Number.isNaN(value)) {
      return Math.min(100, Math.max(0, value));
    }
  }
  return null;
};

export const SkillsBars: React.FC<SkillsBarsProps> = ({ skills }) => {
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

      <div className="flex flex-col gap-4">
        {validSkills.map((skill, index) => {
          const parsedWidth = parseLevelToWidth(skill.level);
          const barWidth = parsedWidth !== null ? `${parsedWidth}%` : "40%";

          return (
            <div
              key={skill.id ?? `${skill.name}-${index}`}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-foreground">{skill.name}</span>
                {parsedWidth !== null && (
                  <span className="text-xs text-muted-foreground">
                    {skill.level}
                  </span>
                )}
              </div>
              <div
                className="h-1.5 w-full bg-surface-2 overflow-hidden"
                style={{ borderRadius: "var(--pr-radius)" }}
              >
                <div
                  className="h-full"
                  style={{
                    width: barWidth,
                    background: "var(--pr-accent)",
                    opacity: parsedWidth !== null ? 1 : 0.4,
                    borderRadius: "var(--pr-radius)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};