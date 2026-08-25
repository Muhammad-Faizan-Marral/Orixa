"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-label block">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            "flex min-h-[110px] w-full resize-y rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-foreground",
            "transition-colors placeholder:text-subtle-foreground",
            "focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring/25",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus:border-error focus:ring-error/20",
            className
          )}
          {...props}
        />

        {error ? (
          <p className="text-xs font-medium text-error">{error}</p>
        ) : hint ? (
          <p className="text-xs text-subtle-foreground">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
