"use client";

import { useState } from "react";
import Link from "next/link";
import {
  publicPathDisplay,
  publicSharePath,
  publicInternalPath,
  publicAbsoluteUrl,
} from "@/lib/public-url";
import { cn } from "@/lib/utils";

type PublicLinkCardProps = {
  username: string;
  portfolioSlug: string;
  isPublished?: boolean;
  className?: string;
};

/**
 * Display + Copy + Share:  developer/developer/orixaai.me
 * Opens in browser:        https://orixaai.me/developer/developer
 */
export function PublicLinkCard({
  username,
  portfolioSlug,
  isPublished = false,
  className,
}: PublicLinkCardProps) {
  const [copied, setCopied] = useState(false);

  const display = publicPathDisplay(username, portfolioSlug);
  const sharePath = publicSharePath(username, portfolioSlug);
  const internalPath = publicInternalPath(username, portfolioSlug);
  const absolute = publicAbsoluteUrl(username, portfolioSlug);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(sharePath);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "My portfolio",
          text: sharePath,
          url: absolute,
        });
        return;
      } catch {
        // cancelled
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
          {isPublished ? (
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
          {!isPublished && (
            <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
              Publish to go live
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="text-small rounded-lg border border-border-strong px-3 py-1.5 hover:bg-surface-2"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="text-small rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-primary hover:bg-primary/15"
        >
          Share
        </button>
      </div>
    </div>
  );
}