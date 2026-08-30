import Link from "next/link";
import { notFound } from "next/navigation";

import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";

import { portfolioService } from "@/services/portfolio/portfolio.service";
import { aiRequestService } from "@/services/portfolio/ai-request.service";

import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/UI/Badge";
import type { BadgeVariant } from "@/components/UI/Badge";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{
    portfolioId: string;
  }>;
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatCost(value: number) {
  if (value === 0) return "$0";
  if (value < 0.01) return `$${value.toFixed(6)}`;
  return `$${value.toFixed(4)}`;
}

function statusVariant(status: string | null | undefined): BadgeVariant {
  switch (status) {
    case "success":
      return "success";
    case "failed":
      return "error";
    case "cancelled":
      return "warning";
    default:
      return "outline";
  }
}

function humanRequestType(type: string | null | undefined) {
  if (!type) return "AI request";
  return type.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function AiUsagePage({ params }: Props) {
  await requireUser();
  const profile = await requireProfile();
  const { portfolioId } = await params;

  const portfolio = await portfolioService.getPortfolioForUser(
    portfolioId,
    profile.id,
  );
  if (!portfolio) notFound();

  const requests = await aiRequestService.getPortfolioRequests(
    portfolioId,
    profile.id,
  );
  if (!requests) notFound();

  const totalInput = requests.reduce(
    (sum, item) => sum + Number(item.inputTokens ?? 0),
    0,
  );
  const totalOutput = requests.reduce(
    (sum, item) => sum + Number(item.outputTokens ?? 0),
    0,
  );
  const totalTokens = totalInput + totalOutput;
  const totalCost = requests.reduce(
    (sum, item) => sum + Number(item.estimatedCost ?? 0),
    0,
  );
  const successCount = requests.filter((r) => r.status === "success").length;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <Link
          href={`/dashboard/portfolios/${portfolioId}`}
          className="text-small mb-4 inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          ← {portfolio.title}
        </Link>
        <p className="text-caption text-accent">AI</p>
        <h1 className="text-h1 mt-2">AI usage</h1>
        <p className="text-body mt-1 max-w-xl text-muted-foreground">
          Requests made while improving this portfolio — models, tokens, and
          status.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Requests"
          value={requests.length}
          hint={
            requests.length > 0
              ? `${successCount} successful`
              : "No requests yet"
          }
          accent
        />
        <StatCard label="Input tokens" value={formatTokens(totalInput)} />
        <StatCard label="Output tokens" value={formatTokens(totalOutput)} />
        <StatCard
          label="Est. cost"
          value={formatCost(totalCost)}
          hint={
            totalTokens > 0
              ? `${formatTokens(totalTokens)} total tokens`
              : undefined
          }
        />
      </section>

      <section className="surface-card overflow-hidden">
        <div className="border-b border-border px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-caption text-accent">History</p>
              <h2 className="text-h3 mt-1">Request log</h2>
              <p className="text-small mt-1 text-muted-foreground">
                Newest first. Internal telemetry for this portfolio only.
              </p>
            </div>
            {requests.length > 0 && (
              <Badge variant="gradient">{requests.length} total</Badge>
            )}
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-ion-soft text-xl">
              ✦
            </span>
            <h3 className="text-h3">No AI requests yet</h3>
            <p className="text-body max-w-sm text-muted-foreground">
              Use AI assist in the portfolio editor to generate or improve
              content. Usage will appear here.
            </p>
            <Link
              href={`/dashboard/portfolios/${portfolioId}/edit`}
              className="text-small mt-2 text-primary hover:underline"
            >
              Open editor →
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-border text-caption text-subtle-foreground">
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Model</th>
                    <th className="px-4 py-3 font-medium">Tokens</th>
                    <th className="px-4 py-3 font-medium">Cost</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, i) => {
                    const tokens = Number(request.totalTokens ?? 0);
                    const cost = Number(request.estimatedCost ?? 0);
                    return (
                      <tr
                        key={request.id}
                        className={cn(
                          "border-b border-border/60 transition-colors hover:bg-surface-2/50",
                          i === requests.length - 1 && "border-b-0",
                        )}
                      >
                        <td className="px-6 py-3.5">
                          <span className="text-small font-medium text-foreground">
                            {humanRequestType(request.requestType)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-small text-muted-foreground">
                          {request.model || "—"}
                        </td>
                        <td className="px-4 py-3.5 text-small tabular-nums text-muted-foreground">
                          {formatTokens(tokens)}
                          <span className="mt-0.5 block text-caption text-subtle-foreground">
                            {Number(request.inputTokens ?? 0)} in ·{" "}
                            {Number(request.outputTokens ?? 0)} out
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-small tabular-nums text-muted-foreground">
                          {formatCost(cost)}
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={statusVariant(request.status)} dot>
                            {request.status || "unknown"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-small tabular-nums text-muted-foreground">
                          {formatWhen(request.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border lg:hidden">
              {requests.map((request) => {
                const tokens = Number(request.totalTokens ?? 0);
                const cost = Number(request.estimatedCost ?? 0);
                return (
                  <li key={request.id} className="space-y-3 px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-small font-medium text-foreground">
                          {humanRequestType(request.requestType)}
                        </p>
                        <p className="text-caption mt-0.5 text-subtle-foreground">
                          {request.model || "Unknown model"}
                        </p>
                      </div>
                      <Badge variant={statusVariant(request.status)} dot>
                        {request.status || "unknown"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-small text-muted-foreground">
                      <span>{formatTokens(tokens)} tokens</span>
                      <span>{formatCost(cost)}</span>
                      <span className="tabular-nums">
                        {formatWhen(request.createdAt)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
