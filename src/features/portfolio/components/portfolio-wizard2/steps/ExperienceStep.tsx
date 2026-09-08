"use client";

import { Input } from "@/components/UI/Input";
import { Textarea } from "@/components/UI/Textarea";
import { Switch } from "@/components/UI/Switch";
import {
  RepeaterCard,
  AddButton,
} from "@/features/portfolio/components/repeater-card";
import { createId } from "../utils";
import type { Experience, FieldErrors, Setter } from "../types";

type ExperienceStepProps = {
  experience: Experience[];
  setExperience: Setter<Experience[]>;
  fieldErrors: FieldErrors;
  clearFieldError: (key: string) => void;
};

export function ExperienceStep({
  experience,
  setExperience,
  fieldErrors,
  clearFieldError,
}: ExperienceStepProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-h3">Experience</h2>
      </div>

      {experience.map((item, index) => (
        <RepeaterCard
          key={item.id}
          title={`Experience ${index + 1}`}
          onRemove={() => {
            setExperience((c) => c.filter((e) => e.id !== item.id));
            clearFieldError(`exp-company-${item.id}`);
            clearFieldError(`exp-role-${item.id}`);
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Company"
              value={item.company}
              onChange={(e) => {
                setExperience((c) =>
                  c.map((x) =>
                    x.id === item.id ? { ...x, company: e.target.value } : x,
                  ),
                );
                clearFieldError(`exp-company-${item.id}`);
              }}
              error={fieldErrors[`exp-company-${item.id}`]}
            />
            <Input
              label="Role"
              value={item.role}
              onChange={(e) => {
                setExperience((c) =>
                  c.map((x) =>
                    x.id === item.id ? { ...x, role: e.target.value } : x,
                  ),
                );
                clearFieldError(`exp-role-${item.id}`);
              }}
              error={fieldErrors[`exp-role-${item.id}`]}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Start date"
              value={item.startDate ?? ""}
              onChange={(e) =>
                setExperience((c) =>
                  c.map((x) =>
                    x.id === item.id
                      ? { ...x, startDate: e.target.value }
                      : x,
                  ),
                )
              }
              placeholder="01/2023"
            />
            <Input
              label="End date"
              value={item.endDate ?? ""}
              onChange={(e) =>
                setExperience((c) =>
                  c.map((x) =>
                    x.id === item.id ? { ...x, endDate: e.target.value } : x,
                  ),
                )
              }
              placeholder="Present"
              disabled={item.current}
            />
          </div>
          <Switch
            checked={Boolean(item.current)}
            onChange={(v) =>
              setExperience((c) =>
                c.map((x) =>
                  x.id === item.id
                    ? { ...x, current: v, endDate: v ? "" : x.endDate }
                    : x,
                ),
              )
            }
            label="Currently working here"
          />
          <Textarea
            label="Description"
            value={item.description ?? ""}
            onChange={(e) =>
              setExperience((c) =>
                c.map((x) =>
                  x.id === item.id
                    ? { ...x, description: e.target.value }
                    : x,
                ),
              )
            }
            rows={3}
          />
        </RepeaterCard>
      ))}

      <AddButton
        label="Add experience"
        onClick={() =>
          setExperience((c) => [
            ...c,
            {
              id: createId(),
              company: "",
              role: "",
              startDate: "",
              endDate: "",
              current: false,
              description: "",
            },
          ])
        }
      />
    </section>
  );
}
