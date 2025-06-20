import { 
  users, 
  activities, 
  referrals, 
  accolades, 
  pointConfigs, 
  blockchainEvents,
  userWallets,
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
  type InsertBlockchainEvent,
  type UserWallet,
  type InsertUserWallet
} from "@shared/schema";
import { db } from "./sqlite-db";
import { eq, desc, sql, sum, count, and, inArray } from "drizzle-orm";
import { ACCOLADES } from "@shared/accolades";

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
  getReferralLeaderboard(limit?: number): Promise<Array<{ user: User; qualifiedReferrals: number; totalReferralPoints: number; rank: number }>>;
  
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
  
  // Admin operations
  deleteUser(userId: number): Promise<void>;
  getAllAccolades(): Promise<Array<Accolade & { user: User }>>;
  resetPioneerAccolades(): Promise<void>;
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
        updatedAt: new Date().toISOString()
      })
      .where(eq(users.id, userId));
  }

  async getLeaderboard(limit = 100): Promise<Array<User & { rank: number; accolades: Accolade[] }>> {
    // Get all users with their wallet information
    const usersWithWallets = await db
      .select({
        id: users.id,
        walletAddress: users.walletAddress,
        username: users.username,
        displayName: users.displayName,
        totalPoints: users.totalPoints,
        referralCode: users.referralCode,
        customReferralCode: users.customReferralCode,
        bio: users.bio,
        websiteUrl: users.websiteUrl,
        twitterHandle: users.twitterHandle,
        discordHandle: users.discordHandle,
        telegramHandle: users.telegramHandle,
        avatar: users.avatar,
        referredBy: users.referredBy,
        isInfluencer: users.isInfluencer,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        isMainAccount: users.isMainAccount,
        parentUserId: users.parentUserId
      })
      .from(users);

    // Filter to only main accounts and consolidate points from connected wallets
    const mainAccounts = usersWithWallets.filter(user => user.isMainAccount);
    const consolidatedUsers = mainAccounts.map(mainAccount => {
      // Find all connected wallets for this main account
      const connectedWallets = usersWithWallets.filter(user => 
        user.parentUserId === mainAccount.id
      );
      
      // Sum points from main account and all connected wallets
      const totalConsolidatedPoints = mainAccount.totalPoints + 
        connectedWallets.reduce((sum, wallet) => sum + wallet.totalPoints, 0);
      
      return {
        ...mainAccount,
        totalPoints: totalConsolidatedPoints
      };
    });

    // Sort by consolidated points and add rank
    const rankedUsers = consolidatedUsers
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));
    
    // Get all accolades for these users and their connected wallets
    let userAccolades: Accolade[] = [];
    
    if (rankedUsers.length > 0) {
      const allUserIds = rankedUsers.flatMap(user => {
        const connectedWallets = usersWithWallets.filter(u => u.parentUserId === user.id);
        return [user.id, ...connectedWallets.map(w => w.id)];
      });
      
      userAccolades = await db
        .select()
        .from(accolades)
        .where(inArray(accolades.userId, allUserIds));
    }
    
    // Group accolades by main user ID (consolidate accolades from connected wallets)
    const accoladesByUser: Record<number, Accolade[]> = {};
    userAccolades.forEach(accolade => {
      // Find the main account for this accolade
      const walletUser = usersWithWallets.find(u => u.id === accolade.userId);
      const mainAccountId = walletUser?.parentUserId || walletUser?.id;
      
      if (mainAccountId) {
        if (!accoladesByUser[mainAccountId]) {
          accoladesByUser[mainAccountId] = [];
        }
        accoladesByUser[mainAccountId].push(accolade);
      }
    });
    
    // Combine users with their consolidated accolades
    return rankedUsers.map(user => ({
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
      .values({
        userId: activity.userId,
        activityType: activity.activityType,
        points: activity.points,
        transactionHash: activity.transactionHash || null,
        blockNumber: activity.blockNumber || null,
        metadata: activity.metadata || null
      })
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
        updatedAt: new Date().toISOString()
      })
      .where(eq(pointConfigs.activityType, activityType));
  }

  async getReferralLeaderboard(limit = 100): Promise<Array<{ user: User; qualifiedReferrals: number; totalReferralPoints: number; rank: number }>> {
    // For now, return empty array since there are no referrals yet
    // This will show the "No qualified referrals yet" message
    return [];
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

  async deleteUser(userId: number): Promise<void> {
    // Delete related records first
    await db.delete(accolades).where(eq(accolades.userId, userId));
    await db.delete(activities).where(eq(activities.userId, userId));
    await db.delete(referrals).where(eq(referrals.referrerId, userId));
    await db.delete(referrals).where(eq(referrals.refereeId, userId));
    await db.delete(userWallets).where(eq(userWallets.userId, userId));
    
    // Delete the user
    await db.delete(users).where(eq(users.id, userId));
  }

  async getAllAccolades(): Promise<Array<any>> {
    const result = await db
      .select({
        accolade: accolades,
        user: users
      })
      .from(accolades)
      .innerJoin(users, eq(accolades.userId, users.id))
      .orderBy(users.createdAt);
    
    return result.map(r => ({
      ...r.accolade,
      user: r.user
    }));
  }

  async resetPioneerAccolades(): Promise<void> {
    // Delete pioneer accolades manually
    await db.delete(accolades).where(eq(accolades.accoladeId, 'genesis_member'));
    await db.delete(accolades).where(eq(accolades.accoladeId, 'gemlaunch_pioneer'));
    await db.delete(accolades).where(eq(accolades.accoladeId, 'early_adopter'));

    // Get all users sorted by creation date
    const allUsers = await db.select().from(users).orderBy(users.createdAt);

    // Award pioneer accolades based on actual join order
    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      const joinOrder = i + 1;

      // Genesis Member (first 10 users)
      if (joinOrder <= 10) {
        await this.createAccolade({
          userId: user.id,
          accoladeId: 'genesis_member',
          name: 'Genesis Member'
        });
      }

      // Gemlaunch Pioneer (first 50 users)
      if (joinOrder <= 50) {
        await this.createAccolade({
          userId: user.id,
          accoladeId: 'gemlaunch_pioneer',
          name: 'Gemlaunch Pioneer'
        });
      }

      // Early Adopter (first 1000 users)
      if (joinOrder <= 1000) {
        await this.createAccolade({
          userId: user.id,
          accoladeId: 'early_adopter',
          name: 'Early Adopter'
        });
      }
    }

    // Recalculate points for all users
    for (const user of allUsers) {
      const userAccolades = await this.getUserAccolades(user.id);
      const accoladeBonus = userAccolades.reduce((total, accolade) => {
        const def = ACCOLADES.find(a => a.id === accolade.accoladeId);
        return total + (def?.pointsBonus || 0);
      }, 0);

      // Get base points from activities
      const userActivities = await this.getUserActivities(user.id);
      const basePoints = userActivities.reduce((total, activity) => total + activity.points, 0);

      const totalPoints = basePoints + accoladeBonus;
      
      await db.update(users)
        .set({ totalPoints })
        .where(eq(users.id, user.id));
    }
  }
}

export const storage = new DatabaseStorage();
