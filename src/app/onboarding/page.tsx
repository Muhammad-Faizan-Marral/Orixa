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
    <main className="bg-aurora relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="bg-grain pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="relative w-full max-w-xl">
        <div className="mb-8 text-center">
          <span className="text-caption text-accent">Step into Orixa</span>
          <h1 className="text-h1 mt-3 text-balance">Let&rsquo;s set up your profile</h1>
          <p className="text-body-lg mt-2 text-balance">
            A few quick details — you can change all of this later.
          </p>
        </div>

        <div className="surface-card shadow-elevated p-6 md:p-8">
          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}
