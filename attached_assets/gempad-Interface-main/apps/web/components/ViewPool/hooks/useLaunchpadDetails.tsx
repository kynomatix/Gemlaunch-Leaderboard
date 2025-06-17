// @ts-nocheck

import { useLaunchpadContract } from '@/hooks/useContract';
import useTokenInformation from '@/hooks/useTokenInformation';
import { useSingleCallResult } from '@/state/multicall/hooks';
import dayjs from 'dayjs';
import moment from 'moment';
import { parseUnits, formatEther, formatUnits, Address } from 'viem';
import { useAccount, useContractReads } from 'wagmi';
import { LaunchpadSaleStatus, LaunchpadSaleMode, UserInfoDetails, VestingDetails } from '../types';
import { mapBigIntToSaleMode } from '../utils';
import useFundTokenDetails from './useFundTokenDetails';

const useLaunchpadDetails = (launchpadAddress: Address) => {
    const launchpadContract = useLaunchpadContract(launchpadAddress);

    const { data, isFetched, isLoading, error } = useContractReads({
        contracts: [
            { ...launchpadContract, functionName: 'pool' },
            { ...launchpadContract, functionName: 'totalRaised' },
            { ...launchpadContract, functionName: 'affiliateReward' },
            { ...launchpadContract, functionName: 'getAllReferrers' },
            { ...launchpadContract, functionName: 'getCurrentStatus' },
            { ...launchpadContract, functionName: 'getCurrentMode' },
        ],
        watch: true,
    });


    const { fundTokenDecimals } = useFundTokenDetails(launchpadAddress);

    const launchpadResult = data?.[0]?.result;
    const totalRaised = data?.[1]?.result;
    const affiliateReward = data?.[2]?.result;
    const allReferrers = data?.[3]?.result;
    const currentLaunchpadStatus = data?.[4]?.result;
    const currentSaleModeBigInt = data?.[5]?.result;

    const currentSaleMode =
        currentSaleModeBigInt !== undefined
            ? mapBigIntToSaleMode(currentSaleModeBigInt)
            : undefined;

    let token: Address;
    let sellPrice: bigint;
    let listingPrice: bigint;
    let softCap: bigint;
    let hardCap: bigint | null;
    let minBuyLimit: bigint;
    let maxLimit: bigint;
    let startTime: bigint;
    let endTime: bigint;
    let finalizeTime: bigint;
    let publicSaleTime: bigint;

    if (launchpadResult) {
        [
            token,
            sellPrice,
            listingPrice,
            softCap,
            hardCap,
            minBuyLimit,
            maxLimit,
            startTime,
            endTime,
            finalizeTime,
            publicSaleTime,
        ] = launchpadResult;
    } else {
        console.info('launchpad details error', { data });
        token = '';
        sellPrice = 0n;
        listingPrice = 0n;
        softCap = 0n;
        hardCap = 0n;
        minBuyLimit = 0n;
        maxLimit = 0n;
        startTime = 0n;
        endTime = 0n;
        finalizeTime = 0n;
        publicSaleTime = 0n;
    }

    const useTokenDetails = useTokenInformation(token);
    const { decimals: tokenDecimals, symbol } = useTokenDetails;

    const affiliatePercentage = Number(affiliateReward) / 1e3;

    const currentTime = moment();
    const startTimeMoment = moment.unix(Number(startTime));
    const endTimeMoment = moment.unix(Number(endTime));
    const startsIn = moment.duration(startTimeMoment.diff(currentTime));
    const endsIn = moment.duration(endTimeMoment.diff(currentTime));
    const hasStarted = currentTime.isAfter(startTimeMoment);
    const hasEnded = currentTime.isAfter(endTimeMoment);
    const counterStart = dayjs.unix(Number(startTime));
    const counterEnd = dayjs.unix(Number(endTime));

    const saleActive = () => hasStarted && !hasEnded;

    const hardCapNum = +formatUnits(hardCap ?? 0n, fundTokenDecimals ?? 18);
    const softCapNum = +formatUnits(softCap ?? 0n, fundTokenDecimals ?? 18);
    const totalRaisedNum = +formatUnits(totalRaised ?? 0n, fundTokenDecimals ?? 18);
    const percentageBetweenCaps = (totalRaisedNum / hardCapNum) * 100;
    const maxBuyLimit = +formatUnits(maxLimit, fundTokenDecimals ?? 18);

    return {
        launchpadAddress,
        token,
        sellPrice,
        listingPrice,
        softCap,
        hardCap,
        minBuyLimit,
        maxBuyLimit,
        startTime,
        endTime,
        finalizeTime,
        publicSaleTime,
        tokenDecimals,
        symbol,
        isFetched,
        isLoading,
        launchpadContract,
        saleActive,
        startsIn,
        endsIn,
        currentTime,
        endTimeMoment,
        startTimeMoment,
        hasEnded,
        hasStarted,
        counterStart,
        counterEnd,
        hardCapNum,
        softCapNum,
        totalRaisedNum,
        allReferrers,
        affiliatePercentage,
        affiliateReward,
        currentLaunchpadStatus,
        currentSaleMode,
        // claimTime,
    };
};

export default useLaunchpadDetails;
