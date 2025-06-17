'use client';
import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import PreSaleTimer from '@/components/ViewPool/PreSaleTimer';
import LaunchpadProgress from '@/components/ViewPool/LaunchpadProgress';
import { useGetLaunchpadDetails } from '@/hooks/useGetLaunchpad';
import NoData from '@/components/NoData/NoData';
import { useDutchAuctionContract } from '@/hooks/useContract';
import { Address } from 'viem';
import { useAccount, useContractReads } from 'wagmi';
import useForceUpdate from '@/hooks/useForceUpdate';
import AuctionDetailCard from '@/components/ViewPool/component/AuctionComponents/AuctionDetailCard';
import AuctionAdminPanel from '@/components/ViewPool/component/AuctionComponents/AuctionAdminPanel';
import AuctionPresSaleTimer from '@/components/ViewPool/component/AuctionComponents/AuctionPreSaleTimer';
import AuctionProgress from '@/components/ViewPool/component/AuctionComponents/AuctionProgress';
import useAuctionDetails from '@/components/ViewPool/hooks/auctionHooks/useAuctionDetails';
import moment, { Moment } from 'moment';
import ChartContainer from '@/components/ViewPool/component/AuctionComponents/ChartContainer';
import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import FAQ from '@/components/ViewPool/FAQ';
import LockRecord from '@/components/LaunchpadForm/LockRecord';
import PreviousPresales from '@/components/LaunchpadForm/PreviousPresales';
import { DynamicPageProps } from '@/constants/types';
import DutchDetailsSkeleton from '@/components/Skeletons/DutchDetailsSkeleton';
import { useMediaQuery } from '@mui/material';
import Chart from '@/components/ViewPool/component/Chart';
import { useSingleCallResult } from '@/state/multicall/hooks';

const centeredContainer = {
    height: '70vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

interface ICurrentPriceCalculation {
    tokenForPreSaleNum: number;
    softCapNum: number;
    hardCapNum: number;
    fundTokenDecimals: number;
    startTimeMoment: Moment;
    endTimeMoment: Moment;
    decreaseIntervalMoment: Moment;
}

interface ICurrentPriceCalculation {
    tokenForPreSaleNum: number;
    softCapNum: number;
    hardCapNum: number;
    fundTokenDecimals: number;
    startTimeMoment: Moment;
    endTimeMoment: Moment;
    decreaseIntervalMoment: Moment;
}

const calculateAuctionTokenCurrentPrice = (data: ICurrentPriceCalculation) => {
    const currentTime = moment().unix(); // Get current Unix timestamp

    const {
        fundTokenDecimals,
        endTimeMoment,
        decreaseIntervalMoment,
        hardCapNum,
        softCapNum,
        startTimeMoment,
        tokenForPreSaleNum,
    } = data;

    const endPrice = (tokenForPreSaleNum * fundTokenDecimals) / softCapNum;
    const startPrice = (tokenForPreSaleNum * fundTokenDecimals) / hardCapNum;
    const totalIntervals =
        (endTimeMoment.unix() - startTimeMoment.unix()) / decreaseIntervalMoment.unix();

    const reductionAmount = (endPrice - startPrice) / totalIntervals;

    let intervalsElapsed = (currentTime - startTimeMoment.unix()) / decreaseIntervalMoment.unix();

    if (intervalsElapsed > totalIntervals) {
        intervalsElapsed = totalIntervals;
    }

    if (intervalsElapsed <= 0) {
        return startPrice;
    }

    const newPrice = startPrice + reductionAmount * intervalsElapsed;
    return newPrice;
};

// function calculateCurrentPrice() internal view returns(uint256) {
//       uint256 endPrice = (auction.totalSaleAmount * (10 ** decimals)) / auction.softCap;
//       uint256 startPrice = (auction.totalSaleAmount * (10 ** decimals)) / auction.hardCap;

//       uint256 totalIntervals = (auction.endTime - auction.startTime) / auction.decreaseInterval;

//       uint256 reductionAmount = (endPrice - startPrice) / totalIntervals;

//       uint256 intervalsElapsed = (block.timestamp - auction.startTime) / auction.decreaseInterval;

//   if (intervalsElapsed > totalIntervals) {
//     intervalsElapsed = totalIntervals;
//   }

//   if (intervalsElapsed <= 0) {
//     return startPrice;
//   } else {
//           uint256 newPrice = startPrice + (reductionAmount * intervalsElapsed);
//     return newPrice;
//   }
// }

const DutchDetails = ({ params }: DynamicPageProps) => {
    const { isConnecting:walletLoading  , address:walletAddress} = useAccount();

    const address = params.slug as Address;
    const launchpadContract = useDutchAuctionContract(address);
    const forceUpdate = useForceUpdate();

    // fetching data from backend
    const { data, refetch, isLoading, isError, error, isFetching } =
        useGetLaunchpadDetails(address);

    const {
        tokenForPreSaleNum,
        fundTokenDecimals,
        softCapNum,
        hardCapNum,
        endTimeMoment,
        startTimeMoment,
        decreaseIntervalMoment,
    } = useAuctionDetails(address);

    const { tracking: launchpadTracking } = useTransactionTracking('launchpad-created', {
        onCompleted: () => refetch(),
    });

    const currentRate = useMemo(() => {
        return calculateAuctionTokenCurrentPrice({
            tokenForPreSaleNum,
            softCapNum,
            hardCapNum,
            fundTokenDecimals,
            startTimeMoment,
            endTimeMoment,
            decreaseIntervalMoment,
        });
    }, [
        decreaseIntervalMoment,
        endTimeMoment,
        fundTokenDecimals,
        hardCapNum,
        softCapNum,
        startTimeMoment,
        tokenForPreSaleNum,
    ]);

    const name = data?.launchPads?.[0]?.name;
    const userAddress = data && data.launchPads[0]?.owner?.id;
    const loading = isLoading || launchpadTracking;

    // const { data: contractData } = useContractReads({
    //     contracts: [{ ...launchpadContract, functionName: 'owner' }],
    //     // watch: true,
    // });

    const { result } = useSingleCallResult({
        contract: launchpadContract,
        functionName: 'owner',
    });

    // const launchpadOwner: Address = contractData?.[0].result;
    const launchpadOwner = result as Address;
    const tokenAddress = data && data.launchPads[0]?.token?.id;

    React.useEffect(() => {
        forceUpdate();
    }, [address, forceUpdate]);
    const isMobile = useMediaQuery('(max-width:1460px)');

    if(walletLoading) return <DutchDetailsSkeleton />;
    return (
        <>
            <Box sx={{ height: '100%' }}>
                {loading && <DutchDetailsSkeleton />}
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
                            <AuctionDetailCard data={data} address={address} />
                            <PreviousPresales
                                userAddress={userAddress}
                                currentPresaleAddress={address}
                            />
                            <LockRecord tokenAddress={tokenAddress} />
                            <FAQ />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            {/* ///// */}
                            <AuctionPresSaleTimer launchpadAddress={address} />  
                            <ChartContainer launchpadAddress={address} />
                            {/* ///// */}
                            {walletAddress && <AuctionProgress launchpadAddress={address} />}
                            <AuctionAdminPanel
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

export default DutchDetails;
