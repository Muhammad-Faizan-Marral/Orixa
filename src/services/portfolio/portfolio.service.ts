import { portfolioRepository } from "@/repositories/portfolio.repository";
import {
  createPortfolioSchema,
  portfolioSlugSchema,
  type CreatePortfolioInput,
} from "@/validations/portfolio.schema";

export class PortfolioService {
  async getUserPortfolios(profileId: string) {
    return portfolioRepository.findByProfileId(
      profileId,
    );
  }

  async getPortfolio(id: string) {
    return portfolioRepository.findById(id);
  }

  async getPortfolioForUser(
    id: string,
    profileId: string,
  ) {
    return portfolioRepository.findByIdAndProfileId(
      id,
      profileId,
    );
  }

  async isSlugAvailable(
    profileId: string,
    slug: string,
  ) {
    const parsedSlug =
      portfolioSlugSchema.parse(slug);

    const existing =
      await portfolioRepository.findByProfileAndSlug(
        profileId,
        parsedSlug,
      );

    return existing === null;
  }

  async createPortfolio(
    profileId: string,
    input: CreatePortfolioInput,
  ) {
    const data =
      createPortfolioSchema.parse(input);

    const existing =
      await portfolioRepository.findByProfileAndSlug(
        profileId,
        data.slug,
      );

    if (existing) {
      throw new Error(
        "This portfolio slug is already in use.",
      );
    }

    return portfolioRepository.create(
      profileId,
      {
        title: data.title,
        slug: data.slug,
        headline: data.headline,
        about: data.about,
        theme: data.theme,
      },
    );
  }

  async updatePortfolio(
    id: string,
    profileId: string,
    input: {
      title?: string;
      slug?: string;
    },
  ) {
    const data = {
      ...input,
      ...(input.slug
        ? {
            slug: portfolioSlugSchema.parse(
              input.slug,
            ),
          }
        : {}),
    };

    if (data.slug) {
      const existing =
        await portfolioRepository.findByProfileAndSlug(
          profileId,
          data.slug,
        );

      if (existing && existing.id !== id) {
        throw new Error(
          "This portfolio slug is already in use.",
        );
      }
    }

    return portfolioRepository.update(
      id,
      profileId,
      data,
    );
  }

  async archivePortfolio(
    id: string,
    profileId: string,
  ) {
    const portfolio =
      await portfolioRepository.findByIdAndProfileId(
        id,
        profileId,
      );

    if (!portfolio) {
      throw new Error("Portfolio not found.");
    }

    if (portfolio.status === "archived") {
      return portfolio;
    }

    return portfolioRepository.archive(
      id,
      profileId,
    );
  }
  async getPortfolioWithData(
  id: string,
  profileId: string,
) {
  return portfolioRepository.findWithData(
    id,
    profileId,
  );
}
}

export const portfolioService =
  new PortfolioService();