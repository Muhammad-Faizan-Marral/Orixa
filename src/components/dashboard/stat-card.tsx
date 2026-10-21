import { cn } from "@/lib/utils";

const DISPLAY = "font-[family-name:var(--font-display,var(--font-dm))]";

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
    <div
      className={cn(
        "relative flex min-h-[112px] flex-col justify-between gap-4 overflow-hidden rounded-2xl border p-5 transition-colors duration-200",
        accent
          ? "border-violet-500/30 bg-gradient-to-br from-violet-500/[0.1] via-violet-500/[0.04] to-transparent"
          : "border-border bg-background hover:border-foreground/20",
      )}
    >
      <p
        className={cn(
          "text-small flex items-center gap-2",
          accent ? "text-foreground/70" : "text-muted-foreground",
        )}
      >
        {accent && (
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-violet-600 dark:bg-violet-300"
          />
        )}
        {label}
      </p>

      <div>
        <p
          className={cn(
            DISPLAY,
            "text-4xl font-semibold leading-none tracking-[-0.035em] tabular-nums",
            accent
              ? "text-violet-700 dark:text-violet-300"
              : "text-foreground",
          )}
        >
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>

        {hint && (
          <p className="text-small mt-2 text-muted-foreground">{hint}</p>
        )}
      </div>
    </div>
  );
}