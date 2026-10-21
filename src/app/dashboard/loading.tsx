import { Skeleton } from "@/components/UI/Skeleton";
import { LoadingMessages } from "@/components/UI/loading-kit";

const MESSAGES = [
  "Preparing your workspace",
  "Updating your overview",
  "Organizing your portfolios",
  "Almost ready",
];

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-14">
      {/* Premium workspace header */}
      <header className="relative overflow-hidden rounded-3xl border border-border bg-background p-5 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-violet-500/[0.055] blur-3xl"
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-500/[0.06] px-3 py-1.5">
              <span className="size-1.5 rounded-full bg-violet-400" />
              <span className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground">
                YOUR WORKSPACE
              </span>
            </div>

            <Skeleton className="h-9 w-64 max-w-full rounded-xl bg-foreground/[0.09] sm:h-11 sm:w-80" />

            <Skeleton className="h-3.5 w-56 max-w-full" />
          </div>

          <Skeleton className="h-11 w-40 rounded-xl bg-violet-500/20" />
        </div>
      </header>

      {/* Workspace overview */}
      <section
        aria-label="Loading workspace overview"
        className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
      >
        {/* Main overview card */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-background">
          <div className="relative overflow-hidden border-b border-border p-5 sm:p-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-violet-500/[0.07] to-transparent"
            />

            <div className="relative space-y-4">
              <Skeleton className="h-3 w-28 bg-violet-400/20" />
              <Skeleton className="h-12 w-44 rounded-xl bg-foreground/[0.09] sm:h-14 sm:w-52" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="space-y-2 p-5 sm:p-6">
              <Skeleton className="h-7 w-16 bg-foreground/[0.085]" />
              <Skeleton className="h-3 w-24" />
            </div>

            <div className="space-y-2 p-5 sm:p-6">
              <Skeleton className="h-7 w-12 bg-foreground/[0.085]" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>

        {/* Progress overview */}
        <div className="flex flex-col justify-between gap-7 rounded-2xl border border-border bg-background p-5 sm:p-7">
          <div className="space-y-4">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-10 w-28 rounded-xl bg-foreground/[0.085]" />
            <Skeleton className="h-3 w-48 max-w-full" />
          </div>

          <div className="space-y-3">
            <div className="h-2 overflow-hidden rounded-full bg-foreground/[0.06]">
              <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-violet-500/60 to-cyan-400/60" />
            </div>

            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio cards */}
      <section
        aria-label="Loading portfolios"
        className="space-y-5"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40 bg-foreground/[0.085]" />
            <Skeleton className="h-3 w-52 max-w-full" />
          </div>

          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-border bg-background"
            >
              {/* Static visual preview */}
              <div
                className={[
                  "relative h-32 overflow-hidden border-b border-border",
                  item === 0
                    ? "bg-gradient-to-br from-violet-500/[0.13] via-violet-500/[0.035] to-transparent"
                    : item === 1
                      ? "bg-gradient-to-br from-cyan-400/[0.10] via-blue-500/[0.025] to-transparent"
                      : "bg-gradient-to-br from-foreground/[0.055] to-transparent",
                ].join(" ")}
              >
                <div className="absolute inset-x-4 top-4 flex items-center gap-2">
                  <div className="size-6 rounded-lg border border-foreground/[0.08] bg-background/50" />
                  <Skeleton className="h-2.5 w-20 bg-foreground/[0.10]" />
                </div>

                <div className="absolute inset-x-4 bottom-4 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-foreground/[0.12]" />
                  <Skeleton className="h-2 w-1/2" />
                </div>
              </div>

              <div className="space-y-3 p-4">
                <Skeleton className="h-3.5 w-2/3 bg-foreground/[0.085]" />
                <Skeleton className="h-3 w-1/2" />

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="size-7 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <LoadingMessages
        messages={MESSAGES}
        className="justify-start px-1 pt-1"
      />
    </div>
  );
}