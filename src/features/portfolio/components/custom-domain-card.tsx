"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
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

const STATUS: Record<string, { label: string; dot: string }> = {
  verified: { label: "Live", dot: "bg-emerald-500" },
  pending: { label: "Needs DNS setup", dot: "bg-amber-500" },
  error: { label: "Error", dot: "bg-red-500" },
  suspended: { label: "Paused", dot: "bg-muted-foreground" },
};

const btnPrimary =
  "rounded-lg bg-foreground px-4 py-2 text-small font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";
const btnGhost =
  "rounded-lg border border-border px-4 py-2 text-small font-medium text-foreground transition-colors hover:bg-foreground/[0.05] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";

function Shell({
  badge,
  children,
}: {
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-background p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Custom domain</h2>
        {badge && (
          <span className="rounded-full border border-border px-2.5 py-0.5 text-small font-medium text-muted-foreground">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
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
      <Shell badge="Premium">
        <p className="text-body text-muted-foreground">
          Use your own address, like yourname.com. Upgrade to Premium to
          connect one.
        </p>
      </Shell>
    );
  }

  /* ── No domain yet ── */
  if (!domain) {
    return (
      <Shell>
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
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50"
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
            <p className="text-small text-muted-foreground">
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="break-all font-mono text-base font-medium text-foreground">
          {domain.domain}
        </p>
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-small font-medium text-foreground">
          <span aria-hidden="true" className={`size-2 rounded-full ${st.dot}`} />
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
            className="text-small inline-flex items-center gap-2 font-medium text-foreground underline-offset-4 hover:underline"
          >
            Open site <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}

      {!isVerified && domain.statusMessage && (
        <p className="text-body text-muted-foreground">{domain.statusMessage}</p>
      )}

      {needsDns && records.length > 0 && (
        <div className="space-y-3">
          {records.map((r) => (
            <div
              key={`${r.type}-${r.host}-${r.value}`}
              className="space-y-3 rounded-xl border border-border p-4"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
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
            </div>
          ))}
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