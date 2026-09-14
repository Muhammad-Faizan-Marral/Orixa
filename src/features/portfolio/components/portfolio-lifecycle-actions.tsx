"use client";

import { useState, useTransition, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { publishPortfolio } from "@/actions/portfolio/publish-portfolio";
import { unpublishPortfolio } from "@/actions/portfolio/unpublish-portfolio";
import { archivePortfolio } from "@/actions/portfolio/archive-portfolio";
import { restorePortfolio } from "@/actions/portfolio/restore-portfolio";

import { Button } from "@/components/UI/Button";

type PortfolioStatus = "draft" | "published" | "archived";

type PortfolioLifecycleActionsProps = {
  portfolioId: string;
  status: PortfolioStatus;
  hasSavedVersion: boolean;
  hasUnpublishedChanges: boolean;
};

type ActionKey = "publish" | "unpublish" | "archive" | "restore" | null;

export function PortfolioLifecycleActions({
  portfolioId,
  status: initialStatus,
  hasSavedVersion,
  hasUnpublishedChanges: initialHasUnpublishedChanges,
}: PortfolioLifecycleActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<ActionKey>(null);
  const [error, setError] = useState<string | null>(null);
  const [justPublished, setJustPublished] = useState(false);

  // Optimistic status — UI instantly update hoti hai
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    initialStatus,
    (_current, next: PortfolioStatus) => next,
  );

  const [optimisticHasUnpublished, setOptimisticHasUnpublished] = useOptimistic(
    initialHasUnpublishedChanges,
    (_current, next: boolean) => next,
  );

  const runAction = (
    key: Exclude<ActionKey, null>,
    action: () => Promise<{ success: boolean; message?: string }>,
    optimisticNext: PortfolioStatus,
    clearUnpublished = false,
  ) => {
    setError(null);
    setPendingAction(key);

    startTransition(async () => {
      // Instant UI update
      setOptimisticStatus(optimisticNext);
      if (clearUnpublished) {
        setOptimisticHasUnpublished(false);
      }

      const result = await action();

      if (!result.success) {
        // Revert on failure (refresh will restore real state)
        setError(result.message ?? "Something went wrong.");
        setPendingAction(null);
        router.refresh();
        return;
      }

      if (key === "publish") {
        setJustPublished(true);
        setTimeout(() => setJustPublished(false), 2200);
      }

      setPendingAction(null);
      // Single refresh only — no double refresh
      router.refresh();
    });
  };

  const handlePublish = () =>
    runAction(
      "publish",
      () => publishPortfolio(portfolioId),
      "published",
      true,
    );

  const handleUnpublish = () =>
    runAction(
      "unpublish",
      () => unpublishPortfolio(portfolioId),
      "draft",
      true,
    );

  const handleArchive = () => {
    if (
      !window.confirm(
       "Archive this portfolio? It will be removed from the public web until you restore it.",
      )
    )
      return;
    runAction("archive", () => archivePortfolio(portfolioId), "archived");
  };

  const handleRestore = () =>
    runAction("restore", () => restorePortfolio(portfolioId), "draft");

  const status = optimisticStatus;
  const hasUnpublishedChanges = optimisticHasUnpublished;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">

        {status === "draft" && hasSavedVersion && (
          <Button
            type="button"
            variant="gradient"
            onClick={handlePublish}
            loading={isPending && pendingAction === "publish"}
            disabled={isPending}
          >
            {isPending && pendingAction === "publish"
              ? "Publishing..."
              : "Publish live"}
          </Button>
        )}

        {status === "published" && hasUnpublishedChanges && (
          <>
            <Button
              type="button"
              variant="gradient"
              onClick={handlePublish}
              loading={isPending && pendingAction === "publish"}
              disabled={isPending}
            >
              {isPending && pendingAction === "publish"
                ? "Publishing..."
                : "Publish new version"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleUnpublish}
              loading={isPending && pendingAction === "unpublish"}
              disabled={isPending}
            >
              {isPending && pendingAction === "unpublish"
                ? "Unpublishing..."
                : "Unpublish"}
            </Button>
          </>
        )}

        {status === "published" && !hasUnpublishedChanges && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleUnpublish}
            loading={isPending && pendingAction === "unpublish"}
            disabled={isPending}
          >
            {isPending && pendingAction === "unpublish"
              ? "Unpublishing..."
              : "Unpublish"}
          </Button>
        )}

        {status !== "archived" && (
          <Button
            type="button"
            variant="outline"
            onClick={handleArchive}
            loading={isPending && pendingAction === "archive"}
            disabled={isPending}
          >
            {isPending && pendingAction === "archive"
              ? "Archiving..."
              : "Archive"}
          </Button>
        )}

        {status === "archived" && (
          <Button
            type="button"
            variant="gradient"
            onClick={handleRestore}
            loading={isPending && pendingAction === "restore"}
            disabled={isPending}
          >
            {isPending && pendingAction === "restore"
              ? "Restoring..."
              : "Restore draft"}
          </Button>
        )}

        <AnimatePresence>
          {justPublished && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-gradient-ion-soft border-primary/25 text-small inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-primary"
            >
             ✦ Live — your portfolio is public
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p
          role="alert"
          className="text-small rounded-lg border border-error/20 bg-error/10 px-3 py-2 text-error"
        >
          {error}
        </p>
      )}
    </div>
  );
}
