import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { blockchainService } from "./services/blockchain";
import { insertUserSchema, insertActivitySchema, insertPointConfigSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByWalletAddress(userData.walletAddress);
      
      if (existingUser) {
        return res.json(existingUser);
      }
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid user data" });
    }
  });

  app.get("/api/users/:walletAddress", async (req, res) => {
    try {
      const user = await storage.getUserByWalletAddress(req.params.walletAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  app.get("/api/users/:id/rank", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const rank = await storage.getUserRank(userId);
      res.json({ rank });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user rank" });
    }
  });

  // Activity routes
  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      
      // Broadcast activity update via WebSocket
      broadcastUpdate({ type: "activity", data: activity });
      
      res.json(activity);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Invalid activity data" });
    }
  });

  app.get("/api/users/:id/activities", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 50;
      const activities = await storage.getUserActivities(userId, limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user activities" });
    }
  });

  app.get("/api/activities/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent activities" });
    }
  });

  // Referral routes
  app.get("/api/users/:id/referrals", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const referrals = await storage.getUserReferrals(userId);
      res.json(referrals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch referrals" });
    }
  });

  app.get("/api/users/:id/referral-stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const stats = await storage.getReferralStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch referral stats" });
    }
  });

  // Accolade routes
  app.get("/api/users/:id/accolades", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const accolades = await storage.getUserAccolades(userId);
      res.json(accolades);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch accolades" });
    }
  });

  // Point configuration routes (admin)
  app.get("/api/point-configs", async (req, res) => {
    try {
      const configs = await storage.getPointConfigs();
      res.json(configs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch point configs" });
    }
  });

  app.put("/api/point-configs/:activityType", async (req, res) => {
    try {
      const { activityType } = req.params;
      const { basePoints } = req.body;
      
      if (!basePoints || basePoints < 0) {
        return res.status(400).json({ error: "Invalid base points value" });
      }
      
      await storage.updatePointConfig(activityType, basePoints);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update point config" });
    }
  });

  // Blockchain monitoring routes
  app.get("/api/blockchain/status", async (req, res) => {
    try {
      const status = blockchainService.getStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to get blockchain status" });
    }
  });

  app.post("/api/blockchain/process-events", async (req, res) => {
    try {
      await blockchainService.processEvents();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to process blockchain events" });
    }
  });

  // Get user referral stats
  app.get("/api/referrals/stats/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const referralStats = await storage.getReferralStats(user.id);
      res.json({
        referralCode: user.referralCode,
        totalEarned: referralStats.totalPoints,
        totalReferrals: referralStats.count,
        weeklyReferrals: 0,
        monthlyReferrals: 0,
      });
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      res.status(500).json({ error: "Failed to fetch referral stats" });
    }
  });

  // Get user recent referrals
  app.get("/api/referrals/recent/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const recentReferrals = await storage.getUserReferrals(user.id);
      res.json(recentReferrals);
    } catch (error) {
      console.error("Error fetching recent referrals:", error);
      res.status(500).json({ error: "Failed to fetch recent referrals" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    
    ws.on('close', () => {
      clients.delete(ws);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Broadcast function for real-time updates
  function broadcastUpdate(update: any) {
    const message = JSON.stringify(update);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Start blockchain monitoring
  blockchainService.startMonitoring((update) => {
    broadcastUpdate({ type: "blockchain", data: update });
  });

  // Store broadcast function globally for use in other modules
  (global as any).broadcastUpdate = broadcastUpdate;

  return httpServer;
}
