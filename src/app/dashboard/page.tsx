import Link from "next/link";

import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioViewService } from "@/services/portfolio/portfolio-view.service";
import { UpgradeCard } from "@/components/dashboard/upgrade-card";
import { ReferralCard } from "@/components/dashboard/referral-card";
import { isPremiumActive } from "@/constants/billing";
import { billingService } from "@/services/billing/billing.service";
import { profileRepository } from "@/repositories/profile.repository";
import { Button } from "@/components/UI/Button";
import { PortfolioCard } from "@/components/dashboard/portfolio-card";
import { getUserPortfoliosCached } from "@/lib/cache/dashboard-data";

const DISPLAY = "font-[family-name:var(--font-display)]";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function computeProfileCompletion(profile: {
  fullName: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  avatarUrl: string | null;
}) {
  const fields = [
    profile.fullName,
    profile.headline,
    profile.bio,
    profile.location,
    profile.avatarUrl,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-4 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const EMPTY_STEPS = [
  "Add your projects, experience and skills",
  "Pick a look in the design lab",
  "Publish and share your link",
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; checkout_id?: string }>;
}) {
  let profile = await requireProfile();
  const params = await searchParams;

  // checkout activation only when needed
  if (params.checkout === "success" && params.checkout_id) {
    try {
      await billingService.activateSuccessfulCheckout(
        profile.userId,
        params.checkout_id,
      );
      profile =
        (await profileRepository.findByUserId(profile.userId)) ?? profile;
    } catch (error) {
      console.error("[dashboard] checkout activation failed", error);
    }
  }

  // Parallel: portfolios + referral (no sequential waterfalls)
  const [portfolios, referralCode] = await Promise.all([
    getUserPortfoliosCached(profile.id),
    profile.referralCode
      ? Promise.resolve(profile.referralCode)
      : billingService.ensureReferralCode(profile.userId, profile.username),
  ]);

  const premiumActive = isPremiumActive({
    isPremium: profile.isPremium ?? false,
    premiumUntil: profile.premiumUntil ?? null,
  });

  const portfolioLimit = billingService.getLimits({
    isPremium: profile.isPremium ?? false,
    premiumUntil: profile.premiumUntil ?? null,
  }).portfolioLimit;

  const publishedCount = portfolios.filter(
    (p) => p.status === "published",
  ).length;
  const completion = computeProfileCompletion(profile);

  // CRITICAL: no portfolios → zero view queries, instant empty UI
  let totalViews = 0;
  if (portfolios.length > 0) {
    const { total } = await portfolioViewService.getTotalsForPortfolioIds(
      portfolios.map((p) => p.id),
    );
    totalViews = total;
  }

  const recentPortfolios = [...portfolios]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 3);

  const canCreate = portfolios.length < portfolioLimit;
  const hasLimit = Number.isFinite(portfolioLimit);
  const firstName = (profile.fullName || profile.username || "").split(" ")[0];

  const summary =
    portfolios.length === 0
      ? "Let’s get your first portfolio online."
      : `${publishedCount} of ${portfolios.length} ${
          portfolios.length === 1 ? "portfolio is" : "portfolios are"
        } live.`;

  return (
    <div
      className="mx-auto w-full max-w-6xl space-y-12 pb-20 [--accent:#2f5d50] dark:[--accent:#92c9b6]"
      style={{ ["--font-display" as string]: "var(--font-dm), sans-serif" }}
    >
      {/* ── Header ── */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.06] px-3 py-1 text-xs font-medium text-foreground/80">
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${
                premiumActive ? "bg-violet-500" : "bg-foreground/35"
              }`}
            />
            {premiumActive ? "Premium plan" : "Free plan"}
          </span>

          <h1
            className={`${DISPLAY} text-balance break-words text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl`}
          >
            Welcome back, {firstName}
          </h1>

          <p className="text-base text-muted-foreground">{summary}</p>
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

      {/* ── Numbers ── */}
      <section
        aria-label="Overview"
        className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
      >
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="bg-violet-500/[0.08] px-6 pb-6 pt-6 dark:bg-violet-400/[0.1]">
            <p className="text-small text-foreground/70">Total views</p>
            <p
              className={`${DISPLAY} mt-1 text-6xl font-semibold leading-none tracking-[-0.04em] tabular-nums text-violet-700 dark:text-violet-300 sm:text-7xl`}
            >
              {totalViews.toLocaleString()}
            </p>
            <p className="text-small mt-3 text-muted-foreground">
              Across all of your portfolios
            </p>
          </div>

          <dl className="grid grid-cols-2 divide-x divide-border border-t border-border">
            <div className="px-6 py-4">
              <dd
                className={`${DISPLAY} text-2xl font-semibold tabular-nums tracking-tight text-foreground`}
              >
                {portfolios.length}
                {hasLimit && (
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}
                    / {portfolioLimit}
                  </span>
                )}
              </dd>
              <dt className="text-small mt-0.5 text-muted-foreground">
                Portfolios
              </dt>
            </div>

            <div className="px-6 py-4">
              <dd
                className={`${DISPLAY} flex items-center gap-2 text-2xl font-semibold tabular-nums tracking-tight text-foreground`}
              >
                {publishedCount}
                {publishedCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-emerald-500"
                  />
                )}
              </dd>
              <dt className="text-small mt-0.5 text-muted-foreground">
                Published
              </dt>
            </div>
          </dl>
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-2xl border border-border p-6">
          <div>
            <p className="text-small text-muted-foreground">
              Profile completion
            </p>
            <p
              className={`${DISPLAY} mt-1 text-5xl font-semibold leading-none tracking-[-0.04em] tabular-nums text-foreground`}
            >
              {completion}%
            </p>
          </div>

          <div className="space-y-3">
            <div
              role="progressbar"
              aria-label="Profile completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={completion}
              className="h-2 overflow-hidden rounded-full bg-foreground/[0.08]"
            >
              <div
                className="h-full rounded-full bg-violet-600 transition-[width] duration-500 dark:bg-violet-400"
                style={{ width: `${completion}%` }}
              />
            </div>

            <p className="text-small text-muted-foreground">
              {completion < 100
                ? "Add more details to your profile"
                : "Looking sharp"}
            </p>
          </div>
        </div>
      </section>

      {/* ── Portfolios ── */}
      <section aria-labelledby="portfolios-title" className="space-y-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="portfolios-title"
            className={`${DISPLAY} text-2xl font-semibold tracking-tight text-foreground`}
          >
            {portfolios.length > 0 ? "Recently edited" : "Your portfolios"}
          </h2>

          {portfolios.length > 0 && (
            <Link
              href="/dashboard/portfolios"
              className={`text-small group inline-flex items-center gap-1.5 rounded-md font-medium text-muted-foreground transition-colors hover:text-foreground ${FOCUS}`}
            >
              View all
              <Arrow className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {portfolios.length === 0 ? (
          <div className="grid gap-8 overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.09] via-violet-500/[0.03] to-transparent p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
            <div className="space-y-4">
              <h3
                className={`${DISPLAY} text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.025em] text-foreground`}
              >
                You haven&rsquo;t created your first portfolio yet
              </h3>
              <p className="max-w-[44ch] text-base leading-7 text-foreground/70">
                Add your projects, experience and skills. Orixa turns them into
                a published website in minutes.
              </p>
              <Link
                href="/dashboard/portfolios/new"
                className={`inline-block rounded-xl pt-2 ${FOCUS}`}
              >
                <Button variant="gradient">Create your portfolio</Button>
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
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPortfolios.map((portfolio) => (
              <PortfolioCard key={portfolio.id} portfolio={portfolio} />
            ))}

            {canCreate && recentPortfolios.length < 3 && (
              <Link
                href="/dashboard/portfolios/new"
                className={`group flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-foreground/25 p-6 text-center transition-colors hover:border-violet-500/60 hover:bg-violet-500/[0.05] ${FOCUS}`}
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
        )}
      </section>

      {/* ── Plan and rewards ── */}
      <div className="space-y-6">
        <UpgradeCard profile={profile} />

        <ReferralCard
          referralCode={referralCode}
          successfulReferrals={profile.successfulReferrals ?? 0}
          isPremium={premiumActive}
        />
      </div>
    </div>
  );
}
