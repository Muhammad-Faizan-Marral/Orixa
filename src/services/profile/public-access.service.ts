import { settingsRepository } from "@/repositories/settings.repository";
import { profileRepository } from "@/repositories/profile.repository";

export async function isProfilePublicByUsername(username: string) {
  const profile = await profileRepository.findByUsername(username);
  if (!profile) return { profile: null, isPublic: false };

  const settings = await settingsRepository.createIfNotExists(profile.id);
  const isPublic = settings?.publicProfile !== false;

  return { profile, isPublic };
}

export async function isProfilePublicByProfileId(profileId: string) {
  const settings = await settingsRepository.createIfNotExists(profileId);
  return settings?.publicProfile !== false;
}
