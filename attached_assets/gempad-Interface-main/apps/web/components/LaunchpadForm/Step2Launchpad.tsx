'use client';

import React, { Dispatch, SetStateAction, useEffect } from 'react';
import {
    Box,
    Checkbox,
    Collapse,
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
import { Controller, useFormContext } from 'react-hook-form';
import { disableScroll } from '@/utils/disableScroll';
import { LaunchpadCurrencies, LaunchpadWhitelist, ListingOptions, RefundType } from './types';
import { DEFAULT_CHAIN_ID, NATIVE_CURRENCY_SYMBOLS, ROUTERS, Router } from '@/constants';
import { Address, erc20ABI, useContractRead, useNetwork } from 'wagmi';
import Infobar from '../Infobar/Infobar';
import { getMessage } from './validations';
import useTokenInformation from '@/hooks/useTokenInformation';
import { useActiveChainId } from '@/hooks/useActiveChainId';

const Step2Launchpad = ({
    setIsBalanceEnough,
    tokenNeedToCreateLaunchpad,
    feePercentNum,
}: {
    setIsBalanceEnough: Dispatch<SetStateAction<boolean>>;
    tokenNeedToCreateLaunchpad: number;
    feePercentNum: number;
}) => {
    const { chainId } = useActiveChainId();
    const routers: Router[] = ROUTERS[chainId || DEFAULT_CHAIN_ID];
    const [showMessage, setShowMessage] = React.useState<boolean>();

    const {
        control,
        register,
        trigger,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();
    const currency = watch('currency');
    const tokenAddress = watch('tokenAddress');
    const listingRate = watch('listingRate');
    const isVestingActive = watch('isVestingActive');
    const presaleRate = watch('presaleRate');
    const hardcap = watch('hardcap');
    const listingOptions = watch('listingOptions');

    React.useEffect(() => {
        // Update the default value of the 'router' field when chain.id changes
        const defaultRouter = routers[0].address; // Implement a function to get the default router based on chain.id
        setValue('router', defaultRouter as Address);
    }, [chainId, routers, setValue]);

    React.useEffect(() => {
        if (tokenNeedToCreateLaunchpad > 0) {
            setShowMessage(true);
        } else {
            setShowMessage(false);
        }
    }, [tokenNeedToCreateLaunchpad]);

    const { data, isError, isLoading } = useContractRead({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'symbol',
    });

    const {
        balance: tokenBalance,
        decimals: tokenDecimals,
        symbol: tokenSymbol,
    } = useTokenInformation(tokenAddress);

    React.useEffect(() => {
        const isEnough = tokenNeedToCreateLaunchpad > tokenBalance;
        setIsBalanceEnough(isEnough);
    }, [tokenNeedToCreateLaunchpad, tokenBalance, setIsBalanceEnough]);

    const currencySymbol =
        currency === LaunchpadCurrencies.NATIVE
            ? NATIVE_CURRENCY_SYMBOLS[chainId || DEFAULT_CHAIN_ID]
            : currency;
    return (
        <Box>
            <Box>
                {/* // tricky hack to bypass the bug in react-hook-form */}
                {/* // https://github.com/react-hook-form/react-hook-form/issues/2755 */}
                <input
                    type="hidden"
                    {...register('step2', {
                        shouldUnregister: true,
                    })}
                />
                <Typography mb={'9px'} ml={2}>
                    Presale rate <span style={{ color: '#FF8484' }}>*</span>
                </Typography>
                <Controller
                    name="presaleRate"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="number"
                            value={field.value}
                            fullWidth
                            placeholder="100"
                            onWheel={disableScroll}
                            error={!!errors?.presaleRate}
                            helperText={
                                <>
                                    <Typography variant="body2">
                                        {errors?.presaleRate?.message?.toString()}
                                    </Typography>
                                    <Typography color="primary" variant="h5" fontSize={12}>
                                        If I spend 1 {currencySymbol} how many tokens will I
                                        receive?
                                    </Typography>
                                </>
                            }
                        />
                    )}
                />
            </Box>

            <Box sx={{ mt: '30px', ml: 2 }}>
                <FormControl>
                    <FormLabel id="currency">
                        <Typography color="common.white" variant="h5">
                            Whitelist
                        </Typography>
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
                    <Typography variant="h5" fontSize={14} color="primary">
                        You can enable/disable whitelist anytime.
                    </Typography>
                </FormControl>
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
                        <Typography mb={'9px'} ml={2}>
                            Softcap {currencySymbol ?? 'ETH'}{' '}
                            <span style={{ color: '#FF8484' }}>*</span>
                        </Typography>
                        <Controller
                            name="softcap"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    type="number"
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        await trigger('hardcap');
                                    }}
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="0"
                                    error={!!errors?.softcap}
                                    helperText={
                                        <>
                                            <Typography color="primary" variant="h5" fontSize={12}>
                                                Softcap must be {'>='} 25% of Hardcap!
                                            </Typography>
                                            <Typography variant="body2">
                                                {errors?.softcap?.message?.toString()}
                                            </Typography>
                                        </>
                                    }
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Typography mb={'9px'} ml={2}>
                            HardCap {currencySymbol ?? 'ETH'}{' '}
                            <span style={{ color: '#FF8484' }}>*</span>
                        </Typography>
                        <Controller
                            name="hardcap"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    type="number"
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        await trigger('softcap');
                                    }}
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="0"
                                    error={!!errors?.hardcap}
                                    helperText={
                                        <Typography variant="body2">
                                            {errors?.hardcap?.message?.toString()}
                                        </Typography>
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
                        <Typography mb={'9px'} ml={2}>
                            Minimum buy {currencySymbol ?? 'ETH'}{' '}
                            <span style={{ color: '#FF8484' }}>*</span>
                        </Typography>
                        <Controller
                            name="minBuy"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    type="number"
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        await trigger('maxBuy');
                                    }}
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="0"
                                    error={!!errors?.minBuy}
                                    helperText={
                                        <Typography variant="body2">
                                            {errors?.minBuy?.message?.toString()}
                                        </Typography>
                                    }
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Typography mb={'9px'} ml={2}>
                            Maximum buy {currencySymbol ?? 'ETH'}{' '}
                            <span style={{ color: '#FF8484' }}>*</span>
                        </Typography>
                        <Controller
                            name="maxBuy"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    type="number"
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        await trigger('minBuy');
                                    }}
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="0"
                                    error={!!errors?.maxBuy}
                                    helperText={
                                        <Typography variant="body2">
                                            {errors?.maxBuy?.message?.toString()}
                                        </Typography>
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
                        <Typography mb={'9px'} ml={2}>
                            Refund type
                        </Typography>
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
                                        my: '9px',
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
                    {listingOptions === ListingOptions.AUTO && (
                        <Box sx={{ width: '100%' }}>
                            <Typography mb={'9px'} ml={2}>
                                Router <span style={{ color: '#FF8484' }}>*</span>
                            </Typography>
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
                                            my: '9px',
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
                    )}
                </Box>

                {listingOptions === ListingOptions.AUTO && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '25px',
                            flexDirection: { xs: 'column', sm: 'row' },
                        }}
                    >
                        <Box sx={{ width: '100%' }}>
                            <Typography mb={'9px'} ml={2}>
                                liquidity (%) <span style={{ color: '#FF8484' }}>*</span>
                            </Typography>
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
                                            <Typography variant="body2">
                                                {errors?.liquidity?.message.toString()}
                                            </Typography>
                                        }
                                    />
                                )}
                            />
                        </Box>
                        <Box sx={{ width: '100%' }}>
                            <Typography mb={'9px'} ml={2}>
                                listing rate <span style={{ color: '#FF8484' }}>*</span>
                            </Typography>
                            <Controller
                                name="listingRate"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="number"
                                        fullWidth
                                        onWheel={disableScroll}
                                        placeholder="0"
                                        error={!!errors?.listingRate}
                                        helperText={
                                            <>
                                                <Typography variant="body2">
                                                    {errors?.listingRate?.message.toString()}
                                                </Typography>
                                                <Typography
                                                    color="primary"
                                                    variant="h5"
                                                    fontSize={12}
                                                >
                                                    1 {currencySymbol} = {listingRate ?? '...'}{' '}
                                                    {data}
                                                </Typography>
                                            </>
                                        }
                                    />
                                )}
                            />
                        </Box>
                    </Box>
                )}
            </Box>

            <Box sx={{ my: '23px', ml: '18px' }}>
                <Typography color="primary" fontSize={14} variant="h5">
                    Enter the percentage of raised funds that should be allocated to Liquidity on
                    (Min 51%, Max 100%)
                </Typography>
                <Typography color="primary" fontSize={14} variant="h5">
                    If I spend 1 {currencySymbol ?? 'ETH'} on how many tokens will I receive?
                    Usually this amount is lower than presale rate to allow for a higher listing
                    price on
                </Typography>
            </Box>

            <Box>
                <Typography variant="h5" ml={2}>
                    Select start time & end time (UTC)
                </Typography>
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
                    <Typography variant="h5" ml={2} mb={'9px'}>
                        Start Time (UTC)
                    </Typography>
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
                    />{' '}
                </Box>
                <Box sx={{ width: '100%' }}>
                    <Typography variant="h5" ml={2} mb={'9px'}>
                        End Time (UTC)
                    </Typography>
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
                    />{' '}
                </Box>
            </Box>

            {listingOptions === ListingOptions.AUTO && (
                <Box>
                    <Typography variant="h5" ml={2} mb={'9px'}>
                        Liquidity lockup (minutes) <span style={{ color: '#FF8484' }}>*</span>
                    </Typography>
                    <Controller
                        name="liquidityLockup"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                value={field.value}
                                onWheel={disableScroll}
                                fullWidth
                                placeholder="0"
                                error={!!errors?.liquidityLockup}
                                helperText={
                                    <>
                                        <Typography variant="body2">
                                            {errors?.liquidityLockup?.message?.toString()}
                                        </Typography>
                                        <Typography color="primary" variant="h5" fontSize={12}>
                                            Lock up time must be greater than 5 minutes
                                        </Typography>
                                    </>
                                }
                            />
                        )}
                    />
                </Box>
            )}

            <Controller
                name="isVestingActive"
                control={control}
                render={({ field }) => (
                    <FormControlLabel
                        {...field}
                        value={field.value}
                        sx={{ mt: 2, ml: '0px' }}
                        label="Using Vesting Contributor?"
                        control={<Checkbox checked={field.value} sx={{ color: '#fff' }} />}
                    />
                )}
            />

            <Box mt={1}>
                <Collapse in={isVestingActive}>
                    <Typography variant="h5" ml={2} mb={'9px'}>
                        First release for presale (percent){' '}
                        <span style={{ color: '#FF8484' }}>*</span>
                    </Typography>
                    <Controller
                        name="releasePresale"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                onWheel={disableScroll}
                                value={field.value}
                                fullWidth
                                placeholder="Ex: 40%"
                                error={!!errors?.releasePresale}
                                helperText={
                                    <>
                                        <Typography variant="body2">
                                            {errors?.releasePresale?.message?.toString()}
                                        </Typography>
                                        {/* <Typography color="primary" variant="h5" fontSize={12}>
                                            Lock up time must be greater than 5 minutes
                                        </Typography> */}
                                    </>
                                }
                            />
                        )}
                    />
                </Collapse>
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
                <Collapse in={isVestingActive} sx={{ width: '100%' }}>
                    <Box>
                        <Typography variant="h5" ml={2} mb={'9px'}>
                            Vesting period each cycle (minutes){' '}
                            <span style={{ color: '#FF8484' }}>*</span>
                        </Typography>
                        <Controller
                            name="vestingPeriod"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    onWheel={disableScroll}
                                    value={field.value}
                                    fullWidth
                                    placeholder="Enter (minutes). Ex: 3"
                                    error={!!errors?.vestingPeriod}
                                    helperText={
                                        <>
                                            <Typography variant="body2">
                                                {errors?.vestingPeriod?.message?.toString()}
                                            </Typography>
                                            {/* <Typography color="primary" variant="h5" fontSize={12}>
                                                Lock up time must be greater than 5 minutes here
                                            </Typography> */}
                                        </>
                                    }
                                />
                            )}
                        />
                    </Box>
                </Collapse>
                <Collapse in={isVestingActive} sx={{ width: '100%' }}>
                    <Box>
                        <Typography variant="h5" ml={2} mb={'9px'}>
                            Presale token release each cycle (percent){' '}
                            <span style={{ color: '#FF8484' }}>*</span>
                        </Typography>
                        <Controller
                            name="presaleTokenRelease"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    value={field.value}
                                    fullWidth
                                    onWheel={disableScroll}
                                    placeholder="Ex: 20%"
                                    error={!!errors?.releasePresale}
                                    helperText={
                                        <>
                                            <Typography variant="body2">
                                                {errors?.releasePresale?.message?.toString()}
                                            </Typography>
                                            {/* <Typography color="primary" variant="h5" fontSize={12}>
                                                Lock up time must be greater than 5 minutes
                                            </Typography> */}
                                        </>
                                    }
                                />
                            )}
                        />
                    </Box>
                </Collapse>
            </Box>

            <Box mt={1}>
                <Infobar
                    open={isVestingActive}
                    variant="warning"
                    dismissable={false}
                    message="Vesting Contributor does not support rebase tokens.
"
                />
            </Box>

            <Box mt={3} mb={1}>
                <Infobar
                    variant={tokenNeedToCreateLaunchpad > Number(tokenBalance) ? 'error' : 'info'}
                    open={showMessage}
                    setOpen={setShowMessage}
                    message={getMessage(
                        tokenNeedToCreateLaunchpad,
                        Number(tokenBalance),
                        tokenSymbol,
                    )}
                    dismissable={true}
                />
            </Box>
        </Box>
    );
};

export default Step2Launchpad;
