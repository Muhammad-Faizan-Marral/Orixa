import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/UI/Skeleton";

type LoadingMessagesProps = {
  messages: string[];
  seconds?: number;
  className?: string;
};

/**
 * Lightweight CSS-only loading messages.
 * No client component, interval, or JavaScript timer.
 */
export function LoadingMessages({
  messages,
  seconds = 2.4,
  className,
}: LoadingMessagesProps) {
  const items = messages.filter(Boolean);

  if (items.length === 0) {
    return null;
  }

  if (items.length === 1) {
    return (
      <p
        role="status"
        className={cn(
          "text-sm text-muted-foreground",
          className
        )}
      >
        {items[0]}
      </p>
    );
  }

  const count = items.length;
  const slot = 100 / count;
  const total = count * seconds;
  const keyframeName = `orixa-loading-message-${count}`;

  const percent = (value: number) =>
    (slot * value).toFixed(3);

  const css = `
    @keyframes ${keyframeName} {
      0% {
        opacity: 0;
        transform: translateY(4px);
      }
      ${percent(0.08)}% {
        opacity: 1;
        transform: translateY(0);
      }
      ${percent(0.84)}% {
        opacity: 1;
        transform: translateY(0);
      }
      ${percent(1)}% {
        opacity: 0;
        transform: translateY(-3px);
      }
      100% {
        opacity: 0;
        transform: translateY(-3px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .orixa-loading-message {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }

      .orixa-loading-message:not(:first-child) {
        display: none;
      }
    }
  `;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex min-h-6 items-center justify-center gap-2.5",
        "text-sm text-muted-foreground",
        className
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <span
        aria-hidden="true"
        className="relative size-2 shrink-0"
      >
        <span className="absolute inset-0 rounded-full bg-violet-500/30" />
        <span className="absolute inset-[2px] rounded-full bg-violet-400" />
      </span>

      <span className="grid">
        {items.map((message, index) => (
          <span
            key={`${index}-${message}`}
            className="orixa-loading-message whitespace-nowrap"
            style={{
              gridArea: "1 / 1",
              opacity: 0,
              animation: `${keyframeName} ${total}s ease-in-out ${
                index * seconds
              }s infinite both`,
            }}
          >
            {message}
          </span>
        ))}
      </span>
    </div>
  );
}

/**
 * Static portfolio preview with a single small animated indicator.
 * No images, canvas, client-side state, or extra JavaScript.
 */
export function BuildingPage({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-2xl border border-border",
        "bg-background shadow-[0_24px_64px_-48px_rgba(108,92,255,0.5)]",
        className
      )}
    >
      {/* Browser chrome */}
      <div className="flex h-12 items-center gap-3 border-b border-border bg-foreground/[0.025] px-4">
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="size-2 rounded-full bg-foreground/20" />
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/10" />
        </div>

        <div className="mx-auto flex h-6 w-full max-w-xs items-center justify-center rounded-md border border-border/70 bg-background/70 px-3">
          <div className="h-1.5 w-24 rounded-full bg-foreground/[0.09]" />
        </div>

        <div className="w-7 shrink-0" />
      </div>

      {/* Portfolio canvas */}
      <div className="relative isolate overflow-hidden px-5 py-8 sm:px-10 sm:py-12">
        {/* Static brand glow: no animation or image asset */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-br from-violet-500/[0.09] via-cyan-400/[0.035] to-transparent" />

        <div className="mx-auto max-w-2xl space-y-8">
          {/* Profile identity */}
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-cyan-400/10">
              <div className="size-4 rounded-full bg-violet-400/35" />
            </div>

            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-32 bg-foreground/[0.09]" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>

          {/* Hero section */}
          <div className="space-y-4">
            <Skeleton className="h-3 w-24 bg-violet-400/20" />

            <div className="space-y-2.5">
              <Skeleton className="h-7 w-[88%] max-w-lg rounded-lg bg-foreground/[0.09] sm:h-9" />
              <Skeleton className="h-7 w-[62%] max-w-sm rounded-lg bg-foreground/[0.07] sm:h-9" />
            </div>

            <div className="space-y-2 pt-1">
              <Skeleton className="h-2.5 w-full max-w-lg" />
              <Skeleton className="h-2.5 w-[78%] max-w-md" />
            </div>

            <Skeleton className="h-9 w-28 rounded-xl bg-violet-500/20" />
          </div>

          {/* Project preview cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl border border-border/80 bg-foreground/[0.015] p-2 sm:p-3"
              >
                <div
                  className={cn(
                    "h-16 rounded-lg sm:h-24",
                    item === 0 &&
                      "bg-gradient-to-br from-violet-500/15 to-violet-400/[0.025]",
                    item === 1 &&
                      "bg-gradient-to-br from-cyan-400/10 to-blue-500/[0.025]",
                    item === 2 &&
                      "bg-gradient-to-br from-foreground/[0.07] to-transparent"
                  )}
                />

                <Skeleton className="mt-3 h-2.5 w-4/5" />
                <Skeleton className="mt-2 h-2 w-3/5" />
              </div>
            ))}
          </div>

          {/* Loading status */}
          <div className="flex items-center justify-between border-t border-border/80 pt-4">
            <div className="flex items-center gap-2">
              <span className="size-1.5 animate-pulse rounded-full bg-violet-400 motion-reduce:animate-none" />
              <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
                PREPARING PREVIEW
              </span>
            </div>

            <span className="text-[11px] text-muted-foreground/70">
              ORIXA STUDIO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}