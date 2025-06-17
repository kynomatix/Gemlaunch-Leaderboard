import { Airdrop, AirdropsConnection, Allocation } from '@/src/gql/graphql';
import { Address } from 'viem';

// enums
export enum OwnerZonePropsTx {
    IDLE,
    PENDING,
    PROCESSING,
}

export enum OwnerZonePropsTitle {
    DISABLE_EXACT_AMOUNT,
    REMOVE_ALLOCATION,
    SET_ALLOCATION,
    SET_VSTING,
    CANCEL_AIRDROP,
    START_AIRDROP,
}

export enum AirdropTime {
    NOW,
    SPECIFIC,
}

export enum Tx {
    IDLE,
    PENDING,
    PROCESSING,
}

// props
export interface OwnerZoneProps {
    contractAddress: Address;
    tokenAddress: Address;
    airdrop: Airdrop;
}

export interface ModalProps {
    open: boolean;
    handleClose: () => void;
    contractAddress: Address;
    tokenAddress?: Address;
}

export interface AirdropModalProps extends ModalProps {
    tokensRequired: string;
    tokenSymbol: string;
    allocations: Allocation[];
}

export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

// form-inputs
export interface VestingModalFormInputs {
    tge: number;
    cycleRelease: number;
    cycle: number;
}

export interface AllocationsModalFormInput {
    allocations: string;
}

export interface AirdropModalFormInputs {
    timeType: AirdropTime;
    startTime: bigint;
}

export interface QueryData {
    airdropsConnection: AirdropsConnection;
}

export interface QueryDataSingleAirdrop {
    airdrops: Airdrop;
}

export interface RowProps {
    property: string;
    value: string;
    isLink?: boolean;
    id?: number;
}

export interface DetailsCardProps {
    airdrop: Airdrop;
}
