import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { ProfileEditForm } from "@/features/profile/components/profile-edit-form";
import { socialLinkService } from "@/services/profile/social-link.service";
import { SocialLinksManager } from "@/features/profile/components/social-links-manager";

export default async function ProfilePage() {
  const user = await requireUser();

  const profile = await requireProfile();
  const socialLinks = await socialLinkService.getSocialLinks(profile.id);
  return (
    <main>
      <h1>Profile</h1>

      <p>Manage your public Orixa identity.</p>

      <ProfileEditForm profile={profile} />
      <SocialLinksManager initialLinks={socialLinks} />
    </main>
  );
}
