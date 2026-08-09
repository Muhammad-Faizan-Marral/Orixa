import { portfolioRepository } from "@/repositories/portfolio.repository";

class PortfolioService {
  async getUserPortfolios(profileId: string) {
    return portfolioRepository.findByProfileId(profileId);
  }

  async getPortfolio(id: string) {
    return portfolioRepository.findById(id);
  }

  async getPortfolioBySlug(profileId: string, slug: string) {
    return portfolioRepository.findByProfileAndSlug(profileId, slug);
  }
}

export const portfolioService = new PortfolioService();