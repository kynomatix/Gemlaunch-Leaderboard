'use client';

import PrimaryCard from '@/components/Cards/PrimaryCard';
import LockInfo from '@/components/TokenSlug/LockInfo';
import { Box, Typography } from '@mui/material';
import * as React from 'react';

import BoxLoader from '@/components/BoxLoader';
import CountdownTimer from '@/components/CountdownTimer';
import EditLock from '@/components/Locker/EditLock';
import { GET_SINGLE_RECORD } from '@/components/Locker/query';
import { QueryData } from '@/components/Locker/types';
import { LOCKER_CONTRACT_ADDRESSES } from '@/constants';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { useLockerContract } from '@/hooks/useContract';
import useTokenDetails from '@/hooks/useTokenDetails';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { calculateVesting } from '@/utils/calculateVesting';
import { formatDate } from '@/utils/formatDate';
import { OperationVariables, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { Address, formatUnits } from 'viem';
import { useAccount } from 'wagmi';

import utc from 'dayjs/plugin/utc'; // Enable UTC plugin
import { useTransactionTracking } from '@/hooks/useTransactionTracking';

dayjs.extend(utc);

const Record = ({ params }: { params: { slug: string } }) => {
    const { address } = useAccount();
    const { chainId } = useActiveChainId();

    const {
        data,
        refetch,
        loading: isLoading,
        startPolling,
        stopPolling,
    } = useQuery<QueryData, OperationVariables>(GET_SINGLE_RECORD, {
        variables: {
            lockId: params?.slug?.[0],
        },
        context: { chainId },
        fetchPolicy: 'network-only',
    });

    const record = data?.locks?.[0];

    React.useEffect(() => {
        let pollingInterval;

        if (!data) {
            // Start polling if data is undefined
            startPolling(5000); // Poll every 5 seconds
        } else {
            // Stop polling if data is not undefined
            stopPolling();
        }

        // Clear interval on component unmount
        return () => clearInterval(pollingInterval);
    }, [data, refetch, startPolling, stopPolling]);

    // Manually trigger refetch
    // eslint-disable-next-line consistent-return
    React.useEffect(() => {
        if (data) {
            const pollingInterval = setInterval(() => {
                refetch();
            }, 5000);

            return () => clearInterval(pollingInterval);
        }
    }, [data, refetch]);

    // const { tracking: lockAddedTracking } = useTransactionTracking('lock-added', {
    //     onCompleted: () => refetch()
    // });
    // const { tracking: lockVestedTracking } = useTransactionTracking('vest-added', {
    //     onCompleted: () => refetch()
    // });

    const lockerContract = useLockerContract(LOCKER_CONTRACT_ADDRESSES[chainId] as Address);

    const {
        amount: lockedAmount,
        cycleShare,
        depositDate,
        id: lockId,
        interval,
        owner,
        status,
        tge,
        token,
        unlockDate,
        title,
    } = record || {};

    const { result: lock, loading } = useSingleCallResult({
        contract: lockerContract,
        functionName: 'getLockById',
        args: [BigInt(lockId ?? 0n)],
    });

    const {
        state: { tokenDetails, isFetching },
    } = useTokenDetails(record?.token?.id as Address);
    const isTokenDetailsAvailable = !!tokenDetails;

    const tokenBalance: number | string = tokenDetails?.[3]?.value || 0;
    const tokenDecimals: number | string = tokenDetails?.[2]?.value || 0;

    // Normal tokens data
    const NormalTokenData = [
        {
            id: 1,
            property: 'Token Address',
            value: token?.id,
            isAddress: true,
        },
        { id: 2, property: 'Token Name', value: token?.name },
        { id: 3, property: 'Token Symbol', value: token?.symbol },
        { id: 4, property: 'Token Decimals', value: token?.decimals },
        {
            id: 5,
            property: 'Token Balance',
            value: tokenBalance,
        },
    ];
    const NoramlTokenLockInformation = [
        { id: 1, property: 'Title', value: lock?.description },
        {
            id: 2,
            property: 'Total Amount Locked',
            value: `${formatUnits(lock?.amount || 0n, token?.decimals || 18)} ${token?.symbol}`,
        },
        { id: 3, property: 'Total Values Locked', value: `$ ${token?.tokenLockedInUsd}` },
        {
            id: 4,
            property: 'Owner',
            value: lock?.owner,
            isAddress: true,
        },
        {
            id: 5,
            property: 'Lock Date',
            value: dayjs.utc(Number(lock?.lockDate) * 1000).format('YYYY-MM-DD HH:mm:ss UTC'),
        },
        {
            id: 6,
            property: 'Unlock Date',
            value: dayjs.utc(Number(lock?.tgeDate) * 1000).format('YYYY-MM-DD HH:mm:ss UTC'),
        },
        {
            id: 7,
            property: 'Unlocked Token',
            value: `${formatUnits(
                lock?.unlockedAmount || 0n,
                token?.decimals || 18,
            )} ${token?.symbol}`,
        },
    ];

    // Pair tokens data
    const pairTokenData = [
        {
            id: 1,
            property: 'Pair Address',
            value: token?.id,
            isAddress: true,
        },
        {
            id: 2,
            property: 'Pair Name',
            value: `${token?.token0?.symbol}/${token?.token1?.symbol}`,
        },
        { id: 3, property: 'Token', value: token?.name },
        {
            id: 4,
            property: 'Token Balance',
            value: tokenBalance,
        },
    ];
    const pairTokenLockInforamtion = [
        { id: 1, property: 'Title', value: lock?.description },
        {
            id: 2,
            property: 'Total Amount Locked',
            value: `${formatUnits(lockedAmount || 0n, token?.decimals || 18)} ${token?.token0
                ?.symbol}/${token?.token1?.symbol}`,
        },
        { id: 3, property: 'Total Values Locked', value: `$ ${token?.tokenLockedInUsd}` },
        {
            id: 4,
            property: 'Owner',
            value: owner?.id,
            isAddress: true,
        },
        { id: 5, property: 'Lock Date', value: dayjs.utc(Number(lock?.lockDate))?.toString() },
        { id: 6, property: 'Unlock Date', value: dayjs.utc(Number(lock?.tgeDate))?.toString() },
        {
            id: 7,
            property: 'Unlocked Token',
            value: `${formatUnits(
                lock?.unlockedAmount || 0n,
                token?.decimals || 18,
            )} ${token?.symbol}`,
        },
    ];

    const vestingDetails = React.useMemo(() => {
        const vd = calculateVesting({
            totalAmount: +formatUnits(record?.amount ?? 0n, record?.token?.decimals ?? 18),
            cyclePercent: Number(record?.cycleShare) / 1e2,
            intervalTime: Number(record?.interval),
            TGEPercent: Number(record?.tge) / 1e2,
            unlockTime: dayjs(record?.unlockDate).unix(),
        });
        return vd;
    }, [record]);

    const isAllTokensUnlocked = lock?.unlockedAmount === lock?.amount;
    const isUserOwner = lock?.owner?.toLowerCase() === address?.toLowerCase().toString();
    // const isTracking = lockAddedTracking || lockVestedTracking;

    return (
        <Box>
            {params.slug.length < 2 && (
                <Box>
                    <PrimaryCard py={20} mt={30}>
                        <Typography variant="body1" fontSize={18} textAlign="center">
                            Unlock in
                        </Typography>

                        <CountdownTimer endTime={record?.unlockDate || ''} />
                        {isAllTokensUnlocked && (
                            <Typography
                                variant="body1"
                                fontSize={18}
                                sx={{ color: '#FF8484', mt: 1 }}
                                textAlign="center"
                            >
                                All Tokens Unlocked
                            </Typography>
                        )}
                    </PrimaryCard>

                    {record && record.token ? (
                        <>
                            <LockInfo
                                data={
                                    record?.token?.isLiquidityToken
                                        ? pairTokenData
                                        : NormalTokenData
                                }
                                title="Token Info"
                                refetch={refetch}
                            />

                            <LockInfo
                                data={
                                    token?.isLiquidityToken
                                        ? pairTokenLockInforamtion
                                        : NoramlTokenLockInformation
                                }
                                isUserOwner={isUserOwner}
                                lockId={BigInt(lockId)}
                                refetch={refetch}
                                record={record}
                                vestingDetails={vestingDetails}
                                isAllTokensUnlocked={isAllTokensUnlocked}
                            />
                        </>
                    ) : (
                        <>
                            <PrimaryCard py={20} mt={30}>
                                <BoxLoader />
                            </PrimaryCard>
                            <PrimaryCard py={20} mt={30}>
                                <BoxLoader />
                            </PrimaryCard>
                        </>
                    )}
                </Box>
            )}

            {/* *** EDIT OPTIONS *** */}
            {params.slug[1] === 'edit' && (
                <EditLock
                    record={record}
                    tokenDecimals={tokenDecimals}
                    tokenBalance={tokenBalance}
                    pairTokenData={pairTokenData}
                    normalTokenData={NormalTokenData}
                    refetch={refetch}
                />
            )}
        </Box>
    );
};

export default Record;
