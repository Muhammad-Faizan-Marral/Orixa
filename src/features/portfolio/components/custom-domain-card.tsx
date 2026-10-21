"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  addCustomDomain,
  refreshCustomDomain,
  removeCustomDomain,
  type DomainActionState,
} from "@/actions/domain/domain-actions";
import type { DnsRecord } from "@/lib/vercel-domains";
import { CopyField } from "@/features/portfolio/components/copy-field";

type DomainRow = {
  domain: string;
  status: string;
  statusMessage: string | null;
  verifiedAt: string | null;
} | null;

type Props = {
  portfolioId: string;
  isPremium: boolean;
  isPublished?: boolean;
  domain: DomainRow;
  records?: DnsRecord[];
};

const initial: DomainActionState = { success: false, message: "" };

const DISPLAY = "font-[family-name:var(--font-display,var(--font-dm))]";

const STATUS: Record<string, { label: string; dot: string; pill: string }> = {
  verified: {
    label: "Live",
    dot: "bg-emerald-500",
    pill: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  pending: {
    label: "Needs DNS setup",
    dot: "bg-amber-500",
    pill: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  error: {
    label: "Error",
    dot: "bg-red-500",
    pill: "bg-red-500/10 text-red-700 dark:text-red-300",
  },
  suspended: {
    label: "Paused",
    dot: "bg-foreground/40",
    pill: "bg-foreground/[0.06] text-muted-foreground",
  },
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const btnPrimary = `inline-flex items-center justify-center rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS}`;
const btnGhost = `inline-flex items-center justify-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.05] disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS}`;

function Shell({
  badge,
  hint,
  children,
}: {
  badge?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6 rounded-2xl border border-border bg-background p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white"
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
              <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
            </svg>
          </span>

          <div>
            <h2
              className={`${DISPLAY} text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground`}
            >
              Custom domain
            </h2>
            {hint && (
              <p className="text-small mt-0.5 text-muted-foreground">{hint}</p>
            )}
          </div>
        </div>

        {badge && (
          <span className="shrink-0 rounded-full bg-violet-600/10 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-400/15 dark:text-violet-300">
            {badge}
          </span>
        )}
      </div>

      {children}
    </section>
  );
}

export function CustomDomainCard({
  portfolioId,
  isPremium,
  isPublished = true,
  domain,
  records = [],
}: Props) {
  const router = useRouter();
  const [state, formAction, adding] = useActionState(addCustomDomain, initial);
  const [busy, startTransition] = useTransition();
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (state.success) router.refresh();
  }, [state.success, router]);

  function onCheck() {
    setNote(null);
    startTransition(async () => {
      const res = await refreshCustomDomain(portfolioId);
      setNote(res.message || null);
      router.refresh();
    });
  }

  function onRemove() {
    if (!confirm("Remove this custom domain from the portfolio?")) return;
    startTransition(async () => {
      const res = await removeCustomDomain(portfolioId);
      setNote(res.message || null);
      router.refresh();
    });
  }

  /* ── Locked ── */
  if (!isPremium) {
    return (
      <Shell badge="Premium" hint="Use your own address">
        <div className="flex flex-col gap-4 rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.08] via-violet-500/[0.03] to-transparent p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <p className="max-w-[48ch] text-[15px] leading-6 text-foreground/75">
            Use your own address, like{" "}
            <span className="font-mono text-foreground">yourname.com</span>.
            Upgrade to Premium to connect one.
          </p>

          <Link
            href="/pricing"
            className={`shrink-0 ${btnPrimary}`}
          >
            See plans
          </Link>
        </div>
      </Shell>
    );
  }

  /* ── No domain yet ── */
  if (!domain) {
    return (
      <Shell hint="Connect a domain you already own">
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="portfolioId" value={portfolioId} />

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              name="domain"
              type="text"
              required
              disabled={!isPublished}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="portfolio.yourname.com"
              aria-label="Your domain"
              className="min-w-0 flex-1 rounded-xl border border-border bg-foreground/[0.02] px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-violet-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={adding || !isPublished}
              className={btnPrimary}
            >
              {adding ? "Adding…" : "Add domain"}
            </button>
          </div>

          {!isPublished && (
            <p className="text-small flex items-center gap-2 text-muted-foreground">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-amber-500"
              />
              Publish your portfolio first.
            </p>
          )}

          {state.message && (
            <p
              role="status"
              className={`text-small ${
                state.success
                  ? "text-muted-foreground"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {state.message}
            </p>
          )}
        </form>
      </Shell>
    );
  }

  /* ── Domain attached ── */
  const isVerified = domain.status === "verified";
  const needsDns = domain.status === "pending" || domain.status === "error";
  const st = STATUS[domain.status] ?? STATUS.pending;

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-foreground/[0.03] px-4 py-3.5">
        <p className="break-all font-mono text-base font-medium text-foreground">
          {domain.domain}
        </p>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${st.pill}`}
        >
          <span aria-hidden="true" className={`size-1.5 rounded-full ${st.dot}`} />
          {st.label}
        </span>
      </div>

      {isVerified && (
        <div className="space-y-3">
          <CopyField label="Live URL" value={`https://${domain.domain}`} />
          <a
            href={`https://${domain.domain}`}
            target="_blank"
            rel="noreferrer"
            className={`text-small inline-flex items-center gap-1.5 rounded-md font-medium text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground ${FOCUS}`}
          >
            Open site
            <svg
              viewBox="0 0 24 24"
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 4h6v6M20 4l-9 9" />
            </svg>
          </a>
        </div>
      )}

      {!isVerified && domain.statusMessage && (
        <p className="text-[15px] leading-6 text-muted-foreground">
          {domain.statusMessage}
        </p>
      )}

      {needsDns && records.length > 0 && (
        <div className="space-y-3">
          <p className="text-small font-medium text-foreground">
            Add {records.length === 1 ? "this record" : "these records"} at your
            DNS provider
          </p>

          <ol className="space-y-3">
            {records.map((r, i) => (
              <li
                key={`${r.type}-${r.host}-${r.value}`}
                className="space-y-4 rounded-xl border border-border p-4"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span
                    aria-hidden="true"
                    className={`${DISPLAY} flex size-6 items-center justify-center rounded-md bg-violet-500/10 text-xs font-semibold text-violet-700 dark:bg-violet-400/15 dark:text-violet-300`}
                  >
                    {i + 1}
                  </span>
                  <span className="rounded-md bg-foreground px-2 py-0.5 font-mono text-xs font-semibold text-background">
                    {r.type}
                  </span>
                  <span className="text-small text-muted-foreground">
                    {r.purpose === "ownership"
                      ? "Proves you own the domain"
                      : "Points the domain to Orixa"}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
                  <CopyField label="Host" value={r.host} />
                  <CopyField label="Value" value={r.value} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {needsDns && (
          <button
            type="button"
            onClick={onCheck}
            disabled={busy}
            className={btnPrimary}
          >
            {busy ? "Checking…" : "Check status"}
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          disabled={busy}
          className={`${btnGhost} text-red-600 dark:text-red-400`}
        >
          Remove
        </button>
      </div>

      {note && (
        <p role="status" className="text-small text-muted-foreground">
          {note}
        </p>
      )}
    </Shell>
  );
}