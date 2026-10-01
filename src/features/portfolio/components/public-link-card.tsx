"use client";

import { useState } from "react";
import Link from "next/link";
import {
  publicPathDisplay,
  publicInternalPath,
  publicAbsoluteUrl,
} from "@/lib/public-url";
import { usePortfolioPublishing } from "@/features/portfolio/components/portfolio-publishing-context";
import { cn } from "@/lib/utils";

type PublicLinkCardProps = {
  username: string;
  portfolioSlug: string;
  isPublished?: boolean;
  className?: string;
};

export function PublicLinkCard({
  username,
  portfolioSlug,
  isPublished = false,
  className,
}: PublicLinkCardProps) {
  const [copied, setCopied] = useState<"message" | "url" | null>(null);
  const { isPublishing, publishedOverride } = usePortfolioPublishing();

  const display = publicPathDisplay(username, portfolioSlug);
  const internalPath = publicInternalPath(username, portfolioSlug);
  const absolute = publicAbsoluteUrl(username, portfolioSlug);
  const isCurrentlyPublished = publishedOverride ?? isPublished;
  const canInteract = isCurrentlyPublished && !isPublishing;
  const shareText = `Someone thinks your portfolio deserves better.\n\n${absolute}`;

  async function copyText(text: string, copiedValue: "message" | "url") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(copiedValue);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      // ignore
    }
  }

  async function handleCopy() {
    await copyText(shareText, "message");
  }

  async function handleShare() {
    if (!canInteract) return;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "My portfolio",
          text: shareText,
        });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    await handleCopy();
  }

  return (
    <div
      className={cn(
        "surface-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <p className="text-caption text-muted-foreground">Public link</p>
        <div className="flex flex-wrap items-center gap-2">
          {canInteract ? (
            <Link
              href={internalPath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-small truncate font-medium text-primary hover:underline"
            >
              {display}
            </Link>
          ) : (
            <span className="text-small truncate font-medium text-muted-foreground">
              {display}
            </span>
          )}
          {isPublishing ? (
            <span
              role="status"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-2 py-0.5 text-[10px] text-primary"
            >
              <span
                aria-hidden="true"
                className="h-3 w-3 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
              />
              Publishing portfolio…
            </span>
          ) : !isCurrentlyPublished ? (
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
              Publish to go live
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!canInteract}
          className="text-small rounded-lg border border-border-strong px-3 py-1.5 hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied === "message" ? "Copied" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={() => copyText(absolute, "url")}
          disabled={!canInteract}
          className="text-small rounded-lg border border-border-strong px-3 py-1.5 hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied === "url" ? "Copied" : "Copy URL"}
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={!canInteract}
          className="text-small rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-primary hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Share
        </button>
      </div>
    </div>
  );
}
