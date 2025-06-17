import React, { useContext } from 'react';
import MainModal, { IModalState } from '.';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { Address, useContractWrite, useNetwork } from 'wagmi';
import { DefaultGasLimit, LOCKER_CONTRACT_ADDRESSES } from '@/constants';
import { LockerABI } from '@/config/abi/locker';
import { useLockerContract } from '@/hooks/useContract';
import { waitForTransaction } from 'wagmi/actions';
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

const RenounceLockOwnershipModal = ({ modalState, lockId, refetch }: Props) => {
    const { open, setOpen } = modalState;
    const [transaction, setTransaction] = React.useState(Transaction.IDLE);
    const { addTransaction } = useContext(TransactionTrackingContext);
    const { chain } = useNetwork();

    const handleClose = () => {
        setOpen(false);
    };

    const lockerContract = useLockerContract(LOCKER_CONTRACT_ADDRESSES[chain?.id] as Address);

    const handleRenounceOwnerShip = async () => {
        try {
            setTransaction(Transaction.WAITING);
            const gasEstimate = await lockerContract.estimateGas.renounceLockOwnership(
                [lockId],
                {} as never,
            );
            const hash = await lockerContract.write.renounceLockOwnership([lockId], {
                gas: gasEstimate || DefaultGasLimit,
            });

            setTransaction(Transaction.PROCESSING);
            await waitForTransaction({ hash, chainId: chain?.id });
            addTransaction({ type: 'lock-transferred', hash });
            refetch();
            handleClose();
        } catch (error) {
            console.error(error);
        } finally {
            setTransaction(Transaction.IDLE);
        }
    };

    return (
        <MainModal title="Renouce Lock Ownership" openModal={open} onClose={handleClose}>
            <Typography color="common.white" variant="body1" fontSize={14}>
                Do you really want to renounce the ownership of this lock? This action can&apos;t be
                reverted.
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '15px',
                    mt: 3,
                }}
            >
                <Button onClick={handleClose} variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={handleRenounceOwnerShip}
                    disabled={transaction !== Transaction.IDLE}
                    variant="contained"
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
            </Box>
        </MainModal>
    );
};

export default RenounceLockOwnershipModal;
