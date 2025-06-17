import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';
import RadioLabel from '../FormControlLabel/RadioLabel';
import Divider from '../Divider/Divider';
import { OwnerZoneType, PropsWithPrivateSale, Tx } from './types';
import PublicModeModal from './modals/publicModeModal';
import { Address, formatUnits } from 'viem';
import { CURRENCY_DECIMALS, DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { useContractReads, useNetwork } from 'wagmi';
import AntibotModeModal from './modals/AntibotModeModal';
import WhitelistModal from './modals/WhitelistModal';
import ButtonLoader from '../ButtonLoader/ButtonLoader';
import { usePrivateSaleContract, useTokenContract } from '@/hooks/useContract';
import ContributorsListModal from './modals/ContributorsListModal';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import toast from 'react-hot-toast';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Enable UTC plugin

dayjs.extend(utc);

const OwnerZone: React.FC<PropsWithPrivateSale> = ({ privateSale: { id, currency } }) => {
    const [openPublicModeModal, setOpenPublicModeModal] = React.useState<boolean>(false);
    const [openWhitelistModal, setOpenWhitelistModal] = React.useState<boolean>(false);
    const [openAntibotModeModal, setOpenAntibotModeModal] = React.useState<boolean>(false);
    const [openContributorsListModal, setOpenContributorsListModal] =
        React.useState<boolean>(false);

    const [label, setLabel] = React.useState<string>();
    const [whitelisting, setWhitelisting] = React.useState<boolean>(false);
    const [tx, setTx] = React.useState<Tx>(Tx.Idle);

    const isIdle = tx === Tx.Idle;
    const isPending = tx === Tx.Pending;
    const isProcessing = tx === Tx.Processing;

    const contract = usePrivateSaleContract(id as Address);
    const currencyContract = useTokenContract(currency as Address);

    const { chainId } = useActiveChainId();

    const { data, isLoading } = useContractReads({
        contracts: [
            { ...contract, functionName: 'getCurrentMode' },
            { ...contract, functionName: 'getCurrentStatus' },
            { ...contract, functionName: 'saleInfo' },
            { ...contract, functionName: 'totalSale' },
            { ...contract, functionName: 'claimableTokens' },
            { ...currencyContract, functionName: 'decimals' },
        ],
        watch: true,
    });

    const currentMode: number = data?.[0]?.result;
    const currentStatus: number = data?.[1]?.result;
    const saleInfo = data?.[2]?.result;
    const _totalSale: bigint = data?.[3]?.result;
    const _claimableAmount: bigint = data?.[4]?.result;
    const decimals = data?.[5]?.result;

    const [
        name,
        softcap,
        hardcap,
        minBuy,
        maxBuy,
        startTime,
        endTime,
        finalizeTime,
        publicSaleTime,
    ] = saleInfo ?? [];

    const softcapFormated = formatUnits(softcap ?? 0n, decimals ?? 18);
    const totalSale = formatUnits(_totalSale ?? 0n, decimals ?? 18);
    const claimableAmount = +formatUnits(_claimableAmount ?? 0n, decimals ?? 18);

    const isSoftcapReached = +totalSale >= +softcapFormated;

    // Methods:
    const handleClose = () => {
        setOpenPublicModeModal(false);
        setOpenWhitelistModal(false);
        setOpenAntibotModeModal(false);
        setOpenContributorsListModal(false);
    };

    const handleWhitelistType = async () => {
        try {
            setWhitelisting(true);
            const {
                estimateGas: { enablePublicSale: enablePublicSaleGas },
                write: { enablePublicSale },
            } = contract;
            const estimatedGas = await enablePublicSaleGas([endTime], {} as never);
            const hash = await enablePublicSale([endTime], {
                gas: estimatedGas || DefaultGasLimit,
            });

            await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Whitelist Mode Enabled"
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
            setWhitelisting(false);
        }
    };

    const handleChangeType = async (
        e: React.MouseEvent<HTMLLabelElement, MouseEvent>,
        v: number,
    ): Promise<void> => {
        e.preventDefault();
        if (v === 0 && currentMode !== 0) {
            setOpenPublicModeModal(true);
            return;
        }
        if (v === 1 && currentMode !== 1) {
            await handleWhitelistType();
            return;
        }
        if (v === 2 && currentMode !== 2) {
            setOpenAntibotModeModal(true);
            return;
        }
    };

    const handleOpenWhitelistModal = (v: string) => {
        if (v === 'Add') {
            setLabel('Add');
            setOpenWhitelistModal(true);
            return;
        }

        if (v === 'Remove') {
            setLabel('Remove');
            setOpenWhitelistModal(true);
        }
    };

    const handleOpenContributorsListModal = () => {
        setOpenContributorsListModal(true);
    };

    const handleDisableWhitelist = async () => {
        try {
            setTx(Tx.Pending);
            const {
                estimateGas: { enablePublicSale: enablePublicSaleGas },
                write: { enablePublicSale },
            } = contract;
            const estimatedGas = await enablePublicSaleGas(
                [BigInt(dayjs.utc().unix())],
                {} as never,
            );
            const hash = await enablePublicSale([BigInt(dayjs.utc().unix())], {
                gas: estimatedGas || DefaultGasLimit,
            });
            setTx(Tx.Processing);
            const receipt = await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Whitelist Mode Disabled"
                    txChainId={chainId}
                    txHash={hash}
                />,
            );
            if (!receipt) return;
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

    const handleFinalize = async () => {
        try {
            setTx(Tx.Pending);
            const {
                estimateGas: { finalize: finalizeGas },
                write: { finalize },
            } = contract;
            const estimatedGas = await finalizeGas({} as never);
            const hash = await finalize({ gas: estimatedGas || DefaultGasLimit });
            setTx(Tx.Processing);
            await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Sale Finalized"
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

    const handleClaimFund = async () => {
        try {
            setTx(Tx.Pending);
            const {
                estimateGas: { claimTokens: claimTokensGas },
                write: { claimTokens },
            } = contract;
            const estimatedGas = await claimTokensGas({} as never);
            const hash = await claimTokens({ gas: estimatedGas || DefaultGasLimit });
            setTx(Tx.Processing);
            await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Funds Claimed"
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

    const handleCancelSale = async () => {
        try {
            setTx(Tx.Pending);
            const {
                estimateGas: { cancel: cancelGas },
                write: { cancel },
            } = contract;
            const estimatedGas = await cancelGas({} as never);
            const hash = await cancel({ gas: estimatedGas || DefaultGasLimit } as never);

            setTx(Tx.Processing);
            await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Sale Cancelled"
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

    const types = [
        { id: 1, lab: 'Public', val: OwnerZoneType.PUBLIC },
        {
            id: 2,
            lab: whitelisting ? 'Whitelisting...' : 'Whitelist',
            val: OwnerZoneType.WHITELIST,
        },
        { id: 3, lab: 'Public Anti-Bot', val: OwnerZoneType.ANTIBOT },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: '30px' }}>
            <Typography variant="h5" fontSize={20} sx={{ mb: '15px', ml: '32px' }}>
                Owner Zone
            </Typography>
            <PrimaryCard py={25}>
                <FormControl>
                    <Typography sx={{ color: '#FFFFFF' }}>Select Type</Typography>
                    <RadioGroup row value={currentMode ?? 0}>
                        {types.map(({ id, val, lab }) => (
                            <RadioLabel
                                isDisabled={currentStatus !== 1} // disbaled when sale is not live
                                key={id}
                                iconSize={18}
                                handleChange={handleChangeType} // calls when sale is live
                                fontSize={13}
                                val={val}
                                lab={lab}
                                currentStatus={currentStatus}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>

                <Box mt={2}>
                    {currentMode === 1 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button
                                variant="contained"
                                onClick={() => handleOpenWhitelistModal('Add')}
                            >
                                Add users to whitelist
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleOpenWhitelistModal('Remove')}
                            >
                                Remove users to whitelist
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setOpenPublicModeModal(true)}
                            >
                                Setting time to public
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleDisableWhitelist}
                                disabled={!isIdle}
                            >
                                {isIdle && 'Disable Whitelist'}
                                {isPending && <ButtonLoader text="Pending" />}
                                {isProcessing && <ButtonLoader text="Processing" />}
                            </Button>
                        </Box>
                    )}
                    <Divider color="#FFFFFF" mt={20} />

                    <Typography>Pool Actions</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} mt={2}>
                        <Button variant="contained" onClick={handleOpenContributorsListModal}>
                            List of Contributors
                        </Button>
                        <Button
                            variant="contained"
                            disabled={
                                !isSoftcapReached ||
                                currentStatus === 2 ||
                                currentStatus === 3 ||
                                !isIdle
                            }
                            onClick={handleFinalize}
                        >
                            {isIdle && 'Finalize'}
                            {isPending && <ButtonLoader text="pending" />}
                            {isProcessing && <ButtonLoader text="processing" />}
                        </Button>
                        <Button
                            variant="contained"
                            disabled={currentStatus !== 3 || !isIdle || claimableAmount === 0}
                            onClick={handleClaimFund}
                        >
                            {isIdle &&
                                `Claim Fund ${currentStatus !== 2 ? `(${claimableAmount})` : ''}`}
                            {isPending && <ButtonLoader text="pending" />}
                            {isProcessing && <ButtonLoader text="processing" />}
                        </Button>
                        <Button
                            variant="contained"
                            disabled={!isIdle || currentStatus === 2 || currentStatus === 3}
                            onClick={handleCancelSale}
                        >
                            {isIdle && 'Cancel Sale'}
                            {isPending && <ButtonLoader text="pending" />}
                            {isProcessing && <ButtonLoader text="processing" />}
                        </Button>
                    </Box>
                </Box>
            </PrimaryCard>

            <PublicModeModal
                open={openPublicModeModal}
                handleClose={handleClose}
                contractAddress={id}
            />

            <AntibotModeModal
                open={openAntibotModeModal}
                handleClose={handleClose}
                contractAddress={id}
            />

            <WhitelistModal
                open={openWhitelistModal}
                handleClose={handleClose}
                contractAddress={id}
                label={label}
            />

            <ContributorsListModal
                open={openContributorsListModal}
                handleClose={handleClose}
                contractAddress={id}
            />
        </Box>
    );
};

export default OwnerZone;
