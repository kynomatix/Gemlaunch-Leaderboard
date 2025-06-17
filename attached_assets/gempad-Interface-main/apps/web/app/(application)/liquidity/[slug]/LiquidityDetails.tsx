'use client';

import * as React from 'react';
import { Box } from '@mui/material';
import LockInfo from '@/components/TokenSlug/LockInfo';
import LockRecords from '@/components/TokenSlug/LockRecords';
import request, { gql } from 'graphql-request';
import { useAccount, useNetwork } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import PrimaryCard from '@/components/Cards/PrimaryCard';
import BoxLoader from '@/components/BoxLoader';
import Loader from '@/components/TokenSlug/Loader';
import { SUBSQUID_URLS } from '@/constants';
import { LockEdge } from '@/src/gql/graphql';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { DynamicPageProps } from '@/constants/types';

export interface PairToken {
    id: string;
    token0: Token;
    token1: Token;
    tokenLocked: number;
    tokenLockedCount: number;
    tokenLockedInUsd: number;
    name: string;
    decimals: number;
    symbol: string;
}

export interface Token {
    symbol: string;
}

export interface LockOwner {
    id: string; // address
}

export interface LockRecord {
    amount: bigint;
    id: string; // address
    owner: LockOwner;
    status: 'Locked' | 'Unlocked';
    token: PairToken;
    unlockDate: string;
    tge: string;
    interval: string;
    cycleShare: string;
}

const getLiquidityLockRecords = gql`
    query LiquidityLockRecords(
        $tokenAddress: String!
        $after: String
        $first: Int
        $orderBy: [LockOrderByInput!] = id_DESC
    ) {
        locksConnection(
            after: $after
            first: $first
            orderBy: $orderBy
            where: { token: { id_eq: $tokenAddress } }
        ) {
            edges {
                node {
                    id
                    tge
                    interval
                    cycleShare
                    owner {
                        id
                    }
                    token {
                        token0 {
                            symbol
                        }
                        token1 {
                            symbol
                        }
                        tokenLocked
                        tokenLockedCount
                        tokenLockedInUsd
                        id
                        name
                        symbol
                        decimals
                    }
                    status
                    amount
                    unlockDate
                }
            }
            totalCount
        }
    }
`;

export default function LiquidityDetails({ params }: DynamicPageProps) {
    const { address } = useAccount();
    const { chainId } = useActiveChainId();
    const [pairToken, setPairToken] = React.useState<PairToken>();
    const [lockRecord, setLockRecord] = React.useState<LockEdge[]>();

    const limit = 5;

    const queryVariables = {
        first: limit,
        after: null,
        tokenAddress: params?.slug,
    };

    const {
        data: records,
        refetch,
        isLoading,
    } = useQuery<any>({
        queryKey: ['liquidityRecords'],
        queryFn: async () =>
            request(SUBSQUID_URLS[chainId], getLiquidityLockRecords, queryVariables),
    });

    React.useMemo(() => {
        setPairToken(records?.locksConnection?.edges.map((x) => x?.node)[0]?.token);
        setLockRecord(records?.locksConnection?.edges.map((x) => x));
    }, [records]);

    const tokenInfo = [
        {
            id: 1,
            property: 'Current Locked Amount',
            value: `${pairToken?.tokenLocked} ${pairToken?.name}`,
        },
        { id: 2, property: 'Current Values Locked', value: `${pairToken?.tokenLockedInUsd}$` },
        { id: 3, property: 'Liquidity Address', value: pairToken?.id, isAddress: true },
        {
            id: 4,
            property: 'Pair Name',
            value: `${pairToken?.token0?.symbol} / ${pairToken?.token1?.symbol}`,
        },
    ];

    const count = Math.ceil(Number(records?.locksConnection?.totalCount) / limit);

    return (
        <Box>
            {records && !isLoading && (
                <>
                    <LockInfo data={tokenInfo} refetch={refetch} />
                    <LockRecords
                        queryVariables={queryVariables}
                        count={count}
                        lockRecord={lockRecord}
                        baseRoute="token"
                        refetch={refetch}
                        limit={limit}
                    />
                </>
            )}
            {isLoading && (
                <>
                    <BoxLoader />
                    <Loader />
                </>
            )}
        </Box>
    );
}
