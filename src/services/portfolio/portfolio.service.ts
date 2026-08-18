import { portfolioRepository } from "@/repositories/portfolio.repository";
import {
  UpdatePortfolioDataInput,
  updatePortfolioDataSchema,
} from "@/validations/portfolio-data.schema";
import {
  createPortfolioSchema,
  portfolioSlugSchema,
  type CreatePortfolioInput,
  type UpdatePortfolioInput,
} from "@/validations/portfolio.schema";

export class PortfolioService {
  async getUserPortfolios(profileId: string) {
    return portfolioRepository.findByProfileId(profileId);
  }

  async getPortfolio(id: string) {
    return portfolioRepository.findById(id);
  }

  async getPortfolioForUser(id: string, profileId: string) {
    return portfolioRepository.findByIdAndProfileId(id, profileId);
  }

  async getPortfolioWithData(id: string, profileId: string) {
    return portfolioRepository.findWithData(id, profileId);
  }

  async isSlugAvailable(
    profileId: string,
    slug: string,
    excludePortfolioId?: string,
  ) {
    const parsedSlug = portfolioSlugSchema.parse(slug);

    const existing = await portfolioRepository.findByProfileAndSlug(
      profileId,
      parsedSlug,
    );

    if (!existing) {
      return true;
    }

    if (excludePortfolioId && existing.id === excludePortfolioId) {
      return true;
    }

    return false;
  }

  async createPortfolio(profileId: string, input: CreatePortfolioInput) {
    const data = createPortfolioSchema.parse(input);

    const existing = await portfolioRepository.findByProfileAndSlug(
      profileId,
      data.slug,
    );

    if (existing) {
      throw new Error("This portfolio slug is already in use.");
    }

    return portfolioRepository.create(profileId, {
      title: data.title,
      slug: data.slug,
      headline: data.headline,
      about: data.about,
      theme: data.theme,
    });
  }

  async updatePortfolio(
    id: string,
    profileId: string,
    input: UpdatePortfolioInput,
  ) {
    const portfolio = await portfolioRepository.findByIdAndProfileId(
      id,
      profileId,
    );

    if (!portfolio) {
      throw new Error("Portfolio not found.");
    }

    const slug = portfolioSlugSchema.parse(input.slug);

    const slugAvailable = await this.isSlugAvailable(profileId, slug, id);

    if (!slugAvailable) {
      throw new Error("This portfolio slug is already in use.");
    }

    return portfolioRepository.update(id, profileId, {
      title: input.title,
      slug,
      headline: input.headline,
      about: input.about,
      theme: input.theme,
    });
  }

  async publishPortfolio(id: string, profileId: string) {
    const portfolio = await portfolioRepository.findByIdAndProfileId(
      id,
      profileId,
    );

    if (!portfolio) {
      throw new Error("Portfolio not found.");
    }

    if (portfolio.status === "archived") {
      throw new Error(
        "Archived portfolios must be restored before publishing.",
      );
    }

    if (portfolio.status === "published") {
      return portfolio;
    }

    const updated = await portfolioRepository.publish(id, profileId);

    if (!updated) {
      throw new Error("Unable to publish portfolio.");
    }

    return updated;
  }

  async unpublishPortfolio(id: string, profileId: string) {
    const portfolio = await portfolioRepository.findByIdAndProfileId(
      id,
      profileId,
    );

    if (!portfolio) {
      throw new Error("Portfolio not found.");
    }

    if (portfolio.status === "draft") {
      return portfolio;
    }

    if (portfolio.status === "archived") {
      throw new Error("Archived portfolios cannot be unpublished.");
    }

    const updated = await portfolioRepository.unpublish(id, profileId);

    if (!updated) {
      throw new Error("Unable to unpublish portfolio.");
    }

    return updated;
  }

  async archivePortfolio(id: string, profileId: string) {
    const portfolio = await portfolioRepository.findByIdAndProfileId(
      id,
      profileId,
    );

    if (!portfolio) {
      throw new Error("Portfolio not found.");
    }

    if (portfolio.status === "archived") {
      return portfolio;
    }

    const updated = await portfolioRepository.archive(id, profileId);

    if (!updated) {
      throw new Error("Unable to archive portfolio.");
    }

    return updated;
  }

  async restorePortfolio(id: string, profileId: string) {
    const portfolio = await portfolioRepository.findByIdAndProfileId(
      id,
      profileId,
    );

    if (!portfolio) {
      throw new Error("Portfolio not found.");
    }

    if (portfolio.status !== "archived") {
      throw new Error("Only archived portfolios can be restored.");
    }

    const updated = await portfolioRepository.restore(id, profileId);

    if (!updated) {
      throw new Error("Unable to restore portfolio.");
    }

    return updated;
  }

  async updatePortfolioData(
    portfolioId: string,
    profileId: string,
    input: UpdatePortfolioDataInput,
  ) {
    const data = updatePortfolioDataSchema.parse(input);

    const portfolio = await portfolioRepository.findByIdAndProfileId(
      portfolioId,
      profileId,
    );

    if (!portfolio) {
      throw new Error("Portfolio not found.");
    }

    return portfolioRepository.updateData(portfolioId, profileId, {
      headline: data.headline || null,
      about: data.about || null,
      projects: data.projects,
      experience: data.experience,
      skills: data.skills,
      education: data.education,
      certificates: data.certificates,
      resumeUrl: data.resumeUrl || null,
      theme: data.theme,
      animations: data.animations,
      componentSelection: data.componentSelection,
      designPreferences: data.designPreferences,
      seo: data.seo,
    });
  }
}

export const portfolioService = new PortfolioService();
