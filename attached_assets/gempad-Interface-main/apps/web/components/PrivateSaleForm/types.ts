import { Address } from 'viem';

export enum Transaction {
    IDLE = 'IDLE',
    WAITING = 'Waiting...',
    PROCESSING = 'Processing Transaction',
}

export enum Currency {
    NATIVE,
    USDT,
    USDC,
}

export enum Whitelist {
    DISABLE = 'DISABLE',
    ENABLE = 'ENABLE',
}

export interface PrivateSaleFormInput {
    title: string;
    currency: Currency;
    whitelist: Whitelist;
    softCap: number;
    hardCap: number;
    minBuy: number;
    maxBuy: number;
    firstFundRelease: number;
    vestingPeriodEachCycle: number;
    cycleReleasePercent: number;
    logoUrl: string;
    websiteUrl: string;
    facebookUrl: string;
    twitterUrl: string;
    githubUrl: string;
    telegramUrl: string;
    redditUrl: string;
    youtubeUrl: string;
    description: string;
    startTime: bigint;
    endTime: bigint;
}

export type PrivateSaleArgs = [
    {
        name: string;
        softCap: bigint;
        hardCap: bigint;
        minBuyLimit: bigint;
        maxBuyLimit: bigint;
        startTime: bigint;
        endTime: bigint;
        finalizeTime: bigint;
        publicSaleTime: bigint;
    },
    {
        initialRelease: bigint;
        cyclePercent: bigint;
        cycleInterval: bigint;
    },
    number,
    Address,
    Address,
];

export enum Upload {
    IDLE,
    PENDING,
}
