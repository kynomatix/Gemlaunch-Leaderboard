'use client';

import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import {
    Box,
    Typography,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TextField,
    Skeleton,
} from '@mui/material';
import Divider from '../Divider/Divider';
import AppPagination from '../AppPagination/AppPagination';
import { Address, useAccount, useNetwork } from 'wagmi';
import MainModal from '../Modals';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import TextFieldError from '../TextField/TextFieldError';
import * as yup from 'yup';
import { isValidAddress } from '@/utils/format';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateAntibotContract } from '@/hooks/useContract';
import { ANTIBOT_CONTRACT_ADDRESSES, DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import ButtonLoader from '../ButtonLoader/ButtonLoader';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import toast from 'react-hot-toast';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { WHITE_BLACK_LIST_VALIDATION } from './validation';
import { placeholder, tableContainerStyles } from './constants';
import { OperationVariables, useLazyQuery, useQuery } from '@apollo/client';
import { GET_WHITE_BLACK_LIST } from './query';
import { Antibot, AntibotOrderByInput, AntibotsConnection } from '@/src/gql/graphql';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import NotFound from './NotFound';
import { TransactionTrackingContext } from '../Provider/TransactionTrackingProvider';
import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import RowLoader from './RowLoader';
import TableSkeleton from './TableSkeleton';
import { useActiveChain } from '@thirdweb-dev/react';
import { useActiveChainId } from '@/hooks/useActiveChainId';

interface Props {
    tokenAddress: Address;
    label: string;
}

interface BlackWhitlistFormInput {
    users: string;
}

enum Transaction {
    IDLE,
    PENDING,
    PROCESSING,
}

const BlackWhiteList = ({ label, tokenAddress }: Props) => {
    const [openModal, setOpenModal] = React.useState<boolean>(false);
    const [transaction, setTransaction] = React.useState<Transaction>(Transaction.IDLE);
    const [title, setTitle] = React.useState<string>();
    const [whiteBlackList, setWhiteBlackList] = React.useState<string[]>();

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 5;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const isPending = transaction === Transaction.PENDING;
    const isProcessing = transaction === Transaction.PROCESSING;
    const isIdle = transaction === Transaction.IDLE;

    const { addTransaction } = React.useContext(TransactionTrackingContext);

    const { address } = useAccount();
    const { chainId } = useActiveChainId();

    const {
        data: queryData,
        refetch,
        loading: getListLoading,
        startPolling,
        stopPolling,
    } = useQuery<any, OperationVariables>(GET_WHITE_BLACK_LIST, {
        variables: {
            id: tokenAddress.toLowerCase(),
        },
        context: { chainId },
        fetchPolicy: 'network-only',
    });

    React.useEffect(() => {
        let pollingInterval = 5000;
        if (!queryData) {
            startPolling(pollingInterval);
        } else {
            stopPolling();
        }
        return () => clearInterval(pollingInterval);
    }, [queryData, refetch, startPolling, stopPolling]);

    const { tracking: blacklistAddedTracking } = useTransactionTracking('blacklist-added', {
        onCompleted: () => refetch(),
    });
    const { tracking: blacklistRemovedTracking } = useTransactionTracking('blacklist-removed', {
        onCompleted: () => refetch(),
    });
    const { tracking: whitelistAddedTracking } = useTransactionTracking('whitelist-added', {
        onCompleted: () => refetch(),
    });
    const { tracking: whitelistRemovedTracking } = useTransactionTracking('whitelist-removed', {
        onCompleted: () => refetch(),
    });

    const isBlacklistTrakingOn = blacklistAddedTracking || blacklistRemovedTracking;
    const isWhitelistTrackingOn = whitelistAddedTracking || whitelistRemovedTracking;
    const isWhiteBlackListAvailable = whiteBlackList?.length > 0;

    React.useEffect(() => {
        if (label === 'Blacklist') {
            setWhiteBlackList(queryData?.antibots?.[0]?.blacklist);
            return;
        }

        if (label === 'Whitelist') {
            setWhiteBlackList(queryData?.antibots?.[0]?.whitelist);
            return;
        }
    }, [queryData, label]);

    const ANTIBOT = useCreateAntibotContract(ANTIBOT_CONTRACT_ADDRESSES[chainId] as Address);

    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<BlackWhitlistFormInput>({
        mode: 'onChange',
        defaultValues: {
            users: undefined,
        },
        resolver: yupResolver(WHITE_BLACK_LIST_VALIDATION) as any,
    });

    const addBlackWhitelists = React.useCallback(
        async (data: Address[]) => {
            const {
                estimateGas: {
                    addBlackLists: estimateBalcklistgas,
                    addWhiteLists: estimateWhitelistGas,
                },
                write: { addBlackLists, addWhiteLists },
            } = ANTIBOT;
            const isBlacklist = label === 'Blacklist';
            const estimateGas = isBlacklist ? estimateBalcklistgas : estimateWhitelistGas;
            const addBlackWhitelist = isBlacklist ? addBlackLists : addWhiteLists;

            const estimatedGas = await estimateGas([tokenAddress, data], {} as never);
            const hash = await addBlackWhitelist([tokenAddress, data], {
                gas: estimatedGas || DefaultGasLimit,
            });

            setTransaction(Transaction.PROCESSING);
            addTransaction({ type: isBlacklist ? 'blacklist-added' : 'whitelist-added', hash });
            await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Transaction Successfull"
                    txChainId={chainId}
                    txHash={hash}
                />,
            );
        },
        [tokenAddress, ANTIBOT, chainId, label, addTransaction],
    );

    const removeBlackWhitelists = React.useCallback(
        async (data: Address[]) => {
            const {
                estimateGas: {
                    removeblackLists: estimateBalcklistgas,
                    removeWhiteLists: estimateWhitelistGas,
                },
                write: { removeblackLists, removeWhiteLists },
            } = ANTIBOT;
            const isBlacklist = label === 'Blacklist';
            const estimateGas = isBlacklist ? estimateBalcklistgas : estimateWhitelistGas;
            const removeBlackWhitelist = isBlacklist ? removeblackLists : removeWhiteLists;

            const estimatedGas = await estimateGas([tokenAddress, data], {} as never);
            const hash = await removeBlackWhitelist([tokenAddress, data], {
                gas: estimatedGas || DefaultGasLimit,
            });

            setTransaction(Transaction.PROCESSING);
            addTransaction({ type: isBlacklist ? 'blacklist-removed' : 'whitelist-removed', hash });
            await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Transaction Successfull"
                    txChainId={chainId}
                    txHash={hash}
                />,
            );
        },
        [tokenAddress, ANTIBOT, chainId, label, addTransaction],
    );

    const onSubmit: SubmitHandler<BlackWhitlistFormInput> = async (
        data: BlackWhitlistFormInput,
    ) => {
        try {
            setTransaction(Transaction.PENDING);
            const { users } = data;
            const addresses = users.split('\n');

            if (title === 'Add') {
                await addBlackWhitelists(addresses as Address[]);
            }

            if (title === 'Remove') {
                await removeBlackWhitelists(addresses as Address[]);
            }
            handleCloseModal();
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name || 'error'}
                    description={e.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTransaction(Transaction.IDLE);
        }
    };

    const handleOpenModal = (title) => {
        setTitle(title);
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <PrimaryCard mt={30} py={25}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                }}
            >
                <Typography>{label}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <Button
                        onClick={() => handleOpenModal('Add')}
                        variant="outlined"
                        sx={{ px: '20px', width: { xs: '100%', sm: 'auto' } }}
                    >{`Add user to ${label.toLowerCase()}`}</Button>
                    <Button
                        onClick={() => handleOpenModal('Remove')}
                        variant="outlined"
                        sx={{ px: '20px', width: { xs: '100%', sm: 'auto' } }}
                    >{`Remove user from ${label.toLowerCase()}`}</Button>
                </Box>
            </Box>

            <Divider color="#FFFFFF" />

            <TableContainer sx={tableContainerStyles} component={Paper}>
                <Table>
                    {whiteBlackList && (
                        <TableHead>
                            <TableRow sx={{ borderBottom: '1px solid #ffffff25' }}>
                                <TableCell sx={{ border: 0, width: '50%' }}>
                                    <Typography color="common.white" fontSize={14} fontWeight={600}>
                                        No.
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ border: 0 }} align="left">
                                    <Typography color="common.white" fontSize={14} fontWeight={600}>
                                        Addresses
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                    )}
                    <TableBody>
                        {isBlacklistTrakingOn && <RowLoader />}
                        {isWhitelistTrackingOn && <RowLoader />}
                        {whiteBlackList?.slice(startIndex, endIndex).map((addr, idx) => (
                            <TableRow key={idx} sx={{ borderBottom: '1px solid #ffffff25' }}>
                                <TableCell sx={{ border: 0 }}>
                                    <Typography variant="h5" fontSize={14} color="common.white">
                                        {String(startIndex + idx + 1).padStart(2, '0')}
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ border: 0 }} align="left">
                                    <Typography variant="h5" fontSize={14} color="primary">
                                        {addr}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}

                        {!isWhiteBlackListAvailable &&
                            !getListLoading &&
                            !isBlacklistTrakingOn &&
                            !isWhitelistTrackingOn && <NotFound />}
                        {getListLoading && <TableSkeleton />}

                        {isWhiteBlackListAvailable && (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    sx={{ pt: '20px', pb: '10px', borderBottom: 'none' }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <AppPagination
                                            count={Math.ceil(
                                                (whiteBlackList?.length || 1) / itemsPerPage,
                                            )}
                                            onChange={(_, page) => setCurrentPage(page)}
                                        />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <MainModal
                title={`${title} ${label.toLowerCase()}`}
                openModal={openModal}
                onClose={handleCloseModal}
            >
                <Typography variant="h5" fontSize={14} color="common.white">
                    Users
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="users"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="text"
                                value={field.value}
                                fullWidth
                                multiline
                                rows={8}
                                placeholder={placeholder}
                                margin="normal"
                                error={!!errors?.users}
                                helperText={<TextFieldError fieldName={errors?.users} />}
                                InputProps={{
                                    style: { fontSize: '12px' }, // Adjust the font size as needed
                                }}
                            />
                        )}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            size="small"
                            type="submit"
                            disabled={isSubmitting}
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            {isPending && <ButtonLoader text="Pending" />}
                            {isProcessing && <ButtonLoader text="Processing" />}
                            {isIdle && `${title} Users`}
                        </Button>
                    </Box>
                </form>
            </MainModal>
        </PrimaryCard>
    );
};

export default BlackWhiteList;
