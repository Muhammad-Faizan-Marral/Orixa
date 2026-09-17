import { cn } from "@/lib/utils";

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
  /**
   * start = content rail (premium default)
   * center = classic centered column
   */
  align?: "start" | "center";
  /** Only horizontal page inset — no max-width */
  bleed?: boolean;
};

/**
 * Horizontal page inset + optional max-width rail.
 * Uses --pr-page-inset / --pr-rail-* from theme when present.
 */
export function Container({
  className,
  children,
  align = "start",
  bleed = false,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full",
        "px-[var(--pr-page-inset,clamp(1.25rem,4vw,3.5rem))]",
        !bleed && "mx-auto",
        !bleed && "max-w-[var(--pr-rail-max,72rem)]",
        className,
      )}
      data-align={align}
    >
      {children}
    </div>
  );
}