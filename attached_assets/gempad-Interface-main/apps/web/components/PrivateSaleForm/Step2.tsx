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
import { Controller, useFormContext } from 'react-hook-form';
import { disableScroll } from '@/utils/disableScroll';
import { Upload, Whitelist } from './types';
import { NATIVE_CURRENCY_SYMBOLS } from '@/constants';

import { useNetwork } from 'wagmi';
import { useStorageUpload } from '@thirdweb-dev/react';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import toast from 'react-hot-toast';
import { getCurrencySymbolByEnum } from './utils';

const Step2 = () => {
    const { chain } = useNetwork();
    const chainId = chain?.id;

    const {
        watch,
        control,
        trigger,
        register,
        formState: { errors },
    } = useFormContext();
    const currency = watch('currency');

    return (
        <Box>
            <input
                type="hidden"
                {...register('step1', {
                    shouldUnregister: true,
                })}
            />
            <Box sx={{ mt: '30px', ml: 2 }}>
                <FormControl>
                    <FormLabel>
                        <Typography color="common.white" variant="h5">
                            Whitelist
                        </Typography>
                    </FormLabel>
                    <Controller
                        name="whitelist"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup row {...field}>
                                <FormControlLabel
                                    value={Whitelist.DISABLE}
                                    control={<Radio sx={{ color: '#fff' }} />}
                                    label="Disable"
                                />
                                <FormControlLabel
                                    value={Whitelist.ENABLE}
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
                            Softcap ({getCurrencySymbolByEnum(chainId, currency)}){' '}
                            <span style={{ color: '#FF8484' }}>*</span>
                        </Typography>
                        <Controller
                            name="softCap"
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        await trigger('hardCap');
                                    }}
                                    type="number"
                                    fullWidth
                                    onWheel={disableScroll}
                                    placeholder="Ex: 10"
                                    error={!!errors.softCap}
                                    helperText={
                                        <>
                                            <Typography variant="body2">
                                                {errors?.softCap?.message.toString()}
                                            </Typography>
                                            <Typography color="primary" variant="h5" fontSize={14}>
                                                Softcap must be {`>`}= 50% of Hardcap!
                                            </Typography>
                                        </>
                                    }
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Typography mb={'9px'} ml={2}>
                            HardCap ({getCurrencySymbolByEnum(chainId, currency)}){' '}
                            <span style={{ color: '#FF8484' }}>*</span>
                        </Typography>
                        <Controller
                            name="hardCap"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        await trigger('softCap');
                                    }}
                                    type="number"
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="Ex: 10"
                                    error={!!errors.hardCap}
                                    helperText={
                                        <Typography variant="body2">
                                            {errors?.hardCap?.message.toString()}
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
                            Minimum buy ({getCurrencySymbolByEnum(chainId, currency)}){' '}
                            <span style={{ color: '#FF8484' }}>*</span>
                        </Typography>

                        <Controller
                            name="minBuy"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        await trigger('maxBuy');
                                    }}
                                    type="number"
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="0.1 BNB"
                                    error={!!errors.minBuy}
                                    helperText={
                                        <Typography variant="body2">
                                            {errors?.minBuy?.message.toString()}
                                        </Typography>
                                    }
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Typography mb={'9px'} ml={2}>
                            Maximum buy ({getCurrencySymbolByEnum(chainId, currency)}){' '}
                            <span style={{ color: '#FF8484' }}>*</span>
                        </Typography>
                        <Controller
                            name="maxBuy"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    onChange={async (e) => {
                                        field.onChange(e);
                                        await trigger('minBuy');
                                    }}
                                    type="number"
                                    onWheel={disableScroll}
                                    fullWidth
                                    placeholder="Ex: 10"
                                    error={!!errors.maxBuy}
                                    helperText={
                                        <Typography variant="body2">
                                            {errors?.maxBuy?.message.toString()}
                                        </Typography>
                                    }
                                />
                            )}
                        />
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mt: '20px' }}>
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
                                onChange={async (e) => {
                                    field.onChange(e);
                                    await trigger('endTime');
                                }}
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
                                sx={{ width: '100%' }}
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
                                onChange={async (e) => {
                                    field.onChange(e);
                                    await trigger('startTime');
                                }}
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
                                sx={{ width: '100%' }}
                            />
                        )}
                    />
                </Box>
            </Box>

            <Box>
                <Typography variant="h5" ml={2} mb={'9px'}>
                    First Fund Release For Project (%) <span style={{ color: '#FF8484' }}>*</span>
                </Typography>
                <Controller
                    name="firstFundRelease"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="number"
                            onWheel={disableScroll}
                            fullWidth
                            placeholder="Ex: 40%"
                            error={!!errors.firstFundRelease}
                            helperText={
                                <Typography variant="body2">
                                    {errors?.firstFundRelease?.message.toString()}
                                </Typography>
                            }
                        />
                    )}
                />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '25px',
                    my: '20px',
                    flexDirection: { xs: 'column', sm: 'row' },
                }}
            >
                <Box sx={{ width: '100%' }}>
                    <Typography mb={'9px'} ml={2}>
                        Fund Vesting Period Each Cycle (Days){' '}
                        <span style={{ color: '#FF8484' }}>*</span>
                    </Typography>

                    <Controller
                        name="vestingPeriodEachCycle"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                onWheel={disableScroll}
                                fullWidth
                                placeholder="Ex: 3"
                                error={!!errors.vestingPeriodEachCycle}
                                helperText={
                                    <Typography variant="body2">
                                        {errors?.vestingPeriodEachCycle?.message.toString()}
                                    </Typography>
                                }
                            />
                        )}
                    />
                </Box>
                <Box sx={{ width: '100%' }}>
                    <Typography mb={'9px'} ml={2}>
                        Fund Release Each Cycle (percent){' '}
                        <span style={{ color: '#FF8484' }}>*</span>
                    </Typography>

                    <Controller
                        name="cycleReleasePercent"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                fullWidth
                                onWheel={disableScroll}
                                placeholder="Ex: 20"
                                error={!!errors.cycleReleasePercent}
                                helperText={
                                    <Typography variant="body2">
                                        {errors?.cycleReleasePercent?.message.toString()}
                                    </Typography>
                                }
                            />
                        )}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Step2;
