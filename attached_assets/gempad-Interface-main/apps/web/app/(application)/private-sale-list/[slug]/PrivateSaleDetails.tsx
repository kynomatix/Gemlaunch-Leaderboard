'use client';

import React from 'react';
import DetailCard from '@/components/ViewPrivateSale/DetailsCard';
import ExtraInformation from '@/components/ViewPrivateSale/ExtraInformation';
import OwnerZone from '@/components/ViewPrivateSale/OwnerZone';
import PrivateSaleTimer from '@/components/ViewPrivateSale/PrivateSaleTimer';
import { GET_SINGLE_PRIVATE_SALE } from '@/components/ViewPrivateSale/query';
import { PrivateSale } from '@/src/gql/graphql';
import { Box } from '@mui/material';
import { useAccount, useNetwork } from 'wagmi';
import { useQuery } from '@apollo/client';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import NoData from '@/components/NoData/NoData';
import DetailCardSkeleton from '@/components/Skeletons/DetailCardSkeleton';
import PrivateSaleTimerSkeleton from '@/components/Skeletons/PrivateSaleTimerSkeleton';
import ExtraInformationSkeleton from '@/components/Skeletons/ExtraInformationSkeleton';
import { DynamicPageProps } from '@/constants/types';

export default function PrivateSaleDetails({ params }: DynamicPageProps) {
    const [privateSale, setPrivateSale] = React.useState<PrivateSale>();

    const { address } = useAccount();
    const { chainId } = useActiveChainId();

    const { data, refetch } = useQuery(GET_SINGLE_PRIVATE_SALE, {
        variables: { id: params?.slug },
        context: { chainId },
    });

    React.useEffect(() => {
        const ps = data?.privateSales[0] as PrivateSale;
        setPrivateSale(ps);
    }, [data]);

    const isUserOwnwer = address ? address.toLowerCase() === privateSale?.owner?.toLowerCase() : false;

    const { tracking } = useTransactionTracking('private-sale-created', {
        onCompleted: () => refetch(),
    });

    return (
        <Box sx={{ mt: '30px' }}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                    gap: '26px',
                }}
            >
                <Box sx={{ flex: 2, width: { xs: '100%', lg: 'auto' } }}>
                    {privateSale ? (
                        <DetailCard privateSale={privateSale} refetch={refetch} />
                    ) : (
                        <DetailCardSkeleton />
                    )}
                </Box>
                <Box sx={{ flex: 1, width: { xs: '100%', lg: 'auto' } }}>
                    {privateSale ? (
                        <PrivateSaleTimer {...privateSale} />
                    ) : (
                        <PrivateSaleTimerSkeleton />
                    )}
                    {privateSale ? (
                        <ExtraInformation {...privateSale} />
                    ) : (
                        <ExtraInformationSkeleton />
                    )}
                    {privateSale && isUserOwnwer && <OwnerZone privateSale={privateSale} />}
                </Box>
            </Box>
            {/* {(!privateSale || tracking) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <NoData msg="Loading..." />
                </Box>
            )} */}
        </Box>
    );
}
