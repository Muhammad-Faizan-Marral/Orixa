import { cache } from "react";
import { redirect } from "next/navigation";

import { requireUser } from "./require-user";
import { profileService } from "@/services/profile/profile.service";

export const requireProfile = cache(async () => {
  const user = await requireUser();

  let profile;

  try {
    profile = await profileService.getProfile(user.id);
  } catch (err) {
    console.error("[requireProfile] DB error for user", user.id, err);
    throw new Error(
      "Unable to load your profile. Check DATABASE_URL / Supabase connection and try again.",
    );
  }
  if (!profile) {
    redirect("/onboarding");
  }

  return profile;
});
