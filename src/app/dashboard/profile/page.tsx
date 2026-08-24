import { requireProfile } from "@/lib/auth/require-profile";
import { requireUser } from "@/lib/auth/require-user";
import { ProfileEditForm } from "@/features/profile/components/profile-edit-form";
import { socialLinkService } from "@/services/profile/social-link.service";
import { SocialLinksManager } from "@/features/profile/components/social-links-manager";
import { FileUpload } from "@/features/profile/components/file-upload";
import { uploadService } from "@/services/profile/upload.service";
import { UploadList } from "@/features/profile/components/upload-list";

export default async function ProfilePage() {
  await requireUser();

  const profile = await requireProfile();
  const socialLinks = await socialLinkService.getSocialLinks(profile.id);
  const uploads = await uploadService.getUploads(profile.id);

  return (
    <main>
      <h1>Profile</h1>
      <p>Manage your public Orixa identity.</p>

      <ProfileEditForm profile={profile} />
      <SocialLinksManager initialLinks={socialLinks} />

      <section>
        <h2>Profile Picture</h2>

        <FileUpload
          type="avatar"
          accept="image/jpeg,image/png,image/webp,image/gif"
          label="Upload Profile Picture"
        />
      </section>

      <section>
        <h2>Your Uploads</h2>
        <UploadList uploads={uploads} />
      </section>
    </main>
  );
}
