import React, { useMemo } from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import { Status } from '@/components/ExploreAirdrops/StatusChip';
import { Box, Button, InputAdornment, Skeleton, TextField, Typography } from '@mui/material';
import LinearProgressCustom from '../LinearProgress/LinearProgressCustom';
import { Controller, useForm } from 'react-hook-form';
import Timer from '../ExploreAirdrops/Timer';
import { disableScroll } from '@/utils/disableScroll';
import CountdownTimer from '../CountdownTimer';
import Infobar from '../Infobar/Infobar';
import dayjs from 'dayjs';
import { useLaunchpadContract } from '@/hooks/useContract';
import { useAccount, useBalance, useContractRead, useContractReads, useContractWrite } from 'wagmi';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import { useSingleCallResult } from '@/state/multicall/hooks';
import useTokenDetails from '@/hooks/useTokenDetails';
import useTokenInformation from '@/hooks/useTokenInformation';
import { Address, formatEther, formatUnits, parseEther, parseUnits, zeroAddress } from 'viem';
import { LAUNCHPAD_TOKEN_BUY } from './formValidation';
import { yupResolver } from '@hookform/resolvers/yup';
import { ClaimType, LaunchpadSaleStatus, Tx } from './types';
import { DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import moment from 'moment';
import { useSearchParams } from 'next/navigation';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import toast from 'react-hot-toast';
import ButtonLoader from '../ButtonLoader/ButtonLoader';
import { getProgress } from '@/utils/getProgress';
import { calculateRemainingBuyLimit, formatBigUnits, getStatusString } from './utils';
import useLaunchpadUserInfo from './hooks/useLaunchpadUserInfo';
import BigNumber from 'bignumber.js';
import { LaunchpadABI } from '@/config/abi/launchpad';
import useFundTokenDetails from './hooks/useFundTokenDetails';
import useTokenAllowance from '@/hooks/useTokenAllowance';
import tryParseAmount from '@dapp/utils/tryParseAmount';
import { ApprovalState, useApproveCallback } from '@/hooks/useApproveCallback';
import { useToken } from '@/hooks/Tokens';
import useLaunchpadDetails from './hooks/useLaunchpadDetails';
import useFundTokenAllowance from './hooks/useFundTokenAllowance';
import useLaunchpadRewardInfo from './hooks/launchpadHooks/useLaunchpadRewardInfo';
import useLaunchpadVestingDetails from './hooks/useLaunchpadVesting';
import SaleStatusInfo from './component/SaleStatusInfo';
import useForceUpdate from '@/hooks/useForceUpdate';

type FormValues = {
    buyAmount: number;
};

const PreSaleTimer = ({ launchpadAddress }: { launchpadAddress: Address }) => {
    const [tx, setTx] = React.useState<Tx>(Tx.Idle);
    const [txClaim, setTxClaim] = React.useState<Tx>(Tx.Idle);
    const [txRefundToken, setTxRefundToken] = React.useState<Tx>(Tx.Idle);
    const { chainId } = useActiveChainId();
    const searchParams = useSearchParams();
    const { address, isReconnecting } = useAccount();

    // const { data: walletBalance, error: walletError } = useBalance({
    //     address
    // });
    const refID = searchParams.get('refId');

    const {
        launchpadContract,
        maxBuyLimit,
        minBuyLimit,
        tokenDecimals,
        hasStarted,
        hasEnded,
        saleActive,
        counterStart,
        counterEnd,
        softCap,
        hardCap,
        softCapNum,
        hardCapNum,
        totalRaisedNum,
        currentLaunchpadStatus,
        listingPrice,
        sellPrice,
        symbol,
        isLoading,
        endTimeMoment,
        currentSaleMode,
        // claimTime,
    } = useLaunchpadDetails(launchpadAddress);

    const maxLimit = maxBuyLimit;

    const {
        userInfo,
        isLoading: userInfoLoading,
        error,
    } = useLaunchpadUserInfo(launchpadContract);
    const { userInvest, userCalimed, intervalClaimed, lastClaimTime } = userInfo;


    const {
        fundTokenDecimals,
        fundTokenSymbol,
        isNative: isNativeFundToken,
        fundTokenAddress,
        balance,
    } = useFundTokenDetails(launchpadAddress);

    const { data: token } = useBalance({
        address,
        token: fundTokenAddress !== zeroAddress ? (fundTokenAddress as Address) : undefined,
        watch: true,
    });

    const userFundTokenBalance = +formatUnits(token?.value ?? 0n, token?.decimals ?? 18);

    // const userFundTokenBalance = Number(Number(formatUnits(balance, fundTokenDecimals)).toFixed(2))

    const userInvestment = formatBigUnits(userInvest, fundTokenDecimals ?? 18);
    const minLimit = +formatUnits(minBuyLimit, fundTokenDecimals ?? 18);

    const remainingBuyLimit = calculateRemainingBuyLimit(userInvestment, maxLimit);

    console.log({
        remainingBuyLimit,
        userInvestment,
        maxLimit
    })

    const hasEnoughBalanceToBuyToken = useMemo(() => {
        return userFundTokenBalance >= remainingBuyLimit;
    }, [userFundTokenBalance, remainingBuyLimit]);

    const forceUpdate = useForceUpdate();

    const { data, refetch: refetchAll } = useContractReads({
        contracts: [
            { ...launchpadContract, functionName: 'claimTime' },
            { ...launchpadContract, functionName: 'claimableTokens' },
            { ...launchpadContract, functionName: 'getUserRemainingClaimable', args: [address] },
            { ...launchpadContract, functionName: 'getUserTokens', args: [address] },
            { ...launchpadContract, functionName: 'currentStatus' },
        ],
        watch: true,
    });

    const claimTime = data?.[0].result ?? 0n;
    const claimableTokens = data?.[1].result ?? 0n;
    const userRemainingClaimable = data?.[2].result ?? 0n;
    const userToken = data?.[3].result ?? 0n;
    const saleStatusResult = data?.[4].result ?? 0n

    const userTokens = +formatUnits(userToken, fundTokenDecimals);
    const claimableToken = +formatUnits(userRemainingClaimable, tokenDecimals);
    const claimedToken = +formatUnits(userCalimed, tokenDecimals);

    const isSaleActive = currentLaunchpadStatus === LaunchpadSaleStatus.ACTIVE;
    const isSaleCanceled = currentLaunchpadStatus === LaunchpadSaleStatus.CANCELLED;
    const isSaleClosed = currentLaunchpadStatus === LaunchpadSaleStatus.CLOSED;

    const isPoolClosed = saleStatusResult === LaunchpadSaleStatus.CLOSED // current status not finalize 

    console.log({
        isSaleClosed
    })
    const {
        rewardInfo: { rewardShare },
    } = useLaunchpadRewardInfo(launchpadAddress);

    const { vesting } = useLaunchpadVestingDetails(launchpadAddress);


    // (block.timestamp - user.lastClaimTime) >= vesting.cycleInterval,

    const currentTime = moment();
    const userLastClaimTime = moment(Number(lastClaimTime));
    const timeDifferenceSeconds = currentTime.diff(userLastClaimTime, 'seconds');
    const isTokenUnlocked = timeDifferenceSeconds >= Number(vesting.cycleInterval);



    console.log({
        isTokenUnlocked
    })
    // const remainingSoftCap = hardCapNum - totalRaisedNum;

    const loading = isLoading && userInfoLoading;

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
        resolver: yupResolver(LAUNCHPAD_TOKEN_BUY(minLimit, remainingBuyLimit)) as any,
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

    // const tokenToReceive = `${buyAmount * Number(formatUnits(listingPrice, tokenDecimals ?? 18))
    //     } ${symbol}`;

    const tokenToReceive = `${buyAmount * Number(formatUnits(sellPrice, tokenDecimals ?? 18))
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
            refetchAll();
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
            refetchAll();
            setTx(Tx.Idle);
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
            refetchAll();
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
            refetchAll();
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

    const claimNow = async () => {
        try {
            setTxClaim(Tx.Pending);

            let hash;
            hash = await launchpadContract.write.claimTokens({});
            await waitForTransaction({ hash, chainId });
            setTxClaim(Tx.Processing);
            refetchAll();
        } catch (error: any) {
            console.error(error);
            toast.error(
                <DescriptionWithTx
                    title={error.name || 'Error'}
                    description={error.shortMessage || 'ClaimToken Error'}
                />,
            );
        } finally {
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
        } catch (error: any) {
            console.error(error);
            toast.error(
                <DescriptionWithTx
                    title={error.name || 'Error'}
                    description={error.shortMessage || 'ClaimToken Error'}
                />,
            );
        } finally {
            setTxClaim(Tx.Idle);
        }
    };

    const softCapNotReached = totalRaisedNum < softCapNum


    const canRefund = useMemo(() => {
        const refund =
            (moment().isSameOrAfter(endTimeMoment) && totalRaisedNum < softCapNum) ||
            currentLaunchpadStatus === LaunchpadSaleStatus.CANCELLED;
        return refund;
    }, [currentLaunchpadStatus, endTimeMoment, softCapNum, totalRaisedNum]);

    const saleStatus = getStatusString(currentLaunchpadStatus, hasStarted, hasEnded);

    // if vesting disable then user can claim all the token in a single time.
    const canClaimWithoutVesting = userRemainingClaimable === 0n && !vesting.isVestingEnable;

    React.useEffect(() => {
        refetchAll();
        forceUpdate();
    }, [address, isReconnecting, refetchAll, forceUpdate]);

    return (
        <>
            {
                loading ? <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={370}
                    sx={{ width: '100%', borderRadius: '15px' }}
                /> : <PrimaryCard py={25}>
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
                            value={getProgress(totalRaisedNum, hardCapNum)}
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
                                {formatUnits(hardCap, fundTokenDecimals ?? 18)}{' '}
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

                                {buyAmount && !hasBuyAmountReached ? (
                                    <Typography fontSize="12px" color="#11B6DB">
                                        You will receive {tokenToReceive}
                                    </Typography>
                                ) : null}

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
                                {totalRaisedNum < softCapNum ? null : vesting?.isVestingEnable ? (
                                    <Button
                                        variant="outlined"
                                        onClick={() => claimNow()}
                                        disabled={
                                            isClaimPending ||
                                            isClaimProcessing ||
                                            canClaimWithoutVesting ||
                                            userRemainingClaimable === 0n || !isTokenUnlocked ||
                                            !isPoolClosed
                                        }
                                        size="small"
                                        sx={{ width: '100%', marginBottom: '5px' }}
                                    >
                                        {isClaimIdle &&
                                            ` ${claimableToken === 0 ? 'Claimed' : !isPoolClosed ? "Pool not finalized" : `Claim  (${claimedToken}/${userTokens}) ${symbol}`}`}
                                        {isClaimPending && <ButtonLoader text="Pending..." />}
                                        {isClaimProcessing && <ButtonLoader text="Processing..." />}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        onClick={() => claimNow()}
                                        disabled={
                                            isClaimPending ||
                                            isClaimProcessing ||
                                            canClaimWithoutVesting ||
                                            userRemainingClaimable === 0n ||
                                            !isPoolClosed
                                        }
                                        size="small"
                                        sx={{ width: '100%', marginBottom: '5px' }}
                                    >
                                        {isClaimIdle &&
                                            ` ${claimableToken === 0 ? 'Claimed' : !isPoolClosed ? "Pool not finalized" : `Claim`}`}
                                        {isClaimPending && <ButtonLoader text="Pending..." />}
                                        {isClaimProcessing && <ButtonLoader text="Processing..." />}
                                    </Button>
                                )}

                                {canRefund && userInvest > 0n && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => refund()}
                                        disabled={isClaimPending || isClaimProcessing}
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

                    {softCapNotReached && hasEnded && (
                        <Box
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            mt={1}
                        >
                            <Typography>This pool has Failed</Typography>
                        </Box>
                    )}

                    {isSaleClosed && !softCapNotReached && (
                        <Box
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            mt={1}
                        >
                            <Typography>This pool has {saleStatus}</Typography>
                        </Box>
                    )}

                </PrimaryCard>
            }

        </>
    );
};

export default PreSaleTimer;
