import { 
  users, 
  activities, 
  referrals, 
  accolades, 
  pointConfigs, 
  blockchainEvents,
  type User, 
  type InsertUser,
  type Activity,
  type InsertActivity,
  type Referral,
  type InsertReferral,
  type Accolade,
  type InsertAccolade,
  type PointConfig,
  type InsertPointConfig,
  type BlockchainEvent,
  type InsertBlockchainEvent
} from "@shared/schema";
import { db } from "./sqlite-db";
import { eq, desc, sql, sum, count, and, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<void>;
  updateUserProfile(walletAddress: string, profileData: Partial<User>): Promise<User>;
  
  // User wallet operations
  getUserWallets(userId: number): Promise<UserWallet[]>;
  addUserWallet(wallet: InsertUserWallet): Promise<UserWallet>;
  removeUserWallet(walletId: number): Promise<void>;
  
  // Leaderboard operations
  getLeaderboard(limit?: number): Promise<Array<User & { rank: number }>>;
  getUserRank(userId: number): Promise<number>;
  
  // Activity operations
  createActivity(activity: InsertActivity): Promise<Activity>;
  getUserActivities(userId: number, limit?: number): Promise<Activity[]>;
  getRecentActivities(limit?: number): Promise<Array<Activity & { user: User }>>;
  
  // Referral operations
  createReferral(referral: InsertReferral): Promise<Referral>;
  getUserReferrals(userId: number): Promise<Array<Referral & { referee: User }>>;
  getReferralStats(userId: number): Promise<{ count: number; totalPoints: number }>;
  
  // Accolade operations
  getUserAccolades(userId: number): Promise<Accolade[]>;
  createAccolade(accolade: InsertAccolade): Promise<Accolade>;
  
  // Point config operations
  getPointConfigs(): Promise<PointConfig[]>;
  updatePointConfig(activityType: string, basePoints: number): Promise<void>;
  
  // Blockchain operations
  createBlockchainEvent(event: InsertBlockchainEvent): Promise<BlockchainEvent>;
  getUnprocessedEvents(): Promise<BlockchainEvent[]>;
  markEventProcessed(eventId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        referralCode: this.generateReferralCode(),
      })
      .returning();

    // Check if this is one of the first 50 users and award Gemlaunch Pioneer accolade
    const userCountResult = await db.select({ count: count() }).from(users);
    const totalUsers = userCountResult[0].count;
    
    if (totalUsers <= 50) {
      // Create Gemlaunch Pioneer accolade
      try {
        await this.createAccolade({
          userId: user.id,
          accoladeType: 'gemlaunch_pioneer',
          level: 1,
          multiplier: 1.10
        });

        // Create activity for receiving the accolade
        await this.createActivity({
          userId: user.id,
          activityType: 'accolade_earned',
          points: 100,
          metadata: JSON.stringify({ 
            accoladeType: 'gemlaunch_pioneer', 
            description: 'Earned Gemlaunch Pioneer status as one of the first 50 users!' 
          })
        });
      } catch (error) {
        console.error('Error creating Gemlaunch Pioneer accolade:', error);
      }
    }

    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        totalPoints: sql`${users.totalPoints} + ${points}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async getLeaderboard(limit = 100): Promise<Array<User & { rank: number; accolades: Accolade[] }>> {
    // Get all users ordered by points
    const rankedUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.totalPoints))
      .limit(limit);
    
    // Add rank numbers
    const rankedUsersWithRank = rankedUsers.map((user, index) => ({
      ...user,
      rank: index + 1
    }));
    
    // Get all accolades for these users
    let userAccolades: Accolade[] = [];
    
    if (rankedUsers.length > 0) {
      userAccolades = await db
        .select()
        .from(accolades);
    }
    
    // Group accolades by user ID
    const accoladesByUser: Record<number, Accolade[]> = {};
    userAccolades.forEach(accolade => {
      if (!accoladesByUser[accolade.userId]) {
        accoladesByUser[accolade.userId] = [];
      }
      accoladesByUser[accolade.userId].push(accolade);
    });
    
    // Combine users with their accolades
    return rankedUsersWithRank.map(user => ({
      ...user,
      accolades: accoladesByUser[user.id] || []
    }));
  }

  async getUserRank(userId: number): Promise<number> {
    // Get user's points
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (!user[0]) return 0;
    
    // Count users with more points
    const higherRanked = await db
      .select({ count: count() })
      .from(users)
      .where(sql`${users.totalPoints} > ${user[0].totalPoints}`);
    
    return higherRanked[0].count + 1;
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db
      .insert(activities)
      .values(activity)
      .returning();
    
    // Update user points
    await this.updateUserPoints(activity.userId, activity.points);
    
    return newActivity;
  }

  async getUserActivities(userId: number, limit = 50): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async getRecentActivities(limit = 20): Promise<Array<Activity & { user: User }>> {
    return await db
      .select({
        ...activities,
        user: users
      })
      .from(activities)
      .innerJoin(users, eq(activities.userId, users.id))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createReferral(referral: InsertReferral): Promise<Referral> {
    const [newReferral] = await db
      .insert(referrals)
      .values(referral)
      .returning();
    
    // Award referral points to referrer
    await this.updateUserPoints(referral.referrerId, 500);
    
    return newReferral;
  }

  async getUserReferrals(userId: number): Promise<Array<Referral & { referee: User }>> {
    return await db
      .select({
        ...referrals,
        referee: users
      })
      .from(referrals)
      .innerJoin(users, eq(referrals.refereeId, users.id))
      .where(eq(referrals.referrerId, userId))
      .orderBy(desc(referrals.createdAt));
  }

  async getReferralStats(userId: number): Promise<{ count: number; totalPoints: number }> {
    const result = await db
      .select({
        count: count(),
        totalPoints: sum(referrals.pointsEarned)
      })
      .from(referrals)
      .where(eq(referrals.referrerId, userId));
    
    return {
      count: result[0]?.count || 0,
      totalPoints: Number(result[0]?.totalPoints) || 0
    };
  }

  async getUserAccolades(userId: number): Promise<Accolade[]> {
    return await db
      .select()
      .from(accolades)
      .where(eq(accolades.userId, userId));
  }

  async createAccolade(accolade: InsertAccolade): Promise<Accolade> {
    const [newAccolade] = await db
      .insert(accolades)
      .values(accolade)
      .returning();
    return newAccolade;
  }

  async getPointConfigs(): Promise<PointConfig[]> {
    return await db
      .select()
      .from(pointConfigs)
      .where(eq(pointConfigs.isActive, true));
  }

  async updatePointConfig(activityType: string, basePoints: number): Promise<void> {
    await db
      .update(pointConfigs)
      .set({ 
        basePoints,
        updatedAt: new Date()
      })
      .where(eq(pointConfigs.activityType, activityType));
  }

  async createBlockchainEvent(event: InsertBlockchainEvent): Promise<BlockchainEvent> {
    const [newEvent] = await db
      .insert(blockchainEvents)
      .values(event)
      .returning();
    return newEvent;
  }

  async getUnprocessedEvents(): Promise<BlockchainEvent[]> {
    return await db
      .select()
      .from(blockchainEvents)
      .where(eq(blockchainEvents.processed, false))
      .orderBy(blockchainEvents.blockNumber);
  }

  async markEventProcessed(eventId: number): Promise<void> {
    await db
      .update(blockchainEvents)
      .set({ processed: true })
      .where(eq(blockchainEvents.id, eventId));
  }

  async updateUserProfile(walletAddress: string, profileData: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...profileData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.walletAddress, walletAddress))
      .returning();
    return user;
  }

  async getUserWallets(userId: number): Promise<UserWallet[]> {
    return await db
      .select()
      .from(userWallets)
      .where(eq(userWallets.userId, userId));
  }

  async addUserWallet(wallet: InsertUserWallet): Promise<UserWallet> {
    const [newWallet] = await db
      .insert(userWallets)
      .values(wallet)
      .returning();
    return newWallet;
  }

  async removeUserWallet(walletId: number): Promise<void> {
    await db
      .delete(userWallets)
      .where(eq(userWallets.id, walletId));
  }

  private generateReferralCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}

export const storage = new DatabaseStorage();
