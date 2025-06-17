import { PrivateSale, PrivateSalesConnection } from '@/src/gql/graphql';
import { Address } from 'viem';
import React from 'react';
import { Control } from 'react-hook-form';

export enum OwnerZoneType {
    PUBLIC,
    WHITELIST,
    ANTIBOT,
}

export enum PublicTime {
    Now,
    Specific,
}

export enum Tx {
    Idle,
    Pending,
    Processing,
}

export interface RowProps {
    property: string;
    value: string;
    isPrimary?: boolean;
    id?: number;
}

export interface WhitelistUsersProps {
    users: Address[];
    refetch: any;
}

export interface ExtraInformation {
    id: number;
    prop: string;
    val: string;
}

export interface PropsWithPrivateSale {
    privateSale: PrivateSale;
}

export interface DetailCardProps extends PropsWithPrivateSale {
    refetch: any;
}

export interface ModalProps {
    open: boolean;
    handleClose: () => void;
    contractAddress?: string;
}

export interface WhitelistModalProps extends ModalProps {
    label: string;
}

export interface PublicTimeFormInput {
    timeType: PublicTime;
    startTime: bigint;
}

export interface AntibotModeModalFormInput {
    addr: string;
    minHoldingAmount: number;
}

export interface WhitelistUsersFormInput {
    users: string;
}

export interface AddressProps {
    idx: number;
    user: Address;
}

export interface ContributionFormInput {
    amount: number;
}

export interface SearchFormInput {
    searchTerm: string;
    filterBy: number;
    sortBy: number;
}

export interface PrivateSaleListProps {
    searchTerm: string;
    sortBy: number;
    filterBy: number;
}

export enum FilterBy {
    ALL,
    LIVE,
    ENDED,
    CANCELLED,
    UPCOMING,
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

export interface QueryData {
    privateSalesConnection: PrivateSalesConnection;
}
