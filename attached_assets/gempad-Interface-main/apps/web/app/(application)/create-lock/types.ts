import { Address } from 'viem';

export interface CreateLockFormInput {
    tokenAddress: Address;
    isAnotherOwner: boolean;
    ownerAddress: Address;
    title: string;
    amount: number;
    timeUTC: Date;
    isVestingActive: boolean;
    TGE: number;
    cycle: number;
    cycleRelease: number;
}

export enum Transaction {
    IDLE,
    WAITING,
    PROCESSING,
}

export type LockerArgs = [Address, Address, boolean, bigint, bigint, string];
export type VestingArgs = [
    Address,
    Address,
    boolean,
    bigint,
    bigint,
    bigint,
    bigint,
    bigint,
    string,
];
