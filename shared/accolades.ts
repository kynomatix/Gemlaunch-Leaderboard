// Comprehensive Accolade System for Gemlaunch
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
    id: 'genesis_member',
    name: 'Genesis Member',
    description: 'Among the first 10 users on Gemlaunch.',
    icon: 'Crown',
    category: 'pioneer',
    level: 1,
    criteria: 'Be among the first 10 users',
    pointsBonus: 5000,
    rarity: 'legendary'
  },
  {
    id: 'gemlaunch_pioneer',
    name: 'Gemlaunch Pioneer',
    description: 'One of the first 50 users to join the Gemlaunch ecosystem!',
    icon: 'Rocket',
    category: 'pioneer',
    level: 2,
    criteria: 'Be among the first 50 users to connect your wallet',
    pointsBonus: 2000,
    rarity: 'rare'
  },
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Among the first 1000 users on Gemlaunch.',
    icon: 'Star',
    category: 'pioneer',
    level: 3,
    criteria: 'Be among the first 1,000 users',
    pointsBonus: 500,
    rarity: 'uncommon'
  },

  // FUNDING CATEGORY
  {
    id: 'first_funding',
    name: 'First Funder',
    description: 'Fund your first token launch on Gemlaunch.',
    icon: 'Coins',
    category: 'trading',
    level: 1,
    criteria: 'Participate in 1 token funding',
    pointsBonus: 200,
    rarity: 'common'
  },
  {
    id: 'launch_supporter',
    name: 'Launch Supporter',
    description: 'Support multiple token launches with funding.',
    icon: 'TrendingUp',
    category: 'trading',
    level: 2,
    criteria: 'Fund 5+ different token launches',
    pointsBonus: 800,
    rarity: 'uncommon'
  },
  {
    id: 'volume_veteran',
    name: 'Volume Veteran',
    description: 'Achieved significant trading volume on the platform.',
    icon: 'BarChart3',
    category: 'trading',
    level: 2,
    criteria: 'Generate significant trading volume',
    pointsBonus: 300,
    rarity: 'uncommon'
  },
  {
    id: 'whale_trader',
    name: 'Whale Trader',
    description: 'Generate $10,000+ in trading volume.',
    icon: 'Waves',
    category: 'trading',
    level: 3,
    criteria: 'Generate $10,000+ in trading volume',
    pointsBonus: 1500,
    multiplier: 1.1,
    rarity: 'rare'
  },
  {
    id: 'diamond_hands',
    name: 'Diamond Hands',
    description: 'Hold tokens for 30+ days without selling.',
    icon: 'Gem',
    category: 'trading',
    level: 2,
    criteria: 'Hold tokens for 30+ days without selling',
    pointsBonus: 750,
    multiplier: 1.05,
    rarity: 'uncommon'
  },

  // CREATOR CATEGORY
  {
    id: 'token_creator',
    name: 'Token Creator',
    description: 'Launch your first token on Gemlaunch.',
    icon: 'Target',
    category: 'creator',
    level: 1,
    criteria: 'Create 1 token',
    pointsBonus: 200,
    rarity: 'common'
  },
  {
    id: 'serial_creator',
    name: 'Serial Creator',
    description: 'Launch 5+ tokens on Gemlaunch.',
    icon: 'Factory',
    category: 'creator',
    level: 2,
    criteria: 'Create 5+ tokens',
    pointsBonus: 1000,
    multiplier: 1.15,
    rarity: 'uncommon'
  },
  {
    id: 'project_founder',
    name: 'Project Founder',
    description: 'Successfully launch a token that reaches $10K+ market cap.',
    icon: 'Trophy',
    category: 'creator',
    level: 3,
    criteria: 'Launch a token that reaches $10K+ market cap',
    pointsBonus: 5000,
    multiplier: 1.25,
    rarity: 'epic'
  },
  {
    id: 'launch_master',
    name: 'Launch Master',
    description: 'Successfully completed a fair launch on the platform.',
    icon: 'Zap',
    category: 'creator',
    level: 2,
    criteria: 'Complete a successful fair launch',
    pointsBonus: 500,
    rarity: 'uncommon'
  },
  {
    id: 'presale_participant',
    name: 'Presale Participant',
    description: 'Participated in a token presale on the platform.',
    icon: 'DollarSign',
    category: 'trading',
    level: 1,
    criteria: 'Participate in a token presale',
    pointsBonus: 150,
    rarity: 'common'
  },

  // SOCIAL CATEGORY
  {
    id: 'referrer',
    name: 'Referrer',
    description: 'Refer your first friend to Gemlaunch.',
    icon: 'Handshake',
    category: 'social',
    level: 1,
    criteria: 'Refer 1 friend',
    pointsBonus: 100,
    rarity: 'common'
  },
  {
    id: 'referral_rookie',
    name: 'Referral Rookie',
    description: 'Made your first successful referral.',
    icon: 'Users',
    category: 'social',
    level: 1,
    criteria: 'Make 1 successful referral',
    pointsBonus: 100,
    rarity: 'common'
  },
  {
    id: 'community_builder',
    name: 'Community Builder',
    description: 'Refer 10+ friends to Gemlaunch.',
    icon: 'UserPlus',
    category: 'social',
    level: 2,
    criteria: 'Refer 10+ friends',
    pointsBonus: 1500,
    multiplier: 1.1,
    rarity: 'uncommon'
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Refer 50+ friends to Gemlaunch.',
    icon: 'Megaphone',
    category: 'social',
    level: 3,
    criteria: 'Refer 50+ friends',
    pointsBonus: 10000,
    multiplier: 1.2,
    rarity: 'rare'
  },

  // STREAK CATEGORY
  {
    id: 'daily_active',
    name: 'Daily Active',
    description: 'Be active for 7 consecutive days.',
    icon: 'Flame',
    category: 'streak',
    level: 1,
    criteria: 'Be active for 7 consecutive days',
    pointsBonus: 250,
    rarity: 'common'
  },
  {
    id: 'weekly_warrior',
    name: 'Weekly Warrior',
    description: 'Be active for 30 consecutive days.',
    icon: 'Calendar',
    category: 'streak',
    level: 2,
    criteria: 'Be active for 30 consecutive days',
    pointsBonus: 1000,
    multiplier: 1.05,
    rarity: 'uncommon'
  },
  {
    id: 'dedication_master',
    name: 'Dedication Master',
    description: 'Be active for 100 consecutive days.',
    icon: 'Award',
    category: 'streak',
    level: 3,
    criteria: 'Be active for 100 consecutive days',
    pointsBonus: 5000,
    multiplier: 1.15,
    rarity: 'rare'
  },

  // ELITE CATEGORY
  {
    id: 'point_collector',
    name: 'Point Collector',
    description: 'Accumulate 1,000+ total points.',
    icon: 'Coins',
    category: 'elite',
    level: 1,
    criteria: 'Accumulate 1,000+ total points',
    pointsBonus: 200,
    rarity: 'common'
  },
  {
    id: 'point_master',
    name: 'Point Master',
    description: 'Accumulate 10,000+ total points.',
    icon: 'CircleDollarSign',
    category: 'elite',
    level: 2,
    criteria: 'Accumulate 10,000+ total points',
    pointsBonus: 2000,
    multiplier: 1.1,
    rarity: 'uncommon'
  },
  {
    id: 'point_legend',
    name: 'Point Legend',
    description: 'Accumulate 100,000+ total points.',
    icon: 'Shield',
    category: 'elite',
    level: 3,
    criteria: 'Accumulate 100,000+ total points',
    pointsBonus: 25000,
    multiplier: 1.25,
    rarity: 'epic'
  },
  {
    id: 'gemlaunch_champion',
    name: 'Gemlaunch Champion',
    description: 'Reach the top 10 on the leaderboard.',
    icon: 'Medal',
    category: 'elite',
    level: 4,
    criteria: 'Reach top 10 on the leaderboard',
    pointsBonus: 10000,
    multiplier: 1.3,
    rarity: 'legendary'
  },
  {
    id: 'ecosystem_king',
    name: 'Ecosystem King',
    description: 'Reach #1 on the leaderboard.',
    icon: 'Sceptre',
    category: 'elite',
    level: 5,
    criteria: 'Reach #1 on the leaderboard',
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