"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/UI/Button";

const STORAGE_KEY = "orixa_portfolio_tour_v1";

const STEPS = [
  {
    title: "Your portfolio hub",
    body: "This page is home base: status, publish controls, edit, versions, and analytics.",
  },
  {
    title: "Draft → Live → Archive",
    body: "Draft means only you see it. Publish makes it public. Archive hides it without deleting. Restore brings an archive back to draft.",
  },
  {
    title: "Versions",
    body: "Publishing saves a live snapshot. You can preview older versions and restore one if you need to undo a bad publish.",
  },
  {
    title: "Edit anytime",
    body: "Change content in the editor. If the site is already live, visitors keep seeing the last published version until you publish updates.",
  },
] as const;

type Props = {
  /** Start open once for new users; they can skip forever */
  autoStart?: boolean;
};

export function PortfolioTour({ autoStart = true }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoStart) return;

    try {
      if (localStorage.getItem(STORAGE_KEY) === "done") return;

      queueMicrotask(() => {
        setOpen(true);
      });
    } catch {
      // ignore
    }
  }, [autoStart]);

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "done");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  const next = () => {
    if (index >= STEPS.length - 1) {
      finish();
      return;
    }
    setIndex((i) => i + 1);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        className="text-small text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        How publishing works
      </button>
    );
  }

  const step = STEPS[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-tour-title"
    >
      <div className="surface-card w-full max-w-md p-6 shadow-xl">
        <p className="text-caption text-accent">
          Quick tour · {index + 1} / {STEPS.length}
        </p>
        <h2 id="portfolio-tour-title" className="text-h3 mt-2">
          {step.title}
        </h2>
        <p className="text-body mt-3 text-muted-foreground">{step.body}</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={finish}
            className="text-small text-muted-foreground hover:text-foreground"
          >
            Skip tour
          </button>
          <div className="flex gap-2">
            {index > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIndex((i) => i - 1)}
              >
                Back
              </Button>
            )}
            <Button type="button" variant="gradient" onClick={next}>
              {index >= STEPS.length - 1 ? "Got it" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
