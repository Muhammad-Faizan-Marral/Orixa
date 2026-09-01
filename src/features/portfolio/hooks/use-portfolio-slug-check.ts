"use client";

import { useEffect, useState } from "react";

import { checkPortfolioSlug } from "@/actions/portfolio/check-slug";

export function usePortfolioSlugCheck(slug: string) {
  const [available, setAvailable] = useState<boolean | null>(null);

  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!slug || slug.length < 3) {
      setAvailable(null);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      setChecking(true);

      const result = await checkPortfolioSlug(slug);

      if (cancelled) return;

      setAvailable(result.success ? result.available : false);

      setChecking(false);
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [slug]);

  return {
    available,
    checking,
  };
}
