import Link from "next/link";
import { notFound } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { portfolioService } from "@/services/portfolio/portfolio.service";
import { RestoreVersionButton } from "@/features/portfolio/components/restore-version-button";
import { Badge } from "@/components/UI/Badge";

type VersionsPageProps = {
  params: Promise<{ portfolioId: string }>;
};

export default async function VersionsPage({ params }: VersionsPageProps) {
  await requireUser();
  const profile = await requireProfile();
  const { portfolioId } = await params;

  const portfolio = await portfolioService.getPortfolioForUser(portfolioId, profile.id);
  if (!portfolio) notFound();

  const versions = await portfolioService.getPortfolioVersions(portfolioId, profile.id);
  const sorted = [...versions].sort((a, b) => b.version - a.version);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/dashboard/portfolios/${portfolioId}`}
          className="text-small mb-4 inline-flex items-center gap-1 hover:text-foreground"
        >
          ← {portfolio.title}
        </Link>
        <p className="text-caption text-accent">Version history</p>
        <h1 className="text-h1 mt-2">Published snapshots</h1>
        <p className="text-body mt-1 text-muted-foreground">
          Every publish creates a new version. Editing never changes a past snapshot.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="border-gradient-ion flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-ion-soft text-xl">
            ✦
          </span>
          <h3 className="text-h3">No published versions yet</h3>
          <p className="text-body max-w-sm text-muted-foreground">
            Publish your portfolio to create your first version snapshot.
          </p>
        </div>
      ) : (
        <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-border">
          {sorted.map((version) => (
            <li key={version.id} className="relative flex gap-4 pl-10">
              <span
                className={
                  "absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold " +
                  (version.published
                    ? "border-primary/30 bg-gradient-ion-soft text-primary"
                    : "border-border-strong bg-surface-2 text-subtle-foreground")
                }
              >
                v{version.version}
              </span>

              <div className="surface-card flex-1 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-label">Version {version.version}</p>
                      {version.published && (
                        <Badge variant="success" dot>
                          Live
                        </Badge>
                      )}
                    </div>
                    <p className="text-small mt-1">
                      {new Date(version.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/portfolios/${portfolioId}/versions/${version.version}`}
                      className="text-small rounded-md border border-border-strong px-3 py-1.5 hover:bg-surface-2 hover:text-foreground"
                    >
                      Preview
                    </Link>
                    {!version.published && (
                      <RestoreVersionButton portfolioId={portfolioId} version={version.version} />
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
