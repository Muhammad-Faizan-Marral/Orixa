import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { CreatePortfolioForm } from "@/features/portfolio/components/create-portfolio-form";
import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { billingService } from "@/services/billing/billing.service";

export default async function NewPortfolioPage() {
  const profile = await requireProfile();
  const portfolios = await portfolioService.getUserPortfolios(profile.id);
  const limit = billingService.getLimits(profile).portfolioLimit;

  if (portfolios.length >= limit) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-h1">Portfolio limit reached</h1>
        <p className="text-body text-muted-foreground">
          Free plan allows only 1 portfolio. Upgrade to Premium to create more.
        </p>
        <Link href="/dashboard" className="text-accent hover:underline">
          Return to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/dashboard/portfolios"
        className="text-small mb-6 inline-flex items-center gap-2 hover:text-foreground"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to portfolios
      </Link>

      <div className="mb-8">
        <p className="text-caption text-accent">New portfolio</p>

        <h1 className="text-h1 mt-2">Create your portfolio</h1>

        <p className="text-body mt-2 text-muted-foreground">
          Give it a title and a URL — you can add projects, experience and the
          rest once it&rsquo;s created.
        </p>
      </div>

      <div className="surface-card p-6 md:p-8">
        <CreatePortfolioForm />
      </div>
    </div>
  );
}
