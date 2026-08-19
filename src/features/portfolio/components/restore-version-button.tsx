"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { restorePortfolioVersion } from "@/actions/portfolio/restore-version";

type RestoreVersionButtonProps = {
  portfolioId: string;
  version: number;
};

export function RestoreVersionButton({
  portfolioId,
  version,
}: RestoreVersionButtonProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleRestore = () => {
    const confirmed = window.confirm(
      `Restore version ${version} into your current portfolio draft?`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await restorePortfolioVersion(portfolioId, version);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.push(`/dashboard/portfolios/${portfolioId}`);
      router.refresh();
    });
  };

  return (
    <div>
      <button type="button" onClick={handleRestore} disabled={isPending}>
        {isPending ? "Restoring..." : "Restore Version"}
      </button>

      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
