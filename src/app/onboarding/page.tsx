import { redirect } from "next/navigation";

import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";
import { requireUser } from "@/lib/auth/require-user";
import { profileService } from "@/services/profile/profile.service";

export default async function OnboardingPage() {
  const user = await requireUser();

  const profileExists = await profileService.profileExists(user.id);

  if (profileExists) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Create your profile</h1>

        <p className="text-sm text-gray-500">
          Set up your Orixa AI profile. You can update these details later.
        </p>
      </div>

      <div className="mt-8">
        <OnboardingForm />
      </div>
    </main>
  );
}
