import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { ProfileEditForm } from "@/features/profile/components/profile-edit-form";

export default async function ProfilePage() {
  const user = await requireUser();

  const profile =
    await requireProfile();

  return (
    <main>
      <h1>Profile</h1>

      <p>
        Manage your public Orixa identity.
      </p>

      <ProfileEditForm profile={profile} />
    </main>
  );
}