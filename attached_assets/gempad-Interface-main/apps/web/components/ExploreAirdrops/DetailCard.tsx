'use client';

import React, { FC } from 'react';
import { Avatar, Box, Button, Tooltip, Typography } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';
import Image from 'next/image';
import images from '@/public/assets/images/images';
import StatusChip, { BGStates, States, Status } from './StatusChip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { shortenAddress } from '@/utils/format';
import Link from 'next/link';

// import icons

import { getBlockExploreLink } from '@/utils';
import { useAccount, useContractReads, useNetwork } from 'wagmi';
import { Airdrop } from '@/src/gql/graphql';
import { Address, formatUnits } from 'viem';
import { useAirdropContract } from '@/hooks/useContract';
import { useSingleCallResult } from '@/state/multicall/hooks';
import SocialIcons from '../SocialIcons/SocialIcons';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import EditIcon from '@mui/icons-material/Edit';
import { DetailsCardProps } from './types';
import { Row } from './Row';

const DetailCard: React.FC<DetailsCardProps> = ({ airdrop }) => {
    const {
        name,
        token: { name: tokenName, id: tokenAddress, symbol: tokenSymbol, decimals },
        owner: { id },
        contractAddress,
        totalTokens,
        metadata,
    } = airdrop;
    const { address } = useAccount();

    const isUserOwner = address?.toLowerCase() === id?.toLowerCase();

    const [showFullDescription, setShowFullDescription] = React.useState(false);

    const handleToggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const isMobile = useMediaQuery('(max-width:400px)');
    const airdropContract = useAirdropContract(contractAddress as Address);

    const { data, isLoading } = useContractReads({
        contracts: [
            { ...airdropContract, functionName: 'vestingInfo' },
            { ...airdropContract, functionName: 'getCurrentStatus' },
            { ...airdropContract, functionName: 'totalTokens' },
            { ...airdropContract, functionName: 'totalClaimedTokens' },
            { ...airdropContract, functionName: 'startTime' },
        ],
        watch: true,
    });

    // Extracting data:
    const vestingInfo = data?.[0]?.result;
    const tge = vestingInfo?.[0];
    const cycle = vestingInfo?.[1];
    const interval = vestingInfo?.[2];
    const isVesting = vestingInfo?.[3];
    const status = data?.[1]?.result;
    const startTime = data?.[4]?.result;

    const tt = (!isLoading && data?.[2]?.result) ?? 0n;
    const tct = (!isLoading && data?.[3]?.result) ?? 0n;

    const totalClaimabaleAmount = formatUnits(tt, decimals);
    const totalClaimedTokens = formatUnits(tct, decimals);

    const isAllTokensClaimed = +totalClaimabaleAmount === +totalClaimedTokens;

    const tokenInfo = [
        { id: 1, property: 'Airdrop Address', value: contractAddress, isLink: true },
        { id: 2, property: 'Token Address', value: tokenAddress, isLink: true },
        { id: 3, property: 'Name', value: tokenName },
        { id: 4, property: 'Symbol', value: tokenSymbol },
        {
            id: 5,
            property: 'Total Tokens',
            value: totalClaimabaleAmount,
            // `${formatUnits(totalTokens, decimals)} ${tokenSymbol}`,
        },
    ];

    const vesting = [
        { id: 1, property: 'TGE Release Percent', value: isVesting && `${Number(tge) / 1e3} %` },
        { id: 2, property: 'Cycle', value: isVesting && `${Number(interval) / 60} minutes` },
        { id: 3, property: 'Cycle Release Percent', value: isVesting && `${Number(cycle) / 1e3}%` },
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
                            <Image src={images.Gem} alt={name} />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontSize={20}>
                                {name}
                            </Typography>
                            <SocialIcons socials={metadata?.socials} />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isUserOwner && (
                            <Tooltip title="You are the owner of this pool">
                                <VpnKeyIcon />
                            </Tooltip>
                        )}
                        {isUserOwner && status === 0 && !startTime && (
                            <Tooltip title="Click to edit this pool" sx={{ cursor: 'pointer' }}>
                                <Link href={`/airdrop-list/${contractAddress}/edit`}>
                                    <EditIcon />
                                </Link>
                            </Tooltip>
                        )}

                        <StatusChip status={isAllTokensClaimed && status === 1 ? 3 : status} />
                    </Box>
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
                        {metadata?.socials?.description}
                    </Typography>

                    {metadata?.socials?.description && (
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
                    {tokenInfo.map((item) => (
                        <Row key={item.id} {...item} />
                    ))}
                    {isVesting && <>{vesting?.map((item) => <Row key={item.id} {...item} />)}</>}
                </Box>
            </PrimaryCard>
        </Box>
    );
};

export default DetailCard;
