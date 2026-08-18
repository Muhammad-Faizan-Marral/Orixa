import Link from "next/link";
import { notFound } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { portfolioService } from "@/services/portfolio/portfolio.service";

import { PortfolioLifecycleActions } from "@/features/portfolio/components/portfolio-lifecycle-actions";

type PortfolioPageProps = {
  params: Promise<{
    portfolioId: string;
  }>;
};

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  await requireUser();

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
    <main className="space-y-8">
      <div>
        <Link href="/dashboard/portfolios">← Portfolios</Link>
      </div>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{portfolio.title}</h1>

        <p className="text-sm text-gray-500">@{portfolio.slug}</p>

        <p className="text-sm">
          Status: <strong>{portfolio.status}</strong>
        </p>

        {portfolio.publishedAt && (
          <p className="text-sm text-gray-500">
            Published: {new Date(portfolio.publishedAt).toLocaleString()}
          </p>
        )}
      </header>

      <PortfolioLifecycleActions
        portfolioId={portfolio.id}
        status={portfolio.status as "draft" | "published" | "archived"}
      />
      <Link
        href={`/dashboard/portfolios/${portfolio.id}/versions`}
        className="rounded border px-4 py-2"
      >
        Version History
      </Link>
      <div>
        <Link
          href={`/dashboard/portfolios/${portfolio.id}/edit`}
          className="rounded border px-4 py-2"
        >
          Edit Portfolio
        </Link>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Portfolio Data</h2>

        {data ? (
          <pre className="mt-4 overflow-auto rounded border p-4 text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <p>No portfolio data found.</p>
        )}
      </section>
    </main>
  );
}
