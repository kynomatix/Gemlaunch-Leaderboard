import { LaunchpadFormInput, LaunchpadTransaction } from '@/components/LaunchpadForm/types';
import { Box, Button, CircularProgress } from '@mui/material';
import React from 'react';
import { SubmitHandler } from 'react-hook-form';
import WalletConnectButton from '../WalletConnectButton/WalletConnectButton';
import { useAccount } from 'wagmi';
import { ApprovalState } from '@/hooks/useApproveCallback';
import ButtonLoader from '../ButtonLoader/ButtonLoader';

interface Steps {
    label: string;
    desc: string;
}

interface StepperButton {
    isSubmitting: boolean;
    transaction: LaunchpadTransaction;
    activeStep: number;
    steps: Steps[];
    handleBack: () => void;
    handleNext: (e: any) => void;
    onSubmit: SubmitHandler<LaunchpadFormInput>;
    handleApprove: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    approvalState: ApprovalState;
}

const StepperButton = ({
    transaction,
    isSubmitting,
    activeStep,
    handleBack,
    handleNext,
    onSubmit,
    steps,
    handleApprove,
    approvalState,
}: StepperButton) => {
    const { address } = useAccount();
    return (
        <>
            {address ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        alignItems: 'center',
                        pt: 2,
                        flexWrap: 'wrap',
                    }}
                >
                    {activeStep !== 0 && (
                        <Button
                            size="large"
                            variant="outlined"
                            onClick={handleBack}
                            sx={{ mr: 1, width: { xs: '100%', sm: 'auto' } }}
                        >
                            Back
                        </Button>
                    )}
                    {activeStep === steps.length - 1 ? (
                        <>
                            {approvalState === ApprovalState.NOT_APPROVED ||
                            approvalState === ApprovalState.PENDING ? (
                                <Button
                                    variant="contained"
                                    size="large"
                                    disabled={
                                        transaction === LaunchpadTransaction.PROCESSING ||
                                        transaction === LaunchpadTransaction.PENDING
                                    }
                                    onClick={handleApprove}
                                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                                >
                                    {transaction === LaunchpadTransaction.IDLE && 'Approve'}

                                    {transaction === LaunchpadTransaction.PENDING && (
                                        <>
                                            <CircularProgress
                                                size={15}
                                                sx={{ mr: 1, color: '#9E9E9E' }}
                                            />{' '}
                                            Approving
                                        </>
                                    )}
                                    {transaction === LaunchpadTransaction.PROCESSING && (
                                        <>
                                            <CircularProgress
                                                size={15}
                                                sx={{ mr: 1, color: '#9E9E9E' }}
                                            />{' '}
                                            Processing Transaction
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    size="large"
                                    disabled={isSubmitting}
                                    variant="contained"
                                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                                >
                                    {transaction === LaunchpadTransaction.PENDING && (
                                        <ButtonLoader text="Submitting" />
                                    )}
                                    {transaction === LaunchpadTransaction.PROCESSING && (
                                        <ButtonLoader text="Processing" />
                                    )}
                                    {transaction === LaunchpadTransaction.IDLE && 'Submit'}
                                </Button>
                            )}
                        </>
                    ) : (
                        <Button
                            size="large"
                            variant="contained"
                            onClick={handleNext}
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            Next
                        </Button>
                    )}
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        pt: 2,
                    }}
                >
                    <WalletConnectButton />
                </Box>
            )}
        </>
    );
};

export default StepperButton;
