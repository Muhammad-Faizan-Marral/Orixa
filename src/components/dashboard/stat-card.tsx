import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="surface-card p-5">
      <p className="text-caption">{label}</p>
      <p
        className={cn(
          "text-h2 mt-2",
          accent && "text-gradient-ion"
        )}
      >
        {value}
      </p>
      {hint && <p className="text-small mt-1">{hint}</p>}
    </div>
  );
}
