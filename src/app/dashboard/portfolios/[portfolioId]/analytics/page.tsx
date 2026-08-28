import Link from "next/link";
import { notFound } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { portfolioViewService } from "@/services/portfolio/portfolio-view.service";
import { FormatDate } from "@/components/format-date";

type Props = {
  params: Promise<{
    portfolioId: string;
  }>;
};

export default async function AnalyticsPage({ params }: Props) {
  await requireUser();

  const profile = await requireProfile();

  const { portfolioId } = await params;

  const analytics = await portfolioViewService.getAnalytics(
    portfolioId,
    profile.id,
  );

  if (!analytics) {
    notFound();
  }

  return (
    <main>
      <header>
        <Link href={`/dashboard/portfolios/${portfolioId}`}>← Portfolio</Link>

        <h1>Portfolio Analytics</h1>
      </header>

      <section>
        <div>
          <h2>Total Views</h2>
          <strong>{analytics.total}</strong>
        </div>

        <div>
          <h2>Last 7 Days</h2>
          <strong>{analytics.last7Days}</strong>
        </div>

        <div>
          <h2>Last 30 Days</h2>
          <strong>{analytics.last30Days}</strong>
        </div>
      </section>

      <section>
        <h2>Top Countries</h2>

        {analytics.countries.length === 0 ? (
          <p>No country data yet.</p>
        ) : (
          <ul>
            {analytics.countries.map((item) => (
              <li key={item.country}>
                <span>{item.country}</span>

                <strong>{Number(item.views)}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Top Referrers</h2>

        {analytics.referrers.length === 0 ? (
          <p>No referrer data yet.</p>
        ) : (
          <ul>
            {analytics.referrers.map((item) => (
              <li key={item.referrer}>
                <span>{item.referrer}</span>

                <strong>{Number(item.views)}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Recent Views</h2>

        {analytics.recentViews.length === 0 ? (
          <p>No views yet.</p>
        ) : (
          <div>
            {analytics.recentViews.map((view) => (
              <article key={view.id}>
                <p>{view.country || "Unknown location"}</p>

                <p>{view.device || "Unknown device"}</p>

                <p>{view.browser || "Unknown browser"}</p>

                <p>{view.referrer || "Direct"}</p>

                <time><FormatDate value={view.visitedAt} /></time>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
