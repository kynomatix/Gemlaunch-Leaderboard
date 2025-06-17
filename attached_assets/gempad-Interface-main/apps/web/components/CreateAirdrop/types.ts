import { Address } from 'viem';

export interface AirdropFormInput {
    tokenAddress: string;
    airdropName: string;
    logoUrl: string;
    websiteUrl: string;
    facebookUrl: string;
    twitterUrl: string;
    githubUrl: string;
    telegramUrl: string;
    redditUrl: string;
    youtubeUrl: string;
    description: string;
}

export type AirdropArgs = [Address, string, Address];

export enum Tx {
    IDLE,
    WAITING,
    PROCESSING,
}

export enum Upload {
    IDLE,
    PENDING,
}

export interface EditAirdropsFormInput {
    description: string;
    facebookUrl: string;
    githubUrl: string;
    logoUrl: string;
    redditUrl: string;
    telegramUrl: string;
    twitterUrl: string;
    websiteUrl: string;
    youtubeUrl: string;
}
