import { Transaction } from '@/app/(application)/create-lock/types';
import { Button } from '@mui/material';
import React from 'react';
import ButtonLoader from '../ButtonLoader/ButtonLoader';

interface ApprovalButtonProps {
    transaction: Transaction;
    handleApprove: (e: any) => Promise<void>;
    tokenBalance: number;
    amount: number;
    isTokenDetailsAvailable?: boolean;
}

const ApprovalButton = ({
    handleApprove,
    transaction,
    tokenBalance,
    amount,
    isTokenDetailsAvailable,
}: ApprovalButtonProps) => {
    return (
        <Button
            disabled={
                transaction !== Transaction.IDLE ||
                tokenBalance < amount ||
                !isTokenDetailsAvailable ||
                amount <= 0
            }
            onClick={handleApprove}
            variant="contained"
            size="large"
            sx={{ width: { xs: '100%', md: 'auto' } }}
        >
            {transaction === Transaction.IDLE && 'Approve'}
            {transaction === Transaction.WAITING && <ButtonLoader text="Pending" />}
            {transaction === Transaction.PROCESSING && <ButtonLoader text="Processing" />}
        </Button>
    );
};

export default ApprovalButton;
