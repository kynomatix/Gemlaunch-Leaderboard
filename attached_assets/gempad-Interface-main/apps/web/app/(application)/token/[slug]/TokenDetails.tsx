'use client';

import * as React from 'react';
import { Box, Skeleton } from '@mui/material';
import LockInfo from '@/components/TokenSlug/LockInfo';
import LockRecords from '@/components/TokenSlug/LockRecords';
import request, { gql } from 'graphql-request';

import { useAccount, useNetwork } from 'wagmi';
import PrimaryCard from '@/components/Cards/PrimaryCard';
import Loader from '@/components/TokenSlug/Loader';
import BoxLoader from '@/components/BoxLoader';
import { SUBSQUID_URLS } from '@/constants';
import { OperationVariables, useQuery } from '@apollo/client';
import { QueryDataGetLocksRecord } from '@/components/Locker/types';
import { GET_LOCK_RECORD } from '@/components/Locker/query';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { DynamicPageProps } from '@/constants/types';

export interface Token {
    id: string;
    name: string;
    symbol: string;
    tokenLocked: number;
    tokenLockedCount: number;
    tokenLockedInUsd: number;
    decimals: number;
}

export interface LockOwner {
    id: string; // address
}

export interface LockRecord {
    amount: bigint;
    id: string; // address
    owner: LockOwner;
    status: 'Locked' | 'Unlocked';
    token: Token;
    unlockDate: string;
    tge: string;
    interval: string;
    cycleShare: string;
}

export default function TokenDetails({ params }: DynamicPageProps) {
    const { chainId } = useActiveChainId();

    const limit = 5;
    const queryVariables = {
        first: limit,
        after: null,
        tokenAddress: params?.slug,
    };

    const { data, refetch } = useQuery<QueryDataGetLocksRecord, OperationVariables>(
        GET_LOCK_RECORD,
        {
            variables: queryVariables,
            context: { chainId },
            fetchPolicy: 'network-only',
        },
    );

    // eslint-disable-next-line prefer-destructuring
    const token = data?.locksConnection?.edges?.[0]?.node?.token;

    const tokenInfo = [
        {
            id: 1,
            property: 'Current Locked Amount',
            value: `${token?.tokenLocked} ${token?.symbol}`,
        },
        { id: 2, property: 'Current Values Locked', value: `${token?.tokenLockedInUsd} $` },
        { id: 3, property: 'Token Address', value: token?.id, isAddress: true },
        { id: 4, property: 'Token Name', value: token?.name },
        { id: 5, property: 'Token Symbol', value: token?.symbol },
        { id: 6, property: 'Token Decimals', value: token?.decimals },
    ];

    const count = Math.ceil(Number(data?.locksConnection?.totalCount) / limit);

    return (
        <Box>
            <>{data ? <LockInfo data={tokenInfo} refetch={refetch} /> : <BoxLoader />}</>

            {data ? (
                <LockRecords
                    queryVariables={queryVariables}
                    count={count}
                    lockRecord={data.locksConnection.edges}
                    baseRoute="token"
                    refetch={refetch}
                    limit={limit}
                />
            ) : (
                <Loader />
            )}
        </Box>
    );
}
