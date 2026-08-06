"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signup, type SignupState } from "@/actions/auth/signup";

const initialState: SignupState = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  if (state.success) {
    return (
      <main>
        <h1>Check your email</h1>

        <p>
          We sent you a verification link. Please verify your email before
          logging in.
        </p>

        <Link href="/auth/login">Go to login</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Create your Orixa AI account</h1>

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
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        {state.error && <p role="alert">{state.error}</p>}

        <button type="submit" disabled={pending}>
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p>
        Already have an account? <Link href="/auth/login">Login</Link>
      </p>
    </main>
  );
}
