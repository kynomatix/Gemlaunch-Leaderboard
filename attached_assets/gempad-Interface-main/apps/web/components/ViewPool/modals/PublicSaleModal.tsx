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
import { useLaunchpadContract, usePrivateSaleContract } from '@/hooks/useContract';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import { DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { useNetwork } from 'wagmi';
import toast from 'react-hot-toast';
import { ModalProps, Tx } from '../types';
import { whitelistModalPlaceholder } from '../constant';
import { PUBLICSALE_VALIDATION, WHITELIST_VALIDATION } from '../formValidation';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import useGetLaunchpadContractByName from '../hooks/useGetLaunchpadContractByName';
import { useActiveChainId } from '@/hooks/useActiveChainId';

export interface FormInput {
    startTime: string;
}

interface PublicModalProps extends ModalProps {
    contract: any;
}

const PublicSaleModal = (props: PublicModalProps) => {
    const { handleClose, open, contract } = props;
    const [tx, setTx] = React.useState<Tx>(Tx.Idle);
    // const contract = useLaunchpadContract(contractAddress as Address);
    // const contract = useGetLaunchpadContractByName(launchpadName, contractAddress)

    const { chainId } = useActiveChainId();

    const isIdle = tx === Tx.Idle;
    const isPending = tx === Tx.Pending;
    const isProcessing = tx === Tx.Processing;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormInput>({
        mode: 'onChange',
        defaultValues: {
            startTime: undefined,
        },
        resolver: yupResolver(PUBLICSALE_VALIDATION) as any,
    });

    const startSale = async (startTime: number) => {
        const {
            estimateGas: { enablePublicSale: enablePublicSaleGas },
            write: { enablePublicSale },
        } = contract;

        const estimatedGas = await enablePublicSaleGas([BigInt(startTime)], {} as never);
        const hash = await enablePublicSale([BigInt(startTime)], {
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
    };

    const onSubmit: SubmitHandler<FormInput> = async (data: FormInput) => {
        try {
            setTx(Tx.Pending);
            const { startTime } = data;

            const startTimeUnix = moment(startTime).unix();

            await startSale(startTimeUnix);

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
        <MainModal title="Start Public Sale" openModal={open} onClose={handleClose}>
            <Typography variant="h5" fontSize={14} color="common.white">
                Time to Start
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
                />
                <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={3}>
                    <Button
                        variant="contained"
                        size="small"
                        type="submit"
                        disabled={isSubmitting}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                        {isIdle && 'Start Sale'}
                        {isPending && <ButtonLoader text="Pending" />}
                        {isProcessing && <ButtonLoader text="Processing" />}
                    </Button>
                </Box>
            </form>
        </MainModal>
    );
};

export default PublicSaleModal;
