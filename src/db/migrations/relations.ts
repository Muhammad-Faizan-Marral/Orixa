import { relations } from "drizzle-orm/relations";
import { usersInAuth, profiles, portfolios, portfolioData, portfolioViews, portfolioVersions, socialLinks, settings, aiRequests, contactMessages, uploads } from "./schema";

export const profilesRelations = relations(profiles, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [profiles.userId],
		references: [usersInAuth.id]
	}),
	portfolios: many(portfolios),
	socialLinks: many(socialLinks),
	settings: many(settings),
	uploads: many(uploads),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	profiles: many(profiles),
}));

export const portfoliosRelations = relations(portfolios, ({one, many}) => ({
	profile: one(profiles, {
		fields: [portfolios.profileId],
		references: [profiles.id]
	}),
	portfolioData: many(portfolioData),
	portfolioViews: many(portfolioViews),
	portfolioVersions: many(portfolioVersions),
	aiRequests: many(aiRequests),
	contactMessages: many(contactMessages),
}));

export const portfolioDataRelations = relations(portfolioData, ({one}) => ({
	portfolio: one(portfolios, {
		fields: [portfolioData.portfolioId],
		references: [portfolios.id]
	}),
}));

export const portfolioViewsRelations = relations(portfolioViews, ({one}) => ({
	portfolio: one(portfolios, {
		fields: [portfolioViews.portfolioId],
		references: [portfolios.id]
	}),
}));

export const portfolioVersionsRelations = relations(portfolioVersions, ({one}) => ({
	portfolio: one(portfolios, {
		fields: [portfolioVersions.portfolioId],
		references: [portfolios.id]
	}),
}));

export const socialLinksRelations = relations(socialLinks, ({one}) => ({
	profile: one(profiles, {
		fields: [socialLinks.profileId],
		references: [profiles.id]
	}),
}));

export const settingsRelations = relations(settings, ({one}) => ({
	profile: one(profiles, {
		fields: [settings.profileId],
		references: [profiles.id]
	}),
}));

export const aiRequestsRelations = relations(aiRequests, ({one}) => ({
	portfolio: one(portfolios, {
		fields: [aiRequests.portfolioId],
		references: [portfolios.id]
	}),
}));

export const contactMessagesRelations = relations(contactMessages, ({one}) => ({
	portfolio: one(portfolios, {
		fields: [contactMessages.portfolioId],
		references: [portfolios.id]
	}),
}));

export const uploadsRelations = relations(uploads, ({one}) => ({
	profile: one(profiles, {
		fields: [uploads.profileId],
		references: [profiles.id]
	}),
}));