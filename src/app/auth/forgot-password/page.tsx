"use client";

import Link from "next/link";
import { useActionState } from "react";

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
      <main>
        <h1>Check your email</h1>

        <p>
          If an account exists for this email, we sent a password
          reset link.
        </p>

        <Link href="/auth/login">
          Back to login
        </Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Forgot your password?</h1>

      <p>
        Enter your email address and we&apos;ll send you a reset
        link.
      </p>

      <form action={formAction}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>

        {state.error && (
          <p role="alert">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending}>
          {pending ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <Link href="/auth/login">
        Back to login
      </Link>
    </main>
  );
}