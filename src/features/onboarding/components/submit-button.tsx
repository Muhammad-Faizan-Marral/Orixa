"use client";

import type { ReactNode } from "react";

import { useFormState } from "react-dom";

interface SubmitButtonProps {
  children?: ReactNode;
  pending?: boolean;
  disabled?: boolean;
}

export function SubmitButton({
  children = "Create Profile",
  pending = false,
  disabled = false,
}: SubmitButtonProps) {
  const isPending = pending;

  return (
    <button
      type="submit"
      disabled={disabled || isPending}
      className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Creating profile..." : children}
    </button>
  );
}
