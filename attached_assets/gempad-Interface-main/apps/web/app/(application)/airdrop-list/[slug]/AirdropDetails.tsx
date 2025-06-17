'use client';

import * as React from 'react';
import { Box, Typography } from '@mui/material';
import Allocations from '@/components/ExploreAirdrops/Allocations';
import AirdropTimer from '@/components/ExploreAirdrops/AirdropTimer';
import DetailCard from '@/components/ExploreAirdrops/DetailCard';
import { gql, OperationVariables, useLazyQuery, useQuery } from '@apollo/client';
import { Address, useAccount, useContractReads, useNetwork } from 'wagmi';
import OwnerZone from '@/components/ExploreAirdrops/OwnerZone';
import { Airdrop } from '@/src/gql/graphql';
import { useAirdropContract } from '@/hooks/useContract';
import { GET_SINGLE_AIRDROP } from '@/components/ExploreAirdrops/query';
import NoData from '@/components/NoData/NoData';
import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import DetailCardSkeleton from '@/components/Skeletons/DetailCardSkeleton';
import PrivateSaleTimerSkeleton from '@/components/Skeletons/PrivateSaleTimerSkeleton';
import AllocationsSkeleton from '@/components/Skeletons/AllocationsSkeleton';
import { QueryDataSingleAirdrop } from '@/components/ExploreAirdrops/types';
import { DynamicPageProps } from '@/constants/types';

export default function AirdropDetails({ params }: DynamicPageProps) {
    const { address } = useAccount();
    const { chainId } = useActiveChainId();

    const { data, refetch } = useQuery<QueryDataSingleAirdrop, OperationVariables>(
        GET_SINGLE_AIRDROP,
        {
            variables: {
                contractAddress: params.slug,
            },
            context: { chainId },
        },
    );

    const airdrop = data && data.airdrops[0];
    const isOwner = address.toLowerCase() === airdrop?.owner?.id?.toLowerCase();

    const { tracking } = useTransactionTracking('airdrop-created', {
        onCompleted: () => refetch(),
    });

    return (
        <Box sx={{ mt: '30px' }}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                    gap: '26px',
                }}
            >
                <Box sx={{ flex: 2, width: { xs: '100%', md: 'auto' } }}>
                    {airdrop ? <DetailCard airdrop={airdrop} /> : <DetailCardSkeleton />}
                </Box>
                <Box sx={{ flex: 1, width: { xs: '100%', md: 'auto' } }}>
                    {airdrop ? <AirdropTimer {...airdrop} /> : <PrivateSaleTimerSkeleton />}
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                    gap: '26px',
                }}
            >
                <Box sx={{ flex: 2, width: { xs: '100%', md: 'auto' } }}>
                    {airdrop ? (
                        <Allocations airdrop={airdrop} refetch={refetch} />
                    ) : (
                        <AllocationsSkeleton />
                    )}
                </Box>
                <Box sx={{ flex: 1, width: { xs: '100%', md: 'auto' } }}>
                    {airdrop && isOwner && (
                        <OwnerZone
                            contractAddress={params?.slug as Address}
                            tokenAddress={airdrop?.token?.id as Address}
                            airdrop={airdrop}
                        />
                    )}
                </Box>
            </Box>
        </Box>
    );
}
