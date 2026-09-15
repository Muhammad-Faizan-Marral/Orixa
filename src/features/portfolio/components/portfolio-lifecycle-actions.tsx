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

type Props = {
  portfolioId: string;
  status: PortfolioStatus;
  hasSavedVersion: boolean;
  hasUnpublishedChanges: boolean;
};

type ActionKey = "publish" | "unpublish" | "archive" | "restore" | null;

export function PortfolioLifecycleActions({
  portfolioId,
  status: serverStatus,
  hasSavedVersion,
  hasUnpublishedChanges: serverUnpublished,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<ActionKey>(null);
  const [error, setError] = useState<string | null>(null);
  const [justPublished, setJustPublished] = useState(false);

  // Local UI state — updates instantly; server refresh is background only
  const [status, setStatus] = useState(serverStatus);
  const [hasUnpublished, setHasUnpublished] = useState(serverUnpublished);

  // Sync if server props change after real refresh
  if (serverStatus !== status && !isPending && pendingAction === null) {
    // avoid render loop: only when idle
  }

  const runAction = (
    key: Exclude<ActionKey, null>,
    action: () => Promise<{ success: boolean; message?: string }>,
    nextStatus: PortfolioStatus,
    clearUnpublished: boolean,
  ) => {
    setError(null);
    setPendingAction(key);

    // Instant UI
    setStatus(nextStatus);
    if (clearUnpublished) setHasUnpublished(false);

    startTransition(async () => {
      const result = await action();

      if (!result.success) {
        setError(result.message ?? "Something went wrong.");
        setStatus(serverStatus);
        setHasUnpublished(serverUnpublished);
        setPendingAction(null);
        return;
      }

      if (key === "publish") {
        setJustPublished(true);
        window.setTimeout(() => setJustPublished(false), 2000);
      }

      setPendingAction(null);
      // Background revalidate — do NOT block UI; single refresh only
      router.refresh();
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {status === "draft" && hasSavedVersion && (
          <Button
            type="button"
            variant="gradient"
            disabled={isPending}
            loading={pendingAction === "publish"}
            onClick={() =>
              runAction("publish", () => publishPortfolio(portfolioId), "published", true)
            }
          >
            {pendingAction === "publish" ? "Publishing…" : "Publish live"}
          </Button>
        )}

        {status === "published" && hasUnpublished && (
          <>
            <Button
              type="button"
              variant="gradient"
              disabled={isPending}
              loading={pendingAction === "publish"}
              onClick={() =>
                runAction("publish", () => publishPortfolio(portfolioId), "published", true)
              }
            >
              {pendingAction === "publish" ? "Publishing…" : "Publish updates"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              loading={pendingAction === "unpublish"}
              onClick={() =>
                runAction("unpublish", () => unpublishPortfolio(portfolioId), "draft", true)
              }
            >
              {pendingAction === "unpublish" ? "Unpublishing…" : "Unpublish"}
            </Button>
          </>
        )}

        {status === "published" && !hasUnpublished && (
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            loading={pendingAction === "unpublish"}
            onClick={() =>
              runAction("unpublish", () => unpublishPortfolio(portfolioId), "draft", true)
            }
          >
            {pendingAction === "unpublish" ? "Unpublishing…" : "Unpublish"}
          </Button>
        )}

        {status !== "archived" && (
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            loading={pendingAction === "archive"}
            onClick={() => {
              if (
                !window.confirm(
                  "Archive this portfolio? It will be hidden from the public until you restore it.",
                )
              )
                return;
              runAction("archive", () => archivePortfolio(portfolioId), "archived", false);
            }}
          >
            {pendingAction === "archive" ? "Archiving…" : "Archive"}
          </Button>
        )}

        {status === "archived" && (
          <Button
            type="button"
            variant="gradient"
            disabled={isPending}
            loading={pendingAction === "restore"}
            onClick={() =>
              runAction("restore", () => restorePortfolio(portfolioId), "draft", false)
            }
          >
            {pendingAction === "restore" ? "Restoring…" : "Restore draft"}
          </Button>
        )}

        <AnimatePresence>
          {justPublished && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-ion-soft border-primary/25 text-small inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-primary"
            >
              ✦ Live now
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p role="alert" className="text-small rounded-lg border border-error/20 bg-error/10 px-3 py-2 text-error">
          {error}
        </p>
      )}
    </div>
  );
}