'use client';

import React from 'react';
import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextFieldHead from '../TextField/TextFieldHead';
import { Controller, useFormContext } from 'react-hook-form';
import { LaunchpadFormInput, LaunchpadWhitelist, RefundType } from './types';
import { TokenDetails } from '@/hooks/useTokenDetails';
import useTokenInformation from '@/hooks/useTokenInformation';
import { disableScroll } from '@/utils/disableScroll';
import TextFieldError from '../TextField/TextFieldError';
import TextFieldHelper from '../TextField/TextFieldHelper';
import { DEFAULT_CHAIN_ID, ROUTERS, Router } from '@/constants';
import { Address, useNetwork } from 'wagmi';
import { getMinTokensToCreateSubscription } from '@/utils/getMinTokens';
import Infobar from '../Infobar/Infobar';
import { getMessage } from './validations';
import { SetStateAction } from 'jotai';

interface Step2SubscriptionProps {
    setIsBalanceEnough: React.Dispatch<SetStateAction<boolean>>;
    feePercentNum: number;
}

const Step2Subscription = ({ setIsBalanceEnough, feePercentNum }: Step2SubscriptionProps) => {
    const [showMessage, setShowMessage] = React.useState<boolean>();
    const { chain } = useNetwork();
    const chainId = chain?.id;
    const routers: Router[] = ROUTERS[chainId || DEFAULT_CHAIN_ID];

    const {
        watch,
        control,
        register,
        setValue,
        trigger,
        formState: { errors },
    } = useFormContext<LaunchpadFormInput>();

    // read realtim form values
    const tokenAddress = watch('tokenAddress');
    const hardcap = watch('hardcap');
    const listingRate = watch('listingRate');
    const subscriptionRate = watch('subscriptionRate');
    const liquidityPercent = watch('liquidity');

    const tokenNeedToCreateSubscription: number = React.useMemo(
        () =>
            getMinTokensToCreateSubscription({
                hardcap,
                tokenFee: feePercentNum,
                listingRate,
                subscriptionRate,
                liquidityPercent,
            }),
        [hardcap, feePercentNum, listingRate, subscriptionRate, liquidityPercent],
    );

    // custom-hooks
    const {
        balance: tokenBalance,
        decimals: tokenDecimals,
        symbol: tokenSymbol,
    } = useTokenInformation(tokenAddress);

    // effects
    React.useEffect(() => {
        const defaultRouter = routers[0].address;
        setValue('router', defaultRouter as Address);
    }, [chainId, routers, setValue]);

    React.useEffect(() => {
        const isEnough = tokenNeedToCreateSubscription > tokenBalance;
        setIsBalanceEnough(isEnough);

        if (tokenNeedToCreateSubscription > 0) {
            setShowMessage(true);
        } else {
            setShowMessage(false);
        }
    }, [tokenNeedToCreateSubscription, tokenBalance, setIsBalanceEnough]);

    return (
        <Box>
            {/* // tricky hack to bypass the bug in react-hook-form */}
            {/* // https://github.com/react-hook-form/react-hook-form/issues/2755 */}
            <input
                type="hidden"
                {...register('step2', {
                    shouldUnregister: true,
                })}
            />
            <Box>
                <TextFieldHead title={`Hardcap Tokens (${tokenSymbol})`} isRequired={true} />
                <Controller
                    name="hardcap"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value}
                            type="number"
                            onWheel={disableScroll}
                            onChange={async (e) => {
                                field.onChange(e);
                                await trigger('softcap');
                            }}
                            fullWidth
                            placeholder="Ex: 100"
                            error={!!errors?.hardcap}
                            helperText={<TextFieldError fieldName={errors?.hardcap} />}
                        />
                    )}
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <TextFieldHead title={`Softcap Tokens (${tokenSymbol})`} isRequired={true} />
                <Controller
                    name="softcap"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value}
                            type="number"
                            onWheel={disableScroll}
                            fullWidth
                            placeholder="Ex: 75"
                            error={!!errors?.softcap}
                            helperText={<TextFieldError fieldName={errors?.softcap} />}
                        />
                    )}
                />
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography mb={'9px'} ml={2} fontSize="14px">
                    HardCap Token Per User ({tokenSymbol}){' '}
                    <span style={{ color: '#FF8484' }}>*</span>
                </Typography>
                <Controller
                    name="hardcapTokensPerUser"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value}
                            type="number"
                            onWheel={disableScroll}
                            fullWidth
                            placeholder="Ex: 75"
                            error={!!errors?.hardcapTokensPerUser}
                            helperText={<TextFieldError fieldName={errors?.hardcapTokensPerUser} />}
                        />
                    )}
                />
            </Box>

            <Box sx={{ mt: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box
                    sx={{
                        display: 'flex',

                        justifyContent: 'space-between',
                        gap: '25px',
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        <TextFieldHead title="Subscription rate" isRequired={true} />
                        <Controller
                            name="subscriptionRate"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    type="number"
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="Ex: 10"
                                    error={!!errors?.subscriptionRate}
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        await trigger('listingRate');
                                    }}
                                    helperText={
                                        <>
                                            <TextFieldError fieldName={errors?.subscriptionRate} />
                                            <TextFieldHelper msg="If I spend 1 BNB how many tokens will I receive?" />
                                        </>
                                    }
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <TextFieldHead title="Listing rate" isRequired={true} />
                        <Controller
                            name="listingRate"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    type="number"
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="Ex: 10"
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        await trigger('subscriptionRate');
                                    }}
                                    error={!!errors?.listingRate}
                                    helperText={<TextFieldError fieldName={errors?.listingRate} />}
                                />
                            )}
                        />
                    </Box>
                </Box>
                <Box sx={{ mt: '12px', ml: 2 }}>
                    <FormControl>
                        <FormLabel id="currency">
                            <Typography color="common.white">Whitelist</Typography>
                        </FormLabel>
                        <Controller
                            name="whitelist"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup {...field} value={field.value} row>
                                    <FormControlLabel
                                        value={LaunchpadWhitelist.DISABLED}
                                        control={<Radio sx={{ color: '#fff' }} />}
                                        label="Disable"
                                    />
                                    <FormControlLabel
                                        value={LaunchpadWhitelist.ENABLED}
                                        control={<Radio sx={{ color: '#fff' }} />}
                                        label="Enable"
                                    />
                                </RadioGroup>
                            )}
                        />
                        <TextFieldHelper msg="You can enable/disable whitelist anytime." />
                    </FormControl>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '25px',
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        <TextFieldHead title="Router" isRequired={true} />
                        <Controller
                            name="router"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    MenuProps={{ disableScrollLock: true }}
                                    value={field.value || routers[0].address}
                                    fullWidth
                                    sx={{
                                        '.MuiSvgIcon-root ': {
                                            fill: 'white !important',
                                        },
                                    }}
                                >
                                    {routers.map((x) => (
                                        <MenuItem key={x.name} value={x.address}>
                                            {x.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <TextFieldHead title="Liquidity Percent (%)" isRequired={true} />
                        <Controller
                            name="liquidity"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    fullWidth
                                    onWheel={disableScroll}
                                    placeholder="0"
                                    error={!!errors?.liquidity}
                                    helperText={
                                        <>
                                            <TextFieldError fieldName={errors?.liquidity} />
                                            <TextFieldHelper msg="Enter the percentage of raised funds that should be allocated to Liquidity on (Min 51%, Max 100%)" />
                                        </>
                                    }
                                />
                            )}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '25px',
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        <TextFieldHead title="Refund type" isRequired={true} />
                        <Controller
                            name="refundType"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    MenuProps={{ disableScrollLock: true }}
                                    value={field.value}
                                    fullWidth
                                    sx={{
                                        '.MuiSvgIcon-root ': {
                                            fill: 'white !important',
                                        },
                                    }}
                                >
                                    <MenuItem value={RefundType.BURN}>Burn</MenuItem>
                                    <MenuItem value={RefundType.REFUND}>Refund</MenuItem>
                                </Select>
                            )}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <TextFieldHead title="Liquidity Lock Time (minutes)" isRequired={true} />
                        <Controller
                            name="liquidityLockup"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    onWheel={disableScroll}
                                    value={field.value}
                                    fullWidth
                                    placeholder="0"
                                    error={!!errors?.liquidityLockup}
                                    helperText={
                                        <>
                                            <TextFieldError fieldName={errors?.liquidityLockup} />
                                            <TextFieldHelper msg="Lock up time must be greater than 5 minutes" />
                                        </>
                                    }
                                />
                            )}
                        />
                    </Box>
                </Box>
            </Box>

            <Box
                sx={{
                    mt: '15px',
                    mb: '23px',
                    display: 'flex',
                    gap: '25px',
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', sm: 'row' },
                }}
            >
                <Box sx={{ width: '100%' }}>
                    <TextFieldHead title="Start Time (UTC)" isRequired={true} />
                    <Controller
                        name="startTime"
                        control={control}
                        render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
                            <DateTimePicker
                                {...field}
                                sx={{ width: '100%' }}
                                inputRef={ref}
                                timezone="UTC"
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
                <Box sx={{ width: '100%' }}>
                    <TextFieldHead title="End Time (UTC)" isRequired={true} />
                    <Controller
                        name="endTime"
                        control={control}
                        render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
                            <DateTimePicker
                                {...field}
                                sx={{ width: '100%' }}
                                inputRef={ref}
                                timezone="UTC"
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
            </Box>

            <Box mt={3} mb={1}>
                <Infobar
                    variant={
                        tokenNeedToCreateSubscription > Number(tokenBalance) ? 'error' : 'info'
                    }
                    open={showMessage}
                    setOpen={setShowMessage}
                    message={getMessage(
                        tokenNeedToCreateSubscription,
                        Number(tokenBalance),
                        tokenSymbol,
                    )}
                    dismissable={true}
                />
            </Box>
        </Box>
    );
};

export default Step2Subscription;
