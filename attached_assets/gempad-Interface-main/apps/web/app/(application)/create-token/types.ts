import { Address } from 'viem';

export enum TokenType {
    LiquidityGenerator = 'LiquidityGenerator',
    BuybackBaby = 'BuybackBaby',
    Standard = 'Standard',
    Baby = 'Baby',
}

export enum Transaction {
    IDLE,
    WAITING,
    PROCESSING,
}

export enum Labels {
    TokenName = 'Token Name',
    TokenSymbol = 'Token Symbol',
    TokenDecimals = 'Token Decimals',
    TokenSupply = 'Token Supply',
    TaxFeeBps = 'TaxFeeBps',
    LiquidityFeeBps = 'LiquidityFeeBps',
    CharityBps = 'CharityBps',
    RewardToken = 'Reward Token',
    TokenRewardFee = 'Token Reward Fee',
    MarketingWallet = 'Marketing Wallet',
    MarketingFee = 'Marketing Fee',
    MinTokenBalanceForDividends = 'Minimum token balance for dividends',
    AutoAddLiquidity = 'Auto add liquidity',
}
export interface CreateTokenInput {
    tokenType: TokenType;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimals?: number;
    tokenSupply: number;
    gemlaunchAntiBotSystem: boolean;
    router?: string;
    generateYieldFee?: number;
    generateLiquidityFee?: number;
    charityMarketingAddress?: Address;
    charityMarketingPercent?: number;
    rewardToken: Address;
    minTokenBalanceForDividends: number;
    tokenRewardFee: number;
    autoAddLiquidity: number;
    marketingFee: number;
    marketingWallet: Address;
    buybackFee: number;
    reflectionFee: number;
    liquidityFee: number;
}

// Baby
export type BabyTokenArgs = [
    string,
    string,
    bigint,
    [Address, Address, Address, Address],
    [bigint, bigint, bigint],
    bigint,
];
export type AntibotBabyTokenArgs = [
    string,
    string,
    bigint,
    [Address, Address, Address, Address, Address],
    [bigint, bigint, bigint],
    bigint,
];

// Standard
export type StandardTokenArgs = [string, string, number, bigint];
export type AntibotStandardTokenArgs = [string, string, number, bigint, Address];

// Liquidity
export type LiquidityGeneratorTokenArgs = [
    string,
    string,
    bigint,
    Address,
    Address,
    bigint,
    bigint,
    bigint,
];
export type AntibotLiquidityGeneratorTokenArgs = [
    string,
    string,
    bigint,
    Address,
    Address,
    bigint,
    bigint,
    bigint,
    Address,
];

// Buyback Baby
export type BuybackBabyTokenArgs = [
    string,
    string,
    bigint,
    Address,
    Address,
    [bigint, bigint, bigint, bigint, bigint],
];
export type AntibotBuybackBabyTokenArgs = [
    string,
    string,
    bigint,
    Address,
    Address,
    Address,
    [bigint, bigint, bigint, bigint, bigint],
];
