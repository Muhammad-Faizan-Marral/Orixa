import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

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
import { FormatDate } from "@/components/format-date";
import { PortfolioTour } from "@/features/portfolio/components/portfolio-tour";
import { CustomDomainCard } from "@/features/portfolio/components/custom-domain-card";

import { domainService } from "@/services/domain/domain.service";
import { isPremiumActive } from "@/constants/billing";
import { CopyField } from "@/features/portfolio/components/copy-field";

type PortfolioPageProps = {
  params: Promise<{ portfolioId: string }>;
};

const STATUS_VARIANT = {
  published: "success",
  draft: "outline",
  archived: "warning",
} as const;

const DISPLAY = "font-[family-name:var(--font-display)]";

const BUILD_LINKS = (portfolioId: string) => [
  {
    href: `/dashboard/portfolios/${portfolioId}/edit`,
    label: "Edit content",
    hint: "Headline, about and projects",
    isNew: false,
  },
  {
    href: `/dashboard/portfolios/${portfolioId}/design-lab`,
    label: "Design lab",
    hint: "Layouts, fonts and colors",
    isNew: true,
  },
  {
    href: `/dashboard/portfolios/${portfolioId}/versions`,
    label: "Versions",
    hint: "Compare and restore saves",
    isNew: false,
  },
];

type StepProps = {
  index: number;
  title: string;
  description: string;
  state?: "done" | "next" | null;
  children: ReactNode;
};

function Step({ index, title, description, state, children }: StepProps) {
  return (
    <section className="grid gap-8 border-t border-border py-14 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
      <header className="space-y-3 lg:sticky lg:top-8 lg:self-start">
        <p className={`${DISPLAY} text-sm tabular-nums text-muted-foreground`}>
          {String(index).padStart(2, "0")}
        </p>

        <h2
          className={`${DISPLAY} text-2xl font-semibold tracking-tight text-foreground`}
        >
          {title}
        </h2>

        <p className="text-small leading-6 text-muted-foreground">
          {description}
        </p>

        {state && (
          <p className="inline-flex items-center gap-2 pt-1 text-small font-medium text-foreground">
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${
                state === "done" ? "bg-emerald-500" : "bg-primary"
              }`}
            />
            {state === "done" ? "Complete" : "Up next"}
          </p>
        )}
      </header>

      <div className="min-w-0">{children}</div>
    </section>
  );
}

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
  const isPublished = status === "published";

  const currentVersion =
    versions.find((v) => v.version === portfolio.currentVersion) ?? null;

  const hasSavedVersion = Boolean(currentVersion);
  const hasUnpublishedChanges = Boolean(
    currentVersion && !currentVersion.published,
  );

  /* Flow progress: build → publish → share → domain → track */
  const totalViews = lightStats?.total ?? 0;
  const done = [
    hasSavedVersion,
    isPublished && !hasUnpublishedChanges,
    isPublished,
    Boolean(domainRow?.verifiedAt),
    totalViews > 0,
  ];
  const nextIndex = done.indexOf(false);
  const stateOf = (i: number) =>
    done[i] ? "done" : i === nextIndex ? "next" : null;

  const stats = [
    { label: "Total views", value: totalViews },
    { label: "Last 7 days", value: lightStats?.last7Days ?? 0 },
    { label: "Projects", value: data?.projects?.length ?? 0 },
    { label: "Version", value: `v${portfolio.currentVersion}` },
  ];

  return (
    <PortfolioPublishingProvider>
      <div
        className="mx-auto w-full max-w-5xl pb-24"
        style={{ ["--font-display" as string]: "var(--font-dm), sans-serif" }}
      >
        {/* ── Back ── */}
        <Link
          href="/dashboard/portfolios"
          className="text-small inline-flex items-center gap-2 rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <span aria-hidden="true">←</span>
          All portfolios
        </Link>

        {/* ── Hero ── */}
        <header className="space-y-6 pb-16 pt-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Badge variant={STATUS_VARIANT[status]} dot>
              {status}
            </Badge>

            <span className="text-small text-muted-foreground">
              Version {portfolio.currentVersion}
            </span>

            {portfolio.publishedAt && (
              <span className="text-small text-muted-foreground">
                Published <FormatDate value={portfolio.publishedAt} />
              </span>
            )}
          </div>

          <h1
            className={`${DISPLAY} text-balance break-words text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl`}
          >
            {portfolio.title}
          </h1>
        </header>

        <PortfolioTour />

        {/* ── 01 Build ── */}
        <Step
          index={1}
          title="Build"
          description="Shape what visitors will see. Every save creates a version you can return to."
          state={stateOf(0)}
        >
          <div className="space-y-8">
            {/* Preview */}
            <div className="overflow-hidden rounded-2xl border border-border">
              <div className="flex items-center gap-4 border-b border-border bg-foreground/[0.03] px-4 py-3">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-foreground/15" />
                  <span className="size-2.5 rounded-full bg-foreground/15" />
                  <span className="size-2.5 rounded-full bg-foreground/15" />
                </div>

                <p className="min-w-0 flex-1 truncate text-center font-mono text-xs text-muted-foreground">
                  orixaAi / {profile.username} / {portfolio.slug}
                </p>

                <span className="hidden w-12 sm:block" aria-hidden="true" />
              </div>

              <div className="space-y-4 px-6 py-10 sm:px-10 sm:py-12">
                <h3
                  className={`${DISPLAY} max-w-xl text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground`}
                >
                  {data?.headline || (
                    <span className="font-normal text-muted-foreground">
                      No headline yet
                    </span>
                  )}
                </h3>

                <p className="max-w-prose whitespace-pre-line text-base leading-7 text-foreground/75">
                  {data?.about || (
                    <span className="text-muted-foreground">
                      Write your About section in the editor and it will appear
                      here.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Links */}
            <ul className="divide-y divide-border border-y border-border">
              {BUILD_LINKS(portfolio.id).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between gap-4 py-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-medium text-foreground">
                        {link.label}
                      </span>

                      {link.isNew && (
                        <span className="text-small font-medium text-primary">
                          New
                        </span>
                      )}

                      <span className="text-small hidden text-muted-foreground sm:inline">
                        {link.hint}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Step>

        {/* ── 02 Publish ── */}
        <Step
          index={2}
          title="Publish"
          description="Make your latest version public, or take it offline at any time."
          state={stateOf(1)}
        >
          <div className="flex max-w-md flex-col gap-4">
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
        </Step>

        {/* ── 03 Share ── */}
        <Step
          index={3}
          title="Share"
          description="Send this link to recruiters, clients or add it to your profiles."
          state={stateOf(2)}
        >
          <PublicLinkCard
            username={profile.username}
            portfolioSlug={portfolio.slug}
            isPublished={isPublished}
          />
        </Step>

        {/* ── 04 Domain ── */}
        <Step
          index={4}
          title="Custom domain"
          description="Serve your portfolio from your own address."
          state={stateOf(3)}
        >
          <div className="space-y-6">
            {domainRow && (
              <div className="grid gap-4 sm:grid-cols-2">
                <CopyField label="Domain" value={domainRow.domain} />
                <CopyField
                  label="Live URL"
                  value={`https://${domainRow.domain}`}
                />
              </div>
            )}

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
          </div>
        </Step>

        {/* ── 05 Track ── */}
        <Step
          index={5}
          title="Track"
          description="See how many people are viewing your portfolio."
          state={stateOf(4)}
        >
          <div className="space-y-8">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-0 sm:divide-x sm:divide-border">
              {stats.map((s) => (
                <div key={s.label} className="sm:px-6 sm:first:pl-0">
                  <dt className="text-small text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd
                    className={`${DISPLAY} mt-2 text-4xl font-semibold tabular-nums tracking-tight text-foreground`}
                  >
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              href={`/dashboard/portfolios/${portfolio.id}/analytics`}
              className="text-small inline-flex items-center gap-2 font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              Open full analytics
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Step>

        <PortfolioViewTracker portfolioId={portfolio.id} />
      </div>
    </PortfolioPublishingProvider>
  );
}