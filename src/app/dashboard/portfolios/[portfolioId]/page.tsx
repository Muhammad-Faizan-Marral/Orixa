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
import { CustomDomainCard } from "@/features/portfolio/components/custom-domain-card";
import { domainService } from "@/services/domain/domain.service";
import { isPremiumActive } from "@/constants/billing";

type PortfolioPageProps = {
  params: Promise<{ portfolioId: string }>;
};

const STATUS_VARIANT = {
  published: "success",
  draft: "outline",
  archived: "warning",
} as const;

/* Simple stroke icons (no extra dependency) */
const ICONS = {
  edit: "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  design:
    "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z",
  versions: "M12 7v5l3 2M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z",
  analytics: "M4 20V10M10 20V4M16 20v-7M22 20H2",
} as const;

const NAV_LINKS = (portfolioId: string) => [
  {
    href: `/dashboard/portfolios/${portfolioId}/edit`,
    label: "Edit",
    icon: ICONS.edit,
    isNew: false,
  },
  {
    href: `/dashboard/portfolios/${portfolioId}/design-lab`,
    label: "Design lab",
    icon: ICONS.design,
    isNew: true,
  },
  {
    href: `/dashboard/portfolios/${portfolioId}/versions`,
    label: "Versions",
    icon: ICONS.versions,
    isNew: false,
  },
  {
    href: `/dashboard/portfolios/${portfolioId}/analytics`,
    label: "Analytics",
    icon: ICONS.analytics,
    isNew: false,
  },
];

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  await requireUser();

  const profile = await requireProfile();
  const { portfolioId } = await params;

  const [result, versions, domainRow] = await Promise.all([
    portfolioService.getPortfolioWithData(portfolioId, profile.id),
    portfolioService.getPortfolioVersions(portfolioId, profile.id),
    domainService.getForPortfolio(portfolioId, profile.id),
  ]);

  if (!result) {
    notFound();
  }

  const premiumActive = isPremiumActive({
    isPremium: profile.isPremium ?? false,
    premiumUntil: profile.premiumUntil ?? null,
  });

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
      <div
        className="mx-auto w-full max-w-6xl space-y-12"
        style={{ ["--font-display" as string]: "var(--font-dm), sans-serif" }}
      >
        {/* ── Back link ── */}
        <Link
          href="/dashboard/portfolios"
          className="text-small inline-flex items-center gap-2 rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <span aria-hidden="true">←</span>
          All portfolios
        </Link>

        {/* ── Header ── */}
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-12">
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Badge variant={STATUS_VARIANT[status]} dot>
                {status}
              </Badge>

              {portfolio.publishedAt && (
                <p className="text-small text-muted-foreground">
                  Published <FormatDate value={portfolio.publishedAt} />
                </p>
              )}
            </div>

            <h1 className="text-h1 break-words font-[family-name:var(--font-display)] font-semibold leading-[1.05] tracking-tight text-foreground">
              {portfolio.title}
            </h1>
          </div>

          <div className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-foreground/[0.03] p-4">
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
        </header>

        <PortfolioTour />

        {/* ── Navigation ── */}
        <nav
          className="grid grid-cols-2 gap-3 lg:grid-cols-4"
          aria-label="Portfolio sections"
        >
          {NAV_LINKS(portfolio.id).map((link) => (
            <div
              key={link.href}
              className={
                link.isNew
                  ? "group rounded-xl bg-gradient-to-r from-violet-500 via-cyan-400 to-fuchsia-500 p-px"
                  : "group rounded-xl bg-border p-px transition-colors duration-200 hover:bg-primary/50"
              }
            >
              <Link
                href={link.href}
                className="flex items-center gap-3 rounded-[11px] bg-background px-4 py-3.5 text-foreground transition-colors duration-200 hover:bg-foreground/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06] text-foreground"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-[18px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={link.icon} />
                  </svg>
                </span>

                <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                  <span className="text-small font-semibold leading-tight">
                    {link.label}
                  </span>

                  {link.isNew && (
                    <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[11px] font-medium leading-none text-white">
                      New
                    </span>
                  )}
                </span>

                <span
                  aria-hidden="true"
                  className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground"
                >
                  →
                </span>
              </Link>
            </div>
          ))}
        </nav>

        {/* ── Stats ── */}
        <section
          aria-label="Portfolio stats"
          className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          <StatCard label="Total views" value={lightStats?.total ?? 0} accent />
          <StatCard label="Last 7 days" value={lightStats?.last7Days ?? 0} />
          <StatCard label="Version" value={`v${portfolio.currentVersion}`} />
          <StatCard label="Projects" value={data?.projects?.length ?? 0} />
        </section>

        {/* ── Share & domain ── */}
        <section
          aria-label="Sharing"
          className="grid items-start gap-4 lg:grid-cols-2"
        >
          <PublicLinkCard
            username={profile.username}
            portfolioSlug={portfolio.slug}
            isPublished={status === "published"}
          />

          <CustomDomainCard
            portfolioId={portfolioId}
            isPremium={premiumActive}
            domain={
              domainRow
                ? {
                    domain: domainRow.domain,
                    status: domainRow.status,
                    statusMessage: domainRow.statusMessage,
                    verifiedAt: domainRow.verifiedAt,
                  }
                : null
            }
          />
        </section>

        {/* ── Preview (browser frame) ── */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Preview</h2>

          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)]">
            {/* Address bar */}
            <div className="flex items-center gap-4 border-b border-border bg-foreground/[0.04] px-4 py-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-foreground/20" />
                <span className="size-2.5 rounded-full bg-foreground/20" />
                <span className="size-2.5 rounded-full bg-foreground/20" />
              </div>

              <p className="min-w-0 flex-1 truncate rounded-md bg-background px-3 py-1 text-center font-mono text-xs text-foreground/70">
                orixaAi / {profile.username} / {portfolio.slug}
              </p>

              <span className="hidden w-12 sm:block" aria-hidden="true" />
            </div>

            {/* Page content */}
            <div className="space-y-5 px-6 py-10 sm:px-12 sm:py-14">
              <span
                aria-hidden="true"
                className="block h-1 w-14 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
              />

              <h3 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                {data?.headline || (
                  <span className="font-normal text-muted-foreground">
                    No headline yet. Add one from the editor.
                  </span>
                )}
              </h3>

              <p className="max-w-prose whitespace-pre-line text-base leading-7 text-foreground/75">
                {data?.about || (
                  <span className="text-muted-foreground">
                    Your About section will show here once you write it in the
                    editor.
                  </span>
                )}
              </p>
            </div>
          </div>
        </section>

        <PortfolioViewTracker portfolioId={portfolio.id} />
      </div>
    </PortfolioPublishingProvider>
  );
}
