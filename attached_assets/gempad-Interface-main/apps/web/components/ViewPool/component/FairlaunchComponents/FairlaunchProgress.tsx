'use client';

import React from 'react';
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
import PrimaryCard from '@/components/Cards/PrimaryCard';
import useFundTokenDetails from '../../hooks/useFundTokenDetails';
import LaunchpadProgressAccordion from '../../LaunchpadProgressAccordion';
import useFairLaunchDetails from '../../hooks/fairlaunchHooks/useFairlaunchDetails';
import useLaunchpadUserInfo from '../../hooks/useLaunchpadUserInfo';
import { getStatusString } from '../../utils';

const FairLaunchProgress: React.FC<{ launchpadAddress: Address }> = ({ launchpadAddress }) => {
    const { address } = useAccount();
    const {
        launchpadContract,
        maxBuyLimit,
        tokenDecimals,
        hasStarted,
        hasEnded,
        saleActive,
        startTimeMoment,
        counterStart,
        counterEnd,
        softCap,
        softCapNum,
        totalRaisedNum,
        currentLaunchpadStatus,
        symbol,
        isLoading,
        endTimeMoment,
        currentSaleMode,
        currentTime,
    } = useFairLaunchDetails(launchpadAddress);

    const { userInfo, isLoading: userInfoLoading } = useLaunchpadUserInfo(launchpadContract);
    const { fundTokenDecimals, fundTokenSymbol } = useFundTokenDetails(launchpadAddress);

    const { userInvest } = userInfo;

    const {
        data,
        isLoading: userLoading,
        refetch,
    } = useContractReads({
        contracts: [
            { ...launchpadContract, functionName: 'getAllInvestors' },
            { ...launchpadContract, functionName: 'currentPrice' },
        ],
    });

    const totalInvestors = !userLoading && (data?.[0]?.result?.length ?? 0n);
    const currentRate = !userLoading && ((data?.[1].result as bigint) ?? 0n);
    const userPurchased = !userInfoLoading && userInvest;

    const userPurchasedFormat = formatUnits(userPurchased ?? 0n, fundTokenDecimals ?? 18);

    const totalDuration = moment.duration(endTimeMoment.diff(startTimeMoment)).asMilliseconds();
    const elapsedDuration = currentTime.diff(startTimeMoment);
    const progress = Math.min((elapsedDuration / totalDuration) * 100, 100);

    const statics = [
        {
            id: 1,
            property: 'Status',
            value: getStatusString(currentLaunchpadStatus, hasStarted, hasEnded),
        },
        { id: 2, property: 'Sale Type', value: currentSaleMode },
        {
            id: 3,
            property: 'Max Contribution	',
            value: `${maxBuyLimit} ${fundTokenSymbol ?? 'ETH'}`,
        },
        {
            id: 4,
            property: 'Current Rate',
            value: `${formatUnits(currentRate, fundTokenDecimals ?? 18)} ${
                fundTokenSymbol ?? 'ETH'
            }`,
        },
        { id: 5, property: 'You purchased', value: `${userPurchasedFormat} ${symbol}` },
    ];

    React.useEffect(() => {
        (async () => {
            await refetch();
        })();
    }, [address, refetch, launchpadAddress]);

    // eslint-disable-next-line consistent-return
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
    );
};

export default FairLaunchProgress;
