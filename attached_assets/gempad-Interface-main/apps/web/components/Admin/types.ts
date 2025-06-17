import { LaunchPad, LaunchPadsConnection } from '@/src/gql/graphql';
import { Control } from 'react-hook-form';

export interface SearchFormInput {
    searchTerm: string;
    filterBy: number;
    sortBy: number;
}

export interface KycAuditFormInput {
    kyc: string;
    audit: string;
}

export interface QueryData {
    launchPadsConnection: LaunchPadsConnection;
}

export interface KycAuditProps {
    open: boolean;
    handleClose: () => void;
    contractAddress: string;
    metadata: LaunchPad['metadata'];
    refetch: any;
}

export interface CardProps {
    launchPad: LaunchPad;
    refetch: any;
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

export interface filterByValue {
    date: string | undefined;
    isCancelled: boolean;
    // isKyc: boolean;
}
