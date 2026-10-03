"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { publishPortfolio } from "@/actions/portfolio/publish-portfolio";
import { unpublishPortfolio } from "@/actions/portfolio/unpublish-portfolio";
import { archivePortfolio } from "@/actions/portfolio/archive-portfolio";
import { restorePortfolio } from "@/actions/portfolio/restore-portfolio";
import { usePortfolioPublishing } from "@/features/portfolio/components/portfolio-publishing-context";

import { Button } from "@/components/UI/Button";
import { useToast } from "@/components/toast";

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
  const actionInFlight = useRef(false);
  const [pendingAction, setPendingAction] = useState<ActionKey>(null);
  const [error, setError] = useState<string | null>(null);
  const { setIsPublishing, setPublishedOverride } =
    usePortfolioPublishing();
  const { toast } = useToast();

  // Local UI state — updates instantly; server refresh is background only
  const [status, setStatus] = useState(serverStatus);
  const [hasUnpublished, setHasUnpublished] = useState(serverUnpublished);

  useEffect(() => {
    if (!actionInFlight.current) {
      setStatus(serverStatus);
      setHasUnpublished(serverUnpublished);
      setPublishedOverride(null);
    }
  }, [serverStatus, serverUnpublished, setPublishedOverride]);

  const runAction = (
    key: Exclude<ActionKey, null>,
    action: () => Promise<{ success: boolean; message?: string }>,
    nextStatus: PortfolioStatus,
    clearUnpublished: boolean,
  ) => {
    if (actionInFlight.current) return;

    actionInFlight.current = true;
    setError(null);
    setPendingAction(key);
    if (key === "publish") setIsPublishing(true);

    startTransition(async () => {
      let succeeded = false;
      try {
        const result = await action();
        if (!result.success) {
          setError(result.message ?? "Something went wrong.");
          return;
        }

        setStatus(nextStatus);
        setPublishedOverride(nextStatus === "published");
        if (clearUnpublished) setHasUnpublished(false);
        succeeded = true;

        if (key === "publish") {
          toast({
            type: "success",
            title: "Your portfolio has been published!",
            description:
              "Cached versions may take a little time to update. If you still see your previous portfolio, please wait a little and refresh the page.",
            duration: 0,
          });
        }
      } catch (actionError) {
        setError(
          actionError instanceof Error
            ? actionError.message
            : "Something went wrong.",
        );
      } finally {
        actionInFlight.current = false;
        setPendingAction(null);
        if (key === "publish") setIsPublishing(false);
      }

      if (succeeded) router.refresh();
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {status === "draft" && hasSavedVersion && (
          <Button
            type="button"
            variant="gradient"
            disabled={isPending || pendingAction !== null}
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
              disabled={isPending || pendingAction !== null}
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
              disabled={isPending || pendingAction !== null}
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
            disabled={isPending || pendingAction !== null}
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
            disabled={isPending || pendingAction !== null}
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
            disabled={isPending || pendingAction !== null}
            loading={pendingAction === "restore"}
            onClick={() =>
              runAction("restore", () => restorePortfolio(portfolioId), "draft", false)
            }
          >
            {pendingAction === "restore" ? "Restoring…" : "Restore draft"}
          </Button>
        )}

      </div>

      {error && (
        <p role="alert" className="text-small rounded-lg border border-error/20 bg-error/10 px-3 py-2 text-error">
          {error}
        </p>
      )}
    </div>
  );
}