import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { CreatePortfolioForm } from "@/features/portfolio/components/create-portfolio-form";
import { requireProfile } from "@/lib/auth/require-profile";
import { portfolioService } from "@/services/portfolio/portfolio.service";
import { billingService } from "@/services/billing/billing.service";

const DISPLAY = "font-[family-name:var(--font-display,var(--font-dm))]";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const NEXT_STEPS = [
  "Add your projects, experience and skills",
  "Pick a look in the design lab",
  "Publish and share your link",
];

export default async function NewPortfolioPage() {
  const profile = await requireProfile();
  const portfolios = await portfolioService.getUserPortfolios(profile.id);
  const limit = billingService.getLimits(profile).portfolioLimit;

  if (portfolios.length >= limit) {
    return (
      <div
        className="mx-auto w-full max-w-xl space-y-6 pb-20"
        style={{ ["--font-display" as string]: "var(--font-dm), sans-serif" }}
      >
        <Link
          href="/dashboard"
          className={`text-small -ml-1 inline-flex items-center gap-2 rounded-md px-1 py-0.5 text-muted-foreground transition-colors hover:text-foreground ${FOCUS}`}
        >
          <FiArrowLeft className="size-4" aria-hidden="true" />
          Dashboard
        </Link>

        <div className="space-y-5 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.09] via-violet-500/[0.03] to-transparent p-6 sm:p-8">
          <span
            aria-hidden="true"
            className="flex size-11 items-center justify-center rounded-xl bg-violet-600 text-white"
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
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </span>

          <div className="space-y-2">
            <h1
              className={`${DISPLAY} text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.025em] text-foreground`}
            >
              Portfolio limit reached
            </h1>
            <p className="max-w-[46ch] text-base leading-7 text-foreground/70">
              Free plan allows only 1 portfolio. Upgrade to Premium to create
              more.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/pricing"
              className={`inline-flex items-center justify-center rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 ${FOCUS}`}
            >
              See plans
            </Link>
            <Link
              href="/dashboard"
              className={`inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.04] ${FOCUS}`}
            >
              Return to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto w-full max-w-5xl space-y-8 pb-20"
      style={{ ["--font-display" as string]: "var(--font-dm), sans-serif" }}
    >
      <Link
        href="/dashboard/portfolios"
        className={`text-small -ml-1 inline-flex items-center gap-2 rounded-md px-1 py-0.5 text-muted-foreground transition-colors hover:text-foreground ${FOCUS}`}
      >
        <FiArrowLeft className="size-4" aria-hidden="true" />
        Back to portfolios
      </Link>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4">
            <h1
              className={`${DISPLAY} text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl`}
            >
              Create your portfolio
            </h1>

            <p className="max-w-[44ch] text-base leading-7 text-muted-foreground">
              Give it a title and a URL. You can add projects, experience and
              the rest once it&rsquo;s created.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-small font-medium text-foreground">
              What happens next
            </p>

            <ol className="space-y-2.5">
              {NEXT_STEPS.map((step, i) => (
                <li key={step} className="flex items-center gap-3.5">
                  <span
                    aria-hidden="true"
                    className={`${DISPLAY} flex size-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-semibold text-violet-700 dark:bg-violet-400/15 dark:text-violet-300`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[15px] text-foreground/80">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-6 shadow-[0_24px_48px_-36px_rgba(0,0,0,0.3)] md:p-8">
          <CreatePortfolioForm />
        </div>
      </div>
    </div>
  );
}