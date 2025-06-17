'use client';

import React from 'react';
import {
    Box,
    Button,
    Checkbox,
    Collapse,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputAdornment,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Controller, useFormContext } from 'react-hook-form';
import { disableScroll } from '@/utils/disableScroll';

import { LaunchpadCurrencies, LaunchpadFormInput, LaunchpadWhitelist, RefundType } from './types';
import { DEFAULT_CHAIN_ID, NATIVE_CURRENCY_SYMBOLS, ROUTERS, Router } from '@/constants';
import { Address, useNetwork } from 'wagmi';
import { TokenDetails } from '@/hooks/useTokenDetails';
import { calculatePercentage } from '@/utils/calculatePercent';
import TextFieldError from '../TextField/TextFieldError';
import TextFieldHead from '../TextField/TextFieldHead';
import TextFieldHelper from '../TextField/TextFieldHelper';
import Infobar from '../Infobar/Infobar';
import { getMinTokensToCreateDutchAuction } from '@/utils/getMinTokens';
import { getMessage } from './validations';
import useTokenInformation from '@/hooks/useTokenInformation';

interface Step2DutchAuctionProps {
    tokenDetails: TokenDetails[];
    setIsBalanceEnough: React.Dispatch<React.SetStateAction<boolean>>;
    feePercentNum: number;
}

const Step2DutchAuction = ({
    tokenDetails,
    setIsBalanceEnough,
    feePercentNum,
}: Step2DutchAuctionProps) => {
    const [showMessage, setShowMessage] = React.useState<boolean>();
    const { chain } = useNetwork();
    const chainId = chain?.id;

    const routers: Router[] = ROUTERS[chainId || DEFAULT_CHAIN_ID];

    const {
        control,
        setValue,
        watch,
        trigger,
        register,
        formState: { errors, isValid },
    } = useFormContext<LaunchpadFormInput>();

    // read realtime form values
    const totalSellingAmount = watch('totalSellingAmount');
    const startPrice = watch('startPrice');
    const endPrice = watch('endPrice');
    const hardcap = watch('hardcap');
    const softcap = watch('softcap');
    const currency = watch('currency');
    const tokenAddress = watch('tokenAddress');
    const liquidityPercent = watch('liquidity');
    const isVestingActive = watch('isVestingActive');

    const currencySymbol =
        currency === LaunchpadCurrencies.NATIVE ? NATIVE_CURRENCY_SYMBOLS[chainId] : currency;
    // const tokenSymbol = tokenDetails?.[1].value;

    const currencyPriceAgainstTokenAtStartPrice = startPrice;
    const tokenPriceAgainstCurrencyAtStartPrice = 1 / currencyPriceAgainstTokenAtStartPrice;
    const currencyPriceAgainstTokenAtEndPrice = endPrice;
    const tokenPriceAgainstCurrencyAtEndPrice = 1 / currencyPriceAgainstTokenAtEndPrice;

    const {
        balance: tokenBalance,
        decimals: tokenDecimals,
        symbol: tokenSymbol,
    } = useTokenInformation(tokenAddress);

    // functions
    const getTwentyFivePercentOfHardcap = React.useCallback(() => {
        const v = calculatePercentage(hardcap, 25);
        setValue('softcap', v, { shouldValidate: true });
        setValue('endPrice', v / totalSellingAmount);
        trigger('hardcap');
        trigger('endPrice');
        trigger('startPrice');
    }, [hardcap, setValue, totalSellingAmount, trigger]);

    const tokenNeedToCreateDutchAuction = React.useMemo(() => {
        return getMinTokensToCreateDutchAuction({
            feeOptions: feePercentNum,
            hardcap,
            liquidityFee: liquidityPercent,
            softcap,
            totalSellingAmount,
        });
    }, [feePercentNum, hardcap, liquidityPercent, softcap, totalSellingAmount]);

    React.useEffect(() => {
        if (tokenNeedToCreateDutchAuction > 0) {
            setShowMessage(true);
        } else {
            setShowMessage(false);
        }
    }, [tokenNeedToCreateDutchAuction]);

    React.useEffect(() => {
        const isEnough = tokenNeedToCreateDutchAuction > tokenBalance;
        setIsBalanceEnough(isEnough);
    }, [setIsBalanceEnough, tokenBalance, tokenNeedToCreateDutchAuction]);

    React.useEffect(() => {
        const defaultRouter = routers[0].address;
        setValue('router', defaultRouter as Address);
    }, [chainId, routers, setValue]);

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
                <TextFieldHead title="Total Selling Amount" isRequired={true} />
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
                            helperText={<TextFieldError fieldName={errors?.totalSellingAmount} />}
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
                        <TextFieldHead
                            title={`Start Price (${currencySymbol})`}
                            isRequired={true}
                        />
                        <Controller
                            name="startPrice"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    value={field.value}
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="Ex: 10"
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        const {
                                            target: { value },
                                        } = e;
                                        setValue('hardcap', totalSellingAmount * Number(value), {
                                            shouldValidate: true,
                                        });
                                        await trigger('endPrice');
                                    }}
                                    error={!!errors?.startPrice}
                                    helperText={
                                        <>
                                            <TextFieldError fieldName={errors?.startPrice} />
                                            <Collapse in={!!startPrice}>
                                                <TextFieldHelper
                                                    msg={`1 ${tokenSymbol} = ${currencyPriceAgainstTokenAtStartPrice} ${currencySymbol}`}
                                                />
                                                <TextFieldHelper
                                                    msg={`1 ${currencySymbol} = ${tokenPriceAgainstCurrencyAtStartPrice} ${tokenSymbol}`}
                                                />
                                            </Collapse>
                                            <TextFieldHelper msg="The price when the auction will start. This value must be higher than the end price" />
                                        </>
                                    }
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <TextFieldHead title={`End Price (${currencySymbol})`} isRequired={true} />
                        <Controller
                            name="endPrice"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    type="number"
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="Ex: 10"
                                    error={!!errors?.endPrice}
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        const {
                                            target: { value },
                                        } = e;
                                        setValue('softcap', totalSellingAmount * Number(value), {
                                            shouldValidate: true,
                                        });
                                        await trigger('startPrice');
                                    }}
                                    helperText={
                                        <>
                                            <TextFieldError fieldName={errors?.endPrice} />
                                            <Collapse in={!!endPrice}>
                                                <TextFieldHelper
                                                    msg={`1 ${tokenSymbol} = ${currencyPriceAgainstTokenAtEndPrice} ${currencySymbol}`}
                                                />
                                                <TextFieldHelper
                                                    msg={`1 ${currencySymbol} = ${tokenPriceAgainstCurrencyAtEndPrice} ${tokenSymbol}`}
                                                />
                                            </Collapse>
                                            <TextFieldHelper msg="The price when the auction will meet its end date" />
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
                        <TextFieldHead title={`Softcap (${currencySymbol})`} isRequired={true} />
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
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button
                                                    component={Box}
                                                    variant="contained"
                                                    size="small"
                                                    sx={{ px: '15px' }}
                                                    onClick={getTwentyFivePercentOfHardcap}
                                                >
                                                    25%
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        const {
                                            target: { value },
                                        } = e;
                                        setValue('endPrice', Number(value) / totalSellingAmount, {
                                            shouldValidate: true,
                                        });
                                        await trigger('hardcap');
                                    }}
                                    helperText={
                                        <>
                                            <TextFieldError fieldName={errors?.softcap} />
                                            <TextFieldHelper msg="Softcap must be >= 25% of Hardcap!" />
                                        </>
                                    }
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <TextFieldHead title={`HardCap (${currencySymbol})`} isRequired={true} />
                        <Controller
                            name="hardcap"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    type="number"
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="0"
                                    error={!!errors?.hardcap}
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        const {
                                            target: { value },
                                        } = e;
                                        setValue('startPrice', Number(value) / totalSellingAmount, {
                                            shouldValidate: true,
                                        });
                                        await trigger('softcap');
                                    }}
                                    helperText={<TextFieldError fieldName={errors?.hardcap} />}
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
                        <TextFieldHead
                            title={`Min Contribution (${currencySymbol})`}
                            isRequired={true}
                        />
                        <Controller
                            name="minContribution"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    type="number"
                                    onWheel={disableScroll}
                                    fullWidth
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        await trigger('maxContribution');
                                    }}
                                    placeholder="0"
                                    error={!!errors?.minContribution}
                                    helperText={
                                        <TextFieldError fieldName={errors?.minContribution} />
                                    }
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <TextFieldHead
                            title={`Max Contribution (${currencySymbol})`}
                            isRequired={true}
                        />
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
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        await trigger('minContribution');
                                    }}
                                    placeholder="0"
                                    error={!!errors?.maxContribution}
                                    helperText={
                                        <TextFieldError fieldName={errors?.maxContribution} />
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
                        <TextFieldHead title="Decrease Price Cycle (minutes)" isRequired={true} />
                        <Controller
                            name="decreasePriceCycle"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="Ex: 10"
                                    error={!!errors?.decreasePriceCycle}
                                    helperText={
                                        <TextFieldError fieldName={errors?.decreasePriceCycle} />
                                    }
                                />
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

                <Box>
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
                    <TextFieldHead title="TGE Release Percent (%)" isRequired={true} />
                    <Controller
                        name="tgeReleasePercent"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                onWheel={disableScroll}
                                value={field.value}
                                fullWidth
                                placeholder="Ex: 40%"
                                error={!!errors?.tgeReleasePercent}
                                helperText={
                                    <>
                                        <TextFieldError fieldName={errors?.tgeReleasePercent} />
                                        <TextFieldHelper msg="Lock up time must be greater than 5 minutes" />
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
                        <TextFieldHead title="Cycle (minutes)" isRequired={true} />
                        <Controller
                            name="cycle"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    onWheel={disableScroll}
                                    value={field.value}
                                    fullWidth
                                    placeholder="Enter (minutes). Ex: 3"
                                    error={!!errors?.cycle}
                                    helperText={
                                        <>
                                            <TextFieldError fieldName={errors?.cycle} />
                                            <TextFieldHelper msg="Lock up time must be greater than 5 minutes" />
                                        </>
                                    }
                                />
                            )}
                        />
                    </Box>
                </Collapse>
                <Collapse in={isVestingActive} sx={{ width: '100%' }}>
                    <Box>
                        <TextFieldHead title="Cycle release Percent (%)" isRequired={true} />
                        <Controller
                            name="cycleReleasePercent"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    value={field.value}
                                    fullWidth
                                    onWheel={disableScroll}
                                    placeholder="Ex: 20%"
                                    error={!!errors?.cycleReleasePercent}
                                    helperText={
                                        <>
                                            <TextFieldError
                                                fieldName={errors?.cycleReleasePercent}
                                            />
                                            <TextFieldHelper msg="Lock up time must be greater than 5 minutes" />
                                        </>
                                    }
                                />
                            )}
                        />
                    </Box>
                </Collapse>
            </Box>

            <Box mt={3} mb={1}>
                <Infobar
                    variant={
                        tokenNeedToCreateDutchAuction > Number(tokenBalance) ? 'error' : 'info'
                    }
                    open={showMessage}
                    setOpen={setShowMessage}
                    message={getMessage(
                        tokenNeedToCreateDutchAuction,
                        Number(tokenBalance),
                        tokenSymbol,
                    )}
                    dismissable={true}
                />
            </Box>
            {/* <Box mt={3} mb={1}>
                <Infobar
                    variant="error"
                    open={isValidCalc}
                    message="Please update softcap, hardcap, startPrice and endPrice because you changed the total selling amount."
                    dismissable={false}
                />
            </Box> */}
        </Box>
    );
};

export default Step2DutchAuction;
