import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import LockInfo from '../TokenSlug/LockInfo';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers';
import ButtonLoader from '../ButtonLoader/ButtonLoader';
import { EditLockProps, ILockerFormInput, Tx } from './types';
import { LOCKER_VALIDATION } from './validation';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import { waitForTransaction } from 'wagmi/actions';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { yupResolver } from '@hookform/resolvers/yup';
import { useToken } from '@/hooks/Tokens';
import tryParseAmount from '@dapp/utils/tryParseAmount';
import { DefaultGasLimit, LOCKER_CONTRACT_ADDRESSES } from '@/constants';
import { ApprovalState, useApproveCallback } from '@/hooks/useApproveCallback';
import { Address, formatUnits, parseUnits } from 'viem';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { useLockerContract } from '@/hooks/useContract';
import { disableScroll } from '@/utils/disableScroll';
import { useRouter } from 'next/navigation';

import utc from 'dayjs/plugin/utc'; // Enable UTC plugin

dayjs.extend(utc);

const EditLock: React.FC<EditLockProps> = ({
    record,
    tokenDecimals,
    tokenBalance,
    normalTokenData,
    pairTokenData,
    refetch,
}) => {
    const [_amount, _setAmount] = React.useState(0);
    const [tx, setTx] = React.useState(Tx.IDLE);
    const { chainId } = useActiveChainId();
    const router = useRouter();

    const {
        amount: amountLocked,
        cycleShare,
        depositDate,
        id: lockId,
        interval,
        owner,
        status,
        tge,
        token,
        unlockDate,
        title,
    } = record || {};

    const lockedAmount = +formatUnits(amountLocked ?? 0n, token?.decimals);
    const newTokenBalance = +tokenBalance + lockedAmount;

    const {
        control,
        setValue,
        watch,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ILockerFormInput>({
        mode: 'onChange',
        defaultValues: {
            amount: undefined,
            cycle: undefined,
            cycleRelease: undefined,
            isVestingActive: undefined,
            TGE: undefined,
            timeUTC: undefined,
        },
        resolver: yupResolver(LOCKER_VALIDATION(lockedAmount, +newTokenBalance, _amount)) as any,
        context: {
            _amount,
        },
    });
    const amount = watch('amount');

    React.useEffect(() => {
        if (record) {
            setValue(
                'amount',
                lockedAmount,
                // { shouldValidate: true },
            );
            setValue(
                'timeUTC',
                dayjs(unlockDate),
                // { shouldValidate: true },
            );
        }
    }, [lockedAmount, record, setValue, token?.decimals, unlockDate]);

    // handle max
    const handleMax = () => {
        const value = +newTokenBalance;
        setValue('amount', Number(value), { shouldValidate: true });
    };

    const lockerContract = useLockerContract(LOCKER_CONTRACT_ADDRESSES[chainId] as Address);
    const tokenCurrency = useToken(record?.token?.id as Address);
    const parsedAmount = tryParseAmount(amount?.toString(), tokenCurrency);
    const { approvalState, approveCallback, currentAllowance } = useApproveCallback(
        parsedAmount,
        LOCKER_CONTRACT_ADDRESSES[chainId],
    );
    const currentAllowanceAvailable = +currentAllowance?.toExact();

    const handleApprove = async (e) => {
        e.preventDefault();
        setTx(Tx.WAITING);
        try {
            const { hash } = await approveCallback(); // It will show the toaster notification internally
            setTx(Tx.PROCESSING);
            await waitForTransaction({ hash, chainId });
            // toast.success(<DescriptionWithTx title="Success" txHash={hash} txChainId={chainId} />);
        } catch (e: any) {
            console.error(encodeURI);
            toast.error(
                <DescriptionWithTx
                    title={e.name ?? 'Error'}
                    description={e.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTx(Tx.IDLE);
        }
    };

    const onSubmit: SubmitHandler<ILockerFormInput> = async (data) => {
        setTx(Tx.WAITING);
        const { amount, timeUTC } = data;

        try {
            const estimatedGas = await lockerContract.estimateGas.editLock(
                [
                    BigInt(record?.id),
                    parseUnits(amount.toString(), Number(tokenDecimals)),
                    BigInt(dayjs.utc(String(timeUTC)).unix()),
                ],
                {} as never,
            );
            const hash = await lockerContract.write.editLock(
                [
                    BigInt(record?.id),
                    parseUnits(amount.toString(), Number(tokenDecimals)),
                    BigInt(dayjs.utc(String(timeUTC)).unix()),
                ],
                { gas: estimatedGas || DefaultGasLimit },
            );
            setTx(Tx.PROCESSING);
            await waitForTransaction({ hash, chainId });
            toast.success(<DescriptionWithTx title="Success" description="Lock Edited!" />);
            // addTransaction({ type: 'lock-extended', hash });
            router.back();
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e?.name ?? 'Error'}
                    description={e?.shortMessage ?? 'Something went wrong!'}
                />,
            );
        } finally {
            setTx(Tx.IDLE);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mt: '36px' }}>
                <Typography variant="h5" fontSize={20} sx={{ ml: '30px', mb: '9px' }}>
                    Edit Your Lock
                </Typography>

                <PrimaryCard py={30}>
                    <LockInfo
                        data={record?.token?.isLiquidityToken ? pairTokenData : normalTokenData}
                        title="Token Info"
                        refetch={refetch}
                    />

                    {/* Amount */}
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
                                        <>
                                            <Typography fontSize={12} color="common.blue">
                                                New amount must be not less than current amount
                                            </Typography>
                                            <Typography variant="body2">
                                                {errors?.amount?.message}
                                            </Typography>
                                        </>
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button
                                                    variant="text"
                                                    sx={{ px: '16px' }}
                                                    onClick={handleMax}
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

                    {/* *** IS_VESTING_ACTIVE *** */}
                    <Box>
                        <Controller
                            name="isVestingActive"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    {...field}
                                    sx={{
                                        ml: '6px',
                                        mb: '24px',
                                        mt: '10px',
                                    }}
                                    control={
                                        <Checkbox
                                            disabled
                                            checked={!!record?.tge}
                                            sx={{
                                                color: '#fff',
                                                '&.Mui-disabled': {
                                                    color: '#3232321',
                                                },
                                            }}
                                        />
                                    }
                                    label="use vesting?"
                                />
                            )}
                        />
                    </Box>

                    {/* *** VESTING DETAILS AND UNLOCK_TIME *** */}
                    <Box
                        sx={{
                            display: 'grid',
                            gap: '20px',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: record?.tge ? 'repeat(2, 1fr)' : '1fr',
                            },
                        }}
                    >
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="h5" ml={2} mb={'9px'}>
                                Lock Until (UTC time) <span style={{ color: '#FF8484' }}>*</span>
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
                                        // defaultValue={dayjs(record?.unlockDate)}
                                        sx={{ width: '100%' }}
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
                            {record?.tge && (
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="h5" sx={{ mb: '9px' }} ml={2}>
                                        TGE Percent <span style={{ color: '#FF8484' }}>*</span>
                                    </Typography>
                                    <Controller
                                        name="TGE"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="number"
                                                onWheel={disableScroll}
                                                defaultValue={Number(record?.tge) / 1e2}
                                                fullWidth
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        )}
                                    />
                                </Box>
                            )}
                        </Box>
                        <Box>
                            {record?.tge && (
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
                                                onWheel={disableScroll}
                                                {...field}
                                                value={Number(record?.interval) / 60}
                                                placeholder="Ex: 10"
                                                fullWidth
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        )}
                                    />
                                </Box>
                            )}
                        </Box>
                        <Box>
                            {record?.tge && (
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
                                                onWheel={disableScroll}
                                                {...field}
                                                value={Number(record?.cycleShare) / 1e2}
                                                placeholder="Ex: 10"
                                                fullWidth
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />
                                        )}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '30px' }}>
                        {approvalState !== ApprovalState.APPROVED &&
                        amount > lockedAmount &&
                        amount > currentAllowanceAvailable + lockedAmount ? (
                            <Button
                                disabled={tx !== Tx.IDLE || amount > newTokenBalance}
                                onClick={handleApprove}
                                variant="contained"
                                size="large"
                                sx={{ width: { xs: '100%', md: 'auto' } }}
                            >
                                {tx === Tx.IDLE && 'Approve'}
                                {tx === Tx.WAITING && <ButtonLoader text="Approving" />}
                                {tx === Tx.PROCESSING && <ButtonLoader text="Processing" />}
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                variant="contained"
                                size="large"
                                sx={{ width: { xs: '100%', md: 'auto' } }}
                            >
                                {tx === Tx.IDLE && 'Lock'}
                                {tx === Tx.WAITING && <ButtonLoader text="Locking" />}
                                {tx === Tx.PROCESSING && <ButtonLoader text="Processing" />}
                            </Button>
                        )}
                    </Box>
                </PrimaryCard>
            </Box>
        </form>
    );
};

export default EditLock;
