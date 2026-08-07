import { cache } from "react";
import { redirect } from "next/navigation";

import { requireUser } from "./require-user";
import { profileService } from "../../services/profile/profile.service";

export const requireProfile = cache(async () => {
  const user = await requireUser();

  const profile = await profileService.getProfile(user.id);

  if (!profile) {
    redirect("/onboarding");
  }

  return profile;
});
