'use client';

import React, { Dispatch } from 'react';
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
import {
    LaunchpadCurrencies,
    LaunchpadFormInput,
    LaunchpadWhitelist,
    ListingOptions,
} from '@/components/LaunchpadForm/types';
import { buybackDetails } from './constants';
import PrimaryCard from '../Cards/PrimaryCard';
import RowCard from '../RowCard/RowCard';
import { calculatePercentage } from '@/utils/calculatePercent';
import { DEFAULT_CHAIN_ID, NATIVE_CURRENCY_SYMBOLS, ROUTERS, Router } from '@/constants';
import { Address, useAccount, useBalance, useContractReads, useNetwork } from 'wagmi';
import { getMinTokensToCreateFairLaunh } from '@/utils/getMinTokens';
import Infobar from '../Infobar/Infobar';
import useTokenInformation from '@/hooks/useTokenInformation';
import { formatUnits } from 'viem';
import { getMessage } from './validations';
import { disableScroll } from '@/utils/disableScroll';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import useTokenDetails from '@/hooks/useTokenDetails';
import { useToken } from '@/hooks/Tokens';

const Step2FairLaunch = ({
    setIsBalanceEnough,
    feePercentNum,
}: {
    setIsBalanceEnough: Dispatch<React.SetStateAction<boolean>>;
    feePercentNum: number;
}) => {
    const [showMessage, setShowMessage] = React.useState<boolean>();
    const { address } = useAccount();
    const { chainId } = useActiveChainId();
    const routers: Router[] = ROUTERS[chainId || DEFAULT_CHAIN_ID];

    const {
        control,
        watch,
        setValue,
        trigger,
        register,
        formState: { errors },
    } = useFormContext<LaunchpadFormInput>();
    const currency = watch('currency');
    const isMaxContribution = watch('isMaxContribution');
    const isEnableBuyback = watch('isEnableBuyback');
    const softcap = watch('softcap');
    const buybackPercent = watch('buybackPercent');
    const totalSellingAmount = watch('totalSellingAmount');
    const liquidityPercent = watch('liquidity');
    const tokenAddress = watch('tokenAddress');
    const listingOption = watch('listingOptions');

    const { decimals } = useToken(tokenAddress);

    const isAutoListing = listingOption === ListingOptions.AUTO;

    const tokenNeedToCreateFairLaunch: number = React.useMemo(
        () =>
            getMinTokensToCreateFairLaunh({
                totalSellingAmount: totalSellingAmount as number,
                tokenFee: feePercentNum,
                liquidityPercent: liquidityPercent ? (liquidityPercent as number) : 0,
                decimals,
            }),
        [totalSellingAmount, liquidityPercent, feePercentNum, decimals],
    );

    React.useEffect(() => {
        // Update the default value of the 'router' field when chain.id changes
        const defaultRouter = routers[0].address; // Implement a function to get the default router based on chain.id
        setValue('router', defaultRouter as Address);
    }, [chainId, routers, setValue, decimals]);

    React.useEffect(() => {
        if (tokenNeedToCreateFairLaunch > 0) {
            setShowMessage(true);
        } else {
            setShowMessage(false);
        }
    }, [totalSellingAmount, liquidityPercent, tokenNeedToCreateFairLaunch]);

    const {
        balance: tokenBalance,
        decimals: tokenDecimals,
        symbol: tokenSymbol,
    } = useTokenInformation(tokenAddress);

    React.useEffect(() => {
        const isEnough = tokenNeedToCreateFairLaunch > tokenBalance;
        setIsBalanceEnough(isEnough);
    }, [tokenNeedToCreateFairLaunch, tokenBalance, setIsBalanceEnough]);

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
                    Total selling amount <span style={{ color: '#FF8484' }}>*</span>
                </Typography>
                <Controller
                    name="totalSellingAmount"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value}
                            type="number"
                            onWheel={disableScroll}
                            fullWidth
                            placeholder="100"
                            error={!!errors?.totalSellingAmount}
                            helperText={
                                <>
                                    <Typography variant="body2">
                                        {errors?.totalSellingAmount?.message?.toString()}
                                    </Typography>
                                    {/* <Typography color="primary" variant="h5" fontSize={12}>
                                        If I spend 1 {currencySymbol} how many tokens will I
                                        receive?
                                    </Typography> */}
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
                    <Typography variant="h5" fontSize={12} color="primary">
                        You can enable/disable whitelist anytime.
                    </Typography>
                </FormControl>
            </Box>

            <Box sx={{ mt: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Box>
                    <Typography mb={'9px'} ml={2}>
                        Softcap ({currencySymbol}) <span style={{ color: '#FF8484' }}>*</span>
                    </Typography>
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
                                placeholder="0"
                                error={!!errors?.softcap}
                                helperText={
                                    <>
                                        <Typography variant="body2">
                                            {errors?.softcap?.message?.toString()}
                                        </Typography>
                                        {/* <Typography color="primary" variant="h5" fontSize={12}>
                                            If I spend 1 {currencySymbol} how many tokens will I
                                            receive?
                                        </Typography> */}
                                    </>
                                }
                            />
                        )}
                    />

                    <Controller
                        name="isMaxContribution"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                {...field}
                                value={field.value}
                                sx={{ mt: 2, ml: '0px' }}
                                label="Setting max contribution?"
                                control={<Checkbox checked={field.value} sx={{ color: '#fff' }} />}
                            />
                        )}
                    />

                    <Collapse in={isMaxContribution} sx={{ width: '100%', mt: 2 }}>
                        <Typography mb={'9px'} ml={2}>
                            Max Contribution ({currencySymbol}){' '}
                            <span style={{ color: '#FF8484' }}>*</span>
                        </Typography>
                        <Controller
                            name="maxContribution"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    type="number"
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="0"
                                    error={!!errors?.maxContribution}
                                    helperText={
                                        <>
                                            <Typography variant="body2">
                                                {errors?.maxContribution?.message}
                                            </Typography>
                                            <Typography color="primary" variant="h5" fontSize={12}>
                                                The amount of raised currency that uses for the
                                                affiliate program.
                                            </Typography>
                                        </>
                                    }
                                />
                            )}
                        />
                    </Collapse>
                </Box>

                <Collapse in={isAutoListing}>
                    <Box>
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
                </Collapse>
                <Collapse in={isAutoListing}>
                    <Box>
                        <Typography mb={'9px'} ml={2}>
                            liquidity (%) <span style={{ color: '#FF8484' }}>*</span>
                        </Typography>
                        <Controller
                            name="liquidity"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        const isEnableBuyback = watch('isEnableBuyback');
                                        if (isEnableBuyback) {
                                            await trigger('buybackPercent');
                                        }
                                    }}
                                    type="number"
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="0"
                                    error={!!errors?.liquidity}
                                    helperText={
                                        <Typography variant="body2">
                                            {errors?.liquidity?.message}
                                        </Typography>
                                    }
                                />
                            )}
                        />

                        <Controller
                            name="isEnableBuyback"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    {...field}
                                    value={field.value}
                                    sx={{ mt: 2, ml: '0px' }}
                                    label="Enable Buyback?"
                                    control={
                                        <Checkbox checked={field.value} sx={{ color: '#fff' }} />
                                    }
                                />
                            )}
                        />

                        <Collapse in={isEnableBuyback} sx={{ width: '100%', mt: 2 }}>
                            <Typography mb={'9px'} ml={2}>
                                Buyback Percent (%) <span style={{ color: '#FF8484' }}>*</span>
                            </Typography>
                            <Controller
                                name="buybackPercent"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        onChange={async (e) => {
                                            field.onChange(e);
                                            await trigger('liquidity');
                                        }}
                                        value={field.value}
                                        type="number"
                                        onWheel={disableScroll}
                                        fullWidth
                                        placeholder="Ex: 52"
                                        error={!!errors?.buybackPercent}
                                        helperText={
                                            <>
                                                <Typography variant="body2">
                                                    {errors?.buybackPercent?.message}
                                                </Typography>
                                                <Typography
                                                    color="primary"
                                                    variant="h5"
                                                    fontSize={12}
                                                >
                                                    Minimum total buyback amount (assumed softcap
                                                    reached):{' '}
                                                    {calculatePercentage(softcap, buybackPercent)}{' '}
                                                    {currencySymbol}
                                                </Typography>
                                            </>
                                        }
                                    />
                                )}
                            />

                            <PrimaryCard mt={25}>
                                {buybackDetails.map((x) => (
                                    <RowCard key={x.id} prop={x.prop} val={x.val} />
                                ))}
                            </PrimaryCard>
                        </Collapse>
                    </Box>
                    <Box sx={{ my: '23px', ml: '18px' }}>
                        <Typography color="primary" fontSize={12} variant="h5">
                            Enter the percentage of raised funds that should be allocated to
                            Liquidity on (Min 51%, Max 100%)
                        </Typography>
                        <Typography color="primary" fontSize={12} variant="h5">
                            If I spend 1 BNB on how many tokens will I receive? Usually this amount
                            is lower than presale rate to allow for a higher listing price on
                        </Typography>
                    </Box>
                </Collapse>
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
                                disablePast={true}
                                timezone="UTC"
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
                                disablePast={true}
                                timezone="UTC"
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

            <Typography ml={2} mb={2} color="primary" fontSize={12} variant="h5">
                The duration between start time and end time must be less than 10080 minutes
            </Typography>

            <Collapse in={isAutoListing}>
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
                                onWheel={disableScroll}
                                value={field.value}
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
            </Collapse>

            <Box mt={3} mb={1}>
                <Infobar
                    variant={tokenNeedToCreateFairLaunch > Number(tokenBalance) ? 'error' : 'info'}
                    open={showMessage}
                    setOpen={setShowMessage}
                    message={getMessage(
                        tokenNeedToCreateFairLaunch,
                        Number(tokenBalance),
                        tokenSymbol,
                    )}
                    dismissable={true}
                />
            </Box>
        </Box>
    );
};

export default Step2FairLaunch;
