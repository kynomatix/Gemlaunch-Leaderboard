import { LaunchPad, Lock } from '@/src/gql/graphql';
import { Address } from 'viem';

export enum LaunchpadTransaction {
    IDLE,
    PENDING,
    PROCESSING,
}

export enum LaunchpadCurrencies {
    NATIVE = 'NATIVE',
    BUSD = 'BUSD',
    USDT = 'USDT',
    USDC = 'USDC',
}

export enum LaunchpadAffiliateProgram {
    ENABLED = 'ENABLED',
    DISABLED = 'DISABLED',
}

export enum LaunchpadWhitelist {
    ENABLED = 'ENABLED',
    DISABLED = 'DISABLED',
}

export enum ListingOptions {
    AUTO = 'AUTO',
    MANUAL = 'MANUAL',
}

export enum RefundType {
    BURN = 'BURN',
    REFUND = 'REFUND',
}

export interface LaunchpadFormInput {
    tokenAddress: Address;
    currency: LaunchpadCurrencies;
    feeOptions: number;
    affiliateProgram: string;
    affiliatePercentage: number;
    presaleRate: number;
    totalSellingAmount: number;
    softcap: number;
    isMaxContribution: boolean;
    maxContribution: number;
    minContribution: number;
    whitelist: LaunchpadWhitelist;
    router: Address;
    isEnableBuyback: boolean;
    buybackPercent: number;
    liquidity: number;
    liquidityLockup: number;
    startTime: string;
    endTime: string;
    logoUrl: string;
    websiteUrl: string;
    facebookUrl: string;
    twitterUrl: string;
    githubUrl: string;
    telegramUrl: string;
    redditUrl: string;
    youtubeUrl: string;
    description: string;
    listingOptions: ListingOptions;
    hardcap: number;
    minBuy: number;
    maxBuy: number;
    refundType: RefundType;
    listingRate: number;
    isVestingActive: boolean;
    releasePresale: number;
    vestingPeriod: number;
    presaleTokenRelease: number;
    startPrice: number;
    endPrice: number;
    decreasePriceCycle: number;
    tgeReleasePercent: number;
    cycle: number;
    cycleReleasePercent: number;
    hardcapTokensPerUser: number;
    subscriptionRate: number;

    // tricky hack to bypass the bug in react-hook-form
    // https://github.com/react-hook-form/react-hook-form/issues/2755
    step1: any;
    step2: any;
    step3: any;
    step4: any;
}

// Fairlaunch Submission
export interface Info {
    token: Address;
    totalsellTokens: bigint;
    softCap: bigint;
    isMaxLimit: boolean;
    maxBuyLimit: bigint;
    startTime: bigint;
    endTime: bigint;
    finalizeTime: bigint;
    publicSaleTime: bigint;
    isAffiliate: boolean;
    affiliateReward: bigint;
}

export interface Liquidity {
    router: Address;
    liquidityPercent: bigint;
    lockTime: bigint;
    locker: Address;
    liquidityAdded: bigint;
}
export interface Buyback {
    isBuyback: boolean;
    buyBackPercent: bigint;
    totalBuyBackAmount: bigint;
    boughtBackAmount: bigint;
    amountPerBuyback: bigint;
    minDelay: bigint;
    maxDelay: bigint;
    lastBuyTime: bigint;
}
export type FairLaunchSubmission = [Info, Liquidity, Buyback, Address, boolean, Address];

// * Launchpad Submission

export type LaunchpadInfo = {
    token: Address;
    sellPrice: bigint;
    listingPrice: bigint;
    softCap: bigint;
    hardCap: bigint;
    minBuyLimit: bigint;
    maxBuyLimit: bigint;
    startTime: bigint;
    endTime: bigint;
    finalizeTime: bigint;
    publicSaleTime: bigint;
};

export type LaunchpadLiquidity = {
    router: Address;
    liquidityPercent: bigint;
    lockTime: bigint;
    locker: Address;
    liquidityAdded: bigint;
    isAutolisting: boolean;
};

export type LaunchpadVesting = {
    isVestingEnable: boolean;
    TGEPercent: bigint;
    cycleInterval: bigint;
    cyclePercent: bigint;
};

export type LaunchpadSubmission = [
    LaunchpadInfo,
    LaunchpadLiquidity,
    LaunchpadVesting,
    string,
    boolean,
    boolean,
    bigint,
    boolean,
    bigint,
    string,
];

// * Dutch Auction
export type DutchInfo = {
    token: Address;
    totalSaleAmount: bigint;
    startPrice: bigint;
    endPrice: bigint;
    softCap: bigint;
    hardCap: bigint;
    minBuyLimit: bigint;
    maxBuyLimit: bigint;
    startTime: bigint;
    endTime: bigint;
    finalizeTime: bigint;
    publicSaleTime: bigint;
    decreaseInterval: bigint;
};

export type DutchLiquidity = {
    router: Address;
    liquidityPercent: bigint;
    lockTime: bigint;
    locker: Address;
    liquidityAdded: bigint;
};

export type DutchVesting = {
    isVestingEnable: boolean;
    TGEPercent: bigint;
    cyclePercent: bigint;
    cycleInterval: bigint;
};

// * SUBSCRIPTION

export type SubscriptionInfo = {
    token: Address;
    hardCap: bigint;
    softCap: bigint;
    userHardCap: bigint;
    sellRate: bigint;
    listingRate: bigint;
    startTime: bigint;
    endTime: bigint;
    finalizeTime: bigint;
    publicSaleTime: bigint;
};

export type SubscriptionLiquidity = {
    router: Address;
    liquidityPercent: bigint;
    lockTime: bigint;
    locker: Address;
    liquidityAdded: bigint;
};

export enum Upload {
    IDLE,
    PENDING,
}


export interface LockRecordProps {
    tokenAddress: string;
}


export interface LockRecordQueryData {
    locks: Lock[];
}


export interface PreviousPresalesQueryData {
    launchPads: LaunchPad[];
}

export interface PreviousPresalesProps {
    userAddress: string;
    currentPresaleAddress: string;
}