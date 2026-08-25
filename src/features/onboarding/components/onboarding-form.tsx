"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";

import { createProfile } from "@/actions/profile/create-profile";
import { createProfileSchema } from "@/validations/profile.schema";
import { Button } from "@/components/UI/Button";

import { DEFAULT_PROFILE_VALUES } from "../constants";
import type { OnboardingFormValues } from "../types";
import { IdentityFields, ProfessionalFields } from "./profile-form";
import { UsernameField } from "./username-field";
import { SubmitButton } from "./submit-button";
import { OnboardingProgress } from "./onboarding-progress";
import { useUsernameCheck } from "../hooks/use-username-check";

const STEPS = ["Welcome", "Identity", "Username", "Professional info", "Ready"];

const STEP_FIELDS: (keyof OnboardingFormValues)[][] = [
  [],
  ["fullName", "avatarUrl"],
  ["username"],
  ["headline", "bio", "location"],
  [],
];

const transition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: DEFAULT_PROFILE_VALUES,
    mode: "onBlur",
  });

  const username = form.watch("username");
  const usernameCheck = useUsernameCheck(username);
  const isLastStep = step === STEPS.length - 1;

  async function goNext() {
    const fields = STEP_FIELDS[step];
    const valid = fields.length ? await form.trigger(fields) : true;
    if (!valid) return;

    if (step === 2 && !usernameCheck.isAvailable) {
      form.setError("username", {
        type: "validate",
        message:
          usernameCheck.status === "unavailable"
            ? "Username is already taken."
            : "Please wait until the username is verified.",
      });
      return;
    }

    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const onSubmit = async (data: OnboardingFormValues) => {
    setServerError(null);

    if (!usernameCheck.isAvailable) {
      setStep(2);
      form.setError("username", {
        type: "validate",
        message: "Please confirm an available username first.",
      });
      return;
    }

    try {
      const result = await createProfile(data);

      if (result?.success === false) {
        setServerError(result.message);
      }
    } catch {
      setServerError("Unable to create your profile. Please try again.");
    }
  };

  const values = form.getValues();

  return (
    <div>
      {step > 0 && <OnboardingProgress steps={STEPS} currentStep={step} />}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isLastStep) e.preventDefault();
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={transition}
          >
            {step === 0 && (
              <div className="py-2 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-ion text-2xl">
                  👋
                </div>
                <h2 className="text-h3 mt-5">Welcome to Orixa</h2>
                <p className="text-body mt-2 text-muted-foreground">
                  This takes about a minute. We&rsquo;ll set up your identity,
                  your username and a bit about your work — you can edit
                  everything later from your dashboard.
                </p>
              </div>
            )}

            {step === 1 && (
              <IdentityFields
                register={form.register}
                errors={form.formState.errors}
                disabled={form.formState.isSubmitting}
              />
            )}

            {step === 2 && (
              <UsernameField
                registration={form.register("username")}
                value={username}
                error={form.formState.errors.username?.message}
                disabled={form.formState.isSubmitting}
              />
            )}

            {step === 3 && (
              <ProfessionalFields
                register={form.register}
                errors={form.formState.errors}
                disabled={form.formState.isSubmitting}
              />
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-h3">You&rsquo;re all set</h2>
                <p className="text-body text-muted-foreground">
                  Here&rsquo;s what we have — confirm to create your profile.
                </p>
                <dl className="surface-panel space-y-3 p-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Username</dt>
                    <dd className="font-medium">orixa.ai/{values.username}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="font-medium">{values.fullName || "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Headline</dt>
                    <dd className="text-right font-medium">{values.headline || "—"}</dd>
                  </div>
                </dl>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {serverError && (
          <p role="alert" className="mt-4 rounded-lg border border-error/20 bg-error/10 px-3 py-2.5 text-sm text-error">
            {serverError}
          </p>
        )}

        <div className="mt-8 flex items-center gap-3">
          {step > 0 && (
            <Button type="button" variant="secondary" onClick={goBack}>
              Back
            </Button>
          )}

          {!isLastStep ? (
            <Button type="button" variant="gradient" className="flex-1" onClick={goNext}>
              {step === 0 ? "Get started" : "Continue"}
            </Button>
          ) : (
            <div className="flex-1">
              <SubmitButton
                pending={form.formState.isSubmitting}
                disabled={form.formState.isSubmitting || !usernameCheck.isAvailable}
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
