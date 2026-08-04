import { relations } from "drizzle-orm";

import {
  authUsers,
  profiles,
  portfolios,
  portfolioData,
  portfolioViews,
  portfolioVersions,
  socialLinks,
  settings,
  uploads,
  aiRequests,
  contactMessages,
} from "./index";

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(authUsers, {
    fields: [profiles.userId],
    references: [authUsers.id],
  }),

  portfolios: many(portfolios),
  socialLinks: many(socialLinks),
  settings: one(settings),
  uploads: many(uploads),
}));

export const authUsersRelations = relations(authUsers, ({ one }) => ({
  profile: one(profiles),
}));

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [portfolios.profileId],
    references: [profiles.id],
  }),

  portfolioData: one(portfolioData),

  portfolioViews: many(portfolioViews),

  portfolioVersions: many(portfolioVersions),

  aiRequests: many(aiRequests),

  contactMessages: many(contactMessages),
}));

export const portfolioDataRelations = relations(portfolioData, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [portfolioData.portfolioId],
    references: [portfolios.id],
  }),
}));

export const portfolioViewsRelations = relations(portfolioViews, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [portfolioViews.portfolioId],
    references: [portfolios.id],
  }),
}));

export const portfolioVersionsRelations = relations(
  portfolioVersions,
  ({ one }) => ({
    portfolio: one(portfolios, {
      fields: [portfolioVersions.portfolioId],
      references: [portfolios.id],
    }),
  }),
);

export const socialLinksRelations = relations(socialLinks, ({ one }) => ({
  profile: one(profiles, {
    fields: [socialLinks.profileId],
    references: [profiles.id],
  }),
}));

export const settingsRelations = relations(settings, ({ one }) => ({
  profile: one(profiles, {
    fields: [settings.profileId],
    references: [profiles.id],
  }),
}));

export const uploadsRelations = relations(uploads, ({ one }) => ({
  profile: one(profiles, {
    fields: [uploads.profileId],
    references: [profiles.id],
  }),
}));

export const aiRequestsRelations = relations(aiRequests, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [aiRequests.portfolioId],
    references: [portfolios.id],
  }),
}));

export const contactMessagesRelations = relations(
  contactMessages,
  ({ one }) => ({
    portfolio: one(portfolios, {
      fields: [contactMessages.portfolioId],
      references: [portfolios.id],
    }),
  }),
);
