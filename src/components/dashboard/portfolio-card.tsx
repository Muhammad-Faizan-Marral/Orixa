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

const STATUS_GLOW: Record<string, string> = {
  published: "from-success/20 via-transparent to-transparent",
  draft: "from-primary/15 via-transparent to-transparent",
  archived: "from-warning/15 via-transparent to-transparent",
};

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const status = portfolio.status;
  const isPublished = status === "published";

  return (
    <Link
      href={`/dashboard/portfolios/${portfolio.id}`}
      className={cn(
        "surface-card group relative flex flex-col overflow-hidden p-0",
        "transition-all duration-300",
        "hover:border-primary/35 hover:shadow-[0_0_0_1px_rgba(108,92,255,0.12),0_12px_40px_-12px_rgba(0,0,0,0.35)]",
        "hover:-translate-y-0.5",
      )}
    >
      {/* Top accent strip */}
      <div
        className={cn(
          "h-1 w-full bg-gradient-to-r",
          isPublished
            ? "from-primary via-accent to-primary/40"
            : "from-border-strong via-border to-transparent",
        )}
      />

      <div className="relative flex flex-1 flex-col justify-between p-5">
        {/* Soft glow */}
        <div
          className={cn(
            "pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-100",
            STATUS_GLOW[status] ?? STATUS_GLOW.draft,
          )}
        />

        <div className="relative space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-h3 !text-base line-clamp-2 leading-snug">
              {portfolio.title}
            </h3>
            <Badge
              variant={STATUS_VARIANT[status] ?? "default"}
              dot
              className="shrink-0 capitalize"
            >
              {status}
            </Badge>
          </div>

          <p className="text-small flex items-center gap-1.5 text-primary/90">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-[10px] font-semibold text-primary">
              /
            </span>
            <span className="truncate">orixa.ai/…/{portfolio.slug}</span>
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[11px] text-muted-foreground">
              v{portfolio.currentVersion}
            </span>
            {isPublished && portfolio.publishedAt && (
              <span className="rounded-full border border-success/20 bg-success/5 px-2.5 py-0.5 text-[11px] text-success">
                Live
              </span>
            )}
          </div>
        </div>

        <div className="relative mt-6 flex items-center justify-between border-t border-border/60 pt-4">
          <p className="text-caption text-muted-foreground">
            Updated{" "}
            <FormatDate value={portfolio.updatedAt} variant="date" />
          </p>
          <span className="text-small font-medium text-foreground/80 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary">
            Open →
          </span>
        </div>
      </div>
    </Link>
  );
}