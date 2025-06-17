'use client';

import React, { useContext } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Skeleton,
    Table,
    TableContainer,
    Typography,
} from '@mui/material';
import InfoIcon from 'public/assets/icons/info-icon.svg';
import PrimaryCard from '@/components/Cards/PrimaryCard';
import { shortenAddress } from '@/utils/format';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import { getBlockExploreLink } from '@/utils';
import { useAccount, useNetwork } from 'wagmi';
import RenounceLockOwnershipModal from '../Modals/RenounceLockOwnershipModal';
import TransferOwnershipModal from '../Modals/TransferOwnershipModal';
import { canWithDraw } from '@/utils/locker';
import { useLockerContract } from '@/hooks/useContract';
import { DefaultGasLimit, LOCKER_CONTRACT_ADDRESSES } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { Address, formatUnits } from 'viem';
import { useRouter } from 'next/navigation';
import { getVestingInfo } from '@/utils/getVestingInfo';
import dayjs from 'dayjs';
import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import { TransactionTrackingContext } from '../Provider/TransactionTrackingProvider';
import { VestingSchedule, calculateVesting } from '@/utils/calculateVesting';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VestingTable from './VestingTable';
import { LockRecord, TokenData } from '../Locker/types';
import { Lock } from '@/src/gql/graphql';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import toast from 'react-hot-toast';
import ButtonLoader from '../ButtonLoader/ButtonLoader';

enum Transaction {
    IDLE,
    WAITING,
    PROCESSING,
}

const LockInfo = ({
    data,
    refetch,
    title,
    isUserOwner,
    lockId,
    record,
    vestingDetails,
    isAllTokensUnlocked,
}: {
    data: TokenData[];
    refetch: any;
    title?: string;
    isUserOwner?: boolean;
    lockId?: bigint;
    record?: Lock;
    vestingDetails?: VestingSchedule[];
    isAllTokensUnlocked?: boolean;
}) => {
    const isMobile = useMediaQuery('(max-width:800px)');
    const { chainId } = useActiveChainId();
    const lockerContract = useLockerContract(LOCKER_CONTRACT_ADDRESSES[chainId] as Address);
    const [openRenounceModal, setOpenRenounceModal] = React.useState<boolean>(false);
    const [openTransferModal, setOpenTransferModal] = React.useState<boolean>(false);
    const [transaction, setTransaction] = React.useState<Transaction>(Transaction.IDLE);
    const { addTransaction } = useContext(TransactionTrackingContext);

    const isVestingActive = record?.tge || record?.cycleShare || record?.interval;

    const { result } = useSingleCallResult({
        contract: lockerContract,
        functionName: 'withdrawableTokens',
        args: [BigInt(lockId || 0n)],
    });
    // @ts-ignore
    const withdrawableTokens = Number(
        formatUnits((result as bigint) ?? 0n, record?.token?.decimals ?? 18),
    );

    // const { tracking: lockTransferTracking } = useTransactionTracking('lock-transferred', {
    //     onCompleted: () => refetch(),
    // });
    // const { tracking: lockWithdrawnTracking } = useTransactionTracking('lock-withdrawn', {
    //     onCompleted: () => refetch(),
    // });
    // const { tracking: lockExtendedTracking } = useTransactionTracking('lock-extended', {
    //     onCompleted: () => refetch(),
    // });

    const isTracking = false;
    // lockTransferTracking || lockWithdrawnTracking || lockExtendedTracking;

    const handleUnlock = async () => {
        setTransaction(Transaction.WAITING);
        try {
            const estimatedGas = await lockerContract.estimateGas.unlock(
                [BigInt(lockId)],
                {} as never,
            );
            const hash = await lockerContract.write.unlock([BigInt(lockId)], {
                gas: estimatedGas || DefaultGasLimit,
            });
            setTransaction(Transaction.PROCESSING);
            await waitForTransaction({ hash, chainId });
            addTransaction({ type: 'lock-withdrawn', hash });
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e?.name || 'Error'}
                    description={e?.shortMessage ?? 'Something went wrong'}
                />,
            );
        } finally {
            setTransaction(Transaction.IDLE);
        }
    };

    const vestingInfo = [
        { id: 1, property: 'TGE Percent', value: `${Number(record?.tge) / 1e2} %` },
        { id: 2, property: 'Cycle', value: `${Number(record?.interval) / 60} Minutes` },
        {
            id: 3,
            property: 'Cycle Release Percent',
            value: `${Number(record?.cycleShare) / 1e2} %`,
        },
    ];

    const unlockDateTime = dayjs(record?.unlockDate);
    const currentDateTime = dayjs();
    const isNormalTokensUnlocked = currentDateTime.isAfter(unlockDateTime);

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    px: '30px',
                    pb: '17px',
                    mt: '30px',
                }}
            >
                <Typography variant="h5" fontSize={20}>
                    {title ? title : 'Lock Info'}
                </Typography>
                <InfoIcon />
            </Box>

            <PrimaryCard py={25}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15   px' }}>
                    <Box>
                        {data.map(({ id, property, value, isAddress }) => (
                            <>
                                {value && (
                                    <Box
                                        key={id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '10px',
                                            flexWrap: 'wrap',
                                            borderBottom: '1px solid #ffffff25',
                                            py: '10px',
                                        }}
                                    >
                                        <Typography variant="h5" fontSize={14}>
                                            {property}
                                        </Typography>

                                        {isAddress ? (
                                            <Link
                                                href={getBlockExploreLink(
                                                    value,
                                                    title ? 'token' : 'address',
                                                    chainId,
                                                )}
                                                target="_blank"
                                            >
                                                <Typography
                                                    sx={{
                                                        '&:hover': { opacity: '0.7' },
                                                        transition: 'all 0.3s ease',
                                                    }}
                                                    variant="h5"
                                                    fontSize={14}
                                                    color={isAddress ? 'primary' : 'common.white'}
                                                >
                                                    {isTracking ? (
                                                        <Skeleton
                                                            variant="rounded"
                                                            animation="wave"
                                                        >
                                                            <Typography>
                                                                {isMobile
                                                                    ? shortenAddress(value)
                                                                    : value}
                                                            </Typography>
                                                        </Skeleton>
                                                    ) : (
                                                        <>
                                                            {isMobile
                                                                ? shortenAddress(value)
                                                                : value}
                                                        </>
                                                    )}
                                                </Typography>
                                            </Link>
                                        ) : (
                                            <Typography
                                                variant="h5"
                                                fontSize={14}
                                                color={isAddress ? 'primary' : 'common.white'}
                                            >
                                                {isTracking ? (
                                                    <Skeleton variant="rounded" animation="wave">
                                                        <Typography>{value}</Typography>
                                                    </Skeleton>
                                                ) : (
                                                    <>{value}</>
                                                )}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </>
                        ))}
                    </Box>

                    <Box>
                        {isVestingActive && (
                            <>
                                {vestingInfo?.map(({ id, property, value }) => (
                                    <Box
                                        key={id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '10px',
                                            flexWrap: 'wrap',
                                            borderBottom: '1px solid #ffffff25',
                                            py: '10px',
                                        }}
                                    >
                                        <Typography variant="h5" fontSize={14}>
                                            {property}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                '&:hover': { opacity: '0.7' },
                                                transition: 'all 0.3s ease',
                                            }}
                                            variant="h5"
                                            fontSize={14}
                                            color="common.white"
                                        >
                                            {value}
                                        </Typography>
                                    </Box>
                                ))}
                            </>
                        )}
                    </Box>

                    <Box>
                        {isVestingActive && (
                            <Accordion
                                elevation={0}
                                sx={{
                                    backgroundColor: 'transparent',
                                    px: '0px',
                                    boxShadow: 'none',
                                    border: 0,
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon sx={{ color: '#FFF' }} />}
                                >
                                    <Typography variant="h5" fontSize={14} color="common.white">
                                        Vesting Info
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <VestingTable vestingDetails={vestingDetails} />
                                </AccordionDetails>
                            </Accordion>
                        )}
                    </Box>

                    <Box>
                        {isUserOwner && (
                            <Box
                                sx={{
                                    mt: 3,
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6} lg={3}>
                                        <Button
                                            onClick={() => setOpenTransferModal(true)}
                                            variant="outlined"
                                            size="small"
                                            disabled={isTracking || isAllTokensUnlocked}
                                            sx={{ whiteSpace: 'nowrap', width: '100%' }}
                                        >
                                            Transfer Ownership
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={3}>
                                        <Button
                                            onClick={() => setOpenRenounceModal(true)}
                                            variant="outlined"
                                            size="small"
                                            disabled={isTracking || isAllTokensUnlocked}
                                            sx={{ whiteSpace: 'nowrap', width: '100%' }}
                                        >
                                            Renounce Ownership
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={3}>
                                        {isAllTokensUnlocked ? (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                disabled={isTracking || isAllTokensUnlocked}
                                                sx={{ whiteSpace: 'nowrap', width: '100%' }}
                                            >
                                                Extend Lock
                                            </Button>
                                        ) : (
                                            <Link href={`${record.id}/edit`}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    disabled={isTracking}
                                                    sx={{ whiteSpace: 'nowrap', width: '100%' }}
                                                >
                                                    Extend Lock
                                                </Button>
                                            </Link>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={3}>
                                        {isVestingActive ? (
                                            <Button
                                                onClick={handleUnlock}
                                                variant="contained"
                                                disabled={
                                                    !canWithDraw(record) ||
                                                    transaction !== Transaction.IDLE ||
                                                    withdrawableTokens === 0
                                                }
                                                size="small"
                                                sx={{ whiteSpace: 'nowrap', width: '100%' }}
                                            >
                                                {transaction === Transaction.IDLE &&
                                                    `Unlock (${withdrawableTokens})`}

                                                {transaction === Transaction.WAITING && (
                                                    <ButtonLoader text="Unlocking" />
                                                )}
                                                {transaction === Transaction.PROCESSING && (
                                                    <ButtonLoader text="Processing" />
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleUnlock}
                                                variant="contained"
                                                disabled={
                                                    transaction !== Transaction.IDLE ||
                                                    !isNormalTokensUnlocked ||
                                                    isAllTokensUnlocked
                                                }
                                                size="small"
                                                sx={{ whiteSpace: 'nowrap', width: '100%' }}
                                            >
                                                {transaction === Transaction.IDLE && 'Unlock'}

                                                {transaction === Transaction.WAITING && (
                                                    <ButtonLoader text="Unlocking" />
                                                )}
                                                {transaction === Transaction.PROCESSING && (
                                                    <ButtonLoader text="Processing" />
                                                )}
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </Box>
            </PrimaryCard>

            <RenounceLockOwnershipModal
                modalState={{ open: openRenounceModal, setOpen: setOpenRenounceModal }}
                lockId={lockId}
                refetch={refetch}
            />
            <TransferOwnershipModal
                refetch={refetch}
                modalState={{ open: openTransferModal, setOpen: setOpenTransferModal }}
                lockId={lockId}
            />
        </Box>
    );
};

export default LockInfo;
