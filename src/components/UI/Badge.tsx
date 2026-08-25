import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "outline"
  | "gradient";

const variants: Record<BadgeVariant, string> = {
  default: "bg-surface-3 text-foreground border border-border",
  success: "bg-success/10 text-success border border-success/20",
  warning: "bg-warning/10 text-warning border border-warning/20",
  error: "bg-error/10 text-error border border-error/20",
  info: "bg-info/10 text-info border border-info/20",
  outline: "bg-transparent text-muted-foreground border border-border-strong",
  gradient: "bg-gradient-ion-soft text-foreground border border-primary/25",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

function Badge({ className, variant = "default", dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-medium leading-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-success",
            variant === "warning" && "bg-warning",
            variant === "error" && "bg-error",
            variant === "info" && "bg-info",
            (variant === "default" || variant === "outline" || variant === "gradient") &&
              "bg-current"
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge };
