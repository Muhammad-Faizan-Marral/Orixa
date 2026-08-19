import Link from "next/link";
import { notFound } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { RestoreVersionButton } from "@/features/portfolio/components/restore-version-button";

type VersionPreviewPageProps = {
  params: Promise<{
    portfolioId: string;
    version: string;
  }>;
};

export default async function VersionPreviewPage({
  params,
}: VersionPreviewPageProps) {
  await requireUser();

  const profile = await requireProfile();

  const { portfolioId, version } = await params;

  const versionNumber = Number(version);

  if (!Number.isInteger(versionNumber) || versionNumber < 1) {
    notFound();
  }

  const result = await portfolioService.getPortfolioVersion(
    portfolioId,
    profile.id,
    versionNumber,
  );

  if (!result) {
    notFound();
  }

  const { portfolio, version: versionData } = result;

  const config = versionData.configJson as {
    headline?: string | null;
    about?: string | null;
    projects?: unknown[];
    experience?: unknown[];
    skills?: unknown[];
    education?: unknown[];
    certificates?: unknown[];
    resumeUrl?: string | null;
    theme?: string | null;
    animations?: boolean;
    componentSelection?: Record<string, unknown>;
    designPreferences?: Record<string, unknown>;
    seo?: Record<string, unknown>;
  };

  return (
    <main>
      <Link href={`/dashboard/portfolios/${portfolioId}/versions`}>
        ← Version History
      </Link>

      <header>
        <h1>
          {portfolio.title} — Version {versionData.version}
        </h1>

        <p>Created {new Date(versionData.createdAt).toLocaleString()}</p>

        <p>
          {versionData.published ? "Currently Published" : "Historical Version"}
        </p>
      </header>

      <section>
        <h2>Preview</h2>

        <div>
          <h3>{config.headline || "No headline"}</h3>

          <p>{config.about || "No about information."}</p>
        </div>
      </section>

      <section>
        <h2>Portfolio Configuration</h2>

        <pre>{JSON.stringify(config, null, 2)}</pre>
      </section>

      <section>
        <RestoreVersionButton
          portfolioId={portfolio.id}
          version={versionData.version}
        />
      </section>
    </main>
  );
}
