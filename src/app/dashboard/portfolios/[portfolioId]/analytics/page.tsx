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

  const countries = analytics.countries ?? [];
  const trafficSources = analytics.trafficSources ?? [];
  const devices = analytics.devices ?? [];
  const topProjects = analytics.topProjects ?? [];
  const recentViews = analytics.recentViews ?? [];
  const insights = analytics.insights ?? {
    topSource: null,
    mostViewedProject: null,
    mostActiveCountry: null,
  };

  const maxCountry = Math.max(
    0,
    ...countries.map((c: { views?: number | string }) => Number(c.views) || 0),
  );

  const maxSource = Math.max(
    0,
    ...trafficSources.map((s) => Number(s.views) || 0),
  );

  const hasTraffic = (analytics.total ?? 0) > 0;

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
          How people find and engage with this portfolio — visitors, sources,
          projects, and messages.
        </p>
      </div>

      {/* KPI grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Visitors"
          value={(analytics.total ?? 0).toLocaleString()}
          accent
        />
        <StatCard
          label="Unique visitors"
          value={(analytics.uniqueVisitors ?? 0).toLocaleString()}
        />
        <StatCard label="Countries" value={analytics.countryCount ?? 0} />
        <StatCard
          label="Projects viewed"
          value={(analytics.projectClicks ?? 0).toLocaleString()}
        />
        <StatCard
          label="Contact clicks"
          value={(analytics.contactClicks ?? 0).toLocaleString()}
        />
        <StatCard
          label="Messages"
          value={(analytics.messages ?? 0).toLocaleString()}
        />
      </section>

      {/* Insight cards */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-6">
          <p className="text-caption text-accent">Top traffic source</p>
          <h3 className="text-h3 mt-2">{insights.topSource?.name ?? "—"}</h3>
          <p className="text-small mt-1 text-muted-foreground">
            {insights.topSource
              ? `${insights.topSource.percent}% of tracked traffic`
              : "No referrer data yet"}
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-caption text-accent">Most viewed project</p>
          <h3 className="text-h3 mt-2">{insights.mostViewedProject ?? "—"}</h3>
          <p className="text-small mt-1 text-muted-foreground">
            Based on project link clicks
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-caption text-accent">Most active country</p>
          <h3 className="text-h3 mt-2">{insights.mostActiveCountry ?? "—"}</h3>
          <p className="text-small mt-1 text-muted-foreground">
            Highest visitor share
          </p>
        </div>
      </section>

      {!hasTraffic ? (
        <div className="border-gradient-ion flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-ion-soft text-xl">
            ◉
          </span>
          <h3 className="text-h3">No views yet</h3>
          <p className="text-body max-w-sm text-muted-foreground">
            Publish your portfolio and share the link. Views, countries, and
            sources will show up here.
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
          {/* Traffic sources */}
          <section className="surface-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-caption text-accent">Acquisition</p>
                <h2 className="text-h3 mt-1">Traffic sources</h2>
              </div>
              <Badge variant="outline">{trafficSources.length}</Badge>
            </div>

            {trafficSources.length === 0 ? (
              <p className="text-small py-8 text-center text-muted-foreground">
                No referrer data yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {trafficSources.map((s) => (
                  <li key={s.name}>
                    <div className="mb-1.5 flex justify-between gap-3 text-sm">
                      <span className="font-medium">{s.name}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {s.percent}% · {s.views}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-3">
                      <div
                        className="h-full rounded-full bg-gradient-ion"
                        style={{
                          width: `${barWidth(Number(s.views) || 0, maxSource)}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            {/* Countries */}
            <div className="surface-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-caption text-accent">Geography</p>
                  <h2 className="text-h3 mt-1">Top countries</h2>
                </div>
                <Badge variant="outline">{countries.length}</Badge>
              </div>

              {countries.length === 0 ? (
                <p className="text-small py-8 text-center text-muted-foreground">
                  No country data yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {countries.map((item: { country?: string | null; views?: number | string }) => {
                    const views = Number(item.views) || 0;
                    const width = barWidth(views, maxCountry);
                    return (
                      <li
                        key={item.country || "unknown"}
                        className="space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-small truncate font-medium">
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

            {/* Top projects */}
            <div className="surface-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-caption text-accent">Engagement</p>
                  <h2 className="text-h3 mt-1">Top projects</h2>
                </div>
                <Badge variant="outline">{topProjects.length}</Badge>
              </div>

              {topProjects.length === 0 ? (
                <p className="text-small py-8 text-center text-muted-foreground">
                  No project clicks yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {topProjects.map(
                    (item: { label?: string | null; count?: number }) => (
                      <li
                        key={item.label || "project"}
                        className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5 last:border-0"
                      >
                        <span className="text-small truncate font-medium">
                          {item.label || "Untitled"}
                        </span>
                        <span className="text-caption tabular-nums text-muted-foreground">
                          {Number(item.count) || 0}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>
          </section>

          {/* Devices (optional) */}
          {devices.length > 0 && (
            <section className="surface-card p-6">
              <p className="text-caption text-accent">Technology</p>
              <h2 className="text-h3 mt-1">Devices</h2>
              <ul className="mt-5 flex flex-wrap gap-3">
                {devices.map(
                  (d: { device?: string | null; views?: number }) => (
                    <li
                      key={d.device || "other"}
                      className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm"
                    >
                      <span className="font-medium">{d.device || "Other"}</span>
                      <span className="ml-2 text-muted-foreground">
                        {Number(d.views) || 0}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </section>
          )}

          {/* Recent views */}
          <section className="surface-card overflow-hidden">
            <div className="border-b border-border px-6 py-5">
              <p className="text-caption text-accent">Activity</p>
              <h2 className="text-h3 mt-1">Recent views</h2>
              <p className="text-small mt-1 text-muted-foreground">
                Latest visitors to this portfolio.
              </p>
            </div>

            {recentViews.length === 0 ? (
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
                      {recentViews.map(
                        (
                          view: {
                            id: string;
                            visitedAt: string;
                            country?: string | null;
                            device?: string | null;
                            browser?: string | null;
                            referrer?: string | null;
                          },
                          i: number,
                        ) => (
                          <tr
                            key={view.id}
                            className={cn(
                              "border-b border-border/60 transition-colors hover:bg-surface-2/50",
                              i === recentViews.length - 1 && "border-b-0",
                            )}
                          >
                            <td className="px-6 py-3.5 text-small tabular-nums text-muted-foreground">
                              {formatWhen(view.visitedAt)}
                            </td>
                            <td className="px-4 py-3.5 text-small">
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
                        ),
                      )}
                    </tbody>
                  </table>
                </div>

                <ul className="divide-y divide-border md:hidden">
                  {recentViews.map(
                    (view: {
                      id: string;
                      visitedAt: string;
                      country?: string | null;
                      device?: string | null;
                      browser?: string | null;
                      referrer?: string | null;
                    }) => (
                      <li key={view.id} className="space-y-2 px-5 py-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-small font-medium">
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
                    ),
                  )}
                </ul>
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
