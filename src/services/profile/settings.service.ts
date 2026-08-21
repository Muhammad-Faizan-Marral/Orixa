import {
  updateSettingsSchema,
  type UpdateSettingsInput,
} from "@/validations/settings.schema";

import { settingsRepository } from "@/repositories/settings.repository";

export class SettingsService {
  async getSettings(profileId: string) {
    return settingsRepository.createIfNotExists(profileId);
  }

  async updateSettings(profileId: string, input: UpdateSettingsInput) {
    const data = updateSettingsSchema.parse(input);

    const existing = await settingsRepository.createIfNotExists(profileId);

    if (!existing) {
      throw new Error("Unable to initialize settings.");
    }

    return settingsRepository.update(profileId, data);
  }
}

export const settingsService = new SettingsService();
