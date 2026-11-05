"use client";

import Link from "next/link";
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { AUTH_LINK, AuthLayout } from "@/components/auth/auth-layout";
import { FormAlert } from "@/components/auth/form-alert";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Input } from "@/components/UI/Input";
import { Button } from "@/components/UI/Button";
import { Separator } from "@/components/UI/Separator";
import { login, type LoginState } from "@/actions/auth/login";

const initialState: LoginState = {};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const cameFromProtectedRoute = Boolean(next && next !== "/dashboard");
  const resetSuccess = searchParams.get("reset") === "success";

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to keep building your portfolio."
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next ?? ""} />

        {resetSuccess && !state.error && (
          <FormAlert variant="success">
            Password updated. Log in with your new password.
          </FormAlert>
        )}

        {cameFromProtectedRoute && !resetSuccess && !state.error && (
          <FormAlert variant="success">Please log in to continue.</FormAlert>
        )}

        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          required
        />

        <div className="space-y-2">
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
          />
          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {state.error && <FormAlert>{state.error}</FormAlert>}

        <Button
          type="submit"
          variant="gradient"
          className="w-full rounded-full"
          loading={pending}
        >
          {pending ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs font-semibold tracking-wider text-muted-foreground">
          OR
        </span>
        <Separator className="flex-1" />
      </div>

      <OAuthButtons />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className={AUTH_LINK}>
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}
