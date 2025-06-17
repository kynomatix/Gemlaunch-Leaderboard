import React from 'react';
import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';
import LinearProgressCustom from '../LinearProgress/LinearProgressCustom';
import CountdownTimer from '../CountdownTimer';
import { Address, useAccount, useBalance, useContractReads, useNetwork } from 'wagmi';
import { usePrivateSaleContract, useTokenContract } from '@/hooks/useContract';
import { PrivateSale } from '@/src/gql/graphql';
import dayjs from 'dayjs';
import { ADDRESS_ZERO, CURRENCY_DECIMALS, CURRENCY_SYMBOLS, DefaultGasLimit } from '@/constants';
import { formatUnits, parseUnits } from 'viem';
import { getTokenSymbolByAddress } from '@/utils/getTokenSymbolByAddress';
import { getProgress } from '@/utils/getProgress';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { disableScroll } from '@/utils/disableScroll';
import TextFieldError from '../TextField/TextFieldError';
import { ContributionFormInput, Tx } from './types';
import { contributionValidation } from './validation';
import { yupResolver } from '@hookform/resolvers/yup';
import TextFieldHead from '../TextField/TextFieldHead';
import { waitForTransaction } from 'wagmi/actions';
import ButtonLoader from '../ButtonLoader/ButtonLoader';
import Infobar from '../Infobar/Infobar';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import toast from 'react-hot-toast';
import { ApprovalState, useApproveCallback } from '@/hooks/useApproveCallback';
import tryParseAmount from '@dapp/utils/tryParseAmount';
import { useToken } from '@/hooks/Tokens';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import utc from 'dayjs/plugin/utc'; // Enable UTC plugin

dayjs.extend(utc);

const PrivateSaleTimer: React.FC<PrivateSale> = ({ id, currency }) => {
    const [tx, setTx] = React.useState<Tx>(Tx.Idle);

    const { chainId } = useActiveChainId();
    const privateSaleContract = usePrivateSaleContract(id as Address);

    const isIdle = tx === Tx.Idle;
    const isPending = tx === Tx.Pending;
    const isProcessing = tx === Tx.Processing;

    const { address } = useAccount();
    const { data: token } = useBalance({
        address,
        token: currency !== ADDRESS_ZERO ? (currency as Address) : undefined,
        watch: true,
    });

    const currencyContract = useTokenContract(currency as Address);

    const { data } = useContractReads({
        contracts: [
            { ...privateSaleContract, functionName: 'saleInfo' },
            { ...privateSaleContract, functionName: 'totalSale' },
            { ...privateSaleContract, functionName: 'getCurrentStatus' },
            { ...privateSaleContract, functionName: 'depositOf', args: [address] },
            { ...currencyContract, functionName: 'decimals' },
        ],
        watch: true,
    });

    const saleInfo = data?.[0]?.result;
    const _totalSale = data?.[1]?.result as bigint;
    const status = data?.[2]?.result as number;
    const _userContribution = data?.[3]?.result as bigint;
    const decimals = data?.[4]?.result as number; // currencyDecimals

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

    const symbol = CURRENCY_SYMBOLS[currency];

    const currentTime = dayjs().utc();
    const _startTime = dayjs.utc(Number(startTime) * 1000);
    const _endTime = dayjs.utc(Number(endTime) * 1000);

    const totalSale = +formatUnits(_totalSale ?? 0n, decimals ?? 18);
    const hardcapFormated = +formatUnits(hardcap ?? 0n, decimals ?? 18);
    const userContribution = +formatUnits(_userContribution ?? 0n, decimals ?? 18);
    const tokenSymbol = getTokenSymbolByAddress(currency as Address, chainId);
    const progress = getProgress(+totalSale, +hardcapFormated);
    const maxContributionLimit = +hardcapFormated - +totalSale;

    const isAllTokensSold = totalSale === hardcapFormated;
    const isUserHasClaimedFund = userContribution === 0;
    const tokenBalance = +formatUnits(token?.value ?? 0n, token?.decimals ?? 18);

    const {
        handleSubmit,
        control,
        setValue,
        trigger,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ContributionFormInput>({
        mode: 'all',
        defaultValues: {
            amount: undefined,
        },
        resolver: yupResolver(contributionValidation(+token?.formatted, tokenBalance)) as any,
    });

    const amount = watch('amount');

    const tokenCurrency = useToken(currency !== ADDRESS_ZERO ? (currency as Address) : undefined);
    const parsedAmount = tryParseAmount(amount?.toString(), tokenCurrency);
    const { approvalState, approveCallback } = useApproveCallback(parsedAmount, id);

    const onSubmit: SubmitHandler<ContributionFormInput> = async (data: ContributionFormInput) => {
        try {
            setTx(Tx.Pending);
            const { amount } = data;

            const {
                estimateGas: { investFunds: investFundsGas },
                write: { investFunds },
            } = privateSaleContract;

            let hash: Address;

            // if we got the symbol, it means the currency is not native
            // and we dont need to pass value as we pass in native currency
            if (symbol) {
                const estimatedGas = await investFundsGas(
                    [parseUnits(amount?.toString(), decimals)],
                    {} as never,
                );
                hash = await investFunds([parseUnits(amount?.toString(), decimals)], {
                    gas: estimatedGas || DefaultGasLimit,
                } as never);
            }

            if (!symbol) {
                const estimatedGas = await investFundsGas([parseUnits(amount?.toString(), 18)], {
                    value: parseUnits(amount?.toString(), 18),
                } as never);
                hash = await investFunds([parseUnits(amount?.toString(), 18)], {
                    gas: estimatedGas || DefaultGasLimit,
                    value: parseUnits(amount?.toString(), 18),
                } as never);
            }

            setTx(Tx.Processing);
            await waitForTransaction({ hash, chainId });

            setValue('amount', amount, { shouldValidate: true });

            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Funds Invested"
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

    const getTimerTitle = (status: number): string => {
        if (status === 0) {
            return 'Time left to start sale';
        }
        if (status === 1) {
            return 'Time left to end sale';
        }
        if (status === 2) {
            return 'Sale is cancelled';
        }
        if (status === 3) {
            return 'Sale is closed';
        }

        return '';
    };

    const handleClaimRefund = async () => {
        setTx(Tx.Pending);
        try {
            const {
                estimateGas: { claimRefund: claimRefundGas },
                write: { claimRefund },
            } = privateSaleContract;

            const estimatedGas = await claimRefundGas({} as never);
            const hash = await claimRefund({ gas: estimatedGas || DefaultGasLimit });

            setTx(Tx.Processing);
            await waitForTransaction({ hash, chainId });
            toast.error(
                <DescriptionWithTx
                    title="Success"
                    description="Funds Claimed"
                    txHash={hash}
                    txChainId={chainId}
                />,
            );
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name || 'error'}
                    description={e.shortMessage || 'Something went wrong!'}
                />,
            );
        } finally {
            setTx(Tx.Idle);
        }
    };

    const handleMax = () => {
        setValue('amount', +tokenBalance);
        trigger();
    };

    const handleApprove = async (e) => {
        e.preventDefault();
        try {
            setTx(Tx.Pending);
            const { hash } = await approveCallback();
            setTx(Tx.Processing);
            await waitForTransaction({ hash, chainId });
        } catch (e: any) {
            console.error(e);
        } finally {
            setTx(Tx.Idle);
        }
    };

    return (
        <PrimaryCard py={25}>
            <Box sx={{ width: '100%', height: '100%' }}>
                <Infobar
                    open={true}
                    dismissable={false}
                    message="Make sure the website is gemlaunch.io"
                />
                <Typography
                    mt={1}
                    variant="body1"
                    fontSize={18}
                    textAlign="center"
                    sx={{ mb: '14px' }}
                >
                    {getTimerTitle(status)}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '15px',
                    }}
                >
                    <CountdownTimer
                        endTime={
                            status === 0 || status === 1
                                ? currentTime.isBefore(_startTime)
                                    ? _startTime.toString()
                                    : _endTime.toString()
                                : undefined
                        }
                    />
                </Box>

                <Box sx={{ mt: '16px', mb: '30px' }}>
                    <LinearProgressCustom value={progress} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                            mt: '6px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Typography fontSize={12} variant="body1">
                            {totalSale} {tokenSymbol}
                        </Typography>
                        <Typography fontSize={12} variant="body1">
                            {hardcapFormated} {tokenSymbol}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box>
                {/* show this when sale is live */}
                {status === 1 && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextFieldHead title={`Your Balance: (${token?.formatted ?? 0})`} />
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="number"
                                    placeholder="Amount"
                                    onScroll={disableScroll}
                                    error={!!errors?.amount}
                                    helperText={<TextFieldError fieldName={errors?.amount} />}
                                    onKeyPress={(event) => {
                                        if (
                                            event.key === 'Enter' &&
                                            approvalState !== ApprovalState.APPROVED
                                        ) {
                                            event.preventDefault();
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <Button
                                                    onClick={handleMax}
                                                    variant="text"
                                                    size="small"
                                                    sx={{ px: '16px' }}
                                                >
                                                    MAX
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />

                        {currency !== ADDRESS_ZERO ? (
                            <>
                                {approvalState === ApprovalState.APPROVED && (
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        size="small"
                                        disabled={isSubmitting || isAllTokensSold || status !== 1}
                                        sx={{ width: '100%', mt: 1 }}
                                    >
                                        {isIdle && `Buy with ${tokenSymbol}`}
                                        {isPending && <ButtonLoader text="Pending" />}
                                        {isProcessing && <ButtonLoader text="Processing" />}
                                    </Button>
                                )}
                                {approvalState !== ApprovalState.APPROVED && (
                                    <Button
                                        variant="contained"
                                        onClick={(e) => handleApprove(e)}
                                        size="small"
                                        disabled={tokenBalance < amount || tx !== Tx.Idle}
                                        sx={{ width: '100%', mt: 1 }}
                                    >
                                        {isIdle && `Approve`}
                                        {isPending && <ButtonLoader text="Pending" />}
                                        {isProcessing && <ButtonLoader text="Processing" />}
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                type="submit"
                                size="small"
                                disabled={isSubmitting || isAllTokensSold || status !== 1}
                                sx={{ width: '100%', mt: 1 }}
                            >
                                {isIdle && `Buy with ${tokenSymbol}`}
                                {isPending && <ButtonLoader text="Pending" />}
                                {isProcessing && <ButtonLoader text="Processing" />}
                            </Button>
                        )}
                    </form>
                )}

                {/* Show this when stauts is cancelled */}
                {status === 2 && (
                    <Button
                        onClick={handleClaimRefund}
                        disabled={isUserHasClaimedFund || !isIdle}
                        variant="contained"
                        size="small"
                        sx={{ width: '100%', mt: 1 }}
                    >
                        {isIdle && isUserHasClaimedFund ? 'Already Refunded' : `Claim Refund`}
                        {isPending && <ButtonLoader text="Pending" />}
                        {isProcessing && <ButtonLoader text="Processing" />}
                    </Button>
                )}
            </Box>
        </PrimaryCard>
    );
};

export default PrivateSaleTimer;
