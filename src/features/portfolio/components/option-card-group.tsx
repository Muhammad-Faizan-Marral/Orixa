"use client";

import { cn } from "@/lib/utils";

export interface OptionCardItem {
  value: string;
  label: string;
  description?: string;
  preview?: React.ReactNode;
}

export function OptionCardGroup({
  options,
  value,
  onChange,
  columns = 3,
}: {
  options: OptionCardItem[];
  value: string;
  onChange: (value: string) => void;
  columns?: 2 | 3 | 4;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-2 sm:grid-cols-3",
        columns === 4 && "grid-cols-2 sm:grid-cols-4"
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "surface-panel flex flex-col items-start gap-2 p-3 text-left transition-colors",
              active ? "border-primary/40 bg-gradient-ion-soft" : "hover:border-border-strong"
            )}
          >
            {option.preview && (
              <div className="flex h-10 w-full items-center">{option.preview}</div>
            )}
            <div>
              <p className="text-label">{option.label}</p>
              {option.description && <p className="text-small">{option.description}</p>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
