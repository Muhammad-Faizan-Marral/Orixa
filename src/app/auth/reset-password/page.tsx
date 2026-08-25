"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { FormAlert } from "@/components/auth/form-alert";
import { Input } from "@/components/UI/Input";
import { Button } from "@/components/UI/Button";
import {
  resetPassword,
  type ResetPasswordState,
} from "@/actions/auth/resetPassword";

const initialState: ResetPasswordState = {};

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPassword, initialState);

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong password for your account.">
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

        <Button type="submit" variant="gradient" className="w-full" loading={pending}>
          {pending ? "Updating..." : "Update password"}
        </Button>
      </form>

      <p className="text-small mt-8 text-center">
        <Link href="/auth/login" className="font-medium text-primary hover:text-primary-hover">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
