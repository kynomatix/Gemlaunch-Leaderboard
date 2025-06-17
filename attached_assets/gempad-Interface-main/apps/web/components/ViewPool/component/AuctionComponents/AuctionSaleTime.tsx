import { Button, Box } from '@mui/material';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { waitForTransaction } from 'wagmi/actions';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { Address } from 'viem';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import toast from 'react-hot-toast';
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
import { useBalance, useContractReads } from 'wagmi';
import useAuctionDetails from '../../hooks/auctionHooks/useAuctionDetails';
import ClaimTimeModal from '../../modals/ClaimTImeModal';
import { LaunchpadSaleMode, LaunchpadSaleStatus, Tx } from '../../types';

interface FormInput {
    startTime: string;
    endTime: string;
}
interface EndTimeFormInput {
    updateEndTime: string;
}

const AuctionSaleTime = ({
    launchpadAddress,
    launchpadName,
    saleStatusResult,
    saleCurrentMode,
}: {
    launchpadAddress: Address;
    launchpadName: string;
    saleStatusResult: number;
    saleCurrentMode: number;
}) => {
    const {
        token,
        softCapNum,
        hasEnded,
        totalRaisedNum,
        endTimeMoment,
        currentTime: currentTimeMoment,
        launchpadContract,
    } = useAuctionDetails(launchpadAddress);

    const { data } = useContractReads({
        contracts: [
            { ...launchpadContract, functionName: 'currentStatus' },
            { ...launchpadContract, functionName: 'getCurrentMode' },
        ],
    });

    // const saleStatusResult = data?.[0]?.result as unknown as number ?? 0
    // const saleCurrentMode = data?.[1]?.result as unknown as number ?? 0

    const { chainId } = useActiveChainId();
    const { data: contractTokenBalance } = useBalance({
        address: launchpadAddress as Address,
        token,
    });

    const [tx, setTx] = React.useState<Tx>(Tx.Idle);
    const [txCancel, setTxCancel] = React.useState<Tx>(Tx.Idle);
    const [txFinalize, setTxFinalize] = React.useState<Tx>(Tx.Idle);
    const [txWithdraw, setTxWithdraw] = React.useState<Tx>(Tx.Idle);

    const canFinalizeSale = useMemo(() => {
        const hasReachedSoftCap = totalRaisedNum >= softCapNum;
        const canFinalized = hasEnded && hasReachedSoftCap;
        return canFinalized;
    }, [hasEnded, softCapNum, totalRaisedNum]);

    const hasContractZeroBalance = Number(contractTokenBalance?.value) === 0;

    const isSaleActive = saleStatusResult === LaunchpadSaleStatus.ACTIVE;
    const isSaleCanceled = saleStatusResult === LaunchpadSaleStatus.CANCELLED;
    const isSaleClosed = saleStatusResult === LaunchpadSaleStatus.CLOSED;

    const isPublicSale = saleCurrentMode === LaunchpadSaleMode.PUBLIC;
    const isPrivateSale = saleCurrentMode === LaunchpadSaleMode.PRIVATE;
    const isSalePending = saleCurrentMode === LaunchpadSaleMode.PENDING;

    const isIdle = tx === Tx.Idle;
    const isPending = tx === Tx.Pending;
    const isProcessing = tx === Tx.Processing;

    // Cancel status of cancelSale
    const isIdleCancel = txCancel === Tx.Idle;
    const isPendingCancel = txCancel === Tx.Pending;
    const isProcessingCancel = txCancel === Tx.Processing;

    // Finalize Sale
    const isIdleFinalize = txFinalize === Tx.Idle;
    const isPendingFinalize = txFinalize === Tx.Pending;
    const isProcessingFinalize = txFinalize === Tx.Processing;

    // Withdraw
    const isIdleWithdraw = txWithdraw === Tx.Idle;
    const isPendingWithdraw = txWithdraw === Tx.Pending;
    const isProcessingWithdraw = txWithdraw === Tx.Processing;

    const cancelSale = async () => {
        try {
            setTxCancel(Tx.Pending);
            const hash = await launchpadContract.write.cancel({});
            setTxCancel(Tx.Processing);
            await waitForTransaction({ hash, chainId });
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name || 'error'}
                    description={e.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTxCancel(Tx.Idle);
        }
    };

    const finalizedSale = async () => {
        if (!canFinalizeSale) {
            toast.error(
                <DescriptionWithTx
                    title={'Sale Error'}
                    description={'Sale End Time or SoftCap not reached'}
                />,
            );
            return;
        }

        try {
            setTxFinalize(Tx.Pending);
            const hash = await launchpadContract.write.finalize({});
            setTxFinalize(Tx.Processing);
            await waitForTransaction({ hash, chainId });
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

    const withdrawTokens = async () => {
        try {
            setTxWithdraw(Tx.Pending);
            const hash = await launchpadContract.write.withdrawTokens({});
            setTxWithdraw(Tx.Processing);
            await waitForTransaction({ hash, chainId });
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name || 'error'}
                    description={e.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTxWithdraw(Tx.Idle);
        }
    };

    return (
        <>
            {
                <Box sx={{ width: '100%' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        disabled={isSaleCanceled || isPendingCancel || isProcessingCancel}
                        onClick={cancelSale}
                        // sx={{ width: { xs: '100%' } }}
                    >
                        {isIdleCancel && !isSaleCanceled && 'Cancel Sale'}
                        {isSaleCanceled && 'Sale Cancelled'}
                        {isPendingCancel && <ButtonLoader text="Pending..." />}
                        {isProcessingCancel && <ButtonLoader text="Processing..." />}
                    </Button>
                </Box>
            }

            {!isSaleClosed && (
                <Box sx={{ width: '100%' }}>
                    <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        disabled={isSaleClosed || isPendingFinalize || isProcessingFinalize}
                        onClick={finalizedSale}
                        // sx={{ width: { xs: '100%' } }}
                    >
                        {isIdleFinalize && 'Finalize'}
                        {isPendingFinalize && <ButtonLoader text="Pending..." />}
                        {isProcessingFinalize && <ButtonLoader text="Processing..." />}
                    </Button>
                </Box>
            )}

            {hasContractZeroBalance || !isSaleCanceled ? null : (
                <Box sx={{ width: '100%' }}>
                    <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        disabled={
                            hasContractZeroBalance || isPendingWithdraw || isProcessingWithdraw
                        }
                        onClick={withdrawTokens}
                        // sx={{ width: { xs: '100%' } }}
                    >
                        {isIdleWithdraw &&
                            `Withdraw (${contractTokenBalance?.formatted}  ${contractTokenBalance?.symbol})`}
                        {isPendingWithdraw && <ButtonLoader text="Pending..." />}
                        {isProcessingWithdraw && <ButtonLoader text="Processing..." />}
                    </Button>
                </Box>
            )}
        </>
    );
};

export default AuctionSaleTime;
