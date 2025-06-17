import MainModal from '@/components/Modals';
import React, { useEffect, useMemo } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Stepper,
    Step,
    StepLabel,
    StepContent,
} from '@mui/material';
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
// import { whitelistModalPlaceholder } from '../constants';
// import { whitelistValidation } from '../validation';
import { Address } from 'viem';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import { DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import {
    useContractRead,
    useContractReads,
    useContractWrite,
    usePrepareContractWrite,
} from 'wagmi';
import { LaunchpadSaleStatus, ModalProps, Tx } from '../types';
import useSubscriptionDetails from '../hooks/subscriptionHoosk/useSubscriptionDetails';
import { useSingleCallResult, useSingleContractMultipleData } from '@/state/multicall/hooks';
import toast from 'react-hot-toast/headless';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import useSubscriptionPoolDistribution from '../hooks/subscriptionHoosk/useSubscriptionPoolDistribution';
import chunk from 'lodash/chunk';
import useDistributionSurplusData from '../hooks/subscriptionHoosk/useDistributionSulplusData';
import { useSubscriptionContract } from '@/hooks/useContract';

export interface FormInput {
    startTime: string;
}

interface CallDataResult {
    totalSurplusFunds: bigint;
    surplusTokens: bigint;
    leftInvestors: Address[];
    amounts: bigint[];
}

const SubscriptionCalculationModal = (props: ModalProps) => {
    const { handleClose, open, contractAddress } = props;
    const [tx, setTx] = React.useState<Tx>(Tx.Idle);
    const [txFinalize, setTxFinalize] = React.useState<Tx>(Tx.Idle);
    const [callResultData, setCallResultData] = React.useState<CallDataResult>();
    const [chunkIndex, setChunkIndex] = React.useState(0);
    const [activeStep, setActiveStep] = React.useState<number>();

    const subsPoolContract = useSubscriptionContract(contractAddress);
    const { chainId } = useActiveChainId();

    const isIdle = tx === Tx.Idle;
    const isPending = tx === Tx.Pending;
    const isProcessing = tx === Tx.Processing;
    // Finalize Sale
    const isIdleFinalize = txFinalize === Tx.Idle;
    const isPendingFinalize = txFinalize === Tx.Pending;
    const isProcessingFinalize = txFinalize === Tx.Processing;

    const {
        hasEnded,
        launchpadContract,
        totalRaised,
        allInvestors,
        canCalculate,
        canFinalize,
        totalContribution,
        totalContributionNum,
        softCapNum,
        currentLaunchpadStatus,
    } = useSubscriptionDetails(contractAddress);

    const isSaleClosed = currentLaunchpadStatus === LaunchpadSaleStatus.CLOSED;
    const softCapNotReached = totalContributionNum < softCapNum;

    React.useEffect(() => {
        if (canCalculate) {
            setActiveStep(1);
        }
        if (canFinalize) {
            setActiveStep(2);
        }
        if (!canFinalize && !canCalculate) {
            setActiveStep(0);
        }
    }, [canCalculate, canFinalize, open]);

    // const [totalAllocated, surplusTokens, totalSurplusFunds, leftInvestors, amounts] =
    //     useDistributionSurplusData(contractAddress);
    // const step2Args = useDistributionSurplusData(contractAddress);

    const {
        result: surplusData,
        loading,
        error,
    } = useSingleCallResult({
        contract: launchpadContract,
        functionName: 'getSurplusData',
    });

    const { amounts, leftInvestors, totalAllocated, totalSurplusFunds, surplusTokens } =
        surplusData ?? {};

    const handleUpdateCalculation = async () => {
        setTx(Tx.Pending);
        if (allInvestors) {
            try {
                const estimatedGas = await subsPoolContract.estimateGas.updateCalculation(
                    [allInvestors],
                    {},
                );

                const hash = await subsPoolContract.write.updateCalculation([allInvestors], {
                    gas: estimatedGas || DefaultGasLimit,
                });
                setTx(Tx.Processing);
                await waitForTransaction({ hash, chainId });
                setActiveStep(1);
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
        } else {
            console.error('Investors Not Found');
        }
    };

    const handleCalculate = async () => {
        setTx(Tx.Pending);
        try {
            const {
                estimateGas: { calculateShare: calculateShareGas },
                write: { calculateShare },
            } = launchpadContract;

            const estimatedGas = await calculateShareGas(
                [surplusTokens, totalSurplusFunds, leftInvestors, amounts],
                {},
            );
            const hash = await calculateShare(
                [surplusTokens, totalSurplusFunds, leftInvestors, amounts],
                {
                    gas: estimatedGas || DefaultGasLimit,
                },
            );
            setTx(Tx.Processing);
            await waitForTransaction({ hash, chainId });
            setActiveStep(2);
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

    const handleFinalizeSale = async () => {
        setTxFinalize(Tx.Pending);
        try {
            const estimatedGas = await launchpadContract.estimateGas.finalize({});
            const hash = await launchpadContract.write.finalize({
                gas: estimatedGas || DefaultGasLimit,
            });
            setTxFinalize(Tx.Processing);
            await waitForTransaction({ hash, chainId });
            setActiveStep(3);
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name || 'error'}
                    description={e.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTxFinalize(Tx.Idle);
        }
    };

    const steps = [
        {
            label: 'Calculation status',
            description: ``,
            action: (index: number) => {
                return (
                    <div>
                        <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            disabled={!isIdle || canCalculate}
                            onClick={handleUpdateCalculation}
                            sx={{ mt: 1, mr: 1 }}
                        >
                            {isIdle && `Update Calculation`}
                            {isPending && <ButtonLoader text="Pending" />}
                            {isProcessing && <ButtonLoader text="Processing" />}
                        </Button>
                    </div>
                );
            },
        },
        {
            label: 'Calculation',
            description:
                'Click the button below to start calculating tokens for users. You may need to Calculate many times.',
            action: (index: number) => {
                return (
                    <>
                        <Button
                            size="small"
                            variant="contained"
                            fullWidth
                            disabled={!isIdle || canFinalize}
                            onClick={handleCalculate}
                        >
                            {isIdle && `Update Calculation`}
                            {isPending && <ButtonLoader text="Pending" />}
                            {isProcessing && <ButtonLoader text="Processing" />}
                        </Button>
                    </>
                );
            },
        },
        {
            label: 'Finalize',
            description: `Waiting for approve from Gemlaunch...`,
            action: (index: number) => {
                return (
                    <>
                        <Button
                            size="small"
                            variant="contained"
                            fullWidth
                            disabled={!isIdleFinalize || (softCapNotReached && hasEnded)}
                            onClick={handleFinalizeSale}
                        >
                            {isIdleFinalize && 'Finalize'}
                            {isPendingFinalize && <ButtonLoader text="Pending" />}
                            {isProcessingFinalize && <ButtonLoader text="Processing" />}
                        </Button>
                    </>
                );
            },
        },
    ];

    return (
        <MainModal title="Finalize" openModal={open} onClose={handleClose}>
            <Box sx={{ maxWidth: 400 }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                                // optional={
                                //   index === 2 ? (
                                //     <Typography variant="caption" fontSize='14px'>Last step</Typography>
                                //   ) : null
                                // }

                                sx={{
                                    color: activeStep === index ? '#22CDA6' : '#ffff',
                                    fontSize: '14px',
                                }}
                            >
                                {step.label}
                            </StepLabel>
                            <StepContent>
                                <Typography fontSize="12px">{step.description}</Typography>
                                {step.action(index)}
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {/* {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )} */}
            </Box>
        </MainModal>
    );
};

export default SubscriptionCalculationModal;
