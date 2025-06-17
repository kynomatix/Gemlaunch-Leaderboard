import { Lock, LocksConnection } from '@/src/gql/graphql';
import { Dayjs } from 'dayjs';

export interface LockRecord {
    id: string;
    owner: Owner;
    token: Token;
    depositDate: string;
    unlockDate: string;
    amount: bigint;
    status: 'Locked' | 'Withdrawn';
    interval: bigint;
    cycleShare: bigint;
    tge: bigint;
    title: string;
}

export interface NestedToken {
    symbol: string;
}

export interface Token {
    id: string; // address
    name: string;
    symbol: string;
    isLiquidityToken: boolean;
    token0: NestedToken;
    token1: NestedToken;
    tokenLockedInUsd: number;
    decimals: number;
}

export interface Owner {
    id: string;
}

export interface ILockerFormInput {
    amount: number;
    isVestingActive: boolean;
    TGE: number;
    cycle: number;
    cycleRelease: number;
    timeUTC: Dayjs;
}

export interface QueryData {
    locks: Lock[];
}

export interface QueryDataGetLocksRecord {
    locksConnection: LocksConnection;
}

export interface TokenData {
    id: number;
    property: string;
    value: string | number;
    isAddress?: boolean;
}

export interface EditLockProps {
    record: Lock;
    tokenDecimals: number | string;
    tokenBalance: number | string;
    normalTokenData: TokenData[];
    pairTokenData: TokenData[];
    refetch: any;
}

export enum Tx {
    IDLE,
    WAITING,
    PROCESSING,
}
