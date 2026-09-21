"use client";

import { useState } from "react";
import { Button } from "@/components/UI/Button";

type Props = {
  productKey?: "monthly" | "yearly";
  children?: React.ReactNode;
  className?: string;
  variant?: "gradient" | "outline" | "default";
};

export function UpgradeButton({
  productKey = "yearly",
  children = "Upgrade to Premium",
  className,
  variant = "gradient",
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? "Redirecting…" : children}
    </Button>
  );
}