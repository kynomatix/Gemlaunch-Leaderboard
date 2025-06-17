import { CURRENCY_SYMBOLS, NATIVE_CURRENCY_SYMBOLS } from '@/constants';
import {
    Box,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Skeleton,
    TextField,
    Typography,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { formatEther } from 'viem';
import { useNetwork } from 'wagmi';
import { Currency } from './types';
import { getCurrencySymbol } from '@/utils/getCurrencySymbolByAddress';
import { getCurrencySymbolByEnum } from './utils';
import { useActiveChainId } from '@/hooks/useActiveChainId';

const Step1 = ({
    serviceFee,
    serviceFeeLoading,
}: {
    serviceFee: bigint;
    serviceFeeLoading: boolean;
}) => {
    const { chainId } = useActiveChainId();

    const {
        control,
        watch,
        formState: { errors },
    } = useFormContext();
    const currency = watch('currency');

    return (
        <Box>
            <Box>
                <Box sx={{ mb: '16px' }}>
                    <Typography variant="h5" ml={2} sx={{ mb: '9px' }}>
                        Title <span style={{ color: '#FF8484' }}>*</span>
                    </Typography>

                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="text"
                                fullWidth
                                placeholder="Ex: Gemlaunch"
                                error={!!errors?.title}
                                helperText={
                                    <>
                                        <Typography variant="body2">
                                            {errors?.title?.message.toString()}
                                        </Typography>
                                        {serviceFeeLoading ? (
                                            <Skeleton
                                                animation="wave"
                                                variant="rounded"
                                                width={100}
                                                height={20}
                                            />
                                        ) : (
                                            <Typography
                                                color="primary"
                                                variant="body1"
                                                fontSize={14}
                                            >
                                                Fee: {formatEther(serviceFee ?? 0n)}{' '}
                                                {NATIVE_CURRENCY_SYMBOLS[chainId]}
                                            </Typography>
                                        )}
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
                    flexDirection: 'column',
                    gap: '15px',
                    ml: '15px',
                    mt: '18px',
                }}
            >
                <FormControl>
                    <FormLabel id="currency">
                        <Typography color="common.white" variant="h5">
                            Currency
                        </Typography>
                    </FormLabel>
                    <Controller
                        name="currency"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup {...field}>
                                <FormControlLabel
                                    value={Currency.NATIVE}
                                    control={<Radio sx={{ color: '#fff' }} />}
                                    label={NATIVE_CURRENCY_SYMBOLS[chainId]}
                                />
                                <FormControlLabel
                                    value={Currency.USDT}
                                    control={<Radio sx={{ color: '#fff' }} />}
                                    label="USDT"
                                />
                                <FormControlLabel
                                    value={Currency.USDC}
                                    control={<Radio sx={{ color: '#fff' }} />}
                                    label="USDC"
                                />
                            </RadioGroup>
                        )}
                    />
                    <Typography variant="h5" fontSize={'12px'} color="primary">
                        Users will pay with {getCurrencySymbolByEnum(chainId, currency)} for your
                        token
                    </Typography>
                </FormControl>
            </Box>
        </Box>
    );
};

export default Step1;
