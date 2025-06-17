'use client';

import LockRecord from '@/components/LaunchpadForm/LockRecord';
import PreviousPresales from '@/components/LaunchpadForm/PreviousPresales';
import NoData from '@/components/NoData/NoData';
import LaunchpadDetailsSkeleton from '@/components/Skeletons/LaunchpadDetailsSkeleton';
import LaunchpadDetailCard from '@/components/ViewPool/component/LaunchpadDetailCard';
import FAQ from '@/components/ViewPool/FAQ';
import LaunchpadAdmin from '@/components/ViewPool/LaunchpadAdmin';
import LaunchpadProgress from '@/components/ViewPool/LaunchpadProgress';
import PreSaleTimer from '@/components/ViewPool/PreSaleTimer';
import { DynamicPageProps } from '@/constants/types';
import { useLaunchpadContract } from '@/hooks/useContract';
import useForceUpdate from '@/hooks/useForceUpdate';
import { useGetLaunchpadDetails } from '@/hooks/useGetLaunchpad';
import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import { Box } from '@mui/material';
import React from 'react';
import { Address } from 'viem';
import { useContractReads } from 'wagmi';
import { useMediaQuery } from '@mui/material';

const centeredContainer = {
    height: '70vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const LaunchpadDetails = ({ params }: DynamicPageProps) => {
    const address = params.slug as Address;
    const launchpadContract = useLaunchpadContract(address);
    const forceUpdate = useForceUpdate();

    // fetching data from backend
    const { data, refetch, isLoading, isError, error, isFetching } =
        useGetLaunchpadDetails(address);

    const { tracking: launchpadTracking } = useTransactionTracking('launchpad-created', {
        onCompleted: () => refetch(),
    });

    const name = data?.launchPads?.[0]?.name;
    const loading = isLoading || launchpadTracking;

    const { data: contractData } = useContractReads({
        contracts: [
            { ...launchpadContract, functionName: 'owner' },
            { ...launchpadContract, functionName: 'isAffiliate' },
            { ...launchpadContract, functionName: 'getTotalSaleTokens' },
        ],
        // watch: true,
    });

    const launchpadOwner = contractData?.[0].result as Address;
    const isAffiliate = (contractData?.[1].result as boolean) ?? false;
    const tokenForPreSale = (contractData?.[2].result as bigint) ?? 0n;
    const tokenAddress = data && data.launchPads[0]?.token?.id;
    const userAddress = data && data.launchPads[0]?.owner?.id;

    React.useEffect(() => {
        forceUpdate();
    }, [address, forceUpdate]);
    const isMobile = useMediaQuery('(max-width:1250px)');

    return (
        <>
            <Box sx={{ height: '100%' }}>
                {loading && (
                    <LaunchpadDetailsSkeleton />
                )}
                {data && !loading && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: '26px',
                            mt: '30px',
                            height: '100%',
                        }}
                    >
                        <Box sx={{ flex: 2 }}>
                            <LaunchpadDetailCard
                                data={data}
                                tokenForPreSale={tokenForPreSale}
                                address={address}
                                isAffiliate={isAffiliate}
                            />
                            <PreviousPresales
                                userAddress={userAddress}
                                currentPresaleAddress={address}
                            />
                            <LockRecord tokenAddress={tokenAddress} />
                            <FAQ />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <PreSaleTimer launchpadAddress={address} />
                            <LaunchpadProgress launchpadAddress={address} />
                            <LaunchpadAdmin
                                owner={launchpadOwner}
                                launchpadAddress={address}
                                LaunchpadName={name}
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default LaunchpadDetails;
