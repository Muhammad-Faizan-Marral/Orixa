import Link from "next/link";
import { notFound } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { portfolioViewService } from "@/services/portfolio/portfolio-view.service";
import { PublicLinkCard } from "@/features/portfolio/components/public-link-card";
import { PortfolioLifecycleActions } from "@/features/portfolio/components/portfolio-lifecycle-actions";
import { PortfolioPublishingProvider } from "@/features/portfolio/components/portfolio-publishing-context";
import { LifecycleGuide } from "@/features/portfolio/components/lifecycle-guide";
import { PortfolioViewTracker } from "@/features/portfolio/components/portfolio-view-tracker";
import { Badge } from "@/components/UI/Badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { FormatDate } from "@/components/format-date";
import { PortfolioTour } from "@/features/portfolio/components/portfolio-tour";

type PortfolioPageProps = {
  params: Promise<{ portfolioId: string }>;
};

const STATUS_VARIANT = {
  published: "success",
  draft: "outline",
  archived: "warning",
} as const;

const NAV_LINKS = (portfolioId: string) => [
  {
    href: `/dashboard/portfolios/${portfolioId}/edit`,
    label: "Edit",
    isNew: false,
    animation: "animate-[spin_7s_linear_infinite] motion-reduce:animate-none",
  },
  {
    href: `/dashboard/portfolios/${portfolioId}/design-lab`,
    label: "Design lab",
    isNew: true,
    animation:
      "animate-[spin_8.5s_linear_infinite_reverse] motion-reduce:animate-none",
  },
  {
    href: `/dashboard/portfolios/${portfolioId}/versions`,
    label: "Versions",
    isNew: false,
    animation: "animate-[spin_6.5s_linear_infinite] motion-reduce:animate-none",
  },
  {
    href: `/dashboard/portfolios/${portfolioId}/analytics`,
    label: "Analytics",
    isNew: false,
    animation:
      "animate-[spin_9s_linear_infinite_reverse] motion-reduce:animate-none",
  },
];

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  await requireUser();

  const profile = await requireProfile();
  const { portfolioId } = await params;

  const [result, versions] = await Promise.all([
    portfolioService.getPortfolioWithData(portfolioId, profile.id),
    portfolioService.getPortfolioVersions(portfolioId, profile.id),
  ]);

  if (!result) {
    notFound();
  }

  const lightStats =
    await portfolioViewService.getLightStatsTrusted(portfolioId);

  const { portfolio, data } = result;

  const status = portfolio.status as "draft" | "published" | "archived";

  const currentVersion =
    versions.find((v) => v.version === portfolio.currentVersion) ?? null;

  const hasSavedVersion = Boolean(currentVersion);

  const hasUnpublishedChanges = Boolean(
    currentVersion && !currentVersion.published,
  );

  return (
    <PortfolioPublishingProvider>
      <div className="space-y-10" style={{ ["--font-display" as string]: "var(--font-dm), sans-serif" }}>
        {/* ── Back link ── */}
        <Link
          href="/dashboard/portfolios"
          className="text-small inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span>
          Portfolios
        </Link>

        {/* ── Header ── */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-h1 leading-none">{portfolio.title}</h1>

              <Badge variant={STATUS_VARIANT[status]} dot>
                {status}
              </Badge>
            </div>

            {/* Quiet meta line */}
            <p className="font-mono text-xs tracking-wide text-muted-foreground/60">
              orixaAi / {profile.username} / {portfolio.slug}
            </p>

            {portfolio.publishedAt && (
              <p className="text-small text-muted-foreground">
                Published <FormatDate value={portfolio.publishedAt} />
              </p>
            )}
          </div>

          {/* Actions column */}
          <div className="flex w-full flex-col gap-2.5 sm:max-w-xs">
            <LifecycleGuide
              status={status}
              hasSavedVersion={hasSavedVersion}
              hasUnpublishedChanges={hasUnpublishedChanges}
            />

            <PortfolioLifecycleActions
              portfolioId={portfolio.id}
              status={status}
              hasSavedVersion={hasSavedVersion}
              hasUnpublishedChanges={hasUnpublishedChanges}
            />
          </div>
        </div>

        <PortfolioTour />

        {/* ── Navigation ── */}
        <nav
          className="flex flex-wrap gap-2 border-b border-border/50 pb-5"
          aria-label="Portfolio sections"
        >
          {NAV_LINKS(portfolio.id).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative isolate inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-small font-medium text-muted-foreground transition-all duration-300 hover:-translate-y-px hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              {/* 
                Rotating ring container.
                The overflow is isolated here so the animated layer
                never affects the button content itself.
              */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-[1.5px] -z-10 overflow-hidden rounded-full"
              >
                {/* Rotating multicolor ring */}
                <span
                  className={`absolute inset-[-115%] origin-center ${link.animation}`}
                  style={{
                    background:
                      "conic-gradient(from 0deg, #8b5cf6 0deg, #06b6d4 55deg, #22c55e 120deg, #f59e0b 180deg, #f43f5e 240deg, #ec4899 305deg, #8b5cf6 360deg)",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                />
              </span>

              {/* Stable inner surface */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[1.5px] -z-[1] rounded-full bg-background/95 backdrop-blur-md transition-colors duration-300 group-hover:bg-background/90"
              />

              {/* Soft premium glow on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1 -z-20 rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-20"
                style={{
                  background:
                    "linear-gradient(90deg, #8b5cf6, #06b6d4, #22c55e, #f59e0b, #ec4899)",
                }}
              />

              {/* Content stays completely static */}
              <span className="relative z-10 flex items-center gap-1.5">
                <span>{link.label}</span>

                {link.isNew && (
                  <span className="rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-fuchsia-500 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-[0_0_14px_rgba(139,92,246,0.25)]">
                    New Feature
                  </span>
                )}
              </span>
            </Link>
          ))}
        </nav>

        {/* ── Public link ── */}
        <PublicLinkCard
          username={profile.username}
          portfolioSlug={portfolio.slug}
          isPublished={status === "published"}
        />

        {/* ── Stats ── */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total views" value={lightStats?.total ?? 0} accent />

          <StatCard label="Last 7 days" value={lightStats?.last7Days ?? 0} />

          {/* 
          <StatCard
            label="Last 30 days"
            value={lightStats?.last30Days ?? 0}
          />
          */}

          <StatCard label="Version" value={`v${portfolio.currentVersion}`} />

          <StatCard label="Projects" value={data?.projects?.length ?? 0} />
        </section>

        {/* ── Content preview ── */}
        <section className="surface-card overflow-hidden rounded-xl border border-border/60">
          {/* Card header stripe */}
          <div className="border-b border-border/50 px-6 py-3">
            <p className="text-small font-medium text-muted-foreground">
              Preview
            </p>
          </div>

          <div className="space-y-3 p-6">
            <h2 className="text-h3 leading-snug">
              {data?.headline || (
                <span className="text-muted-foreground/50 italic">
                  No headline yet
                </span>
              )}
            </h2>

            <p className="text-body max-w-prose leading-relaxed text-muted-foreground">
              {data?.about || (
                <span className="text-muted-foreground/40 italic">
                  Add an About section from the editor.
                </span>
              )}
            </p>
          </div>
        </section>

        <PortfolioViewTracker portfolioId={portfolio.id} />
      </div>
    </PortfolioPublishingProvider>
  );
}
