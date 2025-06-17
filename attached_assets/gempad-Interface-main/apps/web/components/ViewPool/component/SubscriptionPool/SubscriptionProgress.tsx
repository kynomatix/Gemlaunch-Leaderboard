'use client';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    LinearProgress,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment';
import { getProgress } from '@/utils/getProgress';
import { Address, formatUnits } from 'viem';
import { useAccount, useContractReads } from 'wagmi';
import React from 'react';
import useSubscriptionDetails from '../../hooks/subscriptionHoosk/useSubscriptionDetails';
import useFundTokenDetails from '../../hooks/useFundTokenDetails';
import useLaunchpadUserInfo from '../../hooks/useLaunchpadUserInfo';
import { getStatusString } from '../../utils';
import PrimaryCard from '@/components/Cards/PrimaryCard';
import LaunchpadProgressAccordion from '../../LaunchpadProgressAccordion';
import useSubscriptionPoolDistribution from '../../hooks/subscriptionHoosk/useSubscriptionPoolDistribution';
import useSubscriptionPoolUserInfo from '../../hooks/subscriptionHoosk/useSubscriptionPoolUserInfo';
import { useSingleContractMultipleData } from '@/state/multicall/hooks';
import { useSubscriptionContract } from '@/hooks/useContract';

function calculateFundTokenAmount(tokens, tokenBNBRate) {
    const bnbAmount = (tokens / tokenBNBRate).toFixed(5);
    return parseFloat(bnbAmount);
}

// const TNNTokenAmount = 20;
// const TNNBNBRate = 31; // 31 TNN tokens equal to 1 BNB

// const bnbAmountForTNNTokens = calculateBNBAmount(TNNTokenAmount, TNNBNBRate);

function calculateTokenAmount(bnbAmount, tokenBNBRate) {
    const tokenAmount = (bnbAmount * tokenBNBRate).toFixed(2);
    return parseFloat(tokenAmount);
}

// Example usage:
// const bnbAmount = 0.0234;
// const TNNBNBRate = 31; // 31 TNN tokens equal to 1 BNB?
// const tokenAmountForBNB = calculateTokenAmount(bnbAmount, TNNBNBRate);

const SubscriptionProgress: React.FC<{ launchpadAddress: Address }> = ({ launchpadAddress }) => {
    const { address } = useAccount();
    const {
        hasEnded,
        hasStarted,
        currentTime,
        endTimeMoment,
        saleActive,
        startTimeMoment,
        currentLaunchpadStatus,
        hardCapNum,
        currentSaleMode,
        maxBuyLimit,
        totalRaisedNum,
        tokenDecimals,
        isLoading,
        sellRateNum,
        symbol,
        launchpadContract,
        canCalculate,
    } = useSubscriptionDetails(launchpadAddress);

    const {
        userInfo,
        isLoading: userInfoLoading,
        refetch: refetchUserInfo,
    } = useSubscriptionPoolUserInfo(launchpadAddress);
    const { userInvest, userDeposit, userAllocation, userClaimed } = userInfo;

    const { fundTokenDecimals, fundTokenSymbol } = useFundTokenDetails(launchpadAddress);

    const [totalAllocated, surplusTokens, totalSurplusFunds] =
        useSubscriptionPoolDistribution(launchpadAddress);


    const maxAllocation = +formatUnits(totalAllocated ?? 0n, fundTokenDecimals ?? 18);
    const uAllocation = +formatUnits(userAllocation ?? 0n, fundTokenDecimals ?? 18);

    const allocationRatio = (uAllocation / maxAllocation) * 100;

    const {
        data,
        isLoading: userLoading,
        refetch,
    } = useContractReads({
        contracts: [{ ...launchpadContract, functionName: 'getAllInvestors' }],
    });

    const participants = (data?.[0]?.result as Address[]) ?? [];

    const subscriptionPoolContract = useSubscriptionContract(launchpadAddress);
    const response = useSingleContractMultipleData({
        contract: {
            abi: subscriptionPoolContract.abi,
            address: subscriptionPoolContract.address,
        },
        functionName: 'userInfo',
        args: participants ? participants.map((x) => [x] as [`0x${string}`]) : [],
    });

    const userDetails = response?.map((x) => x.result);
    const totalInvestedAmount = userDetails?.reduce(
        (acc, x) => acc + +formatUnits(x?.[0] ?? 0n, fundTokenDecimals ?? 18),
        0,
    );

    const userPurchased = !userInfoLoading && userInvest;

    const userPurchasedFormat = formatUnits(userPurchased ?? 0n, fundTokenDecimals ?? 18);

    const commitmentRatio = (+userPurchasedFormat / totalInvestedAmount) * 100;

    const loading = isLoading && userInfoLoading;

    const totalDuration = moment.duration(endTimeMoment.diff(startTimeMoment)).asMilliseconds();
    const elapsedDuration = currentTime.diff(startTimeMoment);
    const progress = Math.min((elapsedDuration / totalDuration) * 100, 100);

    const currentRaised = totalRaisedNum
        ? `${totalRaisedNum.toFixed(3)} ${fundTokenSymbol} (${(
            (totalRaisedNum / hardCapNum) *
            100
        ).toFixed(3)}%)`
        : 0;

    const statics = [
        {
            display: true,
            property: 'Status',
            value: getStatusString(currentLaunchpadStatus, hasStarted, hasEnded),
        },

        { display: true, property: 'Sale Type', value: currentSaleMode },

        { display: canCalculate, property: 'Current Raised', value: currentRaised },

        {
            display: true,
            property: 'Hard Cap Per User',
            value: `${calculateTokenAmount(maxBuyLimit, sellRateNum)} ${symbol}  (${maxBuyLimit} ${fundTokenSymbol ?? 'ETH'
                }) `,
        },

        { display: true, property: 'Participants', value: `${participants?.length}` },

        {
            display: canCalculate,
            property: 'Max Allocation Required',
            value: `${maxAllocation} ${fundTokenSymbol}`,
        },
    ];


    const modifiedStatics =
        userPurchased > 0
            ? [
                ...statics,
                {
                    display: true,
                    property: 'You Committed',
                    value: `${calculateTokenAmount(userPurchasedFormat, sellRateNum)} ${symbol}`,
                },

                {
                    display: true,
                    property: 'Commitment Ratio	',
                    value: `${isNaN(commitmentRatio) || commitmentRatio === Infinity
                            ? 0
                            : commitmentRatio
                        }%`,
                },

                {
                    display: true,
                    property: 'Allocation Ratio	',
                    value: `${isNaN(allocationRatio) ? 0 : allocationRatio} %`,
                },

                {
                    display: true,
                    property: 'You purchased',
                    value: `${calculateTokenAmount(userPurchasedFormat, sellRateNum)} ${symbol}`,
                },

                {
                    display: true,
                    property: 'You paid',
                    value: `${userPurchasedFormat} ${fundTokenSymbol}`,
                },
            ]
            : statics;

    React.useEffect(() => {
        refetchUserInfo();
    }, [address, refetchUserInfo]);

    return (
        <PrimaryCard mt={20} sx={{ paddingTop: '25px' }}>
            <Box sx={{ px: '10px' }}>
                <LinearProgress
                    variant="determinate"
                    value={saleActive ? getProgress(elapsedDuration, totalDuration) : 0}
                    sx={{
                        backgroundColor: '#121212',
                        '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(270deg, #4AC774 0%, #243834 101.85%)',
                        },
                        borderRadius: '10px',
                    }}
                />
            </Box>

            <Accordion
                elevation={0}
                sx={{
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    background: 'transparent',
                    border: 0,
                    width: '100%',
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                    sx={{ alignSelf: 'center' }}
                ></AccordionSummary>
                <AccordionDetails sx={{ px: '0px' }}>
                    <LaunchpadProgressAccordion
                        hasEnded={hasEnded}
                        hasStarted={hasStarted}
                        endTimeMoment={endTimeMoment}
                        startTimeMoment={startTimeMoment}
                    />
                </AccordionDetails>
            </Accordion>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                }}
            >
                {modifiedStatics.map(({ property, value, display }, key) => {
                    const isLast = key === statics.length - 1;
                    return (
                        <>
                            {display && (
                                <Box
                                    key={property}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderBottom: isLast ? 'none' : '1px solid #ffffff30',
                                        pb: '3px',
                                    }}
                                >
                                    <Typography fontSize="12px">{property}</Typography>
                                    <Typography fontSize="12px" sx={{ whiteSpace: 'nowrap' }}>
                                        {String(value)}
                                    </Typography>
                                </Box>
                            )}
                        </>
                    );
                })}
            </Box>
        </PrimaryCard>
    );
};

export default SubscriptionProgress;
