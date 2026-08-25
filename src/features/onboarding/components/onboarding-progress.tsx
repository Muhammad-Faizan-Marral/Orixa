import { cn } from "@/lib/utils";

export function OnboardingProgress({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="mb-8">
      <div className="flex gap-1.5">
        {steps.map((label, i) => (
          <div
            key={label}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= currentStep ? "bg-gradient-ion" : "bg-surface-3"
            )}
          />
        ))}
      </div>
      <p className="text-caption mt-3">
        Step {currentStep + 1} of {steps.length} · {steps[currentStep]}
      </p>
    </div>
  );
}
