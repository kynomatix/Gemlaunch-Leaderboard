import { GetLaunchpadsQuery, LaunchPad, LaunchPadsConnection } from '@/src/gql/graphql';
import { QueryObserverResult } from '@tanstack/react-query';
import { Control } from 'react-hook-form';
import { Address } from 'viem';

export interface ModalProps {
    open: boolean;
    handleClose: () => void;
    contractAddress?: Address;
    tokenAddress?: Address;
}

export interface LaunchPadOwnerZone {
    contractAddress: Address;
    tokenAddress: Address;
}

export interface AffiliateModalFormInput {
    affiliation: string;
}

export enum LaunchpadSaleStatus {
    INCOMMING,
    ACTIVE,
    CANCELLED,
    CLOSED,
    UNKNOWN,
}

export enum ClaimType {
    TOKEN,
    REWARD,
    REFUND,
}

export enum Tx {
    Idle,
    Pending,
    Processing,
}

export enum LaunchpadSaleMode {
    PENDING,
    PRIVATE,
    PUBLIC,
    UNKNOWN,
}

export interface VestingDetails {
    isVestingEnable: boolean;
    TGEPercent: bigint;
    cyclePercent: bigint;
    cycleInterval: bigint;
}
export interface RewardInfo {
    referralInvest: bigint;
    rewardShare: bigint;
    tokenFees: bigint;
    totalRaised: bigint;
    totalReferralInvest: bigint;

    refetch: () => void;
}
export interface UserAuctionInfoDetails {
    userTokens: bigint;
    userInvest: bigint;
    userCalimed: bigint;
    lastClaimTime: bigint;
}
export interface UserInfoDetails {
    userInvest: bigint;
    userCalimed: bigint;
    lastClaimTime: bigint;
    intervalClaimed: bigint;
}
export interface UserSubscriptionInfoDetails {
    userInvest: bigint;
    userDeposit: bigint;
    userAllocation: bigint;
    userClaimed: bigint;
}
export interface LaunchPadLiquidityDetails {
    router: Address | string;
    liquidityPercent: bigint;
    lockTime: bigint;
    locker: Address | string;
    liquidityAdded: bigint;
    isAutoListing: boolean;
}
export interface FairLaunchLiquidityDetails {
    router: Address | string;
    liquidityPercent: bigint;
    lockTime: bigint;
    locker: Address | string;
    liquidityAdded: bigint;
}
export interface FairLaunchBuybackDetails {
    isBuyback: boolean;
    buyBackPercent: bigint;
    totalBuyBackAmount: bigint;
    boughtBackAmount: bigint;
    amountPerBuyback: bigint;
    minDelay: bigint;
    maxDelay: bigint;
    lastBuyTime: bigint;
    refetch: () => void;
}

export interface LinerChartProps {
    launchpadAddress: string;
}
export interface QueryData {
    launchPadsConnection: LaunchPadsConnection;
}

export interface QueryDataLaunchpad {
    launchPads: LaunchPad[];
}

export interface LaunchpadsListProps {
    searchTerm: string;
    sortBy: number;
    filterBy: number;
}

export interface SearchFormInput {
    searchTerm: string;
    filterBy: number;
    sortBy: number;
}

export enum FilterBy {
    ALL,
    LIVE,
    ENDED,
    CANCELLED,
    UPCOMING,
    KYC,
}

export enum SortBy {
    NONE,
    HARDCAP,
    SOFTCAP,
    START_TIME,
    END_TIME,
    LIQUIDITY,
}

interface Option {
    id: number;
    lab: string;
    val: number;
}
export interface SelectProps {
    label: string;
    name: 'searchTerm' | 'filterBy' | 'sortBy';
    options: readonly Option[];
    control: Control<SearchFormInput, any>;
}
export interface ILaunchpadDetailCard {
    data: GetLaunchpadsQuery;
    isAffiliate: boolean;
    tokenForPreSale: bigint;
    address: Address;
}
export interface ISubscriptionDetailCard {
    data: GetLaunchpadsQuery;
    address: Address;
}
export interface IAuctionDetailCard {
    data: GetLaunchpadsQuery;
    address: Address;
}
export interface IFairLaunchDetailCard {
    data: GetLaunchpadsQuery;
    address: Address;
}

export enum LaunchpadType {
    LaunchPad = 'LaunchPad',
    Fairlaunch = 'Fairlaunch',
    SubscriptionPool = 'SubscriptionPool',
    DutchAuction = 'DutchAuction',
}

export interface HistoryModalProps {
    openModal: boolean;
    onClose: () => void;
    subscriptionPoolAddress: Address;
    fundTokenDecimals: number;
    fundTokenSymbol: string;
    launchpadTokenSymbol: string;
    launchpadTokenDecimals: number;
    sellRateNum: number;
}

export interface IAffiliateProgram {
    props: {
        affiliatePercentage: number;
        allReferrers: readonly Address[];
        totalRaisedNum: number;
        currentLaunchpadStatus: number;
        affiliateReward: bigint;
        isAffiliate: boolean;
        launchpadAddress: Address;
        tokenFee: number;
        launchpadContract: any;
        totalRewards?: number;
    };
}

export interface filterByValue {
    date: () => string | undefined;
    isCancelled: boolean;
    // isKyc: boolean;
}

export enum Upload {
    IDLE,
    PENDING,
    PROCESSING,
}

export interface EditPresaleFormInput {
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
