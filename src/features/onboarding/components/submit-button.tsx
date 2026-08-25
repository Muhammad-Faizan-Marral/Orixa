"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/UI/Button";

interface SubmitButtonProps {
  children?: ReactNode;
  pending?: boolean;
  disabled?: boolean;
}

export function SubmitButton({
  children = "Create profile",
  pending = false,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant="gradient"
      size="lg"
      className="w-full"
      disabled={disabled || pending}
      loading={pending}
    >
      {pending ? "Creating profile..." : children}
    </Button>
  );
}
