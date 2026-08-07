"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { createProfile } from "@/actions/profile/create-profile";
import { createProfileSchema } from "@/validations/profile.schema";

import { DEFAULT_PROFILE_VALUES } from "../constants";
import type { OnboardingFormValues } from "../types";
import { ProfileForm } from "./profile-form";
import { SubmitButton } from "./submit-button";
import { useUsernameCheck } from "../hooks/use-username-check";

export function OnboardingForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: DEFAULT_PROFILE_VALUES,
    mode: "onBlur",
  });

  const username = form.watch("username");

  const usernameCheck = useUsernameCheck(username);

  const onSubmit = async (data: OnboardingFormValues) => {
    setServerError(null);

    if (!usernameCheck.isAvailable) {
      form.setError("username", {
        type: "validate",
        message:
          usernameCheck.status === "unavailable"
            ? "Username is already taken."
            : "Please wait until the username is verified.",
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

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
    >
      <ProfileForm
        register={form.register}
        watch={form.watch}
        errors={form.formState.errors}
        disabled={form.formState.isSubmitting}
      />

      {serverError && (
        <p role="alert" className="text-sm text-red-500">
          {serverError}
        </p>
      )}

      <SubmitButton
        pending={form.formState.isSubmitting}
        disabled={
          form.formState.isSubmitting ||
          usernameCheck.isChecking ||
          !usernameCheck.isAvailable
        }
      />
    </form>
  );
}
