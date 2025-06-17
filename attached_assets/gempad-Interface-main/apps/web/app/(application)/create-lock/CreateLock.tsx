'use client';

import ApprovalButton from '@/components/ApprovalButton/ApprovalButton';
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
import PrimaryCard from '@/components/Cards/PrimaryCard';
import { client } from '@/components/Provider/ChainApolloProvider';
import { TransactionTrackingContext } from '@/components/Provider/TransactionTrackingProvider';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import WalletConnectButton from '@/components/WalletConnectButton/WalletConnectButton';
import { LOCKER_CONTRACT_ADDRESSES } from '@/constants';
import { useToken } from '@/hooks/Tokens';
import { ApprovalState, useApproveCallback } from '@/hooks/useApproveCallback';
import { useLockerContract } from '@/hooks/useContract';
import useTokenDetails from '@/hooks/useTokenDetails';
import { CHECK_STATUS } from '@/query/checkStatus';
import { dateToUnix } from '@/utils';
import { disableScroll } from '@/utils/disableScroll';
import { isLiquidityTokenValid } from '@/utils/isLiquidityTokenValid';
import { useMutation } from '@apollo/client';
import tryParseAmount from '@dapp/utils/tryParseAmount';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Button,
    Checkbox,
    Collapse,
    FormControlLabel,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Address, parseUnits } from 'viem';
import { useAccount, useNetwork } from 'wagmi';
import { waitForTransaction } from 'wagmi/actions';
import { CREATE_LOCK_DEFAULTS } from './constants';
import { ADD_TITLE } from './query';
import { CreateLockFormInput, LockerArgs, Transaction, VestingArgs } from './types';
import { CREATE_LOCK_VALIDATION } from './validation';
import Infobar from '@/components/Infobar/Infobar';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Enable UTC plugin

dayjs.extend(utc);

const CreateLock = () => {
    const { address } = useAccount();
    const router = useRouter();
    const { chain } = useNetwork();
    const chainId = chain?.id;

    const [_amount, _setAmount] = React.useState<number>(0);
    const [transaction, setTransaction] = React.useState(Transaction.IDLE);
    const { addTransaction } = useContext(TransactionTrackingContext);

    const [addTitleToLock] = useMutation(ADD_TITLE, {
        client,
    });

    const [checkStatus] = useMutation(CHECK_STATUS, {
        client,
    });

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateLockFormInput>({
        mode: 'onChange',
        defaultValues: CREATE_LOCK_DEFAULTS,
        resolver: yupResolver(CREATE_LOCK_VALIDATION) as any,
        context: {
            _amount,
        },
    });

    // read realtime form values
    const isAnotherOwner = watch('isAnotherOwner');
    const isVestingActive = watch('isVestingActive');
    const tokenAddress = watch('tokenAddress');
    const amount = watch('amount');
    const timeUTC = watch('timeUTC');

    const {
        state: { isFetching, tokenDetails },
    } = useTokenDetails(tokenAddress);
    const isTokenDetailsAvailable = !!tokenDetails;

    const lockerContract = useLockerContract(LOCKER_CONTRACT_ADDRESSES[chain?.id] as Address);

    const tokenName = tokenDetails?.[0]?.value || '';
    const tokenBalance: number | string = tokenDetails?.[3]?.value || 0;
    const tokenDecimals: number | string = tokenDetails?.[2]?.value || 0;

    React.useEffect(() => {
        // this will set a state that will go into yup context to validate max() amount
        _setAmount(Number(tokenBalance));
    }, [amount, isTokenDetailsAvailable, tokenDetails, tokenBalance]);

    // isAllowenceAvailable
    const tokenCurrency = useToken(tokenAddress);
    const parsedAmount = tryParseAmount(amount?.toString(), tokenCurrency);
    const { approvalState, approveCallback } = useApproveCallback(
        parsedAmount,
        LOCKER_CONTRACT_ADDRESSES[chain?.id],
    );

    const handleMax = () => {
        const value = tokenBalance;
        setValue('amount', Number(value), { shouldValidate: true });
    };

    const handleApprove = async (e) => {
        e.preventDefault();
        setTransaction(Transaction.WAITING);
        try {
            const { hash } = await approveCallback(); // It will show the toaster notification internally
            setTransaction(Transaction.PROCESSING);
            await waitForTransaction({ hash, chainId });
        } catch (error: any) {
            console.error(error);
            toast.error(
                <DescriptionWithTx
                    title="Error"
                    description={error.shortMessage || 'something went wrong'}
                />,
            );
        } finally {
            setTransaction(Transaction.IDLE);
        }
    };

    const onSubmit: SubmitHandler<CreateLockFormInput> = async (data) => {
        try {
            setTransaction(Transaction.WAITING);
            const res = await checkStatus();
            if (!res) throw new Error('Server is not available!');

            const { ownerAddress, tokenAddress, amount, timeUTC, title, TGE, cycle, cycleRelease } =
                data;

            const isLiquidityToken = await isLiquidityTokenValid(tokenAddress);

            const lockArgs: LockerArgs = [
                ownerAddress ? ownerAddress : address,
                tokenAddress,
                isLiquidityToken,
                parseUnits(amount.toString(), Number(tokenDecimals)),
                BigInt(dayjs.utc(String(timeUTC)).unix()),
                title,
            ];

            const vestingArgs: VestingArgs = [
                ownerAddress ? ownerAddress : address,
                tokenAddress,
                isLiquidityToken,
                parseUnits(amount.toString(), Number(tokenDecimals)),
                BigInt(dayjs.utc(String(timeUTC)).unix()),
                BigInt(TGE ? TGE * 1e2 : 0),
                BigInt(cycle ? cycle * 60 : 0), // convert the interval inro seconds
                BigInt(cycleRelease ? cycleRelease * 1e2 : 0),
                title,
            ];

            const msg = isVestingActive ? 'Lock Vested' : 'Tokens Locked';
            let hash = '' as Address;
            if (isVestingActive) {
                const estimatedGas = await lockerContract.estimateGas.vestingLock(
                    [...vestingArgs],
                    {} as never,
                );
                hash = await lockerContract.write.vestingLock([...vestingArgs], {
                    gas: estimatedGas,
                } as never);
            } else {
                const estimatedGas = await lockerContract.estimateGas.lock(
                    [...lockArgs],
                    {} as never,
                );
                hash = await lockerContract.write.lock([...lockArgs], {
                    gas: estimatedGas,
                } as never);
            }

            setTransaction(Transaction.PROCESSING);

            if (isVestingActive) {
                addTransaction({ type: 'vest-added', hash });
            } else {
                addTransaction({ type: 'lock-added', hash });
            }

            await addTitleToLock({
                variables: {
                    txHash: hash,
                    title: title || tokenName?.toString(),
                },
            });

            const receipt = await waitForTransaction({
                hash,
                chainId,
            });

            const recordId = +receipt?.logs?.[receipt.logs.length - 1]?.topics?.[1];

            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description={msg}
                    txChainId={chainId}
                    txHash={hash}
                />,
            );

            router.push(`/record/${recordId}`);
        } catch (error: any) {
            console.error({ error });
            toast.error(
                <DescriptionWithTx
                    title="Error"
                    description={error?.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTransaction(Transaction.IDLE);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mt: '36px' }}>
                <Typography variant="h5" fontSize={20} sx={{ ml: '30px', mb: '9px' }}>
                    Create Lock
                </Typography>

                <PrimaryCard py={30}>
                    {/* *** TOKEN_ADDRESS *** */}
                    <Box>
                        <Typography
                            variant="body1"
                            sx={{ mb: '9px', color: '#FF8484' }}
                            ml={2}
                            fontSize={12}
                        >
                            (*) is required field.
                        </Typography>
                        <Typography variant="h5" sx={{ mb: '9px' }} ml={2}>
                            Token or LP Token address <span style={{ color: '#FF8484' }}>*</span>
                        </Typography>
                        <Controller
                            name="tokenAddress"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    placeholder="Enter token or LP token address"
                                    fullWidth
                                    error={!!errors?.tokenAddress}
                                    helperText={
                                        <Typography variant="body2">
                                            {errors?.tokenAddress?.message}
                                        </Typography>
                                    }
                                />
                            )}
                        />
                    </Box>

                    <Box sx={{ mt: 1 }}>
                        {isFetching && (
                            <Box sx={{ width: '100%' }}>
                                <Skeleton
                                    variant="rounded"
                                    animation="wave"
                                    height={150}
                                    sx={{ width: '100%', borderRadius: '15px' }}
                                />
                            </Box>
                        )}
                        {isTokenDetailsAvailable && (
                            <PrimaryCard mb={26}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                        mb: 2,
                                    }}
                                >
                                    {tokenDetails.map(({ id, property, value }) => (
                                        <Box
                                            key={id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Typography variant="h5" fontSize={14}>
                                                {property}
                                            </Typography>
                                            <Typography variant="h5" fontSize={14}>
                                                {value}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </PrimaryCard>
                        )}
                    </Box>

                    <Box>
                        <Controller
                            name="isAnotherOwner"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    {...field}
                                    sx={{ ml: '6px', mb: '14px', mt: '10px' }}
                                    value="use another owner ?"
                                    control={<Checkbox sx={{ color: '#fff' }} />}
                                    label="Use Another Owner ?"
                                />
                            )}
                        />
                    </Box>

                    <Collapse in={isAnotherOwner}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h5" sx={{ mb: '9px' }} ml={2}>
                                Owner address <span style={{ color: '#FF8484' }}>*</span>
                            </Typography>
                            <Controller
                                name="ownerAddress"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="text"
                                        placeholder="Enter owner address"
                                        fullWidth
                                        error={!!errors?.ownerAddress}
                                        helperText={
                                            <>
                                                <Typography variant="body2">
                                                    {errors?.ownerAddress?.message}
                                                </Typography>
                                                <Typography
                                                    color="primary"
                                                    fontSize="14px"
                                                    fontWeight={500}
                                                >
                                                    the address you input here will receive the
                                                    tokens once they are unlocked
                                                </Typography>
                                            </>
                                        }
                                    />
                                )}
                            />
                        </Box>
                    </Collapse>

                    <Box sx={{ mt: '10px' }}>
                        <Typography variant="h5" sx={{ mb: '9px' }} ml={2}>
                            Title
                        </Typography>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} placeholder="Ex: My Lock" fullWidth />
                            )}
                        />
                    </Box>

                    <Box sx={{ mt: '30px' }}>
                        <Typography variant="h5" sx={{ mb: '9px' }} ml={2}>
                            Amount <span style={{ color: '#FF8484' }}>*</span>
                        </Typography>
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    onWheel={disableScroll}
                                    placeholder="Enter amount"
                                    fullWidth
                                    error={!!errors?.amount}
                                    helperText={
                                        <Typography variant="body2">
                                            {errors?.amount?.message}
                                        </Typography>
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button
                                                    onClick={handleMax}
                                                    variant="text"
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
                    </Box>

                    <Box>
                        <Controller
                            name="isVestingActive"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    {...field}
                                    sx={{ ml: '6px', mb: '24px', mt: '10px' }}
                                    value="use vesting?"
                                    control={<Checkbox sx={{ color: '#fff' }} />}
                                    label="Use Vesting?"
                                />
                            )}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gap: '20px',
                            mb: 1,
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: isVestingActive ? 'repeat(2, 1fr)' : '1fr',
                            },
                        }}
                    >
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="h5" ml={2} mb={'9px'}>
                                {isVestingActive ?  'TGE Date (UTC Time)' : 'Lock Until (UTC Time)' }<span style={{ color: '#FF8484' }}>*</span>
                            </Typography>
                            <Controller
                                name="timeUTC"
                                control={control}
                                render={({
                                    field: { ref, onBlur, name, ...field },
                                    fieldState,
                                }) => (
                                    <DateTimePicker
                                        {...field}
                                        sx={{
                                            width: '100%',
                                        }}
                                        timezone="UTC"
                                        inputRef={ref}
                                        disablePast={true}
                                        slotProps={{
                                            textField: {
                                                onBlur,
                                                name,
                                                error: !!fieldState.error,
                                                helperText: fieldState?.error?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Box>
                        <Box>
                            <Collapse in={isVestingActive}>
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="h5" sx={{ mb: '9px' }} ml={2}>
                                        TGE Percent <span style={{ color: '#FF8484' }}>*</span>
                                    </Typography>
                                    <Controller
                                        name="TGE"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                type="number"
                                                {...field}
                                                onWheel={disableScroll}
                                                placeholder="Ex: 10"
                                                fullWidth
                                                error={!!errors?.TGE}
                                                helperText={
                                                    <>
                                                        <Typography variant="body2">
                                                            {errors?.TGE?.message}
                                                        </Typography>
                                                        <Typography
                                                            color="primary"
                                                            fontSize="14px"
                                                            fontWeight={500}
                                                        >
                                                            the address you input here will be
                                                            receive the tokens once they are
                                                            unlocked
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        )}
                                    />
                                </Box>
                            </Collapse>
                        </Box>
                        <Box>
                            <Collapse in={isVestingActive}>
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="h5" sx={{ mb: '9px' }} ml={2}>
                                        Cycle (minutes) <span style={{ color: '#FF8484' }}>*</span>
                                    </Typography>
                                    <Controller
                                        name="cycle"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                type="number"
                                                {...field}
                                                placeholder="Ex: 10"
                                                fullWidth
                                                onWheel={disableScroll}
                                                error={!!errors?.cycle}
                                                helperText={
                                                    <>
                                                        <Typography variant="body2">
                                                            {errors?.cycle?.message}
                                                        </Typography>
                                                        <Typography
                                                            color="primary"
                                                            fontSize="14px"
                                                            fontWeight={500}
                                                        >
                                                            the address you input here will be
                                                            receive the tokens once they are
                                                            unlocked
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        )}
                                    />
                                </Box>
                            </Collapse>
                        </Box>
                        <Box>
                            <Collapse in={isVestingActive}>
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="h5" sx={{ mb: '9px' }} ml={2}>
                                        Cycle Release Percent{' '}
                                        <span style={{ color: '#FF8484' }}>*</span>
                                    </Typography>
                                    <Controller
                                        name="cycleRelease"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                type="number"
                                                {...field}
                                                placeholder="Ex: 10"
                                                fullWidth
                                                onWheel={disableScroll}
                                                error={!!errors?.cycleRelease}
                                                helperText={
                                                    <>
                                                        <Typography variant="body2">
                                                            {errors?.cycleRelease?.message}
                                                        </Typography>
                                                        <Typography
                                                            color="primary"
                                                            fontSize="14px"
                                                            fontWeight={500}
                                                        >
                                                            the address you input here will be
                                                            receive the tokens once they are
                                                            unlocked
                                                        </Typography>
                                                    </>
                                                }
                                            />
                                        )}
                                    />
                                </Box>
                            </Collapse>
                        </Box>
                    </Box>
                    <Infobar
                        dismissable={true}
                        open={true}
                        variant="info"
                        message={`Please exclude GemLock's lockup address ${LOCKER_CONTRACT_ADDRESSES[chainId]}  from fees, rewards, max tx amount to start locking tokens. We don't support rebase tokens.`}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '30px' }}>
                        {approvalState !== ApprovalState.APPROVED ? (
                            <ApprovalButton
                                transaction={transaction}
                                handleApprove={handleApprove}
                                tokenBalance={+tokenBalance}
                                amount={+amount}
                                isTokenDetailsAvailable={isTokenDetailsAvailable}
                            />
                        ) : (
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                variant="contained"
                                size="large"
                                sx={{ width: { xs: '100%', md: 'auto' } }}
                            >
                                {transaction === Transaction.IDLE && 'Lock'}
                                {transaction === Transaction.WAITING && (
                                    <ButtonLoader text="Pending" />
                                )}
                                {transaction === Transaction.PROCESSING && (
                                    <ButtonLoader text="Processing" />
                                )}
                            </Button>
                        )}
                    </Box>
                </PrimaryCard>
            </Box>
        </form>
    );
};

export default CreateLock;
