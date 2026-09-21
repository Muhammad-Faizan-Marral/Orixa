"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AuthLayout } from "@/components/auth/auth-layout";
import { FormAlert } from "@/components/auth/form-alert";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Input } from "@/components/UI/Input";
import { Button } from "@/components/UI/Button";
import { Separator } from "@/components/UI/Separator";
import { signup, type SignupState } from "@/actions/auth/signup";
import {  useEffect } from "react";
const initialState: SignupState = {};

export default function SignupPage() {
  
  const [state, formAction, pending] = useActionState(signup, initialState);
  useEffect(() => {
    try {
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref && ref.trim().length >= 3) {
        window.localStorage.setItem("orixa_ref", ref.toLowerCase().trim());
      }
    } catch {
      // ignore
    }
  }, []);
   if (state.success) {
    return (
      <AuthLayout
        title="Confirm your email"
        subtitle="We sent a secure link to your inbox."
      >
        <div className="surface-panel space-y-3 p-5 text-sm text-muted-foreground">
          <p>
            Open the email from <strong className="text-foreground">Orixa AI</strong> and
            click the confirmation link to activate your account.
          </p>
          <p>
            Didn&apos;t get it? Check spam or promotions. The link expires after a
            short time for your security.
          </p>
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
      title="Create your account"
      subtitle="Free to start — publish whenever you're ready."
    >
      <form action={formAction} className="space-y-4">
        <Input
          id="name"
          name="name"
          type="text"
          label="Name"
          autoComplete="name"
          required
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          required
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          minLength={8}
          hint="At least 8 characters with uppercase & number."
          required
        />

        {state.error && <FormAlert>{state.error}</FormAlert>}

        <Button
          type="submit"
          variant="gradient"
          className="w-full"
          loading={pending}
        >
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-caption">OR</span>
        <Separator className="flex-1" />
      </div>

      <OAuthButtons />

      <p className="text-small mt-8 text-center">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-primary hover:text-primary-hover"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
