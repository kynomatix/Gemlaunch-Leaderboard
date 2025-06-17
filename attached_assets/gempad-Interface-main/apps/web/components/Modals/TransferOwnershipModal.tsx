import React, { useContext } from 'react';
import MainModal, { IModalState } from '.';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Address, useAccount, useContractWrite, useNetwork } from 'wagmi';
import { DefaultGasLimit, LOCKER_CONTRACT_ADDRESSES } from '@/constants';
import { LockerABI } from '@/config/abi/locker';
import { useLockerContract } from '@/hooks/useContract';
import { waitForTransaction } from 'wagmi/actions';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { isValidAddress } from '@/utils/format';
import { isValidToken } from '@/utils/isValidToken';
import { yupResolver } from '@hookform/resolvers/yup';
import { TransactionTrackingContext } from '../Provider/TransactionTrackingProvider';

interface Props {
    modalState: IModalState;
    lockId: bigint;
    refetch: any;
}

enum Transaction {
    IDLE = 'Idle',
    WAITING = 'Waiting For Confirmation...',
    PROCESSING = 'Processing Transaction...',
}

interface IFormInput {
    newOwnerAddress: string;
}

const validationSchema = yup.object().shape({
    newOwnerAddress: yup
        .string()
        .label('Address')
        .required()
        .test(
            'is-address',
            (x) => `${x.label} is not in valid format`,
            (v) => {
                if (v.trim() !== '') {
                    return isValidAddress(v.toLowerCase());
                }
                return true;
            },
        ),
});

const TransferOwnershipModal = ({ modalState, lockId, refetch }: Props) => {
    const { open, setOpen } = modalState;
    const [transaction, setTransaction] = React.useState(Transaction.IDLE);
    const { addTransaction } = useContext(TransactionTrackingContext);
    const { chain } = useNetwork();
    const { address } = useAccount();

    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<IFormInput>({
        mode: 'onChange',
        defaultValues: {
            newOwnerAddress: address,
        },
        resolver: yupResolver(validationSchema) as any,
    });

    const handleClose = () => {
        setOpen(false);
    };

    const lockerContract = useLockerContract(LOCKER_CONTRACT_ADDRESSES[chain?.id] as Address);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            setTransaction(Transaction.WAITING);
            const { newOwnerAddress } = data;
            const gasEstimate = await lockerContract.estimateGas.transferLockOwnership(
                [lockId, newOwnerAddress as Address],
                {} as never,
            );
            const hash = await lockerContract.write.transferLockOwnership(
                [lockId, newOwnerAddress as Address],
                {
                    gas: gasEstimate || DefaultGasLimit,
                },
            );

            setTransaction(Transaction.PROCESSING);
            await waitForTransaction({ hash, chainId: chain?.id });
            addTransaction({ type: 'lock-transferred', hash });
            refetch();
            handleClose();
        } catch (error) {
            console.log(error);
        } finally {
            setTransaction(Transaction.IDLE);
        }
    };

    return (
        <MainModal title="Transfer Lock Ownership" openModal={open} onClose={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Typography color="common.white" variant="h5" sx={{ mb: '9px' }} ml={2}>
                    New Owner Address <span style={{ color: '#FF8484' }}>*</span>
                </Typography>
                <Controller
                    name="newOwnerAddress"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="text"
                            placeholder={address}
                            value={field.value}
                            fullWidth
                            error={!!errors?.newOwnerAddress}
                            helperText={
                                <Typography variant="body2">
                                    {errors?.newOwnerAddress?.message}
                                </Typography>
                            }
                        />
                    )}
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    sx={{ width: '100%', mt: 2 }}
                >
                    {transaction === Transaction.IDLE && 'Ok'}
                    {transaction === Transaction.WAITING && (
                        <>
                            <CircularProgress size={15} sx={{ mr: 1, color: '#9E9E9E' }} />{' '}
                            Waiting...
                        </>
                    )}
                    {transaction === Transaction.PROCESSING && (
                        <>
                            <CircularProgress size={15} sx={{ mr: 1, color: '#9E9E9E' }} />
                            Processing...
                        </>
                    )}
                </Button>
            </form>
        </MainModal>
    );
};

export default TransferOwnershipModal;
