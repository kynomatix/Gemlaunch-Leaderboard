'use client';

import { DefaultGasLimit, MULTISENDER_CONTRACT_ADDRESSES } from '@/constants';
import { useToken } from '@/hooks/Tokens';
import { ApprovalState, useApproveCallback } from '@/hooks/useApproveCallback';
import { useMultisenderContract } from '@/hooks/useContract';
import tryParseAmount from '@dapp/utils/tryParseAmount';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    CircularProgress,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Address, formatUnits, parseUnits } from 'viem';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { WaitForTransactionResult, waitForTransaction } from 'wagmi/actions';
import PrimaryCard from '../Cards/PrimaryCard';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import Step1 from './Step1';
import Step2 from './Step2';
import { STEPS } from './constants';
import {
    AmountToApprove,
    EnsureExactAmount,
    MultisenderContract,
    MultisenderFormInput,
    Tx,
} from './types';
import { MULTISENDER_VALIDATION } from './validations';
import { chunk } from 'lodash';
import Divider from '../Divider/Divider';
import Link from 'next/link';
import { getBlockExploreLink } from '@/utils';
import { useActiveChainId } from '@/hooks/useActiveChainId';

interface DataChunk {
    addresses: Address[];
    amounts: bigint[];
}

interface TxInfo {
    hash: Address;
    status: string;
}

export default function MultisenderForm() {
    const isMobile = useMediaQuery('(max-width:740px)');

    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());

    const [txInfo, setTxInfo] = React.useState<TxInfo[]>();

    const [totalTransferableAmount, setTotalTransferableAmount] = React.useState(0);
    const [totalReceivers, setTotalReceivers] = React.useState(0);
    const [isNativeCurrency, setIsNativeCurrency] = React.useState(true);
    const [approveAmount, setApproveAmount] = React.useState(0n);
    const [totalTransactions, setTotalTransactions] = React.useState(1);
    const [tx, setTx] = React.useState(Tx.IDLE);

    const { chainId } = useActiveChainId();

    const multisendContract: MultisenderContract = useMultisenderContract(
        MULTISENDER_CONTRACT_ADDRESSES[chainId] as Address,
    );

    const formMethods = useForm<MultisenderFormInput>({
        mode: 'onChange',
        defaultValues: {
            tokenAddress: undefined,
            allocations: undefined,
            amountToApprove: AmountToApprove.UNLIMITED,
            ensureExactAmount: EnsureExactAmount.UNSAFE,
        },
        resolver: yupResolver(MULTISENDER_VALIDATION) as any,
    });

    const {
        handleSubmit,
        trigger,
        watch,
        formState: { isSubmitting, isValid },
    } = formMethods;

    const tokenAddress = watch('tokenAddress');
    const allocations = watch('allocations');
    const amountToApprove = watch('amountToApprove');

    const { address } = useAccount();
    const { data: nativeCurrencyBalance } = useBalance({
        address,
    });
    const { data: tokenCurrencyBalance } = useBalance({
        address,
        token: tokenAddress as Address,
    });

    const tokenCurrency = useToken(tokenAddress);
    const parsedTotalTransferableAmount = tryParseAmount(
        formatUnits(approveAmount, tokenCurrency?.decimals ?? 18),
        tokenCurrency,
    );

    const { approvalState, approveCallback } = useApproveCallback(
        parsedTotalTransferableAmount,
        MULTISENDER_CONTRACT_ADDRESSES[chainId],
    );

    React.useEffect(() => {
        if (allocations) {
            const lines = allocations.trim().split('\n');
            setTotalReceivers(lines.length);
            let sum = 0;
            let sumBigInt = 0n;
            if (lines.length > 0) {
                lines.forEach((line) => {
                    const [_, a] = line.split(',');
                    const amount = Number(a);
                    if (!isNaN(amount)) {
                        sum += amount;
                        sumBigInt += parseUnits(amount.toString(), tokenCurrency?.decimals || 18);
                    }
                });
            }
            setTotalTransferableAmount(sum);
            setApproveAmount(sumBigInt);
            setTotalTransactions(Math.ceil(lines?.length / 50));
        }
    }, [allocations, tokenCurrency]);

    const handleApprove = async () => {
        setTx(Tx.PENDING);
        try {
            if (amountToApprove === AmountToApprove.EXACT) {
                const { hash } = await approveCallback(approveAmount);

                setTx(Tx.PROCESSING);
                await waitForTransaction({ hash, chainId });
            } else {
                const { hash } = await approveCallback();
                setTx(Tx.PROCESSING);
                await waitForTransaction({ hash, chainId });
            }
        } catch (error: any) {
            console.error({ error });
            toast.error(
                <DescriptionWithTx
                    title="Error"
                    description={error.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTx(Tx.IDLE);
        }
    };

    const getChunkOfData = (
        addresses: Address[],
        amounts: bigint[],
        chunkSize: number,
    ): DataChunk[] => {
        const data: DataChunk[] = [];
        for (let i = 0; i < addresses.length; i += chunkSize) {
            const chunkAddresses = addresses.slice(i, i + chunkSize);
            const chunkAmounts = amounts.slice(i, i + chunkSize);
            data.push({ addresses: chunkAddresses, amounts: chunkAmounts });
        }
        return data;
    };

    const sendNativeCurrency = async (data: MultisenderFormInput) => {
        const { value } = nativeCurrencyBalance;

        const { allocations } = data;

        const userBalance = +formatUnits(value, 18);

        let addresses: Address[] = [];
        let amounts: bigint[] = [];

        const lines = allocations.trim().split('\n');

        lines.forEach((line) => {
            const [address, amount] = line.split(',');
            addresses.push(address as Address);
            amounts.push(parseUnits(amount, 18));
        });

        const amountNeeded = +formatUnits(
            amounts.reduce((acc, amount) => acc + amount, 0n),
            18,
        );
        // const amountNeeded = Number(approveAmount);

        if (userBalance < amountNeeded) {
            toast.error(
                <DescriptionWithTx
                    title="Low balance"
                    description="You don't have enough balance"
                />,
            );
            return;
        }

        const dataChunks = getChunkOfData(addresses, amounts, 50);

        const { estimateGas, write } = multisendContract;
        const { multisendEther: multisendEtherGas } = estimateGas;
        const { multisendEther } = write;

        // get gas estimates in chunks
        const gasLimits = await Promise.allSettled(
            dataChunks.map((x) =>
                multisendEtherGas([x.addresses, x.amounts], {
                    // value: x.amounts.reduce((acc, val) => acc + val, 0n),
                } as never),
            ),
        );

        // send transactions in chunks
        const hashes = await Promise.allSettled(
            dataChunks.map((x, i) =>
                multisendEther([x.addresses, x.amounts], {
                    gas: (gasLimits[i] as PromiseFulfilledResult<bigint>).value,
                    value: x.amounts.reduce((acc, val) => acc + val, 0n),
                }),
            ),
        );

        const filteredHashes = hashes.filter((x) => x.status === 'fulfilled');

        setTxInfo(
            filteredHashes.map((x) => {
                return { hash: (x as PromiseFulfilledResult<Address>).value, status: 'pending' };
            }),
        );

        const receipts = await Promise.allSettled(
            filteredHashes.map((x) =>
                waitForTransaction({ hash: (x as PromiseFulfilledResult<Address>).value, chainId }),
            ),
        );

        setTxInfo((prev) =>
            receipts.map((x, i) => {
                return {
                    ...prev[i],
                    status: (x as PromiseFulfilledResult<WaitForTransactionResult>)?.value
                        ?.status as string,
                };
            }),
        );
    };

    const sendTokenCurrency = async (data: MultisenderFormInput, index = 0) => {
        const { value, decimals } = tokenCurrencyBalance;
        const { allocations, ensureExactAmount } = data;

        const userBalance = +formatUnits(value, decimals);

        let addresses: Address[] = [];
        let amounts: bigint[] = [];

        const lines = allocations.trim().split('\n');

        lines.forEach((line) => {
            const [address, amount] = line.split(',');
            addresses.push(address as Address);
            amounts.push(parseUnits(amount, decimals));
        });

        // Calculate the total amount needed to send
        const totalAmountNeeded = +formatUnits(
            amounts.reduce((acc, amount) => acc + amount, 0n),
            decimals,
        );

        if (userBalance < totalAmountNeeded) {
            toast.error(
                <DescriptionWithTx
                    title="Low balance"
                    description="You don't have enough balance"
                />,
            );
            return;
        }

        const dataChunks = getChunkOfData(addresses, amounts, 50);

        const { estimateGas, write } = multisendContract;
        const { multisendToken: multisendTokenGas } = estimateGas;
        const { multisendToken } = write;

        const isEnsureExactAmount = ensureExactAmount === EnsureExactAmount.SAFE ? true : false;

        // get gas estimates in chunks
        const gasLimits = await Promise.allSettled(
            dataChunks.map((x) =>
                multisendTokenGas(
                    [tokenAddress as Address, isEnsureExactAmount, x.addresses, x.amounts],
                    {} as never,
                ),
            ),
        );

        // send transactions in chunks
        const hashes = await Promise.allSettled(
            dataChunks.map((x, i) => {
                return multisendToken(
                    [tokenAddress as Address, isEnsureExactAmount, x.addresses, x.amounts],
                    {
                        gas:
                            (gasLimits[i] as PromiseFulfilledResult<bigint>).value ??
                            DefaultGasLimit,
                    },
                );
            }),
        );

        const filteredHashes = hashes.filter((x) => x.status === 'fulfilled');

        setTxInfo(
            filteredHashes.map((x) => {
                return { hash: (x as PromiseFulfilledResult<Address>).value, status: 'pending' };
            }),
        );

        const receipts = await Promise.allSettled(
            filteredHashes.map((x) =>
                waitForTransaction({ hash: (x as PromiseFulfilledResult<Address>).value, chainId }),
            ),
        );

        setTxInfo((prev) =>
            receipts.map((x, i) => {
                return {
                    ...prev[i],
                    status: (x as PromiseFulfilledResult<WaitForTransactionResult>)?.value
                        ?.status as string,
                };
            }),
        );
    };

    const onSubmit: SubmitHandler<MultisenderFormInput> = async (data: MultisenderFormInput) => {
        try {
            setTx(Tx.PENDING);
            if (isNativeCurrency) {
                await sendNativeCurrency(data);
            }

            if (!isNativeCurrency) {
                await sendTokenCurrency(data);
                setTx(Tx.IDLE);
            }
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title="Error"
                    description={e?.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTx(Tx.IDLE);
        }
    };

    const handleNext = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        // if form is not valid then re-validate the form so the user can see updated errors
        if (!isValid) {
            trigger();
            return;
        }

        if (tokenAddress) {
            setIsNativeCurrency(false);
        } else {
            setIsNativeCurrency(true);
        }

        let newSkipped = skipped;
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ width: '100%' }}>
                    <PrimaryCard px={50} py={25} mt={30}>
                        <Stepper
                            activeStep={activeStep}
                            orientation={isMobile ? 'vertical' : 'horizontal'}
                            sx={{
                                height: { xs: 'auto', lg: '160px' },
                                mt: { xs: 'auto', lg: '-42px' },
                            }}
                        >
                            {STEPS.map(({ label, desc }, index) => {
                                const stepProps: { completed?: boolean } = {};
                                const labelProps: {
                                    optional?: React.ReactNode;
                                } = {};

                                return (
                                    <Step
                                        key={label}
                                        {...stepProps}
                                        sx={{
                                            '.MuiStepIcon-root': {
                                                color:
                                                    activeStep >= index ? '#22CDA6' : '#ffffff30',
                                                width: {
                                                    md: '28px',
                                                    lg: '32px',
                                                },
                                                height: {
                                                    md: '28px',
                                                    lg: '32px',
                                                },
                                            },
                                        }}
                                    >
                                        <StepLabel {...labelProps} icon={`0${index + 1}`}>
                                            <Typography
                                                fontSize={14}
                                                fontWeight={600}
                                                sx={{
                                                    color:
                                                        activeStep >= index
                                                            ? '#22CDA6'
                                                            : '#FFFFFF30',
                                                }}
                                            >
                                                {label}
                                            </Typography>
                                        </StepLabel>
                                        <Typography
                                            sx={{
                                                display: { xs: 'none', lg: 'flex' },
                                                position: 'absolute',
                                                ml: 5,
                                                // mr: 10,
                                                // mt: '13.5px',
                                                maxWidth: '205px',
                                                flexWrap: 'wrap',
                                                zIndex: 20,
                                                fontSize: {
                                                    sm: 10,
                                                    md: 11,
                                                    lg: 12,
                                                },
                                                pr: 2,
                                                // border: '1px solid red',
                                                color:
                                                    activeStep >= index ? '#ffffff' : '#ffffff30',
                                            }}
                                        >
                                            {desc}
                                        </Typography>
                                    </Step>
                                );
                            })}
                        </Stepper>
                    </PrimaryCard>
                    <PrimaryCard mt={30} mb={30} py={30}>
                        <Box>
                            {activeStep === 0 && (
                                <Step1
                                    approveAmount={approveAmount}
                                    tokenDecimals={tokenCurrency?.decimals || 18}
                                    totalTransferableAmount={totalTransferableAmount}
                                    approvalState={approvalState}
                                />
                            )}
                            {activeStep === 1 && (
                                <Step2
                                    approveAmount={approveAmount}
                                    tokenDecimals={tokenCurrency?.decimals || 18}
                                    totalTransferableAmount={totalTransferableAmount}
                                    isNativeCurrency={isNativeCurrency}
                                    totalReceivers={totalReceivers}
                                    totalTransactions={totalTransactions}
                                />
                            )}
                        </Box>
                        <Box
                            sx={{
                                display: txInfo?.[0] ? 'none' : 'flex',
                                justifyContent: 'center',
                                gap: '10px',
                                alignItems: 'center',
                                pt: 2,
                            }}
                        >
                            {activeStep !== 0 && (
                                <Button
                                    size="large"
                                    variant="outlined"
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Back
                                </Button>
                            )}
                            {approvalState === ApprovalState.NOT_APPROVED ||
                            approvalState === ApprovalState.PENDING ? (
                                <Button
                                    size="large"
                                    variant="contained"
                                    disabled={
                                        tx === Tx.PENDING || approvalState === ApprovalState.PENDING
                                    }
                                    onClick={handleApprove}
                                >
                                    {approvalState === ApprovalState.PENDING ||
                                    tx === Tx.PENDING ? (
                                        <>
                                            <CircularProgress
                                                size={15}
                                                sx={{ mr: 1, color: '#9E9E9E' }}
                                            />

                                            {tx === Tx.PENDING
                                                ? 'Approving...'
                                                : 'Processing Transaction...'}
                                        </>
                                    ) : (
                                        'Approve'
                                    )}
                                </Button>
                            ) : (
                                <>
                                    {activeStep === STEPS.length - 1 ? (
                                        <Button
                                            type="submit"
                                            size="large"
                                            variant="contained"
                                            disabled={
                                                isSubmitting ||
                                                tx === Tx.PENDING ||
                                                tx === Tx.PROCESSING
                                            }
                                        >
                                            {tx === Tx.PENDING && (
                                                <>
                                                    <CircularProgress
                                                        size={15}
                                                        sx={{ mr: 1, color: '#9E9E9E' }}
                                                    />
                                                    Waiting...
                                                </>
                                            )}
                                            {tx === Tx.PROCESSING && (
                                                <>
                                                    <CircularProgress
                                                        size={15}
                                                        sx={{ mr: 1, color: '#9E9E9E' }}
                                                    />
                                                    Procesing Transaction...
                                                </>
                                            )}
                                            {tx === Tx.IDLE && 'Submit'}
                                        </Button>
                                    ) : (
                                        <Button
                                            size="large"
                                            variant="contained"
                                            onClick={handleNext}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </>
                            )}
                        </Box>

                        {/* tx hashes and status */}

                        {txInfo?.[0] && (
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 500, fontSize: 14 }}>
                                                Tx Hashes
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: 14,
                                                    borderLeft: '1px solid #ffffff25',
                                                }}
                                            >
                                                Status
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {txInfo?.map((x) => (
                                            <TableRow>
                                                <TableCell sx={{ color: '#22CDA6' }}>
                                                    <Link
                                                        href={getBlockExploreLink(
                                                            x.hash,
                                                            'transaction',
                                                            chainId,
                                                        )}
                                                        target="_blank"
                                                    >
                                                        {x.hash}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{x.status}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </PrimaryCard>
                </Box>
            </form>
        </FormProvider>
    );
}
