'use client';

import LockRecord from '@/components/LaunchpadForm/LockRecord';
import PreviousPresales from '@/components/LaunchpadForm/PreviousPresales';
import FairlaunchDetailsSekeleton from '@/components/Skeletons/FairlaunchDetailsSkeleton';
import BuybackDetails from '@/components/ViewPool/component/FairlaunchComponents/BuybackToken';
import FairLaunchAdmin from '@/components/ViewPool/component/FairlaunchComponents/FairLaunchAdmin';
import FairLaunchDetailCard from '@/components/ViewPool/component/FairlaunchComponents/FairLaunchDetailCard';
import FairLaunchPreSaleTimer from '@/components/ViewPool/component/FairlaunchComponents/FairLaunchPreSaleTimer';
import FairLaunchProgress from '@/components/ViewPool/component/FairlaunchComponents/FairlaunchProgress';
import FAQ from '@/components/ViewPool/FAQ';
import useFairLaunchBuyback from '@/components/ViewPool/hooks/fairlaunchHooks/useFairLaunchBuybackDetails';
import { DynamicPageProps } from '@/constants/types';
import { useFairLaunchContract } from '@/hooks/useContract';
import useForceUpdate from '@/hooks/useForceUpdate';
import { useGetLaunchpadDetails } from '@/hooks/useGetLaunchpad';
import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { Box } from '@mui/material';
import React from 'react';
import { Address } from 'viem';
import { useAccount, useContractRead } from 'wagmi';
import { useMediaQuery } from '@mui/material';

const centeredContainer = {
    height: '70vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const FairlaunchDetails = ({ params }: DynamicPageProps) => {
    const { address:wagmeWaletAddress, isReconnecting } = useAccount();

    const address = params.slug as Address;
    const fairLaunchContract = useFairLaunchContract(address);
    const forceUpdate = useForceUpdate();

    // fetching data from backend
    const { data, refetch, isLoading, isError, error, isFetching } =
        useGetLaunchpadDetails(address);

    const { tracking: launchpadTracking } = useTransactionTracking('launchpad-created', {
        onCompleted: () => refetch(),
    });

    const { buybackDetails } = useFairLaunchBuyback(address);

    const name = data?.launchPads?.[0]?.name;
    const tokenAddress = data && data.launchPads[0]?.token?.id;
    const userAddress = data && data.launchPads[0]?.owner?.id;
    const loading = isLoading || launchpadTracking;

    const { result: fairlaunchOwner } = useSingleCallResult({
        contract: fairLaunchContract,
        functionName: 'owner',
    });

    React.useEffect(() => {
        forceUpdate();
    }, [address, forceUpdate]);
    const isMobile = useMediaQuery('(max-width:1250px)');

    return (
        <>
            <Box sx={{ height: '100%' }}>
                {loading && (
                   <FairlaunchDetailsSekeleton />
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
                            <FairLaunchDetailCard data={data} address={address} />
                            <PreviousPresales
                                userAddress={userAddress}
                                currentPresaleAddress={address}
                            />
                            <LockRecord tokenAddress={tokenAddress} />
                            <FAQ />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            {wagmeWaletAddress &&<FairLaunchPreSaleTimer launchpadAddress={address} />}
                            <FairLaunchProgress launchpadAddress={address} />
                            {buybackDetails.isBuyback && (
                                <BuybackDetails
                                    launchpadAddress={address}
                                    buybackDetails={buybackDetails}
                                />
                            )}
                            <FairLaunchAdmin
                                owner={fairlaunchOwner as Address}
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

export default FairlaunchDetails;
