import Link from "next/link";

import { requireProfile } from "@/lib/auth/require-profile";
import { billingService } from "@/services/billing/billing.service";
import { Button } from "@/components/UI/Button";
import { PortfolioCard } from "@/components/dashboard/portfolio-card";
import { getUserPortfoliosCached } from "@/lib/cache/dashboard-data";

const DISPLAY = "font-[family-name:var(--font-display)]";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const EMPTY_STEPS = [
  "Add your projects, experience and skills",
  "Pick a look in the design lab",
  "Publish and share your link",
];

export default async function PortfoliosPage() {
  const profile = await requireProfile();
  // shared cache with dashboard: page hop often costs 0 extra DB
  const portfolios = await getUserPortfoliosCached(profile.id);
  const limit = billingService.getLimits(profile).portfolioLimit;
  const canCreate = portfolios.length < limit;
  const hasLimit = Number.isFinite(limit);

  const sorted = [...portfolios].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const publishedCount = portfolios.filter(
    (p) => p.status === "published",
  ).length;

  return (
    <div
      className="mx-auto w-full max-w-6xl space-y-10 pb-20"
      style={{ ["--font-display" as string]: "var(--font-dm), sans-serif" }}
    >
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-3">
          <h1
            className={`${DISPLAY} text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl`}
          >
            Portfolios
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-foreground/[0.06] px-2 py-1 text-xs font-medium tabular-nums text-foreground/80">
              {portfolios.length}
              {hasLimit ? ` of ${limit}` : ""}{" "}
              {portfolios.length === 1 ? "portfolio" : "portfolios"}
            </span>

            {publishedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium tabular-nums text-emerald-700 dark:text-emerald-300">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-emerald-500"
                />
                {publishedCount} live
              </span>
            )}
          </div>
        </div>

        {canCreate ? (
          <Link
            href="/dashboard/portfolios/new"
            className={`shrink-0 self-start rounded-xl sm:self-auto ${FOCUS}`}
          >
            <Button variant="gradient">+ Create portfolio</Button>
          </Link>
        ) : (
          <p className="text-small max-w-xs rounded-xl border border-border bg-foreground/[0.025] px-4 py-3 text-muted-foreground">
            Free plan allows one portfolio. Upgrade to Premium to create more.
          </p>
        )}
      </header>

      {portfolios.length === 0 ? (
        <section
          aria-label="No portfolios yet"
          className="grid gap-8 overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.09] via-violet-500/[0.03] to-transparent p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-14"
        >
          <div className="space-y-4">
            <h2
              className={`${DISPLAY} text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.025em] text-foreground`}
            >
              No portfolios yet
            </h2>
            <p className="max-w-[44ch] text-base leading-7 text-foreground/70">
              Create your first portfolio to get a shareable orixa.ai URL.
            </p>
            <Link
              href="/dashboard/portfolios/new"
              className={`inline-block rounded-xl pt-2 ${FOCUS}`}
            >
              <Button variant="gradient">Create your first portfolio</Button>
            </Link>
          </div>

          <ol className="space-y-3">
            {EMPTY_STEPS.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-4 rounded-xl border border-border bg-background px-4 py-3.5"
              >
                <span
                  aria-hidden="true"
                  className={`${DISPLAY} flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-sm font-semibold text-white`}
                >
                  {i + 1}
                </span>
                <span className="text-[15px] font-medium text-foreground">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <section aria-label="Your portfolios">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((portfolio) => (
              <PortfolioCard key={portfolio.id} portfolio={portfolio} />
            ))}

            {canCreate && (
              <Link
                href="/dashboard/portfolios/new"
                className={`group flex min-h-[188px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-foreground/25 p-6 text-center transition-colors hover:border-violet-500/60 hover:bg-violet-500/[0.05] ${FOCUS}`}
              >
                <span
                  aria-hidden="true"
                  className="flex size-11 items-center justify-center rounded-xl bg-foreground/[0.06] text-foreground transition-colors group-hover:bg-violet-600 group-hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                <span className="text-[15px] font-medium text-foreground">
                  Create another portfolio
                </span>
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}