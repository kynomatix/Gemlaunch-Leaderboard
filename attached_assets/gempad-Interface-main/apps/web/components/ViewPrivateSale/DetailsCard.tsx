'use client';

import { CURRENCY_DECIMALS } from '@/constants';
import { usePrivateSaleContract } from '@/hooks/useContract';
import images from '@/public/assets/images/images';
import { formatAmount } from '@/utils/formatAmount';
import { getCurrencySymbol } from '@/utils/getCurrencySymbolByAddress';
import { Avatar, Box, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Address, formatUnits } from 'viem';
import { useContractReads, useNetwork } from 'wagmi';
import PrimaryCard from '../Cards/PrimaryCard';
import StatusChip from '../ExploreAirdrops/StatusChip';
import Row from './Row';
import { socialIcons } from './constants';
import { DetailCardProps } from './types';
import WhitelistUsers from './whitelistUsers';
import SocialIcons from '../SocialIcons/SocialIcons';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import utc from 'dayjs/plugin/utc'; // Enable UTC plugin

dayjs.extend(utc);

const DetailCard: React.FC<DetailCardProps> = ({
    privateSale: {
        name,
        id,
        currency,
        softcap,
        hardcap,
        startTime,
        endTime,
        initialRelease,
        cycleInterval,
        cyclePercent,
        whitelistUsers,
        metadata,
    },
    refetch,
}) => {
    const isMobile = useMediaQuery('(max-width:400px)');

    const privateSaleContract = usePrivateSaleContract(id as Address);

    const [showFullDescription, setShowFullDescription] = React.useState(false);

    const handleToggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const formatText = (text: string) => {
        if (!text) return null;
        const lines = text.split('\n');
        if (lines.length > 3 && !showFullDescription) return lines.slice(0, 3).join('\n');
        return text;
    };

    const { chainId } = useActiveChainId();

    const { result: currentStatus } = useSingleCallResult({
        contract: privateSaleContract,
        functionName: 'getCurrentStatus',
    });
    const { result: currentMode } = useSingleCallResult({
        contract: privateSaleContract,
        functionName: 'getCurrentMode',
    });

    // formattingValues:
    const currencySymbol = getCurrencySymbol(currency, chainId);
    const decimals = CURRENCY_DECIMALS[currency];
    const softcapFormated = formatUnits(softcap, decimals);
    const hardcapFormated = formatUnits(hardcap, decimals);
    const startTimeFormated = dayjs.utc(Number(startTime) * 1000).format('YYYY-MM-DD HH:mm:ss UTC');
    const endTimeFormated = dayjs.utc(Number(endTime) * 1000).format('YYYY-MM-DD HH:mm:ss UTC');
    const firstRelease = Number(initialRelease) / 1000; // removing bips : 1e3
    const cyclePercentFormated = Number(cyclePercent) / 1000; // removing bips : 1e3
    const cycleIntervalFormated = Number(cycleInterval) / 60 / 60 / 24; // seconds to days

    const row = [
        { id: 1, property: 'Private Sale Address', value: id, isPrimary: true },
        { id: 2, property: 'Soft Cap', value: `${softcapFormated} ${currencySymbol}` },
        { id: 3, property: 'Hard Cap', value: `${hardcapFormated} ${currencySymbol}` },
        { id: 4, property: 'Private Sale Start Time', value: `${startTimeFormated}` },
        { id: 5, property: 'Private Sale End Time', value: `${endTimeFormated}` },
        { id: 6, property: 'First Release For Project', value: `${firstRelease}%` },
        {
            id: 7,
            property: 'Vesting For Project',
            value: `${cyclePercentFormated}% each ${cycleIntervalFormated} days`,
        },
        { id: 8, property: 'Whitelist', value: currentMode === 1 ? 'Enabled' : 'Disabled' },
        { id: 9, property: 'Users Whitelists', value: '' },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            <PrimaryCard py={25}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        justifyContent: 'space-between',
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            flexWrap: isMobile ? 'wrap' : 'nowrap',
                        }}
                    >
                        <Avatar
                            src={metadata?.socials?.logoUrl}
                            alt={name}
                            sx={{ border: '3px solid #fff', width: 70, height: 70 }}
                        >
                            <Image src={images.Gem} alt="user" />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontSize={20}>
                                {name}
                            </Typography>
                            <SocialIcons socials={metadata?.socials} />
                        </Box>
                    </Box>
                    <StatusChip status={currentStatus} />
                </Box>

                <Box sx={{ mt: '24px', mb: 5 }}>
                    <Typography
                        variant="body1"
                        maxWidth={654}
                        pr={1}
                        fontSize={14}
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: showFullDescription ? 'unset' : 3,
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {formatText(metadata?.socials?.description)}
                    </Typography>

                    {metadata?.socials?.description?.length >= 280 && (
                        <Typography
                            fontSize={12}
                            onClick={handleToggleDescription}
                            color="primary"
                            sx={{
                                cursor: 'pointer',
                                ':hover': { color: 'lightblue' },
                                width: 'fit-content',
                            }}
                        >
                            {showFullDescription ? 'Show less' : 'Show more'}
                        </Typography>
                    )}
                </Box>

                <Box>
                    {row.map((item) => (
                        <Row key={item.id} {...item} />
                    ))}
                </Box>

                <WhitelistUsers users={whitelistUsers as Address[]} refetch={refetch} />
            </PrimaryCard>
        </Box>
    );
};

export default DetailCard;
