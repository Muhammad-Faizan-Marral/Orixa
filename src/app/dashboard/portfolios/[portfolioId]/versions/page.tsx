import Link from "next/link";
import { notFound } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { portfolioService } from "@/services/portfolio/portfolio.service";
import { RestoreVersionButton } from "@/features/portfolio/components/restore-version-button";

type VersionsPageProps = {
  params: Promise<{
    portfolioId: string;
  }>;
};

export default async function VersionsPage({ params }: VersionsPageProps) {
  await requireUser();

  const profile = await requireProfile();

  const { portfolioId } = await params;

  const portfolio = await portfolioService.getPortfolioForUser(
    portfolioId,
    profile.id,
  );

  if (!portfolio) {
    notFound();
  }

  const versions = await portfolioService.getPortfolioVersions(
    portfolioId,
    profile.id,
  );

  return (
    <main className="space-y-6">
      <div>
        <Link href={`/dashboard/portfolios/${portfolioId}`}>← Portfolio</Link>
      </div>

      <header>
        <h1 className="text-2xl font-semibold">Portfolio Versions</h1>

        <p className="text-sm text-gray-500">{portfolio.title}</p>
      </header>

      {versions.length === 0 ? (
        <div className="rounded border p-6">
          <p className="text-sm text-gray-500">No published versions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {versions.map((version) => (
            <article key={version.id}>
              <h2>Version {version.version}</h2>

              <p>Created: {new Date(version.createdAt).toLocaleString()}</p>

              <p>{version.published ? "Published" : "Historical"}</p>

              <div>
                <Link
                  href={`/dashboard/portfolios/${portfolioId}/versions/${version.version}`}
                >
                  Preview
                </Link>

                <RestoreVersionButton
                  portfolioId={portfolioId}
                  version={version.version}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
