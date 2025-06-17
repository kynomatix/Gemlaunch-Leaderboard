import MainModal from '@/components/Modals';
import React from 'react';
import { Tx, WhitelistModalProps, WhitelistUsersFormInput } from '../types';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
import TextFieldError from '@/components/TextField/TextFieldError';
import { whitelistModalPlaceholder } from '../constants';
import { whitelistValidation } from '../validation';
import { Address } from 'viem';
import { usePrivateSaleContract } from '@/hooks/useContract';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import { DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { useNetwork } from 'wagmi';
import toast from 'react-hot-toast';
import { TransactionTrackingContext } from '@/components/Provider/TransactionTrackingProvider';
import { useActiveChainId } from '@/hooks/useActiveChainId';

const WhitelistModal = (props: WhitelistModalProps) => {
    const { handleClose, open, label, contractAddress } = props;

    const [tx, setTx] = React.useState<Tx>(Tx.Idle);
    const [isDuplicateAddresses, setIsDuplicateAddresses] = React.useState<boolean>(false);
    const contract = usePrivateSaleContract(contractAddress as Address);

    const { addTransaction } = React.useContext(TransactionTrackingContext);

    const { chainId } = useActiveChainId();

    const isIdle = tx === Tx.Idle;
    const isPending = tx === Tx.Pending;
    const isProcessing = tx === Tx.Processing;

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<WhitelistUsersFormInput>({
        mode: 'onChange',
        resolver: yupResolver(whitelistValidation) as any,
        defaultValues: {
            users: undefined,
        },
    });

    const users = watch('users');

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
                description="Users added to whitelist"
                txChainId={chainId}
                txHash={hash}
            />,
        );

        addTransaction({ type: 'private-sale-whitelist-added', hash });
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
                description="User removed from whitelists"
                txChainId={chainId}
                txHash={hash}
            />,
        );
        addTransaction({ type: 'private-sale-whitelist-removed', hash });
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

    const handleRemoveDuplicates = (val: string) => {
        const users = val.trim().split('\n');

        // takes out only the first occurrence of users if duplicate
        const uiquerUsers = users
            .filter((x, i, s) => s.indexOf(x) === i)
            .map((x) => `${x}`)
            .join('\n');

        setValue('users', uiquerUsers, { shouldValidate: true });
    };

    React.useEffect(() => {
        if (!users) return;

        const lines = users.trim().split('\n');
        const addresses = new Set<string>();

        let isDuplicateAddresses = false;

        for (const addr of lines) {
            if (addresses.has(addr)) {
                isDuplicateAddresses = true;
                break;
            }
            addresses.add(addr);
        }
        setIsDuplicateAddresses(isDuplicateAddresses);
    }, [users]);

    return (
        <MainModal title={`${label} Whitelist`} openModal={open} onClose={handleClose}>
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
                            placeholder={whitelistModalPlaceholder}
                            margin="normal"
                            error={!!errors?.users}
                            helperText={<TextFieldError fieldName={errors?.users} />}
                            InputProps={{
                                style: { fontSize: '12px' }, // Adjust the font size as needed
                            }}
                        />
                    )}
                />

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr' },
                        gap: 1,
                    }}
                >
                    <Button variant="contained" size="small" type="submit" disabled={isSubmitting}>
                        {isIdle && `${label} Users`}
                        {isPending && <ButtonLoader text="Pending" />}
                        {isProcessing && <ButtonLoader text="Processing" />}
                    </Button>
                </Box>
                {isDuplicateAddresses && (
                    <Button
                        variant="contained"
                        size="small"
                        disabled={isSubmitting}
                        sx={{ mt: 1, width: '100%' }}
                        onClick={() => handleRemoveDuplicates(users)}
                    >
                        {isIdle && `Remove Duplicates`}
                    </Button>
                )}
            </form>
        </MainModal>
    );
};

export default WhitelistModal;
