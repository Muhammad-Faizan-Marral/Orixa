"use client";

import { useActionState, useState, useTransition } from "react";
import {
  addCustomDomain,
  refreshCustomDomain,
  removeCustomDomain,
  type DomainActionState,
} from "@/actions/domain/domain-actions";

type DomainRow = {
  domain: string;
  status: string;
  statusMessage: string | null;
  verifiedAt: string | null;
} | null;

type Props = {
  portfolioId: string;
  isPremium: boolean;
  domain: DomainRow;
};

const initial: DomainActionState = { success: false, message: "" };

export function CustomDomainCard({ portfolioId, isPremium, domain }: Props) {
  const [state, formAction, pending] = useActionState(addCustomDomain, initial);
  const [isPending, startTransition] = useTransition();
  const [localMsg, setLocalMsg] = useState<string | null>(null);

  function onRefresh() {
    startTransition(async () => {
      const res = await refreshCustomDomain(portfolioId);
      setLocalMsg(res.message);
    });
  }

  function onRemove() {
    if (!confirm("Remove this custom domain from the portfolio?")) return;
    startTransition(async () => {
      const res = await removeCustomDomain(portfolioId);
      setLocalMsg(res.message);
    });
  }

  if (!isPremium) {
    return (
      <div className="rounded-xl border border-border bg-surface-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Custom domain</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Use your own domain (e.g. faizan.co) for this portfolio.
            </p>
          </div>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Premium
          </span>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Upgrade to Premium to connect a custom domain.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface-1 p-5">
      <p className="text-sm font-semibold">Custom domain</p>
      <p className="mt-1 text-xs text-muted-foreground">
        One domain per portfolio. Default Orixa link always stays active.
      </p>

      {!domain ? (
        <form action={formAction} className="mt-4 space-y-3">
          <input type="hidden" name="portfolioId" value={portfolioId} />
          <input
            name="domain"
            type="text"
            required
            placeholder="faizan.co"
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {pending ? "Adding…" : "Add domain"}
          </button>
          {state.message && (
            <p
              className={`text-xs ${state.success ? "text-muted-foreground" : "text-red-500"}`}
            >
              {state.message}
            </p>
          )}
          {state.verification && state.verification.length > 0 && (
            <div className="rounded-lg border border-border bg-surface-2 p-3 text-xs">
              <p className="font-medium">DNS records (at your registrar)</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {state.verification.map((v, i) => (
                  <li key={i}>
                    <span className="font-mono text-foreground">{v.type}</span>{" "}
                    → {v.domain}: {v.value}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-muted-foreground">
                Typical wait: 15 minutes–24 hours after saving DNS.
              </p>
            </div>
          )}
        </form>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-sm">{domain.domain}</p>
            <span className="rounded-full border border-border px-2 py-0.5 text-[11px] capitalize text-muted-foreground">
              {domain.status}
            </span>
          </div>

          {domain.statusMessage && (
            <p className="text-xs text-muted-foreground">
              {domain.statusMessage}
            </p>
          )}

          {domain.status === "pending" && (
            <p className="text-xs text-muted-foreground">
              Point DNS to Vercel, then check status. Usually 15 min–24 hours.
              <br />
              Common setup: <strong>CNAME</strong> <code>www</code> →{" "}
              <code>cname.vercel-dns.com</code> (and apex per Vercel docs).
            </p>
          )}

          {domain.status === "verified" && (
            <p className="text-xs text-muted-foreground">
              Live at{" "}
              <a
                className="underline"
                href={`https://${domain.domain}`}
                target="_blank"
                rel="noreferrer"
              >
                https://{domain.domain}
              </a>
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {(domain.status === "pending" || domain.status === "error") && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isPending}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-surface-2 disabled:opacity-60"
              >
                Check status
              </button>
            )}
            <button
              type="button"
              onClick={onRemove}
              disabled={isPending}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-surface-2 disabled:opacity-60"
            >
              Remove
            </button>
          </div>

          {(localMsg || state.message) && (
            <p className="text-xs text-muted-foreground">
              {localMsg || state.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
