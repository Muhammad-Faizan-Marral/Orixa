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

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-45";

function Icon({ path }: { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

const ICON = {
  copy: "M9 9h10v10H9zM5 15V5h10",
  check: "M5 12.5l4.5 4.5L19 7.5",
  share: "M12 15V4M8 8l4-4 4 4M5 14v5h14v-5",
  open: "M14 4h6v6M20 4l-9 9M18 14v5H5V6h5",
};

export function PublicLinkCard({
  username,
  portfolioSlug,
  isPublished = false,
  className,
}: PublicLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const { isPublishing, publishedOverride } = usePortfolioPublishing();

  const display = publicPathDisplay(username, portfolioSlug);
  const internalPath = publicInternalPath(username, portfolioSlug);
  const absolute = publicAbsoluteUrl(username, portfolioSlug);
  const isCurrentlyPublished = publishedOverride ?? isPublished;
  const canInteract = isCurrentlyPublished && !isPublishing;
  const shareText = `Someone thinks your portfolio deserves better.\n\n${absolute}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(absolute);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
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
        "flex flex-col gap-5 rounded-2xl border bg-background p-5 transition-colors sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8",
        canInteract
          ? "border-border"
          : "border-dashed border-foreground/25 bg-foreground/[0.02]",
        className,
      )}
    >
      <div className="min-w-0 space-y-2.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="text-small font-medium text-foreground">Public link</p>

          {isPublishing ? (
            <span
              role="status"
              className="inline-flex items-center gap-1.5 rounded-full bg-violet-600/10 px-2.5 py-1 text-[11px] font-semibold leading-none text-violet-700 dark:bg-violet-400/15 dark:text-violet-300"
            >
              <span
                aria-hidden="true"
                className="size-3 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-600 motion-reduce:animate-none dark:border-t-violet-300"
              />
              Publishing portfolio…
            </span>
          ) : isCurrentlyPublished ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold leading-none text-emerald-700 dark:text-emerald-300">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-emerald-500"
              />
              Live
            </span>
          ) : (
            <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 text-[11px] font-medium leading-none text-muted-foreground">
              Publish to go live
            </span>
          )}
        </div>

        <div className="flex min-w-0 items-center rounded-xl border border-border bg-foreground/[0.03] px-3.5 py-2.5">
          {canInteract ? (
            <Link
              href={internalPath}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "truncate rounded font-mono text-sm text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:decoration-foreground",
                FOCUS,
              )}
            >
              {display}
            </Link>
          ) : (
            <span className="truncate font-mono text-sm text-muted-foreground">
              {display}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!canInteract}
          aria-live="polite"
          className={cn(
            BTN_BASE,
            FOCUS,
            "min-w-[118px] bg-foreground text-background hover:opacity-90",
          )}
        >
          <Icon path={copied ? ICON.check : ICON.copy} />
          {copied ? "Copied" : "Copy link"}
        </button>

        <button
          type="button"
          onClick={handleShare}
          disabled={!canInteract}
          className={cn(
            BTN_BASE,
            FOCUS,
            "border border-violet-500/35 bg-violet-500/[0.08] text-violet-700 hover:bg-violet-500/15 dark:text-violet-300",
          )}
        >
          <Icon path={ICON.share} />
          Share
        </button>

        {canInteract ? (
          <Link
            href={internalPath}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open public page in a new tab"
            className={cn(
              BTN_BASE,
              FOCUS,
              "border border-border px-3 text-foreground hover:bg-foreground/[0.05]",
            )}
          >
            <Icon path={ICON.open} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}