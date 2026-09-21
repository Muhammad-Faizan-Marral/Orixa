import Link from "next/link";
import { BILLING } from "@/constants/billing";

type Props = {
  isPremium?: boolean;
  className?: string;
};

export function OrixaWatermark({ isPremium = false, className = "" }: Props) {
  if (isPremium) return null;

  return (
    <p className={`text-xs text-muted-foreground/80 ${className}`}>
      {BILLING.WATERMARK_TEXT}{" "}
      <Link
        href="https://orixa.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-foreground transition-colors"
      >
        OrixaAi
      </Link>
    </p>
  );
}