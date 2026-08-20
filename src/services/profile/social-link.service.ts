import { ZodError } from "zod";

import { socialLinkRepository } from "@/repositories/social-link.repository";
import {
  socialLinkSchema,
  updateSocialLinkSchema,
  type SocialLinkInput,
  type UpdateSocialLinkInput,
} from "@/validations/social-link.schema";

export class SocialLinkService {
  async getSocialLinks(profileId: string) {
    return socialLinkRepository.findByProfileId(profileId);
  }

  async createSocialLink(profileId: string, input: SocialLinkInput) {
    const data = socialLinkSchema.parse(input);

    return socialLinkRepository.create(profileId, data);
  }

  async updateSocialLink(profileId: string, input: UpdateSocialLinkInput) {
    const data = updateSocialLinkSchema.parse(input);

    return socialLinkRepository.update(data.id, profileId, {
      platform: data.platform,
      url: data.url,
      displayOrder: data.displayOrder,
    });
  }

  async deleteSocialLink(profileId: string, id: string) {
    return socialLinkRepository.delete(id, profileId);
  }
  
}

export const socialLinkService = new SocialLinkService();
