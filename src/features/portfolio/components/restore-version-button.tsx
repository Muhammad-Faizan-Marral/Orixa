"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { restorePortfolioVersion } from "@/actions/portfolio/restore-version";
import { Button } from "@/components/UI/Button";

type RestoreVersionButtonProps = {
  portfolioId: string;
  version: number;
};

export function RestoreVersionButton({ portfolioId, version }: RestoreVersionButtonProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleRestore = () => {
    const confirmed = window.confirm(
      `Restore version ${version} into your current portfolio draft? Your current draft will be overwritten.`
    );

    if (!confirmed) return;

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
      <Button type="button" variant="secondary" size="sm" onClick={handleRestore} loading={isPending}>
        {isPending ? "Restoring..." : "Restore this version"}
      </Button>
      {error && <p role="alert" className="text-small mt-2 text-error">{error}</p>}
    </div>
  );
}
