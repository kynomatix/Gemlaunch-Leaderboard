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
import {
    AFFILIATION_VALIDATION,
    PUBLICSALE_VALIDATION,
    WHITELIST_VALIDATION,
} from '../formValidation';
import { DateTimePicker } from '@mui/x-date-pickers';
import { disableScroll } from '@/utils/disableScroll';
import useGetLaunchpadContractByName from '../hooks/useGetLaunchpadContractByName';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { useSingleCallResult } from '@/state/multicall/hooks';

export interface FormInput {
    amount: number;
}

interface AffiliationModalProps extends ModalProps {
    contract: any;
}

const AffiliationModal = (props: AffiliationModalProps) => {
    const { handleClose, open, contract } = props;
    const [tx, setTx] = React.useState<Tx>(Tx.Idle);

    const { chainId } = useActiveChainId();

    // Modal is reusing for fairlaunch and simeple launchpad that is why contract is sent from props
    const { result, loading } = useSingleCallResult({
        contract,
        functionName: 'affiliateReward',
    });

    const affililiateReward = !loading && Number(result) / 1e3;

    const isIdle = tx === Tx.Idle;
    const isPending = tx === Tx.Pending;
    const isProcessing = tx === Tx.Processing;

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormInput>({
        mode: 'onChange',
        resolver: yupResolver(AFFILIATION_VALIDATION) as any,
        defaultValues: {
            amount: undefined,
        },
    });

    React.useEffect(() => {
        setValue('amount', affililiateReward);
    }, [affililiateReward, result, setValue]);

    const setAffiliation = async (amount: string) => {
        const {
            estimateGas: { setAffiliation: setAffiliationGas },
            write: { setAffiliation },
        } = contract;

        const estimatedGas = await setAffiliationGas([BigInt(amount)], {} as never);
        const hash = await setAffiliation([BigInt(amount)], {
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
            const { amount } = data;
            setTx(Tx.Pending);

            const inputAmount = String(Number(amount) * 1e3);

            await setAffiliation(inputAmount);

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
        <MainModal title={'Set Affiliation'} openModal={open} onClose={handleClose}>
            <Typography variant="h5" fontSize={14} color="common.white">
                Affiliation Amount in Percentage
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} style={{ margin: '10px 0' }}>
                <Controller
                    name="amount"
                    control={control}
                    render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
                        <TextField
                            type="number"
                            onWheel={disableScroll}
                            value={field.value || ''}
                            error={!!errors?.amount}
                            helperText={
                                <Typography fontSize="14px" fontWeight={500}>
                                    {errors?.amount?.message}
                                </Typography>
                            }
                            {...field}
                            fullWidth
                            placeholder=" EX:25 in %"
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
                        {isIdle && 'Set Affiliation'}
                        {isPending && <ButtonLoader text="Pending" />}
                        {isProcessing && <ButtonLoader text="Processing" />}
                    </Button>
                </Box>
            </form>
        </MainModal>
    );
};

export default AffiliationModal;
