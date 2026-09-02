"use client";

import { Input } from "@/components/UI/Input";
import {
  RepeaterCard,
  AddButton,
} from "@/features/portfolio/components/repeater-card";
import { createId } from "../utils";
import type { Education, FieldErrors, Setter } from "../types";

type EducationStepProps = {
  education: Education[];
  setEducation: Setter<Education[]>;
  fieldErrors: FieldErrors;
  clearFieldError: (key: string) => void;
};

export function EducationStep({
  education,
  setEducation,
  fieldErrors,
  clearFieldError,
}: EducationStepProps) {
  return (
    <section className="space-y-5">
      <h2 className="text-h3">Education</h2>

      {education.map((item, index) => (
        <RepeaterCard
          key={item.id}
          title={`Education ${index + 1}`}
          onRemove={() => {
            setEducation((c) => c.filter((e) => e.id !== item.id));
            clearFieldError(`edu-inst-${item.id}`);
          }}
        >
          <Input
            label="Institution"
            value={item.institution}
            onChange={(e) => {
              setEducation((c) =>
                c.map((x) =>
                  x.id === item.id
                    ? { ...x, institution: e.target.value }
                    : x,
                ),
              );
              clearFieldError(`edu-inst-${item.id}`);
            }}
            error={fieldErrors[`edu-inst-${item.id}`]}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Degree"
              value={item.degree ?? ""}
              onChange={(e) =>
                setEducation((c) =>
                  c.map((x) =>
                    x.id === item.id ? { ...x, degree: e.target.value } : x,
                  ),
                )
              }
            />
            <Input
              label="Field"
              value={item.field ?? ""}
              onChange={(e) =>
                setEducation((c) =>
                  c.map((x) =>
                    x.id === item.id ? { ...x, field: e.target.value } : x,
                  ),
                )
              }
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Start date"
              value={item.startDate ?? ""}
              onChange={(e) =>
                setEducation((c) =>
                  c.map((x) =>
                    x.id === item.id
                      ? { ...x, startDate: e.target.value }
                      : x,
                  ),
                )
              }
            />
            <Input
              label="End date"
              value={item.endDate ?? ""}
              onChange={(e) =>
                setEducation((c) =>
                  c.map((x) =>
                    x.id === item.id ? { ...x, endDate: e.target.value } : x,
                  ),
                )
              }
            />
          </div>
        </RepeaterCard>
      ))}

      <AddButton
        label="Add education"
        onClick={() =>
          setEducation((c) => [
            ...c,
            {
              id: createId(),
              institution: "",
              degree: "",
              field: "",
              startDate: "",
              endDate: "",
            },
          ])
        }
      />
    </section>
  );
}
