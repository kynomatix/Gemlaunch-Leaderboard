import React, { useMemo } from 'react';
import PrimaryCard from '@/components/Cards/PrimaryCard';
import { Box, Button, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { disableScroll } from '@/utils/disableScroll';
import { useAccount, useBalance, useContractRead, useContractReads } from 'wagmi';
import { Address, formatUnits, parseEther, parseUnits, zeroAddress } from 'viem';
import { yupResolver } from '@hookform/resolvers/yup';
import { DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import moment from 'moment';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import useForceUpdate from '@/hooks/useForceUpdate';
import useFairLaunchDetails from '../../hooks/fairlaunchHooks/useFairlaunchDetails';
import LinearProgressCustom from '@/components/LinearProgress/LinearProgressCustom';
import Infobar from '@/components/Infobar/Infobar';
import { LAUNCHPAD_TOKEN_BUY } from '../../formValidation';
import { ClaimType, LaunchpadSaleStatus, Tx } from '../../types';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
import { FairLaunchABI } from '@/config/abi/fairlaunch';
import SaleStatusInfo from '../SaleStatusInfo';
import { calculateRemainingBuyLimit, formatBigUnits, getStatusString } from '../../utils';
import useLaunchpadRewardInfo from '../../hooks/launchpadHooks/useLaunchpadRewardInfo';
import useFundTokenAllowance from '../../hooks/useFundTokenAllowance';
import useFundTokenDetails from '../../hooks/useFundTokenDetails';
import { getProgress } from '@/utils/getProgress';
import { ApprovalState } from '@/hooks/useApproveCallback';
import { useSingleCallResult } from '@/state/multicall/hooks';

type FormValues = {
    buyAmount: number;
};

const FairLaunchPreSaleTimer = ({ launchpadAddress }: { launchpadAddress: Address }) => {
    const [tx, setTx] = React.useState<Tx>(Tx.Idle);
    const [txClaim, setTxClaim] = React.useState<Tx>(Tx.Idle);
    const [txRefundToken, setTxRefundToken] = React.useState<Tx>(Tx.Idle);
    const { chainId } = useActiveChainId();
    const searchParams = useSearchParams();
    const { address, isReconnecting } = useAccount();

    const refID = searchParams.get('refId');

    const {
        launchpadContract,
        maxBuyLimit,
        // minBuyLimit,
        isMaxLimit,
        tokenDecimals,
        hasStarted,
        hasEnded,
        saleActive,
        counterStart,
        counterEnd,
        softCap,
        softCapNum,
        totalRaisedNum,
        currentLaunchpadStatus,
        symbol,
        isLoading,
        endTimeMoment,
        currentSaleMode,
        refetchFairLaunchDetail,
    } = useFairLaunchDetails(launchpadAddress);

    const {
        fundTokenDecimals,
        fundTokenSymbol,
        isNative: isNativeFundToken,
        fundTokenAddress,
        balance,
        isLoading: fundTokenLoading,
    } = useFundTokenDetails(launchpadAddress);

    const { data: token } = useBalance({
        address,
        token: fundTokenAddress !== zeroAddress ? (fundTokenAddress as Address) : undefined,
        watch: true,
    });

    const maxLimit = isMaxLimit ? maxBuyLimit : Number(token?.formatted); // userTokenBalance

    const { result: userInfo, loading: userInvestmentLoading } = useSingleCallResult({
        contract: launchpadContract,
        functionName: 'userInfo',
        args: [address],
    });
    const userInvest = userInfo?.[0] ?? 0n;
    const userClaimed = userInfo?.[1] ?? 0n;



    const {
        data,
        isLoading: priceLoading,
        refetch,
    } = useContractReads({
        contracts: [
            { ...launchpadContract, functionName: 'currentPrice' },
            { ...launchpadContract, functionName: 'getUserTokens', args: [address] },
        ],
    });

    const loading = isLoading || priceLoading || userInvestmentLoading || fundTokenLoading;

    const currentRate = !priceLoading && ((data[0]?.result as unknown as bigint) ?? 0n);
    const userShare = !priceLoading && ((data[1]?.result as unknown as bigint) ?? 0n);

    // require((user.userCalimed + userShare) <= userShare, 'All tokens claimed');
    const hasUserClaimedAllToken =
        Number(Number(userClaimed) + Number(userShare)) >= Number(userShare);

    const userInvestment = formatUnits(userInvest ?? 0n, fundTokenDecimals ?? 18);
    // minBuyLimit does not exits in fairlaunch so minBuyLimit=0
    const minLimit = +formatUnits(0n ?? 0n, fundTokenDecimals ?? 18);

    const userFundTokenBalance = +formatUnits(token?.value ?? 0n, token?.decimals ?? 18);

    const remainingBuyLimit = calculateRemainingBuyLimit(userInvestment, maxLimit);

    const hasEnoughBalanceToBuyToken = useMemo(() => {
        return userFundTokenBalance >= remainingBuyLimit;
    }, [userFundTokenBalance, remainingBuyLimit]);

    const isSaleActive = currentLaunchpadStatus === LaunchpadSaleStatus.ACTIVE;
    const isSaleCanceled = currentLaunchpadStatus === LaunchpadSaleStatus.CANCELLED;
    const isSaleClosed = currentLaunchpadStatus === LaunchpadSaleStatus.CLOSED;

    const isIdle = tx === Tx.Idle;
    const isPending = tx === Tx.Pending;
    const isProcessing = tx === Tx.Processing;

    const isClaimIdle = txClaim === Tx.Idle;
    const isClaimPending = txClaim === Tx.Pending;
    const isClaimProcessing = txClaim === Tx.Processing;

    const formMethods = useForm<FormValues>({
        mode: 'onChange',
        defaultValues: {
            buyAmount: 0,
        },
        resolver: yupResolver(LAUNCHPAD_TOKEN_BUY(minLimit, remainingBuyLimit)) as any, // maxbuylimit is from the contract
    });

    const {
        control,
        handleSubmit,
        trigger,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting, isValid },
    } = formMethods;

    const hasBuyAmountReached = remainingBuyLimit === 0;

    const buyAmount = watch('buyAmount');

    const tokenToReceive = `${buyAmount * Number(formatUnits(currentRate ?? 0n, tokenDecimals ?? 18))
        } ${symbol}`;

    const { isZeroAllowance, hasLessAllowance, hasAllowance, approveExactAmount, approvalState } =
        useFundTokenAllowance({ fundTokenAddress, buyAmount, fundTokenDecimals, launchpadAddress });

    const disablePreSaleButton =
        !saleActive() ||
        isSubmitting ||
        hasBuyAmountReached ||
        !isValid ||
        isPending ||
        isProcessing ||
        hasEnded;

    const buyWithToken = async (buyAmount) => {
        console.info('Buy with Token');
        try {
            const amountInWei = parseEther(buyAmount.toString());

            const refferId = (refID as Address) ?? zeroAddress;

            setTx(Tx.Pending);
            const {
                write: { buyToken },
                estimateGas: { buyToken: buyTokenGas },
            } = launchpadContract;

            const estimationGas = await buyTokenGas(
                [parseUnits(buyAmount.toString(), fundTokenDecimals), refferId],
                {
                    // value: parseUnits(buyAmount.toString(), fundTokenDecimals),
                },
            );

            const hash = await buyToken(
                [parseUnits(buyAmount.toString(), fundTokenDecimals), refferId],
                {
                    // value: parseUnits(buyAmount.toString(), fundTokenDecimals),
                    gas: estimationGas || DefaultGasLimit,
                },
            );

            setTx(Tx.Processing);
            await waitForTransaction({ hash, chainId });
            reset();
        } catch (e: any) {
            console.error('Error submitting form:', e);

            toast.error(
                <DescriptionWithTx
                    title={e.name || 'error'}
                    description={e ? e.shortMessage : e || 'Something went wrong'}
                />,
            );
            refetchFairLaunchDetail();
        } finally {
            setTx(Tx.Idle);
            refetchFairLaunchDetail();
        }
    };

    const buyWithNativeCurrency = async (buyAmount) => {
        console.info('Buy with Native Currency');
        try {
            const amountInWei = parseEther(buyAmount.toString());

            const refferId = (refID as Address) ?? zeroAddress;

            setTx(Tx.Pending);
            const {
                write: { buyToken },
                estimateGas: { buyToken: buyTokenGas },
            } = launchpadContract;

            const estimationGas = await buyTokenGas([amountInWei, refferId], {
                value: parseUnits(buyAmount.toString(), 18),
            });

            const hash = await buyToken([amountInWei, refferId], {
                value: parseUnits(buyAmount.toString(), 18),
                gas: estimationGas || DefaultGasLimit,
            });

            setTx(Tx.Processing);

            await waitForTransaction({ hash, chainId });
            reset();
        } catch (e: any) {
            console.error('Error submitting form:', e);
            toast.error(
                <DescriptionWithTx
                    title={e.name || 'error'}
                    description={e ? e.shortMessage : e || 'Something went wrong'}
                />,
            );
        } finally {
            refetchFairLaunchDetail();

            setTx(Tx.Idle);
        }
    };

    const approveToken = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setTx(Tx.Pending);
        try {
            const { hash } = await approveExactAmount();
            setTx(Tx.Processing);
            await waitForTransaction({ hash, chainId });
        } catch (e: any) {
            console.error('Error Approving Token', e);
            toast.error(
                <DescriptionWithTx
                    title={e.name || 'error'}
                    description={e ? e.shortMessage : e || 'Token Approval Error'}
                />,
            );
        } finally {
            setTx(Tx.Idle);
        }
    };

    const onSubmit = (data) => {
        const { buyAmount } = data;
        if (isNativeFundToken) {
            buyWithNativeCurrency(buyAmount);
        } else {
            buyWithToken(buyAmount);
        }
    };

    const claimNow = async (claimType) => {
        try {
            setTxClaim(Tx.Pending);

            let hash;
            hash = await launchpadContract.write.claimTokens({});
            await waitForTransaction({ hash, chainId });
            setTxClaim(Tx.Processing);
            // refetchAll();
        } catch (error: any) {
            console.error(error);
            toast.error(
                <DescriptionWithTx
                    title={error.name || 'Error'}
                    description={error.shortMessage || 'ClaimToken Error'}
                />,
            );
        } finally {
            refetchFairLaunchDetail();
            setTxClaim(Tx.Idle);
        }
    };

    const refund = async () => {
        try {
            setTxClaim(Tx.Pending);
            let hash;
            hash = await launchpadContract.write.claimUserRefund({});
            await waitForTransaction({ hash, chainId });
            setTxClaim(Tx.Processing);
            // refetch();
        } catch (error: any) {
            console.error(error);
            toast.error(
                <DescriptionWithTx
                    title={error.name || 'Error'}
                    description={error.shortMessage || 'ClaimToken Error'}
                />,
            );
        } finally {
            refetchFairLaunchDetail();
            setTxClaim(Tx.Idle);
        }
    };

    const canRefund = useMemo(() => {
        const refund =
            (moment().isSameOrAfter(endTimeMoment) && totalRaisedNum < softCapNum) ||
            currentLaunchpadStatus === LaunchpadSaleStatus.CANCELLED;
        return refund;
    }, [currentLaunchpadStatus, endTimeMoment, softCapNum, totalRaisedNum, address]);

    const saleStatus = getStatusString(currentLaunchpadStatus, hasStarted, hasEnded);

    return (
        <>
            {loading ? (
                <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={370}
                    sx={{ width: '100%', borderRadius: '15px' }}
                />
            ) : (
                <PrimaryCard py={25}>
                    <>
                        <Infobar
                            dismissable={false}
                            message="Make sure the website is gemlaunch.io"
                            open={true}
                            variant="info"
                        />
                    </>

                    {
                        <SaleStatusInfo
                            hasEnded={hasEnded}
                            hasStarted={hasStarted}
                            counterStart={counterStart}
                            counterEnd={counterEnd}
                        />
                    }

                    {/* <Timer /> */}

                    <Box sx={{ mt: '10px' }}>
                        <LinearProgressCustom
                            bgColor="#BFFFD5"
                            value={getProgress(totalRaisedNum, totalRaisedNum * 2)}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '10px',
                                marginTop: '3px',
                            }}
                        >
                            <Typography variant="h5" fontSize={12}>
                                {totalRaisedNum} {fundTokenSymbol}
                            </Typography>
                            <Typography fontSize={12}>
                                {/* hardcap */}
                                {formatUnits(softCap ?? 0n, fundTokenDecimals ?? 18)}{' '}
                                {fundTokenSymbol ?? 'ETH'}
                            </Typography>
                        </Box>
                    </Box>

                    {hasEnded ? null : (
                        <Box sx={{ mt: '20px' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography fontSize={12} fontWeight={600} mb={1}>
                                    Max: {remainingBuyLimit} {fundTokenSymbol ?? 'ETH'}
                                </Typography>
                                <Typography fontSize={12} fontWeight={600} mb={1}>
                                    Bal: {Number(token?.formatted).toFixed(2)} {token?.symbol}
                                </Typography>
                            </Box>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Controller
                                    name="buyAmount"
                                    control={control}
                                    render={({ field }) => {
                                        return (
                                            <TextField
                                                // label='buyAmount'
                                                {...field}
                                                sx={{
                                                    'input::-webkit-outer-spin-button': {
                                                        display: 'none',
                                                    },
                                                    'input::-webkit-inner-spin-button': {
                                                        display: 'none',
                                                    },
                                                }} // remove the icon at the end of the input
                                                type="number"
                                                placeholder="0.0"
                                                onChange={async (e) => {
                                                    field.onChange(e.target.value);
                                                    await trigger('buyAmount');
                                                }}
                                                onWheel={disableScroll}
                                                fullWidth
                                                error={!!errors?.buyAmount}
                                                disabled={hasBuyAmountReached}
                                                helperText={
                                                    <Typography
                                                        fontSize={12}
                                                        fontWeight={500}
                                                        sx={{ color: '#f25a67' }}
                                                    >
                                                        {errors?.buyAmount?.message}
                                                    </Typography>
                                                }
                                                InputProps={{
                                                    readOnly: !saleActive() ?? true,
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Button
                                                                variant="text"
                                                                sx={{ px: '16px' }}
                                                                disabled={hasBuyAmountReached}
                                                                onClick={async (e) => {
                                                                    e.preventDefault();
                                                                    setValue(
                                                                        'buyAmount',
                                                                        remainingBuyLimit ?? 0,
                                                                    );
                                                                    await trigger('buyAmount');
                                                                }}
                                                            >
                                                                MAX
                                                            </Button>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        );
                                    }}
                                />

                                {/* {buyAmount
                                // && !hasBuyAmountReached
                                ?
                                (
                                    <Typography fontSize="12px" color="#11B6DB">
                                        You will receive {tokenToReceive}
                                    </Typography>
                                ) : null} */}
                                {isNativeFundToken ? (
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        size="small"
                                        disabled={disablePreSaleButton}
                                        sx={{ width: '100%', mt: 1 }}
                                    >
                                        {isIdle && `Buy with ${fundTokenSymbol}`}
                                        {isPending && <ButtonLoader text="Pending" />}
                                        {isProcessing && <ButtonLoader text="Processing" />}
                                    </Button>
                                ) : (
                                    <>
                                        {approvalState === ApprovalState.APPROVED && (
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                size="small"
                                                disabled={disablePreSaleButton}
                                                sx={{ width: '100%', mt: 1 }}
                                            >
                                                {isIdle && `Buy with ${fundTokenSymbol}`}
                                                {isPending && <ButtonLoader text="Pending" />}
                                                {isProcessing && <ButtonLoader text="Processing" />}
                                            </Button>
                                        )}
                                        {approvalState !== ApprovalState.APPROVED && (
                                            <Button
                                                variant="contained"
                                                onClick={(e) => approveToken(e)}
                                                size="small"
                                                disabled={disablePreSaleButton}
                                                sx={{ width: '100%', mt: 1 }}
                                            >
                                                {isIdle && `Approve`}
                                                {isPending && <ButtonLoader text="Pending" />}
                                                {isProcessing && <ButtonLoader text="Processing" />}
                                            </Button>
                                        )}
                                    </>
                                )}
                            </form>
                        </Box>
                    )}

                    {hasEnded && (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    width: '100%',
                                    mt: 2,
                                }}
                            >
                                {totalRaisedNum < softCapNum ? null : (
                                    <Button
                                        variant="outlined"
                                        onClick={() => claimNow(ClaimType.TOKEN)}
                                        disabled={
                                            isClaimPending ||
                                            isClaimProcessing ||
                                            userClaimed > 0n ||
                                            hasUserClaimedAllToken
                                        }
                                        size="small"
                                        sx={{ width: '100%', marginBottom: '5px' }}
                                    >
                                        {hasUserClaimedAllToken
                                            ? 'Claimed'
                                            : isClaimIdle
                                                ? `Claim ${tokenToReceive}`
                                                : null}
                                        {isClaimPending && <ButtonLoader text="Pending..." />}
                                        {isClaimProcessing && <ButtonLoader text="Processing..." />}
                                    </Button>
                                )}

                                {canRefund && userInvest > 0n && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => refund()}
                                        disabled={isClaimPending || isClaimProcessing || userInvest === 0n}
                                        size="small"
                                        sx={{ width: '100%' }}
                                    >
                                        {isClaimIdle &&
                                            `Refund (${userInvestment} ${fundTokenSymbol}) `}
                                        {isClaimPending && <ButtonLoader text="Pending..." />}
                                        {isClaimProcessing && <ButtonLoader text="Processing..." />}
                                    </Button>
                                )}
                            </Box>
                        </>
                    )}

                    {isSaleCanceled && (
                        <Box
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            mt={1}
                        >
                            <Typography>This pool has {saleStatus}</Typography>
                        </Box>
                    )}
                </PrimaryCard>
            )}
        </>
    );
};

export default FairLaunchPreSaleTimer;
