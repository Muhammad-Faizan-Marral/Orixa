import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/require-user";
import { requireProfile } from "@/lib/auth/require-profile";

import { portfolioService } from "@/services/portfolio/portfolio.service";

type PortfolioPageProps = {
  params: Promise<{
    portfolioId: string;
  }>;
};

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const user = await requireUser();

  const profile = await requireProfile();

  const { portfolioId } = await params;

  const result = await portfolioService.getPortfolioWithData(
    portfolioId,
    profile.id,
  );

  if (!result) {
    notFound();
  }

  const { portfolio, data } = result;

  return (
    <main className="space-y-6 p-6">
      <div>
        <Link href="/dashboard/portfolios" className="text-sm">
          ← Portfolios
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{portfolio.title}</h1>

        <p className="text-sm text-gray-500">@{portfolio.slug}</p>
      </div>

      <div className="space-y-2">
        <p>
          Status: <strong>{portfolio.status}</strong>
        </p>

        <p>
          Version: <strong>{portfolio.currentVersion}</strong>
        </p>

        <p>Headline: {data?.headline || "Not added yet"}</p>

        <p>Theme: {data?.theme || "minimal"}</p>
      </div>

      <Link
        href={`/dashboard/portfolios/${portfolio.id}/edit`}
        className="inline-block rounded border px-4 py-2"
      >
        Edit Portfolio
      </Link>
    </main>
  );
}
