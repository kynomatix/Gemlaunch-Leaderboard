import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import Infobar from '../Infobar/Infobar';
import { useAirdropContract } from '@/hooks/useContract';
import { Address, formatUnits } from 'viem';
import { DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { useNetwork } from 'wagmi';
import ButtonLoader from '../ButtonLoader/ButtonLoader';
import MainModal from '../Modals';
import TextFieldHead from '../TextField/TextFieldHead';
import VestingModal from './modals/VestingModal';
import { OwnerZoneProps, OwnerZonePropsTitle, OwnerZonePropsTx } from './types';
import AirdropModal from './modals/AirdropModal';
import AllocationsModal from './modals/AllocationsModal';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { useTransactionAdder } from '@/state/transactions/hooks';
import { TransactionTrackingContext } from '../Provider/TransactionTrackingProvider';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import toast from 'react-hot-toast';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

const styles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
};

const OwnerZone = (props: OwnerZoneProps) => {
    const {
        contractAddress,
        tokenAddress,
        airdrop: {
            // totalTokens,
            token: { decimals, symbol },
            allocations,
        },
    } = props;
    const airdropContract = useAirdropContract(contractAddress);

    const [tx, setTx] = React.useState<OwnerZonePropsTx>(OwnerZonePropsTx.IDLE);
    const [openVestingModal, setOpenVestingModal] = React.useState<boolean>(false);
    const [openAirdropModal, setOpenAirdropModal] = React.useState<boolean>(false);
    const [openAllocationsModal, setOpenAllocationsModal] = React.useState<boolean>(false);

    const { chainId } = useActiveChainId();

    const { result } = useSingleCallResult({
        contract: airdropContract,
        functionName: 'getCurrentStatus',
    });

    const { result: totalTokens } = useSingleCallResult({
        contract: airdropContract,
        functionName: 'totalTokens',
    });

    const { addTransaction } = React.useContext(TransactionTrackingContext);

    const handleClose = () => {
        setOpenVestingModal(false);
        setOpenAirdropModal(false);
        setOpenAllocationsModal(false);
    };

    const handleDisableExactAmount = async () => {
        try {
            const estimatedGas = await airdropContract.estimateGas.disbableEnsureExactAmount(
                {} as never,
            );
            const hash = await airdropContract.write.disbableEnsureExactAmount({
                gas: estimatedGas || DefaultGasLimit,
            });
            setTx(OwnerZonePropsTx.PROCESSING);
            await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Exact amount disabled"
                    txHash={hash}
                    txChainId={chainId}
                />,
            );
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e?.name ?? 'Error'}
                    description={e?.shortMessage ?? 'Something went wrong'}
                />,
            );
        }
    };

    const handleRemoveAllocation = async () => {
        try {
            const estimatedGas = await airdropContract.estimateGas.removeAllocations({} as never);
            const hash = await airdropContract.write.removeAllocations({
                gas: estimatedGas || DefaultGasLimit,
            });
            setTx(OwnerZonePropsTx.PROCESSING);
            await waitForTransaction({ hash, chainId });
            addTransaction({ hash, type: 'participants-removed' });

            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Allocations removed"
                    txHash={hash}
                    txChainId={chainId}
                />,
            );
        } catch (e: any) {
            toast.error(
                <DescriptionWithTx
                    title={e?.name ?? 'Error'}
                    description={e?.shortMessage ?? 'Something went wrong'}
                />,
            );
        }
    };

    const handleCancelAirdrop = async () => {
        try {
            const estimatedGas = await airdropContract.estimateGas.cancelAirdrop({} as never);
            const hash = await airdropContract.write.cancelAirdrop({
                gas: estimatedGas || DefaultGasLimit,
            });
            setTx(OwnerZonePropsTx.PROCESSING);
            await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Airdrop Cancelled"
                    txHash={hash}
                    txChainId={chainId}
                />,
            );
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e?.name ?? 'Error'}
                    description={e?.shortMessage ?? 'Something went wrong'}
                />,
            );
        }
    };

    const handleSubmit = async (title: number) => {
        try {
            setTx(OwnerZonePropsTx.PENDING);

            if (title === OwnerZonePropsTitle.DISABLE_EXACT_AMOUNT) {
                await handleDisableExactAmount();
                return;
            }

            if (title === OwnerZonePropsTitle.REMOVE_ALLOCATION) {
                await handleRemoveAllocation();
                return;
            }

            if (title === OwnerZonePropsTitle.CANCEL_AIRDROP) {
                await handleCancelAirdrop();
                return;
            }
        } catch (e) {
            console.error(e);
        } finally {
            setTx(OwnerZonePropsTx.IDLE);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: '30px' }}>
            <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <Typography fontWeight={600} fontSize={'18px'} mt={3} mb={1}>
                    Owner Zone
                </Typography>

                <MdOutlineAdminPanelSettings size="24px" />
            </Box>
            <PrimaryCard py={25}>
                <Infobar
                    open={true}
                    message="Please don't start the airdrop before you finalize the presale pool."
                    variant="warning"
                    dismissable={false}
                />
                <Box mt={1}>
                    <Infobar
                        open={true}
                        message="You must exclude fees, dividens, max tx for airdrop address to start the airdrop."
                        variant="warning"
                        dismissable={false}
                    />
                </Box>

                {result === 0 && (
                    <Box mt={2} sx={styles}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => setOpenAirdropModal(true)}
                        >
                            Start Airdrop
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            disabled={tx !== OwnerZonePropsTx.IDLE}
                            onClick={() => handleSubmit(4)}
                        >
                            {tx === OwnerZonePropsTx.IDLE && 'Cancel Airdrop'}
                            {tx === OwnerZonePropsTx.PENDING && <ButtonLoader text="Pending" />}
                            {tx === OwnerZonePropsTx.PROCESSING && (
                                <ButtonLoader text="Processing" />
                            )}
                        </Button>
                    </Box>
                )}

                <Box mt={1}>
                    <Typography variant="body1" fontSize={14}>
                        Allocation Actions
                    </Typography>
                    <Box mt={1} sx={styles}>
                        {result === 0 && (
                            <Box sx={styles}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => setOpenAllocationsModal(true)}
                                >
                                    Set Allocations
                                </Button>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => setOpenVestingModal(true)}
                                >
                                    Set Vesting
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    disabled={tx !== OwnerZonePropsTx.IDLE}
                                    onClick={() => {
                                        handleSubmit(1);
                                    }}
                                >
                                    {tx === OwnerZonePropsTx.IDLE && 'Remove All Allocations'}
                                    {tx === OwnerZonePropsTx.PENDING && (
                                        <ButtonLoader text="Pending" />
                                    )}
                                    {tx === OwnerZonePropsTx.PROCESSING && (
                                        <ButtonLoader text="Processing" />
                                    )}
                                </Button>
                            </Box>
                        )}
                        <Button
                            variant="outlined"
                            size="small"
                            disabled={tx !== OwnerZonePropsTx.IDLE}
                            onClick={() => {
                                handleSubmit(0);
                            }}
                        >
                            {tx === OwnerZonePropsTx.IDLE && 'Disable Exact Amount'}
                            {tx === OwnerZonePropsTx.PENDING && <ButtonLoader text="Pending" />}
                            {tx === OwnerZonePropsTx.PROCESSING && (
                                <ButtonLoader text="Processing" />
                            )}
                        </Button>
                    </Box>
                </Box>
            </PrimaryCard>
            <VestingModal
                open={openVestingModal}
                handleClose={handleClose}
                contractAddress={contractAddress}
            />
            <AirdropModal
                handleClose={handleClose}
                open={openAirdropModal}
                contractAddress={contractAddress}
                tokenAddress={tokenAddress}
                tokensRequired={formatUnits(totalTokens ?? 0n, decimals)}
                tokenSymbol={symbol}
                allocations={allocations}
            />
            <AllocationsModal
                handleClose={handleClose}
                open={openAllocationsModal}
                contractAddress={contractAddress}
                tokenAddress={tokenAddress}
            />
        </Box>
    );
};

export default OwnerZone;
