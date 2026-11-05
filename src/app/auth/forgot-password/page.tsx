"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  AUTH_LINK,
  AuthLayout,
  AuthNotice,
} from "@/components/auth/auth-layout";
import { FormAlert } from "@/components/auth/form-alert";
import { Input } from "@/components/UI/Input";
import { Button } from "@/components/UI/Button";
import {
  forgotPassword,
  type ForgotPasswordState,
} from "@/actions/auth/forgotPassword";

const initialState: ForgotPasswordState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(
    forgotPassword,
    initialState,
  );

  if (state.success) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="If an account exists, a reset link is on its way."
      >
        <AuthNotice>
          <p>
            The message comes from{" "}
            <strong className="text-foreground">Orixa AI</strong>. Open the link
            to choose a new password.
          </p>
          <p>If you don&apos;t see it within a few minutes, check spam.</p>
        </AuthNotice>
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
      subtitle="Enter your email and we’ll send a secure link to reset your password."
    >
      <form action={formAction} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          required
        />

        {state.error && <FormAlert>{state.error}</FormAlert>}

        <Button
          type="submit"
          variant="gradient"
          className="w-full rounded-full"
          loading={pending}
        >
          {pending ? "Sending..." : "Send reset link"}
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
