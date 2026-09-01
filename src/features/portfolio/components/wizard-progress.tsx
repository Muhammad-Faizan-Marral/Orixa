"use client";

import { cn } from "@/lib/utils";
import {
  CONTENT_STEPS,
  type WizardStepId,
} from "@/features/portfolio/wizard-steps";

type WizardProgressProps = {
  currentStepId: WizardStepId;
};

export function WizardProgress({ currentStepId }: WizardProgressProps) {
  const currentIndex = CONTENT_STEPS.findIndex((s) => s.id === currentStepId);
  if (currentIndex < 0) return null;

  const percent = Math.round(((currentIndex + 1) / CONTENT_STEPS.length) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-small text-muted-foreground">
          Step {currentIndex + 1} of {CONTENT_STEPS.length}
          <span className="ml-2 font-medium text-foreground">
            · {CONTENT_STEPS[currentIndex]?.label}
          </span>
        </p>
        <p className="text-small text-muted-foreground">{percent}%</p>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
        <div
          className="h-full rounded-full bg-gradient-ion transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="no-scrollbar flex gap-1 overflow-x-auto pb-1">
        {CONTENT_STEPS.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <span
              key={step.id}
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                active && "bg-primary/15 text-primary",
                done && "text-muted-foreground",
                !active && !done && "text-muted-foreground/50",
              )}
            >
              {step.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
