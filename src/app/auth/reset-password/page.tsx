"use client";

import Link from "next/link";
import { useActionState } from "react";

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
    <main>
      <h1>Set a new password</h1>

      <form action={formAction}>
        <div>
          <label htmlFor="password">
            New password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">
            Confirm password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        {state.error && (
          <p role="alert">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending}>
          {pending ? "Updating..." : "Update password"}
        </button>
      </form>

      <Link href="/auth/login">
        Back to login
      </Link>
    </main>
  );
}