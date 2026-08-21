"use client";

import { useEffect } from "react";

import { recordPortfolioView } from "@/actions/portfolio/record-portfolio-view";

type Props = {
  portfolioId: string;
};

export function PortfolioViewTracker({ portfolioId }: Props) {
  useEffect(() => {
    let cancelled = false;

    async function track() {
      if (cancelled) return;

      await recordPortfolioView({
        portfolioId,
      });
    }

    void track();

    return () => {
      cancelled = true;
    };
  }, [portfolioId]);

  return null;
}
