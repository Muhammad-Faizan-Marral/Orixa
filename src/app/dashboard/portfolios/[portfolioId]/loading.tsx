import { Skeleton } from "@/components/UI/Skeleton";
import {
  BuildingPage,
  LoadingMessages,
} from "@/components/UI/loading-kit";

const MESSAGES = [
  "Opening your portfolio",
  "Preparing your analytics",
  "Organizing your projects",
  "Almost ready",
];

export default function PortfolioDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-14">
      {/* Back navigation */}
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-3.5 w-28" />
      </div>

      {/* Portfolio header */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-background p-5 sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-violet-500/[0.045] blur-3xl"
        />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-center">
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-full bg-violet-500/[0.12]" />
              <Skeleton className="h-5 w-12 rounded-md" />
              <Skeleton className="h-3 w-28" />
            </div>

            <Skeleton className="h-9 w-3/4 max-w-lg rounded-xl bg-foreground/[0.09] sm:h-12" />

            <Skeleton className="h-3.5 w-64 max-w-full" />
          </div>

          <div className="rounded-2xl border border-border bg-foreground/[0.015] p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-violet-500/[0.10]">
                <span className="size-2 rounded-full bg-violet-400/60" />
              </div>

              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>

            <Skeleton className="h-10 w-full rounded-xl bg-violet-500/15" />
          </div>
        </div>
      </section>

      {/* Feature overview */}
      <section
        aria-label="Loading portfolio features"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        {[0, 1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className={[
              "rounded-2xl border border-border bg-background p-4",
              item === 4 ? "col-span-2 sm:col-span-1" : "",
            ].join(" ")}
          >
            <div
              className={[
                "mb-4 flex size-9 items-center justify-center rounded-xl",
                item === 0
                  ? "bg-violet-500/[0.10]"
                  : item === 1
                    ? "bg-cyan-400/[0.08]"
                    : "bg-foreground/[0.04]",
              ].join(" ")}
            >
              <Skeleton className="size-3.5 rounded-sm bg-foreground/[0.13]" />
            </div>

            <Skeleton className="h-3.5 w-4/5 bg-foreground/[0.085]" />
            <Skeleton className="mt-2 h-2.5 w-3/5" />
          </div>
        ))}
      </section>

      {/* Analytics placeholders */}
      <section
        aria-label="Loading portfolio analytics"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-border bg-background p-4 sm:p-5"
          >
            <Skeleton className="h-3 w-20" />
            <Skeleton
              className={[
                "mt-4 h-8 rounded-lg bg-foreground/[0.085]",
                item === 0 ? "w-20" : "w-16",
              ].join(" ")}
            />
            <Skeleton className="mt-3 h-2.5 w-24 max-w-full" />
          </div>
        ))}
      </section>

      {/* Premium portfolio preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 bg-foreground/[0.085]" />
            <Skeleton className="h-3 w-48 max-w-full" />
          </div>

          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>

        <BuildingPage />
      </section>

      <LoadingMessages
        messages={MESSAGES}
        className="justify-start px-1 pt-1"
      />
    </div>
  );
}