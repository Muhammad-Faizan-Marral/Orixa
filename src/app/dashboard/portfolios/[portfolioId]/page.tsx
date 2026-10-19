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

const DISPLAY = "font-[family-name:var(--font-display)]";

const RING =
  "conic-gradient(from 0deg, #8b5cf6 0deg, #06b6d4 55deg, #22c55e 120deg, #f59e0b 180deg, #f43f5e 240deg, #ec4899 305deg, #8b5cf6 360deg)";
const GLOW =
  "linear-gradient(90deg, #8b5cf6, #06b6d4, #22c55e, #f59e0b, #ec4899)";

const ICONS = {
  edit: "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  design:
    "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z",
  versions: "M12 7v5l3 2M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z",
  analytics: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  globe:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z",
} as const;

type Feature = {
  href: string;
  label: string;
  hint: string;
  icon: string;
  isNew: boolean;
  spin: string;
  className?: string;
};

function FeatureTile({ href, label, hint, icon, isNew, spin, className = "" }: Feature) {
  return (
    <Link
      href={href}
      className={`group relative isolate block rounded-2xl transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${className}`}
    >
      {/* Soft glow on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 -z-20 rounded-3xl opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-25"
        style={{ background: GLOW }}
      />

      {/* Rotating rainbow ring (clipped, never touches content) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 grid place-items-center overflow-hidden rounded-2xl opacity-80 transition-opacity duration-300 group-hover:opacity-100"
      >
        <span
          className={`block aspect-square w-[220%] ${spin}`}
          style={{ background: RING, willChange: "transform" }}
        />
      </span>

      {/* Solid, high-contrast surface */}
      <span className="relative m-[1.5px] flex h-[calc(100%-3px)] flex-col gap-4 rounded-[14px] bg-background p-4 transition-colors duration-300 group-hover:bg-foreground/[0.03]">
        <span className="flex items-start justify-between">
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-xl bg-foreground/[0.07] text-foreground"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={icon} />
            </svg>
          </span>

          {isNew && (
            <span className="rounded-full bg-violet-600 px-2 py-1 text-[11px] font-semibold leading-none text-white">
              New
            </span>
          )}
        </span>

        <span className="block">
          <span className="block text-base font-semibold leading-tight text-foreground">
            {label}
          </span>
          <span className="text-small mt-1 block text-muted-foreground">
            {hint}
          </span>
        </span>
      </span>
    </Link>
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

  /* DNS records (live from Vercel) only while the domain still needs setup */
  const dnsRecords =
    domainRow &&
    domainRow.status !== "verified" &&
    domainRow.status !== "suspended"
      ? await domainService.getDnsRecords(domainRow.domain)
      : [];

  const domainHint = !domainRow
    ? "Use your own URL"
    : domainRow.status === "verified"
      ? "Live"
      : domainRow.status === "suspended"
        ? "Paused"
        : "Finish setup";

  const id = portfolio.id;
  const features: Feature[] = [
    {
      href: `/dashboard/portfolios/${id}/edit`,
      label: "Edit",
      hint: "Update your content",
      icon: ICONS.edit,
      isNew: false,
      spin: "animate-[spin_7s_linear_infinite] motion-reduce:animate-none",
    },
    {
      href: `/dashboard/portfolios/${id}/design-lab`,
      label: "Design lab",
      hint: "Change the look",
      icon: ICONS.design,
      isNew: true,
      spin: "animate-[spin_8.5s_linear_infinite_reverse] motion-reduce:animate-none",
    },
    {
      href: `/dashboard/portfolios/${id}/versions`,
      label: "Versions",
      hint: "Restore past saves",
      icon: ICONS.versions,
      isNew: false,
      spin: "animate-[spin_6.5s_linear_infinite] motion-reduce:animate-none",
    },
    {
      href: `/dashboard/portfolios/${id}/analytics`,
      label: "Analytics",
      hint: "See your visitors",
      icon: ICONS.analytics,
      isNew: false,
      spin: "animate-[spin_9s_linear_infinite_reverse] motion-reduce:animate-none",
    },
    {
      href: "#domain",
      label: "Custom domain",
      hint: domainHint,
      icon: ICONS.globe,
      isNew: true,
      spin: "animate-[spin_7.5s_linear_infinite] motion-reduce:animate-none",
      className: "col-span-2 lg:col-span-1",
    },
  ];

  return (
    <PortfolioPublishingProvider>
      <div
        className="mx-auto w-full max-w-6xl space-y-10 pb-20"
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

        {/* ── Header ── */}
        <header className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-10">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Badge variant={STATUS_VARIANT[status]} dot>
                {status}
              </Badge>

              <span className="text-small text-muted-foreground">
                v{portfolio.currentVersion}
              </span>

              {portfolio.publishedAt && (
                <span className="text-small text-muted-foreground">
                  Published <FormatDate value={portfolio.publishedAt} />
                </span>
              )}
            </div>

            <h1
              className={`${DISPLAY} text-balance break-words text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl`}
            >
              {portfolio.title}
            </h1>
          </div>

          <div className="flex w-full flex-col gap-2.5">
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

        {/* ── Main features ── */}
        <nav
          aria-label="Portfolio features"
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5"
        >
          {features.map((f) => (
            <FeatureTile key={f.label} {...f} />
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

        {/* ── Public link ── */}
        <PublicLinkCard
          username={profile.username}
          portfolioSlug={portfolio.slug}
          isPublished={isPublished}
        />

        {/* ── Custom domain ── */}
        <div id="domain" className="scroll-mt-24">
          <CustomDomainCard
            portfolioId={portfolioId}
            isPremium={premiumActive}
            isPublished={isPublished}
            records={dnsRecords}
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

        {/* ── Preview ── */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Preview</h2>

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
                className={`${DISPLAY} max-w-xl text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl`}
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
        </section>

        <PortfolioViewTracker portfolioId={portfolio.id} />
      </div>
    </PortfolioPublishingProvider>
  );
}