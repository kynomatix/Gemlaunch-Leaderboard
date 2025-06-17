'use client';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    LinearProgress,
    Skeleton,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PrimaryCard from '../Cards/PrimaryCard';
import LaunchpadProgressAccordion from './LaunchpadProgressAccordion';
import moment from 'moment';
import { getProgress } from '@/utils/getProgress';
import { LaunchpadSaleStatus } from './types';
import useLaunchpadVestingDetails from './hooks/useLaunchpadVesting';
import { Address, formatUnits } from 'viem';
import { useAccount, useContractReads } from 'wagmi';
import useLaunchpadUserInfo from './hooks/useLaunchpadUserInfo';
import useFundTokenDetails from './hooks/useFundTokenDetails';
import useLaunchpadDetails from './hooks/useLaunchpadDetails';
import { calculateVesting } from '@/utils/calculateVesting';
import { calculateVestingCycle } from '@/utils/calculateVestingCycle';
import { getStatusString } from './utils';
import React from 'react';

function truncateDecimal(value) {
    const decimalIndex = value.indexOf('.');
    if (decimalIndex !== -1) {
        const decimalPlaces = value.length - decimalIndex - 1;
        return parseFloat(value).toFixed(decimalPlaces);
    }
    return value;
}

const LaunchpadProgress: React.FC<{ launchpadAddress: Address }> = ({ launchpadAddress }) => {
    const { address } = useAccount();
    const {
        hasEnded,
        hasStarted,
        currentTime,
        endTimeMoment,
        saleActive,
        startTimeMoment,
        currentLaunchpadStatus,
        currentSaleMode,
        minBuyLimit,
        maxBuyLimit,
        isLoading,
        symbol,
        tokenDecimals,
        listingPrice,
        launchpadContract,
    } = useLaunchpadDetails(launchpadAddress);

    const { vesting, isLoading: vestingLoading } = useLaunchpadVestingDetails(launchpadAddress);
    const {
        userInfo,
        isLoading: userInfoLoading,
    } = useLaunchpadUserInfo(launchpadContract);
    const { fundTokenDecimals, fundTokenSymbol } = useFundTokenDetails(launchpadAddress);

    const { TGEPercent, cycleInterval, cyclePercent, isVestingEnable } = vesting;
    const { userInvest } = userInfo;

    const investment = +formatUnits(userInvest ?? 0n, fundTokenDecimals ?? 18);
    const tge = Number(TGEPercent) / 1000;
    const cycleP = Number(cyclePercent) / 1000; // 1000 = 1e3
    const cycleInt = Number(cycleInterval);
    const {
        data,
        isLoading: userLoading,
        refetch,
    } = useContractReads({
        contracts: [
            { ...launchpadContract, functionName: 'getAllInvestors' },
            { ...launchpadContract, functionName: 'getUserTokens', args: [address] }, // total amount of tokens user will receive against investment.
            { ...launchpadContract, functionName: 'getTotalSaleTokens' },
            { ...launchpadContract, functionName: 'getTotalTokensSold' },
        ],
        watch: true
    });

    // const totalCycleCount = Number(investment / (cycleP * (cycleInt)))

    // const totalCycleCount = calculateVestingCycle(investment, tge, cycleP, cycleInt)

    //  uint256 totalCycleCount = totalInvestment / (cyclePercent * cycleInterval);

    const totalInvestors = !userLoading && data[0].result?.length;
    const userTokens = !userLoading && data[1]?.result;
    const totalSaleTokens = !userLoading && (data[2]?.result as bigint);
    const totalTokenSold = !userLoading && (data[3]?.result as bigint);
    const userPurchased = !userInfoLoading && userInvest;

    const userPurchasedFormat = formatUnits(userPurchased ?? 0n, fundTokenDecimals ?? 18);

    const loading = isLoading && vestingLoading && userLoading && userInfoLoading;
    // if (loading) return;

    const unsoldTokens = formatUnits(totalSaleTokens - totalTokenSold, tokenDecimals);

    const totalDuration = moment.duration(endTimeMoment.diff(startTimeMoment)).asMilliseconds();
    const elapsedDuration = currentTime.diff(startTimeMoment);
    const progress = Math.min((elapsedDuration / totalDuration) * 100, 100);

    const vestingDetails = isVestingEnable
        ? `${Number(cyclePercent) / 1e3}% each ${Number(cycleInterval) / 60} min`
        : '';

    const statics = [
        {
            id: 1,
            property: 'Status',
            value: getStatusString(currentLaunchpadStatus, hasStarted, hasEnded),
        },
        { id: 2, property: 'Sale Type', value: currentSaleMode },
        {
            id: 3,
            property: 'Minimum Buy',
            value: `${formatUnits(minBuyLimit, fundTokenDecimals ?? 18)} ${fundTokenSymbol ?? 'ETH'
                }`,
        },
        {
            id: 4,
            property: 'Maximum Buy',
            value: `${maxBuyLimit} ${fundTokenSymbol ?? 'ETH'}`,
        },
        { id: 5, property: 'You purchased', value: `${userPurchasedFormat} ${symbol}` },
        { id: 6, property: 'Unsold Tokens', value: `${unsoldTokens} ${symbol}` },
        { id: 7, property: 'Total Contributors', value: totalInvestors ?? 0 },
    ];

    if (isVestingEnable) {
        statics.push({ id: 8, property: 'Vesting For Presale', value: vestingDetails });
    }

    React.useEffect(() => {
        refetch();
    }, [address, refetch]);
    // eslint-disable-next-line consistent-return
    return (
        <>
            {
                loading ? <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={370}
                    sx={{ width: '100%', borderRadius: '15px' }
                    }
                /> : <PrimaryCard mt={20} sx={{ paddingTop: '25px' }}>
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
                        {statics.map(({ id, property, value }, key) => {
                            const isLast = key === statics.length - 1;
                            return (
                                <Box
                                    key={id}
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
                            );
                        })}
                    </Box>
                </PrimaryCard>
            }
        </>
    )

};

export default LaunchpadProgress;
