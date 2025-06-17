import { Button, Box, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { SALETIME_VALIDATION } from '../formValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { LaunchpadSaleStatus, Tx } from '../types';
import { useLaunchpadContract } from '@/hooks/useContract';
import { DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { Address } from 'viem';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import toast from 'react-hot-toast';
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
import useLaunchpadDetails from '../hooks/useLaunchpadDetails';
import dayjs from 'dayjs';
import { useSingleCallResult } from '@/state/multicall/hooks';
import ClaimTimeModal from '../modals/ClaimTImeModal';
import { erc20ABI, useBalance, useContractRead } from 'wagmi';
import { LaunchpadABI } from '@/config/abi/launchpad';
import useGetLaunchpadContractByName from '../hooks/useGetLaunchpadContractByName';
import useLaunchpadLiquidityDetails from '../hooks/useLaunhpadLiquidityDetails';

interface FormInput {
    startTime: string;
    endTime: string;
}

const SetSaleTime = ({ launchpadAddress }: { launchpadAddress: Address }) => {
    const {
        startTime: saleStartTime,
        token,
        softCapNum,
        hardCapNum,
        endTimeMoment,
        currentTime: currentTimeMoment,
        totalRaisedNum,
        launchpadContract,
        hasStarted,
    } = useLaunchpadDetails(launchpadAddress);

    const { data: saleStatusResult, refetch } = useContractRead({
        abi: LaunchpadABI,
        address: launchpadAddress,
        functionName: 'currentStatus',
    });

    const { chainId } = useActiveChainId();
    const { data: contractTokenBalance } = useBalance({
        address: launchpadAddress as Address,
        token,
    });

    // const currentSaleStatus = result
    const [tx, setTx] = React.useState<Tx>(Tx.Idle);
    const [txCancel, setTxCancel] = React.useState<Tx>(Tx.Idle);
    const [txFinalize, setTxFinalize] = React.useState<Tx>(Tx.Idle);
    const [txWithdraw, setTxWithdraw] = React.useState<Tx>(Tx.Idle);
    const [isClaimTimeModal, setIsClaimTimeModal] = React.useState<boolean>(false);
    const [canFinalizeSale, setCanFinalizeSale] = React.useState<boolean>(false);

    useEffect(() => {
        const fetchCanFinalizeSale = async () => {
            if (endTimeMoment && softCapNum && hardCapNum) {
                const hasEndTimePassed = currentTimeMoment.isAfter(endTimeMoment);
                const hasReachedSoftCap = totalRaisedNum >= softCapNum;

                const canFinalized = hasEndTimePassed && hasReachedSoftCap;

                setCanFinalizeSale(canFinalized);
            }
        };

        fetchCanFinalizeSale();
    }, [endTimeMoment, softCapNum, hardCapNum, currentTimeMoment, totalRaisedNum]);

    const {
        liquidityDetails: { isAutoListing },
    } = useLaunchpadLiquidityDetails(launchpadAddress);

    const currentTime = dayjs();
    // const isSaleActive = saleStartTime && currentTime.isAfter(dayjs.unix(Number(saleStartTime)));

    const hasContractZeroBalance = Number(contractTokenBalance?.value) === 0;
    const isSaleActive = saleStatusResult === LaunchpadSaleStatus.ACTIVE;
    const isSaleCanceled = saleStatusResult === LaunchpadSaleStatus.CANCELLED;
    const isSaleClosed = saleStatusResult === LaunchpadSaleStatus.CLOSED;

    const isIdle = tx === Tx.Idle;
    const isPending = tx === Tx.Pending;
    const isProcessing = tx === Tx.Processing;

    // Cancel status of cancelSale
    const isIdleCancel = txCancel === Tx.Idle;
    const isPendingCancel = txCancel === Tx.Pending;
    const isProcessingCancel = txCancel === Tx.Processing;

    // Finalize Sale
    const isIdleFinalize = txFinalize === Tx.Idle;
    const isPendingFinalize = txFinalize === Tx.Pending;
    const isProcessingFinalize = txFinalize === Tx.Processing;

    // Withdraw
    const isIdleWithdraw = txWithdraw === Tx.Idle;
    const isPendingWithdraw = txWithdraw === Tx.Pending;
    const isProcessingWithdraw = txWithdraw === Tx.Processing;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormInput>({
        mode: 'onChange',
        resolver: yupResolver(SALETIME_VALIDATION) as any,
        defaultValues: {
            startTime: undefined,
            endTime: undefined,
        },
    });

    const handleClose = () => {
        setIsClaimTimeModal(false);
    };

    const onSubmit: SubmitHandler<FormInput> = async (data: FormInput) => {
        try {
            const { startTime, endTime } = data;

            const startTimeUnix = dayjs(startTime).unix() as unknown as bigint;
            const endTimeUnix = dayjs(endTime).unix() as unknown as bigint;

            setTx(Tx.Pending);

            const {
                estimateGas: { setTime: setTimeGas },
                write: { setTime },
            } = launchpadContract;

            const estimatedGas = await setTimeGas([startTimeUnix, endTimeUnix], {} as never);
            const hash = await setTime([startTimeUnix, endTimeUnix], {
                gas: estimatedGas || DefaultGasLimit,
            });

            setTx(Tx.Processing);
            await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Transaction Successfull"
                    txChainId={chainId}
                    txHash={hash}
                />,
            );
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name || 'error'}
                    description={e.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTx(Tx.Idle);
        }
    };

    const cancelSale = async () => {
        console.log('listening cancelSale contract');
        try {
            setTxCancel(Tx.Pending);

            // const { write: { cancel }, estimateGas: { cancel: cancleEstimateGas } } = contract
            const hash = await launchpadContract.write.cancel({});

            setTxCancel(Tx.Processing);
            await waitForTransaction({ hash, chainId });
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name || 'error'}
                    description={e.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTxCancel(Tx.Idle);
        }
    };

    const finalizedSale = async () => {
        console.log('listening finalizedSale contract', canFinalizeSale);

        if (!canFinalizeSale) {
            toast.error(
                <DescriptionWithTx
                    title={'Sale Error'}
                    description={'Sale End Time or SoftCap not reached'}
                />,
            );
            return;
        }

        try {
            setTxFinalize(Tx.Pending);
            const hash = await launchpadContract.write.finalize({});
            setTxFinalize(Tx.Processing);
            await waitForTransaction({ hash, chainId });
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name || 'error'}
                    description={e.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTxFinalize(Tx.Idle);
        }
    };

    const withdrawTokens = async () => {
        console.log('listening Withdraw token contract');
        try {
            setTxWithdraw(Tx.Pending);
            const hash = await launchpadContract.write.withdrawTokens({});
            setTxWithdraw(Tx.Processing);
            await waitForTransaction({ hash, chainId });
            refetch();
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name || 'error'}
                    description={e.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTxWithdraw(Tx.Idle);
        }
    };

    return (
        <>
            {
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box
                        sx={{
                            mb: '15px',
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'space-between',
                            flexDirection: { xs: 'column' },
                        }}
                    >
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="h5" mb={'4px'}>
                                Start Time (UTC)
                            </Typography>
                            <Controller
                                disabled={hasStarted}
                                name="startTime"
                                control={control}
                                render={({
                                    field: { ref, onBlur, name, ...field },
                                    fieldState,
                                }) => {
                                    return (
                                        <DateTimePicker
                                            {...field}
                                            sx={{ width: '100%', fontSize: '12px' }}
                                            inputRef={ref}
                                            disablePast={true}
                                            timezone="UTC"
                                            slotProps={{
                                                textField: {
                                                    onBlur,
                                                    name,
                                                    error: !!fieldState.error,
                                                    helperText: fieldState?.error?.message,
                                                },
                                            }}
                                        />
                                    );
                                }}
                            />{' '}
                        </Box>
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="h5" mb={'4px'}>
                                End Time (UTC)
                            </Typography>
                            <Controller
                                disabled={hasStarted}
                                name="endTime"
                                control={control}
                                render={({
                                    field: { ref, onBlur, name, ...field },
                                    fieldState,
                                }) => {
                                    return (
                                        <DateTimePicker
                                            {...field}
                                            sx={{ width: '100%', fontSize: '12px' }}
                                            inputRef={ref}
                                            disablePast={true}
                                            timezone="UTC"
                                            slotProps={{
                                                textField: {
                                                    onBlur,
                                                    name,
                                                    error: !!fieldState.error,
                                                    helperText: fieldState?.error?.message,
                                                },
                                            }}
                                        />
                                    );
                                }}
                            />{' '}
                        </Box>
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="small"
                        disabled={isSubmitting || hasStarted || isPending || isProcessing}
                    >
                        {hasStarted ? 'Sale Started' : isIdle ? 'Confirm' : null}
                        {isPending && <ButtonLoader text="Pending..." />}
                        {isProcessing && <ButtonLoader text="Processing..." />}
                    </Button>
                    {hasStarted && (
                        <Typography color="#FF0B22" fontSize="12px">
                            Sale Started
                        </Typography>
                    )}
                </form>
            }

            {isSaleClosed ? null : (
                <Box sx={{ width: '100%' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        disabled={isSaleCanceled || isPendingCancel || isProcessingCancel}
                        onClick={cancelSale}
                        // sx={{ width: { xs: '100%' } }}
                    >
                        {isIdleCancel && !isSaleCanceled && 'Cancel Sale'}
                        {isSaleCanceled && 'Sale Cancelled'}
                        {isPendingCancel && <ButtonLoader text="Pending..." />}
                        {isProcessingCancel && <ButtonLoader text="Processing..." />}
                    </Button>
                </Box>
            )}

            {isSaleCanceled ? null : (
                <Box sx={{ width: '100%' }}>
                    <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        disabled={isSaleClosed || isPendingFinalize || isProcessingFinalize}
                        onClick={finalizedSale}
                        // sx={{ width: { xs: '100%' } }}
                    >
                        {isIdleFinalize && 'Finalize Sale'}
                        {isPendingFinalize && <ButtonLoader text="Pending..." />}
                        {isProcessingFinalize && <ButtonLoader text="Processing..." />}
                    </Button>
                </Box>
            )}

            {isSaleClosed || isSaleCanceled || isAutoListing ? null : (
                <Box sx={{ width: '100%' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => setIsClaimTimeModal(true)}
                    >
                        {'Set Claim Time'}
                    </Button>
                </Box>
            )}

            {hasContractZeroBalance ? null : (
                <Box sx={{ width: '100%' }}>
                    <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        disabled={
                            hasContractZeroBalance ||
                            isPendingWithdraw ||
                            isProcessingWithdraw ||
                            (!isSaleClosed && !isSaleCanceled)
                        }
                        onClick={withdrawTokens}
                        // sx={{ width: { xs: '100%' } }}
                    >
                        {isIdleWithdraw &&
                            `Withdraw (${contractTokenBalance?.formatted}  ${contractTokenBalance?.symbol})`}
                        {isPendingWithdraw && <ButtonLoader text="Pending..." />}
                        {isProcessingWithdraw && <ButtonLoader text="Processing..." />}
                    </Button>
                </Box>
            )}

            <ClaimTimeModal
                open={isClaimTimeModal}
                handleClose={handleClose}
                contractAddress={launchpadAddress}
            />
        </>
    );
};

export default SetSaleTime;
