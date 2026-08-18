"use client";

import { useState, useTransition } from "react";

import { publishPortfolio } from "@/actions/portfolio/publish-portfolio";
import { unpublishPortfolio } from "@/actions/portfolio/unpublish-portfolio";
import { archivePortfolio } from "@/actions/portfolio/archive-portfolio";
import { restorePortfolio } from "@/actions/portfolio/restore-portfolio";

type PortfolioStatus = "draft" | "published" | "archived";

type PortfolioLifecycleActionsProps = {
  portfolioId: string;
  status: PortfolioStatus;
};

export function PortfolioLifecycleActions({
  portfolioId,
  status,
}: PortfolioLifecycleActionsProps) {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);

  const runAction = (
    action: () => Promise<{
      success: boolean;
      message?: string;
    }>,
  ) => {
    setError(null);

    startTransition(async () => {
      const result = await action();

      if (!result.success) {
        setError(result.message ?? "Something went wrong.");

        return;
      }

      window.location.reload();
    });
  };

  const handlePublish = () => {
    runAction(() => publishPortfolio(portfolioId));
  };

  const handleUnpublish = () => {
    runAction(() => unpublishPortfolio(portfolioId));
  };

  const handleArchive = () => {
    const confirmed = window.confirm(
      "Are you sure you want to archive this portfolio?",
    );

    if (!confirmed) {
      return;
    }

    runAction(() => archivePortfolio(portfolioId));
  };

  const handleRestore = () => {
    runAction(() => restorePortfolio(portfolioId));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {status === "draft" && (
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPending}
            className="rounded border px-4 py-2"
          >
            {isPending ? "Publishing..." : "Publish"}
          </button>
        )}

        {status === "published" && (
          <button
            type="button"
            onClick={handleUnpublish}
            disabled={isPending}
            className="rounded border px-4 py-2"
          >
            {isPending ? "Unpublishing..." : "Unpublish"}
          </button>
        )}

        {status !== "archived" && (
          <button
            type="button"
            onClick={handleArchive}
            disabled={isPending}
            className="rounded border px-4 py-2"
          >
            {isPending ? "Archiving..." : "Archive"}
          </button>
        )}

        {status === "archived" && (
          <button
            type="button"
            onClick={handleRestore}
            disabled={isPending}
            className="rounded border px-4 py-2"
          >
            {isPending ? "Restoring..." : "Restore"}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
