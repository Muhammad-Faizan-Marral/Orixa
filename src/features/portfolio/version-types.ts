export type PortfolioVersion = {
  id: string;
  portfolioId: string;
  version: number;
  configJson: unknown;
  published: boolean;
  createdAt: string;
};