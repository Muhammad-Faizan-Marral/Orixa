import { profileRepository } from "@/repositories/profile.repository";
import {
  createProfileSchema,
  usernameSchema,
  type CreateProfileInput,
} from "@/validations/profile.schema";

export class ProfileService {
  async isUsernameAvailable(username: string) {
    const parsed = usernameSchema.parse(username);

    const existing =
      await profileRepository.findByUsername(parsed);

    return existing === null;
  }

  async getProfile(userId: string) {
    return profileRepository.findByUserId(userId);
  }

  async profileExists(userId: string) {
    return profileRepository.exists(userId);
  }

  async createProfile(
    userId: string,
    input: CreateProfileInput,
  ) {
    const data = createProfileSchema.parse(input);

    const alreadyExists =
      await profileRepository.exists(userId);

    if (alreadyExists) {
      throw new Error("Profile already exists.");
    }

    const usernameTaken =
      await profileRepository.findByUsername(
        data.username,
      );

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

  async updateProfile(
    userId: string,
    data: Partial<CreateProfileInput>,
  ) {
    return profileRepository.update(userId, data);
  }
}

export const profileService = new ProfileService();