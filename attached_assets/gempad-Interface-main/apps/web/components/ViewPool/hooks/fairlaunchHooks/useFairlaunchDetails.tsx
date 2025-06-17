// @ts-nocheck

import { useFairLaunchContract, useLaunchpadContract } from '@/hooks/useContract';
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

const useFairLaunchDetails = (launchpadAddress: Address) => {
    const launchpadContract = useFairLaunchContract(launchpadAddress);

    const {
        data,
        isFetched,
        isLoading,
        error,
        refetch: refetchFairLaunchDetail,
    } = useContractReads({
        contracts: [
            { ...launchpadContract, functionName: 'pool' },
            { ...launchpadContract, functionName: 'totalRaised' },
            { ...launchpadContract, functionName: 'getAllReferrers' },
            { ...launchpadContract, functionName: 'getCurrentStatus' },
            { ...launchpadContract, functionName: 'getCurrentMode' },
            { ...launchpadContract, functionName: 'totalReward' },
        ],
        watch: true,
    });
    const {
        fundTokenDecimals,
        fundTokenSymbol,
        isNative: isNativeFundToken,
        fundTokenAddress,
        balance: fundTokenBalance,
        isLoading: fundTokenLoading,
    } = useFundTokenDetails(launchpadAddress);

    const fairLaunchResult = data?.[0]?.result;
    const totalRaised = data?.[1]?.result;
    const allReferrers = data?.[2]?.result;
    const currentLaunchpadStatus = data?.[3].result;
    const currentSaleModeBigInt = (data?.[4].result as number) ?? 0;
    const totalReward = (data?.[5].result as bigint) ?? 0;

    const currentSaleMode = useMemo(
        () => mapBigIntToSaleMode(currentSaleModeBigInt),
        [currentSaleModeBigInt],
    );

    let token: Address;
    let totalsellTokens: bigint;
    let softCap: bigint;
    let isMaxLimit: boolean;
    let maxLimit: bigint;
    let startTime: bigint;
    let endTime: bigint;
    let finalizeTime: bigint;
    let publicSaleTime: bigint;
    let isAffiliate: boolean;
    let affiliateReward: bigint;

    if (fairLaunchResult) {
        [
            token,
            totalsellTokens,
            softCap,
            isMaxLimit,
            maxLimit,
            startTime,
            endTime,
            finalizeTime,
            publicSaleTime,
            isAffiliate,
            affiliateReward,
        ] = fairLaunchResult;
    } else {
        console.info('launchpad details error');
        token = '';
        totalsellTokens = 0n;
        softCap = 0n;
        isMaxLimit = false;
        maxLimit = 0n;
        startTime = 0n;
        endTime = 0n;
        finalizeTime = 0n;
        publicSaleTime = 0n;
        isAffiliate = false;
        affiliateReward = 0n;
    }

    const useTokenDetails = useTokenInformation(token);
    const { decimals: tokenDecimals, symbol, name, totalSupply } = useTokenDetails;

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

    // const hardCapNum = +formatUnits(hardCap ?? 0n, fundTokenDecimals ?? 18);
    const softCapNum = +formatUnits(softCap ?? 0n, fundTokenDecimals ?? 18);
    const totalRaisedNum = +formatUnits(totalRaised ?? 0n, fundTokenDecimals ?? 18);
    // const percentageBetweenCaps = (totalRaisedNum / hardCapNum) * 100;
    const maxBuyLimit = +formatUnits(maxLimit, fundTokenDecimals ?? 18);
    const totalRewards = +formatUnits(totalReward, fundTokenDecimals ?? 18);

    return {
        fundTokenSymbol,
        isNativeFundToken,
        fundTokenAddress,
        fundTokenBalance,
        fundTokenLoading,
        totalsellTokens,
        isAffiliate,
        launchpadAddress,
        token,
        softCap,
        isMaxLimit,
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
        refetchFairLaunchDetail,
        startsIn,
        endsIn,
        currentTime,
        endTimeMoment,
        startTimeMoment,
        hasEnded,
        hasStarted,
        totalRewards,
        counterStart,
        counterEnd,
        softCapNum,
        totalRaisedNum,
        allReferrers,
        affiliatePercentage,
        affiliateReward,
        currentLaunchpadStatus,
        currentSaleMode,
    };
};

export default useFairLaunchDetails;
