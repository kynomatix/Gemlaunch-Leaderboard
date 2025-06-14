import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  username: text("username"),
  totalPoints: integer("total_points").default(0).notNull(),
  referralCode: text("referral_code").unique(),
  referredBy: integer("referred_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  activityType: text("activity_type").notNull(), // 'token_creation', 'fair_launch', 'presale', 'dutch_auction', 'volume_contribution', 'referral'
  points: integer("points").notNull(),
  transactionHash: text("transaction_hash"),
  blockNumber: integer("block_number"),
  metadata: jsonb("metadata"), // Additional activity-specific data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull(),
  refereeId: integer("referee_id").notNull(),
  pointsEarned: integer("points_earned").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accolades = pgTable("accolades", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  accoladeType: text("accolade_type").notNull(), // 'launch_pioneer', 'referral_champion', 'volume_trader'
  level: integer("level").default(1).notNull(),
  multiplier: decimal("multiplier", { precision: 3, scale: 2 }).default("0.00").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

export const pointConfigs = pgTable("point_configs", {
  id: serial("id").primaryKey(),
  activityType: text("activity_type").notNull().unique(),
  basePoints: integer("base_points").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const blockchainEvents = pgTable("blockchain_events", {
  id: serial("id").primaryKey(),
  transactionHash: text("transaction_hash").notNull().unique(),
  blockNumber: integer("block_number").notNull(),
  eventType: text("event_type").notNull(),
  contractAddress: text("contract_address").notNull(),
  userAddress: text("user_address").notNull(),
  processed: boolean("processed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  activities: many(activities),
  referralsGiven: many(referrals, { relationName: "referrer" }),
  referralsReceived: many(referrals, { relationName: "referee" }),
  accolades: many(accolades),
  referrer: one(users, {
    fields: [users.referredBy],
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
  updatedAt: true,
});

export const insertBlockchainEventSchema = createInsertSchema(blockchainEvents).omit({
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
