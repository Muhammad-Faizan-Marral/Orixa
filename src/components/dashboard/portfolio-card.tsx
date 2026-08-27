import Link from "next/link";
import { Badge } from "@/components/UI/Badge";
import type { BadgeVariant } from "@/components/UI/Badge";

type Portfolio = {
  id: string;
  title: string;
  slug: string;
  status: string;
  currentVersion: number;
  updatedAt: string;
};

const STATUS_VARIANT: Record<string, BadgeVariant> = {
  published: "success",
  draft: "outline",
  archived: "warning",
};

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  return (
    <Link
      href={`/dashboard/portfolios/${portfolio.id}`}
      className="surface-card group flex flex-col justify-between p-5 transition-colors hover:border-border-strong"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-h3 !text-base line-clamp-1">{portfolio.title}</h3>
          <Badge variant={STATUS_VARIANT[portfolio.status] ?? "default"} dot>
            {portfolio.status}
          </Badge>
        </div>
        <p className="text-small mt-1 text-primary/80">
          orixa.ai/{portfolio.slug}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-caption">v{portfolio.currentVersion}</span>
        <span className="text-small transition-transform group-hover:translate-x-0.5">
          Open →
        </span>
      </div>
    </Link>
  );
}
