import Link from "next/link";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import { BILLING } from "@/constants/billing";

export const metadata = {
  title: "Pricing · OrixaAi",
  description:
    "Simple pricing for students, developers and creators. Start free, upgrade when you need more.",
};

const FREE_FEATURES = [
  "1 portfolio",
  "Full analytics",
  "Design Lab (free sections)",
  "Public share link",
  `"${BILLING.WATERMARK_TEXT}" watermark`,
];

const PREMIUM_FEATURES = [
  "Up to 20 portfolios",
  "Full analytics",
  "All premium designs unlocked",
  "Remove OrixaAi watermark",
  "Premium profile UI",
  "Priority AI features",
  "Referral program access",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium text-accent">Pricing</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple pricing for serious portfolios
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Start free. Upgrade when you need more portfolios, premium designs,
            and a clean professional look without the watermark.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {/* Free */}
          <div className="rounded-2xl border border-border bg-surface-1 p-8 shadow-sm">
            <h2 className="text-lg font-semibold">Free</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Perfect for students & first portfolio
            </p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/ forever</span>
            </div>

            <ul className="mt-8 space-y-3 text-sm">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 text-accent">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className="mt-8 flex w-full items-center justify-center rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium transition hover:bg-surface-3"
            >
              Get started free
            </Link>
          </div>

          {/* Premium */}
          <div className="relative rounded-2xl border-2 border-accent bg-surface-1 p-8 shadow-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-accent-foreground">
              Most popular
            </div>

            <h2 className="text-lg font-semibold">Premium</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              For developers who want to stand out
            </p>

            <div className="mt-6 space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-muted-foreground">/ year</span>
              </div>
              <p className="text-sm text-muted-foreground">or $7.99 / month</p>
            </div>

            <ul className="mt-8 space-y-3 text-sm">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 text-accent">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3">
              <UpgradeButton productKey="yearly" className="w-full">
                Get Premium – $49/year
              </UpgradeButton>
              <UpgradeButton
                productKey="monthly"
                variant="outline"
                className="w-full"
              >
                Monthly – $7.99
              </UpgradeButton>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-border bg-surface-2/50 p-6 text-center">
          <p className="text-sm font-medium">
            Don’t want to pay? Refer 20 friends
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your referral link. When 20 people create an account and
            publish a portfolio using your link, you unlock Premium free for 1
            year.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
          >
            Go to dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
