import Link from "next/link";

import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";

import { Button } from "@/components/UI/Button";
import { PortfolioCard } from "@/components/dashboard/portfolio-card";

export default async function PortfoliosPage() {
  const profile = await requireProfile();
  const portfolios = await portfolioService.getUserPortfolios(profile.id);

  const sorted = [...portfolios].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-caption text-accent">Dashboard</p>
          <h1 className="text-h1 mt-2">Portfolios</h1>
          <p className="text-body mt-1 text-muted-foreground">
            {portfolios.length} {portfolios.length === 1 ? "portfolio" : "portfolios"} in your profile
          </p>
        </div>

        <Link href="/dashboard/portfolios/new">
          <Button variant="gradient">+ Create portfolio</Button>
        </Link>
      </header>

      {portfolios.length === 0 ? (
        <div className="border-gradient-ion flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-ion-soft text-xl">
            ✦
          </span>
          <h3 className="text-h3">No portfolios yet</h3>
          <p className="text-body max-w-sm text-muted-foreground">
            Create your first portfolio to get a shareable orixa.ai URL.
          </p>
          <Link href="/dashboard/portfolios/new" className="mt-2">
            <Button variant="gradient">Create your first portfolio</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((portfolio) => (
            <PortfolioCard key={portfolio.id} portfolio={portfolio} />
          ))}
        </div>
      )}
    </div>
  );
}
