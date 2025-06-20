import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  walletAddress: text("wallet_address").notNull().unique(),
  username: text("username"),
  displayName: text("display_name"),
  avatar: text("avatar"), // Base64 compressed image or URL
  bio: text("bio"),
  twitterHandle: text("twitter_handle"),
  telegramHandle: text("telegram_handle"),
  discordHandle: text("discord_handle"),
  websiteUrl: text("website_url"),
  customReferralCode: text("custom_referral_code").unique(),
  totalPoints: integer("total_points").default(0).notNull(),
  referralCode: text("referral_code").unique(),
  referredBy: integer("referred_by"),
  isInfluencer: integer("is_influencer", { mode: 'boolean' }).default(false).notNull(),
  isMainAccount: integer("is_main_account", { mode: 'boolean' }).default(true).notNull(),
  parentUserId: integer("parent_user_id"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  activityType: text("activity_type").notNull(), // 'token_creation', 'fair_launch', 'presale', 'dutch_auction', 'volume_contribution', 'referral', 'social_mention', 'social_share'
  points: integer("points").notNull(),
  transactionHash: text("transaction_hash"),
  blockNumber: integer("block_number"),
  metadata: text("metadata"), // JSON string for additional activity-specific data
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const referrals = sqliteTable("referrals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  referrerId: integer("referrer_id").notNull(),
  refereeId: integer("referee_id").notNull(),
  pointsEarned: integer("points_earned").default(0).notNull(),
  isQualified: integer("is_qualified", { mode: 'boolean' }).default(false).notNull(), // Must invest $20+ or create token/presale
  qualificationAmount: real("qualification_amount").default(0.00).notNull(), // Investment amount for qualification
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const accolades = sqliteTable("accolades", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  accoladeType: text("accolade_type").notNull(), // 'launch_pioneer', 'referral_champion', 'volume_trader'
  level: integer("level").default(1).notNull(),
  multiplier: real("multiplier").default(0.00).notNull(),
  unlockedAt: text("unlocked_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const pointConfigs = sqliteTable("point_configs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  activityType: text("activity_type").notNull().unique(),
  basePoints: integer("base_points").notNull(),
  description: text("description"),
  isActive: integer("is_active", { mode: 'boolean' }).default(true).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const blockchainEvents = sqliteTable("blockchain_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventType: text("event_type").notNull(),
  transactionHash: text("transaction_hash").notNull(),
  blockNumber: integer("block_number").notNull(),
  userAddress: text("user_address").notNull(),
  metadata: text("metadata"), // JSON string
  processed: integer("processed", { mode: 'boolean' }).default(false).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Multiple wallet addresses per user for project founders
export const userWallets = sqliteTable("user_wallets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  walletAddress: text("wallet_address").notNull().unique(),
  label: text("label"), // "Main Wallet", "Project Alpha", "DeFi Ventures", etc.
  isPrimary: integer("is_primary", { mode: 'boolean' }).default(false).notNull(),
  isActive: integer("is_active", { mode: 'boolean' }).default(true).notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Relations remain the same
export const usersRelations = relations(users, ({ many, one }) => ({
  activities: many(activities),
  referralsGiven: many(referrals, { relationName: "referrer" }),
  referralsReceived: many(referrals, { relationName: "referee" }),
  accolades: many(accolades),
  wallets: many(userWallets),
  referrer: one(users, {
    fields: [users.referredBy],
    references: [users.id],
  }),
}));

export const userWalletsRelations = relations(userWallets, ({ one }) => ({
  user: one(users, {
    fields: [userWallets.userId],
    references: [users.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
    relationName: "referrer",
  }),
  referee: one(users, {
    fields: [referrals.refereeId],
    references: [users.id],
    relationName: "referee",
  }),
}));

export const accoladesRelations = relations(accolades, ({ one }) => ({
  user: one(users, {
    fields: [accolades.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
});

export const insertAccoladeSchema = createInsertSchema(accolades).omit({
  id: true,
  unlockedAt: true,
});

export const insertPointConfigSchema = createInsertSchema(pointConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlockchainEventSchema = createInsertSchema(blockchainEvents).omit({
  id: true,
  createdAt: true,
});

export const insertUserWalletSchema = createInsertSchema(userWallets).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Accolade = typeof accolades.$inferSelect;
export type InsertAccolade = z.infer<typeof insertAccoladeSchema>;
export type PointConfig = typeof pointConfigs.$inferSelect;
export type InsertPointConfig = z.infer<typeof insertPointConfigSchema>;
export type BlockchainEvent = typeof blockchainEvents.$inferSelect;
export type InsertBlockchainEvent = z.infer<typeof insertBlockchainEventSchema>;
export type UserWallet = typeof userWallets.$inferSelect;
export type InsertUserWallet = z.infer<typeof insertUserWalletSchema>;