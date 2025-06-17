import { Address } from 'viem';
import { useMultisenderContract } from '@/hooks/useContract';
import { ApprovalState } from '@/hooks/useApproveCallback';

// Multisender Form:
export type MultisenderContract = ReturnType<typeof useMultisenderContract>;

export enum Tx {
    IDLE,
    PENDING,
    PROCESSING,
}

export enum AmountToApprove {
    EXACT = 'EXACT',
    UNLIMITED = 'UNLIMITED',
}

export enum EnsureExactAmount {
    UNSAFE,
    SAFE,
}

export interface MultisenderFormInput {
    tokenAddress: string;
    allocations: string;
    amountToApprove: AmountToApprove;
    ensureExactAmount: EnsureExactAmount;
}

export type MultisenderTokenArgs = [Address, boolean, Address[], bigint[]];
export type MultisenderEtherArgs = [Address[], bigint[]];

// Step1:
export interface TokenAddress {
    address: Address;
    amount: bigint;
}

export interface Step1Props {
    totalTransferableAmount: number;
    approveAmount: bigint;
    tokenDecimals: number;
    approvalState: ApprovalState;
}

// Step2:
export interface RowProps {
    property: string;
    value: string | number | bigint;
}

export interface Step2Props {
    totalReceivers: number;
    totalTransferableAmount: number;
    approveAmount: bigint;
    tokenDecimals: number;
    isNativeCurrency: boolean;
    totalTransactions: number;
}
