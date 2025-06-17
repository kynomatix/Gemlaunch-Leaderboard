import MainModal from '@/components/Modals';
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
import TextFieldError from '@/components/TextField/TextFieldError';
// import { whitelistModalPlaceholder } from '../constants';
// import { whitelistValidation } from '../validation';
import { Address } from 'viem';
import { Addresses } from '@/utils/addressHelpers';
import { useLaunchpadContract } from '@/hooks/useContract';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import { DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { useNetwork } from 'wagmi';
import toast from 'react-hot-toast';
import { ModalProps, Tx } from '../types';
import { whitelistModalPlaceholder } from '../constant';
import { CLAIMTIME_VALIDATION } from '../formValidation';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import useLaunchpadLiquidityDetails from '../hooks/useLaunhpadLiquidityDetails';

export interface FormInput {
    startTime: string;
}

const ClaimTimeModal = (props: ModalProps) => {
    const { handleClose, open, contractAddress } = props;
    const [tx, setTx] = React.useState<Tx>(Tx.Idle);
    const contract = useLaunchpadContract(contractAddress as Address);

    const { chain } = useNetwork();
    const chainId = chain?.id;

    const isIdle = tx === Tx.Idle;
    const isPending = tx === Tx.Pending;
    const isProcessing = tx === Tx.Processing;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormInput>({
        mode: 'onChange',
        resolver: yupResolver(CLAIMTIME_VALIDATION) as any,
        defaultValues: {
            startTime: undefined,
        },
    });

    const startClaimTime = async (startTime: bigint) => {
        const {
            estimateGas: { setClaimTime: setClaimTimeGas },
            write: { setClaimTime },
        } = contract;

        const estimatedGas = await setClaimTimeGas([startTime], {} as never);
        const hash = await setClaimTime([startTime], { gas: estimatedGas || DefaultGasLimit });

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
    };

    const onSubmit: SubmitHandler<FormInput> = async (data: FormInput) => {
        try {
            const { startTime } = data;
            setTx(Tx.Pending);
            const startTimeUnix = dayjs(startTime).unix() as unknown as bigint;

            await startClaimTime(startTimeUnix);

            handleClose();
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
    return (
        <MainModal title={'Start Claim Time'} openModal={open} onClose={handleClose}>
            <Typography variant="h5" fontSize={14} color="common.white">
                Claim Time to Start
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} style={{ margin: '10px 0' }}>
                <Controller
                    name="startTime"
                    control={control}
                    render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
                        <DateTimePicker
                            {...field}
                            sx={{ width: '100%' }}
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
                    )}
                />{' '}
                <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={3}>
                    <Button
                        variant="contained"
                        size="small"
                        type="submit"
                        disabled={isSubmitting}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                        {isIdle && 'Start'}
                        {isPending && <ButtonLoader text="Pending" />}
                        {isProcessing && <ButtonLoader text="Processing" />}
                    </Button>
                </Box>
            </form>
        </MainModal>
    );
};

export default ClaimTimeModal;
