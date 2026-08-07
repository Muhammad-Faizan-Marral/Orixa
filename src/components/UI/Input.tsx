"use client";

import * as React from "react";

// Fallback helper if `@/lib/utils` isn't configured yet
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, type, ...props }, ref) => {
    // 1. Call hooks unconditionally at the top level
    const generatedId = React.useId();
    
    // 2. Resolve the final ID using passed prop or generated ID
    const inputId = id ?? generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {label}
          </label>
        )}

        <input
          type={type}
          ref={ref}
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-slate-700 dark:focus:ring-slate-800/50",
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500/20",
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };