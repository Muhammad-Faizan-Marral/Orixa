"use client";

import { useState, useTransition } from "react";
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
};

type ActionKey = "publish" | "unpublish" | "archive" | "restore" | null;

export function PortfolioLifecycleActions({
  portfolioId,
  status,
}: PortfolioLifecycleActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<ActionKey>(null);
  const [error, setError] = useState<string | null>(null);
  const [justPublished, setJustPublished] = useState(false);

  const runAction = (
    key: Exclude<ActionKey, null>,
    action: () => Promise<{ success: boolean; message?: string }>,
  ) => {
    setError(null);
    setPendingAction(key);
    startTransition(async () => {
      const result = await action();

      if (!result.success) {
        setError(result.message ?? "Something went wrong.");
        setPendingAction(null);
        return;
      }

      if (key === "publish") {
        setJustPublished(true);
        setTimeout(() => setJustPublished(false), 2400);
      }

      setPendingAction(null);
      router.refresh();
    });
  };

  const handlePublish = () =>
    runAction("publish", () => publishPortfolio(portfolioId));
  const handleUnpublish = () =>
    runAction("unpublish", () => unpublishPortfolio(portfolioId));

  const handleArchive = () => {
    if (
      !window.confirm(
        "Archive this portfolio? It will no longer be publicly accessible.",
      )
    )
      return;
    runAction("archive", () => archivePortfolio(portfolioId));
  };

  const handleRestore = () =>
    runAction("restore", () => restorePortfolio(portfolioId));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {status === "draft" && (
          <Button
            type="button"
            variant="gradient"
            onClick={handlePublish}
            loading={isPending && pendingAction === "publish"}
          >
            {isPending && pendingAction === "publish"
              ? "Publishing..."
              : "Publish"}
          </Button>
        )}

        {status === "published" && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleUnpublish}
            loading={isPending && pendingAction === "unpublish"}
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
          >
            {isPending && pendingAction === "restore"
              ? "Restoring..."
              : "Restore"}
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
              ✦ Published — new version live
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
