'use client';

import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import Image from 'next/image';
import images from '@/public/assets/images/images';
import useMediaQuery from '@mui/material/useMediaQuery';
import { formatText, shortenAddress } from '@/utils/format';

import { LaunchPad } from '@/src/gql/graphql';
import moment from 'moment';
import { formatUnits, Address } from 'viem';
import useFundTokenDetails from '../../hooks/useFundTokenDetails';
import { LaunchpadSaleStatus, LaunchpadType } from '../../types';
import {
    LaunchpadServiceName,
    ROUTER_NAME_BY_ADDRESS_CHAIN_ID,
    SERVICE_FEE_RECEIVERS,
} from '@/constants';
import { getBlockExploreLink } from '@/utils';
import { formatAmount } from '@/utils/formatAmount';
import useGetLaunchpadCurrentStatus from '../../hooks/useGetLaunchpadCurrentStatus';
import { getTokenForLiquidity } from '@/utils/getMinTokens';
import PrimaryCard from '@/components/Cards/PrimaryCard';
import StatusChip, { BGStates, States, Status } from '@/components/ExploreAirdrops/StatusChip';
import SocialIcons from '@/components/SocialIcons/SocialIcons';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { useServiceReceiverContract } from '@/hooks/useContract';

import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import CopyIcon from 'public/assets/icons/copy.svg';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useAccount } from 'wagmi';
import Link from 'next/link';

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

const AuctionDetailCardIntegration = ({
    launchpad,
    tokenForPreSale,
}: {
    launchpad: LaunchPad;
    tokenForPreSale: bigint;
}) => {
    const isMobile = useMediaQuery('(max-width:400px)');

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
        router,
        lockTime,
        listingPrice,
        owner,
        metadata,
        liquidityDetails,
        vestingDetails,
        isAutoListing,
        decreaseInterval,
        refundType,
    } = launchpad;

    const { fundTokenDecimals, fundTokenSymbol, fundTokenName } = useFundTokenDetails(
        launchpadAddress as Address,
    );

    const currentTime = moment();
    const endTimeMoment = moment.unix(Number(endTime));
    const hasEnded = currentTime.isAfter(endTimeMoment);
    const liquidityPercent = Number(liquidityDetails?.liquidityPercent) / 1e3;
    const hardCapNum = +formatUnits(hardCap ?? 0n, fundTokenDecimals ?? 18);

    const { currentLaunchpadStatus } = useGetLaunchpadCurrentStatus(
        launchpadName,
        launchpadAddress as Address,
    );

    const isFairLaunch = launchpadName === LaunchpadType.Fairlaunch;

    const isSaleUpcoming = currentLaunchpadStatus === LaunchpadSaleStatus.INCOMMING;
    const saleStatus =
        currentLaunchpadStatus === LaunchpadSaleStatus.ACTIVE && hasEnded
            ? LaunchpadSaleStatus.CLOSED
            : currentLaunchpadStatus;

    const serviceReceiverContract = useServiceReceiverContract(
        SERVICE_FEE_RECEIVERS[chainId] as Address,
    );

    const { result: feePercent, loading: feePercentLoading } = useSingleCallResult({
        contract: serviceReceiverContract,
        functionName: 'getFee',
        args: [LaunchpadServiceName.GEMPAD_DUTCH_AUCTION],
    });

    const feePercentNum = !feePercentLoading && Number(feePercent) / 1e3;

    const tokenForLiquidity = getTokenForLiquidity({
        hardcap: hardCapNum,
        sellPrice: Number(sellPrice),
        listingPrice: Number(listingPrice),
        autoListing: isAutoListing,
        liquidityFee: liquidityPercent,
        feeOptions: feePercentNum,
    });

    const generateLaunchpadDetails = () => {
        let details: IDetail[] = [
            {
                id: 1,
                property: `Presale Address`,
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
            {
                id: 7,
                property: 'Tokens For PreSale',
                value: `${formatUnits(tokenForPreSale ?? 0n, token?.decimals) ?? 0} ${
                    token?.symbol ?? 'Unknown'
                }`,
            },
            {
                id: 8,
                property: 'Tokens For Liquidity',
                value: `${formatUnits(BigInt(tokenForLiquidity), token?.decimals)} ${
                    token?.symbol ?? 'Unknown'
                }`,
            },
            {
                id: 16,
                property: 'Auction Rate',
                value: `${formatUnits(tokenForPreSale ?? 0n, token?.decimals) ?? 0} ${
                    token?.symbol ?? 'Unknown'
                }`,
            },
            {
                id: 16,
                property: 'Decrease Price Cycle (minutes)',
                value: `${Number(decreaseInterval) / 60} min`,
            },
            {
                id: 9,
                property: 'Soft Cap',
                value: `${formatUnits(softCap, fundTokenDecimals ?? 18)} ${
                    fundTokenSymbol ?? 'ETH'
                }`,
            },
            {
                id: 10,
                property: 'Hard Cap',
                value: `${hardCapNum} ${fundTokenSymbol ?? 'ETH'}`,
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
                value: `  1 ${fundTokenSymbol} = ${formatUnits(
                    sellPrice ?? 0n,
                    token?.decimals ?? 18,
                )} ${token?.symbol}`,
            },
            {
                id: 14,
                property: 'Presale Rate',
                value: `1 ${fundTokenSymbol} = ${formatUnits(
                    listingPrice ?? 0n,
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
            details?.push({
                id: Math.random() * 100,
                property: 'Listing on',
                value: `Manual listing`,
            });
        }

        if (vestingDetails?.isVestingEnable) {
            const { cycleInterval, cyclePercent, tgePercent } = vestingDetails;

            details?.push(
                {
                    id: Math.random() * 100,
                    property: 'First Release For Auction',
                    value: `${Number(tgePercent) / 1e3}%`,
                },
                {
                    id: Math.random() * 100,
                    property: 'Tokens release each cycle',
                    value: `${Number(cyclePercent) / 1e3}% each ${
                        Number(cycleInterval) / 60
                    } minutes`,
                },
            );
        }

        if (isFairLaunch) {
            // Remove hard cap and listing price for Fairlaunch
            details = details?.filter(
                (detail) => detail?.property !== 'Hard Cap' && detail?.property !== 'Listing Price',
            );
        }

        return details;
    };

    const [showFullDescription, setShowFullDescription] = React.useState(false);

    // const { data: currentLaunchpadStatus } = useContractRead({
    //     address: launchpadAddress as Address,
    //     abi: getContractAbiByContractName(name) as any,
    //     functionName: statusFunctionName(name) // fixes spell mistakes in the contract method
    // })

    const handleToggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const { address } = useAccount();
    console.log({ address, owner });
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
                            <StatusChip status={Number(saleStatus)} />
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
                    {generateLaunchpadDetails()?.map((item) => (
                        <Row key={item.id} {...item} id={item.id} />
                    ))}
                </Box>
            </PrimaryCard>
        </Box>
    );
};

export default AuctionDetailCardIntegration;
