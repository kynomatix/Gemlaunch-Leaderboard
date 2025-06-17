import { Button, Box, Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { waitForTransaction } from 'wagmi/actions';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { Address } from 'viem';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import toast from 'react-hot-toast';
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
import { useBalance, useContractReads } from 'wagmi';
import useAuctionDetails from '../../hooks/auctionHooks/useAuctionDetails';
import ClaimTimeModal from '../../modals/ClaimTImeModal';
import { LaunchpadSaleMode, LaunchpadSaleStatus, Tx } from '../../types';
import useSubscriptionDetails from '../../hooks/subscriptionHoosk/useSubscriptionDetails';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { SALETIME_VALIDATION } from '../../formValidation';
import { DefaultGasLimit } from '@/constants';
import dayjs from 'dayjs';

interface FormInput {
    startTime: string;
    endTime: string;
}
interface EndTimeFormInput {
    updateEndTime: string;
}

const SubscriptionPreSaleTime = ({ launchpadAddress }: { launchpadAddress: Address }) => {
    const [tx, setTx] = React.useState<Tx>(Tx.Idle);
    const [txCancel, setTxCancel] = React.useState<Tx>(Tx.Idle);
    const [txFinalize, setTxFinalize] = React.useState<Tx>(Tx.Idle);
    const [txWithdraw, setTxWithdraw] = React.useState<Tx>(Tx.Idle);

    const {
        token,
        softCapNum,
        hasEnded,
        totalRaisedNum,
        endTimeMoment,
        currentTime: currentTimeMoment,
        launchpadContract,
        currentSaleModeBigInt,
        currentLaunchpadStatus,
        saleActive,
        hasStarted,
    } = useSubscriptionDetails(launchpadAddress);

    const { chainId } = useActiveChainId();
    const { data: contractTokenBalance } = useBalance({
        address: launchpadAddress as Address,
        token,
    });

    const hasContractZeroBalance = Number(contractTokenBalance?.value) === 0;

    const isSaleActive = currentLaunchpadStatus === LaunchpadSaleStatus.ACTIVE;
    const isSaleCanceled = currentLaunchpadStatus === LaunchpadSaleStatus.CANCELLED;
    const isSaleClosed = currentLaunchpadStatus === LaunchpadSaleStatus.CLOSED;

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

    // const withdrawTokens = async () => {
    //   console.log('listening Withdraw token contract')
    //   try {
    //     setTxWithdraw(Tx.Pending);
    //     const hash = await launchpadContract.write.withdrawTokens({});
    //     setTxWithdraw(Tx.Processing);
    //     await waitForTransaction({ hash, chainId });
    //   } catch (e: any) {
    //     console.error(e)
    //     toast.error(
    //       <DescriptionWithTx
    //         title={e.name || 'error'}
    //         description={e.shortMessage || 'Something went wrong'}
    //       />,
    //     );
    //   } finally {
    //     setTxWithdraw(Tx.Idle);
    //   }

    // }

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
                        disabled={
                            isSubmitting || isSaleActive || isPending || isProcessing || hasStarted
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

            {
                <Box sx={{ width: '100%' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        disabled={isSaleCanceled || isPendingCancel || isProcessingCancel}
                        onClick={cancelSale}
                        // sx={{ width: { xs: '100%' } }}
                    >
                        {/* {isIdleCancel && !isSaleCanceled && 'Cancel Sale'} */}
                        {isSaleCanceled ? 'Sale Cancelled' : isIdleCancel ? 'Cancel Sale' : null}
                        {isPendingCancel && <ButtonLoader text="Pending..." />}
                        {isProcessingCancel && <ButtonLoader text="Processing..." />}
                    </Button>
                </Box>
            }

            {/* {
        hasContractZeroBalance ? null : (
          <Box sx={{ width: '100%' }}>
            <Button
              variant="contained"
              size="small"
              fullWidth
              disabled={hasContractZeroBalance || isPendingWithdraw || isProcessingWithdraw}
            // onClick={withdrawTokens}
            // sx={{ width: { xs: '100%' } }}
            >
              {isIdleWithdraw && `Withdraw (${contractTokenBalance?.formatted}  ${contractTokenBalance?.symbol})`}
              {isPendingWithdraw && <ButtonLoader text="Pending..." />}
              {isProcessingWithdraw && <ButtonLoader text="Processing..." />}
            </Button>
            <Typography fontSize="12px" color="red">Withdraw Methods not exits i contract</Typography>
          </Box>)
      } */}
        </>
    );
};

export default SubscriptionPreSaleTime;
