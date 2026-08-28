import Link from "next/link";
import { notFound } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { portfolioViewService } from "@/services/portfolio/portfolio-view.service";

import { PortfolioLifecycleActions } from "@/features/portfolio/components/portfolio-lifecycle-actions";
import { PortfolioViewTracker } from "@/features/portfolio/components/portfolio-view-tracker";
import { Badge } from "@/components/UI/Badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { FormatDate } from "@/components/format-date";

type PortfolioPageProps = {
  params: Promise<{ portfolioId: string }>;
};

const STATUS_VARIANT = {
  published: "success",
  draft: "outline",
  archived: "warning",
} as const;

const NAV_LINKS = (portfolioId: string) => [
  { href: `/dashboard/portfolios/${portfolioId}/edit`, label: "Edit" },
  { href: `/dashboard/portfolios/${portfolioId}/versions`, label: "Versions" },
  {
    href: `/dashboard/portfolios/${portfolioId}/analytics`,
    label: "Analytics",
  },
  { href: `/dashboard/portfolios/${portfolioId}/ai-usage`, label: "AI Usage" },
];

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  await requireUser();
  const profile = await requireProfile();
  const { portfolioId } = await params;

  const result = await portfolioService.getPortfolioWithData(
    portfolioId,
    profile.id,
  );
  if (!result) notFound();

  const { portfolio, data } = result;
  const analytics = await portfolioViewService.getAnalytics(
    portfolioId,
    profile.id,
  );

  const status = portfolio.status as "draft" | "published" | "archived";

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/portfolios"
          className="text-small mb-4 inline-flex items-center gap-1 hover:text-foreground"
        >
          ← Portfolios
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-h1">{portfolio.title}</h1>
              <Badge variant={STATUS_VARIANT[status]} dot>
                {status}
              </Badge>
            </div>
            <p className="text-small mt-1 text-primary/80">
              orixa.ai/{profile.username}/{portfolio.slug}
            </p>
            {portfolio.publishedAt && (
              <p className="text-small mt-1">
                Last published <FormatDate value={portfolio.publishedAt} />
              </p>
            )}
          </div>

          <PortfolioLifecycleActions
            portfolioId={portfolio.id}
            status={status}
          />
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 border-b border-border pb-4">
        {NAV_LINKS(portfolio.id).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-small rounded-full border border-border-strong px-3.5 py-1.5 hover:bg-surface-2 hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total views" value={analytics?.total ?? 0} />
        <StatCard label="Views (7 days)" value={analytics?.last7Days ?? 0} />
        <StatCard label="Version" value={`v${portfolio.currentVersion}`} />
        <StatCard label="Projects" value={data?.projects?.length ?? 0} />
      </section>

      <section className="surface-card space-y-3 p-6">
        <h2 className="text-h3">{data?.headline || "No headline yet"}</h2>
        <p className="text-body text-muted-foreground">
          {data?.about || "Add an About section from the editor."}
        </p>
      </section>

      <PortfolioViewTracker portfolioId={portfolio.id} />
    </div>
  );
}
