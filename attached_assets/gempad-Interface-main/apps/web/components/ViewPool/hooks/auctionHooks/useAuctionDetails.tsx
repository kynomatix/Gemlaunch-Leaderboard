// @ts-nocheck

import {
    useDutchAuctionContract,
    useFairLaunchContract,
    useLaunchpadContract,
} from '@/hooks/useContract';
import useTokenInformation from '@/hooks/useTokenInformation';
import { useSingleCallResult } from '@/state/multicall/hooks';
import dayjs from 'dayjs';
import moment from 'moment';
import { parseUnits, formatEther, formatUnits, Address } from 'viem';
import { useAccount, useContractReads } from 'wagmi';
import {
    LaunchpadSaleStatus,
    LaunchpadSaleMode,
    UserInfoDetails,
    VestingDetails,
} from '../../types';
import { mapBigIntToSaleMode } from '../../utils';
import useFundTokenDetails from '../useFundTokenDetails';
import { useMemo } from 'react';

const useAuctionDetails = (launchpadAddress: Address) => {
    const launchpadContract = useDutchAuctionContract(launchpadAddress);

    const {
        data,
        isFetched,
        isLoading,
        error,
        refetch: refetchDutchAuction,
    } = useContractReads({
        contracts: [
            { ...launchpadContract, functionName: 'pool' },
            { ...launchpadContract, functionName: 'totalRaised' },
            { ...launchpadContract, functionName: 'getCurrentStatus' },
            { ...launchpadContract, functionName: 'getCurrentMode' },
        ],
        watch: true,
    });

    const { fundTokenDecimals } = useFundTokenDetails(launchpadAddress);

    const auctionResult = data?.[0].result;
    const totalRaised = data?.[1].result;
    const currentLaunchpadStatus = data?.[2].result;
    const currentSaleModeBigInt = (data?.[3].result as number) ?? 0;

    const currentSaleMode = useMemo(
        () => mapBigIntToSaleMode(currentSaleModeBigInt),
        [currentSaleModeBigInt],
    );

    let token: Address;
    let tokenForPreSale: bigint;
    let startPrice: bigint;
    let endPrice: bigint;
    let softCap: bigint;
    let hardCap: bigint;
    let minBuyLimit: bigint;
    let maxLimit: bigint;
    let startTime: bigint;
    let endTime: bigint;
    let finalizeTime: bigint;
    let publicSaleTime: bigint;
    let decreaseInterval: bigint;

    if (auctionResult) {
        [
            token,
            tokenForPreSale,
            startPrice,
            endPrice,
            softCap,
            hardCap,
            minBuyLimit,
            maxLimit,
            startTime,
            endTime,
            finalizeTime,
            publicSaleTime,
            decreaseInterval,
        ] = auctionResult;
    } else {
        console.info('launchpad details error');
        token = '';
        tokenForPreSale = 0n;
        startPrice = 0n;
        endPrice = 0n;
        softCap = 0n;
        hardCap = 0n;
        minBuyLimit = 0n;
        maxLimit = 0n;
        startTime = 0n;
        endTime = 0n;
        finalizeTime = 0n;
        publicSaleTime = 0n;
        decreaseInterval = 0n;
    }

    const useTokenDetails = useTokenInformation(token);
    const { decimals: tokenDecimals, symbol, name, totalSupply } = useTokenDetails;

    const currentTime = moment();
    const startTimeMoment = moment.unix(Number(startTime));
    const endTimeMoment = moment.unix(Number(endTime));
    const decreaseIntervalMoment = moment.unix(Number(decreaseInterval));
    const startsIn = moment.duration(startTimeMoment.diff(currentTime));
    const endsIn = moment.duration(endTimeMoment.diff(currentTime));
    const hasStarted = currentTime.isAfter(startTimeMoment);
    const hasEnded = currentTime.isAfter(endTimeMoment);
    const counterStart = dayjs.unix(Number(startTime));
    const counterEnd = dayjs.unix(Number(endTime));
    const finalizeTimeMoment = moment.unix(Number(finalizeTime));
    const publicSaleTimeMoment = moment.unix(Number(publicSaleTime));

    const startPriceNum = +formatUnits(startPrice ?? 0n, fundTokenDecimals ?? 18);
    const endPriceNum = +formatUnits(endPrice ?? 0n, fundTokenDecimals ?? 18);
    const minBuyLimitNum = +formatUnits(minBuyLimit ?? 0n, fundTokenDecimals ?? 18);

    const saleActive = () => hasStarted && !hasEnded;

    const hardCapNum = +formatUnits(hardCap ?? 0n, fundTokenDecimals ?? 18);
    const softCapNum = +formatUnits(softCap ?? 0n, fundTokenDecimals ?? 18);
    const totalRaisedNum = +formatUnits(totalRaised ?? 0n, fundTokenDecimals ?? 18);
    // const percentageBetweenCaps = (totalRaisedNum / hardCapNum) * 100;
    const maxBuyLimit = +formatUnits(maxLimit, fundTokenDecimals ?? 18);
    const tokenForPreSaleNum = +formatUnits(tokenForPreSale, fundTokenDecimals ?? 18);

    return {
        startPriceNum,
        endPriceNum,
        endPrice,
        tokenForPreSale,
        tokenForPreSaleNum,
        startPrice,
        launchpadAddress,
        token,
        softCap,
        softCapNum,
        hardCap,
        hardCapNum,
        maxBuyLimit,
        minBuyLimit,
        minBuyLimitNum,
        startTime,
        endTime,
        finalizeTime,
        finalizeTimeMoment,
        publicSaleTime,
        publicSaleTimeMoment,
        tokenDecimals,
        symbol,
        tokenName: name,
        isFetched,
        isLoading,
        launchpadContract,
        saleActive,
        refetchDutchAuction,
        startsIn,
        endsIn,
        currentTime,
        endTimeMoment,
        startTimeMoment,
        hasEnded,
        hasStarted,
        counterStart,
        counterEnd,
        totalRaisedNum,
        currentLaunchpadStatus,
        currentSaleMode,
        fundTokenDecimals,
        decreaseInterval,
        decreaseIntervalMoment,
    };
};

export default useAuctionDetails;
