"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { FormAlert } from "@/components/auth/form-alert";
import { Input } from "@/components/UI/Input";
import { Button } from "@/components/UI/Button";
import {
  forgotPassword,
  type ForgotPasswordState,
} from "@/actions/auth/forgotPassword";

const initialState: ForgotPasswordState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPassword, initialState);

  if (state.success) {
    return (
      <AuthLayout title="Check your email" subtitle="If an account exists, a reset link is on its way.">
        <div className="surface-panel p-5 text-sm text-muted-foreground">
          Follow the link in the email to set a new password.
        </div>
        <Link href="/auth/login" className="mt-6 block">
          <Button variant="secondary" className="w-full">
            Back to login
          </Button>
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <form action={formAction} className="space-y-4">
        <Input id="email" name="email" type="email" label="Email" autoComplete="email" required />

        {state.error && <FormAlert>{state.error}</FormAlert>}

        <Button type="submit" variant="gradient" className="w-full" loading={pending}>
          {pending ? "Sending..." : "Send reset link"}
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
