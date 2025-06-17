'use client';

import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';
import Image, { StaticImageData } from 'next/image';
import LinearProgressCustom from '../LinearProgress/LinearProgressCustom';
import Divider from '../Divider/Divider';
import HeartIcon from 'public/assets/icons/heart.svg';
import StatusChip, { Status } from '../ExploreAirdrops/StatusChip';
import BadgeAvatars from '../BadgeAvatar/BadgeAvatar';
import Link from 'next/link';
import { useFormattedTime, TimeFormats } from '@/hooks/useFormatTime';
import moment from 'moment';
import { useRouter } from 'next/router';
import { LaunchPad } from '@/src/gql/graphql';
import { Address, formatUnits } from 'viem';
import { getProgress } from '@/utils/getProgress';
import images from '@/public/assets/images/images';
import { useContractRead } from 'wagmi';
import { LaunchpadABI } from '@/config/abi/launchpad';
import useFundTokenDetails from '../ViewPool/hooks/useFundTokenDetails';
import useLaunchpadDetails from '../ViewPool/hooks/useLaunchpadDetails';
import KycAudit from './modals/KycAudit';
import { CardProps } from './types';
import { LaunchpadSaleStatus, LaunchpadType } from '../ViewPool/types';
import useGetLaunchpadCurrentStatus from '../ViewPool/hooks/useGetLaunchpadCurrentStatus';

const Card = ({ launchPad, refetch }: CardProps) => {
    const {
        token,
        minBuyLimit,
        maxBuyLimit,
        lockTime,
        liquidityPercent,
        startTime,
        endTime,
        name: launchpadName,
        contractAddress,
        softCap,
        hardCap,
        metadata,
        isAffiliate: isFairLaunchAffiliate,
        affiliateReward: fairLaunchAffiliateReward,
        liquidityDetails,
    } = launchPad;

    const [openModal, setOpenModal] = React.useState<boolean>(false);

    const launchpadAddress = contractAddress as Address;

    const isFairLaunch = launchpadName === LaunchpadType.Fairlaunch;
    const { fundTokenDecimals, fundTokenSymbol, fundTokenName } =
        useFundTokenDetails(launchpadAddress);

    const formattedLockTime = useFormattedTime(Number(liquidityDetails?.lockTime));
    const currentTime = moment();
    const endTimeMoment = moment.unix(Number(endTime));
    const startTimeMoment = moment.unix(Number(startTime));
    const hardCapNum = +formatUnits(hardCap ?? 0n, fundTokenDecimals ?? 18);
    const hasStarted = currentTime.isAfter(startTimeMoment);
    const hasEnded = currentTime.isAfter(endTimeMoment);
    const saleActive = hasStarted && !hasEnded;

    const minBuy = +formatUnits(minBuyLimit ?? 0n, fundTokenDecimals ?? 18);
    const maxBuy = +formatUnits(maxBuyLimit ?? 0n, fundTokenDecimals ?? 18);

    const { affiliatePercentage: launchpadAffiliateReward } = useLaunchpadDetails(launchpadAddress);

    const { currentLaunchpadStatus } = useGetLaunchpadCurrentStatus(
        launchpadName,
        launchpadAddress,
    );

    const isSaleLive = saleActive && currentLaunchpadStatus !== LaunchpadSaleStatus.CANCELLED;
    const isSaleCancelled = currentLaunchpadStatus === LaunchpadSaleStatus.CANCELLED;
    const isSaleUpcoming = currentLaunchpadStatus === LaunchpadSaleStatus.INCOMMING;

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

    const { data: totalRaised } = useContractRead({
        address: launchpadAddress,
        abi: LaunchpadABI,
        functionName: 'totalRaised',
    });

    const totalRaisedNum = +formatUnits(totalRaised ?? 0n, fundTokenDecimals ?? 0);

    const { data: isLaunchpadAffiliate } = useContractRead({
        address: launchpadAddress,
        abi: LaunchpadABI,
        functionName: 'isAffiliate',
    });

    const endTimeFormatted = endTimeMoment.utc().format('YYYY.MM.DD HH:mm:ss [UTC]');
    const totalProgress = isFairLaunch
        ? formatUnits(softCap, token?.decimals ?? 18)
        : formatUnits(hardCap, token?.decimals ?? 18);

    const isAffiliate = isLaunchpadAffiliate || isFairLaunchAffiliate; // for different data structure in contract methods.
    const affiliatePercentage = isFairLaunch
        ? Number(fairLaunchAffiliateReward) / 1e3
        : launchpadAffiliateReward;

    const handleModalClose = () => {
        setOpenModal(false);
    };

    return (
        <Box
            sx={{
                border: isAffiliate ? '1px solid #77EB67' : 'none',
                borderRadius: '15px',
                position: 'relative',
            }}
        >
            <PrimaryCard py={35}>
                {isAffiliate && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            position: 'absolute',
                            top: '-15px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <Box
                            sx={{
                                background: '#77EB67',
                                borderRadius: '25px',
                                px: '30px',
                                py: '5px',
                                width: '153px',
                            }}
                        >
                            <Typography
                                color="common.black"
                                fontSize={12}
                                fontWeight={600}
                                textAlign="center"
                            >
                                Affiliate {`${affiliatePercentage}`}%
                            </Typography>
                        </Box>
                    </Box>
                )}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '10px',
                    }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            src={metadata?.socials?.logoUrl}
                            sx={{ border: '3px solid #fff', width: 50, height: 50 }}
                        >
                            <Image src={images.Gem} alt="logo" />
                        </Avatar>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
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

                <Box>
                    <Typography fontSize={16} variant="h5">
                        {token?.name} {launchpadName}
                    </Typography>
                    <Typography fontSize={12} variant="h5" sx={{ color: '#B9B9B9' }}>
                        {isFairLaunch ? `Min-Buy ${minBuy}` : `Max-Buy ${maxBuy}`} {fundTokenSymbol}
                    </Typography>
                </Box>

                <Box sx={{ mt: '25px' }}>
                    <Typography fontSize={14} variant="h5"></Typography>
                    <Typography fontSize={18} variant="h5" sx={{ color: '#0FD7D2' }}>
                        {/* {`${formatUnits(softCap, token.decimals ?? 18) ?? 0}`} -{' '} */}
                        {/* {`${formatUnits(hardCap, token.decimals ?? 18) ?? 0} `}{' '} */}
                        {token?.symbol ?? 'unknown'}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h5" fontSize={12} sx={{ mb: '4px' }}>
                        Progress{' '}
                        {isFairLaunch
                            ? getProgress(totalRaisedNum, +totalProgress).toFixed(2)
                            : getProgress(totalRaisedNum, hardCapNum).toFixed(2)}
                        %
                    </Typography>
                    <LinearProgressCustom
                        bgColor="#BFFFD5"
                        value={
                            isFairLaunch
                                ? getProgress(totalRaisedNum, Number(totalProgress) * 2)
                                : getProgress(totalRaisedNum, hardCapNum)
                        }
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                        mt={0.5}
                    >
                        <Typography variant="h5" fontSize={12}>
                            {totalRaisedNum} {fundTokenSymbol}
                        </Typography>
                        <Typography fontWeight={600} fontSize={12}>
                            {/* {formatUnits(hardCap, token?.decimals ?? 18)} {fundTokenSymbol ?? 'ETH'} */}
                            {totalProgress} {fundTokenSymbol}
                        </Typography>
                    </Box>
                </Box>

                {liquidityDetails && (
                    <Box sx={{ mt: '15px' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '10px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Typography variant="h5" fontSize={14}>
                                Liquidity %:
                            </Typography>
                            <Typography fontSize={14}>
                                <span style={{ color: '#0FD7D2' }}>
                                    {' '}
                                    {Number(liquidityDetails?.liquidityPercent) / 1e3}%
                                </span>

                                {/* <span style={{ color: '#0FD7D2' }}>(Buy Back 20%)</span> */}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <Typography variant="h5" fontSize={14}>
                                Lockup Time:
                            </Typography>
                            <Typography fontSize={14}>{formattedLockTime}</Typography>
                        </Box>
                    </Box>
                )}

                <Divider color="#ffffff" />

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box>
                        {isSaleLive && (
                            <>
                                <Typography fontSize={14}>Sale Ends In:</Typography>
                                <Typography fontSize={12}>{endTimeFormatted}</Typography>
                            </>
                        )}
                        {hasEnded && !isSaleCancelled && (
                            <>
                                <Typography fontSize={14}>Presale:</Typography>
                                <Typography fontSize={12}>Ended</Typography>
                            </>
                        )}
                        {isSaleCancelled && (
                            <>
                                <Typography fontSize={14}>Presale:</Typography>
                                <Typography fontSize={12}>Cancelled</Typography>
                            </>
                        )}
                        {isSaleUpcoming && !isSaleCancelled && !isSaleLive && !hasEnded && (
                            <>
                                <Typography fontSize={14}>Presale:</Typography>
                                <Typography fontSize={12}>Upcoming</Typography>
                            </>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <Button
                            variant="contained"
                            sx={{ px: '17px' }}
                            onClick={() => setOpenModal(true)}
                        >
                            Audit/kyc
                        </Button>
                    </Box>
                </Box>
            </PrimaryCard>
            <KycAudit
                handleClose={handleModalClose}
                open={openModal}
                contractAddress={launchpadAddress}
                metadata={metadata}
                refetch={refetch}
            />
        </Box>
    );
};

export default Card;
