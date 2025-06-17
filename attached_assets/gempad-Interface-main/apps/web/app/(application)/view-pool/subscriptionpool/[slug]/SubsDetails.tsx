'use client';

import React from 'react';
import { Box } from '@mui/material';
import FAQ from '@/components/ViewPool/FAQ';
import PreSaleTimer from '@/components/ViewPool/PreSaleTimer';
import LaunchpadProgress from '@/components/ViewPool/LaunchpadProgress';
import { extractAddressFromPathname } from '@/utils/extractAddressFromPathname';
import { useGetLaunchpadDetails } from '@/hooks/useGetLaunchpad';
import DetailCardIntegration from '@/components/ViewPool/DetailsCardIntegration';
import NoData from '@/components/NoData/NoData';
import LaunchpadDetailCard from '@/components/ViewPool/component/LaunchpadDetailCard';
import { usePathname, useParams } from 'next/navigation';
import {
    useFairLaunchContract,
    useLaunchpadContract,
    useSubscriptionContract,
} from '@/hooks/useContract';
import { Address } from 'viem';
import { useAccount, useContractReads } from 'wagmi';
import useForceUpdate from '@/hooks/useForceUpdate';
import LaunchpadAdmin from '@/components/ViewPool/LaunchpadAdmin';
import { useRouter } from 'next/router';
import { LaunchpadType } from '@/components/ViewPool/types';
import FairLaunchPreSaleTimer from '@/components/ViewPool/component/FairlaunchComponents/FairLaunchPreSaleTimer';
import BuybackDetails from '@/components/ViewPool/component/FairlaunchComponents/BuybackToken';
import useFairLaunchBuyback from '@/components/ViewPool/hooks/fairlaunchHooks/useFairLaunchBuybackDetails';
import FairLaunchProgress from '@/components/ViewPool/component/FairlaunchComponents/FairlaunchProgress';
import AffiliateProgram from '@/components/ViewPool/component/AffiliateProgram';
import SubscriptionDetailCard from '@/components/ViewPool/component/SubscriptionPool/SubscriptionDetailCard';
import SubscriptionPreSaleTimer from '@/components/ViewPool/component/SubscriptionPool/SubscriptionPresaleTimer';
import SubscriptionAdminPanel from '@/components/ViewPool/component/SubscriptionPool/SubscriptionAdminPanel';
import SubscriptionProgress from '@/components/ViewPool/component/SubscriptionPool/SubscriptionProgress';
import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import LockRecord from '@/components/LaunchpadForm/LockRecord';
import PreviousPresales from '@/components/LaunchpadForm/PreviousPresales';
import { DynamicPageProps } from '@/constants/types';
import SubsDetailsSkeleton from '@/components/Skeletons/SubsDetailsSkeleton';
import { useMediaQuery } from '@mui/material';

const centeredContainer = {
    height: '70vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const SubsDetails = ({ params }: DynamicPageProps) => {
    const address = params.slug as Address;
    const launchpadContract = useSubscriptionContract(address);
    const forceUpdate = useForceUpdate();

    // fetching data from backend
    const { data, refetch, isLoading, isError, error, isFetching } =
        useGetLaunchpadDetails(address);

    const { tracking: launchpadTracking } = useTransactionTracking('launchpad-created', {
        onCompleted: () => refetch(),
    });

    const name = data?.launchPads?.[0]?.name;
    const tokenAddress = data && data.launchPads[0]?.token?.id;
    const userAddress = data && data.launchPads[0]?.owner?.id;
    const loading = isLoading || launchpadTracking;

    const { data: contractData } = useContractReads({
        contracts: [
            { ...launchpadContract, functionName: 'owner' },
            // { ...launchpadContract, functionName: 'isAffiliate' },
            // { ...launchpadContract, functionName: 'getTotalSaleTokens' },
        ],
        // watch: true,
    });

    const launchpadOwner = contractData?.[0].result as Address;
    // const isAffiliate = (contractData?.[1].result as boolean) ?? false;
    // const tokenForPreSale = (contractData?.[2].result as bigint) ?? 0n;

    React.useEffect(() => {
        forceUpdate();
    }, [address, forceUpdate]);
    const isMobile = useMediaQuery('(max-width:1250px)');

    return (
        <>
            <Box sx={{ height: '100%' }}>
                {loading && (
                    <SubsDetailsSkeleton />
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
                            <SubscriptionDetailCard data={data} address={address} />
                            <PreviousPresales
                                userAddress={userAddress}
                                currentPresaleAddress={address}
                            />
                            <LockRecord tokenAddress={tokenAddress} />
                            <FAQ />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <SubscriptionPreSaleTimer launchpadAddress={address} />
                            <SubscriptionProgress launchpadAddress={address} />
                            <SubscriptionAdminPanel
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

export default SubsDetails;
