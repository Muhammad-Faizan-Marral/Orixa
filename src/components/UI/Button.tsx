"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "gradient";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Render as the child element instead of a <button> (e.g. wrapping Link) */
  asChild?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium " +
  "transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background select-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover active:scale-[0.98]",
  secondary:
    "bg-surface-2 text-foreground border border-border hover:bg-surface-3 active:scale-[0.98]",
  outline:
    "border border-border-strong text-foreground bg-transparent hover:bg-surface-2 active:scale-[0.98]",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-2 active:scale-[0.98]",
  destructive:
    "bg-error text-error-foreground hover:opacity-90 active:scale-[0.98]",
  gradient:
    "bg-gradient-ion text-white shadow-glow-primary hover:brightness-110 active:scale-[0.98]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-md",
  md: "h-10 px-4",
  lg: "h-12 px-6 text-[0.95rem] rounded-lg",
  icon: "h-10 w-10 rounded-md",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, disabled, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <svg
            className="h-3.5 w-3.5 animate-spin text-current"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
