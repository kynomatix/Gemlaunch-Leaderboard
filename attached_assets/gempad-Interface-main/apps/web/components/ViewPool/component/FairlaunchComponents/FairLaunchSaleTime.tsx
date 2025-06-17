import { Button, Box, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import React, { useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { SALETIME_VALIDATION, UPDATE_END_TIME } from '../../formValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { LaunchpadSaleMode, LaunchpadSaleStatus, Tx } from '../../types';
import { DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { Address } from 'viem';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import toast from 'react-hot-toast';
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
import dayjs from 'dayjs';
import { useBalance, useContractReads } from 'wagmi';
import useFairLaunchDetails from '../../hooks/fairlaunchHooks/useFairlaunchDetails';

interface FormInput {
    startTime: string;
    endTime: string;
}
interface EndTimeFormInput {
    updateEndTime: string;
}

const FairLaunchSaleTime = ({
    launchpadAddress,
    launchpadName,
    contract,
    saleStatusResult,
    saleCurrentMode,
}: {
    launchpadAddress: Address;
    contract?: any;
    launchpadName: string;
    saleStatusResult: number;
    saleCurrentMode: number;
}) => {
    const {
        token,
        softCapNum,
        hasEnded,
        hasStarted,
        totalRaisedNum,
        endTimeMoment,
        currentTime: currentTimeMoment,
        launchpadContract,
    } = useFairLaunchDetails(launchpadAddress);

    const { data } = useContractReads({
        contracts: [
            { ...launchpadContract, functionName: 'currentStatus' },
            { ...launchpadContract, functionName: 'getCurrentMode' },
        ],
    });

    // const saleStatusResult = data?.[0]?.result as unknown as number ?? 0
    // const saleCurrentMode = data?.[1]?.result as unknown as number ?? 0

    const { chainId } = useActiveChainId();
    const { data: contractTokenBalance } = useBalance({
        address: launchpadAddress as Address,
        token,
    });

    const [tx, setTx] = React.useState<Tx>(Tx.Idle);
    const [txCancel, setTxCancel] = React.useState<Tx>(Tx.Idle);
    const [txFinalize, setTxFinalize] = React.useState<Tx>(Tx.Idle);
    const [txWithdraw, setTxWithdraw] = React.useState<Tx>(Tx.Idle);

    const canFinalizeSale = useMemo(() => {
        const hasReachedSoftCap = totalRaisedNum >= softCapNum;
        const canFinalized = hasEnded && hasReachedSoftCap;
        return canFinalized;
    }, [hasEnded, softCapNum, totalRaisedNum]);

    const hasContractZeroBalance = Number(contractTokenBalance?.value) === 0;

    const isSaleActive = saleStatusResult === LaunchpadSaleStatus.ACTIVE;
    const isSaleCanceled = saleStatusResult === LaunchpadSaleStatus.CANCELLED;
    const isSaleClosed = saleStatusResult === LaunchpadSaleStatus.CLOSED;

    const isPublicSale = saleCurrentMode === LaunchpadSaleMode.PUBLIC;
    const isPrivateSale = saleCurrentMode === LaunchpadSaleMode.PRIVATE;
    const isSalePending = saleCurrentMode === LaunchpadSaleMode.PENDING;

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

    const softCapNotReached = totalRaisedNum < softCapNum;

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

    const {
        control: controlUpdateEndTime,
        handleSubmit: handleSubmitUpdateEnd,
        formState: { isSubmitting: updateEndTimeSubmitting },
    } = useForm<EndTimeFormInput>({
        mode: 'onChange',
        resolver: yupResolver(UPDATE_END_TIME) as any,
        defaultValues: {
            updateEndTime: undefined,
        },
    });

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

    const UpdateEndTimes: SubmitHandler<EndTimeFormInput> = async (data: EndTimeFormInput) => {
        const { updateEndTime } = data;

        try {
            const endTimeUnix = dayjs(updateEndTime).unix() as unknown as bigint;
            setTx(Tx.Pending);

            const {
                estimateGas: { setEndTime: setEndTimeGas },
                write: { setEndTime },
            } = launchpadContract;

            const estimatedGas = await setEndTimeGas([endTimeUnix], {} as never);
            const hash = await setEndTime([endTimeUnix], { gas: estimatedGas || DefaultGasLimit });
            setTx(Tx.Processing);
            await waitForTransaction({ hash, chainId });
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name || 'error'}
                    description={e.shortMessage || 'Update EndTime Error'}
                />,
            );
        } finally {
            setTx(Tx.Idle);
        }
    };

    const cancelSale = async () => {
        try {
            setTxCancel(Tx.Pending);
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
                                            disabled={hasStarted}
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
                                            disabled={hasStarted}
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
                        disabled={
                            isSubmitting || hasStarted || isPending || isProcessing || hasEnded
                        }
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

            {isSaleCanceled || isSaleClosed ? null : (
                <form onSubmit={handleSubmitUpdateEnd(UpdateEndTimes)}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="h5" mb={'4px'}>
                                Update End Time (UTC)
                            </Typography>
                            <Controller
                                disabled={isSaleClosed || isSaleCanceled}
                                name="updateEndTime"
                                control={controlUpdateEndTime}
                                render={({
                                    field: { ref, onBlur, name, ...field },
                                    fieldState,
                                }) => {
                                    return (
                                        <DateTimePicker
                                            {...field}
                                            disabled={isSaleClosed || isSaleCanceled}
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
                        <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            disabled={
                                isPendingWithdraw ||
                                isProcessingWithdraw ||
                                isSaleCanceled ||
                                isSaleClosed
                            }
                            type="submit"
                            sx={{ marginTop: '3px' }}
                        >
                            {isIdleWithdraw && `Update End Time `}
                            {isPendingWithdraw && <ButtonLoader text="Pending..." />}
                            {isProcessingWithdraw && <ButtonLoader text="Processing..." />}
                        </Button>
                    </Box>
                </form>
            )}

            {!isSaleCanceled && softCapNotReached && (
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

            {!isSaleClosed && !softCapNotReached && (
                <Box sx={{ width: '100%' }}>
                    <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        disabled={
                            isSaleClosed ||
                            isPendingFinalize ||
                            isProcessingFinalize ||
                            softCapNotReached
                        }
                        onClick={finalizedSale}
                        // sx={{ width: { xs: '100%' } }}
                    >
                        {isIdleFinalize && 'Finalize and Withdraw'}
                        {isPendingFinalize && <ButtonLoader text="Pending..." />}
                        {isProcessingFinalize && <ButtonLoader text="Processing..." />}
                    </Button>
                </Box>
            )}
        </>
    );
};

export default FairLaunchSaleTime;
