"use client";

import Link from "next/link";
import { useActionState } from "react";
import { OAuthButtons } from "../../../components/auth/oauth-buttons";
import {
  login,
  type LoginState,
} from "@/actions/auth/login";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    login,
    initialState,
  );

  return (
    <main>
      <h1>Login to Orixa AI</h1>

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

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        {state.error && (
          <p role="alert">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending}>
          {pending ? "Logging in..." : "Login"}
        </button>
      </form>
<OAuthButtons />
      <div>
        <Link href="/auth/forgot-password">
          Forgot password?
        </Link>
      </div>

      <p>
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup">
          Create account
        </Link>
      </p>
    </main>
  );
}