import Link from "next/link";

import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { portfolioViewService } from "@/services/portfolio/portfolio-view.service";
import { UpgradeCard } from "@/components/dashboard/upgrade-card";
import { ReferralCard } from "@/components/dashboard/referral-card";
import { isPremiumActive } from "@/constants/billing";
import { billingService } from "@/services/billing/billing.service";
import { profileRepository } from "@/repositories/profile.repository";
import { Button } from "@/components/UI/Button";
import { StatCard } from "@/components/dashboard/stat-card";
import { PortfolioCard } from "@/components/dashboard/portfolio-card";

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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; checkout_id?: string }>;
}) {
  let profile = await requireProfile();
  const params = await searchParams;
  if (params.checkout === "success" && params.checkout_id) {
    try {
      await billingService.activateSuccessfulCheckout(
        profile.userId,
        params.checkout_id,
      );
      profile = (await profileRepository.findByUserId(profile.userId)) ?? profile;
    } catch (error) {
      console.error("[dashboard] checkout activation failed", error);
    }
  }
    const referralCode =
    profile.referralCode ||
    (await billingService.ensureReferralCode(profile.userId, profile.username));

  const premiumActive = isPremiumActive({
    isPremium: profile.isPremium ?? false,
    premiumUntil: profile.premiumUntil ?? null,
  });
  const portfolios = await portfolioService.getUserPortfolios(profile.id);
  const portfolioLimit = billingService.getLimits({
    isPremium: profile.isPremium ?? false,
    premiumUntil: profile.premiumUntil ?? null,
  }).portfolioLimit;

  const publishedCount = portfolios.filter((p) => p.status === "published").length;

  const completion = computeProfileCompletion(profile);

  const totalViews = (
    await Promise.all(
      portfolios.map((p) =>
        portfolioViewService.getTotalViews(p.id, profile.id),
      ),
    )
  ).reduce((sum, analytics) => sum + (analytics?.total ?? 0), 0);

  const recentPortfolios = [...portfolios]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-caption text-accent">Welcome back</p>
          <h1 className="text-h1 mt-2">
            {profile.fullName || profile.username}
          </h1>
        </div>

        {portfolios.length < portfolioLimit ? (
          <Link href="/dashboard/portfolios/new">
            <Button variant="gradient">+ Create portfolio</Button>
          </Link>
        ) : (
          <p className="text-small max-w-xs text-right text-muted-foreground">
            Free plan allows one portfolio. Upgrade to Premium to create more.
          </p>
        )}
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Portfolios" value={portfolios.length} />
        <StatCard label="Published" value={publishedCount} accent />
        <StatCard label="Total views" value={totalViews} />
        <StatCard
          label="Profile completion"
          value={`${completion}%`}
          hint={
            completion < 100
              ? "Add more details to your profile"
              : "Looking sharp"
          }
        />
      </section>
      <UpgradeCard profile={profile} />

      <ReferralCard
        referralCode={referralCode}
        successfulReferrals={profile.successfulReferrals ?? 0}
        isPremium={premiumActive}
      />
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-h3">Your portfolios</h2>
          {portfolios.length > 0 && (
            <Link
              href="/dashboard/portfolios"
              className="text-small hover:text-foreground"
            >
              View all →
            </Link>
          )}
        </div>

        {portfolios.length === 0 ? (
          <div className="border-gradient-ion flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-ion-soft text-xl">
              ✦
            </span>
            <h3 className="text-h3">
              You haven&rsquo;t created your first portfolio yet
            </h3>
            <p className="text-body max-w-sm text-muted-foreground">
              Add your projects, experience and skills — Orixa turns it into a
              published website in minutes.
            </p>
            <Link href="/dashboard/portfolios/new" className="mt-2">
              <Button variant="gradient">Create your portfolio</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPortfolios.map((portfolio) => (
              <PortfolioCard key={portfolio.id} portfolio={portfolio} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
