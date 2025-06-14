// Comprehensive Accolade System for GemLaunch
export interface AccoladeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'pioneer' | 'trading' | 'social' | 'creator' | 'elite' | 'streak';
  level: number;
  criteria: string;
  pointsBonus: number;
  multiplier?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export const ACCOLADES: AccoladeDefinition[] = [
  // PIONEER CATEGORY
  {
    id: 'gemlaunch_pioneer',
    name: 'Gemlaunch Pioneer',
    description: 'Welcome to the Gemlaunch ecosystem! Earned by connecting your wallet.',
    icon: '🚀',
    category: 'pioneer',
    level: 1,
    criteria: { type: 'special', requirement: 1, specialRequirement: 'first_connect' },
    pointsBonus: 100,
    rarity: 'common'
  },
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Among the first 1000 users on Gemlaunch.',
    icon: '⭐',
    category: 'pioneer',
    level: 2,
    criteria: { type: 'special', requirement: 'user_number_under_1000' },
    pointsBonus: 500,
    rarity: 'uncommon'
  },
  {
    id: 'genesis_member',
    name: 'Genesis Member',
    description: 'Among the first 100 users on Gemlaunch.',
    icon: '👑',
    category: 'pioneer',
    level: 3,
    criteria: { type: 'special', requirement: 'user_number_under_100' },
    pointsBonus: 2000,
    rarity: 'rare'
  },

  // TRADING CATEGORY
  {
    id: 'first_trade',
    name: 'First Trade',
    description: 'Complete your first token trade on any DEX.',
    icon: '💱',
    category: 'trading',
    level: 1,
    criteria: { type: 'activities', requirement: 1, timeframe: 'all-time' },
    pointsBonus: 50,
    rarity: 'common'
  },
  {
    id: 'volume_trader',
    name: 'Volume Trader',
    description: 'Generate $1,000+ in trading volume.',
    icon: '📈',
    category: 'trading',
    level: 2,
    criteria: { type: 'volume', requirement: 1000 },
    pointsBonus: 300,
    rarity: 'uncommon'
  },
  {
    id: 'whale_trader',
    name: 'Whale Trader',
    description: 'Generate $10,000+ in trading volume.',
    icon: '🐋',
    category: 'trading',
    level: 3,
    criteria: { type: 'volume', requirement: 10000 },
    pointsBonus: 1500,
    multiplier: 1.1,
    rarity: 'rare'
  },
  {
    id: 'diamond_hands',
    name: 'Diamond Hands',
    description: 'Hold tokens for 30+ days without selling.',
    icon: '💎',
    category: 'trading',
    level: 2,
    criteria: { type: 'special', requirement: 'hold_30_days' },
    pointsBonus: 750,
    multiplier: 1.05,
    rarity: 'uncommon'
  },

  // CREATOR CATEGORY
  {
    id: 'token_creator',
    name: 'Token Creator',
    description: 'Launch your first token on Gemlaunch.',
    icon: '🎯',
    category: 'creator',
    level: 1,
    criteria: { type: 'tokens_created', requirement: 1 },
    pointsBonus: 200,
    rarity: 'common'
  },
  {
    id: 'serial_creator',
    name: 'Serial Creator',
    description: 'Launch 5+ tokens on Gemlaunch.',
    icon: '🏭',
    category: 'creator',
    level: 2,
    criteria: { type: 'tokens_created', requirement: 5 },
    pointsBonus: 1000,
    multiplier: 1.15,
    rarity: 'uncommon'
  },
  {
    id: 'project_founder',
    name: 'Project Founder',
    description: 'Successfully launch a token that reaches $10K+ market cap.',
    icon: '🏆',
    category: 'creator',
    level: 3,
    criteria: { type: 'special', requirement: 'successful_launch_10k' },
    pointsBonus: 5000,
    multiplier: 1.25,
    rarity: 'epic'
  },

  // SOCIAL CATEGORY
  {
    id: 'referrer',
    name: 'Referrer',
    description: 'Refer your first friend to Gemlaunch.',
    icon: '🤝',
    category: 'social',
    level: 1,
    criteria: { type: 'referrals', requirement: 1 },
    pointsBonus: 100,
    rarity: 'common'
  },
  {
    id: 'community_builder',
    name: 'Community Builder',
    description: 'Refer 10+ friends to Gemlaunch.',
    icon: '🌟',
    category: 'social',
    level: 2,
    criteria: { type: 'referrals', requirement: 10 },
    pointsBonus: 1500,
    multiplier: 1.1,
    rarity: 'uncommon'
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Refer 50+ friends to Gemlaunch.',
    icon: '📢',
    category: 'social',
    level: 3,
    criteria: { type: 'referrals', requirement: 50 },
    pointsBonus: 10000,
    multiplier: 1.2,
    rarity: 'rare'
  },

  // STREAK CATEGORY
  {
    id: 'daily_active',
    name: 'Daily Active',
    description: 'Be active for 7 consecutive days.',
    icon: '🔥',
    category: 'streak',
    level: 1,
    criteria: { type: 'streak', requirement: 7, timeframe: 'daily' },
    pointsBonus: 250,
    rarity: 'common'
  },
  {
    id: 'weekly_warrior',
    name: 'Weekly Warrior',
    description: 'Be active for 30 consecutive days.',
    icon: '⚡',
    category: 'streak',
    level: 2,
    criteria: { type: 'streak', requirement: 30, timeframe: 'daily' },
    pointsBonus: 1000,
    multiplier: 1.05,
    rarity: 'uncommon'
  },
  {
    id: 'dedication_master',
    name: 'Dedication Master',
    description: 'Be active for 100 consecutive days.',
    icon: '🎖️',
    category: 'streak',
    level: 3,
    criteria: { type: 'streak', requirement: 100, timeframe: 'daily' },
    pointsBonus: 5000,
    multiplier: 1.15,
    rarity: 'rare'
  },

  // ELITE CATEGORY
  {
    id: 'point_collector',
    name: 'Point Collector',
    description: 'Accumulate 1,000+ total points.',
    icon: '💰',
    category: 'elite',
    level: 1,
    criteria: { type: 'points', requirement: 1000 },
    pointsBonus: 200,
    rarity: 'common'
  },
  {
    id: 'point_master',
    name: 'Point Master',
    description: 'Accumulate 10,000+ total points.',
    icon: '💎',
    category: 'elite',
    level: 2,
    criteria: { type: 'points', requirement: 10000 },
    pointsBonus: 2000,
    multiplier: 1.1,
    rarity: 'uncommon'
  },
  {
    id: 'point_legend',
    name: 'Point Legend',
    description: 'Accumulate 100,000+ total points.',
    icon: '👑',
    category: 'elite',
    level: 3,
    criteria: { type: 'points', requirement: 100000 },
    pointsBonus: 25000,
    multiplier: 1.25,
    rarity: 'epic'
  },
  {
    id: 'gemlaunch_champion',
    name: 'Gemlaunch Champion',
    description: 'Reach the top 10 on the leaderboard.',
    icon: '🏅',
    category: 'elite',
    level: 4,
    criteria: { type: 'special', requirement: 'top_10_leaderboard' },
    pointsBonus: 10000,
    multiplier: 1.3,
    rarity: 'legendary'
  },
  {
    id: 'ecosystem_king',
    name: 'Ecosystem King',
    description: 'Reach #1 on the leaderboard.',
    icon: '👑',
    category: 'elite',
    level: 5,
    criteria: { type: 'special', requirement: 'rank_1_leaderboard' },
    pointsBonus: 50000,
    multiplier: 1.5,
    rarity: 'legendary'
  }
];

export const getAccoladesByCategory = (category: AccoladeDefinition['category']) => {
  return ACCOLADES.filter(accolade => accolade.category === category);
};

export const getAccoladeById = (id: string) => {
  return ACCOLADES.find(accolade => accolade.id === id);
};

export const checkAccoladeEligibility = (
  accolade: AccoladeDefinition,
  userStats: {
    totalPoints: number;
    totalActivities: number;
    totalReferrals: number;
    tokensCreated: number;
    tradingVolume: number;
    dayStreak: number;
    rank: number;
    userNumber: number;
  }
): boolean => {
  const { criteria } = accolade;
  
  switch (criteria.type) {
    case 'points':
      return userStats.totalPoints >= criteria.requirement;
    case 'activities':
      return userStats.totalActivities >= criteria.requirement;
    case 'referrals':
      return userStats.totalReferrals >= criteria.requirement;
    case 'tokens_created':
      return userStats.tokensCreated >= criteria.requirement;
    case 'volume':
      return userStats.tradingVolume >= criteria.requirement;
    case 'streak':
      return userStats.dayStreak >= criteria.requirement;
    case 'special':
      switch (criteria.requirement) {
        case 'first_connect':
          return true; // Always eligible when connecting
        case 'user_number_under_1000':
          return userStats.userNumber <= 1000;
        case 'user_number_under_100':
          return userStats.userNumber <= 100;
        case 'top_10_leaderboard':
          return userStats.rank <= 10;
        case 'rank_1_leaderboard':
          return userStats.rank === 1;
        default:
          return false;
      }
    default:
      return false;
  }
};

export const RARITY_COLORS = {
  common: '#9ca3af',
  uncommon: '#22cda6',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b'
};

export const CATEGORY_NAMES = {
  pioneer: 'Pioneer',
  trading: 'Trading',
  social: 'Social',
  creator: 'Creator',
  elite: 'Elite',
  streak: 'Streak'
};