import Link from "next/link";
import { Badge } from "@/components/UI/Badge";
import type { BadgeVariant } from "@/components/UI/Badge";
import { FormatDate } from "@/components/format-date";
import { cn } from "@/lib/utils";

type Portfolio = {
  id: string;
  title: string;
  slug: string;
  status: string;
  currentVersion: number;
  updatedAt: string;
  publishedAt?: string | null;
};

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  published: "success",
  draft: "outline",
  archived: "warning",
};

/* Falls back to the DM font if the parent page didn't define --font-display */
const DISPLAY = "font-[family-name:var(--font-display,var(--font-dm))]";

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const status = portfolio.status;
  const isPublished = status === "published";

  return (
    <Link
      href={`/dashboard/portfolios/${portfolio.id}`}
      className={cn(
        "group flex min-h-[188px] flex-col justify-between gap-6 rounded-2xl border border-border bg-background p-5",
        "transition-all duration-200 hover:-translate-y-0.5",
        "hover:border-violet-500/50 hover:shadow-[0_16px_32px_-20px_rgba(124,58,237,0.5)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      <div className="space-y-4">
        {/* Status + version */}
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant={STATUS_VARIANT[status] ?? "default"}
            dot
            className="shrink-0 capitalize"
          >
            {status}
          </Badge>

          <span className="rounded-md bg-foreground/[0.06] px-2 py-1 text-xs font-medium tabular-nums text-foreground/80">
            v{portfolio.currentVersion}
          </span>
        </div>

        {/* Title + address */}
        <div className="space-y-2.5">
          <h3
            className={cn(
              DISPLAY,
              "line-clamp-2 text-xl font-semibold leading-snug tracking-[-0.02em] text-foreground",
            )}
          >
            {portfolio.title}
          </h3>

          <p className="flex min-w-0 items-center gap-2 font-mono text-xs text-muted-foreground">
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                isPublished ? "bg-emerald-500" : "bg-foreground/25",
              )}
            />
            <span className="truncate">orixa.ai/…/{portfolio.slug}</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        <p className="text-small text-muted-foreground">
          Updated <FormatDate value={portfolio.updatedAt} variant="date" />
        </p>

        <span className="text-small inline-flex items-center gap-1.5 font-medium text-foreground/80 transition-colors group-hover:text-violet-700 dark:group-hover:text-violet-300">
          Open
          <svg
            viewBox="0 0 24 24"
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}