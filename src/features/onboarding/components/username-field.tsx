"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

import { Input } from "@/components/UI/Input";

import { USERNAME_HELP_TEXT } from "../constants";
import { useUsernameCheck } from "../hooks/use-username-check";
import type { OnboardingFormValues } from "../types";

interface UsernameFieldProps {
  registration: UseFormRegisterReturn<keyof OnboardingFormValues>;
  value: string;
  error?: string;
  disabled?: boolean;
}

export function UsernameField({
  registration,
  value,
  error,
  disabled = false,
}: UsernameFieldProps) {
  const usernameCheck = useUsernameCheck(value);

  const displayError =
    error ??
    (usernameCheck.status === "unavailable" || usernameCheck.status === "error"
      ? usernameCheck.message
      : undefined);

  return (
    <div className="space-y-2">
      <Input
        {...registration}
        type="text"
        label="Username"
        placeholder="your_username"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        disabled={disabled}
        error={displayError}
        hint={!displayError ? `Your portfolio URL: orixa.ai/${value || "your_username"}` : undefined}
        aria-describedby="username-help username-status"
        aria-invalid={Boolean(displayError)}
      />

      <p id="username-help" className="text-small">
        {USERNAME_HELP_TEXT}
      </p>

      <div id="username-status" aria-live="polite" className="text-small min-h-[1.1rem]">
        {usernameCheck.isChecking && (
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-subtle-foreground" />
            Checking username...
          </span>
        )}

        {usernameCheck.isAvailable && (
          <span className="flex items-center gap-1.5 text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Username is available.
          </span>
        )}
      </div>
    </div>
  );
}
