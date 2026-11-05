"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AUTH_LINK, AuthLayout } from "@/components/auth/auth-layout";
import { FormAlert } from "@/components/auth/form-alert";
import { Input } from "@/components/UI/Input";
import { Button } from "@/components/UI/Button";
import {
  resetPassword,
  type ResetPasswordState,
} from "@/actions/auth/resetPassword";

const initialState: ResetPasswordState = {};

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(
    resetPassword,
    initialState,
  );

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a strong password for your account."
    >
      <form action={formAction} className="space-y-4">
        <Input
          id="password"
          name="password"
          type="password"
          label="New password"
          autoComplete="new-password"
          minLength={8}
          hint="At least 8 characters."
          required
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          autoComplete="new-password"
          minLength={8}
          required
        />

        {state.error && <FormAlert>{state.error}</FormAlert>}

        <Button
          type="submit"
          variant="gradient"
          className="w-full rounded-full"
          loading={pending}
        >
          {pending ? "Updating..." : "Update password"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm">
        <Link href="/auth/login" className={AUTH_LINK}>
          ← Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
