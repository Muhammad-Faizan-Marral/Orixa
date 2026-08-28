import Link from "next/link";
import { notFound } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { RestoreVersionButton } from "@/features/portfolio/components/restore-version-button";
import { Badge } from "@/components/UI/Badge";
import { FormatDate } from "@/components/format-date";

type VersionPreviewPageProps = {
  params: Promise<{ portfolioId: string; version: string }>;
};

export default async function VersionPreviewPage({ params }: VersionPreviewPageProps) {
  await requireUser();
  const profile = await requireProfile();
  const { portfolioId, version } = await params;

  const versionNumber = Number(version);
  if (!Number.isInteger(versionNumber) || versionNumber < 1) notFound();

  const result = await portfolioService.getPortfolioVersion(portfolioId, profile.id, versionNumber);
  if (!result) notFound();

  const { portfolio, version: versionData } = result;

  const config = versionData.configJson as {
    headline?: string | null;
    about?: string | null;
    projects?: { title?: string }[];
    experience?: { role?: string; company?: string }[];
    skills?: { name?: string }[];
    education?: { institution?: string }[];
    certificates?: { name?: string }[];
    resumeUrl?: string | null;
    theme?: string | null;
    animations?: boolean;
    componentSelection?: Record<string, boolean>;
    designPreferences?: { accentColor?: string; layout?: string };
    seo?: { title?: string; description?: string };
  };

  const enabledSections = Object.entries(config.componentSelection ?? {})
    .filter(([, enabled]) => enabled)
    .map(([key]) => key.replace(/^show/, ""));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/dashboard/portfolios/${portfolioId}/versions`}
          className="text-small mb-4 inline-flex items-center gap-1 hover:text-foreground"
        >
          ← Version history
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-h1">
            {portfolio.title} · v{versionData.version}
          </h1>
          <Badge variant={versionData.published ? "success" : "outline"} dot>
            {versionData.published ? "Currently published" : "Historical version"}
          </Badge>
        </div>
        <p className="text-body mt-1 text-muted-foreground">
           Created <FormatDate value={versionData.createdAt} />
        </p>
      </div>

      <section className="surface-card space-y-3 p-6">
        <h2 className="text-h3">{config.headline || "No headline"}</h2>
        <p className="text-body text-muted-foreground">{config.about || "No about information."}</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryStat label="Projects" value={config.projects?.length ?? 0} />
        <SummaryStat label="Experience" value={config.experience?.length ?? 0} />
        <SummaryStat label="Skills" value={config.skills?.length ?? 0} />
        <SummaryStat label="Certificates" value={config.certificates?.length ?? 0} />
      </div>

      <section className="surface-card space-y-4 p-6">
        <h2 className="text-h3">Design</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>{config.theme ?? "minimal"} theme</Badge>
          <Badge>{config.designPreferences?.layout ?? "standard"} layout</Badge>
          <Badge>{config.animations ? "Motion on" : "Motion off"}</Badge>
          {config.designPreferences?.accentColor && (
            <Badge>
              <span
                className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: config.designPreferences.accentColor }}
              />
              Accent
            </Badge>
          )}
        </div>
        {enabledSections.length > 0 && (
          <div>
            <p className="text-small mb-2">Visible sections</p>
            <div className="flex flex-wrap gap-2">
              {enabledSections.map((section) => (
                <Badge key={section} variant="outline">
                  {section}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </section>

      {config.seo?.title && (
        <section className="surface-card space-y-1 p-6">
          <h2 className="text-h3">SEO</h2>
          <p className="text-body">{config.seo.title}</p>
          {config.seo.description && (
            <p className="text-small">{config.seo.description}</p>
          )}
        </section>
      )}

      {!versionData.published && (
        <div className="flex justify-end">
          <RestoreVersionButton portfolioId={portfolio.id} version={versionData.version} />
        </div>
      )}
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="surface-card p-4">
      <p className="text-caption">{label}</p>
      <p className="text-h3 mt-1">{value}</p>
    </div>
  );
}
