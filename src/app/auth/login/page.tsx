"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { FormAlert } from "@/components/auth/form-alert";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Input } from "@/components/UI/Input";
import { Button } from "@/components/UI/Button";
import { Separator } from "@/components/UI/Separator";
import { login, type LoginState } from "@/actions/auth/login";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to keep building your portfolio.">
      <form action={formAction} className="space-y-4">
        <Input id="email" name="email" type="email" label="Email" autoComplete="email" required />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          required
        />

        {state.error && <FormAlert>{state.error}</FormAlert>}

        <Button type="submit" variant="gradient" className="w-full" loading={pending}>
          {pending ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-caption">OR</span>
        <Separator className="flex-1" />
      </div>

      <OAuthButtons />

      <div className="mt-6 text-center">
        <Link href="/auth/forgot-password" className="text-small hover:text-foreground">
          Forgot password?
        </Link>
      </div>

      <p className="text-small mt-8 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="font-medium text-primary hover:text-primary-hover">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}
