import { profileRepository } from "@/repositories/profile.repository";
import {
  createProfileSchema,
  updateProfileSchema,
  usernameSchema,
  type CreateProfileInput,
  type UpdateProfileInput,
} from "@/validations/profile.schema";
export class ProfileService {
  async isUsernameAvailable(username: string) {
    const parsed = usernameSchema.parse(username);

    const existing = await profileRepository.findByUsername(parsed);

    return existing === null;
  }

  async getProfile(userId: string) {
    return profileRepository.findByUserId(userId);
  }

  async getProfileByUsername(username: string) {
    return profileRepository.findByUsername(username);
  }

  async profileExists(userId: string) {
    return profileRepository.exists(userId);
  }

  async createProfile(userId: string, input: CreateProfileInput) {
    const data = createProfileSchema.parse(input);

    const alreadyExists = await profileRepository.exists(userId);

    if (alreadyExists) {
      throw new Error("Profile already exists.");
    }

    const usernameTaken = await profileRepository.findByUsername(data.username);

    if (usernameTaken) {
      throw new Error("Username is already taken.");
    }

    return profileRepository.create({
      userId,

      username: data.username,

      fullName: data.fullName || null,

      headline: data.headline || null,

      bio: data.bio || null,

      location: data.location || null,

      avatarUrl: data.avatarUrl || null,
    });
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const data = updateProfileSchema.parse(input);

    const current = await profileRepository.findByUserId(userId);

    if (!current) {
      throw new Error("Profile not found.");
    }

    if (data.username !== current.username) {
      const usernameTaken = await profileRepository.findByUsername(
        data.username,
      );

      if (usernameTaken && usernameTaken.id !== current.id) {
        throw new Error("Username is already taken.");
      }
    }

    return profileRepository.update(userId, {
      username: data.username,
      fullName: data.fullName || null,
      headline: data.headline || null,
      bio: data.bio || null,
      location: data.location || null,
      avatarUrl: data.avatarUrl || null,
    });
  }
  
}

export const profileService = new ProfileService();
