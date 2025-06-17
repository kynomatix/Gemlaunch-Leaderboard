/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client';

import PrimaryCard from '@/components/Cards/PrimaryCard';
import { Box, Button, Typography } from '@mui/material';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { FaRegCheckCircle, FaRegCopy } from 'react-icons/fa';
import { TiInputChecked } from 'react-icons/ti';
import { useAccount, useContractRead } from 'wagmi';
import { Address, formatUnits } from 'viem';
import toast from 'react-hot-toast';
import moment from 'moment';
import { LaunchpadABI } from '@/config/abi/launchpad';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { waitForTransaction } from 'wagmi/actions';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import { CallState, useSingleContractMultipleData } from '@/state/multicall/hooks';
import { TbAffiliate } from 'react-icons/tb';
import { formatAmount } from '@/utils/formatAmount';
import ReferralTable from '../ReferralTable';
import { IAffiliateProgram, LaunchpadSaleStatus } from '../../types';
import useLaunchpadRewardInfo from '../../hooks/launchpadHooks/useLaunchpadRewardInfo';
import useFundTokenDetails from '../../hooks/useFundTokenDetails';
import useRefIdUrl from '../../hooks/useAffiliateURL';
import FairLaunchReferralTable from './FairlaunchReferralTable';

interface RowProps {
    property: string;
    value: React.ReactNode;
    isLast: boolean;
}

const Row = ({ property, value, isLast }: RowProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end',
                gap: '10px',
                // borderBottom: isLast ? 'none' : '1px solid #ffffff25',
                borderBottom: '1px solid #ffffff25',
                py: '12px',
            }}
        >
            <Typography variant="h5" fontSize={14}>
                {property}
            </Typography>
            <Typography variant="body1" fontSize={14}>
                {value}
            </Typography>
        </Box>
    );
};

const FairLaunchAffiliateProgram = ({
    props: {
        affiliatePercentage,
        affiliateReward,
        allReferrers,
        currentLaunchpadStatus,
        isAffiliate,
        launchpadAddress,
        launchpadContract,
        totalRaisedNum,
        tokenFee,
        totalRewards,
    },
}: IAffiliateProgram) => {
    const { address, isReconnecting } = useAccount();
    const { chainId } = useActiveChainId();
    const {
        rewardInfo: { rewardShare, referralInvest, totalRaised, totalReferralInvest },
    } = useLaunchpadRewardInfo(launchpadAddress);
    const { fundTokenDecimals, fundTokenSymbol } = useFundTokenDetails(launchpadAddress);

    const referralsInvestment = +formatUnits(totalReferralInvest ?? 0n, fundTokenDecimals ?? 18);

    const isSaleClosed = currentLaunchpadStatus === LaunchpadSaleStatus.CLOSED;

    const allUsersRewardInfo = useSingleContractMultipleData({
        contract: {
            abi: launchpadContract.abi,
            address: launchpadContract.address,
        },
        functionName: 'rewardInfo',
        args: allReferrers ? allReferrers.map((x) => [x] as [Address]) : [],
    });

    const totalReward = React.useMemo(() => {
        const reward =
            allUsersRewardInfo && allUsersRewardInfo?.length > 0
                ? allUsersRewardInfo?.reduce((acc, curr, ind) => {
                      const userReferralInvest = +formatUnits(
                          curr?.result?.[0] ?? 0n,
                          fundTokenDecimals ?? 18,
                      );
                      const userReward = (totalRewards * userReferralInvest) / referralsInvestment;
                      const sumReward = acc + userReward;

                      return sumReward;
                  }, 0)
                : 0;

        return Number(reward);
    }, [allUsersRewardInfo, fundTokenDecimals, totalRewards, referralsInvestment]);

    const realTimeRewardPercentage = Number((totalReward / referralsInvestment) * 100);

    const currentReward = realTimeRewardPercentage / 100 / referralsInvestment;

    const { data: claimTime } = useContractRead({
        abi: LaunchpadABI,
        address: launchpadAddress,
        functionName: 'claimTime',
        watch: true,
    });

    const currentTime = moment().unix();

    React.useEffect(() => {
        console.log('reconnecting');
    }, [isAffiliate, isReconnecting, address]);

    const claimNow = async () => {
        if (currentLaunchpadStatus === LaunchpadSaleStatus.CANCELLED) {
            toast.error('Sale is cancelled');
            return;
        }
        if (currentLaunchpadStatus !== LaunchpadSaleStatus.CLOSED) {
            toast.error('Sale is not finalized');
            return;
        }
        if (currentTime <= claimTime) {
            toast.error('Claim time not reached');
            return;
        }
        try {
            let hash;
            await launchpadContract.write.claimReward({});
            await waitForTransaction({ hash, chainId });
        } catch (error: any) {
            console.error(error);
            toast.error(
                <DescriptionWithTx
                    title={error.name || 'Error'}
                    description={error.shortMessage || 'ClaimToken Error'}
                />,
            );
        }
    };

    const affiliateDetail = [
        {
            key: 'Your Rewards',
            value: (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography fontSize="14px" mr={rewardShare !== BigInt(0) ? 1 : 0}>
                            {formatUnits(rewardShare, fundTokenDecimals)} {fundTokenSymbol}
                        </Typography>

                        {rewardShare !== BigInt(0) && (
                            // eslint-disable-next-line jsx-a11y/anchor-is-valid
                            <a
                                style={{
                                    textDecoration: 'underline',
                                    color: '#11B6DB',
                                    cursor: 'pointer',
                                }}
                                onClick={() => claimNow()}
                            >
                                Claim
                            </a>
                        )}
                    </Box>
                </>
            ),
        },
        {
            key: 'Pool Referrer Count',
            value: <Typography fontSize="14px">{allReferrers?.length || 0}</Typography>,
        },
        {
            key: 'Realtime Reward Percentage',
            value: (
                <Typography sx={{ color: '#22CDA6' }} fontSize="14px">
                    {Math.ceil(realTimeRewardPercentage)}%
                </Typography>
            ),
        },
        {
            key: 'Current Reward',
            value: (
                <Typography fontSize="14px">
                    {/* {getMinRewards()} */}
                    {formatAmount(currentReward)} {fundTokenSymbol}
                </Typography>
            ),
        },
        {
            key: 'Total Referral Invest',
            value: (
                <Typography fontSize="14px">
                    {' '}
                    {referralsInvestment} {fundTokenSymbol}{' '}
                </Typography>
            ),
        },
        {
            key: 'Total Reward',
            value: (
                <Typography fontSize="14px">
                    {totalReward} {fundTokenSymbol}
                </Typography>
            ),
        },
    ];

    const isRewardVisible = allReferrers && allReferrers.length > 0 && isSaleClosed;

    return (
        <Box>
            <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                mt={2}
            >
                <Typography fontWeight={600} fontSize={'18px'} mt={3} mb={1}>
                    Affiliate Program
                </Typography>
                <TbAffiliate size="24px" />
            </Box>
            <PrimaryCard>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative',
                        flexDirection: 'column',
                    }}
                >
                    <Box mt={3} mb={2}>
                        <CustomizedInputBase />
                    </Box>

                    {affiliateDetail.map((detail, key) => {
                        const isLast = key === affiliateDetail.length - 1;
                        return (
                            <Row
                                property={detail.key}
                                value={detail.value}
                                key={key}
                                isLast={isLast}
                            />
                        );
                    })}
                </Box>

                {isRewardVisible && allUsersRewardInfo && allUsersRewardInfo.length > 0 && (
                    <Box mt={2}>
                        <Typography fontSize={16} fontWeight={600}>
                            Top Rewards
                        </Typography>
                        <FairLaunchReferralTable
                            fundTokenDecimals={fundTokenDecimals}
                            fundTokenSymbol={fundTokenSymbol}
                            allReferrers={allReferrers}
                            launchpadContract={launchpadContract}
                            rewardInfo={allUsersRewardInfo}
                            totalReward={totalReward}
                            totalRaisedNum={totalRaisedNum}
                            totalRewards={totalRewards}
                            affiliatePercentage={affiliatePercentage}
                            referralsInvestment={referralsInvestment}
                        />
                    </Box>
                )}
            </PrimaryCard>
        </Box>
    );
};

export default FairLaunchAffiliateProgram;

function CustomizedInputBase() {
    const [copied, setCopied] = React.useState(false);

    const refUrl = useRefIdUrl();

    const handleCopyUrl = () => {
        copyToClipboard(refUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000); // Reset the copied state after 1 second
    };

    return (
        <Paper component="form" sx={{ display: 'flex', alignItems: 'center', background: 'white' }}>
            <Typography
                color="black"
                sx={{
                    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 10px',
                    height: '30px',
                }}
            >
                Affiliate link
            </Typography>
            <InputBase
                sx={{ ml: 1, flex: 1, color: 'black', background: 'white' }}
                value={refUrl}
                readOnly
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
                color="primary"
                sx={{ p: '10px' }}
                aria-label="directions"
                onClick={handleCopyUrl}
            >
                {copied ? (
                    <FaRegCheckCircle color="#000000" size={16} />
                ) : (
                    <FaRegCopy color="#000000" size={15} />
                )}
            </IconButton>
        </Paper>
    );
}

function copyToClipboard(text) {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
}
