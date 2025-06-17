// @ts-nocheck

import { useLaunchpadContract, useSubscriptionContract } from '@/hooks/useContract';
import useTokenInformation from '@/hooks/useTokenInformation';
import { useSingleCallResult } from '@/state/multicall/hooks';
import dayjs from 'dayjs';
import moment from 'moment';
import { parseUnits, formatEther, formatUnits, Address } from 'viem';
import { useAccount, useContractReads } from 'wagmi';
import { LaunchpadSaleStatus, LaunchpadSaleMode, UserInfoDetails, VestingDetails } from '../types';
import { mapBigIntToSaleMode } from '../../utils';
import useFundTokenDetails from '../useFundTokenDetails';

const useSubscriptionDetails = (launchpadAddress: Address) => {
    const launchpadContract = useSubscriptionContract(launchpadAddress);

    const { data, isFetched, isLoading, error } = useContractReads({
        contracts: [
            { ...launchpadContract, functionName: 'pool' },
            { ...launchpadContract, functionName: 'totalRaised' },
            { ...launchpadContract, functionName: 'getCurrentStatus' },
            { ...launchpadContract, functionName: 'getCurrentMode' },
            { ...launchpadContract, functionName: 'totalContribution' },
            { ...launchpadContract, functionName: 'getAllInvestors' },
            { ...launchpadContract, functionName: 'canCalculate' },
            { ...launchpadContract, functionName: 'canFinalize' },
        ],
        watch: true,
    });

    const { fundTokenDecimals } = useFundTokenDetails(launchpadAddress);

    const launchpadResult = data?.[0].result;
    const totalRaised = data?.[1].result;
    const currentLaunchpadStatus = data?.[2].result as number;
    const currentSaleModeBigInt = data?.[3].result;
    const totalContribution = data?.[4].result;
    const allInvestors = data?.[5].result;
    const canCalculate = data?.[6].result;
    const canFinalize = data?.[7].result;

    const currentSaleMode =
        currentSaleModeBigInt !== undefined
            ? mapBigIntToSaleMode(currentSaleModeBigInt)
            : undefined;

    let token: Address;
    let hardCap: bigint;
    let softCap: bigint;
    let maxLimit: bigint;
    let sellRate: bigint;
    let listingRate: bigint;
    let startTime: bigint;
    let endTime: bigint;
    let finalizeTime: bigint;
    let publicSaleTime: bigint;

    if (launchpadResult) {
        [
            token,
            hardCap,
            softCap,
            maxLimit,
            sellRate,
            listingRate,
            startTime,
            endTime,
            finalizeTime,
            publicSaleTime,
        ] = launchpadResult;
    } else {
        console.info('launchpad details error');
        token = '';
        hardCap = 0n;
        softCap = 0n;
        maxLimit = 0n;
        sellRate = 0n;
        listingRate = 0n;
        startTime = 0n;
        endTime = 0n;
        finalizeTime = 0n;
        publicSaleTime = 0n;
    }

    const useTokenDetails = useTokenInformation(token);
    const { decimals: tokenDecimals, symbol } = useTokenDetails;

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
    const totalContributionNum = +formatUnits(totalContribution ?? 0n, fundTokenDecimals ?? 18);
    const percentageBetweenCaps = (totalRaisedNum / hardCapNum) * 100;
    const maxBuyLimit = +formatUnits(maxLimit, fundTokenDecimals ?? 18);
    const sellRateNum = +formatUnits(sellRate, fundTokenDecimals ?? 18);
    const listingRateNum = +formatUnits(listingRate, fundTokenDecimals ?? 18);

    return {
        canCalculate,
        canFinalize,
        launchpadAddress,
        token,
        sellRate,
        sellRateNum,
        listingRate,
        listingRateNum,
        softCap,
        hardCap,
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
        totalRaised,
        currentLaunchpadStatus,
        currentSaleMode,
        currentSaleModeBigInt,
        totalContribution,
        totalContributionNum,
        allInvestors,
        // claimTime,
    };
};

export default useSubscriptionDetails;
