"use client";

import { Input } from "@/components/UI/Input";
import {
  RepeaterCard,
  AddButton,
} from "@/features/portfolio/components/repeater-card";
import { createId } from "../utils";
import type { Skill, FieldErrors, Setter } from "../types";

type SkillsStepProps = {
  skills: Skill[];
  setSkills: Setter<Skill[]>;
  fieldErrors: FieldErrors;
  clearFieldError: (key: string) => void;
};

export function SkillsStep({
  skills,
  setSkills,
  fieldErrors,
  clearFieldError,
}: SkillsStepProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-h3">Skills</h2>
        <p className="text-small text-muted-foreground mt-1">
          Add real skill names (min 2 characters). Invalid short text will
          be rejected on submit.
        </p>
      </div>

      {skills.map((skill, index) => (
        <RepeaterCard
          key={skill.id}
          title={`Skill ${index + 1}`}
          onRemove={() => {
            setSkills((c) => c.filter((s) => s.id !== skill.id));
            clearFieldError(`skill-${skill.id}`);
          }}
        >
          <Input
            label="Skill name"
            value={skill.name}
            onChange={(e) => {
              setSkills((c) =>
                c.map((s) =>
                  s.id === skill.id ? { ...s, name: e.target.value } : s,
                ),
              );
              clearFieldError(`skill-${skill.id}`);
            }}
            placeholder="React"
            error={fieldErrors[`skill-${skill.id}`]}
          />
          <Input
            label="Level (optional)"
            value={skill.level ?? ""}
            onChange={(e) =>
              setSkills((c) =>
                c.map((s) =>
                  s.id === skill.id ? { ...s, level: e.target.value } : s,
                ),
              )
            }
            placeholder="Advanced"
          />
        </RepeaterCard>
      ))}

      <AddButton
        label="Add skill"
        onClick={() =>
          setSkills((c) => [...c, { id: createId(), name: "", level: "" }])
        }
      />
    </section>
  );
}
