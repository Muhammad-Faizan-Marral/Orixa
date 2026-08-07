"use client";

import type { UseFormRegisterReturn } from "react-hook-form";

import { Input } from "../../../components/UI/Input";

import { USERNAME_HELP_TEXT } from "../constants";
import { useUsernameCheck } from "../hooks/use-username-check";
import type { OnboardingFormValues } from "../types";

interface UsernameFieldProps {
  registration: UseFormRegisterReturn<
    keyof OnboardingFormValues
  >;
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
  const usernameCheck =
    useUsernameCheck(value);

  const displayError =
    error ??
    (usernameCheck.status === "unavailable" ||
    usernameCheck.status === "error"
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
        aria-describedby="username-help username-status"
        aria-invalid={Boolean(displayError)}
      />

      <p
        id="username-help"
        className="text-sm text-gray-500"
      >
        {USERNAME_HELP_TEXT}
      </p>

      <div
        id="username-status"
        aria-live="polite"
        className="text-sm"
      >
        {usernameCheck.isChecking && (
          <p>Checking username...</p>
        )}

        {usernameCheck.isAvailable && (
          <p>Username is available.</p>
        )}
      </div>
    </div>
  );
}