import Link from "next/link";
import { notFound } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { portfolioService } from "@/services/portfolio/portfolio.service";
import { portfolioViewService } from "@/services/portfolio/portfolio-view.service";

import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/UI/Badge";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{
    portfolioId: string;
  }>;
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function barWidth(value: number, max: number) {
  if (max <= 0) return 0;
  return Math.max(6, Math.round((value / max) * 100));
}

export default async function AnalyticsPage({ params }: Props) {
  await requireUser();
  const profile = await requireProfile();
  const { portfolioId } = await params;

  const portfolio = await portfolioService.getPortfolioForUser(
    portfolioId,
    profile.id,
  );
  if (!portfolio) notFound();

  const analytics = await portfolioViewService.getAnalytics(
    portfolioId,
    profile.id,
  );
  if (!analytics) notFound();

  const maxCountry = Math.max(
    0,
    ...analytics.countries.map((c) => Number(c.views) || 0),
  );
  const maxReferrer = Math.max(
    0,
    ...analytics.referrers.map((r) => Number(r.views) || 0),
  );

  const hasTraffic = analytics.total > 0;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <Link
          href={`/dashboard/portfolios/${portfolioId}`}
          className="text-small mb-4 inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          ← {portfolio.title}
        </Link>
        <p className="text-caption text-accent">Insights</p>
        <h1 className="text-h1 mt-2">Analytics</h1>
        <p className="text-body mt-1 max-w-xl text-muted-foreground">
          How people find and view this portfolio — views, locations, and
          referrers.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total views" value={analytics.total} accent />
        <StatCard label="Last 7 days" value={analytics.last7Days} />
        <StatCard label="Last 30 days" value={analytics.last30Days} />
      </section>

      {!hasTraffic ? (
        <div className="border-gradient-ion flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-ion-soft text-xl">
            ◉
          </span>
          <h3 className="text-h3">No views yet</h3>
          <p className="text-body max-w-sm text-muted-foreground">
            Publish your portfolio and share the link. Views, countries, and
            referrers will show up here.
          </p>
          <Link
            href={`/dashboard/portfolios/${portfolioId}`}
            className="text-small mt-2 text-primary hover:underline"
          >
            Back to portfolio →
          </Link>
        </div>
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="surface-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-caption text-accent">Geography</p>
                  <h2 className="text-h3 mt-1">Top countries</h2>
                </div>
                <Badge variant="outline">{analytics.countries.length}</Badge>
              </div>

              {analytics.countries.length === 0 ? (
                <p className="text-small py-8 text-center text-muted-foreground">
                  No country data yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {analytics.countries.map((item) => {
                    const views = Number(item.views) || 0;
                    const width = barWidth(views, maxCountry);
                    return (
                      <li key={item.country} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-small truncate font-medium text-foreground">
                            {item.country || "Unknown"}
                          </span>
                          <span className="text-caption tabular-nums text-muted-foreground">
                            {views}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                          <div
                            className="h-full rounded-full bg-gradient-ion"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="surface-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-caption text-accent">Sources</p>
                  <h2 className="text-h3 mt-1">Top referrers</h2>
                </div>
                <Badge variant="outline">{analytics.referrers.length}</Badge>
              </div>

              {analytics.referrers.length === 0 ? (
                <p className="text-small py-8 text-center text-muted-foreground">
                  No referrer data yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {analytics.referrers.map((item) => {
                    const views = Number(item.views) || 0;
                    const width = barWidth(views, maxReferrer);
                    const label =
                      !item.referrer || item.referrer === ""
                        ? "Direct"
                        : item.referrer;
                    return (
                      <li
                        key={item.referrer || "direct"}
                        className="space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-small truncate font-medium text-foreground">
                            {label}
                          </span>
                          <span className="text-caption tabular-nums text-muted-foreground">
                            {views}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                          <div
                            className="h-full rounded-full bg-primary/70"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>

          <section className="surface-card overflow-hidden">
            <div className="border-b border-border px-6 py-5">
              <p className="text-caption text-accent">Activity</p>
              <h2 className="text-h3 mt-1">Recent views</h2>
              <p className="text-small mt-1 text-muted-foreground">
                Latest visitors to this portfolio.
              </p>
            </div>

            {analytics.recentViews.length === 0 ? (
              <p className="text-small px-6 py-10 text-center text-muted-foreground">
                No recent views recorded.
              </p>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[640px] text-left">
                    <thead>
                      <tr className="border-b border-border text-caption text-subtle-foreground">
                        <th className="px-6 py-3 font-medium">When</th>
                        <th className="px-4 py-3 font-medium">Location</th>
                        <th className="px-4 py-3 font-medium">Device</th>
                        <th className="px-4 py-3 font-medium">Browser</th>
                        <th className="px-4 py-3 font-medium">Referrer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentViews.map((view, i) => (
                        <tr
                          key={view.id}
                          className={cn(
                            "border-b border-border/60 transition-colors hover:bg-surface-2/50",
                            i === analytics.recentViews.length - 1 &&
                              "border-b-0",
                          )}
                        >
                          <td className="px-6 py-3.5 text-small tabular-nums text-muted-foreground">
                            {formatWhen(view.visitedAt)}
                          </td>
                          <td className="px-4 py-3.5 text-small text-foreground">
                            {view.country || "Unknown"}
                          </td>
                          <td className="px-4 py-3.5 text-small text-muted-foreground">
                            {view.device || "—"}
                          </td>
                          <td className="px-4 py-3.5 text-small text-muted-foreground">
                            {view.browser || "—"}
                          </td>
                          <td className="max-w-[180px] truncate px-4 py-3.5 text-small text-muted-foreground">
                            {view.referrer || "Direct"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <ul className="divide-y divide-border md:hidden">
                  {analytics.recentViews.map((view) => (
                    <li key={view.id} className="space-y-2 px-5 py-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-small font-medium text-foreground">
                          {view.country || "Unknown location"}
                        </span>
                        <span className="text-caption tabular-nums text-subtle-foreground">
                          {formatWhen(view.visitedAt)}
                        </span>
                      </div>
                      <p className="text-small text-muted-foreground">
                        {[view.device, view.browser]
                          .filter(Boolean)
                          .join(" · ") || "Unknown device"}
                      </p>
                      <p className="text-caption text-subtle-foreground">
                        via {view.referrer || "Direct"}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
