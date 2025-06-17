/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
    [_ in K]?: never;
};
export type Incremental<T> =
    | T
    | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    /** Big number integer */
    BigInt: { input: bigint; output: bigint };
    /** A date-time string in simplified extended ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) */
    DateTime: { input: string; output: string };
};

export type Aggregation = BaseEntity & {
    __typename?: 'Aggregation';
    chainId: Scalars['Int']['output'];
    createdAt: Scalars['DateTime']['output'];
    fundedProjects: Scalars['Int']['output'];
    id: Scalars['String']['output'];
    liquidityLocked: Scalars['Float']['output'];
    liquidityLockedCount: Scalars['Int']['output'];
    liquidityLockedInUsd: Scalars['Float']['output'];
    raisedContributionNative: Scalars['BigInt']['output'];
    raisedContributionUSDC: Scalars['BigInt']['output'];
    raisedContributionUSDT: Scalars['BigInt']['output'];
    tokenLocked: Scalars['Float']['output'];
    tokenLockedCount: Scalars['Int']['output'];
    tokenLockedInUsd: Scalars['Float']['output'];
    totalAirdropsLaunched: Scalars['Int']['output'];
    totalParticipantsAirdrops: Scalars['Int']['output'];
    uniqueParticipants: Array<Maybe<Scalars['String']['output']>>;
    updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AggregationEdge = {
    __typename?: 'AggregationEdge';
    cursor: Scalars['String']['output'];
    node: Aggregation;
};

export enum AggregationOrderByInput {
    ChainIdAsc = 'chainId_ASC',
    ChainIdAscNullsFirst = 'chainId_ASC_NULLS_FIRST',
    ChainIdDesc = 'chainId_DESC',
    ChainIdDescNullsLast = 'chainId_DESC_NULLS_LAST',
    CreatedAtAsc = 'createdAt_ASC',
    CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
    CreatedAtDesc = 'createdAt_DESC',
    CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
    FundedProjectsAsc = 'fundedProjects_ASC',
    FundedProjectsAscNullsFirst = 'fundedProjects_ASC_NULLS_FIRST',
    FundedProjectsDesc = 'fundedProjects_DESC',
    FundedProjectsDescNullsLast = 'fundedProjects_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    LiquidityLockedCountAsc = 'liquidityLockedCount_ASC',
    LiquidityLockedCountAscNullsFirst = 'liquidityLockedCount_ASC_NULLS_FIRST',
    LiquidityLockedCountDesc = 'liquidityLockedCount_DESC',
    LiquidityLockedCountDescNullsLast = 'liquidityLockedCount_DESC_NULLS_LAST',
    LiquidityLockedInUsdAsc = 'liquidityLockedInUsd_ASC',
    LiquidityLockedInUsdAscNullsFirst = 'liquidityLockedInUsd_ASC_NULLS_FIRST',
    LiquidityLockedInUsdDesc = 'liquidityLockedInUsd_DESC',
    LiquidityLockedInUsdDescNullsLast = 'liquidityLockedInUsd_DESC_NULLS_LAST',
    LiquidityLockedAsc = 'liquidityLocked_ASC',
    LiquidityLockedAscNullsFirst = 'liquidityLocked_ASC_NULLS_FIRST',
    LiquidityLockedDesc = 'liquidityLocked_DESC',
    LiquidityLockedDescNullsLast = 'liquidityLocked_DESC_NULLS_LAST',
    RaisedContributionNativeAsc = 'raisedContributionNative_ASC',
    RaisedContributionNativeAscNullsFirst = 'raisedContributionNative_ASC_NULLS_FIRST',
    RaisedContributionNativeDesc = 'raisedContributionNative_DESC',
    RaisedContributionNativeDescNullsLast = 'raisedContributionNative_DESC_NULLS_LAST',
    RaisedContributionUsdcAsc = 'raisedContributionUSDC_ASC',
    RaisedContributionUsdcAscNullsFirst = 'raisedContributionUSDC_ASC_NULLS_FIRST',
    RaisedContributionUsdcDesc = 'raisedContributionUSDC_DESC',
    RaisedContributionUsdcDescNullsLast = 'raisedContributionUSDC_DESC_NULLS_LAST',
    RaisedContributionUsdtAsc = 'raisedContributionUSDT_ASC',
    RaisedContributionUsdtAscNullsFirst = 'raisedContributionUSDT_ASC_NULLS_FIRST',
    RaisedContributionUsdtDesc = 'raisedContributionUSDT_DESC',
    RaisedContributionUsdtDescNullsLast = 'raisedContributionUSDT_DESC_NULLS_LAST',
    TokenLockedCountAsc = 'tokenLockedCount_ASC',
    TokenLockedCountAscNullsFirst = 'tokenLockedCount_ASC_NULLS_FIRST',
    TokenLockedCountDesc = 'tokenLockedCount_DESC',
    TokenLockedCountDescNullsLast = 'tokenLockedCount_DESC_NULLS_LAST',
    TokenLockedInUsdAsc = 'tokenLockedInUsd_ASC',
    TokenLockedInUsdAscNullsFirst = 'tokenLockedInUsd_ASC_NULLS_FIRST',
    TokenLockedInUsdDesc = 'tokenLockedInUsd_DESC',
    TokenLockedInUsdDescNullsLast = 'tokenLockedInUsd_DESC_NULLS_LAST',
    TokenLockedAsc = 'tokenLocked_ASC',
    TokenLockedAscNullsFirst = 'tokenLocked_ASC_NULLS_FIRST',
    TokenLockedDesc = 'tokenLocked_DESC',
    TokenLockedDescNullsLast = 'tokenLocked_DESC_NULLS_LAST',
    TotalAirdropsLaunchedAsc = 'totalAirdropsLaunched_ASC',
    TotalAirdropsLaunchedAscNullsFirst = 'totalAirdropsLaunched_ASC_NULLS_FIRST',
    TotalAirdropsLaunchedDesc = 'totalAirdropsLaunched_DESC',
    TotalAirdropsLaunchedDescNullsLast = 'totalAirdropsLaunched_DESC_NULLS_LAST',
    TotalParticipantsAirdropsAsc = 'totalParticipantsAirdrops_ASC',
    TotalParticipantsAirdropsAscNullsFirst = 'totalParticipantsAirdrops_ASC_NULLS_FIRST',
    TotalParticipantsAirdropsDesc = 'totalParticipantsAirdrops_DESC',
    TotalParticipantsAirdropsDescNullsLast = 'totalParticipantsAirdrops_DESC_NULLS_LAST',
    UpdatedAtAsc = 'updatedAt_ASC',
    UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
    UpdatedAtDesc = 'updatedAt_DESC',
    UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
}

export type AggregationWhereInput = {
    AND?: InputMaybe<Array<AggregationWhereInput>>;
    OR?: InputMaybe<Array<AggregationWhereInput>>;
    chainId_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_gt?: InputMaybe<Scalars['Int']['input']>;
    chainId_gte?: InputMaybe<Scalars['Int']['input']>;
    chainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    chainId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    chainId_lt?: InputMaybe<Scalars['Int']['input']>;
    chainId_lte?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    fundedProjects_eq?: InputMaybe<Scalars['Int']['input']>;
    fundedProjects_gt?: InputMaybe<Scalars['Int']['input']>;
    fundedProjects_gte?: InputMaybe<Scalars['Int']['input']>;
    fundedProjects_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    fundedProjects_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    fundedProjects_lt?: InputMaybe<Scalars['Int']['input']>;
    fundedProjects_lte?: InputMaybe<Scalars['Int']['input']>;
    fundedProjects_not_eq?: InputMaybe<Scalars['Int']['input']>;
    fundedProjects_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    liquidityLockedCount_eq?: InputMaybe<Scalars['Int']['input']>;
    liquidityLockedCount_gt?: InputMaybe<Scalars['Int']['input']>;
    liquidityLockedCount_gte?: InputMaybe<Scalars['Int']['input']>;
    liquidityLockedCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    liquidityLockedCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    liquidityLockedCount_lt?: InputMaybe<Scalars['Int']['input']>;
    liquidityLockedCount_lte?: InputMaybe<Scalars['Int']['input']>;
    liquidityLockedCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
    liquidityLockedCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    liquidityLockedInUsd_eq?: InputMaybe<Scalars['Float']['input']>;
    liquidityLockedInUsd_gt?: InputMaybe<Scalars['Float']['input']>;
    liquidityLockedInUsd_gte?: InputMaybe<Scalars['Float']['input']>;
    liquidityLockedInUsd_in?: InputMaybe<Array<Scalars['Float']['input']>>;
    liquidityLockedInUsd_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    liquidityLockedInUsd_lt?: InputMaybe<Scalars['Float']['input']>;
    liquidityLockedInUsd_lte?: InputMaybe<Scalars['Float']['input']>;
    liquidityLockedInUsd_not_eq?: InputMaybe<Scalars['Float']['input']>;
    liquidityLockedInUsd_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
    liquidityLocked_eq?: InputMaybe<Scalars['Float']['input']>;
    liquidityLocked_gt?: InputMaybe<Scalars['Float']['input']>;
    liquidityLocked_gte?: InputMaybe<Scalars['Float']['input']>;
    liquidityLocked_in?: InputMaybe<Array<Scalars['Float']['input']>>;
    liquidityLocked_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    liquidityLocked_lt?: InputMaybe<Scalars['Float']['input']>;
    liquidityLocked_lte?: InputMaybe<Scalars['Float']['input']>;
    liquidityLocked_not_eq?: InputMaybe<Scalars['Float']['input']>;
    liquidityLocked_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
    raisedContributionNative_eq?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionNative_gt?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionNative_gte?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionNative_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    raisedContributionNative_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    raisedContributionNative_lt?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionNative_lte?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionNative_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionNative_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    raisedContributionUSDC_eq?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionUSDC_gt?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionUSDC_gte?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionUSDC_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    raisedContributionUSDC_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    raisedContributionUSDC_lt?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionUSDC_lte?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionUSDC_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionUSDC_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    raisedContributionUSDT_eq?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionUSDT_gt?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionUSDT_gte?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionUSDT_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    raisedContributionUSDT_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    raisedContributionUSDT_lt?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionUSDT_lte?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionUSDT_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    raisedContributionUSDT_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    tokenLockedCount_eq?: InputMaybe<Scalars['Int']['input']>;
    tokenLockedCount_gt?: InputMaybe<Scalars['Int']['input']>;
    tokenLockedCount_gte?: InputMaybe<Scalars['Int']['input']>;
    tokenLockedCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    tokenLockedCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    tokenLockedCount_lt?: InputMaybe<Scalars['Int']['input']>;
    tokenLockedCount_lte?: InputMaybe<Scalars['Int']['input']>;
    tokenLockedCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
    tokenLockedCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    tokenLockedInUsd_eq?: InputMaybe<Scalars['Float']['input']>;
    tokenLockedInUsd_gt?: InputMaybe<Scalars['Float']['input']>;
    tokenLockedInUsd_gte?: InputMaybe<Scalars['Float']['input']>;
    tokenLockedInUsd_in?: InputMaybe<Array<Scalars['Float']['input']>>;
    tokenLockedInUsd_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    tokenLockedInUsd_lt?: InputMaybe<Scalars['Float']['input']>;
    tokenLockedInUsd_lte?: InputMaybe<Scalars['Float']['input']>;
    tokenLockedInUsd_not_eq?: InputMaybe<Scalars['Float']['input']>;
    tokenLockedInUsd_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
    tokenLocked_eq?: InputMaybe<Scalars['Float']['input']>;
    tokenLocked_gt?: InputMaybe<Scalars['Float']['input']>;
    tokenLocked_gte?: InputMaybe<Scalars['Float']['input']>;
    tokenLocked_in?: InputMaybe<Array<Scalars['Float']['input']>>;
    tokenLocked_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    tokenLocked_lt?: InputMaybe<Scalars['Float']['input']>;
    tokenLocked_lte?: InputMaybe<Scalars['Float']['input']>;
    tokenLocked_not_eq?: InputMaybe<Scalars['Float']['input']>;
    tokenLocked_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
    totalAirdropsLaunched_eq?: InputMaybe<Scalars['Int']['input']>;
    totalAirdropsLaunched_gt?: InputMaybe<Scalars['Int']['input']>;
    totalAirdropsLaunched_gte?: InputMaybe<Scalars['Int']['input']>;
    totalAirdropsLaunched_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    totalAirdropsLaunched_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    totalAirdropsLaunched_lt?: InputMaybe<Scalars['Int']['input']>;
    totalAirdropsLaunched_lte?: InputMaybe<Scalars['Int']['input']>;
    totalAirdropsLaunched_not_eq?: InputMaybe<Scalars['Int']['input']>;
    totalAirdropsLaunched_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    totalParticipantsAirdrops_eq?: InputMaybe<Scalars['Int']['input']>;
    totalParticipantsAirdrops_gt?: InputMaybe<Scalars['Int']['input']>;
    totalParticipantsAirdrops_gte?: InputMaybe<Scalars['Int']['input']>;
    totalParticipantsAirdrops_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    totalParticipantsAirdrops_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    totalParticipantsAirdrops_lt?: InputMaybe<Scalars['Int']['input']>;
    totalParticipantsAirdrops_lte?: InputMaybe<Scalars['Int']['input']>;
    totalParticipantsAirdrops_not_eq?: InputMaybe<Scalars['Int']['input']>;
    totalParticipantsAirdrops_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    uniqueParticipants_containsAll?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    uniqueParticipants_containsAny?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    uniqueParticipants_containsNone?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    uniqueParticipants_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type AggregationsConnection = {
    __typename?: 'AggregationsConnection';
    edges: Array<AggregationEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type Airdrop = BaseEntity & {
    __typename?: 'Airdrop';
    allocatedUsers: Array<Maybe<Scalars['String']['output']>>;
    allocations: Array<Maybe<Allocation>>;
    chainId: Scalars['Int']['output'];
    contractAddress: Scalars['String']['output'];
    createdAt: Scalars['DateTime']['output'];
    cycle: Scalars['BigInt']['output'];
    id: Scalars['String']['output'];
    interval: Scalars['BigInt']['output'];
    isCancelled: Scalars['Boolean']['output'];
    isEnded: Scalars['Boolean']['output'];
    isVesting: Scalars['Boolean']['output'];
    metadata?: Maybe<AirdropTemp>;
    name: Scalars['String']['output'];
    owner: User;
    startTime?: Maybe<Scalars['BigInt']['output']>;
    status: Status;
    tge: Scalars['BigInt']['output'];
    token: Token;
    totalTokens: Scalars['BigInt']['output'];
    updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type AirdropEdge = {
    __typename?: 'AirdropEdge';
    cursor: Scalars['String']['output'];
    node: Airdrop;
};

export enum AirdropOrderByInput {
    ChainIdAsc = 'chainId_ASC',
    ChainIdAscNullsFirst = 'chainId_ASC_NULLS_FIRST',
    ChainIdDesc = 'chainId_DESC',
    ChainIdDescNullsLast = 'chainId_DESC_NULLS_LAST',
    ContractAddressAsc = 'contractAddress_ASC',
    ContractAddressAscNullsFirst = 'contractAddress_ASC_NULLS_FIRST',
    ContractAddressDesc = 'contractAddress_DESC',
    ContractAddressDescNullsLast = 'contractAddress_DESC_NULLS_LAST',
    CreatedAtAsc = 'createdAt_ASC',
    CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
    CreatedAtDesc = 'createdAt_DESC',
    CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
    CycleAsc = 'cycle_ASC',
    CycleAscNullsFirst = 'cycle_ASC_NULLS_FIRST',
    CycleDesc = 'cycle_DESC',
    CycleDescNullsLast = 'cycle_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    IntervalAsc = 'interval_ASC',
    IntervalAscNullsFirst = 'interval_ASC_NULLS_FIRST',
    IntervalDesc = 'interval_DESC',
    IntervalDescNullsLast = 'interval_DESC_NULLS_LAST',
    IsCancelledAsc = 'isCancelled_ASC',
    IsCancelledAscNullsFirst = 'isCancelled_ASC_NULLS_FIRST',
    IsCancelledDesc = 'isCancelled_DESC',
    IsCancelledDescNullsLast = 'isCancelled_DESC_NULLS_LAST',
    IsEndedAsc = 'isEnded_ASC',
    IsEndedAscNullsFirst = 'isEnded_ASC_NULLS_FIRST',
    IsEndedDesc = 'isEnded_DESC',
    IsEndedDescNullsLast = 'isEnded_DESC_NULLS_LAST',
    IsVestingAsc = 'isVesting_ASC',
    IsVestingAscNullsFirst = 'isVesting_ASC_NULLS_FIRST',
    IsVestingDesc = 'isVesting_DESC',
    IsVestingDescNullsLast = 'isVesting_DESC_NULLS_LAST',
    MetadataContractAddressAsc = 'metadata_contractAddress_ASC',
    MetadataContractAddressAscNullsFirst = 'metadata_contractAddress_ASC_NULLS_FIRST',
    MetadataContractAddressDesc = 'metadata_contractAddress_DESC',
    MetadataContractAddressDescNullsLast = 'metadata_contractAddress_DESC_NULLS_LAST',
    MetadataIdAsc = 'metadata_id_ASC',
    MetadataIdAscNullsFirst = 'metadata_id_ASC_NULLS_FIRST',
    MetadataIdDesc = 'metadata_id_DESC',
    MetadataIdDescNullsLast = 'metadata_id_DESC_NULLS_LAST',
    NameAsc = 'name_ASC',
    NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
    NameDesc = 'name_DESC',
    NameDescNullsLast = 'name_DESC_NULLS_LAST',
    OwnerChainIdAsc = 'owner_chainId_ASC',
    OwnerChainIdAscNullsFirst = 'owner_chainId_ASC_NULLS_FIRST',
    OwnerChainIdDesc = 'owner_chainId_DESC',
    OwnerChainIdDescNullsLast = 'owner_chainId_DESC_NULLS_LAST',
    OwnerCreatedAtAsc = 'owner_createdAt_ASC',
    OwnerCreatedAtAscNullsFirst = 'owner_createdAt_ASC_NULLS_FIRST',
    OwnerCreatedAtDesc = 'owner_createdAt_DESC',
    OwnerCreatedAtDescNullsLast = 'owner_createdAt_DESC_NULLS_LAST',
    OwnerIdAsc = 'owner_id_ASC',
    OwnerIdAscNullsFirst = 'owner_id_ASC_NULLS_FIRST',
    OwnerIdDesc = 'owner_id_DESC',
    OwnerIdDescNullsLast = 'owner_id_DESC_NULLS_LAST',
    OwnerUpdatedAtAsc = 'owner_updatedAt_ASC',
    OwnerUpdatedAtAscNullsFirst = 'owner_updatedAt_ASC_NULLS_FIRST',
    OwnerUpdatedAtDesc = 'owner_updatedAt_DESC',
    OwnerUpdatedAtDescNullsLast = 'owner_updatedAt_DESC_NULLS_LAST',
    StartTimeAsc = 'startTime_ASC',
    StartTimeAscNullsFirst = 'startTime_ASC_NULLS_FIRST',
    StartTimeDesc = 'startTime_DESC',
    StartTimeDescNullsLast = 'startTime_DESC_NULLS_LAST',
    StatusAsc = 'status_ASC',
    StatusAscNullsFirst = 'status_ASC_NULLS_FIRST',
    StatusDesc = 'status_DESC',
    StatusDescNullsLast = 'status_DESC_NULLS_LAST',
    TgeAsc = 'tge_ASC',
    TgeAscNullsFirst = 'tge_ASC_NULLS_FIRST',
    TgeDesc = 'tge_DESC',
    TgeDescNullsLast = 'tge_DESC_NULLS_LAST',
    TokenChainIdAsc = 'token_chainId_ASC',
    TokenChainIdAscNullsFirst = 'token_chainId_ASC_NULLS_FIRST',
    TokenChainIdDesc = 'token_chainId_DESC',
    TokenChainIdDescNullsLast = 'token_chainId_DESC_NULLS_LAST',
    TokenCreatedAtAsc = 'token_createdAt_ASC',
    TokenCreatedAtAscNullsFirst = 'token_createdAt_ASC_NULLS_FIRST',
    TokenCreatedAtDesc = 'token_createdAt_DESC',
    TokenCreatedAtDescNullsLast = 'token_createdAt_DESC_NULLS_LAST',
    TokenDecimalsAsc = 'token_decimals_ASC',
    TokenDecimalsAscNullsFirst = 'token_decimals_ASC_NULLS_FIRST',
    TokenDecimalsDesc = 'token_decimals_DESC',
    TokenDecimalsDescNullsLast = 'token_decimals_DESC_NULLS_LAST',
    TokenIdAsc = 'token_id_ASC',
    TokenIdAscNullsFirst = 'token_id_ASC_NULLS_FIRST',
    TokenIdDesc = 'token_id_DESC',
    TokenIdDescNullsLast = 'token_id_DESC_NULLS_LAST',
    TokenImageAsc = 'token_image_ASC',
    TokenImageAscNullsFirst = 'token_image_ASC_NULLS_FIRST',
    TokenImageDesc = 'token_image_DESC',
    TokenImageDescNullsLast = 'token_image_DESC_NULLS_LAST',
    TokenIsLiquidityTokenAsc = 'token_isLiquidityToken_ASC',
    TokenIsLiquidityTokenAscNullsFirst = 'token_isLiquidityToken_ASC_NULLS_FIRST',
    TokenIsLiquidityTokenDesc = 'token_isLiquidityToken_DESC',
    TokenIsLiquidityTokenDescNullsLast = 'token_isLiquidityToken_DESC_NULLS_LAST',
    TokenNameAsc = 'token_name_ASC',
    TokenNameAscNullsFirst = 'token_name_ASC_NULLS_FIRST',
    TokenNameDesc = 'token_name_DESC',
    TokenNameDescNullsLast = 'token_name_DESC_NULLS_LAST',
    TokenNextUnlockAsc = 'token_nextUnlock_ASC',
    TokenNextUnlockAscNullsFirst = 'token_nextUnlock_ASC_NULLS_FIRST',
    TokenNextUnlockDesc = 'token_nextUnlock_DESC',
    TokenNextUnlockDescNullsLast = 'token_nextUnlock_DESC_NULLS_LAST',
    TokenReserve0Asc = 'token_reserve0_ASC',
    TokenReserve0AscNullsFirst = 'token_reserve0_ASC_NULLS_FIRST',
    TokenReserve0Desc = 'token_reserve0_DESC',
    TokenReserve0DescNullsLast = 'token_reserve0_DESC_NULLS_LAST',
    TokenReserve1Asc = 'token_reserve1_ASC',
    TokenReserve1AscNullsFirst = 'token_reserve1_ASC_NULLS_FIRST',
    TokenReserve1Desc = 'token_reserve1_DESC',
    TokenReserve1DescNullsLast = 'token_reserve1_DESC_NULLS_LAST',
    TokenSymbolAsc = 'token_symbol_ASC',
    TokenSymbolAscNullsFirst = 'token_symbol_ASC_NULLS_FIRST',
    TokenSymbolDesc = 'token_symbol_DESC',
    TokenSymbolDescNullsLast = 'token_symbol_DESC_NULLS_LAST',
    TokenTokenLockedCountAsc = 'token_tokenLockedCount_ASC',
    TokenTokenLockedCountAscNullsFirst = 'token_tokenLockedCount_ASC_NULLS_FIRST',
    TokenTokenLockedCountDesc = 'token_tokenLockedCount_DESC',
    TokenTokenLockedCountDescNullsLast = 'token_tokenLockedCount_DESC_NULLS_LAST',
    TokenTokenLockedInUsdAsc = 'token_tokenLockedInUsd_ASC',
    TokenTokenLockedInUsdAscNullsFirst = 'token_tokenLockedInUsd_ASC_NULLS_FIRST',
    TokenTokenLockedInUsdDesc = 'token_tokenLockedInUsd_DESC',
    TokenTokenLockedInUsdDescNullsLast = 'token_tokenLockedInUsd_DESC_NULLS_LAST',
    TokenTokenLockedAsc = 'token_tokenLocked_ASC',
    TokenTokenLockedAscNullsFirst = 'token_tokenLocked_ASC_NULLS_FIRST',
    TokenTokenLockedDesc = 'token_tokenLocked_DESC',
    TokenTokenLockedDescNullsLast = 'token_tokenLocked_DESC_NULLS_LAST',
    TokenTotalSupplyAsc = 'token_totalSupply_ASC',
    TokenTotalSupplyAscNullsFirst = 'token_totalSupply_ASC_NULLS_FIRST',
    TokenTotalSupplyDesc = 'token_totalSupply_DESC',
    TokenTotalSupplyDescNullsLast = 'token_totalSupply_DESC_NULLS_LAST',
    TokenUpdatedAtAsc = 'token_updatedAt_ASC',
    TokenUpdatedAtAscNullsFirst = 'token_updatedAt_ASC_NULLS_FIRST',
    TokenUpdatedAtDesc = 'token_updatedAt_DESC',
    TokenUpdatedAtDescNullsLast = 'token_updatedAt_DESC_NULLS_LAST',
    TokenUsdPriceAsc = 'token_usdPrice_ASC',
    TokenUsdPriceAscNullsFirst = 'token_usdPrice_ASC_NULLS_FIRST',
    TokenUsdPriceDesc = 'token_usdPrice_DESC',
    TokenUsdPriceDescNullsLast = 'token_usdPrice_DESC_NULLS_LAST',
    TotalTokensAsc = 'totalTokens_ASC',
    TotalTokensAscNullsFirst = 'totalTokens_ASC_NULLS_FIRST',
    TotalTokensDesc = 'totalTokens_DESC',
    TotalTokensDescNullsLast = 'totalTokens_DESC_NULLS_LAST',
    UpdatedAtAsc = 'updatedAt_ASC',
    UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
    UpdatedAtDesc = 'updatedAt_DESC',
    UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
}

export type AirdropTemp = BaseTempData & {
    __typename?: 'AirdropTemp';
    contractAddress?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    socials: Socials;
};

export type AirdropTempEdge = {
    __typename?: 'AirdropTempEdge';
    cursor: Scalars['String']['output'];
    node: AirdropTemp;
};

export enum AirdropTempOrderByInput {
    ContractAddressAsc = 'contractAddress_ASC',
    ContractAddressAscNullsFirst = 'contractAddress_ASC_NULLS_FIRST',
    ContractAddressDesc = 'contractAddress_DESC',
    ContractAddressDescNullsLast = 'contractAddress_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    SocialsDescriptionAsc = 'socials_description_ASC',
    SocialsDescriptionAscNullsFirst = 'socials_description_ASC_NULLS_FIRST',
    SocialsDescriptionDesc = 'socials_description_DESC',
    SocialsDescriptionDescNullsLast = 'socials_description_DESC_NULLS_LAST',
    SocialsFacebookUrlAsc = 'socials_facebookUrl_ASC',
    SocialsFacebookUrlAscNullsFirst = 'socials_facebookUrl_ASC_NULLS_FIRST',
    SocialsFacebookUrlDesc = 'socials_facebookUrl_DESC',
    SocialsFacebookUrlDescNullsLast = 'socials_facebookUrl_DESC_NULLS_LAST',
    SocialsGithubUrlAsc = 'socials_githubUrl_ASC',
    SocialsGithubUrlAscNullsFirst = 'socials_githubUrl_ASC_NULLS_FIRST',
    SocialsGithubUrlDesc = 'socials_githubUrl_DESC',
    SocialsGithubUrlDescNullsLast = 'socials_githubUrl_DESC_NULLS_LAST',
    SocialsLogoUrlAsc = 'socials_logoUrl_ASC',
    SocialsLogoUrlAscNullsFirst = 'socials_logoUrl_ASC_NULLS_FIRST',
    SocialsLogoUrlDesc = 'socials_logoUrl_DESC',
    SocialsLogoUrlDescNullsLast = 'socials_logoUrl_DESC_NULLS_LAST',
    SocialsRedditUrlAsc = 'socials_redditUrl_ASC',
    SocialsRedditUrlAscNullsFirst = 'socials_redditUrl_ASC_NULLS_FIRST',
    SocialsRedditUrlDesc = 'socials_redditUrl_DESC',
    SocialsRedditUrlDescNullsLast = 'socials_redditUrl_DESC_NULLS_LAST',
    SocialsTelegramUrlAsc = 'socials_telegramUrl_ASC',
    SocialsTelegramUrlAscNullsFirst = 'socials_telegramUrl_ASC_NULLS_FIRST',
    SocialsTelegramUrlDesc = 'socials_telegramUrl_DESC',
    SocialsTelegramUrlDescNullsLast = 'socials_telegramUrl_DESC_NULLS_LAST',
    SocialsTwitterUrlAsc = 'socials_twitterUrl_ASC',
    SocialsTwitterUrlAscNullsFirst = 'socials_twitterUrl_ASC_NULLS_FIRST',
    SocialsTwitterUrlDesc = 'socials_twitterUrl_DESC',
    SocialsTwitterUrlDescNullsLast = 'socials_twitterUrl_DESC_NULLS_LAST',
    SocialsWebUrlAsc = 'socials_webUrl_ASC',
    SocialsWebUrlAscNullsFirst = 'socials_webUrl_ASC_NULLS_FIRST',
    SocialsWebUrlDesc = 'socials_webUrl_DESC',
    SocialsWebUrlDescNullsLast = 'socials_webUrl_DESC_NULLS_LAST',
    SocialsYoutubeUrlAsc = 'socials_youtubeUrl_ASC',
    SocialsYoutubeUrlAscNullsFirst = 'socials_youtubeUrl_ASC_NULLS_FIRST',
    SocialsYoutubeUrlDesc = 'socials_youtubeUrl_DESC',
    SocialsYoutubeUrlDescNullsLast = 'socials_youtubeUrl_DESC_NULLS_LAST',
}

export type AirdropTempWhereInput = {
    AND?: InputMaybe<Array<AirdropTempWhereInput>>;
    OR?: InputMaybe<Array<AirdropTempWhereInput>>;
    contractAddress_contains?: InputMaybe<Scalars['String']['input']>;
    contractAddress_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    contractAddress_endsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_eq?: InputMaybe<Scalars['String']['input']>;
    contractAddress_gt?: InputMaybe<Scalars['String']['input']>;
    contractAddress_gte?: InputMaybe<Scalars['String']['input']>;
    contractAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
    contractAddress_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    contractAddress_lt?: InputMaybe<Scalars['String']['input']>;
    contractAddress_lte?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_eq?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    contractAddress_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    socials?: InputMaybe<SocialsWhereInput>;
    socials_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AirdropTempsConnection = {
    __typename?: 'AirdropTempsConnection';
    edges: Array<AirdropTempEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type AirdropWhereInput = {
    AND?: InputMaybe<Array<AirdropWhereInput>>;
    OR?: InputMaybe<Array<AirdropWhereInput>>;
    allocatedUsers_containsAll?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    allocatedUsers_containsAny?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    allocatedUsers_containsNone?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    allocatedUsers_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    allocations_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    chainId_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_gt?: InputMaybe<Scalars['Int']['input']>;
    chainId_gte?: InputMaybe<Scalars['Int']['input']>;
    chainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    chainId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    chainId_lt?: InputMaybe<Scalars['Int']['input']>;
    chainId_lte?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    contractAddress_contains?: InputMaybe<Scalars['String']['input']>;
    contractAddress_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    contractAddress_endsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_eq?: InputMaybe<Scalars['String']['input']>;
    contractAddress_gt?: InputMaybe<Scalars['String']['input']>;
    contractAddress_gte?: InputMaybe<Scalars['String']['input']>;
    contractAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
    contractAddress_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    contractAddress_lt?: InputMaybe<Scalars['String']['input']>;
    contractAddress_lte?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_eq?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    contractAddress_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_startsWith?: InputMaybe<Scalars['String']['input']>;
    createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    cycle_eq?: InputMaybe<Scalars['BigInt']['input']>;
    cycle_gt?: InputMaybe<Scalars['BigInt']['input']>;
    cycle_gte?: InputMaybe<Scalars['BigInt']['input']>;
    cycle_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    cycle_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    cycle_lt?: InputMaybe<Scalars['BigInt']['input']>;
    cycle_lte?: InputMaybe<Scalars['BigInt']['input']>;
    cycle_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    cycle_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    interval_eq?: InputMaybe<Scalars['BigInt']['input']>;
    interval_gt?: InputMaybe<Scalars['BigInt']['input']>;
    interval_gte?: InputMaybe<Scalars['BigInt']['input']>;
    interval_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    interval_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    interval_lt?: InputMaybe<Scalars['BigInt']['input']>;
    interval_lte?: InputMaybe<Scalars['BigInt']['input']>;
    interval_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    interval_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    isCancelled_eq?: InputMaybe<Scalars['Boolean']['input']>;
    isCancelled_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    isCancelled_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
    isEnded_eq?: InputMaybe<Scalars['Boolean']['input']>;
    isEnded_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    isEnded_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
    isVesting_eq?: InputMaybe<Scalars['Boolean']['input']>;
    isVesting_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    isVesting_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
    metadata?: InputMaybe<AirdropTempWhereInput>;
    metadata_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    name_contains?: InputMaybe<Scalars['String']['input']>;
    name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    name_endsWith?: InputMaybe<Scalars['String']['input']>;
    name_eq?: InputMaybe<Scalars['String']['input']>;
    name_gt?: InputMaybe<Scalars['String']['input']>;
    name_gte?: InputMaybe<Scalars['String']['input']>;
    name_in?: InputMaybe<Array<Scalars['String']['input']>>;
    name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    name_lt?: InputMaybe<Scalars['String']['input']>;
    name_lte?: InputMaybe<Scalars['String']['input']>;
    name_not_contains?: InputMaybe<Scalars['String']['input']>;
    name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    name_not_eq?: InputMaybe<Scalars['String']['input']>;
    name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    name_startsWith?: InputMaybe<Scalars['String']['input']>;
    owner?: InputMaybe<UserWhereInput>;
    owner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    startTime_eq?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    startTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    startTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    status_eq?: InputMaybe<Status>;
    status_in?: InputMaybe<Array<Status>>;
    status_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    status_not_eq?: InputMaybe<Status>;
    status_not_in?: InputMaybe<Array<Status>>;
    tge_eq?: InputMaybe<Scalars['BigInt']['input']>;
    tge_gt?: InputMaybe<Scalars['BigInt']['input']>;
    tge_gte?: InputMaybe<Scalars['BigInt']['input']>;
    tge_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    tge_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    tge_lt?: InputMaybe<Scalars['BigInt']['input']>;
    tge_lte?: InputMaybe<Scalars['BigInt']['input']>;
    tge_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    tge_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    token?: InputMaybe<TokenWhereInput>;
    token_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    totalTokens_eq?: InputMaybe<Scalars['BigInt']['input']>;
    totalTokens_gt?: InputMaybe<Scalars['BigInt']['input']>;
    totalTokens_gte?: InputMaybe<Scalars['BigInt']['input']>;
    totalTokens_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    totalTokens_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    totalTokens_lt?: InputMaybe<Scalars['BigInt']['input']>;
    totalTokens_lte?: InputMaybe<Scalars['BigInt']['input']>;
    totalTokens_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    totalTokens_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type AirdropsConnection = {
    __typename?: 'AirdropsConnection';
    edges: Array<AirdropEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type Allocation = {
    __typename?: 'Allocation';
    amount: Scalars['BigInt']['output'];
    user: Scalars['String']['output'];
};

export type Antibot = {
    __typename?: 'Antibot';
    blacklist?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
    id: Scalars['String']['output'];
    whitelist?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type AntibotEdge = {
    __typename?: 'AntibotEdge';
    cursor: Scalars['String']['output'];
    node: Antibot;
};

export enum AntibotOrderByInput {
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
}

export type AntibotWhereInput = {
    AND?: InputMaybe<Array<AntibotWhereInput>>;
    OR?: InputMaybe<Array<AntibotWhereInput>>;
    blacklist_containsAll?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    blacklist_containsAny?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    blacklist_containsNone?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    blacklist_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    whitelist_containsAll?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    whitelist_containsAny?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    whitelist_containsNone?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    whitelist_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AntibotsConnection = {
    __typename?: 'AntibotsConnection';
    edges: Array<AntibotEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type BaseEntity = {
    chainId: Scalars['Int']['output'];
    createdAt: Scalars['DateTime']['output'];
    id: Scalars['String']['output'];
    updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type BaseTempData = {
    id: Scalars['String']['output'];
    socials: Socials;
};

export type Claimer = BaseEntity & {
    __typename?: 'Claimer';
    amount: Scalars['String']['output'];
    cadance: Scalars['Int']['output'];
    chainId: Scalars['Int']['output'];
    cliff: Scalars['Int']['output'];
    createdAt: Scalars['DateTime']['output'];
    end: Scalars['Int']['output'];
    id: Scalars['String']['output'];
    index: Scalars['Int']['output'];
    merkleProof: Array<Maybe<Scalars['String']['output']>>;
    percentageOnStart: Scalars['Int']['output'];
    revocable: Scalars['Boolean']['output'];
    start: Scalars['Int']['output'];
    token: Token;
    updatedAt?: Maybe<Scalars['DateTime']['output']>;
    user: User;
    vesting: Vesting;
};

export type ClaimerEdge = {
    __typename?: 'ClaimerEdge';
    cursor: Scalars['String']['output'];
    node: Claimer;
};

export enum ClaimerOrderByInput {
    AmountAsc = 'amount_ASC',
    AmountAscNullsFirst = 'amount_ASC_NULLS_FIRST',
    AmountDesc = 'amount_DESC',
    AmountDescNullsLast = 'amount_DESC_NULLS_LAST',
    CadanceAsc = 'cadance_ASC',
    CadanceAscNullsFirst = 'cadance_ASC_NULLS_FIRST',
    CadanceDesc = 'cadance_DESC',
    CadanceDescNullsLast = 'cadance_DESC_NULLS_LAST',
    ChainIdAsc = 'chainId_ASC',
    ChainIdAscNullsFirst = 'chainId_ASC_NULLS_FIRST',
    ChainIdDesc = 'chainId_DESC',
    ChainIdDescNullsLast = 'chainId_DESC_NULLS_LAST',
    CliffAsc = 'cliff_ASC',
    CliffAscNullsFirst = 'cliff_ASC_NULLS_FIRST',
    CliffDesc = 'cliff_DESC',
    CliffDescNullsLast = 'cliff_DESC_NULLS_LAST',
    CreatedAtAsc = 'createdAt_ASC',
    CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
    CreatedAtDesc = 'createdAt_DESC',
    CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
    EndAsc = 'end_ASC',
    EndAscNullsFirst = 'end_ASC_NULLS_FIRST',
    EndDesc = 'end_DESC',
    EndDescNullsLast = 'end_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    IndexAsc = 'index_ASC',
    IndexAscNullsFirst = 'index_ASC_NULLS_FIRST',
    IndexDesc = 'index_DESC',
    IndexDescNullsLast = 'index_DESC_NULLS_LAST',
    PercentageOnStartAsc = 'percentageOnStart_ASC',
    PercentageOnStartAscNullsFirst = 'percentageOnStart_ASC_NULLS_FIRST',
    PercentageOnStartDesc = 'percentageOnStart_DESC',
    PercentageOnStartDescNullsLast = 'percentageOnStart_DESC_NULLS_LAST',
    RevocableAsc = 'revocable_ASC',
    RevocableAscNullsFirst = 'revocable_ASC_NULLS_FIRST',
    RevocableDesc = 'revocable_DESC',
    RevocableDescNullsLast = 'revocable_DESC_NULLS_LAST',
    StartAsc = 'start_ASC',
    StartAscNullsFirst = 'start_ASC_NULLS_FIRST',
    StartDesc = 'start_DESC',
    StartDescNullsLast = 'start_DESC_NULLS_LAST',
    TokenChainIdAsc = 'token_chainId_ASC',
    TokenChainIdAscNullsFirst = 'token_chainId_ASC_NULLS_FIRST',
    TokenChainIdDesc = 'token_chainId_DESC',
    TokenChainIdDescNullsLast = 'token_chainId_DESC_NULLS_LAST',
    TokenCreatedAtAsc = 'token_createdAt_ASC',
    TokenCreatedAtAscNullsFirst = 'token_createdAt_ASC_NULLS_FIRST',
    TokenCreatedAtDesc = 'token_createdAt_DESC',
    TokenCreatedAtDescNullsLast = 'token_createdAt_DESC_NULLS_LAST',
    TokenDecimalsAsc = 'token_decimals_ASC',
    TokenDecimalsAscNullsFirst = 'token_decimals_ASC_NULLS_FIRST',
    TokenDecimalsDesc = 'token_decimals_DESC',
    TokenDecimalsDescNullsLast = 'token_decimals_DESC_NULLS_LAST',
    TokenIdAsc = 'token_id_ASC',
    TokenIdAscNullsFirst = 'token_id_ASC_NULLS_FIRST',
    TokenIdDesc = 'token_id_DESC',
    TokenIdDescNullsLast = 'token_id_DESC_NULLS_LAST',
    TokenImageAsc = 'token_image_ASC',
    TokenImageAscNullsFirst = 'token_image_ASC_NULLS_FIRST',
    TokenImageDesc = 'token_image_DESC',
    TokenImageDescNullsLast = 'token_image_DESC_NULLS_LAST',
    TokenIsLiquidityTokenAsc = 'token_isLiquidityToken_ASC',
    TokenIsLiquidityTokenAscNullsFirst = 'token_isLiquidityToken_ASC_NULLS_FIRST',
    TokenIsLiquidityTokenDesc = 'token_isLiquidityToken_DESC',
    TokenIsLiquidityTokenDescNullsLast = 'token_isLiquidityToken_DESC_NULLS_LAST',
    TokenNameAsc = 'token_name_ASC',
    TokenNameAscNullsFirst = 'token_name_ASC_NULLS_FIRST',
    TokenNameDesc = 'token_name_DESC',
    TokenNameDescNullsLast = 'token_name_DESC_NULLS_LAST',
    TokenNextUnlockAsc = 'token_nextUnlock_ASC',
    TokenNextUnlockAscNullsFirst = 'token_nextUnlock_ASC_NULLS_FIRST',
    TokenNextUnlockDesc = 'token_nextUnlock_DESC',
    TokenNextUnlockDescNullsLast = 'token_nextUnlock_DESC_NULLS_LAST',
    TokenReserve0Asc = 'token_reserve0_ASC',
    TokenReserve0AscNullsFirst = 'token_reserve0_ASC_NULLS_FIRST',
    TokenReserve0Desc = 'token_reserve0_DESC',
    TokenReserve0DescNullsLast = 'token_reserve0_DESC_NULLS_LAST',
    TokenReserve1Asc = 'token_reserve1_ASC',
    TokenReserve1AscNullsFirst = 'token_reserve1_ASC_NULLS_FIRST',
    TokenReserve1Desc = 'token_reserve1_DESC',
    TokenReserve1DescNullsLast = 'token_reserve1_DESC_NULLS_LAST',
    TokenSymbolAsc = 'token_symbol_ASC',
    TokenSymbolAscNullsFirst = 'token_symbol_ASC_NULLS_FIRST',
    TokenSymbolDesc = 'token_symbol_DESC',
    TokenSymbolDescNullsLast = 'token_symbol_DESC_NULLS_LAST',
    TokenTokenLockedCountAsc = 'token_tokenLockedCount_ASC',
    TokenTokenLockedCountAscNullsFirst = 'token_tokenLockedCount_ASC_NULLS_FIRST',
    TokenTokenLockedCountDesc = 'token_tokenLockedCount_DESC',
    TokenTokenLockedCountDescNullsLast = 'token_tokenLockedCount_DESC_NULLS_LAST',
    TokenTokenLockedInUsdAsc = 'token_tokenLockedInUsd_ASC',
    TokenTokenLockedInUsdAscNullsFirst = 'token_tokenLockedInUsd_ASC_NULLS_FIRST',
    TokenTokenLockedInUsdDesc = 'token_tokenLockedInUsd_DESC',
    TokenTokenLockedInUsdDescNullsLast = 'token_tokenLockedInUsd_DESC_NULLS_LAST',
    TokenTokenLockedAsc = 'token_tokenLocked_ASC',
    TokenTokenLockedAscNullsFirst = 'token_tokenLocked_ASC_NULLS_FIRST',
    TokenTokenLockedDesc = 'token_tokenLocked_DESC',
    TokenTokenLockedDescNullsLast = 'token_tokenLocked_DESC_NULLS_LAST',
    TokenTotalSupplyAsc = 'token_totalSupply_ASC',
    TokenTotalSupplyAscNullsFirst = 'token_totalSupply_ASC_NULLS_FIRST',
    TokenTotalSupplyDesc = 'token_totalSupply_DESC',
    TokenTotalSupplyDescNullsLast = 'token_totalSupply_DESC_NULLS_LAST',
    TokenUpdatedAtAsc = 'token_updatedAt_ASC',
    TokenUpdatedAtAscNullsFirst = 'token_updatedAt_ASC_NULLS_FIRST',
    TokenUpdatedAtDesc = 'token_updatedAt_DESC',
    TokenUpdatedAtDescNullsLast = 'token_updatedAt_DESC_NULLS_LAST',
    TokenUsdPriceAsc = 'token_usdPrice_ASC',
    TokenUsdPriceAscNullsFirst = 'token_usdPrice_ASC_NULLS_FIRST',
    TokenUsdPriceDesc = 'token_usdPrice_DESC',
    TokenUsdPriceDescNullsLast = 'token_usdPrice_DESC_NULLS_LAST',
    UpdatedAtAsc = 'updatedAt_ASC',
    UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
    UpdatedAtDesc = 'updatedAt_DESC',
    UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
    UserChainIdAsc = 'user_chainId_ASC',
    UserChainIdAscNullsFirst = 'user_chainId_ASC_NULLS_FIRST',
    UserChainIdDesc = 'user_chainId_DESC',
    UserChainIdDescNullsLast = 'user_chainId_DESC_NULLS_LAST',
    UserCreatedAtAsc = 'user_createdAt_ASC',
    UserCreatedAtAscNullsFirst = 'user_createdAt_ASC_NULLS_FIRST',
    UserCreatedAtDesc = 'user_createdAt_DESC',
    UserCreatedAtDescNullsLast = 'user_createdAt_DESC_NULLS_LAST',
    UserIdAsc = 'user_id_ASC',
    UserIdAscNullsFirst = 'user_id_ASC_NULLS_FIRST',
    UserIdDesc = 'user_id_DESC',
    UserIdDescNullsLast = 'user_id_DESC_NULLS_LAST',
    UserUpdatedAtAsc = 'user_updatedAt_ASC',
    UserUpdatedAtAscNullsFirst = 'user_updatedAt_ASC_NULLS_FIRST',
    UserUpdatedAtDesc = 'user_updatedAt_DESC',
    UserUpdatedAtDescNullsLast = 'user_updatedAt_DESC_NULLS_LAST',
    VestingChainIdAsc = 'vesting_chainId_ASC',
    VestingChainIdAscNullsFirst = 'vesting_chainId_ASC_NULLS_FIRST',
    VestingChainIdDesc = 'vesting_chainId_DESC',
    VestingChainIdDescNullsLast = 'vesting_chainId_DESC_NULLS_LAST',
    VestingCreatedAtAsc = 'vesting_createdAt_ASC',
    VestingCreatedAtAscNullsFirst = 'vesting_createdAt_ASC_NULLS_FIRST',
    VestingCreatedAtDesc = 'vesting_createdAt_DESC',
    VestingCreatedAtDescNullsLast = 'vesting_createdAt_DESC_NULLS_LAST',
    VestingDataUriAsc = 'vesting_dataUri_ASC',
    VestingDataUriAscNullsFirst = 'vesting_dataUri_ASC_NULLS_FIRST',
    VestingDataUriDesc = 'vesting_dataUri_DESC',
    VestingDataUriDescNullsLast = 'vesting_dataUri_DESC_NULLS_LAST',
    VestingIdAsc = 'vesting_id_ASC',
    VestingIdAscNullsFirst = 'vesting_id_ASC_NULLS_FIRST',
    VestingIdDesc = 'vesting_id_DESC',
    VestingIdDescNullsLast = 'vesting_id_DESC_NULLS_LAST',
    VestingMerkleRootAsc = 'vesting_merkleRoot_ASC',
    VestingMerkleRootAscNullsFirst = 'vesting_merkleRoot_ASC_NULLS_FIRST',
    VestingMerkleRootDesc = 'vesting_merkleRoot_DESC',
    VestingMerkleRootDescNullsLast = 'vesting_merkleRoot_DESC_NULLS_LAST',
    VestingTotalAmountAsc = 'vesting_totalAmount_ASC',
    VestingTotalAmountAscNullsFirst = 'vesting_totalAmount_ASC_NULLS_FIRST',
    VestingTotalAmountDesc = 'vesting_totalAmount_DESC',
    VestingTotalAmountDescNullsLast = 'vesting_totalAmount_DESC_NULLS_LAST',
    VestingUpdatedAtAsc = 'vesting_updatedAt_ASC',
    VestingUpdatedAtAscNullsFirst = 'vesting_updatedAt_ASC_NULLS_FIRST',
    VestingUpdatedAtDesc = 'vesting_updatedAt_DESC',
    VestingUpdatedAtDescNullsLast = 'vesting_updatedAt_DESC_NULLS_LAST',
}

export type ClaimerWhereInput = {
    AND?: InputMaybe<Array<ClaimerWhereInput>>;
    OR?: InputMaybe<Array<ClaimerWhereInput>>;
    amount_contains?: InputMaybe<Scalars['String']['input']>;
    amount_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    amount_endsWith?: InputMaybe<Scalars['String']['input']>;
    amount_eq?: InputMaybe<Scalars['String']['input']>;
    amount_gt?: InputMaybe<Scalars['String']['input']>;
    amount_gte?: InputMaybe<Scalars['String']['input']>;
    amount_in?: InputMaybe<Array<Scalars['String']['input']>>;
    amount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    amount_lt?: InputMaybe<Scalars['String']['input']>;
    amount_lte?: InputMaybe<Scalars['String']['input']>;
    amount_not_contains?: InputMaybe<Scalars['String']['input']>;
    amount_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    amount_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    amount_not_eq?: InputMaybe<Scalars['String']['input']>;
    amount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    amount_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    amount_startsWith?: InputMaybe<Scalars['String']['input']>;
    cadance_eq?: InputMaybe<Scalars['Int']['input']>;
    cadance_gt?: InputMaybe<Scalars['Int']['input']>;
    cadance_gte?: InputMaybe<Scalars['Int']['input']>;
    cadance_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    cadance_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    cadance_lt?: InputMaybe<Scalars['Int']['input']>;
    cadance_lte?: InputMaybe<Scalars['Int']['input']>;
    cadance_not_eq?: InputMaybe<Scalars['Int']['input']>;
    cadance_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    chainId_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_gt?: InputMaybe<Scalars['Int']['input']>;
    chainId_gte?: InputMaybe<Scalars['Int']['input']>;
    chainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    chainId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    chainId_lt?: InputMaybe<Scalars['Int']['input']>;
    chainId_lte?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    cliff_eq?: InputMaybe<Scalars['Int']['input']>;
    cliff_gt?: InputMaybe<Scalars['Int']['input']>;
    cliff_gte?: InputMaybe<Scalars['Int']['input']>;
    cliff_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    cliff_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    cliff_lt?: InputMaybe<Scalars['Int']['input']>;
    cliff_lte?: InputMaybe<Scalars['Int']['input']>;
    cliff_not_eq?: InputMaybe<Scalars['Int']['input']>;
    cliff_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    end_eq?: InputMaybe<Scalars['Int']['input']>;
    end_gt?: InputMaybe<Scalars['Int']['input']>;
    end_gte?: InputMaybe<Scalars['Int']['input']>;
    end_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    end_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    end_lt?: InputMaybe<Scalars['Int']['input']>;
    end_lte?: InputMaybe<Scalars['Int']['input']>;
    end_not_eq?: InputMaybe<Scalars['Int']['input']>;
    end_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    index_eq?: InputMaybe<Scalars['Int']['input']>;
    index_gt?: InputMaybe<Scalars['Int']['input']>;
    index_gte?: InputMaybe<Scalars['Int']['input']>;
    index_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    index_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    index_lt?: InputMaybe<Scalars['Int']['input']>;
    index_lte?: InputMaybe<Scalars['Int']['input']>;
    index_not_eq?: InputMaybe<Scalars['Int']['input']>;
    index_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    merkleProof_containsAll?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    merkleProof_containsAny?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    merkleProof_containsNone?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    merkleProof_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    percentageOnStart_eq?: InputMaybe<Scalars['Int']['input']>;
    percentageOnStart_gt?: InputMaybe<Scalars['Int']['input']>;
    percentageOnStart_gte?: InputMaybe<Scalars['Int']['input']>;
    percentageOnStart_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    percentageOnStart_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    percentageOnStart_lt?: InputMaybe<Scalars['Int']['input']>;
    percentageOnStart_lte?: InputMaybe<Scalars['Int']['input']>;
    percentageOnStart_not_eq?: InputMaybe<Scalars['Int']['input']>;
    percentageOnStart_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    revocable_eq?: InputMaybe<Scalars['Boolean']['input']>;
    revocable_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    revocable_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
    start_eq?: InputMaybe<Scalars['Int']['input']>;
    start_gt?: InputMaybe<Scalars['Int']['input']>;
    start_gte?: InputMaybe<Scalars['Int']['input']>;
    start_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    start_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    start_lt?: InputMaybe<Scalars['Int']['input']>;
    start_lte?: InputMaybe<Scalars['Int']['input']>;
    start_not_eq?: InputMaybe<Scalars['Int']['input']>;
    start_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    token?: InputMaybe<TokenWhereInput>;
    token_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    user?: InputMaybe<UserWhereInput>;
    user_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    vesting?: InputMaybe<VestingWhereInput>;
    vesting_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ClaimersConnection = {
    __typename?: 'ClaimersConnection';
    edges: Array<ClaimerEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type FundToken = {
    __typename?: 'FundToken';
    decimals: Scalars['Int']['output'];
    id: Scalars['String']['output'];
    isNative: Scalars['Boolean']['output'];
    name: Scalars['String']['output'];
    symbol: Scalars['String']['output'];
};

export type FundTokenEdge = {
    __typename?: 'FundTokenEdge';
    cursor: Scalars['String']['output'];
    node: FundToken;
};

export enum FundTokenOrderByInput {
    DecimalsAsc = 'decimals_ASC',
    DecimalsAscNullsFirst = 'decimals_ASC_NULLS_FIRST',
    DecimalsDesc = 'decimals_DESC',
    DecimalsDescNullsLast = 'decimals_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    IsNativeAsc = 'isNative_ASC',
    IsNativeAscNullsFirst = 'isNative_ASC_NULLS_FIRST',
    IsNativeDesc = 'isNative_DESC',
    IsNativeDescNullsLast = 'isNative_DESC_NULLS_LAST',
    NameAsc = 'name_ASC',
    NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
    NameDesc = 'name_DESC',
    NameDescNullsLast = 'name_DESC_NULLS_LAST',
    SymbolAsc = 'symbol_ASC',
    SymbolAscNullsFirst = 'symbol_ASC_NULLS_FIRST',
    SymbolDesc = 'symbol_DESC',
    SymbolDescNullsLast = 'symbol_DESC_NULLS_LAST',
}

export type FundTokenWhereInput = {
    AND?: InputMaybe<Array<FundTokenWhereInput>>;
    OR?: InputMaybe<Array<FundTokenWhereInput>>;
    decimals_eq?: InputMaybe<Scalars['Int']['input']>;
    decimals_gt?: InputMaybe<Scalars['Int']['input']>;
    decimals_gte?: InputMaybe<Scalars['Int']['input']>;
    decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    decimals_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    decimals_lt?: InputMaybe<Scalars['Int']['input']>;
    decimals_lte?: InputMaybe<Scalars['Int']['input']>;
    decimals_not_eq?: InputMaybe<Scalars['Int']['input']>;
    decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    isNative_eq?: InputMaybe<Scalars['Boolean']['input']>;
    isNative_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    isNative_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
    name_contains?: InputMaybe<Scalars['String']['input']>;
    name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    name_endsWith?: InputMaybe<Scalars['String']['input']>;
    name_eq?: InputMaybe<Scalars['String']['input']>;
    name_gt?: InputMaybe<Scalars['String']['input']>;
    name_gte?: InputMaybe<Scalars['String']['input']>;
    name_in?: InputMaybe<Array<Scalars['String']['input']>>;
    name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    name_lt?: InputMaybe<Scalars['String']['input']>;
    name_lte?: InputMaybe<Scalars['String']['input']>;
    name_not_contains?: InputMaybe<Scalars['String']['input']>;
    name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    name_not_eq?: InputMaybe<Scalars['String']['input']>;
    name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    name_startsWith?: InputMaybe<Scalars['String']['input']>;
    symbol_contains?: InputMaybe<Scalars['String']['input']>;
    symbol_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    symbol_endsWith?: InputMaybe<Scalars['String']['input']>;
    symbol_eq?: InputMaybe<Scalars['String']['input']>;
    symbol_gt?: InputMaybe<Scalars['String']['input']>;
    symbol_gte?: InputMaybe<Scalars['String']['input']>;
    symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
    symbol_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    symbol_lt?: InputMaybe<Scalars['String']['input']>;
    symbol_lte?: InputMaybe<Scalars['String']['input']>;
    symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
    symbol_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    symbol_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    symbol_not_eq?: InputMaybe<Scalars['String']['input']>;
    symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    symbol_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    symbol_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type FundTokensConnection = {
    __typename?: 'FundTokensConnection';
    edges: Array<FundTokenEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type GemlaunchToken = BaseEntity & {
    __typename?: 'GemlaunchToken';
    chainId: Scalars['Int']['output'];
    createdAt: Scalars['DateTime']['output'];
    decimals: Scalars['Int']['output'];
    id: Scalars['String']['output'];
    image?: Maybe<Scalars['String']['output']>;
    name: Scalars['String']['output'];
    owner: User;
    symbol: Scalars['String']['output'];
    tokenType: Scalars['Int']['output'];
    totalSupply: Scalars['BigInt']['output'];
    updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type GemlaunchTokenEdge = {
    __typename?: 'GemlaunchTokenEdge';
    cursor: Scalars['String']['output'];
    node: GemlaunchToken;
};

export enum GemlaunchTokenOrderByInput {
    ChainIdAsc = 'chainId_ASC',
    ChainIdAscNullsFirst = 'chainId_ASC_NULLS_FIRST',
    ChainIdDesc = 'chainId_DESC',
    ChainIdDescNullsLast = 'chainId_DESC_NULLS_LAST',
    CreatedAtAsc = 'createdAt_ASC',
    CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
    CreatedAtDesc = 'createdAt_DESC',
    CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
    DecimalsAsc = 'decimals_ASC',
    DecimalsAscNullsFirst = 'decimals_ASC_NULLS_FIRST',
    DecimalsDesc = 'decimals_DESC',
    DecimalsDescNullsLast = 'decimals_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    ImageAsc = 'image_ASC',
    ImageAscNullsFirst = 'image_ASC_NULLS_FIRST',
    ImageDesc = 'image_DESC',
    ImageDescNullsLast = 'image_DESC_NULLS_LAST',
    NameAsc = 'name_ASC',
    NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
    NameDesc = 'name_DESC',
    NameDescNullsLast = 'name_DESC_NULLS_LAST',
    OwnerChainIdAsc = 'owner_chainId_ASC',
    OwnerChainIdAscNullsFirst = 'owner_chainId_ASC_NULLS_FIRST',
    OwnerChainIdDesc = 'owner_chainId_DESC',
    OwnerChainIdDescNullsLast = 'owner_chainId_DESC_NULLS_LAST',
    OwnerCreatedAtAsc = 'owner_createdAt_ASC',
    OwnerCreatedAtAscNullsFirst = 'owner_createdAt_ASC_NULLS_FIRST',
    OwnerCreatedAtDesc = 'owner_createdAt_DESC',
    OwnerCreatedAtDescNullsLast = 'owner_createdAt_DESC_NULLS_LAST',
    OwnerIdAsc = 'owner_id_ASC',
    OwnerIdAscNullsFirst = 'owner_id_ASC_NULLS_FIRST',
    OwnerIdDesc = 'owner_id_DESC',
    OwnerIdDescNullsLast = 'owner_id_DESC_NULLS_LAST',
    OwnerUpdatedAtAsc = 'owner_updatedAt_ASC',
    OwnerUpdatedAtAscNullsFirst = 'owner_updatedAt_ASC_NULLS_FIRST',
    OwnerUpdatedAtDesc = 'owner_updatedAt_DESC',
    OwnerUpdatedAtDescNullsLast = 'owner_updatedAt_DESC_NULLS_LAST',
    SymbolAsc = 'symbol_ASC',
    SymbolAscNullsFirst = 'symbol_ASC_NULLS_FIRST',
    SymbolDesc = 'symbol_DESC',
    SymbolDescNullsLast = 'symbol_DESC_NULLS_LAST',
    TokenTypeAsc = 'tokenType_ASC',
    TokenTypeAscNullsFirst = 'tokenType_ASC_NULLS_FIRST',
    TokenTypeDesc = 'tokenType_DESC',
    TokenTypeDescNullsLast = 'tokenType_DESC_NULLS_LAST',
    TotalSupplyAsc = 'totalSupply_ASC',
    TotalSupplyAscNullsFirst = 'totalSupply_ASC_NULLS_FIRST',
    TotalSupplyDesc = 'totalSupply_DESC',
    TotalSupplyDescNullsLast = 'totalSupply_DESC_NULLS_LAST',
    UpdatedAtAsc = 'updatedAt_ASC',
    UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
    UpdatedAtDesc = 'updatedAt_DESC',
    UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
}

export type GemlaunchTokenWhereInput = {
    AND?: InputMaybe<Array<GemlaunchTokenWhereInput>>;
    OR?: InputMaybe<Array<GemlaunchTokenWhereInput>>;
    chainId_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_gt?: InputMaybe<Scalars['Int']['input']>;
    chainId_gte?: InputMaybe<Scalars['Int']['input']>;
    chainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    chainId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    chainId_lt?: InputMaybe<Scalars['Int']['input']>;
    chainId_lte?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    decimals_eq?: InputMaybe<Scalars['Int']['input']>;
    decimals_gt?: InputMaybe<Scalars['Int']['input']>;
    decimals_gte?: InputMaybe<Scalars['Int']['input']>;
    decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    decimals_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    decimals_lt?: InputMaybe<Scalars['Int']['input']>;
    decimals_lte?: InputMaybe<Scalars['Int']['input']>;
    decimals_not_eq?: InputMaybe<Scalars['Int']['input']>;
    decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    image_contains?: InputMaybe<Scalars['String']['input']>;
    image_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    image_endsWith?: InputMaybe<Scalars['String']['input']>;
    image_eq?: InputMaybe<Scalars['String']['input']>;
    image_gt?: InputMaybe<Scalars['String']['input']>;
    image_gte?: InputMaybe<Scalars['String']['input']>;
    image_in?: InputMaybe<Array<Scalars['String']['input']>>;
    image_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    image_lt?: InputMaybe<Scalars['String']['input']>;
    image_lte?: InputMaybe<Scalars['String']['input']>;
    image_not_contains?: InputMaybe<Scalars['String']['input']>;
    image_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    image_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    image_not_eq?: InputMaybe<Scalars['String']['input']>;
    image_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    image_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    image_startsWith?: InputMaybe<Scalars['String']['input']>;
    name_contains?: InputMaybe<Scalars['String']['input']>;
    name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    name_endsWith?: InputMaybe<Scalars['String']['input']>;
    name_eq?: InputMaybe<Scalars['String']['input']>;
    name_gt?: InputMaybe<Scalars['String']['input']>;
    name_gte?: InputMaybe<Scalars['String']['input']>;
    name_in?: InputMaybe<Array<Scalars['String']['input']>>;
    name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    name_lt?: InputMaybe<Scalars['String']['input']>;
    name_lte?: InputMaybe<Scalars['String']['input']>;
    name_not_contains?: InputMaybe<Scalars['String']['input']>;
    name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    name_not_eq?: InputMaybe<Scalars['String']['input']>;
    name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    name_startsWith?: InputMaybe<Scalars['String']['input']>;
    owner?: InputMaybe<UserWhereInput>;
    owner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    symbol_contains?: InputMaybe<Scalars['String']['input']>;
    symbol_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    symbol_endsWith?: InputMaybe<Scalars['String']['input']>;
    symbol_eq?: InputMaybe<Scalars['String']['input']>;
    symbol_gt?: InputMaybe<Scalars['String']['input']>;
    symbol_gte?: InputMaybe<Scalars['String']['input']>;
    symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
    symbol_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    symbol_lt?: InputMaybe<Scalars['String']['input']>;
    symbol_lte?: InputMaybe<Scalars['String']['input']>;
    symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
    symbol_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    symbol_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    symbol_not_eq?: InputMaybe<Scalars['String']['input']>;
    symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    symbol_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    symbol_startsWith?: InputMaybe<Scalars['String']['input']>;
    tokenType_eq?: InputMaybe<Scalars['Int']['input']>;
    tokenType_gt?: InputMaybe<Scalars['Int']['input']>;
    tokenType_gte?: InputMaybe<Scalars['Int']['input']>;
    tokenType_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    tokenType_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    tokenType_lt?: InputMaybe<Scalars['Int']['input']>;
    tokenType_lte?: InputMaybe<Scalars['Int']['input']>;
    tokenType_not_eq?: InputMaybe<Scalars['Int']['input']>;
    tokenType_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    totalSupply_eq?: InputMaybe<Scalars['BigInt']['input']>;
    totalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
    totalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
    totalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    totalSupply_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    totalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
    totalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
    totalSupply_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type GemlaunchTokensConnection = {
    __typename?: 'GemlaunchTokensConnection';
    edges: Array<GemlaunchTokenEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type LaunchPad = BaseEntity & {
    __typename?: 'LaunchPad';
    affiliateReward?: Maybe<Scalars['BigInt']['output']>;
    chainId: Scalars['Int']['output'];
    contractAddress: Scalars['String']['output'];
    createdAt: Scalars['DateTime']['output'];
    decreaseInterval?: Maybe<Scalars['BigInt']['output']>;
    endPrice?: Maybe<Scalars['BigInt']['output']>;
    endTime: Scalars['BigInt']['output'];
    finalizeTime?: Maybe<Scalars['BigInt']['output']>;
    fundToken: FundToken;
    hardCap?: Maybe<Scalars['BigInt']['output']>;
    id: Scalars['String']['output'];
    investedAmount: Scalars['BigInt']['output'];
    investors: Array<Maybe<Scalars['String']['output']>>;
    isAffiliate?: Maybe<Scalars['Boolean']['output']>;
    isAutoListing?: Maybe<Scalars['Boolean']['output']>;
    isMaxLimit?: Maybe<Scalars['Boolean']['output']>;
    liquidityAdded?: Maybe<Scalars['BigInt']['output']>;
    liquidityDetails?: Maybe<LiquidityDetails>;
    liquidityPercent?: Maybe<Scalars['BigInt']['output']>;
    listingPrice?: Maybe<Scalars['BigInt']['output']>;
    listingRate?: Maybe<Scalars['BigInt']['output']>;
    listingTime: Scalars['BigInt']['output'];
    lockTime?: Maybe<Scalars['BigInt']['output']>;
    locker?: Maybe<Scalars['String']['output']>;
    maxBuyLimit?: Maybe<Scalars['BigInt']['output']>;
    metadata?: Maybe<LaunchpadTemp>;
    minBuyLimit?: Maybe<Scalars['BigInt']['output']>;
    name: Scalars['String']['output'];
    owner: User;
    publicSaleTime?: Maybe<Scalars['BigInt']['output']>;
    refundType?: Maybe<Scalars['Boolean']['output']>;
    router?: Maybe<Scalars['String']['output']>;
    sellPrice?: Maybe<Scalars['BigInt']['output']>;
    sellRate?: Maybe<Scalars['BigInt']['output']>;
    softCap: Scalars['BigInt']['output'];
    startPrice?: Maybe<Scalars['BigInt']['output']>;
    startTime: Scalars['BigInt']['output'];
    token: Token;
    totalSaleAmount?: Maybe<Scalars['BigInt']['output']>;
    totalSellTokens?: Maybe<Scalars['BigInt']['output']>;
    updatedAt?: Maybe<Scalars['DateTime']['output']>;
    userHardCap?: Maybe<Scalars['BigInt']['output']>;
    vestingDetails?: Maybe<VestingDetails>;
};

export type LaunchPadEdge = {
    __typename?: 'LaunchPadEdge';
    cursor: Scalars['String']['output'];
    node: LaunchPad;
};

export enum LaunchPadOrderByInput {
    AffiliateRewardAsc = 'affiliateReward_ASC',
    AffiliateRewardAscNullsFirst = 'affiliateReward_ASC_NULLS_FIRST',
    AffiliateRewardDesc = 'affiliateReward_DESC',
    AffiliateRewardDescNullsLast = 'affiliateReward_DESC_NULLS_LAST',
    ChainIdAsc = 'chainId_ASC',
    ChainIdAscNullsFirst = 'chainId_ASC_NULLS_FIRST',
    ChainIdDesc = 'chainId_DESC',
    ChainIdDescNullsLast = 'chainId_DESC_NULLS_LAST',
    ContractAddressAsc = 'contractAddress_ASC',
    ContractAddressAscNullsFirst = 'contractAddress_ASC_NULLS_FIRST',
    ContractAddressDesc = 'contractAddress_DESC',
    ContractAddressDescNullsLast = 'contractAddress_DESC_NULLS_LAST',
    CreatedAtAsc = 'createdAt_ASC',
    CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
    CreatedAtDesc = 'createdAt_DESC',
    CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
    DecreaseIntervalAsc = 'decreaseInterval_ASC',
    DecreaseIntervalAscNullsFirst = 'decreaseInterval_ASC_NULLS_FIRST',
    DecreaseIntervalDesc = 'decreaseInterval_DESC',
    DecreaseIntervalDescNullsLast = 'decreaseInterval_DESC_NULLS_LAST',
    EndPriceAsc = 'endPrice_ASC',
    EndPriceAscNullsFirst = 'endPrice_ASC_NULLS_FIRST',
    EndPriceDesc = 'endPrice_DESC',
    EndPriceDescNullsLast = 'endPrice_DESC_NULLS_LAST',
    EndTimeAsc = 'endTime_ASC',
    EndTimeAscNullsFirst = 'endTime_ASC_NULLS_FIRST',
    EndTimeDesc = 'endTime_DESC',
    EndTimeDescNullsLast = 'endTime_DESC_NULLS_LAST',
    FinalizeTimeAsc = 'finalizeTime_ASC',
    FinalizeTimeAscNullsFirst = 'finalizeTime_ASC_NULLS_FIRST',
    FinalizeTimeDesc = 'finalizeTime_DESC',
    FinalizeTimeDescNullsLast = 'finalizeTime_DESC_NULLS_LAST',
    FundTokenDecimalsAsc = 'fundToken_decimals_ASC',
    FundTokenDecimalsAscNullsFirst = 'fundToken_decimals_ASC_NULLS_FIRST',
    FundTokenDecimalsDesc = 'fundToken_decimals_DESC',
    FundTokenDecimalsDescNullsLast = 'fundToken_decimals_DESC_NULLS_LAST',
    FundTokenIdAsc = 'fundToken_id_ASC',
    FundTokenIdAscNullsFirst = 'fundToken_id_ASC_NULLS_FIRST',
    FundTokenIdDesc = 'fundToken_id_DESC',
    FundTokenIdDescNullsLast = 'fundToken_id_DESC_NULLS_LAST',
    FundTokenIsNativeAsc = 'fundToken_isNative_ASC',
    FundTokenIsNativeAscNullsFirst = 'fundToken_isNative_ASC_NULLS_FIRST',
    FundTokenIsNativeDesc = 'fundToken_isNative_DESC',
    FundTokenIsNativeDescNullsLast = 'fundToken_isNative_DESC_NULLS_LAST',
    FundTokenNameAsc = 'fundToken_name_ASC',
    FundTokenNameAscNullsFirst = 'fundToken_name_ASC_NULLS_FIRST',
    FundTokenNameDesc = 'fundToken_name_DESC',
    FundTokenNameDescNullsLast = 'fundToken_name_DESC_NULLS_LAST',
    FundTokenSymbolAsc = 'fundToken_symbol_ASC',
    FundTokenSymbolAscNullsFirst = 'fundToken_symbol_ASC_NULLS_FIRST',
    FundTokenSymbolDesc = 'fundToken_symbol_DESC',
    FundTokenSymbolDescNullsLast = 'fundToken_symbol_DESC_NULLS_LAST',
    HardCapAsc = 'hardCap_ASC',
    HardCapAscNullsFirst = 'hardCap_ASC_NULLS_FIRST',
    HardCapDesc = 'hardCap_DESC',
    HardCapDescNullsLast = 'hardCap_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    InvestedAmountAsc = 'investedAmount_ASC',
    InvestedAmountAscNullsFirst = 'investedAmount_ASC_NULLS_FIRST',
    InvestedAmountDesc = 'investedAmount_DESC',
    InvestedAmountDescNullsLast = 'investedAmount_DESC_NULLS_LAST',
    IsAffiliateAsc = 'isAffiliate_ASC',
    IsAffiliateAscNullsFirst = 'isAffiliate_ASC_NULLS_FIRST',
    IsAffiliateDesc = 'isAffiliate_DESC',
    IsAffiliateDescNullsLast = 'isAffiliate_DESC_NULLS_LAST',
    IsAutoListingAsc = 'isAutoListing_ASC',
    IsAutoListingAscNullsFirst = 'isAutoListing_ASC_NULLS_FIRST',
    IsAutoListingDesc = 'isAutoListing_DESC',
    IsAutoListingDescNullsLast = 'isAutoListing_DESC_NULLS_LAST',
    IsMaxLimitAsc = 'isMaxLimit_ASC',
    IsMaxLimitAscNullsFirst = 'isMaxLimit_ASC_NULLS_FIRST',
    IsMaxLimitDesc = 'isMaxLimit_DESC',
    IsMaxLimitDescNullsLast = 'isMaxLimit_DESC_NULLS_LAST',
    LiquidityAddedAsc = 'liquidityAdded_ASC',
    LiquidityAddedAscNullsFirst = 'liquidityAdded_ASC_NULLS_FIRST',
    LiquidityAddedDesc = 'liquidityAdded_DESC',
    LiquidityAddedDescNullsLast = 'liquidityAdded_DESC_NULLS_LAST',
    LiquidityDetailsIdAsc = 'liquidityDetails_id_ASC',
    LiquidityDetailsIdAscNullsFirst = 'liquidityDetails_id_ASC_NULLS_FIRST',
    LiquidityDetailsIdDesc = 'liquidityDetails_id_DESC',
    LiquidityDetailsIdDescNullsLast = 'liquidityDetails_id_DESC_NULLS_LAST',
    LiquidityDetailsLiquidityAddedAsc = 'liquidityDetails_liquidityAdded_ASC',
    LiquidityDetailsLiquidityAddedAscNullsFirst = 'liquidityDetails_liquidityAdded_ASC_NULLS_FIRST',
    LiquidityDetailsLiquidityAddedDesc = 'liquidityDetails_liquidityAdded_DESC',
    LiquidityDetailsLiquidityAddedDescNullsLast = 'liquidityDetails_liquidityAdded_DESC_NULLS_LAST',
    LiquidityDetailsLiquidityPercentAsc = 'liquidityDetails_liquidityPercent_ASC',
    LiquidityDetailsLiquidityPercentAscNullsFirst = 'liquidityDetails_liquidityPercent_ASC_NULLS_FIRST',
    LiquidityDetailsLiquidityPercentDesc = 'liquidityDetails_liquidityPercent_DESC',
    LiquidityDetailsLiquidityPercentDescNullsLast = 'liquidityDetails_liquidityPercent_DESC_NULLS_LAST',
    LiquidityDetailsLockTimeAsc = 'liquidityDetails_lockTime_ASC',
    LiquidityDetailsLockTimeAscNullsFirst = 'liquidityDetails_lockTime_ASC_NULLS_FIRST',
    LiquidityDetailsLockTimeDesc = 'liquidityDetails_lockTime_DESC',
    LiquidityDetailsLockTimeDescNullsLast = 'liquidityDetails_lockTime_DESC_NULLS_LAST',
    LiquidityDetailsLockerAsc = 'liquidityDetails_locker_ASC',
    LiquidityDetailsLockerAscNullsFirst = 'liquidityDetails_locker_ASC_NULLS_FIRST',
    LiquidityDetailsLockerDesc = 'liquidityDetails_locker_DESC',
    LiquidityDetailsLockerDescNullsLast = 'liquidityDetails_locker_DESC_NULLS_LAST',
    LiquidityDetailsRouterAsc = 'liquidityDetails_router_ASC',
    LiquidityDetailsRouterAscNullsFirst = 'liquidityDetails_router_ASC_NULLS_FIRST',
    LiquidityDetailsRouterDesc = 'liquidityDetails_router_DESC',
    LiquidityDetailsRouterDescNullsLast = 'liquidityDetails_router_DESC_NULLS_LAST',
    LiquidityPercentAsc = 'liquidityPercent_ASC',
    LiquidityPercentAscNullsFirst = 'liquidityPercent_ASC_NULLS_FIRST',
    LiquidityPercentDesc = 'liquidityPercent_DESC',
    LiquidityPercentDescNullsLast = 'liquidityPercent_DESC_NULLS_LAST',
    ListingPriceAsc = 'listingPrice_ASC',
    ListingPriceAscNullsFirst = 'listingPrice_ASC_NULLS_FIRST',
    ListingPriceDesc = 'listingPrice_DESC',
    ListingPriceDescNullsLast = 'listingPrice_DESC_NULLS_LAST',
    ListingRateAsc = 'listingRate_ASC',
    ListingRateAscNullsFirst = 'listingRate_ASC_NULLS_FIRST',
    ListingRateDesc = 'listingRate_DESC',
    ListingRateDescNullsLast = 'listingRate_DESC_NULLS_LAST',
    ListingTimeAsc = 'listingTime_ASC',
    ListingTimeAscNullsFirst = 'listingTime_ASC_NULLS_FIRST',
    ListingTimeDesc = 'listingTime_DESC',
    ListingTimeDescNullsLast = 'listingTime_DESC_NULLS_LAST',
    LockTimeAsc = 'lockTime_ASC',
    LockTimeAscNullsFirst = 'lockTime_ASC_NULLS_FIRST',
    LockTimeDesc = 'lockTime_DESC',
    LockTimeDescNullsLast = 'lockTime_DESC_NULLS_LAST',
    LockerAsc = 'locker_ASC',
    LockerAscNullsFirst = 'locker_ASC_NULLS_FIRST',
    LockerDesc = 'locker_DESC',
    LockerDescNullsLast = 'locker_DESC_NULLS_LAST',
    MaxBuyLimitAsc = 'maxBuyLimit_ASC',
    MaxBuyLimitAscNullsFirst = 'maxBuyLimit_ASC_NULLS_FIRST',
    MaxBuyLimitDesc = 'maxBuyLimit_DESC',
    MaxBuyLimitDescNullsLast = 'maxBuyLimit_DESC_NULLS_LAST',
    MetadataAuditAsc = 'metadata_audit_ASC',
    MetadataAuditAscNullsFirst = 'metadata_audit_ASC_NULLS_FIRST',
    MetadataAuditDesc = 'metadata_audit_DESC',
    MetadataAuditDescNullsLast = 'metadata_audit_DESC_NULLS_LAST',
    MetadataContractAddressAsc = 'metadata_contractAddress_ASC',
    MetadataContractAddressAscNullsFirst = 'metadata_contractAddress_ASC_NULLS_FIRST',
    MetadataContractAddressDesc = 'metadata_contractAddress_DESC',
    MetadataContractAddressDescNullsLast = 'metadata_contractAddress_DESC_NULLS_LAST',
    MetadataIdAsc = 'metadata_id_ASC',
    MetadataIdAscNullsFirst = 'metadata_id_ASC_NULLS_FIRST',
    MetadataIdDesc = 'metadata_id_DESC',
    MetadataIdDescNullsLast = 'metadata_id_DESC_NULLS_LAST',
    MetadataKycAsc = 'metadata_kyc_ASC',
    MetadataKycAscNullsFirst = 'metadata_kyc_ASC_NULLS_FIRST',
    MetadataKycDesc = 'metadata_kyc_DESC',
    MetadataKycDescNullsLast = 'metadata_kyc_DESC_NULLS_LAST',
    MinBuyLimitAsc = 'minBuyLimit_ASC',
    MinBuyLimitAscNullsFirst = 'minBuyLimit_ASC_NULLS_FIRST',
    MinBuyLimitDesc = 'minBuyLimit_DESC',
    MinBuyLimitDescNullsLast = 'minBuyLimit_DESC_NULLS_LAST',
    NameAsc = 'name_ASC',
    NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
    NameDesc = 'name_DESC',
    NameDescNullsLast = 'name_DESC_NULLS_LAST',
    OwnerChainIdAsc = 'owner_chainId_ASC',
    OwnerChainIdAscNullsFirst = 'owner_chainId_ASC_NULLS_FIRST',
    OwnerChainIdDesc = 'owner_chainId_DESC',
    OwnerChainIdDescNullsLast = 'owner_chainId_DESC_NULLS_LAST',
    OwnerCreatedAtAsc = 'owner_createdAt_ASC',
    OwnerCreatedAtAscNullsFirst = 'owner_createdAt_ASC_NULLS_FIRST',
    OwnerCreatedAtDesc = 'owner_createdAt_DESC',
    OwnerCreatedAtDescNullsLast = 'owner_createdAt_DESC_NULLS_LAST',
    OwnerIdAsc = 'owner_id_ASC',
    OwnerIdAscNullsFirst = 'owner_id_ASC_NULLS_FIRST',
    OwnerIdDesc = 'owner_id_DESC',
    OwnerIdDescNullsLast = 'owner_id_DESC_NULLS_LAST',
    OwnerUpdatedAtAsc = 'owner_updatedAt_ASC',
    OwnerUpdatedAtAscNullsFirst = 'owner_updatedAt_ASC_NULLS_FIRST',
    OwnerUpdatedAtDesc = 'owner_updatedAt_DESC',
    OwnerUpdatedAtDescNullsLast = 'owner_updatedAt_DESC_NULLS_LAST',
    PublicSaleTimeAsc = 'publicSaleTime_ASC',
    PublicSaleTimeAscNullsFirst = 'publicSaleTime_ASC_NULLS_FIRST',
    PublicSaleTimeDesc = 'publicSaleTime_DESC',
    PublicSaleTimeDescNullsLast = 'publicSaleTime_DESC_NULLS_LAST',
    RefundTypeAsc = 'refundType_ASC',
    RefundTypeAscNullsFirst = 'refundType_ASC_NULLS_FIRST',
    RefundTypeDesc = 'refundType_DESC',
    RefundTypeDescNullsLast = 'refundType_DESC_NULLS_LAST',
    RouterAsc = 'router_ASC',
    RouterAscNullsFirst = 'router_ASC_NULLS_FIRST',
    RouterDesc = 'router_DESC',
    RouterDescNullsLast = 'router_DESC_NULLS_LAST',
    SellPriceAsc = 'sellPrice_ASC',
    SellPriceAscNullsFirst = 'sellPrice_ASC_NULLS_FIRST',
    SellPriceDesc = 'sellPrice_DESC',
    SellPriceDescNullsLast = 'sellPrice_DESC_NULLS_LAST',
    SellRateAsc = 'sellRate_ASC',
    SellRateAscNullsFirst = 'sellRate_ASC_NULLS_FIRST',
    SellRateDesc = 'sellRate_DESC',
    SellRateDescNullsLast = 'sellRate_DESC_NULLS_LAST',
    SoftCapAsc = 'softCap_ASC',
    SoftCapAscNullsFirst = 'softCap_ASC_NULLS_FIRST',
    SoftCapDesc = 'softCap_DESC',
    SoftCapDescNullsLast = 'softCap_DESC_NULLS_LAST',
    StartPriceAsc = 'startPrice_ASC',
    StartPriceAscNullsFirst = 'startPrice_ASC_NULLS_FIRST',
    StartPriceDesc = 'startPrice_DESC',
    StartPriceDescNullsLast = 'startPrice_DESC_NULLS_LAST',
    StartTimeAsc = 'startTime_ASC',
    StartTimeAscNullsFirst = 'startTime_ASC_NULLS_FIRST',
    StartTimeDesc = 'startTime_DESC',
    StartTimeDescNullsLast = 'startTime_DESC_NULLS_LAST',
    TokenChainIdAsc = 'token_chainId_ASC',
    TokenChainIdAscNullsFirst = 'token_chainId_ASC_NULLS_FIRST',
    TokenChainIdDesc = 'token_chainId_DESC',
    TokenChainIdDescNullsLast = 'token_chainId_DESC_NULLS_LAST',
    TokenCreatedAtAsc = 'token_createdAt_ASC',
    TokenCreatedAtAscNullsFirst = 'token_createdAt_ASC_NULLS_FIRST',
    TokenCreatedAtDesc = 'token_createdAt_DESC',
    TokenCreatedAtDescNullsLast = 'token_createdAt_DESC_NULLS_LAST',
    TokenDecimalsAsc = 'token_decimals_ASC',
    TokenDecimalsAscNullsFirst = 'token_decimals_ASC_NULLS_FIRST',
    TokenDecimalsDesc = 'token_decimals_DESC',
    TokenDecimalsDescNullsLast = 'token_decimals_DESC_NULLS_LAST',
    TokenIdAsc = 'token_id_ASC',
    TokenIdAscNullsFirst = 'token_id_ASC_NULLS_FIRST',
    TokenIdDesc = 'token_id_DESC',
    TokenIdDescNullsLast = 'token_id_DESC_NULLS_LAST',
    TokenImageAsc = 'token_image_ASC',
    TokenImageAscNullsFirst = 'token_image_ASC_NULLS_FIRST',
    TokenImageDesc = 'token_image_DESC',
    TokenImageDescNullsLast = 'token_image_DESC_NULLS_LAST',
    TokenIsLiquidityTokenAsc = 'token_isLiquidityToken_ASC',
    TokenIsLiquidityTokenAscNullsFirst = 'token_isLiquidityToken_ASC_NULLS_FIRST',
    TokenIsLiquidityTokenDesc = 'token_isLiquidityToken_DESC',
    TokenIsLiquidityTokenDescNullsLast = 'token_isLiquidityToken_DESC_NULLS_LAST',
    TokenNameAsc = 'token_name_ASC',
    TokenNameAscNullsFirst = 'token_name_ASC_NULLS_FIRST',
    TokenNameDesc = 'token_name_DESC',
    TokenNameDescNullsLast = 'token_name_DESC_NULLS_LAST',
    TokenNextUnlockAsc = 'token_nextUnlock_ASC',
    TokenNextUnlockAscNullsFirst = 'token_nextUnlock_ASC_NULLS_FIRST',
    TokenNextUnlockDesc = 'token_nextUnlock_DESC',
    TokenNextUnlockDescNullsLast = 'token_nextUnlock_DESC_NULLS_LAST',
    TokenReserve0Asc = 'token_reserve0_ASC',
    TokenReserve0AscNullsFirst = 'token_reserve0_ASC_NULLS_FIRST',
    TokenReserve0Desc = 'token_reserve0_DESC',
    TokenReserve0DescNullsLast = 'token_reserve0_DESC_NULLS_LAST',
    TokenReserve1Asc = 'token_reserve1_ASC',
    TokenReserve1AscNullsFirst = 'token_reserve1_ASC_NULLS_FIRST',
    TokenReserve1Desc = 'token_reserve1_DESC',
    TokenReserve1DescNullsLast = 'token_reserve1_DESC_NULLS_LAST',
    TokenSymbolAsc = 'token_symbol_ASC',
    TokenSymbolAscNullsFirst = 'token_symbol_ASC_NULLS_FIRST',
    TokenSymbolDesc = 'token_symbol_DESC',
    TokenSymbolDescNullsLast = 'token_symbol_DESC_NULLS_LAST',
    TokenTokenLockedCountAsc = 'token_tokenLockedCount_ASC',
    TokenTokenLockedCountAscNullsFirst = 'token_tokenLockedCount_ASC_NULLS_FIRST',
    TokenTokenLockedCountDesc = 'token_tokenLockedCount_DESC',
    TokenTokenLockedCountDescNullsLast = 'token_tokenLockedCount_DESC_NULLS_LAST',
    TokenTokenLockedInUsdAsc = 'token_tokenLockedInUsd_ASC',
    TokenTokenLockedInUsdAscNullsFirst = 'token_tokenLockedInUsd_ASC_NULLS_FIRST',
    TokenTokenLockedInUsdDesc = 'token_tokenLockedInUsd_DESC',
    TokenTokenLockedInUsdDescNullsLast = 'token_tokenLockedInUsd_DESC_NULLS_LAST',
    TokenTokenLockedAsc = 'token_tokenLocked_ASC',
    TokenTokenLockedAscNullsFirst = 'token_tokenLocked_ASC_NULLS_FIRST',
    TokenTokenLockedDesc = 'token_tokenLocked_DESC',
    TokenTokenLockedDescNullsLast = 'token_tokenLocked_DESC_NULLS_LAST',
    TokenTotalSupplyAsc = 'token_totalSupply_ASC',
    TokenTotalSupplyAscNullsFirst = 'token_totalSupply_ASC_NULLS_FIRST',
    TokenTotalSupplyDesc = 'token_totalSupply_DESC',
    TokenTotalSupplyDescNullsLast = 'token_totalSupply_DESC_NULLS_LAST',
    TokenUpdatedAtAsc = 'token_updatedAt_ASC',
    TokenUpdatedAtAscNullsFirst = 'token_updatedAt_ASC_NULLS_FIRST',
    TokenUpdatedAtDesc = 'token_updatedAt_DESC',
    TokenUpdatedAtDescNullsLast = 'token_updatedAt_DESC_NULLS_LAST',
    TokenUsdPriceAsc = 'token_usdPrice_ASC',
    TokenUsdPriceAscNullsFirst = 'token_usdPrice_ASC_NULLS_FIRST',
    TokenUsdPriceDesc = 'token_usdPrice_DESC',
    TokenUsdPriceDescNullsLast = 'token_usdPrice_DESC_NULLS_LAST',
    TotalSaleAmountAsc = 'totalSaleAmount_ASC',
    TotalSaleAmountAscNullsFirst = 'totalSaleAmount_ASC_NULLS_FIRST',
    TotalSaleAmountDesc = 'totalSaleAmount_DESC',
    TotalSaleAmountDescNullsLast = 'totalSaleAmount_DESC_NULLS_LAST',
    TotalSellTokensAsc = 'totalSellTokens_ASC',
    TotalSellTokensAscNullsFirst = 'totalSellTokens_ASC_NULLS_FIRST',
    TotalSellTokensDesc = 'totalSellTokens_DESC',
    TotalSellTokensDescNullsLast = 'totalSellTokens_DESC_NULLS_LAST',
    UpdatedAtAsc = 'updatedAt_ASC',
    UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
    UpdatedAtDesc = 'updatedAt_DESC',
    UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
    UserHardCapAsc = 'userHardCap_ASC',
    UserHardCapAscNullsFirst = 'userHardCap_ASC_NULLS_FIRST',
    UserHardCapDesc = 'userHardCap_DESC',
    UserHardCapDescNullsLast = 'userHardCap_DESC_NULLS_LAST',
    VestingDetailsCycleIntervalAsc = 'vestingDetails_cycleInterval_ASC',
    VestingDetailsCycleIntervalAscNullsFirst = 'vestingDetails_cycleInterval_ASC_NULLS_FIRST',
    VestingDetailsCycleIntervalDesc = 'vestingDetails_cycleInterval_DESC',
    VestingDetailsCycleIntervalDescNullsLast = 'vestingDetails_cycleInterval_DESC_NULLS_LAST',
    VestingDetailsCyclePercentAsc = 'vestingDetails_cyclePercent_ASC',
    VestingDetailsCyclePercentAscNullsFirst = 'vestingDetails_cyclePercent_ASC_NULLS_FIRST',
    VestingDetailsCyclePercentDesc = 'vestingDetails_cyclePercent_DESC',
    VestingDetailsCyclePercentDescNullsLast = 'vestingDetails_cyclePercent_DESC_NULLS_LAST',
    VestingDetailsIdAsc = 'vestingDetails_id_ASC',
    VestingDetailsIdAscNullsFirst = 'vestingDetails_id_ASC_NULLS_FIRST',
    VestingDetailsIdDesc = 'vestingDetails_id_DESC',
    VestingDetailsIdDescNullsLast = 'vestingDetails_id_DESC_NULLS_LAST',
    VestingDetailsIsVestingEnableAsc = 'vestingDetails_isVestingEnable_ASC',
    VestingDetailsIsVestingEnableAscNullsFirst = 'vestingDetails_isVestingEnable_ASC_NULLS_FIRST',
    VestingDetailsIsVestingEnableDesc = 'vestingDetails_isVestingEnable_DESC',
    VestingDetailsIsVestingEnableDescNullsLast = 'vestingDetails_isVestingEnable_DESC_NULLS_LAST',
    VestingDetailsTgePercentAsc = 'vestingDetails_tgePercent_ASC',
    VestingDetailsTgePercentAscNullsFirst = 'vestingDetails_tgePercent_ASC_NULLS_FIRST',
    VestingDetailsTgePercentDesc = 'vestingDetails_tgePercent_DESC',
    VestingDetailsTgePercentDescNullsLast = 'vestingDetails_tgePercent_DESC_NULLS_LAST',
}

export type LaunchPadWhereInput = {
    AND?: InputMaybe<Array<LaunchPadWhereInput>>;
    OR?: InputMaybe<Array<LaunchPadWhereInput>>;
    affiliateReward_eq?: InputMaybe<Scalars['BigInt']['input']>;
    affiliateReward_gt?: InputMaybe<Scalars['BigInt']['input']>;
    affiliateReward_gte?: InputMaybe<Scalars['BigInt']['input']>;
    affiliateReward_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    affiliateReward_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    affiliateReward_lt?: InputMaybe<Scalars['BigInt']['input']>;
    affiliateReward_lte?: InputMaybe<Scalars['BigInt']['input']>;
    affiliateReward_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    affiliateReward_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    chainId_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_gt?: InputMaybe<Scalars['Int']['input']>;
    chainId_gte?: InputMaybe<Scalars['Int']['input']>;
    chainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    chainId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    chainId_lt?: InputMaybe<Scalars['Int']['input']>;
    chainId_lte?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    contractAddress_contains?: InputMaybe<Scalars['String']['input']>;
    contractAddress_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    contractAddress_endsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_eq?: InputMaybe<Scalars['String']['input']>;
    contractAddress_gt?: InputMaybe<Scalars['String']['input']>;
    contractAddress_gte?: InputMaybe<Scalars['String']['input']>;
    contractAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
    contractAddress_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    contractAddress_lt?: InputMaybe<Scalars['String']['input']>;
    contractAddress_lte?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_eq?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    contractAddress_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_startsWith?: InputMaybe<Scalars['String']['input']>;
    createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    decreaseInterval_eq?: InputMaybe<Scalars['BigInt']['input']>;
    decreaseInterval_gt?: InputMaybe<Scalars['BigInt']['input']>;
    decreaseInterval_gte?: InputMaybe<Scalars['BigInt']['input']>;
    decreaseInterval_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    decreaseInterval_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    decreaseInterval_lt?: InputMaybe<Scalars['BigInt']['input']>;
    decreaseInterval_lte?: InputMaybe<Scalars['BigInt']['input']>;
    decreaseInterval_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    decreaseInterval_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    endPrice_eq?: InputMaybe<Scalars['BigInt']['input']>;
    endPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
    endPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
    endPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    endPrice_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    endPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
    endPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
    endPrice_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    endPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    endTime_eq?: InputMaybe<Scalars['BigInt']['input']>;
    endTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
    endTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
    endTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    endTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    endTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
    endTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
    endTime_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    endTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    finalizeTime_eq?: InputMaybe<Scalars['BigInt']['input']>;
    finalizeTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
    finalizeTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
    finalizeTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    finalizeTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    finalizeTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
    finalizeTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
    finalizeTime_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    finalizeTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    fundToken?: InputMaybe<FundTokenWhereInput>;
    fundToken_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    hardCap_eq?: InputMaybe<Scalars['BigInt']['input']>;
    hardCap_gt?: InputMaybe<Scalars['BigInt']['input']>;
    hardCap_gte?: InputMaybe<Scalars['BigInt']['input']>;
    hardCap_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    hardCap_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    hardCap_lt?: InputMaybe<Scalars['BigInt']['input']>;
    hardCap_lte?: InputMaybe<Scalars['BigInt']['input']>;
    hardCap_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    hardCap_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    investedAmount_eq?: InputMaybe<Scalars['BigInt']['input']>;
    investedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
    investedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
    investedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    investedAmount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    investedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
    investedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
    investedAmount_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    investedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    investors_containsAll?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    investors_containsAny?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    investors_containsNone?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    investors_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    isAffiliate_eq?: InputMaybe<Scalars['Boolean']['input']>;
    isAffiliate_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    isAffiliate_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
    isAutoListing_eq?: InputMaybe<Scalars['Boolean']['input']>;
    isAutoListing_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    isAutoListing_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
    isMaxLimit_eq?: InputMaybe<Scalars['Boolean']['input']>;
    isMaxLimit_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    isMaxLimit_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
    liquidityAdded_eq?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityAdded_gt?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityAdded_gte?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityAdded_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    liquidityAdded_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    liquidityAdded_lt?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityAdded_lte?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityAdded_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityAdded_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    liquidityDetails?: InputMaybe<LiquidityDetailsWhereInput>;
    liquidityDetails_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    liquidityPercent_eq?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityPercent_gt?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityPercent_gte?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityPercent_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    liquidityPercent_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    liquidityPercent_lt?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityPercent_lte?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityPercent_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityPercent_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    listingPrice_eq?: InputMaybe<Scalars['BigInt']['input']>;
    listingPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
    listingPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
    listingPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    listingPrice_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    listingPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
    listingPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
    listingPrice_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    listingPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    listingRate_eq?: InputMaybe<Scalars['BigInt']['input']>;
    listingRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
    listingRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
    listingRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    listingRate_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    listingRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
    listingRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
    listingRate_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    listingRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    listingTime_eq?: InputMaybe<Scalars['BigInt']['input']>;
    listingTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
    listingTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
    listingTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    listingTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    listingTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
    listingTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
    listingTime_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    listingTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    lockTime_eq?: InputMaybe<Scalars['BigInt']['input']>;
    lockTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
    lockTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
    lockTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    lockTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    lockTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
    lockTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
    lockTime_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    lockTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    locker_contains?: InputMaybe<Scalars['String']['input']>;
    locker_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    locker_endsWith?: InputMaybe<Scalars['String']['input']>;
    locker_eq?: InputMaybe<Scalars['String']['input']>;
    locker_gt?: InputMaybe<Scalars['String']['input']>;
    locker_gte?: InputMaybe<Scalars['String']['input']>;
    locker_in?: InputMaybe<Array<Scalars['String']['input']>>;
    locker_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    locker_lt?: InputMaybe<Scalars['String']['input']>;
    locker_lte?: InputMaybe<Scalars['String']['input']>;
    locker_not_contains?: InputMaybe<Scalars['String']['input']>;
    locker_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    locker_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    locker_not_eq?: InputMaybe<Scalars['String']['input']>;
    locker_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    locker_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    locker_startsWith?: InputMaybe<Scalars['String']['input']>;
    maxBuyLimit_eq?: InputMaybe<Scalars['BigInt']['input']>;
    maxBuyLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
    maxBuyLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
    maxBuyLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    maxBuyLimit_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    maxBuyLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
    maxBuyLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
    maxBuyLimit_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    maxBuyLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    metadata?: InputMaybe<LaunchpadTempWhereInput>;
    metadata_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    minBuyLimit_eq?: InputMaybe<Scalars['BigInt']['input']>;
    minBuyLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
    minBuyLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
    minBuyLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    minBuyLimit_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    minBuyLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
    minBuyLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
    minBuyLimit_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    minBuyLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    name_contains?: InputMaybe<Scalars['String']['input']>;
    name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    name_endsWith?: InputMaybe<Scalars['String']['input']>;
    name_eq?: InputMaybe<Scalars['String']['input']>;
    name_gt?: InputMaybe<Scalars['String']['input']>;
    name_gte?: InputMaybe<Scalars['String']['input']>;
    name_in?: InputMaybe<Array<Scalars['String']['input']>>;
    name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    name_lt?: InputMaybe<Scalars['String']['input']>;
    name_lte?: InputMaybe<Scalars['String']['input']>;
    name_not_contains?: InputMaybe<Scalars['String']['input']>;
    name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    name_not_eq?: InputMaybe<Scalars['String']['input']>;
    name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    name_startsWith?: InputMaybe<Scalars['String']['input']>;
    owner?: InputMaybe<UserWhereInput>;
    owner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    publicSaleTime_eq?: InputMaybe<Scalars['BigInt']['input']>;
    publicSaleTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
    publicSaleTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
    publicSaleTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    publicSaleTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    publicSaleTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
    publicSaleTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
    publicSaleTime_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    publicSaleTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    refundType_eq?: InputMaybe<Scalars['Boolean']['input']>;
    refundType_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    refundType_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
    router_contains?: InputMaybe<Scalars['String']['input']>;
    router_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    router_endsWith?: InputMaybe<Scalars['String']['input']>;
    router_eq?: InputMaybe<Scalars['String']['input']>;
    router_gt?: InputMaybe<Scalars['String']['input']>;
    router_gte?: InputMaybe<Scalars['String']['input']>;
    router_in?: InputMaybe<Array<Scalars['String']['input']>>;
    router_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    router_lt?: InputMaybe<Scalars['String']['input']>;
    router_lte?: InputMaybe<Scalars['String']['input']>;
    router_not_contains?: InputMaybe<Scalars['String']['input']>;
    router_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    router_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    router_not_eq?: InputMaybe<Scalars['String']['input']>;
    router_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    router_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    router_startsWith?: InputMaybe<Scalars['String']['input']>;
    sellPrice_eq?: InputMaybe<Scalars['BigInt']['input']>;
    sellPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
    sellPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
    sellPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    sellPrice_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    sellPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
    sellPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
    sellPrice_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    sellPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    sellRate_eq?: InputMaybe<Scalars['BigInt']['input']>;
    sellRate_gt?: InputMaybe<Scalars['BigInt']['input']>;
    sellRate_gte?: InputMaybe<Scalars['BigInt']['input']>;
    sellRate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    sellRate_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    sellRate_lt?: InputMaybe<Scalars['BigInt']['input']>;
    sellRate_lte?: InputMaybe<Scalars['BigInt']['input']>;
    sellRate_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    sellRate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    softCap_eq?: InputMaybe<Scalars['BigInt']['input']>;
    softCap_gt?: InputMaybe<Scalars['BigInt']['input']>;
    softCap_gte?: InputMaybe<Scalars['BigInt']['input']>;
    softCap_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    softCap_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    softCap_lt?: InputMaybe<Scalars['BigInt']['input']>;
    softCap_lte?: InputMaybe<Scalars['BigInt']['input']>;
    softCap_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    softCap_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    startPrice_eq?: InputMaybe<Scalars['BigInt']['input']>;
    startPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
    startPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
    startPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    startPrice_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    startPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
    startPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
    startPrice_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    startPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    startTime_eq?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    startTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    startTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    token?: InputMaybe<TokenWhereInput>;
    token_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    totalSaleAmount_eq?: InputMaybe<Scalars['BigInt']['input']>;
    totalSaleAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
    totalSaleAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
    totalSaleAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    totalSaleAmount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    totalSaleAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
    totalSaleAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
    totalSaleAmount_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    totalSaleAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    totalSellTokens_eq?: InputMaybe<Scalars['BigInt']['input']>;
    totalSellTokens_gt?: InputMaybe<Scalars['BigInt']['input']>;
    totalSellTokens_gte?: InputMaybe<Scalars['BigInt']['input']>;
    totalSellTokens_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    totalSellTokens_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    totalSellTokens_lt?: InputMaybe<Scalars['BigInt']['input']>;
    totalSellTokens_lte?: InputMaybe<Scalars['BigInt']['input']>;
    totalSellTokens_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    totalSellTokens_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    userHardCap_eq?: InputMaybe<Scalars['BigInt']['input']>;
    userHardCap_gt?: InputMaybe<Scalars['BigInt']['input']>;
    userHardCap_gte?: InputMaybe<Scalars['BigInt']['input']>;
    userHardCap_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    userHardCap_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    userHardCap_lt?: InputMaybe<Scalars['BigInt']['input']>;
    userHardCap_lte?: InputMaybe<Scalars['BigInt']['input']>;
    userHardCap_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    userHardCap_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    vestingDetails?: InputMaybe<VestingDetailsWhereInput>;
    vestingDetails_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LaunchPadsConnection = {
    __typename?: 'LaunchPadsConnection';
    edges: Array<LaunchPadEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type LaunchpadTemp = BaseTempData & {
    __typename?: 'LaunchpadTemp';
    audit?: Maybe<Scalars['String']['output']>;
    contractAddress?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    kyc?: Maybe<Scalars['String']['output']>;
    socials: Socials;
};

export type LaunchpadTempEdge = {
    __typename?: 'LaunchpadTempEdge';
    cursor: Scalars['String']['output'];
    node: LaunchpadTemp;
};

export enum LaunchpadTempOrderByInput {
    AuditAsc = 'audit_ASC',
    AuditAscNullsFirst = 'audit_ASC_NULLS_FIRST',
    AuditDesc = 'audit_DESC',
    AuditDescNullsLast = 'audit_DESC_NULLS_LAST',
    ContractAddressAsc = 'contractAddress_ASC',
    ContractAddressAscNullsFirst = 'contractAddress_ASC_NULLS_FIRST',
    ContractAddressDesc = 'contractAddress_DESC',
    ContractAddressDescNullsLast = 'contractAddress_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    KycAsc = 'kyc_ASC',
    KycAscNullsFirst = 'kyc_ASC_NULLS_FIRST',
    KycDesc = 'kyc_DESC',
    KycDescNullsLast = 'kyc_DESC_NULLS_LAST',
    SocialsDescriptionAsc = 'socials_description_ASC',
    SocialsDescriptionAscNullsFirst = 'socials_description_ASC_NULLS_FIRST',
    SocialsDescriptionDesc = 'socials_description_DESC',
    SocialsDescriptionDescNullsLast = 'socials_description_DESC_NULLS_LAST',
    SocialsFacebookUrlAsc = 'socials_facebookUrl_ASC',
    SocialsFacebookUrlAscNullsFirst = 'socials_facebookUrl_ASC_NULLS_FIRST',
    SocialsFacebookUrlDesc = 'socials_facebookUrl_DESC',
    SocialsFacebookUrlDescNullsLast = 'socials_facebookUrl_DESC_NULLS_LAST',
    SocialsGithubUrlAsc = 'socials_githubUrl_ASC',
    SocialsGithubUrlAscNullsFirst = 'socials_githubUrl_ASC_NULLS_FIRST',
    SocialsGithubUrlDesc = 'socials_githubUrl_DESC',
    SocialsGithubUrlDescNullsLast = 'socials_githubUrl_DESC_NULLS_LAST',
    SocialsLogoUrlAsc = 'socials_logoUrl_ASC',
    SocialsLogoUrlAscNullsFirst = 'socials_logoUrl_ASC_NULLS_FIRST',
    SocialsLogoUrlDesc = 'socials_logoUrl_DESC',
    SocialsLogoUrlDescNullsLast = 'socials_logoUrl_DESC_NULLS_LAST',
    SocialsRedditUrlAsc = 'socials_redditUrl_ASC',
    SocialsRedditUrlAscNullsFirst = 'socials_redditUrl_ASC_NULLS_FIRST',
    SocialsRedditUrlDesc = 'socials_redditUrl_DESC',
    SocialsRedditUrlDescNullsLast = 'socials_redditUrl_DESC_NULLS_LAST',
    SocialsTelegramUrlAsc = 'socials_telegramUrl_ASC',
    SocialsTelegramUrlAscNullsFirst = 'socials_telegramUrl_ASC_NULLS_FIRST',
    SocialsTelegramUrlDesc = 'socials_telegramUrl_DESC',
    SocialsTelegramUrlDescNullsLast = 'socials_telegramUrl_DESC_NULLS_LAST',
    SocialsTwitterUrlAsc = 'socials_twitterUrl_ASC',
    SocialsTwitterUrlAscNullsFirst = 'socials_twitterUrl_ASC_NULLS_FIRST',
    SocialsTwitterUrlDesc = 'socials_twitterUrl_DESC',
    SocialsTwitterUrlDescNullsLast = 'socials_twitterUrl_DESC_NULLS_LAST',
    SocialsWebUrlAsc = 'socials_webUrl_ASC',
    SocialsWebUrlAscNullsFirst = 'socials_webUrl_ASC_NULLS_FIRST',
    SocialsWebUrlDesc = 'socials_webUrl_DESC',
    SocialsWebUrlDescNullsLast = 'socials_webUrl_DESC_NULLS_LAST',
    SocialsYoutubeUrlAsc = 'socials_youtubeUrl_ASC',
    SocialsYoutubeUrlAscNullsFirst = 'socials_youtubeUrl_ASC_NULLS_FIRST',
    SocialsYoutubeUrlDesc = 'socials_youtubeUrl_DESC',
    SocialsYoutubeUrlDescNullsLast = 'socials_youtubeUrl_DESC_NULLS_LAST',
}

export type LaunchpadTempWhereInput = {
    AND?: InputMaybe<Array<LaunchpadTempWhereInput>>;
    OR?: InputMaybe<Array<LaunchpadTempWhereInput>>;
    audit_contains?: InputMaybe<Scalars['String']['input']>;
    audit_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    audit_endsWith?: InputMaybe<Scalars['String']['input']>;
    audit_eq?: InputMaybe<Scalars['String']['input']>;
    audit_gt?: InputMaybe<Scalars['String']['input']>;
    audit_gte?: InputMaybe<Scalars['String']['input']>;
    audit_in?: InputMaybe<Array<Scalars['String']['input']>>;
    audit_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    audit_lt?: InputMaybe<Scalars['String']['input']>;
    audit_lte?: InputMaybe<Scalars['String']['input']>;
    audit_not_contains?: InputMaybe<Scalars['String']['input']>;
    audit_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    audit_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    audit_not_eq?: InputMaybe<Scalars['String']['input']>;
    audit_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    audit_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    audit_startsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_contains?: InputMaybe<Scalars['String']['input']>;
    contractAddress_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    contractAddress_endsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_eq?: InputMaybe<Scalars['String']['input']>;
    contractAddress_gt?: InputMaybe<Scalars['String']['input']>;
    contractAddress_gte?: InputMaybe<Scalars['String']['input']>;
    contractAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
    contractAddress_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    contractAddress_lt?: InputMaybe<Scalars['String']['input']>;
    contractAddress_lte?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_eq?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    contractAddress_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    kyc_contains?: InputMaybe<Scalars['String']['input']>;
    kyc_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    kyc_endsWith?: InputMaybe<Scalars['String']['input']>;
    kyc_eq?: InputMaybe<Scalars['String']['input']>;
    kyc_gt?: InputMaybe<Scalars['String']['input']>;
    kyc_gte?: InputMaybe<Scalars['String']['input']>;
    kyc_in?: InputMaybe<Array<Scalars['String']['input']>>;
    kyc_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    kyc_lt?: InputMaybe<Scalars['String']['input']>;
    kyc_lte?: InputMaybe<Scalars['String']['input']>;
    kyc_not_contains?: InputMaybe<Scalars['String']['input']>;
    kyc_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    kyc_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    kyc_not_eq?: InputMaybe<Scalars['String']['input']>;
    kyc_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    kyc_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    kyc_startsWith?: InputMaybe<Scalars['String']['input']>;
    socials?: InputMaybe<SocialsWhereInput>;
    socials_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LaunchpadTempsConnection = {
    __typename?: 'LaunchpadTempsConnection';
    edges: Array<LaunchpadTempEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type LiquidityDetails = {
    __typename?: 'LiquidityDetails';
    id: Scalars['String']['output'];
    liquidityAdded: Scalars['BigInt']['output'];
    liquidityPercent: Scalars['BigInt']['output'];
    lockTime: Scalars['BigInt']['output'];
    locker: Scalars['String']['output'];
    router: Scalars['String']['output'];
};

export type LiquidityDetailsConnection = {
    __typename?: 'LiquidityDetailsConnection';
    edges: Array<LiquidityDetailsEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type LiquidityDetailsEdge = {
    __typename?: 'LiquidityDetailsEdge';
    cursor: Scalars['String']['output'];
    node: LiquidityDetails;
};

export enum LiquidityDetailsOrderByInput {
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    LiquidityAddedAsc = 'liquidityAdded_ASC',
    LiquidityAddedAscNullsFirst = 'liquidityAdded_ASC_NULLS_FIRST',
    LiquidityAddedDesc = 'liquidityAdded_DESC',
    LiquidityAddedDescNullsLast = 'liquidityAdded_DESC_NULLS_LAST',
    LiquidityPercentAsc = 'liquidityPercent_ASC',
    LiquidityPercentAscNullsFirst = 'liquidityPercent_ASC_NULLS_FIRST',
    LiquidityPercentDesc = 'liquidityPercent_DESC',
    LiquidityPercentDescNullsLast = 'liquidityPercent_DESC_NULLS_LAST',
    LockTimeAsc = 'lockTime_ASC',
    LockTimeAscNullsFirst = 'lockTime_ASC_NULLS_FIRST',
    LockTimeDesc = 'lockTime_DESC',
    LockTimeDescNullsLast = 'lockTime_DESC_NULLS_LAST',
    LockerAsc = 'locker_ASC',
    LockerAscNullsFirst = 'locker_ASC_NULLS_FIRST',
    LockerDesc = 'locker_DESC',
    LockerDescNullsLast = 'locker_DESC_NULLS_LAST',
    RouterAsc = 'router_ASC',
    RouterAscNullsFirst = 'router_ASC_NULLS_FIRST',
    RouterDesc = 'router_DESC',
    RouterDescNullsLast = 'router_DESC_NULLS_LAST',
}

export type LiquidityDetailsWhereInput = {
    AND?: InputMaybe<Array<LiquidityDetailsWhereInput>>;
    OR?: InputMaybe<Array<LiquidityDetailsWhereInput>>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    liquidityAdded_eq?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityAdded_gt?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityAdded_gte?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityAdded_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    liquidityAdded_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    liquidityAdded_lt?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityAdded_lte?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityAdded_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityAdded_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    liquidityPercent_eq?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityPercent_gt?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityPercent_gte?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityPercent_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    liquidityPercent_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    liquidityPercent_lt?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityPercent_lte?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityPercent_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    liquidityPercent_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    lockTime_eq?: InputMaybe<Scalars['BigInt']['input']>;
    lockTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
    lockTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
    lockTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    lockTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    lockTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
    lockTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
    lockTime_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    lockTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    locker_contains?: InputMaybe<Scalars['String']['input']>;
    locker_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    locker_endsWith?: InputMaybe<Scalars['String']['input']>;
    locker_eq?: InputMaybe<Scalars['String']['input']>;
    locker_gt?: InputMaybe<Scalars['String']['input']>;
    locker_gte?: InputMaybe<Scalars['String']['input']>;
    locker_in?: InputMaybe<Array<Scalars['String']['input']>>;
    locker_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    locker_lt?: InputMaybe<Scalars['String']['input']>;
    locker_lte?: InputMaybe<Scalars['String']['input']>;
    locker_not_contains?: InputMaybe<Scalars['String']['input']>;
    locker_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    locker_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    locker_not_eq?: InputMaybe<Scalars['String']['input']>;
    locker_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    locker_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    locker_startsWith?: InputMaybe<Scalars['String']['input']>;
    router_contains?: InputMaybe<Scalars['String']['input']>;
    router_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    router_endsWith?: InputMaybe<Scalars['String']['input']>;
    router_eq?: InputMaybe<Scalars['String']['input']>;
    router_gt?: InputMaybe<Scalars['String']['input']>;
    router_gte?: InputMaybe<Scalars['String']['input']>;
    router_in?: InputMaybe<Array<Scalars['String']['input']>>;
    router_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    router_lt?: InputMaybe<Scalars['String']['input']>;
    router_lte?: InputMaybe<Scalars['String']['input']>;
    router_not_contains?: InputMaybe<Scalars['String']['input']>;
    router_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    router_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    router_not_eq?: InputMaybe<Scalars['String']['input']>;
    router_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    router_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    router_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Lock = BaseEntity & {
    __typename?: 'Lock';
    amount: Scalars['BigInt']['output'];
    chainId: Scalars['Int']['output'];
    createdAt: Scalars['DateTime']['output'];
    cycleShare?: Maybe<Scalars['BigInt']['output']>;
    depositDate: Scalars['DateTime']['output'];
    id: Scalars['String']['output'];
    interval?: Maybe<Scalars['BigInt']['output']>;
    owner: User;
    status: LockStatus;
    tge?: Maybe<Scalars['BigInt']['output']>;
    title?: Maybe<Scalars['String']['output']>;
    token: Token;
    transactions: Array<Transaction>;
    unlockDate: Scalars['DateTime']['output'];
    unlockedAmount: Scalars['BigInt']['output'];
    updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type LockTransactionsArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<TransactionOrderByInput>>;
    where?: InputMaybe<TransactionWhereInput>;
};

export type LockEdge = {
    __typename?: 'LockEdge';
    cursor: Scalars['String']['output'];
    node: Lock;
};

export enum LockOrderByInput {
    AmountAsc = 'amount_ASC',
    AmountAscNullsFirst = 'amount_ASC_NULLS_FIRST',
    AmountDesc = 'amount_DESC',
    AmountDescNullsLast = 'amount_DESC_NULLS_LAST',
    ChainIdAsc = 'chainId_ASC',
    ChainIdAscNullsFirst = 'chainId_ASC_NULLS_FIRST',
    ChainIdDesc = 'chainId_DESC',
    ChainIdDescNullsLast = 'chainId_DESC_NULLS_LAST',
    CreatedAtAsc = 'createdAt_ASC',
    CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
    CreatedAtDesc = 'createdAt_DESC',
    CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
    CycleShareAsc = 'cycleShare_ASC',
    CycleShareAscNullsFirst = 'cycleShare_ASC_NULLS_FIRST',
    CycleShareDesc = 'cycleShare_DESC',
    CycleShareDescNullsLast = 'cycleShare_DESC_NULLS_LAST',
    DepositDateAsc = 'depositDate_ASC',
    DepositDateAscNullsFirst = 'depositDate_ASC_NULLS_FIRST',
    DepositDateDesc = 'depositDate_DESC',
    DepositDateDescNullsLast = 'depositDate_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    IntervalAsc = 'interval_ASC',
    IntervalAscNullsFirst = 'interval_ASC_NULLS_FIRST',
    IntervalDesc = 'interval_DESC',
    IntervalDescNullsLast = 'interval_DESC_NULLS_LAST',
    OwnerChainIdAsc = 'owner_chainId_ASC',
    OwnerChainIdAscNullsFirst = 'owner_chainId_ASC_NULLS_FIRST',
    OwnerChainIdDesc = 'owner_chainId_DESC',
    OwnerChainIdDescNullsLast = 'owner_chainId_DESC_NULLS_LAST',
    OwnerCreatedAtAsc = 'owner_createdAt_ASC',
    OwnerCreatedAtAscNullsFirst = 'owner_createdAt_ASC_NULLS_FIRST',
    OwnerCreatedAtDesc = 'owner_createdAt_DESC',
    OwnerCreatedAtDescNullsLast = 'owner_createdAt_DESC_NULLS_LAST',
    OwnerIdAsc = 'owner_id_ASC',
    OwnerIdAscNullsFirst = 'owner_id_ASC_NULLS_FIRST',
    OwnerIdDesc = 'owner_id_DESC',
    OwnerIdDescNullsLast = 'owner_id_DESC_NULLS_LAST',
    OwnerUpdatedAtAsc = 'owner_updatedAt_ASC',
    OwnerUpdatedAtAscNullsFirst = 'owner_updatedAt_ASC_NULLS_FIRST',
    OwnerUpdatedAtDesc = 'owner_updatedAt_DESC',
    OwnerUpdatedAtDescNullsLast = 'owner_updatedAt_DESC_NULLS_LAST',
    StatusAsc = 'status_ASC',
    StatusAscNullsFirst = 'status_ASC_NULLS_FIRST',
    StatusDesc = 'status_DESC',
    StatusDescNullsLast = 'status_DESC_NULLS_LAST',
    TgeAsc = 'tge_ASC',
    TgeAscNullsFirst = 'tge_ASC_NULLS_FIRST',
    TgeDesc = 'tge_DESC',
    TgeDescNullsLast = 'tge_DESC_NULLS_LAST',
    TitleAsc = 'title_ASC',
    TitleAscNullsFirst = 'title_ASC_NULLS_FIRST',
    TitleDesc = 'title_DESC',
    TitleDescNullsLast = 'title_DESC_NULLS_LAST',
    TokenChainIdAsc = 'token_chainId_ASC',
    TokenChainIdAscNullsFirst = 'token_chainId_ASC_NULLS_FIRST',
    TokenChainIdDesc = 'token_chainId_DESC',
    TokenChainIdDescNullsLast = 'token_chainId_DESC_NULLS_LAST',
    TokenCreatedAtAsc = 'token_createdAt_ASC',
    TokenCreatedAtAscNullsFirst = 'token_createdAt_ASC_NULLS_FIRST',
    TokenCreatedAtDesc = 'token_createdAt_DESC',
    TokenCreatedAtDescNullsLast = 'token_createdAt_DESC_NULLS_LAST',
    TokenDecimalsAsc = 'token_decimals_ASC',
    TokenDecimalsAscNullsFirst = 'token_decimals_ASC_NULLS_FIRST',
    TokenDecimalsDesc = 'token_decimals_DESC',
    TokenDecimalsDescNullsLast = 'token_decimals_DESC_NULLS_LAST',
    TokenIdAsc = 'token_id_ASC',
    TokenIdAscNullsFirst = 'token_id_ASC_NULLS_FIRST',
    TokenIdDesc = 'token_id_DESC',
    TokenIdDescNullsLast = 'token_id_DESC_NULLS_LAST',
    TokenImageAsc = 'token_image_ASC',
    TokenImageAscNullsFirst = 'token_image_ASC_NULLS_FIRST',
    TokenImageDesc = 'token_image_DESC',
    TokenImageDescNullsLast = 'token_image_DESC_NULLS_LAST',
    TokenIsLiquidityTokenAsc = 'token_isLiquidityToken_ASC',
    TokenIsLiquidityTokenAscNullsFirst = 'token_isLiquidityToken_ASC_NULLS_FIRST',
    TokenIsLiquidityTokenDesc = 'token_isLiquidityToken_DESC',
    TokenIsLiquidityTokenDescNullsLast = 'token_isLiquidityToken_DESC_NULLS_LAST',
    TokenNameAsc = 'token_name_ASC',
    TokenNameAscNullsFirst = 'token_name_ASC_NULLS_FIRST',
    TokenNameDesc = 'token_name_DESC',
    TokenNameDescNullsLast = 'token_name_DESC_NULLS_LAST',
    TokenNextUnlockAsc = 'token_nextUnlock_ASC',
    TokenNextUnlockAscNullsFirst = 'token_nextUnlock_ASC_NULLS_FIRST',
    TokenNextUnlockDesc = 'token_nextUnlock_DESC',
    TokenNextUnlockDescNullsLast = 'token_nextUnlock_DESC_NULLS_LAST',
    TokenReserve0Asc = 'token_reserve0_ASC',
    TokenReserve0AscNullsFirst = 'token_reserve0_ASC_NULLS_FIRST',
    TokenReserve0Desc = 'token_reserve0_DESC',
    TokenReserve0DescNullsLast = 'token_reserve0_DESC_NULLS_LAST',
    TokenReserve1Asc = 'token_reserve1_ASC',
    TokenReserve1AscNullsFirst = 'token_reserve1_ASC_NULLS_FIRST',
    TokenReserve1Desc = 'token_reserve1_DESC',
    TokenReserve1DescNullsLast = 'token_reserve1_DESC_NULLS_LAST',
    TokenSymbolAsc = 'token_symbol_ASC',
    TokenSymbolAscNullsFirst = 'token_symbol_ASC_NULLS_FIRST',
    TokenSymbolDesc = 'token_symbol_DESC',
    TokenSymbolDescNullsLast = 'token_symbol_DESC_NULLS_LAST',
    TokenTokenLockedCountAsc = 'token_tokenLockedCount_ASC',
    TokenTokenLockedCountAscNullsFirst = 'token_tokenLockedCount_ASC_NULLS_FIRST',
    TokenTokenLockedCountDesc = 'token_tokenLockedCount_DESC',
    TokenTokenLockedCountDescNullsLast = 'token_tokenLockedCount_DESC_NULLS_LAST',
    TokenTokenLockedInUsdAsc = 'token_tokenLockedInUsd_ASC',
    TokenTokenLockedInUsdAscNullsFirst = 'token_tokenLockedInUsd_ASC_NULLS_FIRST',
    TokenTokenLockedInUsdDesc = 'token_tokenLockedInUsd_DESC',
    TokenTokenLockedInUsdDescNullsLast = 'token_tokenLockedInUsd_DESC_NULLS_LAST',
    TokenTokenLockedAsc = 'token_tokenLocked_ASC',
    TokenTokenLockedAscNullsFirst = 'token_tokenLocked_ASC_NULLS_FIRST',
    TokenTokenLockedDesc = 'token_tokenLocked_DESC',
    TokenTokenLockedDescNullsLast = 'token_tokenLocked_DESC_NULLS_LAST',
    TokenTotalSupplyAsc = 'token_totalSupply_ASC',
    TokenTotalSupplyAscNullsFirst = 'token_totalSupply_ASC_NULLS_FIRST',
    TokenTotalSupplyDesc = 'token_totalSupply_DESC',
    TokenTotalSupplyDescNullsLast = 'token_totalSupply_DESC_NULLS_LAST',
    TokenUpdatedAtAsc = 'token_updatedAt_ASC',
    TokenUpdatedAtAscNullsFirst = 'token_updatedAt_ASC_NULLS_FIRST',
    TokenUpdatedAtDesc = 'token_updatedAt_DESC',
    TokenUpdatedAtDescNullsLast = 'token_updatedAt_DESC_NULLS_LAST',
    TokenUsdPriceAsc = 'token_usdPrice_ASC',
    TokenUsdPriceAscNullsFirst = 'token_usdPrice_ASC_NULLS_FIRST',
    TokenUsdPriceDesc = 'token_usdPrice_DESC',
    TokenUsdPriceDescNullsLast = 'token_usdPrice_DESC_NULLS_LAST',
    UnlockDateAsc = 'unlockDate_ASC',
    UnlockDateAscNullsFirst = 'unlockDate_ASC_NULLS_FIRST',
    UnlockDateDesc = 'unlockDate_DESC',
    UnlockDateDescNullsLast = 'unlockDate_DESC_NULLS_LAST',
    UnlockedAmountAsc = 'unlockedAmount_ASC',
    UnlockedAmountAscNullsFirst = 'unlockedAmount_ASC_NULLS_FIRST',
    UnlockedAmountDesc = 'unlockedAmount_DESC',
    UnlockedAmountDescNullsLast = 'unlockedAmount_DESC_NULLS_LAST',
    UpdatedAtAsc = 'updatedAt_ASC',
    UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
    UpdatedAtDesc = 'updatedAt_DESC',
    UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
}

export enum LockStatus {
    Locked = 'Locked',
    Withdrawn = 'Withdrawn',
}

export type LockTemp = {
    __typename?: 'LockTemp';
    id: Scalars['String']['output'];
    title: Scalars['String']['output'];
};

export type LockTempEdge = {
    __typename?: 'LockTempEdge';
    cursor: Scalars['String']['output'];
    node: LockTemp;
};

export enum LockTempOrderByInput {
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    TitleAsc = 'title_ASC',
    TitleAscNullsFirst = 'title_ASC_NULLS_FIRST',
    TitleDesc = 'title_DESC',
    TitleDescNullsLast = 'title_DESC_NULLS_LAST',
}

export type LockTempWhereInput = {
    AND?: InputMaybe<Array<LockTempWhereInput>>;
    OR?: InputMaybe<Array<LockTempWhereInput>>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    title_contains?: InputMaybe<Scalars['String']['input']>;
    title_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    title_endsWith?: InputMaybe<Scalars['String']['input']>;
    title_eq?: InputMaybe<Scalars['String']['input']>;
    title_gt?: InputMaybe<Scalars['String']['input']>;
    title_gte?: InputMaybe<Scalars['String']['input']>;
    title_in?: InputMaybe<Array<Scalars['String']['input']>>;
    title_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    title_lt?: InputMaybe<Scalars['String']['input']>;
    title_lte?: InputMaybe<Scalars['String']['input']>;
    title_not_contains?: InputMaybe<Scalars['String']['input']>;
    title_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    title_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    title_not_eq?: InputMaybe<Scalars['String']['input']>;
    title_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    title_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    title_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type LockTempsConnection = {
    __typename?: 'LockTempsConnection';
    edges: Array<LockTempEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type LockWhereInput = {
    AND?: InputMaybe<Array<LockWhereInput>>;
    OR?: InputMaybe<Array<LockWhereInput>>;
    amount_eq?: InputMaybe<Scalars['BigInt']['input']>;
    amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
    amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
    amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    amount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
    amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
    amount_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    chainId_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_gt?: InputMaybe<Scalars['Int']['input']>;
    chainId_gte?: InputMaybe<Scalars['Int']['input']>;
    chainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    chainId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    chainId_lt?: InputMaybe<Scalars['Int']['input']>;
    chainId_lte?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    cycleShare_eq?: InputMaybe<Scalars['BigInt']['input']>;
    cycleShare_gt?: InputMaybe<Scalars['BigInt']['input']>;
    cycleShare_gte?: InputMaybe<Scalars['BigInt']['input']>;
    cycleShare_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    cycleShare_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    cycleShare_lt?: InputMaybe<Scalars['BigInt']['input']>;
    cycleShare_lte?: InputMaybe<Scalars['BigInt']['input']>;
    cycleShare_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    cycleShare_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    depositDate_eq?: InputMaybe<Scalars['DateTime']['input']>;
    depositDate_gt?: InputMaybe<Scalars['DateTime']['input']>;
    depositDate_gte?: InputMaybe<Scalars['DateTime']['input']>;
    depositDate_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    depositDate_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    depositDate_lt?: InputMaybe<Scalars['DateTime']['input']>;
    depositDate_lte?: InputMaybe<Scalars['DateTime']['input']>;
    depositDate_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    depositDate_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    interval_eq?: InputMaybe<Scalars['BigInt']['input']>;
    interval_gt?: InputMaybe<Scalars['BigInt']['input']>;
    interval_gte?: InputMaybe<Scalars['BigInt']['input']>;
    interval_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    interval_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    interval_lt?: InputMaybe<Scalars['BigInt']['input']>;
    interval_lte?: InputMaybe<Scalars['BigInt']['input']>;
    interval_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    interval_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    owner?: InputMaybe<UserWhereInput>;
    owner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    status_eq?: InputMaybe<LockStatus>;
    status_in?: InputMaybe<Array<LockStatus>>;
    status_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    status_not_eq?: InputMaybe<LockStatus>;
    status_not_in?: InputMaybe<Array<LockStatus>>;
    tge_eq?: InputMaybe<Scalars['BigInt']['input']>;
    tge_gt?: InputMaybe<Scalars['BigInt']['input']>;
    tge_gte?: InputMaybe<Scalars['BigInt']['input']>;
    tge_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    tge_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    tge_lt?: InputMaybe<Scalars['BigInt']['input']>;
    tge_lte?: InputMaybe<Scalars['BigInt']['input']>;
    tge_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    tge_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    title_contains?: InputMaybe<Scalars['String']['input']>;
    title_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    title_endsWith?: InputMaybe<Scalars['String']['input']>;
    title_eq?: InputMaybe<Scalars['String']['input']>;
    title_gt?: InputMaybe<Scalars['String']['input']>;
    title_gte?: InputMaybe<Scalars['String']['input']>;
    title_in?: InputMaybe<Array<Scalars['String']['input']>>;
    title_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    title_lt?: InputMaybe<Scalars['String']['input']>;
    title_lte?: InputMaybe<Scalars['String']['input']>;
    title_not_contains?: InputMaybe<Scalars['String']['input']>;
    title_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    title_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    title_not_eq?: InputMaybe<Scalars['String']['input']>;
    title_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    title_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    title_startsWith?: InputMaybe<Scalars['String']['input']>;
    token?: InputMaybe<TokenWhereInput>;
    token_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    transactions_every?: InputMaybe<TransactionWhereInput>;
    transactions_none?: InputMaybe<TransactionWhereInput>;
    transactions_some?: InputMaybe<TransactionWhereInput>;
    unlockDate_eq?: InputMaybe<Scalars['DateTime']['input']>;
    unlockDate_gt?: InputMaybe<Scalars['DateTime']['input']>;
    unlockDate_gte?: InputMaybe<Scalars['DateTime']['input']>;
    unlockDate_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    unlockDate_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    unlockDate_lt?: InputMaybe<Scalars['DateTime']['input']>;
    unlockDate_lte?: InputMaybe<Scalars['DateTime']['input']>;
    unlockDate_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    unlockDate_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    unlockedAmount_eq?: InputMaybe<Scalars['BigInt']['input']>;
    unlockedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
    unlockedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
    unlockedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    unlockedAmount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    unlockedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
    unlockedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
    unlockedAmount_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    unlockedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type LocksConnection = {
    __typename?: 'LocksConnection';
    edges: Array<LockEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type Mutation = {
    __typename?: 'Mutation';
    addKycAuditToLaunchpad: Scalars['Boolean']['output'];
    addMetadataToAirdrop: Scalars['Boolean']['output'];
    addMetadataToLaunchpad: Scalars['Boolean']['output'];
    addMetadataToPrivateSale: Scalars['Boolean']['output'];
    addTitleToLock: Scalars['Boolean']['output'];
    checkStatus: Scalars['Boolean']['output'];
    editAirdropMetadata: Scalars['Boolean']['output'];
};

export type MutationAddKycAuditToLaunchpadArgs = {
    audit?: InputMaybe<Scalars['String']['input']>;
    contractAddress: Scalars['String']['input'];
    kyc?: InputMaybe<Scalars['String']['input']>;
};

export type MutationAddMetadataToAirdropArgs = {
    description?: InputMaybe<Scalars['String']['input']>;
    facebookUrl?: InputMaybe<Scalars['String']['input']>;
    githubUrl?: InputMaybe<Scalars['String']['input']>;
    logoUrl: Scalars['String']['input'];
    redditUrl?: InputMaybe<Scalars['String']['input']>;
    telegramUrl?: InputMaybe<Scalars['String']['input']>;
    twitterUrl?: InputMaybe<Scalars['String']['input']>;
    txHash: Scalars['String']['input'];
    webUrl: Scalars['String']['input'];
    youtubeUrl?: InputMaybe<Scalars['String']['input']>;
};

export type MutationAddMetadataToLaunchpadArgs = {
    description?: InputMaybe<Scalars['String']['input']>;
    facebookUrl?: InputMaybe<Scalars['String']['input']>;
    githubUrl?: InputMaybe<Scalars['String']['input']>;
    logoUrl: Scalars['String']['input'];
    redditUrl?: InputMaybe<Scalars['String']['input']>;
    telegramUrl?: InputMaybe<Scalars['String']['input']>;
    twitterUrl?: InputMaybe<Scalars['String']['input']>;
    txHash: Scalars['String']['input'];
    webUrl: Scalars['String']['input'];
    youtubeUrl?: InputMaybe<Scalars['String']['input']>;
};

export type MutationAddMetadataToPrivateSaleArgs = {
    description?: InputMaybe<Scalars['String']['input']>;
    facebookUrl?: InputMaybe<Scalars['String']['input']>;
    githubUrl?: InputMaybe<Scalars['String']['input']>;
    logoUrl: Scalars['String']['input'];
    redditUrl?: InputMaybe<Scalars['String']['input']>;
    telegramUrl?: InputMaybe<Scalars['String']['input']>;
    twitterUrl?: InputMaybe<Scalars['String']['input']>;
    txHash: Scalars['String']['input'];
    webUrl: Scalars['String']['input'];
    youtubeUrl?: InputMaybe<Scalars['String']['input']>;
};

export type MutationAddTitleToLockArgs = {
    title: Scalars['String']['input'];
    txHash: Scalars['String']['input'];
};

export type MutationEditAirdropMetadataArgs = {
    contractAddress: Scalars['String']['input'];
    description?: InputMaybe<Scalars['String']['input']>;
    facebookUrl?: InputMaybe<Scalars['String']['input']>;
    githubUrl?: InputMaybe<Scalars['String']['input']>;
    logoUrl: Scalars['String']['input'];
    redditUrl?: InputMaybe<Scalars['String']['input']>;
    telegramUrl?: InputMaybe<Scalars['String']['input']>;
    twitterUrl?: InputMaybe<Scalars['String']['input']>;
    webUrl: Scalars['String']['input'];
    youtubeUrl?: InputMaybe<Scalars['String']['input']>;
};

export type PageInfo = {
    __typename?: 'PageInfo';
    endCursor: Scalars['String']['output'];
    hasNextPage: Scalars['Boolean']['output'];
    hasPreviousPage: Scalars['Boolean']['output'];
    startCursor: Scalars['String']['output'];
};

export type PrivateSale = BaseEntity & {
    __typename?: 'PrivateSale';
    chainId: Scalars['Int']['output'];
    contractAddress: Scalars['String']['output'];
    createdAt: Scalars['DateTime']['output'];
    currency: Scalars['String']['output'];
    cycleInterval: Scalars['BigInt']['output'];
    cyclePercent: Scalars['BigInt']['output'];
    depositedAmount: Scalars['BigInt']['output'];
    endTime: Scalars['BigInt']['output'];
    finalizeTime: Scalars['BigInt']['output'];
    hardcap: Scalars['BigInt']['output'];
    id: Scalars['String']['output'];
    initialRelease: Scalars['BigInt']['output'];
    investors: Array<Maybe<Scalars['String']['output']>>;
    isWhitelist: Scalars['Int']['output'];
    maxBuyLimit: Scalars['BigInt']['output'];
    metadata?: Maybe<PrivateSaleTemp>;
    minBuyLimit: Scalars['BigInt']['output'];
    name: Scalars['String']['output'];
    owner: Scalars['String']['output'];
    publicSaleTime: Scalars['BigInt']['output'];
    softcap: Scalars['BigInt']['output'];
    startTime: Scalars['BigInt']['output'];
    tokenSymbol: Scalars['String']['output'];
    updatedAt?: Maybe<Scalars['DateTime']['output']>;
    whitelistUsers: Array<Maybe<Scalars['String']['output']>>;
};

export type PrivateSaleEdge = {
    __typename?: 'PrivateSaleEdge';
    cursor: Scalars['String']['output'];
    node: PrivateSale;
};

export enum PrivateSaleOrderByInput {
    ChainIdAsc = 'chainId_ASC',
    ChainIdAscNullsFirst = 'chainId_ASC_NULLS_FIRST',
    ChainIdDesc = 'chainId_DESC',
    ChainIdDescNullsLast = 'chainId_DESC_NULLS_LAST',
    ContractAddressAsc = 'contractAddress_ASC',
    ContractAddressAscNullsFirst = 'contractAddress_ASC_NULLS_FIRST',
    ContractAddressDesc = 'contractAddress_DESC',
    ContractAddressDescNullsLast = 'contractAddress_DESC_NULLS_LAST',
    CreatedAtAsc = 'createdAt_ASC',
    CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
    CreatedAtDesc = 'createdAt_DESC',
    CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
    CurrencyAsc = 'currency_ASC',
    CurrencyAscNullsFirst = 'currency_ASC_NULLS_FIRST',
    CurrencyDesc = 'currency_DESC',
    CurrencyDescNullsLast = 'currency_DESC_NULLS_LAST',
    CycleIntervalAsc = 'cycleInterval_ASC',
    CycleIntervalAscNullsFirst = 'cycleInterval_ASC_NULLS_FIRST',
    CycleIntervalDesc = 'cycleInterval_DESC',
    CycleIntervalDescNullsLast = 'cycleInterval_DESC_NULLS_LAST',
    CyclePercentAsc = 'cyclePercent_ASC',
    CyclePercentAscNullsFirst = 'cyclePercent_ASC_NULLS_FIRST',
    CyclePercentDesc = 'cyclePercent_DESC',
    CyclePercentDescNullsLast = 'cyclePercent_DESC_NULLS_LAST',
    DepositedAmountAsc = 'depositedAmount_ASC',
    DepositedAmountAscNullsFirst = 'depositedAmount_ASC_NULLS_FIRST',
    DepositedAmountDesc = 'depositedAmount_DESC',
    DepositedAmountDescNullsLast = 'depositedAmount_DESC_NULLS_LAST',
    EndTimeAsc = 'endTime_ASC',
    EndTimeAscNullsFirst = 'endTime_ASC_NULLS_FIRST',
    EndTimeDesc = 'endTime_DESC',
    EndTimeDescNullsLast = 'endTime_DESC_NULLS_LAST',
    FinalizeTimeAsc = 'finalizeTime_ASC',
    FinalizeTimeAscNullsFirst = 'finalizeTime_ASC_NULLS_FIRST',
    FinalizeTimeDesc = 'finalizeTime_DESC',
    FinalizeTimeDescNullsLast = 'finalizeTime_DESC_NULLS_LAST',
    HardcapAsc = 'hardcap_ASC',
    HardcapAscNullsFirst = 'hardcap_ASC_NULLS_FIRST',
    HardcapDesc = 'hardcap_DESC',
    HardcapDescNullsLast = 'hardcap_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    InitialReleaseAsc = 'initialRelease_ASC',
    InitialReleaseAscNullsFirst = 'initialRelease_ASC_NULLS_FIRST',
    InitialReleaseDesc = 'initialRelease_DESC',
    InitialReleaseDescNullsLast = 'initialRelease_DESC_NULLS_LAST',
    IsWhitelistAsc = 'isWhitelist_ASC',
    IsWhitelistAscNullsFirst = 'isWhitelist_ASC_NULLS_FIRST',
    IsWhitelistDesc = 'isWhitelist_DESC',
    IsWhitelistDescNullsLast = 'isWhitelist_DESC_NULLS_LAST',
    MaxBuyLimitAsc = 'maxBuyLimit_ASC',
    MaxBuyLimitAscNullsFirst = 'maxBuyLimit_ASC_NULLS_FIRST',
    MaxBuyLimitDesc = 'maxBuyLimit_DESC',
    MaxBuyLimitDescNullsLast = 'maxBuyLimit_DESC_NULLS_LAST',
    MetadataIdAsc = 'metadata_id_ASC',
    MetadataIdAscNullsFirst = 'metadata_id_ASC_NULLS_FIRST',
    MetadataIdDesc = 'metadata_id_DESC',
    MetadataIdDescNullsLast = 'metadata_id_DESC_NULLS_LAST',
    MinBuyLimitAsc = 'minBuyLimit_ASC',
    MinBuyLimitAscNullsFirst = 'minBuyLimit_ASC_NULLS_FIRST',
    MinBuyLimitDesc = 'minBuyLimit_DESC',
    MinBuyLimitDescNullsLast = 'minBuyLimit_DESC_NULLS_LAST',
    NameAsc = 'name_ASC',
    NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
    NameDesc = 'name_DESC',
    NameDescNullsLast = 'name_DESC_NULLS_LAST',
    OwnerAsc = 'owner_ASC',
    OwnerAscNullsFirst = 'owner_ASC_NULLS_FIRST',
    OwnerDesc = 'owner_DESC',
    OwnerDescNullsLast = 'owner_DESC_NULLS_LAST',
    PublicSaleTimeAsc = 'publicSaleTime_ASC',
    PublicSaleTimeAscNullsFirst = 'publicSaleTime_ASC_NULLS_FIRST',
    PublicSaleTimeDesc = 'publicSaleTime_DESC',
    PublicSaleTimeDescNullsLast = 'publicSaleTime_DESC_NULLS_LAST',
    SoftcapAsc = 'softcap_ASC',
    SoftcapAscNullsFirst = 'softcap_ASC_NULLS_FIRST',
    SoftcapDesc = 'softcap_DESC',
    SoftcapDescNullsLast = 'softcap_DESC_NULLS_LAST',
    StartTimeAsc = 'startTime_ASC',
    StartTimeAscNullsFirst = 'startTime_ASC_NULLS_FIRST',
    StartTimeDesc = 'startTime_DESC',
    StartTimeDescNullsLast = 'startTime_DESC_NULLS_LAST',
    TokenSymbolAsc = 'tokenSymbol_ASC',
    TokenSymbolAscNullsFirst = 'tokenSymbol_ASC_NULLS_FIRST',
    TokenSymbolDesc = 'tokenSymbol_DESC',
    TokenSymbolDescNullsLast = 'tokenSymbol_DESC_NULLS_LAST',
    UpdatedAtAsc = 'updatedAt_ASC',
    UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
    UpdatedAtDesc = 'updatedAt_DESC',
    UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
}

export type PrivateSaleTemp = {
    __typename?: 'PrivateSaleTemp';
    id: Scalars['String']['output'];
    socials: Socials;
};

export type PrivateSaleTempEdge = {
    __typename?: 'PrivateSaleTempEdge';
    cursor: Scalars['String']['output'];
    node: PrivateSaleTemp;
};

export enum PrivateSaleTempOrderByInput {
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    SocialsDescriptionAsc = 'socials_description_ASC',
    SocialsDescriptionAscNullsFirst = 'socials_description_ASC_NULLS_FIRST',
    SocialsDescriptionDesc = 'socials_description_DESC',
    SocialsDescriptionDescNullsLast = 'socials_description_DESC_NULLS_LAST',
    SocialsFacebookUrlAsc = 'socials_facebookUrl_ASC',
    SocialsFacebookUrlAscNullsFirst = 'socials_facebookUrl_ASC_NULLS_FIRST',
    SocialsFacebookUrlDesc = 'socials_facebookUrl_DESC',
    SocialsFacebookUrlDescNullsLast = 'socials_facebookUrl_DESC_NULLS_LAST',
    SocialsGithubUrlAsc = 'socials_githubUrl_ASC',
    SocialsGithubUrlAscNullsFirst = 'socials_githubUrl_ASC_NULLS_FIRST',
    SocialsGithubUrlDesc = 'socials_githubUrl_DESC',
    SocialsGithubUrlDescNullsLast = 'socials_githubUrl_DESC_NULLS_LAST',
    SocialsLogoUrlAsc = 'socials_logoUrl_ASC',
    SocialsLogoUrlAscNullsFirst = 'socials_logoUrl_ASC_NULLS_FIRST',
    SocialsLogoUrlDesc = 'socials_logoUrl_DESC',
    SocialsLogoUrlDescNullsLast = 'socials_logoUrl_DESC_NULLS_LAST',
    SocialsRedditUrlAsc = 'socials_redditUrl_ASC',
    SocialsRedditUrlAscNullsFirst = 'socials_redditUrl_ASC_NULLS_FIRST',
    SocialsRedditUrlDesc = 'socials_redditUrl_DESC',
    SocialsRedditUrlDescNullsLast = 'socials_redditUrl_DESC_NULLS_LAST',
    SocialsTelegramUrlAsc = 'socials_telegramUrl_ASC',
    SocialsTelegramUrlAscNullsFirst = 'socials_telegramUrl_ASC_NULLS_FIRST',
    SocialsTelegramUrlDesc = 'socials_telegramUrl_DESC',
    SocialsTelegramUrlDescNullsLast = 'socials_telegramUrl_DESC_NULLS_LAST',
    SocialsTwitterUrlAsc = 'socials_twitterUrl_ASC',
    SocialsTwitterUrlAscNullsFirst = 'socials_twitterUrl_ASC_NULLS_FIRST',
    SocialsTwitterUrlDesc = 'socials_twitterUrl_DESC',
    SocialsTwitterUrlDescNullsLast = 'socials_twitterUrl_DESC_NULLS_LAST',
    SocialsWebUrlAsc = 'socials_webUrl_ASC',
    SocialsWebUrlAscNullsFirst = 'socials_webUrl_ASC_NULLS_FIRST',
    SocialsWebUrlDesc = 'socials_webUrl_DESC',
    SocialsWebUrlDescNullsLast = 'socials_webUrl_DESC_NULLS_LAST',
    SocialsYoutubeUrlAsc = 'socials_youtubeUrl_ASC',
    SocialsYoutubeUrlAscNullsFirst = 'socials_youtubeUrl_ASC_NULLS_FIRST',
    SocialsYoutubeUrlDesc = 'socials_youtubeUrl_DESC',
    SocialsYoutubeUrlDescNullsLast = 'socials_youtubeUrl_DESC_NULLS_LAST',
}

export type PrivateSaleTempWhereInput = {
    AND?: InputMaybe<Array<PrivateSaleTempWhereInput>>;
    OR?: InputMaybe<Array<PrivateSaleTempWhereInput>>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    socials?: InputMaybe<SocialsWhereInput>;
    socials_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PrivateSaleTempsConnection = {
    __typename?: 'PrivateSaleTempsConnection';
    edges: Array<PrivateSaleTempEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type PrivateSaleWhereInput = {
    AND?: InputMaybe<Array<PrivateSaleWhereInput>>;
    OR?: InputMaybe<Array<PrivateSaleWhereInput>>;
    chainId_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_gt?: InputMaybe<Scalars['Int']['input']>;
    chainId_gte?: InputMaybe<Scalars['Int']['input']>;
    chainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    chainId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    chainId_lt?: InputMaybe<Scalars['Int']['input']>;
    chainId_lte?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    contractAddress_contains?: InputMaybe<Scalars['String']['input']>;
    contractAddress_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    contractAddress_endsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_eq?: InputMaybe<Scalars['String']['input']>;
    contractAddress_gt?: InputMaybe<Scalars['String']['input']>;
    contractAddress_gte?: InputMaybe<Scalars['String']['input']>;
    contractAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
    contractAddress_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    contractAddress_lt?: InputMaybe<Scalars['String']['input']>;
    contractAddress_lte?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_eq?: InputMaybe<Scalars['String']['input']>;
    contractAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    contractAddress_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    contractAddress_startsWith?: InputMaybe<Scalars['String']['input']>;
    createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    currency_contains?: InputMaybe<Scalars['String']['input']>;
    currency_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    currency_endsWith?: InputMaybe<Scalars['String']['input']>;
    currency_eq?: InputMaybe<Scalars['String']['input']>;
    currency_gt?: InputMaybe<Scalars['String']['input']>;
    currency_gte?: InputMaybe<Scalars['String']['input']>;
    currency_in?: InputMaybe<Array<Scalars['String']['input']>>;
    currency_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    currency_lt?: InputMaybe<Scalars['String']['input']>;
    currency_lte?: InputMaybe<Scalars['String']['input']>;
    currency_not_contains?: InputMaybe<Scalars['String']['input']>;
    currency_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    currency_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    currency_not_eq?: InputMaybe<Scalars['String']['input']>;
    currency_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    currency_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    currency_startsWith?: InputMaybe<Scalars['String']['input']>;
    cycleInterval_eq?: InputMaybe<Scalars['BigInt']['input']>;
    cycleInterval_gt?: InputMaybe<Scalars['BigInt']['input']>;
    cycleInterval_gte?: InputMaybe<Scalars['BigInt']['input']>;
    cycleInterval_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    cycleInterval_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    cycleInterval_lt?: InputMaybe<Scalars['BigInt']['input']>;
    cycleInterval_lte?: InputMaybe<Scalars['BigInt']['input']>;
    cycleInterval_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    cycleInterval_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    cyclePercent_eq?: InputMaybe<Scalars['BigInt']['input']>;
    cyclePercent_gt?: InputMaybe<Scalars['BigInt']['input']>;
    cyclePercent_gte?: InputMaybe<Scalars['BigInt']['input']>;
    cyclePercent_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    cyclePercent_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    cyclePercent_lt?: InputMaybe<Scalars['BigInt']['input']>;
    cyclePercent_lte?: InputMaybe<Scalars['BigInt']['input']>;
    cyclePercent_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    cyclePercent_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    depositedAmount_eq?: InputMaybe<Scalars['BigInt']['input']>;
    depositedAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
    depositedAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
    depositedAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    depositedAmount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    depositedAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
    depositedAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
    depositedAmount_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    depositedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    endTime_eq?: InputMaybe<Scalars['BigInt']['input']>;
    endTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
    endTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
    endTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    endTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    endTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
    endTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
    endTime_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    endTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    finalizeTime_eq?: InputMaybe<Scalars['BigInt']['input']>;
    finalizeTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
    finalizeTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
    finalizeTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    finalizeTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    finalizeTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
    finalizeTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
    finalizeTime_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    finalizeTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    hardcap_eq?: InputMaybe<Scalars['BigInt']['input']>;
    hardcap_gt?: InputMaybe<Scalars['BigInt']['input']>;
    hardcap_gte?: InputMaybe<Scalars['BigInt']['input']>;
    hardcap_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    hardcap_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    hardcap_lt?: InputMaybe<Scalars['BigInt']['input']>;
    hardcap_lte?: InputMaybe<Scalars['BigInt']['input']>;
    hardcap_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    hardcap_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    initialRelease_eq?: InputMaybe<Scalars['BigInt']['input']>;
    initialRelease_gt?: InputMaybe<Scalars['BigInt']['input']>;
    initialRelease_gte?: InputMaybe<Scalars['BigInt']['input']>;
    initialRelease_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    initialRelease_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    initialRelease_lt?: InputMaybe<Scalars['BigInt']['input']>;
    initialRelease_lte?: InputMaybe<Scalars['BigInt']['input']>;
    initialRelease_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    initialRelease_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    investors_containsAll?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    investors_containsAny?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    investors_containsNone?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    investors_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    isWhitelist_eq?: InputMaybe<Scalars['Int']['input']>;
    isWhitelist_gt?: InputMaybe<Scalars['Int']['input']>;
    isWhitelist_gte?: InputMaybe<Scalars['Int']['input']>;
    isWhitelist_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    isWhitelist_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    isWhitelist_lt?: InputMaybe<Scalars['Int']['input']>;
    isWhitelist_lte?: InputMaybe<Scalars['Int']['input']>;
    isWhitelist_not_eq?: InputMaybe<Scalars['Int']['input']>;
    isWhitelist_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    maxBuyLimit_eq?: InputMaybe<Scalars['BigInt']['input']>;
    maxBuyLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
    maxBuyLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
    maxBuyLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    maxBuyLimit_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    maxBuyLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
    maxBuyLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
    maxBuyLimit_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    maxBuyLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    metadata?: InputMaybe<PrivateSaleTempWhereInput>;
    metadata_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    minBuyLimit_eq?: InputMaybe<Scalars['BigInt']['input']>;
    minBuyLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
    minBuyLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
    minBuyLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    minBuyLimit_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    minBuyLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
    minBuyLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
    minBuyLimit_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    minBuyLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    name_contains?: InputMaybe<Scalars['String']['input']>;
    name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    name_endsWith?: InputMaybe<Scalars['String']['input']>;
    name_eq?: InputMaybe<Scalars['String']['input']>;
    name_gt?: InputMaybe<Scalars['String']['input']>;
    name_gte?: InputMaybe<Scalars['String']['input']>;
    name_in?: InputMaybe<Array<Scalars['String']['input']>>;
    name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    name_lt?: InputMaybe<Scalars['String']['input']>;
    name_lte?: InputMaybe<Scalars['String']['input']>;
    name_not_contains?: InputMaybe<Scalars['String']['input']>;
    name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    name_not_eq?: InputMaybe<Scalars['String']['input']>;
    name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    name_startsWith?: InputMaybe<Scalars['String']['input']>;
    owner_contains?: InputMaybe<Scalars['String']['input']>;
    owner_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    owner_endsWith?: InputMaybe<Scalars['String']['input']>;
    owner_eq?: InputMaybe<Scalars['String']['input']>;
    owner_gt?: InputMaybe<Scalars['String']['input']>;
    owner_gte?: InputMaybe<Scalars['String']['input']>;
    owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
    owner_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    owner_lt?: InputMaybe<Scalars['String']['input']>;
    owner_lte?: InputMaybe<Scalars['String']['input']>;
    owner_not_contains?: InputMaybe<Scalars['String']['input']>;
    owner_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    owner_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    owner_not_eq?: InputMaybe<Scalars['String']['input']>;
    owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    owner_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    owner_startsWith?: InputMaybe<Scalars['String']['input']>;
    publicSaleTime_eq?: InputMaybe<Scalars['BigInt']['input']>;
    publicSaleTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
    publicSaleTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
    publicSaleTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    publicSaleTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    publicSaleTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
    publicSaleTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
    publicSaleTime_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    publicSaleTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    softcap_eq?: InputMaybe<Scalars['BigInt']['input']>;
    softcap_gt?: InputMaybe<Scalars['BigInt']['input']>;
    softcap_gte?: InputMaybe<Scalars['BigInt']['input']>;
    softcap_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    softcap_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    softcap_lt?: InputMaybe<Scalars['BigInt']['input']>;
    softcap_lte?: InputMaybe<Scalars['BigInt']['input']>;
    softcap_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    softcap_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    startTime_eq?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    startTime_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    startTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    startTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    tokenSymbol_contains?: InputMaybe<Scalars['String']['input']>;
    tokenSymbol_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    tokenSymbol_endsWith?: InputMaybe<Scalars['String']['input']>;
    tokenSymbol_eq?: InputMaybe<Scalars['String']['input']>;
    tokenSymbol_gt?: InputMaybe<Scalars['String']['input']>;
    tokenSymbol_gte?: InputMaybe<Scalars['String']['input']>;
    tokenSymbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
    tokenSymbol_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    tokenSymbol_lt?: InputMaybe<Scalars['String']['input']>;
    tokenSymbol_lte?: InputMaybe<Scalars['String']['input']>;
    tokenSymbol_not_contains?: InputMaybe<Scalars['String']['input']>;
    tokenSymbol_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    tokenSymbol_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    tokenSymbol_not_eq?: InputMaybe<Scalars['String']['input']>;
    tokenSymbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    tokenSymbol_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    tokenSymbol_startsWith?: InputMaybe<Scalars['String']['input']>;
    updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    whitelistUsers_containsAll?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    whitelistUsers_containsAny?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    whitelistUsers_containsNone?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
    whitelistUsers_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PrivateSalesConnection = {
    __typename?: 'PrivateSalesConnection';
    edges: Array<PrivateSaleEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type Query = {
    __typename?: 'Query';
    aggregationById?: Maybe<Aggregation>;
    /** @deprecated Use aggregationById */
    aggregationByUniqueInput?: Maybe<Aggregation>;
    aggregations: Array<Aggregation>;
    aggregationsConnection: AggregationsConnection;
    airdropById?: Maybe<Airdrop>;
    /** @deprecated Use airdropById */
    airdropByUniqueInput?: Maybe<Airdrop>;
    airdropTempById?: Maybe<AirdropTemp>;
    /** @deprecated Use airdropTempById */
    airdropTempByUniqueInput?: Maybe<AirdropTemp>;
    airdropTemps: Array<AirdropTemp>;
    airdropTempsConnection: AirdropTempsConnection;
    airdrops: Array<Airdrop>;
    airdropsConnection: AirdropsConnection;
    antibotById?: Maybe<Antibot>;
    /** @deprecated Use antibotById */
    antibotByUniqueInput?: Maybe<Antibot>;
    antibots: Array<Antibot>;
    antibotsConnection: AntibotsConnection;
    claimerById?: Maybe<Claimer>;
    /** @deprecated Use claimerById */
    claimerByUniqueInput?: Maybe<Claimer>;
    claimers: Array<Claimer>;
    claimersConnection: ClaimersConnection;
    fundTokenById?: Maybe<FundToken>;
    /** @deprecated Use fundTokenById */
    fundTokenByUniqueInput?: Maybe<FundToken>;
    fundTokens: Array<FundToken>;
    fundTokensConnection: FundTokensConnection;
    gemlaunchTokenById?: Maybe<GemlaunchToken>;
    /** @deprecated Use gemlaunchTokenById */
    gemlaunchTokenByUniqueInput?: Maybe<GemlaunchToken>;
    gemlaunchTokens: Array<GemlaunchToken>;
    gemlaunchTokensConnection: GemlaunchTokensConnection;
    hello: Scalars['String']['output'];
    launchPadById?: Maybe<LaunchPad>;
    /** @deprecated Use launchPadById */
    launchPadByUniqueInput?: Maybe<LaunchPad>;
    launchPads: Array<LaunchPad>;
    launchPadsConnection: LaunchPadsConnection;
    launchpadTempById?: Maybe<LaunchpadTemp>;
    /** @deprecated Use launchpadTempById */
    launchpadTempByUniqueInput?: Maybe<LaunchpadTemp>;
    launchpadTemps: Array<LaunchpadTemp>;
    launchpadTempsConnection: LaunchpadTempsConnection;
    liquidityDetails: Array<LiquidityDetails>;
    liquidityDetailsById?: Maybe<LiquidityDetails>;
    /** @deprecated Use liquidityDetailsById */
    liquidityDetailsByUniqueInput?: Maybe<LiquidityDetails>;
    liquidityDetailsConnection: LiquidityDetailsConnection;
    lockById?: Maybe<Lock>;
    /** @deprecated Use lockById */
    lockByUniqueInput?: Maybe<Lock>;
    lockTempById?: Maybe<LockTemp>;
    /** @deprecated Use lockTempById */
    lockTempByUniqueInput?: Maybe<LockTemp>;
    lockTemps: Array<LockTemp>;
    lockTempsConnection: LockTempsConnection;
    locks: Array<Lock>;
    locksConnection: LocksConnection;
    privateSaleById?: Maybe<PrivateSale>;
    /** @deprecated Use privateSaleById */
    privateSaleByUniqueInput?: Maybe<PrivateSale>;
    privateSaleTempById?: Maybe<PrivateSaleTemp>;
    /** @deprecated Use privateSaleTempById */
    privateSaleTempByUniqueInput?: Maybe<PrivateSaleTemp>;
    privateSaleTemps: Array<PrivateSaleTemp>;
    privateSaleTempsConnection: PrivateSaleTempsConnection;
    privateSales: Array<PrivateSale>;
    privateSalesConnection: PrivateSalesConnection;
    squidStatus?: Maybe<SquidStatus>;
    tokenById?: Maybe<Token>;
    /** @deprecated Use tokenById */
    tokenByUniqueInput?: Maybe<Token>;
    tokens: Array<Token>;
    tokensConnection: TokensConnection;
    transactionById?: Maybe<Transaction>;
    /** @deprecated Use transactionById */
    transactionByUniqueInput?: Maybe<Transaction>;
    transactions: Array<Transaction>;
    transactionsConnection: TransactionsConnection;
    userById?: Maybe<User>;
    /** @deprecated Use userById */
    userByUniqueInput?: Maybe<User>;
    users: Array<User>;
    usersConnection: UsersConnection;
    vestingById?: Maybe<Vesting>;
    /** @deprecated Use vestingById */
    vestingByUniqueInput?: Maybe<Vesting>;
    vestingDetails: Array<VestingDetails>;
    vestingDetailsById?: Maybe<VestingDetails>;
    /** @deprecated Use vestingDetailsById */
    vestingDetailsByUniqueInput?: Maybe<VestingDetails>;
    vestingDetailsConnection: VestingDetailsConnection;
    vestings: Array<Vesting>;
    vestingsConnection: VestingsConnection;
};

export type QueryAggregationByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryAggregationByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryAggregationsArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<AggregationOrderByInput>>;
    where?: InputMaybe<AggregationWhereInput>;
};

export type QueryAggregationsConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<AggregationOrderByInput>;
    where?: InputMaybe<AggregationWhereInput>;
};

export type QueryAirdropByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryAirdropByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryAirdropTempByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryAirdropTempByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryAirdropTempsArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<AirdropTempOrderByInput>>;
    where?: InputMaybe<AirdropTempWhereInput>;
};

export type QueryAirdropTempsConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<AirdropTempOrderByInput>;
    where?: InputMaybe<AirdropTempWhereInput>;
};

export type QueryAirdropsArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<AirdropOrderByInput>>;
    where?: InputMaybe<AirdropWhereInput>;
};

export type QueryAirdropsConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<AirdropOrderByInput>;
    where?: InputMaybe<AirdropWhereInput>;
};

export type QueryAntibotByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryAntibotByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryAntibotsArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<AntibotOrderByInput>>;
    where?: InputMaybe<AntibotWhereInput>;
};

export type QueryAntibotsConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<AntibotOrderByInput>;
    where?: InputMaybe<AntibotWhereInput>;
};

export type QueryClaimerByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryClaimerByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryClaimersArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<ClaimerOrderByInput>>;
    where?: InputMaybe<ClaimerWhereInput>;
};

export type QueryClaimersConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<ClaimerOrderByInput>;
    where?: InputMaybe<ClaimerWhereInput>;
};

export type QueryFundTokenByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryFundTokenByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryFundTokensArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<FundTokenOrderByInput>>;
    where?: InputMaybe<FundTokenWhereInput>;
};

export type QueryFundTokensConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<FundTokenOrderByInput>;
    where?: InputMaybe<FundTokenWhereInput>;
};

export type QueryGemlaunchTokenByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryGemlaunchTokenByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryGemlaunchTokensArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<GemlaunchTokenOrderByInput>>;
    where?: InputMaybe<GemlaunchTokenWhereInput>;
};

export type QueryGemlaunchTokensConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<GemlaunchTokenOrderByInput>;
    where?: InputMaybe<GemlaunchTokenWhereInput>;
};

export type QueryLaunchPadByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryLaunchPadByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryLaunchPadsArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<LaunchPadOrderByInput>>;
    where?: InputMaybe<LaunchPadWhereInput>;
};

export type QueryLaunchPadsConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<LaunchPadOrderByInput>;
    where?: InputMaybe<LaunchPadWhereInput>;
};

export type QueryLaunchpadTempByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryLaunchpadTempByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryLaunchpadTempsArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<LaunchpadTempOrderByInput>>;
    where?: InputMaybe<LaunchpadTempWhereInput>;
};

export type QueryLaunchpadTempsConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<LaunchpadTempOrderByInput>;
    where?: InputMaybe<LaunchpadTempWhereInput>;
};

export type QueryLiquidityDetailsArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<LiquidityDetailsOrderByInput>>;
    where?: InputMaybe<LiquidityDetailsWhereInput>;
};

export type QueryLiquidityDetailsByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryLiquidityDetailsByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryLiquidityDetailsConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<LiquidityDetailsOrderByInput>;
    where?: InputMaybe<LiquidityDetailsWhereInput>;
};

export type QueryLockByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryLockByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryLockTempByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryLockTempByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryLockTempsArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<LockTempOrderByInput>>;
    where?: InputMaybe<LockTempWhereInput>;
};

export type QueryLockTempsConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<LockTempOrderByInput>;
    where?: InputMaybe<LockTempWhereInput>;
};

export type QueryLocksArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<LockOrderByInput>>;
    where?: InputMaybe<LockWhereInput>;
};

export type QueryLocksConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<LockOrderByInput>;
    where?: InputMaybe<LockWhereInput>;
};

export type QueryPrivateSaleByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryPrivateSaleByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryPrivateSaleTempByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryPrivateSaleTempByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryPrivateSaleTempsArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<PrivateSaleTempOrderByInput>>;
    where?: InputMaybe<PrivateSaleTempWhereInput>;
};

export type QueryPrivateSaleTempsConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<PrivateSaleTempOrderByInput>;
    where?: InputMaybe<PrivateSaleTempWhereInput>;
};

export type QueryPrivateSalesArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<PrivateSaleOrderByInput>>;
    where?: InputMaybe<PrivateSaleWhereInput>;
};

export type QueryPrivateSalesConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<PrivateSaleOrderByInput>;
    where?: InputMaybe<PrivateSaleWhereInput>;
};

export type QueryTokenByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryTokenByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryTokensArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<TokenOrderByInput>>;
    where?: InputMaybe<TokenWhereInput>;
};

export type QueryTokensConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<TokenOrderByInput>;
    where?: InputMaybe<TokenWhereInput>;
};

export type QueryTransactionByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryTransactionByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryTransactionsArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<TransactionOrderByInput>>;
    where?: InputMaybe<TransactionWhereInput>;
};

export type QueryTransactionsConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<TransactionOrderByInput>;
    where?: InputMaybe<TransactionWhereInput>;
};

export type QueryUserByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryUserByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryUsersArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<UserOrderByInput>>;
    where?: InputMaybe<UserWhereInput>;
};

export type QueryUsersConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<UserOrderByInput>;
    where?: InputMaybe<UserWhereInput>;
};

export type QueryVestingByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryVestingByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryVestingDetailsArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<VestingDetailsOrderByInput>>;
    where?: InputMaybe<VestingDetailsWhereInput>;
};

export type QueryVestingDetailsByIdArgs = {
    id: Scalars['String']['input'];
};

export type QueryVestingDetailsByUniqueInputArgs = {
    where: WhereIdInput;
};

export type QueryVestingDetailsConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<VestingDetailsOrderByInput>;
    where?: InputMaybe<VestingDetailsWhereInput>;
};

export type QueryVestingsArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<VestingOrderByInput>>;
    where?: InputMaybe<VestingWhereInput>;
};

export type QueryVestingsConnectionArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy: Array<VestingOrderByInput>;
    where?: InputMaybe<VestingWhereInput>;
};

export type Socials = {
    __typename?: 'Socials';
    description?: Maybe<Scalars['String']['output']>;
    facebookUrl?: Maybe<Scalars['String']['output']>;
    githubUrl?: Maybe<Scalars['String']['output']>;
    logoUrl: Scalars['String']['output'];
    redditUrl?: Maybe<Scalars['String']['output']>;
    telegramUrl?: Maybe<Scalars['String']['output']>;
    twitterUrl?: Maybe<Scalars['String']['output']>;
    webUrl: Scalars['String']['output'];
    youtubeUrl?: Maybe<Scalars['String']['output']>;
};

export type SocialsWhereInput = {
    description_contains?: InputMaybe<Scalars['String']['input']>;
    description_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    description_endsWith?: InputMaybe<Scalars['String']['input']>;
    description_eq?: InputMaybe<Scalars['String']['input']>;
    description_gt?: InputMaybe<Scalars['String']['input']>;
    description_gte?: InputMaybe<Scalars['String']['input']>;
    description_in?: InputMaybe<Array<Scalars['String']['input']>>;
    description_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    description_lt?: InputMaybe<Scalars['String']['input']>;
    description_lte?: InputMaybe<Scalars['String']['input']>;
    description_not_contains?: InputMaybe<Scalars['String']['input']>;
    description_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    description_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    description_not_eq?: InputMaybe<Scalars['String']['input']>;
    description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    description_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    description_startsWith?: InputMaybe<Scalars['String']['input']>;
    facebookUrl_contains?: InputMaybe<Scalars['String']['input']>;
    facebookUrl_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    facebookUrl_endsWith?: InputMaybe<Scalars['String']['input']>;
    facebookUrl_eq?: InputMaybe<Scalars['String']['input']>;
    facebookUrl_gt?: InputMaybe<Scalars['String']['input']>;
    facebookUrl_gte?: InputMaybe<Scalars['String']['input']>;
    facebookUrl_in?: InputMaybe<Array<Scalars['String']['input']>>;
    facebookUrl_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    facebookUrl_lt?: InputMaybe<Scalars['String']['input']>;
    facebookUrl_lte?: InputMaybe<Scalars['String']['input']>;
    facebookUrl_not_contains?: InputMaybe<Scalars['String']['input']>;
    facebookUrl_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    facebookUrl_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    facebookUrl_not_eq?: InputMaybe<Scalars['String']['input']>;
    facebookUrl_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    facebookUrl_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    facebookUrl_startsWith?: InputMaybe<Scalars['String']['input']>;
    githubUrl_contains?: InputMaybe<Scalars['String']['input']>;
    githubUrl_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    githubUrl_endsWith?: InputMaybe<Scalars['String']['input']>;
    githubUrl_eq?: InputMaybe<Scalars['String']['input']>;
    githubUrl_gt?: InputMaybe<Scalars['String']['input']>;
    githubUrl_gte?: InputMaybe<Scalars['String']['input']>;
    githubUrl_in?: InputMaybe<Array<Scalars['String']['input']>>;
    githubUrl_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    githubUrl_lt?: InputMaybe<Scalars['String']['input']>;
    githubUrl_lte?: InputMaybe<Scalars['String']['input']>;
    githubUrl_not_contains?: InputMaybe<Scalars['String']['input']>;
    githubUrl_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    githubUrl_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    githubUrl_not_eq?: InputMaybe<Scalars['String']['input']>;
    githubUrl_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    githubUrl_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    githubUrl_startsWith?: InputMaybe<Scalars['String']['input']>;
    logoUrl_contains?: InputMaybe<Scalars['String']['input']>;
    logoUrl_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    logoUrl_endsWith?: InputMaybe<Scalars['String']['input']>;
    logoUrl_eq?: InputMaybe<Scalars['String']['input']>;
    logoUrl_gt?: InputMaybe<Scalars['String']['input']>;
    logoUrl_gte?: InputMaybe<Scalars['String']['input']>;
    logoUrl_in?: InputMaybe<Array<Scalars['String']['input']>>;
    logoUrl_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    logoUrl_lt?: InputMaybe<Scalars['String']['input']>;
    logoUrl_lte?: InputMaybe<Scalars['String']['input']>;
    logoUrl_not_contains?: InputMaybe<Scalars['String']['input']>;
    logoUrl_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    logoUrl_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    logoUrl_not_eq?: InputMaybe<Scalars['String']['input']>;
    logoUrl_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    logoUrl_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    logoUrl_startsWith?: InputMaybe<Scalars['String']['input']>;
    redditUrl_contains?: InputMaybe<Scalars['String']['input']>;
    redditUrl_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    redditUrl_endsWith?: InputMaybe<Scalars['String']['input']>;
    redditUrl_eq?: InputMaybe<Scalars['String']['input']>;
    redditUrl_gt?: InputMaybe<Scalars['String']['input']>;
    redditUrl_gte?: InputMaybe<Scalars['String']['input']>;
    redditUrl_in?: InputMaybe<Array<Scalars['String']['input']>>;
    redditUrl_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    redditUrl_lt?: InputMaybe<Scalars['String']['input']>;
    redditUrl_lte?: InputMaybe<Scalars['String']['input']>;
    redditUrl_not_contains?: InputMaybe<Scalars['String']['input']>;
    redditUrl_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    redditUrl_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    redditUrl_not_eq?: InputMaybe<Scalars['String']['input']>;
    redditUrl_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    redditUrl_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    redditUrl_startsWith?: InputMaybe<Scalars['String']['input']>;
    telegramUrl_contains?: InputMaybe<Scalars['String']['input']>;
    telegramUrl_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    telegramUrl_endsWith?: InputMaybe<Scalars['String']['input']>;
    telegramUrl_eq?: InputMaybe<Scalars['String']['input']>;
    telegramUrl_gt?: InputMaybe<Scalars['String']['input']>;
    telegramUrl_gte?: InputMaybe<Scalars['String']['input']>;
    telegramUrl_in?: InputMaybe<Array<Scalars['String']['input']>>;
    telegramUrl_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    telegramUrl_lt?: InputMaybe<Scalars['String']['input']>;
    telegramUrl_lte?: InputMaybe<Scalars['String']['input']>;
    telegramUrl_not_contains?: InputMaybe<Scalars['String']['input']>;
    telegramUrl_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    telegramUrl_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    telegramUrl_not_eq?: InputMaybe<Scalars['String']['input']>;
    telegramUrl_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    telegramUrl_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    telegramUrl_startsWith?: InputMaybe<Scalars['String']['input']>;
    twitterUrl_contains?: InputMaybe<Scalars['String']['input']>;
    twitterUrl_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    twitterUrl_endsWith?: InputMaybe<Scalars['String']['input']>;
    twitterUrl_eq?: InputMaybe<Scalars['String']['input']>;
    twitterUrl_gt?: InputMaybe<Scalars['String']['input']>;
    twitterUrl_gte?: InputMaybe<Scalars['String']['input']>;
    twitterUrl_in?: InputMaybe<Array<Scalars['String']['input']>>;
    twitterUrl_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    twitterUrl_lt?: InputMaybe<Scalars['String']['input']>;
    twitterUrl_lte?: InputMaybe<Scalars['String']['input']>;
    twitterUrl_not_contains?: InputMaybe<Scalars['String']['input']>;
    twitterUrl_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    twitterUrl_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    twitterUrl_not_eq?: InputMaybe<Scalars['String']['input']>;
    twitterUrl_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    twitterUrl_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    twitterUrl_startsWith?: InputMaybe<Scalars['String']['input']>;
    webUrl_contains?: InputMaybe<Scalars['String']['input']>;
    webUrl_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    webUrl_endsWith?: InputMaybe<Scalars['String']['input']>;
    webUrl_eq?: InputMaybe<Scalars['String']['input']>;
    webUrl_gt?: InputMaybe<Scalars['String']['input']>;
    webUrl_gte?: InputMaybe<Scalars['String']['input']>;
    webUrl_in?: InputMaybe<Array<Scalars['String']['input']>>;
    webUrl_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    webUrl_lt?: InputMaybe<Scalars['String']['input']>;
    webUrl_lte?: InputMaybe<Scalars['String']['input']>;
    webUrl_not_contains?: InputMaybe<Scalars['String']['input']>;
    webUrl_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    webUrl_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    webUrl_not_eq?: InputMaybe<Scalars['String']['input']>;
    webUrl_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    webUrl_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    webUrl_startsWith?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl_contains?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl_endsWith?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl_eq?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl_gt?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl_gte?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl_in?: InputMaybe<Array<Scalars['String']['input']>>;
    youtubeUrl_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    youtubeUrl_lt?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl_lte?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl_not_contains?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl_not_eq?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    youtubeUrl_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl_startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type SquidStatus = {
    __typename?: 'SquidStatus';
    /** The height of the processed part of the chain */
    height?: Maybe<Scalars['Int']['output']>;
};

export enum Status {
    Active = 'ACTIVE',
    Cancelled = 'CANCELLED',
    Closed = 'CLOSED',
    Pending = 'PENDING',
}

export type Token = BaseEntity & {
    __typename?: 'Token';
    chainId: Scalars['Int']['output'];
    createdAt: Scalars['DateTime']['output'];
    decimals: Scalars['Int']['output'];
    id: Scalars['String']['output'];
    image?: Maybe<Scalars['String']['output']>;
    isLiquidityToken: Scalars['Boolean']['output'];
    locks: Array<Lock>;
    name: Scalars['String']['output'];
    nextUnlock?: Maybe<Scalars['DateTime']['output']>;
    reserve0?: Maybe<Scalars['BigInt']['output']>;
    reserve1?: Maybe<Scalars['BigInt']['output']>;
    symbol?: Maybe<Scalars['String']['output']>;
    token0?: Maybe<Token>;
    token1?: Maybe<Token>;
    tokenLocked: Scalars['Float']['output'];
    tokenLockedCount: Scalars['Int']['output'];
    tokenLockedInUsd: Scalars['Float']['output'];
    totalSupply: Scalars['BigInt']['output'];
    updatedAt?: Maybe<Scalars['DateTime']['output']>;
    usdPrice: Scalars['Float']['output'];
};

export type TokenLocksArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<LockOrderByInput>>;
    where?: InputMaybe<LockWhereInput>;
};

export type TokenEdge = {
    __typename?: 'TokenEdge';
    cursor: Scalars['String']['output'];
    node: Token;
};

export enum TokenOrderByInput {
    ChainIdAsc = 'chainId_ASC',
    ChainIdAscNullsFirst = 'chainId_ASC_NULLS_FIRST',
    ChainIdDesc = 'chainId_DESC',
    ChainIdDescNullsLast = 'chainId_DESC_NULLS_LAST',
    CreatedAtAsc = 'createdAt_ASC',
    CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
    CreatedAtDesc = 'createdAt_DESC',
    CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
    DecimalsAsc = 'decimals_ASC',
    DecimalsAscNullsFirst = 'decimals_ASC_NULLS_FIRST',
    DecimalsDesc = 'decimals_DESC',
    DecimalsDescNullsLast = 'decimals_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    ImageAsc = 'image_ASC',
    ImageAscNullsFirst = 'image_ASC_NULLS_FIRST',
    ImageDesc = 'image_DESC',
    ImageDescNullsLast = 'image_DESC_NULLS_LAST',
    IsLiquidityTokenAsc = 'isLiquidityToken_ASC',
    IsLiquidityTokenAscNullsFirst = 'isLiquidityToken_ASC_NULLS_FIRST',
    IsLiquidityTokenDesc = 'isLiquidityToken_DESC',
    IsLiquidityTokenDescNullsLast = 'isLiquidityToken_DESC_NULLS_LAST',
    NameAsc = 'name_ASC',
    NameAscNullsFirst = 'name_ASC_NULLS_FIRST',
    NameDesc = 'name_DESC',
    NameDescNullsLast = 'name_DESC_NULLS_LAST',
    NextUnlockAsc = 'nextUnlock_ASC',
    NextUnlockAscNullsFirst = 'nextUnlock_ASC_NULLS_FIRST',
    NextUnlockDesc = 'nextUnlock_DESC',
    NextUnlockDescNullsLast = 'nextUnlock_DESC_NULLS_LAST',
    Reserve0Asc = 'reserve0_ASC',
    Reserve0AscNullsFirst = 'reserve0_ASC_NULLS_FIRST',
    Reserve0Desc = 'reserve0_DESC',
    Reserve0DescNullsLast = 'reserve0_DESC_NULLS_LAST',
    Reserve1Asc = 'reserve1_ASC',
    Reserve1AscNullsFirst = 'reserve1_ASC_NULLS_FIRST',
    Reserve1Desc = 'reserve1_DESC',
    Reserve1DescNullsLast = 'reserve1_DESC_NULLS_LAST',
    SymbolAsc = 'symbol_ASC',
    SymbolAscNullsFirst = 'symbol_ASC_NULLS_FIRST',
    SymbolDesc = 'symbol_DESC',
    SymbolDescNullsLast = 'symbol_DESC_NULLS_LAST',
    Token0ChainIdAsc = 'token0_chainId_ASC',
    Token0ChainIdAscNullsFirst = 'token0_chainId_ASC_NULLS_FIRST',
    Token0ChainIdDesc = 'token0_chainId_DESC',
    Token0ChainIdDescNullsLast = 'token0_chainId_DESC_NULLS_LAST',
    Token0CreatedAtAsc = 'token0_createdAt_ASC',
    Token0CreatedAtAscNullsFirst = 'token0_createdAt_ASC_NULLS_FIRST',
    Token0CreatedAtDesc = 'token0_createdAt_DESC',
    Token0CreatedAtDescNullsLast = 'token0_createdAt_DESC_NULLS_LAST',
    Token0DecimalsAsc = 'token0_decimals_ASC',
    Token0DecimalsAscNullsFirst = 'token0_decimals_ASC_NULLS_FIRST',
    Token0DecimalsDesc = 'token0_decimals_DESC',
    Token0DecimalsDescNullsLast = 'token0_decimals_DESC_NULLS_LAST',
    Token0IdAsc = 'token0_id_ASC',
    Token0IdAscNullsFirst = 'token0_id_ASC_NULLS_FIRST',
    Token0IdDesc = 'token0_id_DESC',
    Token0IdDescNullsLast = 'token0_id_DESC_NULLS_LAST',
    Token0ImageAsc = 'token0_image_ASC',
    Token0ImageAscNullsFirst = 'token0_image_ASC_NULLS_FIRST',
    Token0ImageDesc = 'token0_image_DESC',
    Token0ImageDescNullsLast = 'token0_image_DESC_NULLS_LAST',
    Token0IsLiquidityTokenAsc = 'token0_isLiquidityToken_ASC',
    Token0IsLiquidityTokenAscNullsFirst = 'token0_isLiquidityToken_ASC_NULLS_FIRST',
    Token0IsLiquidityTokenDesc = 'token0_isLiquidityToken_DESC',
    Token0IsLiquidityTokenDescNullsLast = 'token0_isLiquidityToken_DESC_NULLS_LAST',
    Token0NameAsc = 'token0_name_ASC',
    Token0NameAscNullsFirst = 'token0_name_ASC_NULLS_FIRST',
    Token0NameDesc = 'token0_name_DESC',
    Token0NameDescNullsLast = 'token0_name_DESC_NULLS_LAST',
    Token0NextUnlockAsc = 'token0_nextUnlock_ASC',
    Token0NextUnlockAscNullsFirst = 'token0_nextUnlock_ASC_NULLS_FIRST',
    Token0NextUnlockDesc = 'token0_nextUnlock_DESC',
    Token0NextUnlockDescNullsLast = 'token0_nextUnlock_DESC_NULLS_LAST',
    Token0Reserve0Asc = 'token0_reserve0_ASC',
    Token0Reserve0AscNullsFirst = 'token0_reserve0_ASC_NULLS_FIRST',
    Token0Reserve0Desc = 'token0_reserve0_DESC',
    Token0Reserve0DescNullsLast = 'token0_reserve0_DESC_NULLS_LAST',
    Token0Reserve1Asc = 'token0_reserve1_ASC',
    Token0Reserve1AscNullsFirst = 'token0_reserve1_ASC_NULLS_FIRST',
    Token0Reserve1Desc = 'token0_reserve1_DESC',
    Token0Reserve1DescNullsLast = 'token0_reserve1_DESC_NULLS_LAST',
    Token0SymbolAsc = 'token0_symbol_ASC',
    Token0SymbolAscNullsFirst = 'token0_symbol_ASC_NULLS_FIRST',
    Token0SymbolDesc = 'token0_symbol_DESC',
    Token0SymbolDescNullsLast = 'token0_symbol_DESC_NULLS_LAST',
    Token0TokenLockedCountAsc = 'token0_tokenLockedCount_ASC',
    Token0TokenLockedCountAscNullsFirst = 'token0_tokenLockedCount_ASC_NULLS_FIRST',
    Token0TokenLockedCountDesc = 'token0_tokenLockedCount_DESC',
    Token0TokenLockedCountDescNullsLast = 'token0_tokenLockedCount_DESC_NULLS_LAST',
    Token0TokenLockedInUsdAsc = 'token0_tokenLockedInUsd_ASC',
    Token0TokenLockedInUsdAscNullsFirst = 'token0_tokenLockedInUsd_ASC_NULLS_FIRST',
    Token0TokenLockedInUsdDesc = 'token0_tokenLockedInUsd_DESC',
    Token0TokenLockedInUsdDescNullsLast = 'token0_tokenLockedInUsd_DESC_NULLS_LAST',
    Token0TokenLockedAsc = 'token0_tokenLocked_ASC',
    Token0TokenLockedAscNullsFirst = 'token0_tokenLocked_ASC_NULLS_FIRST',
    Token0TokenLockedDesc = 'token0_tokenLocked_DESC',
    Token0TokenLockedDescNullsLast = 'token0_tokenLocked_DESC_NULLS_LAST',
    Token0TotalSupplyAsc = 'token0_totalSupply_ASC',
    Token0TotalSupplyAscNullsFirst = 'token0_totalSupply_ASC_NULLS_FIRST',
    Token0TotalSupplyDesc = 'token0_totalSupply_DESC',
    Token0TotalSupplyDescNullsLast = 'token0_totalSupply_DESC_NULLS_LAST',
    Token0UpdatedAtAsc = 'token0_updatedAt_ASC',
    Token0UpdatedAtAscNullsFirst = 'token0_updatedAt_ASC_NULLS_FIRST',
    Token0UpdatedAtDesc = 'token0_updatedAt_DESC',
    Token0UpdatedAtDescNullsLast = 'token0_updatedAt_DESC_NULLS_LAST',
    Token0UsdPriceAsc = 'token0_usdPrice_ASC',
    Token0UsdPriceAscNullsFirst = 'token0_usdPrice_ASC_NULLS_FIRST',
    Token0UsdPriceDesc = 'token0_usdPrice_DESC',
    Token0UsdPriceDescNullsLast = 'token0_usdPrice_DESC_NULLS_LAST',
    Token1ChainIdAsc = 'token1_chainId_ASC',
    Token1ChainIdAscNullsFirst = 'token1_chainId_ASC_NULLS_FIRST',
    Token1ChainIdDesc = 'token1_chainId_DESC',
    Token1ChainIdDescNullsLast = 'token1_chainId_DESC_NULLS_LAST',
    Token1CreatedAtAsc = 'token1_createdAt_ASC',
    Token1CreatedAtAscNullsFirst = 'token1_createdAt_ASC_NULLS_FIRST',
    Token1CreatedAtDesc = 'token1_createdAt_DESC',
    Token1CreatedAtDescNullsLast = 'token1_createdAt_DESC_NULLS_LAST',
    Token1DecimalsAsc = 'token1_decimals_ASC',
    Token1DecimalsAscNullsFirst = 'token1_decimals_ASC_NULLS_FIRST',
    Token1DecimalsDesc = 'token1_decimals_DESC',
    Token1DecimalsDescNullsLast = 'token1_decimals_DESC_NULLS_LAST',
    Token1IdAsc = 'token1_id_ASC',
    Token1IdAscNullsFirst = 'token1_id_ASC_NULLS_FIRST',
    Token1IdDesc = 'token1_id_DESC',
    Token1IdDescNullsLast = 'token1_id_DESC_NULLS_LAST',
    Token1ImageAsc = 'token1_image_ASC',
    Token1ImageAscNullsFirst = 'token1_image_ASC_NULLS_FIRST',
    Token1ImageDesc = 'token1_image_DESC',
    Token1ImageDescNullsLast = 'token1_image_DESC_NULLS_LAST',
    Token1IsLiquidityTokenAsc = 'token1_isLiquidityToken_ASC',
    Token1IsLiquidityTokenAscNullsFirst = 'token1_isLiquidityToken_ASC_NULLS_FIRST',
    Token1IsLiquidityTokenDesc = 'token1_isLiquidityToken_DESC',
    Token1IsLiquidityTokenDescNullsLast = 'token1_isLiquidityToken_DESC_NULLS_LAST',
    Token1NameAsc = 'token1_name_ASC',
    Token1NameAscNullsFirst = 'token1_name_ASC_NULLS_FIRST',
    Token1NameDesc = 'token1_name_DESC',
    Token1NameDescNullsLast = 'token1_name_DESC_NULLS_LAST',
    Token1NextUnlockAsc = 'token1_nextUnlock_ASC',
    Token1NextUnlockAscNullsFirst = 'token1_nextUnlock_ASC_NULLS_FIRST',
    Token1NextUnlockDesc = 'token1_nextUnlock_DESC',
    Token1NextUnlockDescNullsLast = 'token1_nextUnlock_DESC_NULLS_LAST',
    Token1Reserve0Asc = 'token1_reserve0_ASC',
    Token1Reserve0AscNullsFirst = 'token1_reserve0_ASC_NULLS_FIRST',
    Token1Reserve0Desc = 'token1_reserve0_DESC',
    Token1Reserve0DescNullsLast = 'token1_reserve0_DESC_NULLS_LAST',
    Token1Reserve1Asc = 'token1_reserve1_ASC',
    Token1Reserve1AscNullsFirst = 'token1_reserve1_ASC_NULLS_FIRST',
    Token1Reserve1Desc = 'token1_reserve1_DESC',
    Token1Reserve1DescNullsLast = 'token1_reserve1_DESC_NULLS_LAST',
    Token1SymbolAsc = 'token1_symbol_ASC',
    Token1SymbolAscNullsFirst = 'token1_symbol_ASC_NULLS_FIRST',
    Token1SymbolDesc = 'token1_symbol_DESC',
    Token1SymbolDescNullsLast = 'token1_symbol_DESC_NULLS_LAST',
    Token1TokenLockedCountAsc = 'token1_tokenLockedCount_ASC',
    Token1TokenLockedCountAscNullsFirst = 'token1_tokenLockedCount_ASC_NULLS_FIRST',
    Token1TokenLockedCountDesc = 'token1_tokenLockedCount_DESC',
    Token1TokenLockedCountDescNullsLast = 'token1_tokenLockedCount_DESC_NULLS_LAST',
    Token1TokenLockedInUsdAsc = 'token1_tokenLockedInUsd_ASC',
    Token1TokenLockedInUsdAscNullsFirst = 'token1_tokenLockedInUsd_ASC_NULLS_FIRST',
    Token1TokenLockedInUsdDesc = 'token1_tokenLockedInUsd_DESC',
    Token1TokenLockedInUsdDescNullsLast = 'token1_tokenLockedInUsd_DESC_NULLS_LAST',
    Token1TokenLockedAsc = 'token1_tokenLocked_ASC',
    Token1TokenLockedAscNullsFirst = 'token1_tokenLocked_ASC_NULLS_FIRST',
    Token1TokenLockedDesc = 'token1_tokenLocked_DESC',
    Token1TokenLockedDescNullsLast = 'token1_tokenLocked_DESC_NULLS_LAST',
    Token1TotalSupplyAsc = 'token1_totalSupply_ASC',
    Token1TotalSupplyAscNullsFirst = 'token1_totalSupply_ASC_NULLS_FIRST',
    Token1TotalSupplyDesc = 'token1_totalSupply_DESC',
    Token1TotalSupplyDescNullsLast = 'token1_totalSupply_DESC_NULLS_LAST',
    Token1UpdatedAtAsc = 'token1_updatedAt_ASC',
    Token1UpdatedAtAscNullsFirst = 'token1_updatedAt_ASC_NULLS_FIRST',
    Token1UpdatedAtDesc = 'token1_updatedAt_DESC',
    Token1UpdatedAtDescNullsLast = 'token1_updatedAt_DESC_NULLS_LAST',
    Token1UsdPriceAsc = 'token1_usdPrice_ASC',
    Token1UsdPriceAscNullsFirst = 'token1_usdPrice_ASC_NULLS_FIRST',
    Token1UsdPriceDesc = 'token1_usdPrice_DESC',
    Token1UsdPriceDescNullsLast = 'token1_usdPrice_DESC_NULLS_LAST',
    TokenLockedCountAsc = 'tokenLockedCount_ASC',
    TokenLockedCountAscNullsFirst = 'tokenLockedCount_ASC_NULLS_FIRST',
    TokenLockedCountDesc = 'tokenLockedCount_DESC',
    TokenLockedCountDescNullsLast = 'tokenLockedCount_DESC_NULLS_LAST',
    TokenLockedInUsdAsc = 'tokenLockedInUsd_ASC',
    TokenLockedInUsdAscNullsFirst = 'tokenLockedInUsd_ASC_NULLS_FIRST',
    TokenLockedInUsdDesc = 'tokenLockedInUsd_DESC',
    TokenLockedInUsdDescNullsLast = 'tokenLockedInUsd_DESC_NULLS_LAST',
    TokenLockedAsc = 'tokenLocked_ASC',
    TokenLockedAscNullsFirst = 'tokenLocked_ASC_NULLS_FIRST',
    TokenLockedDesc = 'tokenLocked_DESC',
    TokenLockedDescNullsLast = 'tokenLocked_DESC_NULLS_LAST',
    TotalSupplyAsc = 'totalSupply_ASC',
    TotalSupplyAscNullsFirst = 'totalSupply_ASC_NULLS_FIRST',
    TotalSupplyDesc = 'totalSupply_DESC',
    TotalSupplyDescNullsLast = 'totalSupply_DESC_NULLS_LAST',
    UpdatedAtAsc = 'updatedAt_ASC',
    UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
    UpdatedAtDesc = 'updatedAt_DESC',
    UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
    UsdPriceAsc = 'usdPrice_ASC',
    UsdPriceAscNullsFirst = 'usdPrice_ASC_NULLS_FIRST',
    UsdPriceDesc = 'usdPrice_DESC',
    UsdPriceDescNullsLast = 'usdPrice_DESC_NULLS_LAST',
}

export type TokenWhereInput = {
    AND?: InputMaybe<Array<TokenWhereInput>>;
    OR?: InputMaybe<Array<TokenWhereInput>>;
    chainId_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_gt?: InputMaybe<Scalars['Int']['input']>;
    chainId_gte?: InputMaybe<Scalars['Int']['input']>;
    chainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    chainId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    chainId_lt?: InputMaybe<Scalars['Int']['input']>;
    chainId_lte?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    decimals_eq?: InputMaybe<Scalars['Int']['input']>;
    decimals_gt?: InputMaybe<Scalars['Int']['input']>;
    decimals_gte?: InputMaybe<Scalars['Int']['input']>;
    decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    decimals_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    decimals_lt?: InputMaybe<Scalars['Int']['input']>;
    decimals_lte?: InputMaybe<Scalars['Int']['input']>;
    decimals_not_eq?: InputMaybe<Scalars['Int']['input']>;
    decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    image_contains?: InputMaybe<Scalars['String']['input']>;
    image_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    image_endsWith?: InputMaybe<Scalars['String']['input']>;
    image_eq?: InputMaybe<Scalars['String']['input']>;
    image_gt?: InputMaybe<Scalars['String']['input']>;
    image_gte?: InputMaybe<Scalars['String']['input']>;
    image_in?: InputMaybe<Array<Scalars['String']['input']>>;
    image_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    image_lt?: InputMaybe<Scalars['String']['input']>;
    image_lte?: InputMaybe<Scalars['String']['input']>;
    image_not_contains?: InputMaybe<Scalars['String']['input']>;
    image_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    image_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    image_not_eq?: InputMaybe<Scalars['String']['input']>;
    image_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    image_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    image_startsWith?: InputMaybe<Scalars['String']['input']>;
    isLiquidityToken_eq?: InputMaybe<Scalars['Boolean']['input']>;
    isLiquidityToken_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    isLiquidityToken_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
    locks_every?: InputMaybe<LockWhereInput>;
    locks_none?: InputMaybe<LockWhereInput>;
    locks_some?: InputMaybe<LockWhereInput>;
    name_contains?: InputMaybe<Scalars['String']['input']>;
    name_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    name_endsWith?: InputMaybe<Scalars['String']['input']>;
    name_eq?: InputMaybe<Scalars['String']['input']>;
    name_gt?: InputMaybe<Scalars['String']['input']>;
    name_gte?: InputMaybe<Scalars['String']['input']>;
    name_in?: InputMaybe<Array<Scalars['String']['input']>>;
    name_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    name_lt?: InputMaybe<Scalars['String']['input']>;
    name_lte?: InputMaybe<Scalars['String']['input']>;
    name_not_contains?: InputMaybe<Scalars['String']['input']>;
    name_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    name_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    name_not_eq?: InputMaybe<Scalars['String']['input']>;
    name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    name_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    name_startsWith?: InputMaybe<Scalars['String']['input']>;
    nextUnlock_eq?: InputMaybe<Scalars['DateTime']['input']>;
    nextUnlock_gt?: InputMaybe<Scalars['DateTime']['input']>;
    nextUnlock_gte?: InputMaybe<Scalars['DateTime']['input']>;
    nextUnlock_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    nextUnlock_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    nextUnlock_lt?: InputMaybe<Scalars['DateTime']['input']>;
    nextUnlock_lte?: InputMaybe<Scalars['DateTime']['input']>;
    nextUnlock_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    nextUnlock_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    reserve0_eq?: InputMaybe<Scalars['BigInt']['input']>;
    reserve0_gt?: InputMaybe<Scalars['BigInt']['input']>;
    reserve0_gte?: InputMaybe<Scalars['BigInt']['input']>;
    reserve0_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    reserve0_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    reserve0_lt?: InputMaybe<Scalars['BigInt']['input']>;
    reserve0_lte?: InputMaybe<Scalars['BigInt']['input']>;
    reserve0_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    reserve0_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    reserve1_eq?: InputMaybe<Scalars['BigInt']['input']>;
    reserve1_gt?: InputMaybe<Scalars['BigInt']['input']>;
    reserve1_gte?: InputMaybe<Scalars['BigInt']['input']>;
    reserve1_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    reserve1_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    reserve1_lt?: InputMaybe<Scalars['BigInt']['input']>;
    reserve1_lte?: InputMaybe<Scalars['BigInt']['input']>;
    reserve1_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    reserve1_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    symbol_contains?: InputMaybe<Scalars['String']['input']>;
    symbol_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    symbol_endsWith?: InputMaybe<Scalars['String']['input']>;
    symbol_eq?: InputMaybe<Scalars['String']['input']>;
    symbol_gt?: InputMaybe<Scalars['String']['input']>;
    symbol_gte?: InputMaybe<Scalars['String']['input']>;
    symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
    symbol_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    symbol_lt?: InputMaybe<Scalars['String']['input']>;
    symbol_lte?: InputMaybe<Scalars['String']['input']>;
    symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
    symbol_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    symbol_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    symbol_not_eq?: InputMaybe<Scalars['String']['input']>;
    symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    symbol_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    symbol_startsWith?: InputMaybe<Scalars['String']['input']>;
    token0?: InputMaybe<TokenWhereInput>;
    token0_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    token1?: InputMaybe<TokenWhereInput>;
    token1_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    tokenLockedCount_eq?: InputMaybe<Scalars['Int']['input']>;
    tokenLockedCount_gt?: InputMaybe<Scalars['Int']['input']>;
    tokenLockedCount_gte?: InputMaybe<Scalars['Int']['input']>;
    tokenLockedCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    tokenLockedCount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    tokenLockedCount_lt?: InputMaybe<Scalars['Int']['input']>;
    tokenLockedCount_lte?: InputMaybe<Scalars['Int']['input']>;
    tokenLockedCount_not_eq?: InputMaybe<Scalars['Int']['input']>;
    tokenLockedCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    tokenLockedInUsd_eq?: InputMaybe<Scalars['Float']['input']>;
    tokenLockedInUsd_gt?: InputMaybe<Scalars['Float']['input']>;
    tokenLockedInUsd_gte?: InputMaybe<Scalars['Float']['input']>;
    tokenLockedInUsd_in?: InputMaybe<Array<Scalars['Float']['input']>>;
    tokenLockedInUsd_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    tokenLockedInUsd_lt?: InputMaybe<Scalars['Float']['input']>;
    tokenLockedInUsd_lte?: InputMaybe<Scalars['Float']['input']>;
    tokenLockedInUsd_not_eq?: InputMaybe<Scalars['Float']['input']>;
    tokenLockedInUsd_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
    tokenLocked_eq?: InputMaybe<Scalars['Float']['input']>;
    tokenLocked_gt?: InputMaybe<Scalars['Float']['input']>;
    tokenLocked_gte?: InputMaybe<Scalars['Float']['input']>;
    tokenLocked_in?: InputMaybe<Array<Scalars['Float']['input']>>;
    tokenLocked_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    tokenLocked_lt?: InputMaybe<Scalars['Float']['input']>;
    tokenLocked_lte?: InputMaybe<Scalars['Float']['input']>;
    tokenLocked_not_eq?: InputMaybe<Scalars['Float']['input']>;
    tokenLocked_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
    totalSupply_eq?: InputMaybe<Scalars['BigInt']['input']>;
    totalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
    totalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
    totalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    totalSupply_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    totalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
    totalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
    totalSupply_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    usdPrice_eq?: InputMaybe<Scalars['Float']['input']>;
    usdPrice_gt?: InputMaybe<Scalars['Float']['input']>;
    usdPrice_gte?: InputMaybe<Scalars['Float']['input']>;
    usdPrice_in?: InputMaybe<Array<Scalars['Float']['input']>>;
    usdPrice_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    usdPrice_lt?: InputMaybe<Scalars['Float']['input']>;
    usdPrice_lte?: InputMaybe<Scalars['Float']['input']>;
    usdPrice_not_eq?: InputMaybe<Scalars['Float']['input']>;
    usdPrice_not_in?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type TokensConnection = {
    __typename?: 'TokensConnection';
    edges: Array<TokenEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type Transaction = BaseEntity & {
    __typename?: 'Transaction';
    blockNumber: Scalars['Int']['output'];
    chainId: Scalars['Int']['output'];
    createdAt: Scalars['DateTime']['output'];
    from?: Maybe<Scalars['String']['output']>;
    gas: Scalars['BigInt']['output'];
    gasPrice: Scalars['BigInt']['output'];
    hash: Scalars['String']['output'];
    id: Scalars['String']['output'];
    index: Scalars['Int']['output'];
    lock?: Maybe<Lock>;
    to?: Maybe<Scalars['String']['output']>;
    updatedAt?: Maybe<Scalars['DateTime']['output']>;
    value: Scalars['BigInt']['output'];
    vesting?: Maybe<Vesting>;
};

export type TransactionEdge = {
    __typename?: 'TransactionEdge';
    cursor: Scalars['String']['output'];
    node: Transaction;
};

export enum TransactionOrderByInput {
    BlockNumberAsc = 'blockNumber_ASC',
    BlockNumberAscNullsFirst = 'blockNumber_ASC_NULLS_FIRST',
    BlockNumberDesc = 'blockNumber_DESC',
    BlockNumberDescNullsLast = 'blockNumber_DESC_NULLS_LAST',
    ChainIdAsc = 'chainId_ASC',
    ChainIdAscNullsFirst = 'chainId_ASC_NULLS_FIRST',
    ChainIdDesc = 'chainId_DESC',
    ChainIdDescNullsLast = 'chainId_DESC_NULLS_LAST',
    CreatedAtAsc = 'createdAt_ASC',
    CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
    CreatedAtDesc = 'createdAt_DESC',
    CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
    FromAsc = 'from_ASC',
    FromAscNullsFirst = 'from_ASC_NULLS_FIRST',
    FromDesc = 'from_DESC',
    FromDescNullsLast = 'from_DESC_NULLS_LAST',
    GasPriceAsc = 'gasPrice_ASC',
    GasPriceAscNullsFirst = 'gasPrice_ASC_NULLS_FIRST',
    GasPriceDesc = 'gasPrice_DESC',
    GasPriceDescNullsLast = 'gasPrice_DESC_NULLS_LAST',
    GasAsc = 'gas_ASC',
    GasAscNullsFirst = 'gas_ASC_NULLS_FIRST',
    GasDesc = 'gas_DESC',
    GasDescNullsLast = 'gas_DESC_NULLS_LAST',
    HashAsc = 'hash_ASC',
    HashAscNullsFirst = 'hash_ASC_NULLS_FIRST',
    HashDesc = 'hash_DESC',
    HashDescNullsLast = 'hash_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    IndexAsc = 'index_ASC',
    IndexAscNullsFirst = 'index_ASC_NULLS_FIRST',
    IndexDesc = 'index_DESC',
    IndexDescNullsLast = 'index_DESC_NULLS_LAST',
    LockAmountAsc = 'lock_amount_ASC',
    LockAmountAscNullsFirst = 'lock_amount_ASC_NULLS_FIRST',
    LockAmountDesc = 'lock_amount_DESC',
    LockAmountDescNullsLast = 'lock_amount_DESC_NULLS_LAST',
    LockChainIdAsc = 'lock_chainId_ASC',
    LockChainIdAscNullsFirst = 'lock_chainId_ASC_NULLS_FIRST',
    LockChainIdDesc = 'lock_chainId_DESC',
    LockChainIdDescNullsLast = 'lock_chainId_DESC_NULLS_LAST',
    LockCreatedAtAsc = 'lock_createdAt_ASC',
    LockCreatedAtAscNullsFirst = 'lock_createdAt_ASC_NULLS_FIRST',
    LockCreatedAtDesc = 'lock_createdAt_DESC',
    LockCreatedAtDescNullsLast = 'lock_createdAt_DESC_NULLS_LAST',
    LockCycleShareAsc = 'lock_cycleShare_ASC',
    LockCycleShareAscNullsFirst = 'lock_cycleShare_ASC_NULLS_FIRST',
    LockCycleShareDesc = 'lock_cycleShare_DESC',
    LockCycleShareDescNullsLast = 'lock_cycleShare_DESC_NULLS_LAST',
    LockDepositDateAsc = 'lock_depositDate_ASC',
    LockDepositDateAscNullsFirst = 'lock_depositDate_ASC_NULLS_FIRST',
    LockDepositDateDesc = 'lock_depositDate_DESC',
    LockDepositDateDescNullsLast = 'lock_depositDate_DESC_NULLS_LAST',
    LockIdAsc = 'lock_id_ASC',
    LockIdAscNullsFirst = 'lock_id_ASC_NULLS_FIRST',
    LockIdDesc = 'lock_id_DESC',
    LockIdDescNullsLast = 'lock_id_DESC_NULLS_LAST',
    LockIntervalAsc = 'lock_interval_ASC',
    LockIntervalAscNullsFirst = 'lock_interval_ASC_NULLS_FIRST',
    LockIntervalDesc = 'lock_interval_DESC',
    LockIntervalDescNullsLast = 'lock_interval_DESC_NULLS_LAST',
    LockStatusAsc = 'lock_status_ASC',
    LockStatusAscNullsFirst = 'lock_status_ASC_NULLS_FIRST',
    LockStatusDesc = 'lock_status_DESC',
    LockStatusDescNullsLast = 'lock_status_DESC_NULLS_LAST',
    LockTgeAsc = 'lock_tge_ASC',
    LockTgeAscNullsFirst = 'lock_tge_ASC_NULLS_FIRST',
    LockTgeDesc = 'lock_tge_DESC',
    LockTgeDescNullsLast = 'lock_tge_DESC_NULLS_LAST',
    LockTitleAsc = 'lock_title_ASC',
    LockTitleAscNullsFirst = 'lock_title_ASC_NULLS_FIRST',
    LockTitleDesc = 'lock_title_DESC',
    LockTitleDescNullsLast = 'lock_title_DESC_NULLS_LAST',
    LockUnlockDateAsc = 'lock_unlockDate_ASC',
    LockUnlockDateAscNullsFirst = 'lock_unlockDate_ASC_NULLS_FIRST',
    LockUnlockDateDesc = 'lock_unlockDate_DESC',
    LockUnlockDateDescNullsLast = 'lock_unlockDate_DESC_NULLS_LAST',
    LockUnlockedAmountAsc = 'lock_unlockedAmount_ASC',
    LockUnlockedAmountAscNullsFirst = 'lock_unlockedAmount_ASC_NULLS_FIRST',
    LockUnlockedAmountDesc = 'lock_unlockedAmount_DESC',
    LockUnlockedAmountDescNullsLast = 'lock_unlockedAmount_DESC_NULLS_LAST',
    LockUpdatedAtAsc = 'lock_updatedAt_ASC',
    LockUpdatedAtAscNullsFirst = 'lock_updatedAt_ASC_NULLS_FIRST',
    LockUpdatedAtDesc = 'lock_updatedAt_DESC',
    LockUpdatedAtDescNullsLast = 'lock_updatedAt_DESC_NULLS_LAST',
    ToAsc = 'to_ASC',
    ToAscNullsFirst = 'to_ASC_NULLS_FIRST',
    ToDesc = 'to_DESC',
    ToDescNullsLast = 'to_DESC_NULLS_LAST',
    UpdatedAtAsc = 'updatedAt_ASC',
    UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
    UpdatedAtDesc = 'updatedAt_DESC',
    UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
    ValueAsc = 'value_ASC',
    ValueAscNullsFirst = 'value_ASC_NULLS_FIRST',
    ValueDesc = 'value_DESC',
    ValueDescNullsLast = 'value_DESC_NULLS_LAST',
    VestingChainIdAsc = 'vesting_chainId_ASC',
    VestingChainIdAscNullsFirst = 'vesting_chainId_ASC_NULLS_FIRST',
    VestingChainIdDesc = 'vesting_chainId_DESC',
    VestingChainIdDescNullsLast = 'vesting_chainId_DESC_NULLS_LAST',
    VestingCreatedAtAsc = 'vesting_createdAt_ASC',
    VestingCreatedAtAscNullsFirst = 'vesting_createdAt_ASC_NULLS_FIRST',
    VestingCreatedAtDesc = 'vesting_createdAt_DESC',
    VestingCreatedAtDescNullsLast = 'vesting_createdAt_DESC_NULLS_LAST',
    VestingDataUriAsc = 'vesting_dataUri_ASC',
    VestingDataUriAscNullsFirst = 'vesting_dataUri_ASC_NULLS_FIRST',
    VestingDataUriDesc = 'vesting_dataUri_DESC',
    VestingDataUriDescNullsLast = 'vesting_dataUri_DESC_NULLS_LAST',
    VestingIdAsc = 'vesting_id_ASC',
    VestingIdAscNullsFirst = 'vesting_id_ASC_NULLS_FIRST',
    VestingIdDesc = 'vesting_id_DESC',
    VestingIdDescNullsLast = 'vesting_id_DESC_NULLS_LAST',
    VestingMerkleRootAsc = 'vesting_merkleRoot_ASC',
    VestingMerkleRootAscNullsFirst = 'vesting_merkleRoot_ASC_NULLS_FIRST',
    VestingMerkleRootDesc = 'vesting_merkleRoot_DESC',
    VestingMerkleRootDescNullsLast = 'vesting_merkleRoot_DESC_NULLS_LAST',
    VestingTotalAmountAsc = 'vesting_totalAmount_ASC',
    VestingTotalAmountAscNullsFirst = 'vesting_totalAmount_ASC_NULLS_FIRST',
    VestingTotalAmountDesc = 'vesting_totalAmount_DESC',
    VestingTotalAmountDescNullsLast = 'vesting_totalAmount_DESC_NULLS_LAST',
    VestingUpdatedAtAsc = 'vesting_updatedAt_ASC',
    VestingUpdatedAtAscNullsFirst = 'vesting_updatedAt_ASC_NULLS_FIRST',
    VestingUpdatedAtDesc = 'vesting_updatedAt_DESC',
    VestingUpdatedAtDescNullsLast = 'vesting_updatedAt_DESC_NULLS_LAST',
}

export type TransactionWhereInput = {
    AND?: InputMaybe<Array<TransactionWhereInput>>;
    OR?: InputMaybe<Array<TransactionWhereInput>>;
    blockNumber_eq?: InputMaybe<Scalars['Int']['input']>;
    blockNumber_gt?: InputMaybe<Scalars['Int']['input']>;
    blockNumber_gte?: InputMaybe<Scalars['Int']['input']>;
    blockNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    blockNumber_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    blockNumber_lt?: InputMaybe<Scalars['Int']['input']>;
    blockNumber_lte?: InputMaybe<Scalars['Int']['input']>;
    blockNumber_not_eq?: InputMaybe<Scalars['Int']['input']>;
    blockNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    chainId_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_gt?: InputMaybe<Scalars['Int']['input']>;
    chainId_gte?: InputMaybe<Scalars['Int']['input']>;
    chainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    chainId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    chainId_lt?: InputMaybe<Scalars['Int']['input']>;
    chainId_lte?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    from_contains?: InputMaybe<Scalars['String']['input']>;
    from_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    from_endsWith?: InputMaybe<Scalars['String']['input']>;
    from_eq?: InputMaybe<Scalars['String']['input']>;
    from_gt?: InputMaybe<Scalars['String']['input']>;
    from_gte?: InputMaybe<Scalars['String']['input']>;
    from_in?: InputMaybe<Array<Scalars['String']['input']>>;
    from_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    from_lt?: InputMaybe<Scalars['String']['input']>;
    from_lte?: InputMaybe<Scalars['String']['input']>;
    from_not_contains?: InputMaybe<Scalars['String']['input']>;
    from_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    from_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    from_not_eq?: InputMaybe<Scalars['String']['input']>;
    from_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    from_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    from_startsWith?: InputMaybe<Scalars['String']['input']>;
    gasPrice_eq?: InputMaybe<Scalars['BigInt']['input']>;
    gasPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
    gasPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
    gasPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    gasPrice_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    gasPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
    gasPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
    gasPrice_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    gasPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    gas_eq?: InputMaybe<Scalars['BigInt']['input']>;
    gas_gt?: InputMaybe<Scalars['BigInt']['input']>;
    gas_gte?: InputMaybe<Scalars['BigInt']['input']>;
    gas_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    gas_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    gas_lt?: InputMaybe<Scalars['BigInt']['input']>;
    gas_lte?: InputMaybe<Scalars['BigInt']['input']>;
    gas_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    gas_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    hash_contains?: InputMaybe<Scalars['String']['input']>;
    hash_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    hash_endsWith?: InputMaybe<Scalars['String']['input']>;
    hash_eq?: InputMaybe<Scalars['String']['input']>;
    hash_gt?: InputMaybe<Scalars['String']['input']>;
    hash_gte?: InputMaybe<Scalars['String']['input']>;
    hash_in?: InputMaybe<Array<Scalars['String']['input']>>;
    hash_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    hash_lt?: InputMaybe<Scalars['String']['input']>;
    hash_lte?: InputMaybe<Scalars['String']['input']>;
    hash_not_contains?: InputMaybe<Scalars['String']['input']>;
    hash_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    hash_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    hash_not_eq?: InputMaybe<Scalars['String']['input']>;
    hash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    hash_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    hash_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    index_eq?: InputMaybe<Scalars['Int']['input']>;
    index_gt?: InputMaybe<Scalars['Int']['input']>;
    index_gte?: InputMaybe<Scalars['Int']['input']>;
    index_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    index_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    index_lt?: InputMaybe<Scalars['Int']['input']>;
    index_lte?: InputMaybe<Scalars['Int']['input']>;
    index_not_eq?: InputMaybe<Scalars['Int']['input']>;
    index_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    lock?: InputMaybe<LockWhereInput>;
    lock_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    to_contains?: InputMaybe<Scalars['String']['input']>;
    to_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    to_endsWith?: InputMaybe<Scalars['String']['input']>;
    to_eq?: InputMaybe<Scalars['String']['input']>;
    to_gt?: InputMaybe<Scalars['String']['input']>;
    to_gte?: InputMaybe<Scalars['String']['input']>;
    to_in?: InputMaybe<Array<Scalars['String']['input']>>;
    to_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    to_lt?: InputMaybe<Scalars['String']['input']>;
    to_lte?: InputMaybe<Scalars['String']['input']>;
    to_not_contains?: InputMaybe<Scalars['String']['input']>;
    to_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    to_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    to_not_eq?: InputMaybe<Scalars['String']['input']>;
    to_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    to_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    to_startsWith?: InputMaybe<Scalars['String']['input']>;
    updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    value_eq?: InputMaybe<Scalars['BigInt']['input']>;
    value_gt?: InputMaybe<Scalars['BigInt']['input']>;
    value_gte?: InputMaybe<Scalars['BigInt']['input']>;
    value_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    value_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    value_lt?: InputMaybe<Scalars['BigInt']['input']>;
    value_lte?: InputMaybe<Scalars['BigInt']['input']>;
    value_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    value_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    vesting?: InputMaybe<VestingWhereInput>;
    vesting_isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TransactionsConnection = {
    __typename?: 'TransactionsConnection';
    edges: Array<TransactionEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type User = BaseEntity & {
    __typename?: 'User';
    chainId: Scalars['Int']['output'];
    createdAt: Scalars['DateTime']['output'];
    id: Scalars['String']['output'];
    locks: Array<Lock>;
    updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type UserLocksArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<LockOrderByInput>>;
    where?: InputMaybe<LockWhereInput>;
};

export type UserEdge = {
    __typename?: 'UserEdge';
    cursor: Scalars['String']['output'];
    node: User;
};

export enum UserOrderByInput {
    ChainIdAsc = 'chainId_ASC',
    ChainIdAscNullsFirst = 'chainId_ASC_NULLS_FIRST',
    ChainIdDesc = 'chainId_DESC',
    ChainIdDescNullsLast = 'chainId_DESC_NULLS_LAST',
    CreatedAtAsc = 'createdAt_ASC',
    CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
    CreatedAtDesc = 'createdAt_DESC',
    CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    UpdatedAtAsc = 'updatedAt_ASC',
    UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
    UpdatedAtDesc = 'updatedAt_DESC',
    UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
}

export type UserWhereInput = {
    AND?: InputMaybe<Array<UserWhereInput>>;
    OR?: InputMaybe<Array<UserWhereInput>>;
    chainId_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_gt?: InputMaybe<Scalars['Int']['input']>;
    chainId_gte?: InputMaybe<Scalars['Int']['input']>;
    chainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    chainId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    chainId_lt?: InputMaybe<Scalars['Int']['input']>;
    chainId_lte?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    locks_every?: InputMaybe<LockWhereInput>;
    locks_none?: InputMaybe<LockWhereInput>;
    locks_some?: InputMaybe<LockWhereInput>;
    updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type UsersConnection = {
    __typename?: 'UsersConnection';
    edges: Array<UserEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type Vesting = BaseEntity & {
    __typename?: 'Vesting';
    chainId: Scalars['Int']['output'];
    claimers: Array<Claimer>;
    createdAt: Scalars['DateTime']['output'];
    creator: User;
    dataUri: Scalars['String']['output'];
    id: Scalars['String']['output'];
    merkleRoot: Scalars['String']['output'];
    token: Token;
    totalAmount: Scalars['BigInt']['output'];
    transactions: Array<Transaction>;
    updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type VestingClaimersArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<ClaimerOrderByInput>>;
    where?: InputMaybe<ClaimerWhereInput>;
};

export type VestingTransactionsArgs = {
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<TransactionOrderByInput>>;
    where?: InputMaybe<TransactionWhereInput>;
};

export type VestingDetails = {
    __typename?: 'VestingDetails';
    cycleInterval: Scalars['BigInt']['output'];
    cyclePercent: Scalars['BigInt']['output'];
    id: Scalars['String']['output'];
    isVestingEnable: Scalars['Boolean']['output'];
    tgePercent: Scalars['BigInt']['output'];
};

export type VestingDetailsConnection = {
    __typename?: 'VestingDetailsConnection';
    edges: Array<VestingDetailsEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type VestingDetailsEdge = {
    __typename?: 'VestingDetailsEdge';
    cursor: Scalars['String']['output'];
    node: VestingDetails;
};

export enum VestingDetailsOrderByInput {
    CycleIntervalAsc = 'cycleInterval_ASC',
    CycleIntervalAscNullsFirst = 'cycleInterval_ASC_NULLS_FIRST',
    CycleIntervalDesc = 'cycleInterval_DESC',
    CycleIntervalDescNullsLast = 'cycleInterval_DESC_NULLS_LAST',
    CyclePercentAsc = 'cyclePercent_ASC',
    CyclePercentAscNullsFirst = 'cyclePercent_ASC_NULLS_FIRST',
    CyclePercentDesc = 'cyclePercent_DESC',
    CyclePercentDescNullsLast = 'cyclePercent_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    IsVestingEnableAsc = 'isVestingEnable_ASC',
    IsVestingEnableAscNullsFirst = 'isVestingEnable_ASC_NULLS_FIRST',
    IsVestingEnableDesc = 'isVestingEnable_DESC',
    IsVestingEnableDescNullsLast = 'isVestingEnable_DESC_NULLS_LAST',
    TgePercentAsc = 'tgePercent_ASC',
    TgePercentAscNullsFirst = 'tgePercent_ASC_NULLS_FIRST',
    TgePercentDesc = 'tgePercent_DESC',
    TgePercentDescNullsLast = 'tgePercent_DESC_NULLS_LAST',
}

export type VestingDetailsWhereInput = {
    AND?: InputMaybe<Array<VestingDetailsWhereInput>>;
    OR?: InputMaybe<Array<VestingDetailsWhereInput>>;
    cycleInterval_eq?: InputMaybe<Scalars['BigInt']['input']>;
    cycleInterval_gt?: InputMaybe<Scalars['BigInt']['input']>;
    cycleInterval_gte?: InputMaybe<Scalars['BigInt']['input']>;
    cycleInterval_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    cycleInterval_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    cycleInterval_lt?: InputMaybe<Scalars['BigInt']['input']>;
    cycleInterval_lte?: InputMaybe<Scalars['BigInt']['input']>;
    cycleInterval_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    cycleInterval_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    cyclePercent_eq?: InputMaybe<Scalars['BigInt']['input']>;
    cyclePercent_gt?: InputMaybe<Scalars['BigInt']['input']>;
    cyclePercent_gte?: InputMaybe<Scalars['BigInt']['input']>;
    cyclePercent_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    cyclePercent_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    cyclePercent_lt?: InputMaybe<Scalars['BigInt']['input']>;
    cyclePercent_lte?: InputMaybe<Scalars['BigInt']['input']>;
    cyclePercent_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    cyclePercent_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    isVestingEnable_eq?: InputMaybe<Scalars['Boolean']['input']>;
    isVestingEnable_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    isVestingEnable_not_eq?: InputMaybe<Scalars['Boolean']['input']>;
    tgePercent_eq?: InputMaybe<Scalars['BigInt']['input']>;
    tgePercent_gt?: InputMaybe<Scalars['BigInt']['input']>;
    tgePercent_gte?: InputMaybe<Scalars['BigInt']['input']>;
    tgePercent_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    tgePercent_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    tgePercent_lt?: InputMaybe<Scalars['BigInt']['input']>;
    tgePercent_lte?: InputMaybe<Scalars['BigInt']['input']>;
    tgePercent_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    tgePercent_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type VestingEdge = {
    __typename?: 'VestingEdge';
    cursor: Scalars['String']['output'];
    node: Vesting;
};

export enum VestingOrderByInput {
    ChainIdAsc = 'chainId_ASC',
    ChainIdAscNullsFirst = 'chainId_ASC_NULLS_FIRST',
    ChainIdDesc = 'chainId_DESC',
    ChainIdDescNullsLast = 'chainId_DESC_NULLS_LAST',
    CreatedAtAsc = 'createdAt_ASC',
    CreatedAtAscNullsFirst = 'createdAt_ASC_NULLS_FIRST',
    CreatedAtDesc = 'createdAt_DESC',
    CreatedAtDescNullsLast = 'createdAt_DESC_NULLS_LAST',
    CreatorChainIdAsc = 'creator_chainId_ASC',
    CreatorChainIdAscNullsFirst = 'creator_chainId_ASC_NULLS_FIRST',
    CreatorChainIdDesc = 'creator_chainId_DESC',
    CreatorChainIdDescNullsLast = 'creator_chainId_DESC_NULLS_LAST',
    CreatorCreatedAtAsc = 'creator_createdAt_ASC',
    CreatorCreatedAtAscNullsFirst = 'creator_createdAt_ASC_NULLS_FIRST',
    CreatorCreatedAtDesc = 'creator_createdAt_DESC',
    CreatorCreatedAtDescNullsLast = 'creator_createdAt_DESC_NULLS_LAST',
    CreatorIdAsc = 'creator_id_ASC',
    CreatorIdAscNullsFirst = 'creator_id_ASC_NULLS_FIRST',
    CreatorIdDesc = 'creator_id_DESC',
    CreatorIdDescNullsLast = 'creator_id_DESC_NULLS_LAST',
    CreatorUpdatedAtAsc = 'creator_updatedAt_ASC',
    CreatorUpdatedAtAscNullsFirst = 'creator_updatedAt_ASC_NULLS_FIRST',
    CreatorUpdatedAtDesc = 'creator_updatedAt_DESC',
    CreatorUpdatedAtDescNullsLast = 'creator_updatedAt_DESC_NULLS_LAST',
    DataUriAsc = 'dataUri_ASC',
    DataUriAscNullsFirst = 'dataUri_ASC_NULLS_FIRST',
    DataUriDesc = 'dataUri_DESC',
    DataUriDescNullsLast = 'dataUri_DESC_NULLS_LAST',
    IdAsc = 'id_ASC',
    IdAscNullsFirst = 'id_ASC_NULLS_FIRST',
    IdDesc = 'id_DESC',
    IdDescNullsLast = 'id_DESC_NULLS_LAST',
    MerkleRootAsc = 'merkleRoot_ASC',
    MerkleRootAscNullsFirst = 'merkleRoot_ASC_NULLS_FIRST',
    MerkleRootDesc = 'merkleRoot_DESC',
    MerkleRootDescNullsLast = 'merkleRoot_DESC_NULLS_LAST',
    TokenChainIdAsc = 'token_chainId_ASC',
    TokenChainIdAscNullsFirst = 'token_chainId_ASC_NULLS_FIRST',
    TokenChainIdDesc = 'token_chainId_DESC',
    TokenChainIdDescNullsLast = 'token_chainId_DESC_NULLS_LAST',
    TokenCreatedAtAsc = 'token_createdAt_ASC',
    TokenCreatedAtAscNullsFirst = 'token_createdAt_ASC_NULLS_FIRST',
    TokenCreatedAtDesc = 'token_createdAt_DESC',
    TokenCreatedAtDescNullsLast = 'token_createdAt_DESC_NULLS_LAST',
    TokenDecimalsAsc = 'token_decimals_ASC',
    TokenDecimalsAscNullsFirst = 'token_decimals_ASC_NULLS_FIRST',
    TokenDecimalsDesc = 'token_decimals_DESC',
    TokenDecimalsDescNullsLast = 'token_decimals_DESC_NULLS_LAST',
    TokenIdAsc = 'token_id_ASC',
    TokenIdAscNullsFirst = 'token_id_ASC_NULLS_FIRST',
    TokenIdDesc = 'token_id_DESC',
    TokenIdDescNullsLast = 'token_id_DESC_NULLS_LAST',
    TokenImageAsc = 'token_image_ASC',
    TokenImageAscNullsFirst = 'token_image_ASC_NULLS_FIRST',
    TokenImageDesc = 'token_image_DESC',
    TokenImageDescNullsLast = 'token_image_DESC_NULLS_LAST',
    TokenIsLiquidityTokenAsc = 'token_isLiquidityToken_ASC',
    TokenIsLiquidityTokenAscNullsFirst = 'token_isLiquidityToken_ASC_NULLS_FIRST',
    TokenIsLiquidityTokenDesc = 'token_isLiquidityToken_DESC',
    TokenIsLiquidityTokenDescNullsLast = 'token_isLiquidityToken_DESC_NULLS_LAST',
    TokenNameAsc = 'token_name_ASC',
    TokenNameAscNullsFirst = 'token_name_ASC_NULLS_FIRST',
    TokenNameDesc = 'token_name_DESC',
    TokenNameDescNullsLast = 'token_name_DESC_NULLS_LAST',
    TokenNextUnlockAsc = 'token_nextUnlock_ASC',
    TokenNextUnlockAscNullsFirst = 'token_nextUnlock_ASC_NULLS_FIRST',
    TokenNextUnlockDesc = 'token_nextUnlock_DESC',
    TokenNextUnlockDescNullsLast = 'token_nextUnlock_DESC_NULLS_LAST',
    TokenReserve0Asc = 'token_reserve0_ASC',
    TokenReserve0AscNullsFirst = 'token_reserve0_ASC_NULLS_FIRST',
    TokenReserve0Desc = 'token_reserve0_DESC',
    TokenReserve0DescNullsLast = 'token_reserve0_DESC_NULLS_LAST',
    TokenReserve1Asc = 'token_reserve1_ASC',
    TokenReserve1AscNullsFirst = 'token_reserve1_ASC_NULLS_FIRST',
    TokenReserve1Desc = 'token_reserve1_DESC',
    TokenReserve1DescNullsLast = 'token_reserve1_DESC_NULLS_LAST',
    TokenSymbolAsc = 'token_symbol_ASC',
    TokenSymbolAscNullsFirst = 'token_symbol_ASC_NULLS_FIRST',
    TokenSymbolDesc = 'token_symbol_DESC',
    TokenSymbolDescNullsLast = 'token_symbol_DESC_NULLS_LAST',
    TokenTokenLockedCountAsc = 'token_tokenLockedCount_ASC',
    TokenTokenLockedCountAscNullsFirst = 'token_tokenLockedCount_ASC_NULLS_FIRST',
    TokenTokenLockedCountDesc = 'token_tokenLockedCount_DESC',
    TokenTokenLockedCountDescNullsLast = 'token_tokenLockedCount_DESC_NULLS_LAST',
    TokenTokenLockedInUsdAsc = 'token_tokenLockedInUsd_ASC',
    TokenTokenLockedInUsdAscNullsFirst = 'token_tokenLockedInUsd_ASC_NULLS_FIRST',
    TokenTokenLockedInUsdDesc = 'token_tokenLockedInUsd_DESC',
    TokenTokenLockedInUsdDescNullsLast = 'token_tokenLockedInUsd_DESC_NULLS_LAST',
    TokenTokenLockedAsc = 'token_tokenLocked_ASC',
    TokenTokenLockedAscNullsFirst = 'token_tokenLocked_ASC_NULLS_FIRST',
    TokenTokenLockedDesc = 'token_tokenLocked_DESC',
    TokenTokenLockedDescNullsLast = 'token_tokenLocked_DESC_NULLS_LAST',
    TokenTotalSupplyAsc = 'token_totalSupply_ASC',
    TokenTotalSupplyAscNullsFirst = 'token_totalSupply_ASC_NULLS_FIRST',
    TokenTotalSupplyDesc = 'token_totalSupply_DESC',
    TokenTotalSupplyDescNullsLast = 'token_totalSupply_DESC_NULLS_LAST',
    TokenUpdatedAtAsc = 'token_updatedAt_ASC',
    TokenUpdatedAtAscNullsFirst = 'token_updatedAt_ASC_NULLS_FIRST',
    TokenUpdatedAtDesc = 'token_updatedAt_DESC',
    TokenUpdatedAtDescNullsLast = 'token_updatedAt_DESC_NULLS_LAST',
    TokenUsdPriceAsc = 'token_usdPrice_ASC',
    TokenUsdPriceAscNullsFirst = 'token_usdPrice_ASC_NULLS_FIRST',
    TokenUsdPriceDesc = 'token_usdPrice_DESC',
    TokenUsdPriceDescNullsLast = 'token_usdPrice_DESC_NULLS_LAST',
    TotalAmountAsc = 'totalAmount_ASC',
    TotalAmountAscNullsFirst = 'totalAmount_ASC_NULLS_FIRST',
    TotalAmountDesc = 'totalAmount_DESC',
    TotalAmountDescNullsLast = 'totalAmount_DESC_NULLS_LAST',
    UpdatedAtAsc = 'updatedAt_ASC',
    UpdatedAtAscNullsFirst = 'updatedAt_ASC_NULLS_FIRST',
    UpdatedAtDesc = 'updatedAt_DESC',
    UpdatedAtDescNullsLast = 'updatedAt_DESC_NULLS_LAST',
}

export type VestingWhereInput = {
    AND?: InputMaybe<Array<VestingWhereInput>>;
    OR?: InputMaybe<Array<VestingWhereInput>>;
    chainId_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_gt?: InputMaybe<Scalars['Int']['input']>;
    chainId_gte?: InputMaybe<Scalars['Int']['input']>;
    chainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    chainId_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    chainId_lt?: InputMaybe<Scalars['Int']['input']>;
    chainId_lte?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_eq?: InputMaybe<Scalars['Int']['input']>;
    chainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
    claimers_every?: InputMaybe<ClaimerWhereInput>;
    claimers_none?: InputMaybe<ClaimerWhereInput>;
    claimers_some?: InputMaybe<ClaimerWhereInput>;
    createdAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    createdAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    createdAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    createdAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    creator?: InputMaybe<UserWhereInput>;
    creator_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    dataUri_contains?: InputMaybe<Scalars['String']['input']>;
    dataUri_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    dataUri_endsWith?: InputMaybe<Scalars['String']['input']>;
    dataUri_eq?: InputMaybe<Scalars['String']['input']>;
    dataUri_gt?: InputMaybe<Scalars['String']['input']>;
    dataUri_gte?: InputMaybe<Scalars['String']['input']>;
    dataUri_in?: InputMaybe<Array<Scalars['String']['input']>>;
    dataUri_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    dataUri_lt?: InputMaybe<Scalars['String']['input']>;
    dataUri_lte?: InputMaybe<Scalars['String']['input']>;
    dataUri_not_contains?: InputMaybe<Scalars['String']['input']>;
    dataUri_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    dataUri_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    dataUri_not_eq?: InputMaybe<Scalars['String']['input']>;
    dataUri_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    dataUri_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    dataUri_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_contains?: InputMaybe<Scalars['String']['input']>;
    id_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_eq?: InputMaybe<Scalars['String']['input']>;
    id_gt?: InputMaybe<Scalars['String']['input']>;
    id_gte?: InputMaybe<Scalars['String']['input']>;
    id_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    id_lt?: InputMaybe<Scalars['String']['input']>;
    id_lte?: InputMaybe<Scalars['String']['input']>;
    id_not_contains?: InputMaybe<Scalars['String']['input']>;
    id_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    id_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    id_not_eq?: InputMaybe<Scalars['String']['input']>;
    id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    id_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    id_startsWith?: InputMaybe<Scalars['String']['input']>;
    merkleRoot_contains?: InputMaybe<Scalars['String']['input']>;
    merkleRoot_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    merkleRoot_endsWith?: InputMaybe<Scalars['String']['input']>;
    merkleRoot_eq?: InputMaybe<Scalars['String']['input']>;
    merkleRoot_gt?: InputMaybe<Scalars['String']['input']>;
    merkleRoot_gte?: InputMaybe<Scalars['String']['input']>;
    merkleRoot_in?: InputMaybe<Array<Scalars['String']['input']>>;
    merkleRoot_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    merkleRoot_lt?: InputMaybe<Scalars['String']['input']>;
    merkleRoot_lte?: InputMaybe<Scalars['String']['input']>;
    merkleRoot_not_contains?: InputMaybe<Scalars['String']['input']>;
    merkleRoot_not_containsInsensitive?: InputMaybe<Scalars['String']['input']>;
    merkleRoot_not_endsWith?: InputMaybe<Scalars['String']['input']>;
    merkleRoot_not_eq?: InputMaybe<Scalars['String']['input']>;
    merkleRoot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
    merkleRoot_not_startsWith?: InputMaybe<Scalars['String']['input']>;
    merkleRoot_startsWith?: InputMaybe<Scalars['String']['input']>;
    token?: InputMaybe<TokenWhereInput>;
    token_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    totalAmount_eq?: InputMaybe<Scalars['BigInt']['input']>;
    totalAmount_gt?: InputMaybe<Scalars['BigInt']['input']>;
    totalAmount_gte?: InputMaybe<Scalars['BigInt']['input']>;
    totalAmount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    totalAmount_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    totalAmount_lt?: InputMaybe<Scalars['BigInt']['input']>;
    totalAmount_lte?: InputMaybe<Scalars['BigInt']['input']>;
    totalAmount_not_eq?: InputMaybe<Scalars['BigInt']['input']>;
    totalAmount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
    transactions_every?: InputMaybe<TransactionWhereInput>;
    transactions_none?: InputMaybe<TransactionWhereInput>;
    transactions_some?: InputMaybe<TransactionWhereInput>;
    updatedAt_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_gte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
    updatedAt_isNull?: InputMaybe<Scalars['Boolean']['input']>;
    updatedAt_lt?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_lte?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_eq?: InputMaybe<Scalars['DateTime']['input']>;
    updatedAt_not_in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type VestingsConnection = {
    __typename?: 'VestingsConnection';
    edges: Array<VestingEdge>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type WhereIdInput = {
    id: Scalars['String']['input'];
};

export type AddTitleToLockMutationVariables = Exact<{
    txHash: Scalars['String']['input'];
    title: Scalars['String']['input'];
}>;

export type AddTitleToLockMutation = { __typename?: 'Mutation'; addTitleToLock: boolean };

export type LiquidityLockRecordsQueryVariables = Exact<{
    tokenAddress: Scalars['String']['input'];
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<LockOrderByInput> | LockOrderByInput>;
}>;

export type LiquidityLockRecordsQuery = {
    __typename?: 'Query';
    locksConnection: {
        __typename?: 'LocksConnection';
        totalCount: number;
        edges: Array<{
            __typename?: 'LockEdge';
            node: {
                __typename?: 'Lock';
                id: string;
                tge?: bigint | null;
                interval?: bigint | null;
                cycleShare?: bigint | null;
                status: LockStatus;
                amount: bigint;
                unlockDate: string;
                owner: { __typename?: 'User'; id: string };
                token: {
                    __typename?: 'Token';
                    tokenLocked: number;
                    tokenLockedCount: number;
                    tokenLockedInUsd: number;
                    id: string;
                    name: string;
                    symbol?: string | null;
                    decimals: number;
                    token0?: { __typename?: 'Token'; symbol?: string | null } | null;
                    token1?: { __typename?: 'Token'; symbol?: string | null } | null;
                };
            };
        }>;
    };
};

export type LaunchpadDetailQueryVariables = Exact<{
    address?: InputMaybe<Scalars['String']['input']>;
}>;

export type LaunchpadDetailQuery = {
    __typename?: 'Query';
    launchPads: Array<{
        __typename?: 'LaunchPad';
        id: string;
        name: string;
        totalSaleAmount?: bigint | null;
        totalSellTokens?: bigint | null;
        updatedAt?: string | null;
        userHardCap?: bigint | null;
        affiliateReward?: bigint | null;
        chainId: number;
        contractAddress: string;
        createdAt: string;
        decreaseInterval?: bigint | null;
        endPrice?: bigint | null;
        endTime: bigint;
        finalizeTime?: bigint | null;
        hardCap?: bigint | null;
        investedAmount: bigint;
        investors: Array<string | null>;
        isAffiliate?: boolean | null;
        isAutoListing?: boolean | null;
        listingRate?: bigint | null;
        isMaxLimit?: boolean | null;
        liquidityAdded?: bigint | null;
        listingPrice?: bigint | null;
        lockTime?: bigint | null;
        locker?: string | null;
        maxBuyLimit?: bigint | null;
        minBuyLimit?: bigint | null;
        publicSaleTime?: bigint | null;
        router?: string | null;
        sellPrice?: bigint | null;
        sellRate?: bigint | null;
        softCap: bigint;
        startPrice?: bigint | null;
        startTime: bigint;
        fundToken: {
            __typename?: 'FundToken';
            decimals: number;
            id: string;
            symbol: string;
            name: string;
            isNative: boolean;
        };
        liquidityDetails?: {
            __typename?: 'LiquidityDetails';
            id: string;
            liquidityAdded: bigint;
            liquidityPercent: bigint;
            lockTime: bigint;
            locker: string;
            router: string;
        } | null;
        metadata?: {
            __typename?: 'LaunchpadTemp';
            audit?: string | null;
            contractAddress?: string | null;
            id: string;
            kyc?: string | null;
            socials: {
                __typename?: 'Socials';
                description?: string | null;
                facebookUrl?: string | null;
                githubUrl?: string | null;
                logoUrl: string;
                redditUrl?: string | null;
                telegramUrl?: string | null;
                twitterUrl?: string | null;
                webUrl: string;
                youtubeUrl?: string | null;
            };
        } | null;
        owner: { __typename?: 'User'; id: string };
        token: {
            __typename?: 'Token';
            id: string;
            chainId: number;
            decimals: number;
            name: string;
            symbol?: string | null;
            totalSupply: bigint;
        };
        vestingDetails?: {
            __typename?: 'VestingDetails';
            cycleInterval: bigint;
            cyclePercent: bigint;
            id: string;
            isVestingEnable: boolean;
            tgePercent: bigint;
        } | null;
    }>;
};

export type GetAllLaunchpadsAdminQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']['input']>;
    after?: InputMaybe<Scalars['String']['input']>;
    orderBy: Array<LaunchPadOrderByInput> | LaunchPadOrderByInput;
    searchTerm?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetAllLaunchpadsAdminQuery = {
    __typename?: 'Query';
    launchPadsConnection: {
        __typename?: 'LaunchPadsConnection';
        totalCount: number;
        edges: Array<{
            __typename?: 'LaunchPadEdge';
            node: {
                __typename?: 'LaunchPad';
                id: string;
                endTime: bigint;
                hardCap?: bigint | null;
                finalizeTime?: bigint | null;
                contractAddress: string;
                isAffiliate?: boolean | null;
                isAutoListing?: boolean | null;
                liquidityAdded?: bigint | null;
                liquidityPercent?: bigint | null;
                listingPrice?: bigint | null;
                lockTime?: bigint | null;
                locker?: string | null;
                minBuyLimit?: bigint | null;
                name: string;
                publicSaleTime?: bigint | null;
                sellPrice?: bigint | null;
                router?: string | null;
                softCap: bigint;
                startTime: bigint;
                maxBuyLimit?: bigint | null;
                vestingDetails?: {
                    __typename?: 'VestingDetails';
                    cycleInterval: bigint;
                    cyclePercent: bigint;
                    id: string;
                    isVestingEnable: boolean;
                    tgePercent: bigint;
                } | null;
                token: {
                    __typename?: 'Token';
                    totalSupply: bigint;
                    symbol?: string | null;
                    name: string;
                    id: string;
                    decimals: number;
                };
                owner: { __typename?: 'User'; id: string };
                metadata?: {
                    __typename?: 'LaunchpadTemp';
                    kyc?: string | null;
                    audit?: string | null;
                    socials: {
                        __typename?: 'Socials';
                        telegramUrl?: string | null;
                        description?: string | null;
                        facebookUrl?: string | null;
                        githubUrl?: string | null;
                        logoUrl: string;
                        redditUrl?: string | null;
                        twitterUrl?: string | null;
                        webUrl: string;
                        youtubeUrl?: string | null;
                    };
                } | null;
            };
        }>;
        pageInfo: { __typename?: 'PageInfo'; endCursor: string; hasNextPage: boolean };
    };
};

export type AddKycAuditToLaunchpadMutationVariables = Exact<{
    contractAddress: Scalars['String']['input'];
    kyc: Scalars['String']['input'];
    audit: Scalars['String']['input'];
}>;

export type AddKycAuditToLaunchpadMutation = {
    __typename?: 'Mutation';
    addKycAuditToLaunchpad: boolean;
};

export type GetWhiteBlackListQueryVariables = Exact<{
    id?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetWhiteBlackListQuery = {
    __typename?: 'Query';
    antibots: Array<{
        __typename?: 'Antibot';
        id: string;
        blacklist?: Array<string | null> | null;
        whitelist?: Array<string | null> | null;
    }>;
};

export type AddMetadataToAirdropMutationVariables = Exact<{
    txHash: Scalars['String']['input'];
    logoUrl: Scalars['String']['input'];
    webUrl: Scalars['String']['input'];
    facebookUrl?: InputMaybe<Scalars['String']['input']>;
    twitterUrl?: InputMaybe<Scalars['String']['input']>;
    githubUrl?: InputMaybe<Scalars['String']['input']>;
    telegramUrl?: InputMaybe<Scalars['String']['input']>;
    redditUrl?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl?: InputMaybe<Scalars['String']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
}>;

export type AddMetadataToAirdropMutation = {
    __typename?: 'Mutation';
    addMetadataToAirdrop: boolean;
};

export type EditAirdropMetadataMutationVariables = Exact<{
    contractAddress: Scalars['String']['input'];
    logoUrl: Scalars['String']['input'];
    webUrl: Scalars['String']['input'];
    facebookUrl?: InputMaybe<Scalars['String']['input']>;
    twitterUrl?: InputMaybe<Scalars['String']['input']>;
    githubUrl?: InputMaybe<Scalars['String']['input']>;
    telegramUrl?: InputMaybe<Scalars['String']['input']>;
    redditUrl?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl?: InputMaybe<Scalars['String']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
}>;

export type EditAirdropMetadataMutation = { __typename?: 'Mutation'; editAirdropMetadata: boolean };

export type EditAirdropQueryVariables = Exact<{
    contractAddress: Scalars['String']['input'];
}>;

export type EditAirdropQuery = {
    __typename?: 'Query';
    airdrops: Array<{
        __typename?: 'Airdrop';
        metadata?: {
            __typename?: 'AirdropTemp';
            socials: {
                __typename?: 'Socials';
                logoUrl: string;
                webUrl: string;
                facebookUrl?: string | null;
                twitterUrl?: string | null;
                githubUrl?: string | null;
                telegramUrl?: string | null;
                redditUrl?: string | null;
                youtubeUrl?: string | null;
                description?: string | null;
            };
        } | null;
    }>;
};

export type GetAirdropsQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']['input']>;
    after?: InputMaybe<Scalars['String']['input']>;
    orderBy: Array<AirdropOrderByInput> | AirdropOrderByInput;
}>;

export type GetAirdropsQuery = {
    __typename?: 'Query';
    airdropsConnection: {
        __typename?: 'AirdropsConnection';
        totalCount: number;
        edges: Array<{
            __typename?: 'AirdropEdge';
            node: {
                __typename?: 'Airdrop';
                contractAddress: string;
                name: string;
                metadata?: {
                    __typename?: 'AirdropTemp';
                    socials: { __typename?: 'Socials'; logoUrl: string };
                } | null;
                token: { __typename?: 'Token'; name: string; decimals: number };
            };
        }>;
        pageInfo: { __typename?: 'PageInfo'; endCursor: string; hasNextPage: boolean };
    };
};

export type GetAirdropsByMeQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']['input']>;
    after?: InputMaybe<Scalars['String']['input']>;
    orderBy: Array<AirdropOrderByInput> | AirdropOrderByInput;
    owner?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetAirdropsByMeQuery = {
    __typename?: 'Query';
    airdropsConnection: {
        __typename?: 'AirdropsConnection';
        totalCount: number;
        edges: Array<{
            __typename?: 'AirdropEdge';
            node: {
                __typename?: 'Airdrop';
                contractAddress: string;
                name: string;
                metadata?: {
                    __typename?: 'AirdropTemp';
                    socials: { __typename?: 'Socials'; logoUrl: string };
                } | null;
                token: { __typename?: 'Token'; name: string; decimals: number };
            };
        }>;
        pageInfo: { __typename?: 'PageInfo'; endCursor: string; hasNextPage: boolean };
    };
};

export type GetMyAirdropsQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']['input']>;
    after?: InputMaybe<Scalars['String']['input']>;
    orderBy: Array<AirdropOrderByInput> | AirdropOrderByInput;
    owner?: InputMaybe<
        Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>
    >;
}>;

export type GetMyAirdropsQuery = {
    __typename?: 'Query';
    airdropsConnection: {
        __typename?: 'AirdropsConnection';
        totalCount: number;
        edges: Array<{
            __typename?: 'AirdropEdge';
            node: {
                __typename?: 'Airdrop';
                contractAddress: string;
                name: string;
                metadata?: {
                    __typename?: 'AirdropTemp';
                    socials: { __typename?: 'Socials'; logoUrl: string };
                } | null;
                token: { __typename?: 'Token'; name: string; decimals: number };
            };
        }>;
        pageInfo: { __typename?: 'PageInfo'; endCursor: string; hasNextPage: boolean };
    };
};

export type GetAirdropQueryVariables = Exact<{
    contractAddress: Scalars['String']['input'];
}>;

export type GetAirdropQuery = {
    __typename?: 'Query';
    airdrops: Array<{
        __typename?: 'Airdrop';
        id: string;
        status: Status;
        tge: bigint;
        name: string;
        isVesting: boolean;
        isCancelled: boolean;
        isEnded: boolean;
        interval: bigint;
        cycle: bigint;
        createdAt: string;
        contractAddress: string;
        startTime?: bigint | null;
        chainId: number;
        updatedAt?: string | null;
        totalTokens: bigint;
        metadata?: {
            __typename?: 'AirdropTemp';
            socials: {
                __typename?: 'Socials';
                logoUrl: string;
                webUrl: string;
                facebookUrl?: string | null;
                twitterUrl?: string | null;
                githubUrl?: string | null;
                telegramUrl?: string | null;
                redditUrl?: string | null;
                youtubeUrl?: string | null;
                description?: string | null;
            };
        } | null;
        allocations: Array<{ __typename?: 'Allocation'; user: string; amount: bigint } | null>;
        token: {
            __typename?: 'Token';
            name: string;
            decimals: number;
            symbol?: string | null;
            id: string;
        };
        owner: { __typename?: 'User'; id: string };
    }>;
};

export type GetAirdropsAggrigationQueryVariables = Exact<{ [key: string]: never }>;

export type GetAirdropsAggrigationQuery = {
    __typename?: 'Query';
    aggregations: Array<{
        __typename?: 'Aggregation';
        totalAirdropsLaunched: number;
        totalParticipantsAirdrops: number;
    }>;
};

export type AddMetadataToLaunchpadMutationVariables = Exact<{
    txHash: Scalars['String']['input'];
    logoUrl: Scalars['String']['input'];
    webUrl: Scalars['String']['input'];
    facebookUrl?: InputMaybe<Scalars['String']['input']>;
    twitterUrl?: InputMaybe<Scalars['String']['input']>;
    githubUrl?: InputMaybe<Scalars['String']['input']>;
    telegramUrl?: InputMaybe<Scalars['String']['input']>;
    redditUrl?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl?: InputMaybe<Scalars['String']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
}>;

export type AddMetadataToLaunchpadMutation = {
    __typename?: 'Mutation';
    addMetadataToLaunchpad: boolean;
};

export type GetAllLaunchpadsLeaderboardQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']['input']>;
    after?: InputMaybe<Scalars['String']['input']>;
    orderBy: Array<LaunchPadOrderByInput> | LaunchPadOrderByInput;
    startTime: Scalars['BigInt']['input'];
    endTime: Scalars['BigInt']['input'];
}>;

export type GetAllLaunchpadsLeaderboardQuery = {
    __typename?: 'Query';
    launchPadsConnection: {
        __typename?: 'LaunchPadsConnection';
        totalCount: number;
        edges: Array<{
            __typename?: 'LaunchPadEdge';
            node: {
                __typename?: 'LaunchPad';
                id: string;
                endTime: bigint;
                hardCap?: bigint | null;
                finalizeTime?: bigint | null;
                contractAddress: string;
                isAffiliate?: boolean | null;
                isAutoListing?: boolean | null;
                liquidityAdded?: bigint | null;
                liquidityPercent?: bigint | null;
                listingPrice?: bigint | null;
                lockTime?: bigint | null;
                locker?: string | null;
                minBuyLimit?: bigint | null;
                investedAmount: bigint;
                chainId: number;
                name: string;
                publicSaleTime?: bigint | null;
                sellPrice?: bigint | null;
                router?: string | null;
                softCap: bigint;
                startTime: bigint;
                maxBuyLimit?: bigint | null;
                fundToken: {
                    __typename?: 'FundToken';
                    decimals: number;
                    id: string;
                    symbol: string;
                    name: string;
                    isNative: boolean;
                };
                vestingDetails?: {
                    __typename?: 'VestingDetails';
                    cycleInterval: bigint;
                    cyclePercent: bigint;
                    id: string;
                    isVestingEnable: boolean;
                    tgePercent: bigint;
                } | null;
                token: {
                    __typename?: 'Token';
                    totalSupply: bigint;
                    symbol?: string | null;
                    name: string;
                    id: string;
                    decimals: number;
                };
                owner: { __typename?: 'User'; id: string };
                metadata?: {
                    __typename?: 'LaunchpadTemp';
                    kyc?: string | null;
                    audit?: string | null;
                    socials: {
                        __typename?: 'Socials';
                        telegramUrl?: string | null;
                        description?: string | null;
                        facebookUrl?: string | null;
                        githubUrl?: string | null;
                        logoUrl: string;
                        redditUrl?: string | null;
                        twitterUrl?: string | null;
                        webUrl: string;
                        youtubeUrl?: string | null;
                    };
                } | null;
            };
        }>;
        pageInfo: { __typename?: 'PageInfo'; endCursor: string; hasNextPage: boolean };
    };
};

export type GetGemTokensQueryVariables = Exact<{
    limit: Scalars['Int']['input'];
}>;

export type GetGemTokensQuery = {
    __typename?: 'Query';
    gemlaunchTokens: Array<{
        __typename?: 'GemlaunchToken';
        id: string;
        name: string;
        symbol: string;
        image?: string | null;
        chainId: number;
    }>;
};

export type GetLatestPoolsQueryVariables = Exact<{
    limit: Scalars['Int']['input'];
}>;

export type GetLatestPoolsQuery = {
    __typename?: 'Query';
    launchPads: Array<{
        __typename?: 'LaunchPad';
        id: string;
        name: string;
        chainId: number;
        contractAddress: string;
        token: { __typename?: 'Token'; symbol?: string | null };
        metadata?: {
            __typename?: 'LaunchpadTemp';
            socials: { __typename?: 'Socials'; logoUrl: string };
        } | null;
    }>;
};

export type GetPrivateSalesQueryVariables = Exact<{
    limit: Scalars['Int']['input'];
}>;

export type GetPrivateSalesQuery = {
    __typename?: 'Query';
    privateSales: Array<{
        __typename?: 'PrivateSale';
        id: string;
        name: string;
        chainId: number;
        contractAddress: string;
        tokenSymbol: string;
        metadata?: {
            __typename?: 'PrivateSaleTemp';
            socials: { __typename?: 'Socials'; logoUrl: string };
        } | null;
    }>;
};

export type RecordsLockConnectionQueryVariables = Exact<{
    lockId: Scalars['String']['input'];
    orderBy?: InputMaybe<Array<LockOrderByInput> | LockOrderByInput>;
}>;

export type RecordsLockConnectionQuery = {
    __typename?: 'Query';
    locks: Array<{
        __typename?: 'Lock';
        id: string;
        amount: bigint;
        unlockDate: string;
        status: LockStatus;
        depositDate: string;
        interval?: bigint | null;
        cycleShare?: bigint | null;
        tge?: bigint | null;
        title?: string | null;
        token: {
            __typename?: 'Token';
            id: string;
            name: string;
            symbol?: string | null;
            decimals: number;
            tokenLockedInUsd: number;
            isLiquidityToken: boolean;
            token0?: { __typename?: 'Token'; symbol?: string | null } | null;
            token1?: { __typename?: 'Token'; symbol?: string | null } | null;
        };
        owner: { __typename?: 'User'; id: string };
    }>;
};

export type LockRecordsQueryVariables = Exact<{
    tokenAddress: Scalars['String']['input'];
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<LockOrderByInput> | LockOrderByInput>;
}>;

export type LockRecordsQuery = {
    __typename?: 'Query';
    locksConnection: {
        __typename?: 'LocksConnection';
        totalCount: number;
        edges: Array<{
            __typename?: 'LockEdge';
            node: {
                __typename?: 'Lock';
                id: string;
                tge?: bigint | null;
                interval?: bigint | null;
                cycleShare?: bigint | null;
                status: LockStatus;
                amount: bigint;
                unlockDate: string;
                owner: { __typename?: 'User'; id: string };
                token: {
                    __typename?: 'Token';
                    tokenLocked: number;
                    tokenLockedCount: number;
                    tokenLockedInUsd: number;
                    decimals: number;
                    name: string;
                    symbol?: string | null;
                    id: string;
                };
            };
        }>;
    };
};

export type AddMetadataToPrivateSaleMutationVariables = Exact<{
    txHash: Scalars['String']['input'];
    logoUrl: Scalars['String']['input'];
    webUrl: Scalars['String']['input'];
    facebookUrl?: InputMaybe<Scalars['String']['input']>;
    twitterUrl?: InputMaybe<Scalars['String']['input']>;
    githubUrl?: InputMaybe<Scalars['String']['input']>;
    telegramUrl?: InputMaybe<Scalars['String']['input']>;
    redditUrl?: InputMaybe<Scalars['String']['input']>;
    youtubeUrl?: InputMaybe<Scalars['String']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
}>;

export type AddMetadataToPrivateSaleMutation = {
    __typename?: 'Mutation';
    addMetadataToPrivateSale: boolean;
};

export type GetHomeAggregationQueryVariables = Exact<{ [key: string]: never }>;

export type GetHomeAggregationQuery = {
    __typename?: 'Query';
    aggregations: Array<{
        __typename?: 'Aggregation';
        fundedProjects: number;
        uniqueParticipants: Array<string | null>;
        raisedContributionNative: bigint;
        raisedContributionUSDC: bigint;
        raisedContributionUSDT: bigint;
    }>;
};

export type GetStatsQueryVariables = Exact<{ [key: string]: never }>;

export type GetStatsQuery = {
    __typename?: 'Query';
    aggregations: Array<{
        __typename?: 'Aggregation';
        uniqueParticipants: Array<string | null>;
        fundedProjects: number;
        tokenLockedInUsd: number;
        raisedContributionNative: bigint;
        raisedContributionUSDC: bigint;
        raisedContributionUSDT: bigint;
    }>;
};

export type MyQueryQueryVariables = Exact<{
    after?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    orderBy?: InputMaybe<Array<LockOrderByInput> | LockOrderByInput>;
    searchTerm?: InputMaybe<Scalars['String']['input']>;
    isLpToken?: InputMaybe<Scalars['Boolean']['input']>;
    ownerAddress?: InputMaybe<Scalars['String']['input']>;
}>;

export type MyQueryQuery = {
    __typename?: 'Query';
    locksConnection: {
        __typename?: 'LocksConnection';
        totalCount: number;
        pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor: string };
        edges: Array<{
            __typename?: 'LockEdge';
            node: {
                __typename?: 'Lock';
                amount: bigint;
                id: string;
                token: {
                    __typename?: 'Token';
                    id: string;
                    decimals: number;
                    name: string;
                    symbol?: string | null;
                };
                owner: { __typename?: 'User'; id: string };
            };
        }>;
    };
};

export type GetLaunchpadsQueryVariables = Exact<{ [key: string]: never }>;

export type GetLaunchpadsQuery = {
    __typename?: 'Query';
    launchPads: Array<{
        __typename?: 'LaunchPad';
        id: string;
        endTime: bigint;
        hardCap?: bigint | null;
        finalizeTime?: bigint | null;
        isAffiliate?: boolean | null;
        isAutoListing?: boolean | null;
        contractAddress: string;
        liquidityAdded?: bigint | null;
        liquidityPercent?: bigint | null;
        listingPrice?: bigint | null;
        lockTime?: bigint | null;
        locker?: string | null;
        minBuyLimit?: bigint | null;
        name: string;
        publicSaleTime?: bigint | null;
        sellPrice?: bigint | null;
        router?: string | null;
        softCap: bigint;
        startTime: bigint;
        maxBuyLimit?: bigint | null;
        vestingDetails?: {
            __typename?: 'VestingDetails';
            cycleInterval: bigint;
            cyclePercent: bigint;
            id: string;
            isVestingEnable: boolean;
            tgePercent: bigint;
        } | null;
        token: {
            __typename?: 'Token';
            totalSupply: bigint;
            symbol?: string | null;
            name: string;
            id: string;
            decimals: number;
        };
        owner: { __typename?: 'User'; id: string };
        metadata?: {
            __typename?: 'LaunchpadTemp';
            id: string;
            socials: {
                __typename?: 'Socials';
                telegramUrl?: string | null;
                description?: string | null;
                facebookUrl?: string | null;
                githubUrl?: string | null;
                logoUrl: string;
                redditUrl?: string | null;
                twitterUrl?: string | null;
                webUrl: string;
                youtubeUrl?: string | null;
            };
        } | null;
    }>;
};

export type GetAllLaunchpadsQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']['input']>;
    after?: InputMaybe<Scalars['String']['input']>;
    orderBy: Array<LaunchPadOrderByInput> | LaunchPadOrderByInput;
    searchTerm?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetAllLaunchpadsQuery = {
    __typename?: 'Query';
    launchPadsConnection: {
        __typename?: 'LaunchPadsConnection';
        totalCount: number;
        edges: Array<{
            __typename?: 'LaunchPadEdge';
            node: {
                __typename?: 'LaunchPad';
                id: string;
                endTime: bigint;
                hardCap?: bigint | null;
                finalizeTime?: bigint | null;
                contractAddress: string;
                isAffiliate?: boolean | null;
                affiliateReward?: bigint | null;
                isAutoListing?: boolean | null;
                listingPrice?: bigint | null;
                minBuyLimit?: bigint | null;
                name: string;
                publicSaleTime?: bigint | null;
                sellPrice?: bigint | null;
                softCap: bigint;
                startTime: bigint;
                maxBuyLimit?: bigint | null;
                liquidityDetails?: {
                    __typename?: 'LiquidityDetails';
                    id: string;
                    liquidityAdded: bigint;
                    liquidityPercent: bigint;
                    lockTime: bigint;
                    locker: string;
                    router: string;
                } | null;
                vestingDetails?: {
                    __typename?: 'VestingDetails';
                    cycleInterval: bigint;
                    cyclePercent: bigint;
                    id: string;
                    isVestingEnable: boolean;
                    tgePercent: bigint;
                } | null;
                token: {
                    __typename?: 'Token';
                    totalSupply: bigint;
                    symbol?: string | null;
                    name: string;
                    id: string;
                    decimals: number;
                };
                owner: { __typename?: 'User'; id: string };
                metadata?: {
                    __typename?: 'LaunchpadTemp';
                    kyc?: string | null;
                    audit?: string | null;
                    socials: {
                        __typename?: 'Socials';
                        telegramUrl?: string | null;
                        description?: string | null;
                        facebookUrl?: string | null;
                        githubUrl?: string | null;
                        logoUrl: string;
                        redditUrl?: string | null;
                        twitterUrl?: string | null;
                        webUrl: string;
                        youtubeUrl?: string | null;
                    };
                } | null;
            };
        }>;
        pageInfo: { __typename?: 'PageInfo'; endCursor: string; hasNextPage: boolean };
    };
};

export type GetMyLaunchpadsQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']['input']>;
    after?: InputMaybe<Scalars['String']['input']>;
    orderBy: Array<LaunchPadOrderByInput> | LaunchPadOrderByInput;
    searchTerm?: InputMaybe<Scalars['String']['input']>;
    ownerId?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetMyLaunchpadsQuery = {
    __typename?: 'Query';
    launchPadsConnection: {
        __typename?: 'LaunchPadsConnection';
        totalCount: number;
        edges: Array<{
            __typename?: 'LaunchPadEdge';
            node: {
                __typename?: 'LaunchPad';
                id: string;
                endTime: bigint;
                hardCap?: bigint | null;
                finalizeTime?: bigint | null;
                contractAddress: string;
                isAffiliate?: boolean | null;
                affiliateReward?: bigint | null;
                isAutoListing?: boolean | null;
                listingPrice?: bigint | null;
                minBuyLimit?: bigint | null;
                name: string;
                publicSaleTime?: bigint | null;
                sellPrice?: bigint | null;
                softCap: bigint;
                startTime: bigint;
                maxBuyLimit?: bigint | null;
                liquidityDetails?: {
                    __typename?: 'LiquidityDetails';
                    id: string;
                    liquidityAdded: bigint;
                    liquidityPercent: bigint;
                    lockTime: bigint;
                    locker: string;
                    router: string;
                } | null;
                vestingDetails?: {
                    __typename?: 'VestingDetails';
                    cycleInterval: bigint;
                    cyclePercent: bigint;
                    id: string;
                    isVestingEnable: boolean;
                    tgePercent: bigint;
                } | null;
                token: {
                    __typename?: 'Token';
                    totalSupply: bigint;
                    symbol?: string | null;
                    name: string;
                    id: string;
                    decimals: number;
                };
                owner: { __typename?: 'User'; id: string };
                metadata?: {
                    __typename?: 'LaunchpadTemp';
                    kyc?: string | null;
                    audit?: string | null;
                    socials: {
                        __typename?: 'Socials';
                        telegramUrl?: string | null;
                        description?: string | null;
                        facebookUrl?: string | null;
                        githubUrl?: string | null;
                        logoUrl: string;
                        redditUrl?: string | null;
                        twitterUrl?: string | null;
                        webUrl: string;
                        youtubeUrl?: string | null;
                    };
                } | null;
            };
        }>;
        pageInfo: { __typename?: 'PageInfo'; endCursor: string; hasNextPage: boolean };
    };
};

export type GetAllPrivateSalesQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']['input']>;
    after?: InputMaybe<Scalars['String']['input']>;
    orderBy: Array<PrivateSaleOrderByInput> | PrivateSaleOrderByInput;
    searchTerm?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetAllPrivateSalesQuery = {
    __typename?: 'Query';
    privateSalesConnection: {
        __typename?: 'PrivateSalesConnection';
        totalCount: number;
        pageInfo: { __typename?: 'PageInfo'; endCursor: string; hasNextPage: boolean };
        edges: Array<{
            __typename?: 'PrivateSaleEdge';
            node: {
                __typename?: 'PrivateSale';
                id: string;
                initialRelease: bigint;
                currency: string;
                metadata?: {
                    __typename?: 'PrivateSaleTemp';
                    socials: { __typename?: 'Socials'; logoUrl: string };
                } | null;
            };
        }>;
    };
};

export type GetMyPrivateSalesQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']['input']>;
    after?: InputMaybe<Scalars['String']['input']>;
    orderBy: Array<PrivateSaleOrderByInput> | PrivateSaleOrderByInput;
    searchTerm?: InputMaybe<Scalars['String']['input']>;
    owner?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetMyPrivateSalesQuery = {
    __typename?: 'Query';
    privateSalesConnection: {
        __typename?: 'PrivateSalesConnection';
        totalCount: number;
        pageInfo: { __typename?: 'PageInfo'; endCursor: string; hasNextPage: boolean };
        edges: Array<{
            __typename?: 'PrivateSaleEdge';
            node: {
                __typename?: 'PrivateSale';
                id: string;
                initialRelease: bigint;
                currency: string;
                metadata?: {
                    __typename?: 'PrivateSaleTemp';
                    socials: { __typename?: 'Socials'; logoUrl: string };
                } | null;
            };
        }>;
    };
};

export type GetMyContributionPrivateSalesQueryVariables = Exact<{
    first?: InputMaybe<Scalars['Int']['input']>;
    after?: InputMaybe<Scalars['String']['input']>;
    orderBy: Array<PrivateSaleOrderByInput> | PrivateSaleOrderByInput;
    owner?: InputMaybe<
        Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>
    >;
    searchTerm?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetMyContributionPrivateSalesQuery = {
    __typename?: 'Query';
    privateSalesConnection: {
        __typename?: 'PrivateSalesConnection';
        totalCount: number;
        pageInfo: { __typename?: 'PageInfo'; endCursor: string; hasNextPage: boolean };
        edges: Array<{
            __typename?: 'PrivateSaleEdge';
            node: {
                __typename?: 'PrivateSale';
                id: string;
                initialRelease: bigint;
                currency: string;
                metadata?: {
                    __typename?: 'PrivateSaleTemp';
                    socials: { __typename?: 'Socials'; logoUrl: string };
                } | null;
            };
        }>;
    };
};

export type GetSinglePrivateSaleQueryVariables = Exact<{
    id?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetSinglePrivateSaleQuery = {
    __typename?: 'Query';
    privateSales: Array<{
        __typename?: 'PrivateSale';
        cycleInterval: bigint;
        cyclePercent: bigint;
        endTime: bigint;
        owner: string;
        finalizeTime: bigint;
        hardcap: bigint;
        id: string;
        initialRelease: bigint;
        isWhitelist: number;
        maxBuyLimit: bigint;
        minBuyLimit: bigint;
        name: string;
        publicSaleTime: bigint;
        softcap: bigint;
        startTime: bigint;
        currency: string;
        depositedAmount: bigint;
        whitelistUsers: Array<string | null>;
        metadata?: {
            __typename?: 'PrivateSaleTemp';
            socials: {
                __typename?: 'Socials';
                logoUrl: string;
                webUrl: string;
                facebookUrl?: string | null;
                twitterUrl?: string | null;
                githubUrl?: string | null;
                telegramUrl?: string | null;
                redditUrl?: string | null;
                youtubeUrl?: string | null;
                description?: string | null;
            };
        } | null;
    }>;
};

export const AddTitleToLockDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'addTitleToLock' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'txHash' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'title' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'addTitleToLock' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'txHash' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'txHash' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'title' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'title' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AddTitleToLockMutation, AddTitleToLockMutationVariables>;
export const LiquidityLockRecordsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'LiquidityLockRecords' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'tokenAddress' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'LockOrderByInput' },
                            },
                        },
                    },
                    defaultValue: { kind: 'EnumValue', value: 'id_DESC' },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'locksConnection' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'after' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'first' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'token' },
                                            value: {
                                                kind: 'ObjectValue',
                                                fields: [
                                                    {
                                                        kind: 'ObjectField',
                                                        name: { kind: 'Name', value: 'id_eq' },
                                                        value: {
                                                            kind: 'Variable',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'tokenAddress',
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'node' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tge' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'interval',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'cycleShare',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'owner' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'token' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'token0',
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'symbol',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'token1',
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'symbol',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'tokenLocked',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'tokenLockedCount',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'tokenLockedInUsd',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'symbol',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'decimals',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'status' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'amount' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'unlockDate',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LiquidityLockRecordsQuery, LiquidityLockRecordsQueryVariables>;
export const LaunchpadDetailDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'LaunchpadDetail' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'address' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'launchPads' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'contractAddress_eq' },
                                            value: {
                                                kind: 'Variable',
                                                name: { kind: 'Name', value: 'address' },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'totalSaleAmount' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'totalSellTokens' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'userHardCap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'affiliateReward' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'chainId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'contractAddress' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'decreaseInterval' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'endPrice' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'endTime' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'finalizeTime' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fundToken' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'decimals' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'symbol' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'isNative' },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'hardCap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'investedAmount' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'investors' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'isAffiliate' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'isAutoListing' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'listingRate' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'isMaxLimit' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'liquidityAdded' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'liquidityDetails' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'liquidityAdded' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'liquidityPercent' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'lockTime' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'locker' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'router' },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'listingPrice' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'lockTime' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'locker' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'maxBuyLimit' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'minBuyLimit' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'metadata' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'audit' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'contractAddress' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'kyc' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'socials' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'description',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'facebookUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'githubUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'logoUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'redditUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'telegramUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'twitterUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'webUrl' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'youtubeUrl',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'owner' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'publicSaleTime' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'router' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'sellPrice' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'sellRate' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'softCap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'startPrice' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'startTime' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'token' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'chainId' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'decimals' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'symbol' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'totalSupply' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vestingDetails' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'cycleInterval' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'cyclePercent' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'isVestingEnable' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'tgePercent' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LaunchpadDetailQuery, LaunchpadDetailQueryVariables>;
export const GetAllLaunchpadsAdminDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getAllLaunchpadsAdmin' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'LaunchPadOrderByInput' },
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'searchTerm' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'launchPadsConnection' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'first' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'after' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'token' },
                                            value: {
                                                kind: 'ObjectValue',
                                                fields: [
                                                    {
                                                        kind: 'ObjectField',
                                                        name: {
                                                            kind: 'Name',
                                                            value: 'symbol_containsInsensitive',
                                                        },
                                                        value: {
                                                            kind: 'Variable',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'searchTerm',
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'node' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'endTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'hardCap',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'finalizeTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'contractAddress',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'isAffiliate',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'isAutoListing',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'liquidityAdded',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'liquidityPercent',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'listingPrice',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'lockTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'locker' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'minBuyLimit',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'name' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'publicSaleTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'sellPrice',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'router' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'softCap',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'startTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'vestingDetails',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'cycleInterval',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'cyclePercent',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'isVestingEnable',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'tgePercent',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'token' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'totalSupply',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'symbol',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'decimals',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'owner' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'maxBuyLimit',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'metadata',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'kyc',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'audit',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'socials',
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'telegramUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'description',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'facebookUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'githubUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'logoUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'redditUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'twitterUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'webUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'youtubeUrl',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pageInfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'endCursor' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'hasNextPage' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetAllLaunchpadsAdminQuery, GetAllLaunchpadsAdminQueryVariables>;
export const AddKycAuditToLaunchpadDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'addKycAuditToLaunchpad' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'contractAddress' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'kyc' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'audit' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'addKycAuditToLaunchpad' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'contractAddress' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'contractAddress' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'kyc' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'kyc' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'audit' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'audit' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    AddKycAuditToLaunchpadMutation,
    AddKycAuditToLaunchpadMutationVariables
>;
export const GetWhiteBlackListDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getWhiteBlackList' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'antibots' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'id_eq' },
                                            value: {
                                                kind: 'Variable',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'blacklist' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'whitelist' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetWhiteBlackListQuery, GetWhiteBlackListQueryVariables>;
export const AddMetadataToAirdropDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'addMetadataToAirdrop' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'txHash' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'logoUrl' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'webUrl' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'facebookUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'twitterUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'githubUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'telegramUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'redditUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'youtubeUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'description' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'addMetadataToAirdrop' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'txHash' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'txHash' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'logoUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'logoUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'webUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'webUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'facebookUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'facebookUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'twitterUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'twitterUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'githubUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'githubUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'telegramUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'telegramUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'redditUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'redditUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'youtubeUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'youtubeUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'description' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'description' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AddMetadataToAirdropMutation, AddMetadataToAirdropMutationVariables>;
export const EditAirdropMetadataDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'editAirdropMetadata' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'contractAddress' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'logoUrl' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'webUrl' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'facebookUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'twitterUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'githubUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'telegramUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'redditUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'youtubeUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'description' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'editAirdropMetadata' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'contractAddress' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'contractAddress' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'logoUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'logoUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'webUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'webUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'facebookUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'facebookUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'twitterUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'twitterUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'githubUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'githubUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'telegramUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'telegramUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'redditUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'redditUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'youtubeUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'youtubeUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'description' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'description' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<EditAirdropMetadataMutation, EditAirdropMetadataMutationVariables>;
export const EditAirdropDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'EditAirdrop' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'contractAddress' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'airdrops' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'contractAddress_eq' },
                                            value: {
                                                kind: 'Variable',
                                                name: { kind: 'Name', value: 'contractAddress' },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'metadata' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'socials' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'logoUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'webUrl' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'facebookUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'twitterUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'githubUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'telegramUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'redditUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'youtubeUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'description',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<EditAirdropQuery, EditAirdropQueryVariables>;
export const GetAirdropsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getAirdrops' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'AirdropOrderByInput' },
                                },
                            },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'airdropsConnection' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'first' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'after' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'node' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'contractAddress',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'name' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'metadata',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'socials',
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'logoUrl',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'token' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'decimals',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pageInfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'endCursor' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'hasNextPage' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetAirdropsQuery, GetAirdropsQueryVariables>;
export const GetAirdropsByMeDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getAirdropsByMe' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'AirdropOrderByInput' },
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'owner' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'airdropsConnection' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'first' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'after' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'owner' },
                                            value: {
                                                kind: 'ObjectValue',
                                                fields: [
                                                    {
                                                        kind: 'ObjectField',
                                                        name: { kind: 'Name', value: 'id_eq' },
                                                        value: {
                                                            kind: 'Variable',
                                                            name: { kind: 'Name', value: 'owner' },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'node' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'contractAddress',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'name' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'metadata',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'socials',
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'logoUrl',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'token' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'decimals',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pageInfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'endCursor' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'hasNextPage' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetAirdropsByMeQuery, GetAirdropsByMeQueryVariables>;
export const GetMyAirdropsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getMyAirdrops' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'AirdropOrderByInput' },
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'owner' } },
                    type: {
                        kind: 'ListType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'airdropsConnection' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'first' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'after' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: {
                                                kind: 'Name',
                                                value: 'allocatedUsers_containsAny',
                                            },
                                            value: {
                                                kind: 'Variable',
                                                name: { kind: 'Name', value: 'owner' },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'node' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'contractAddress',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'name' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'metadata',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'socials',
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'logoUrl',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'token' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'decimals',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pageInfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'endCursor' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'hasNextPage' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetMyAirdropsQuery, GetMyAirdropsQueryVariables>;
export const GetAirdropDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetAirdrop' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'contractAddress' },
                    },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'airdrops' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'contractAddress_eq' },
                                            value: {
                                                kind: 'Variable',
                                                name: { kind: 'Name', value: 'contractAddress' },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tge' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'isVesting' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'isCancelled' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'isEnded' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'interval' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'cycle' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'contractAddress' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'startTime' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'chainId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'totalTokens' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'metadata' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'socials' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'logoUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'webUrl' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'facebookUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'twitterUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'githubUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'telegramUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'redditUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'youtubeUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'description',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'allocations' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'user' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'amount' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'token' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'decimals' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'symbol' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'owner' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetAirdropQuery, GetAirdropQueryVariables>;
export const GetAirdropsAggrigationDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getAirdropsAggrigation' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'aggregations' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'totalAirdropsLaunched' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'totalParticipantsAirdrops' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetAirdropsAggrigationQuery, GetAirdropsAggrigationQueryVariables>;
export const AddMetadataToLaunchpadDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'addMetadataToLaunchpad' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'txHash' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'logoUrl' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'webUrl' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'facebookUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'twitterUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'githubUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'telegramUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'redditUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'youtubeUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'description' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'addMetadataToLaunchpad' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'txHash' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'txHash' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'logoUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'logoUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'webUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'webUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'facebookUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'facebookUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'twitterUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'twitterUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'githubUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'githubUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'telegramUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'telegramUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'redditUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'redditUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'youtubeUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'youtubeUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'description' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'description' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    AddMetadataToLaunchpadMutation,
    AddMetadataToLaunchpadMutationVariables
>;
export const GetAllLaunchpadsLeaderboardDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getAllLaunchpadsLeaderboard' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'LaunchPadOrderByInput' },
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'startTime' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'BigInt' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'endTime' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'BigInt' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'launchPadsConnection' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'first' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'after' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'startTime_gte' },
                                            value: {
                                                kind: 'Variable',
                                                name: { kind: 'Name', value: 'startTime' },
                                            },
                                        },
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'endTime_lte' },
                                            value: {
                                                kind: 'Variable',
                                                name: { kind: 'Name', value: 'endTime' },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'node' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'endTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'hardCap',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'finalizeTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'contractAddress',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'isAffiliate',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'isAutoListing',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'liquidityAdded',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'liquidityPercent',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'listingPrice',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'lockTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'locker' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'minBuyLimit',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'investedAmount',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'chainId',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'name' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'publicSaleTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'sellPrice',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'router' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'softCap',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'startTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'fundToken',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'decimals',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'symbol',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'isNative',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'vestingDetails',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'cycleInterval',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'cyclePercent',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'isVestingEnable',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'tgePercent',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'token' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'totalSupply',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'symbol',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'decimals',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'owner' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'maxBuyLimit',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'metadata',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'kyc',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'audit',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'socials',
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'telegramUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'description',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'facebookUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'githubUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'logoUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'redditUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'twitterUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'webUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'youtubeUrl',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pageInfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'endCursor' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'hasNextPage' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetAllLaunchpadsLeaderboardQuery,
    GetAllLaunchpadsLeaderboardQueryVariables
>;
export const GetGemTokensDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getGemTokens' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'gemlaunchTokens' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'limit' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: { kind: 'EnumValue', value: 'createdAt_DESC' },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'symbol' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'image' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'chainId' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetGemTokensQuery, GetGemTokensQueryVariables>;
export const GetLatestPoolsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getLatestPools' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'launchPads' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'limit' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: { kind: 'EnumValue', value: 'createdAt_DESC' },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'chainId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'contractAddress' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'token' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'symbol' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'metadata' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'socials' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'logoUrl',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetLatestPoolsQuery, GetLatestPoolsQueryVariables>;
export const GetPrivateSalesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getPrivateSales' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                    },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'privateSales' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'limit' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: { kind: 'EnumValue', value: 'createdAt_DESC' },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'chainId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'contractAddress' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tokenSymbol' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'metadata' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'socials' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'logoUrl',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetPrivateSalesQuery, GetPrivateSalesQueryVariables>;
export const RecordsLockConnectionDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'RecordsLockConnection' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'lockId' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'LockOrderByInput' },
                            },
                        },
                    },
                    defaultValue: { kind: 'EnumValue', value: 'id_ASC' },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'locks' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'id_eq' },
                                            value: {
                                                kind: 'Variable',
                                                name: { kind: 'Name', value: 'lockId' },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'token' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'symbol' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'decimals' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'tokenLockedInUsd' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'isLiquidityToken' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'token0' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'symbol' },
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'token1' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'symbol' },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'amount' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'owner' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'unlockDate' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'depositDate' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'interval' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'cycleShare' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tge' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<RecordsLockConnectionQuery, RecordsLockConnectionQueryVariables>;
export const LockRecordsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'LockRecords' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'tokenAddress' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'LockOrderByInput' },
                            },
                        },
                    },
                    defaultValue: { kind: 'EnumValue', value: 'id_DESC' },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'locksConnection' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'after' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'first' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'token' },
                                            value: {
                                                kind: 'ObjectValue',
                                                fields: [
                                                    {
                                                        kind: 'ObjectField',
                                                        name: { kind: 'Name', value: 'id_eq' },
                                                        value: {
                                                            kind: 'Variable',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'tokenAddress',
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'node' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'tge' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'interval',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'cycleShare',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'owner' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'token' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'tokenLocked',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'tokenLockedCount',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'tokenLockedInUsd',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'decimals',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'symbol',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'status' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'amount' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'unlockDate',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LockRecordsQuery, LockRecordsQueryVariables>;
export const AddMetadataToPrivateSaleDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'addMetadataToPrivateSale' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'txHash' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'logoUrl' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'webUrl' } },
                    type: {
                        kind: 'NonNullType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'facebookUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'twitterUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'githubUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'telegramUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'redditUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'youtubeUrl' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'description' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'addMetadataToPrivateSale' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'txHash' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'txHash' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'logoUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'logoUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'webUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'webUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'facebookUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'facebookUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'twitterUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'twitterUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'githubUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'githubUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'telegramUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'telegramUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'redditUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'redditUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'youtubeUrl' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'youtubeUrl' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'description' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'description' },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    AddMetadataToPrivateSaleMutation,
    AddMetadataToPrivateSaleMutationVariables
>;
export const GetHomeAggregationDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getHomeAggregation' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'aggregations' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fundedProjects' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'uniqueParticipants' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'raisedContributionNative' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'raisedContributionUSDC' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'raisedContributionUSDT' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetHomeAggregationQuery, GetHomeAggregationQueryVariables>;
export const GetStatsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getStats' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'aggregations' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'uniqueParticipants' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'fundedProjects' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'tokenLockedInUsd' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'raisedContributionNative' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'raisedContributionUSDC' },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'raisedContributionUSDT' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetStatsQuery, GetStatsQueryVariables>;
export const MyQueryDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'MyQuery' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
                    type: {
                        kind: 'ListType',
                        type: {
                            kind: 'NonNullType',
                            type: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'LockOrderByInput' },
                            },
                        },
                    },
                    defaultValue: { kind: 'EnumValue', value: 'id_DESC' },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'searchTerm' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'isLpToken' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Boolean' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'ownerAddress' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'locksConnection' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'after' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'first' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'token' },
                                            value: {
                                                kind: 'ObjectValue',
                                                fields: [
                                                    {
                                                        kind: 'ObjectField',
                                                        name: {
                                                            kind: 'Name',
                                                            value: 'isLiquidityToken_eq',
                                                        },
                                                        value: {
                                                            kind: 'Variable',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'isLpToken',
                                                            },
                                                        },
                                                    },
                                                    {
                                                        kind: 'ObjectField',
                                                        name: {
                                                            kind: 'Name',
                                                            value: 'id_containsInsensitive',
                                                        },
                                                        value: {
                                                            kind: 'Variable',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'searchTerm',
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'owner' },
                                            value: {
                                                kind: 'ObjectValue',
                                                fields: [
                                                    {
                                                        kind: 'ObjectField',
                                                        name: {
                                                            kind: 'Name',
                                                            value: 'id_containsInsensitive',
                                                        },
                                                        value: {
                                                            kind: 'Variable',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'ownerAddress',
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pageInfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'hasNextPage' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'endCursor' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'node' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'amount' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'token' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'decimals',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'symbol',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'owner' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<MyQueryQuery, MyQueryQueryVariables>;
export const GetLaunchpadsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getLaunchpads' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'launchPads' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'endTime' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'hardCap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'finalizeTime' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'isAffiliate' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'isAutoListing' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'contractAddress' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'liquidityAdded' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'liquidityPercent' },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'listingPrice' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'lockTime' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'locker' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'minBuyLimit' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'publicSaleTime' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'sellPrice' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'router' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'softCap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'startTime' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'vestingDetails' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'cycleInterval' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'cyclePercent' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'isVestingEnable' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'tgePercent' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'token' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'totalSupply' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'symbol' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'name' },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'decimals' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'owner' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        ],
                                    },
                                },
                                { kind: 'Field', name: { kind: 'Name', value: 'maxBuyLimit' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'metadata' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'socials' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'telegramUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'description',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'facebookUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'githubUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'logoUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'redditUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'twitterUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'webUrl' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'youtubeUrl',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetLaunchpadsQuery, GetLaunchpadsQueryVariables>;
export const GetAllLaunchpadsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getAllLaunchpads' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'LaunchPadOrderByInput' },
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'searchTerm' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'launchPadsConnection' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'first' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'after' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'token' },
                                            value: {
                                                kind: 'ObjectValue',
                                                fields: [
                                                    {
                                                        kind: 'ObjectField',
                                                        name: {
                                                            kind: 'Name',
                                                            value: 'symbol_containsInsensitive',
                                                        },
                                                        value: {
                                                            kind: 'Variable',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'searchTerm',
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'node' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'endTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'hardCap',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'finalizeTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'contractAddress',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'isAffiliate',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'affiliateReward',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'isAutoListing',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'liquidityDetails',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'liquidityAdded',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'liquidityPercent',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'lockTime',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'locker',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'router',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'listingPrice',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'minBuyLimit',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'name' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'publicSaleTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'sellPrice',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'softCap',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'startTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'vestingDetails',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'cycleInterval',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'cyclePercent',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'isVestingEnable',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'tgePercent',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'token' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'totalSupply',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'symbol',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'decimals',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'owner' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'maxBuyLimit',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'metadata',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'kyc',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'audit',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'socials',
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'telegramUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'description',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'facebookUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'githubUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'logoUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'redditUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'twitterUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'webUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'youtubeUrl',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pageInfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'endCursor' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'hasNextPage' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetAllLaunchpadsQuery, GetAllLaunchpadsQueryVariables>;
export const GetMyLaunchpadsDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'getMyLaunchpads' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'LaunchPadOrderByInput' },
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'searchTerm' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'ownerId' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'launchPadsConnection' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'first' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'after' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'token' },
                                            value: {
                                                kind: 'ObjectValue',
                                                fields: [
                                                    {
                                                        kind: 'ObjectField',
                                                        name: {
                                                            kind: 'Name',
                                                            value: 'symbol_containsInsensitive',
                                                        },
                                                        value: {
                                                            kind: 'Variable',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'searchTerm',
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'owner' },
                                            value: {
                                                kind: 'ObjectValue',
                                                fields: [
                                                    {
                                                        kind: 'ObjectField',
                                                        name: { kind: 'Name', value: 'id_eq' },
                                                        value: {
                                                            kind: 'Variable',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'ownerId',
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'node' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'endTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'hardCap',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'finalizeTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'contractAddress',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'isAffiliate',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'affiliateReward',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'isAutoListing',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'liquidityDetails',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'liquidityAdded',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'liquidityPercent',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'lockTime',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'locker',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'router',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'listingPrice',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'minBuyLimit',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'name' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'publicSaleTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'sellPrice',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'softCap',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'startTime',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'vestingDetails',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'cycleInterval',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'cyclePercent',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'isVestingEnable',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'tgePercent',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'token' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'totalSupply',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'symbol',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'name',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'decimals',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'owner' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'id',
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'maxBuyLimit',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'metadata',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'kyc',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'audit',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'socials',
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'telegramUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'description',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'facebookUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'githubUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'logoUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'redditUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'twitterUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'webUrl',
                                                                                    },
                                                                                },
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'youtubeUrl',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pageInfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'endCursor' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'hasNextPage' },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetMyLaunchpadsQuery, GetMyLaunchpadsQueryVariables>;
export const GetAllPrivateSalesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetAllPrivateSales' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'PrivateSaleOrderByInput' },
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'searchTerm' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'privateSalesConnection' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'first' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'after' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: {
                                                kind: 'Name',
                                                value: 'tokenSymbol_containsInsensitive',
                                            },
                                            value: {
                                                kind: 'Variable',
                                                name: { kind: 'Name', value: 'searchTerm' },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pageInfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'endCursor' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'hasNextPage' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'node' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'initialRelease',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'currency',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'metadata',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'socials',
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'logoUrl',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetAllPrivateSalesQuery, GetAllPrivateSalesQueryVariables>;
export const GetMyPrivateSalesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetMyPrivateSales' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'PrivateSaleOrderByInput' },
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'searchTerm' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'owner' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'privateSalesConnection' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'first' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'after' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: {
                                                kind: 'Name',
                                                value: 'tokenSymbol_containsInsensitive',
                                            },
                                            value: {
                                                kind: 'Variable',
                                                name: { kind: 'Name', value: 'searchTerm' },
                                            },
                                        },
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'owner_eq' },
                                            value: {
                                                kind: 'Variable',
                                                name: { kind: 'Name', value: 'owner' },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pageInfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'endCursor' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'hasNextPage' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'node' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'initialRelease',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'currency',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'metadata',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'socials',
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'logoUrl',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetMyPrivateSalesQuery, GetMyPrivateSalesQueryVariables>;
export const GetMyContributionPrivateSalesDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetMyContributionPrivateSales' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'orderBy' } },
                    type: {
                        kind: 'NonNullType',
                        type: {
                            kind: 'ListType',
                            type: {
                                kind: 'NonNullType',
                                type: {
                                    kind: 'NamedType',
                                    name: { kind: 'Name', value: 'PrivateSaleOrderByInput' },
                                },
                            },
                        },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'owner' } },
                    type: {
                        kind: 'ListType',
                        type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                    },
                },
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'searchTerm' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'privateSalesConnection' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'first' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'after' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'orderBy' },
                                value: {
                                    kind: 'Variable',
                                    name: { kind: 'Name', value: 'orderBy' },
                                },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'investors_containsAny' },
                                            value: {
                                                kind: 'Variable',
                                                name: { kind: 'Name', value: 'owner' },
                                            },
                                        },
                                        {
                                            kind: 'ObjectField',
                                            name: {
                                                kind: 'Name',
                                                value: 'tokenSymbol_containsInsensitive',
                                            },
                                            value: {
                                                kind: 'Variable',
                                                name: { kind: 'Name', value: 'searchTerm' },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'pageInfo' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'endCursor' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'hasNextPage' },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'edges' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'node' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'id' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'initialRelease',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'currency',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'metadata',
                                                            },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'Field',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'socials',
                                                                        },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'Field',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'logoUrl',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetMyContributionPrivateSalesQuery,
    GetMyContributionPrivateSalesQueryVariables
>;
export const GetSinglePrivateSaleDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'GetSinglePrivateSale' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'privateSales' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'where' },
                                value: {
                                    kind: 'ObjectValue',
                                    fields: [
                                        {
                                            kind: 'ObjectField',
                                            name: { kind: 'Name', value: 'id_eq' },
                                            value: {
                                                kind: 'Variable',
                                                name: { kind: 'Name', value: 'id' },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'cycleInterval' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'cyclePercent' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'endTime' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'owner' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'finalizeTime' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'hardcap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'initialRelease' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'isWhitelist' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'maxBuyLimit' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'minBuyLimit' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'publicSaleTime' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'softcap' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'startTime' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'depositedAmount' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'whitelistUsers' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'metadata' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'socials' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'logoUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'webUrl' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'facebookUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'twitterUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'githubUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'telegramUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'redditUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'youtubeUrl',
                                                            },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: {
                                                                kind: 'Name',
                                                                value: 'description',
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetSinglePrivateSaleQuery, GetSinglePrivateSaleQueryVariables>;
