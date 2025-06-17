'use client';

import React, { useMemo } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import PrimaryCard from '../../../Cards/PrimaryCard';
import Image from 'next/image';
import images from '@/public/assets/images/images';
import StatusChip, { BGStates, States, Status } from '../../../ExploreAirdrops/StatusChip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { formatText, shortenAddress } from '@/utils/format';

// import icons

import CopyIcon from 'public/assets/icons/copy.svg';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import EditIcon from '@mui/icons-material/Edit';
import Website from 'public/assets/icons/website-icon.svg';
import Discord from 'public/assets/icons/discord-icon.svg';
import Github from 'public/assets/icons/github-icon.svg';
import Twitter from 'public/assets/icons/twitter-icon.svg';
import Telegram from 'public/assets/icons/telegram-icon.svg';
import Youtube from 'public/assets/icons/youtube-icon.svg';
import Link from 'next/link';
import Tooltip from '@mui/material/Tooltip';
import { LaunchPad } from '@/src/gql/graphql';
import { useFormattedTime } from '@/hooks/useFormatTime';
import { formatSecondsToUTC } from '@/utils/formateDateToUTC';
import moment from 'moment';
import { formatEther, formatUnits, parseUnits, Address } from 'viem';
import useFundTokenDetails from '../../hooks/useFundTokenDetails';
import useLaunchpadDetails from '../../hooks/useLaunchpadDetails';
import useLaunchpadLiquidityDetails from '../../hooks/useLaunhpadLiquidityDetails';
import { useAccount, useContractRead } from 'wagmi';
import { LaunchpadABI } from '@/config/abi/launchpad';
import SocialIcons from '../../../SocialIcons/SocialIcons';
import { LaunchpadSaleStatus, LaunchpadType } from '../../types';
import { FairLaunchABI } from '@/config/abi/fairlaunch';
import { SubscriptionABI } from '@/config/abi/subscription';
import { DutchAuctionABI } from '@/config/abi/dutchAuction';
import { useSingleCallResult } from '@/state/multicall/hooks';
import {
    calculateTokenAmount,
    getContractAbiByContractName,
    statusFunctionName,
} from '../../utils';
import { ROUTER_NAME_BY_ADDRESS_CHAIN_ID } from '@/constants';
import { getBlockExploreLink } from '@/utils';
import { formatAmount } from '@/utils/formatAmount';
import useGetLaunchpadCurrentStatus from '../../hooks/useGetLaunchpadCurrentStatus';

interface RowProps {
    property: string;
    value: string | number | React.ReactNode;
    isPrimary?: boolean;
    id?: number;
}

const Row = ({ property, value, isPrimary, id }: RowProps) => {
    const isMobile = useMediaQuery('(max-width: 700px)');
    const [open, setOpen] = React.useState(false);

    const handleTooltipOpen = () => {
        setOpen(true);
        setTimeout(() => {
            setOpen(false);
        }, 2000);
    };

    const handleCopy = async (text: string | number) => {
        try {
            await navigator.clipboard.writeText(text as string);
            handleTooltipOpen();
        } catch (error) {
            console.error({ error });
        }
    };
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                borderBottom: '1px solid #ffffff25',
                pb: '9px',
                mt: '15px',
                flexWrap: 'wrap',
            }}
        >
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }} fontSize={14}>
                {property}
            </Typography>
            <Box sx={{ display: 'flex', gap: '8px' }}>
                <Typography
                    color={isPrimary ? 'primary' : 'common.white'}
                    variant="body1"
                    textAlign={'right'}
                    fontSize={14}
                >
                    {typeof value === 'number' ||
                    (typeof value === 'string' && isPrimary && !isMobile && id !== 13)
                        ? value.toString()
                        : id === 1 || id === 5
                        ? shortenAddress(value)
                        : value}{' '}
                    <br />
                    {id === 5 && (
                        <div style={{ color: '#11B6DB', textAlign: 'right' }}>
                            (Do not send BNB to the token address!)
                        </div>
                    )}
                </Typography>
                {(id === 1 || id === 5) && (
                    <Tooltip
                        placement="top"
                        PopperProps={{
                            disablePortal: true,
                        }}
                        open={open}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title="copied"
                    >
                        <Box
                            onClick={() => {
                                if (typeof value === 'number' || typeof value === 'string') {
                                    handleCopy(value);
                                }
                            }}
                            sx={{ cursor: 'pointer' }}
                        >
                            <CopyIcon />
                        </Box>
                    </Tooltip>
                )}
            </Box>
        </Box>
    );
};

interface DetailsCardProps {
    status: Status;
}

interface IDetail {
    id: number;
    property: string;
    value: number | string | React.ReactNode;
    isPrimary?: boolean;
}

const SubscriptionDetailsCardIntegration = ({ launchpad }: { launchpad: LaunchPad }) => {
    const isMobile = useMediaQuery('(max-width:400px)');

    let tokenForLiquidity;

    // uint256 liquidityTokens;
    // if (_buyBack.isBuyback) {
    // // Calculate the tokens for liquidity taking buyback into account
    // uint256 liquidityAmount = (_liquidity.liquidityPercent * info.totalsellTokens) / 100e3;
    //     liquidityTokens = liquidityAmount + _buyBack.totalBuyBackAmount;
    // } else {
    //     // Calculate the tokens for liquidity without considering buyback
    //     liquidityTokens = (_liquidity.liquidityPercent * info.totalsellTokens) / 100e3;
    // }

    const {
        token,
        name: launchpadName,
        chainId,
        contractAddress: launchpadAddress,
        softCap,
        id,
        hardCap,
        sellPrice,
        startTime,
        endTime,
        fundToken: { decimals: fundTokenDecimals, symbol: fundTokenSymbol },
        router,
        lockTime,
        listingPrice,
        listingRate,
        sellRate,
        owner,
        metadata,
        liquidityDetails,
        vestingDetails,
    } = launchpad;

    const { currentLaunchpadStatus } = useGetLaunchpadCurrentStatus(
        launchpadName,
        launchpadAddress as Address,
    );

    const currentTime = moment();
    const startTimeMoment = moment.unix(Number(startTime));
    const endTimeMoment = moment.unix(Number(endTime));
    const hasStarted = currentTime.isAfter(startTimeMoment);

    const hasEnded = currentTime.isAfter(endTimeMoment);
    const saleActive = hasStarted && !hasEnded;
    const isSaleLive = saleActive && currentLaunchpadStatus !== LaunchpadSaleStatus.CANCELLED;
    const isSaleCancelled = currentLaunchpadStatus === LaunchpadSaleStatus.CANCELLED;

    const statusNum = getStatusNum(isSaleLive, isSaleCancelled, hasEnded);

    function getStatusNum(
        isSaleLive: boolean,
        isSaleCancelled: boolean,
        hasEnded: boolean,
    ): number {
        if (isSaleLive) return 1;
        if (isSaleCancelled) return 2;
        if (hasEnded) return 3;

        return 0;
    }

    // const { fundTokenDecimals, fundTokenSymbol, fundTokenName } = useFundTokenDetails(
    //     launchpadAddress as Address,
    // );

    const softCapNum = +formatUnits(softCap ?? 0n, fundTokenDecimals ?? 18);
    const hardCapNum = +formatUnits(hardCap ?? 0n, fundTokenDecimals ?? 18);

    const softCapToken = +formatUnits(
        BigInt(calculateTokenAmount(softCap, sellRate)),
        token?.decimals ?? 18,
    );
    const hardCapToken = +formatUnits(
        BigInt(calculateTokenAmount(hardCap, sellRate)),
        token?.decimals ?? 18,
    );
    // const softCapToken = calculateTokenAmount(softCapNum, sellRate);
    // const hardCapToken = calculateTokenAmount(hardCapNum, sellRate);

    const isSaleUpcoming = currentLaunchpadStatus === LaunchpadSaleStatus.INCOMMING;
    const saleStatus =
        currentLaunchpadStatus === LaunchpadSaleStatus.ACTIVE && hasEnded
            ? LaunchpadSaleStatus.CLOSED
            : currentLaunchpadStatus;

    const generateLaunchpadDetails = () => {
        let details: IDetail[] = [
            {
                id: 1,
                property: `${token?.name} ${token?.symbol}`,
                value: launchpadAddress,
                isPrimary: true,
            },
            {
                id: 2,
                property: 'Token Name',
                value: token?.name,
            },
            { id: 3, property: 'Token Symbol', value: token?.symbol },
            { id: 4, property: 'Token Decimals', value: token?.decimals },
            {
                id: 5,
                property: 'Token Address',
                value: token?.id,
                isPrimary: true,
            },
            {
                id: 6,
                property: 'Total Supply',
                value: `${formatAmount(
                    formatUnits(token?.totalSupply, token?.decimals),
                )} ${token?.symbol}`,
            },
            // {
            //     id: 7,
            //     property: 'Tokens For PreSale',
            //     value: `${formatUnits(tokenForPreSale ?? 0n, token?.decimals) ?? 0} ${token?.name ?? 'Unknown'}`,
            // },
            // {
            //     id: 8,
            //     property: 'Tokens For PreSale',
            //     value: `${formatUnits(tokenForPreSale ?? 0n, token?.decimals) ?? 0} ${token?.name ?? 'Unknown'}`,
            // },
            {
                id: 9,
                property: 'Soft Cap',
                value: ` ${softCapToken} ${token?.symbol} (${softCapNum} ${
                    fundTokenSymbol ?? 'ETH'
                })`,
            },
            {
                id: 10,
                property: 'Hard Cap',
                value: `${hardCapToken} ${token?.symbol} (${hardCapNum} ${
                    fundTokenSymbol ?? 'ETH'
                })`,
            },
            {
                id: 11,
                property: 'PreSale Start Time',
                value: `${moment.utc(Number(startTime) * 1000).format('YYYY-MM-DD HH:mm:ss')} UTC`,
            },
            {
                id: 12,
                property: 'PreSale End Time',
                value: `${moment.utc(Number(endTime) * 1000).format('YYYY-MM-DD HH:mm:ss')} UTC`,
            },
            {
                id: 13,
                property: 'Listing Rate',
                value: `1 ${fundTokenSymbol} = ${formatUnits(
                    listingRate ?? 0n,
                    token?.decimals ?? 18,
                )} ${token?.symbol}`,
            },
            {
                id: 14,
                property: 'Subscription Rate',
                value: `1 ${fundTokenSymbol} = ${formatUnits(
                    sellRate ?? 0n,
                    token?.decimals ?? 18,
                )} ${token?.symbol}`,
            },
        ];

        if (liquidityDetails) {
            const { liquidityAdded, liquidityPercent, lockTime, router } = liquidityDetails;
            const routerName = ROUTER_NAME_BY_ADDRESS_CHAIN_ID[chainId][router];
            details.push(
                {
                    id: Math.random() * 100,
                    property: 'Liquidity Percent',
                    value: `${Number(liquidityPercent) / 1e3}%`,
                },
                {
                    id: Math.random() * 100,
                    property: 'Liquidity Lockup Time',
                    value: `${Number(lockTime) / 60} minutes after pool ends`,
                },
                {
                    id: Math.random() * 100,
                    property: 'Listing on',
                    value: (
                        <a
                            style={{ color: '#11b6db', textDecoration: 'underline' }}
                            href={getBlockExploreLink(router, 'address', chainId)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {routerName}
                        </a>
                    ),
                },
            );
        } else {
            details.push({
                id: Math.random() * 100,
                property: 'Listing on',
                value: `Manual listing`,
            });
        }
        return details;
    };

    const [showFullDescription, setShowFullDescription] = React.useState(false);

    const handleToggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const { address } = useAccount();
    const isUserOwner = address?.toLowerCase() === owner?.id?.toLowerCase();

    return (
        <Box sx={{ width: '100%' }}>
            <PrimaryCard py={25}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'start',
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
                            alt={launchpadName}
                            sx={{ border: '3px solid #fff', width: 70, height: 70 }}
                        >
                            <Image src={images.Gem} alt="user" />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontSize={20}>
                                {token?.name} {launchpadName}
                            </Typography>
                            <SocialIcons socials={metadata?.socials} />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                        {isUserOwner && (
                            <Tooltip title="You are the owner of this pool">
                                <VpnKeyIcon />
                            </Tooltip>
                        )}
                        {isUserOwner && isSaleUpcoming && (
                            <Tooltip title="Click to edit this pool" sx={{ cursor: 'pointer' }}>
                                <Link href={`/view-pool/edit/${launchpadAddress}`}>
                                    <EditIcon />
                                </Link>
                            </Tooltip>
                        )}
                        <Box>
                            <StatusChip status={statusNum} />
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    gap: '5px',
                                    mt: '10px',
                                }}
                            >
                                <Typography
                                    fontSize={12}
                                    sx={{
                                        background: '#22CDA6',
                                        borderRadius: '5px',
                                        px: '8px',
                                        py: '2px',
                                        visibility: metadata?.kyc ? 'visible' : 'hidden',
                                    }}
                                >
                                    KYC
                                </Typography>

                                <Typography
                                    fontSize={12}
                                    sx={{
                                        background: '#11B6DB',
                                        borderRadius: '5px',
                                        px: '8px',
                                        py: '2px',
                                        visibility: metadata?.audit ? 'visible' : 'hidden',
                                    }}
                                >
                                    Audit
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    {/* <StatusChip status={Number(saleStatus)} /> */}
                </Box>

                <Box sx={{ mt: '24px', mb: '10px' }}>
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
                        {formatText(metadata?.socials?.description, showFullDescription)}
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
                    {generateLaunchpadDetails().map((item) => (
                        <Row key={item.id} {...item} id={item.id} />
                    ))}
                </Box>
            </PrimaryCard>
        </Box>
    );
};

export default SubscriptionDetailsCardIntegration;
