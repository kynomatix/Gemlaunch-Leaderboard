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
import { WHITELIST_VALIDATION } from '../formValidation';
import useGetLaunchpadContractByName from '../hooks/useGetLaunchpadContractByName';

export interface WhitelistUsersFormInput {
    users: string;
}

interface WhiteListModalProps extends ModalProps {
    contract: any;
}

const WhitelistModal = (props: WhiteListModalProps) => {
    const { handleClose, open, contract } = props;
    const [label, setLabel] = useState('Add');

    const [tx, setTx] = React.useState<Tx>(Tx.Idle);

    const { chain } = useNetwork();
    const chainId = chain?.id;

    const isIdle = tx === Tx.Idle;
    const isPending = tx === Tx.Pending;
    const isProcessing = tx === Tx.Processing;

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<WhitelistUsersFormInput>({
        mode: 'onChange',
        resolver: yupResolver(WHITELIST_VALIDATION) as any,
        defaultValues: {
            users: undefined,
        },
    });

    const addToWhitelist = async (users: Address[]) => {
        const {
            estimateGas: { addWhitelist: addWhitelistGas },
            write: { addWhitelist },
        } = contract;

        const estimatedGas = await addWhitelistGas([users], {} as never);
        const hash = await addWhitelist([users], { gas: estimatedGas || DefaultGasLimit });

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

    const removeFromWhitelist = async (users: Address[]) => {
        const {
            estimateGas: { removeWhitelist: removeWhitelistGas },
            write: { removeWhitelist },
        } = contract;

        const estimatedGas = await removeWhitelistGas([users], {} as never);
        const hash = await removeWhitelist([users], { gas: estimatedGas || DefaultGasLimit });

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

    const onSubmit: SubmitHandler<WhitelistUsersFormInput> = async (
        data: WhitelistUsersFormInput,
    ) => {
        try {
            setTx(Tx.Pending);
            const { users } = data;
            const addresses = users.split('\n');

            if (label === 'Add') {
                await addToWhitelist(addresses as Address[]);
            }

            if (label === 'Remove') {
                await removeFromWhitelist(addresses as Address[]);
            }
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
        <MainModal title={`${label} Whitelist`} openModal={open} onClose={handleClose}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: { xs: 'start', md: 'center' },
                    gap: '10px',
                    flexDirection: { xs: 'column', md: 'row' },
                }}
            >
                <Button
                    variant={label === 'Add' ? 'contained' : 'outlined'}
                    sx={{
                        whiteSpace: 'noWrap',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        width: '100%',
                    }}
                    onClick={() => setLabel('Add')}
                >
                    Add to WhiteList
                </Button>
                <Button
                    variant={label === 'Remove' ? 'contained' : 'outlined'}
                    sx={{
                        whiteSpace: 'noWrap',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        width: '100%',
                    }}
                    onClick={() => setLabel('Remove')}
                >
                    Remove from WhiteList
                </Button>
            </Box>

            <Typography variant="h5" fontSize={14} color="common.white" mt={2}>
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
                            placeholder={whitelistModalPlaceholder}
                            margin="normal"
                            error={!!errors?.users}
                            helperText={<TextFieldError fieldName={errors?.users} />}
                            InputProps={{
                                style: { fontSize: '12px' }, // Adjust the font size as needed
                            }}
                            style={{ marginTop: '2px' }}
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
                        {isIdle && `${label} Users`}
                        {isPending && <ButtonLoader text="Pending" />}
                        {isProcessing && <ButtonLoader text="Processing" />}
                    </Button>
                </Box>
            </form>
        </MainModal>
    );
};

export default WhitelistModal;
