import React from 'react';
import {
    Box,
    Button,
    Collapse,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Skeleton,
    TextField,
    Typography,
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Controller, SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import { TokenDetails } from '@/hooks/useTokenDetails';
import {
    LaunchpadAffiliateProgram,
    LaunchpadCurrencies,
    LaunchpadFormInput,
    ListingOptions,
} from '@/components/LaunchpadForm/types';
import PrimaryCard from '../Cards/PrimaryCard';
import Infobar from '../Infobar/Infobar';
import { isValidToken } from '@/utils/isValidToken';
import { useServiceReceiverContract } from '@/hooks/useContract';
import { Address, formatEther } from 'viem';
import { DEFAULT_CHAIN_ID, NATIVE_CURRENCY_SYMBOLS, SERVICE_FEE_RECEIVERS } from '@/constants';
import { useAccount, useNetwork } from 'wagmi';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { disableScroll } from '@/utils/disableScroll';
import { CURRENCY_ADDRESSES } from './constants';
import { useActiveChainId } from '@/hooks/useActiveChainId';

interface Step1Props {
    tokenDetails: TokenDetails[];
    isTokenDetailsAvailable: boolean;
    isFetching: boolean;
    serviceFee: bigint;
    serviceFeeLoading: boolean;
    feePercentNum: number;
    feePercentLoading: boolean;
}

const Step1 = ({
    tokenDetails,
    isFetching,
    isTokenDetailsAvailable,
    serviceFee,
    serviceFeeLoading,
    feePercentNum,
    feePercentLoading,
}: Step1Props) => {
    const [openTransferFee, setOpenTransferFee] = React.useState<boolean>(false);
    const [openCurrency, setOpenCurrency] = React.useState<boolean>(false);
    const { address } = useAccount();
    const pathname = usePathname();

    const { chainId } = useActiveChainId();

    // react-hook-form
    const {
        control,
        watch,
        register,
        formState: { errors },
    } = useFormContext<LaunchpadFormInput>();
    const tokenAddress = watch('tokenAddress');
    const affiliateProgram = watch('affiliateProgram');
    const currency = watch('currency');
    const listingOptions = watch('listingOptions');
    const feeOptions = watch('feeOptions');

    // fetching token details

    // displaing infrobars
    React.useEffect(() => {
        if (isTokenDetailsAvailable) {
            setOpenTransferFee(true);
        }

        if (currency !== LaunchpadCurrencies.NATIVE) {
            setOpenCurrency(true);
        } else {
            setOpenCurrency(false);
        }
    }, [isTokenDetailsAvailable, currency]);

    const currencySymbol =
        currency === LaunchpadCurrencies.NATIVE
            ? NATIVE_CURRENCY_SYMBOLS[chainId || DEFAULT_CHAIN_ID]
            : currency;

    return (
        <Box>
            {/* // tricky hack to bypass the bug in react-hook-form */}
            {/* // https://github.com/react-hook-form/react-hook-form/issues/2755 */}
            <input
                type="hidden"
                {...register('step1', {
                    shouldUnregister: true,
                })}
            />
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        mb: '16px',
                    }}
                >
                    <Typography variant="h5" ml={2}>
                        Token address <span style={{ color: '#FF8484' }}>*</span>
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        <Link href="/create-token">
                            <Button variant="outlined">Create Token</Button>
                        </Link>
                    </Box>
                </Box>

                <Controller
                    name="tokenAddress"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="text"
                            fullWidth
                            placeholder="Ex: 0x0A6aD098F65C048d1aa263d38eA174e781ae6899"
                            error={!!errors?.tokenAddress}
                            helperText={
                                <>
                                    <Typography variant="body2">
                                        {errors?.tokenAddress?.message}
                                    </Typography>
                                    {address && (
                                        <>
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
                                                    Fee: {formatEther((serviceFee as bigint) ?? 0n)}{' '}
                                                    {
                                                        NATIVE_CURRENCY_SYMBOLS[
                                                            chainId || DEFAULT_CHAIN_ID
                                                        ]
                                                    }
                                                </Typography>
                                            )}
                                        </>
                                    )}
                                </>
                            }
                        />
                    )}
                />

                <Box mt={3}>
                    {isFetching && (
                        <Box sx={{ width: '100%', mb: 2 }}>
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
                                            {value?.toString()}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </PrimaryCard>
                    )}
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
                            <RadioGroup {...field} value={field.value}>
                                <FormControlLabel
                                    value={LaunchpadCurrencies.NATIVE}
                                    control={<Radio sx={{ color: '#fff' }} />}
                                    label={NATIVE_CURRENCY_SYMBOLS[chainId || DEFAULT_CHAIN_ID]}
                                />
                                {address && (
                                    <>
                                        {/* <FormControlLabel
                                            value={LaunchpadCurrencies.BUSD}
                                            control={<Radio sx={{ color: '#fff' }} />}
                                            label="BUSD"
                                        /> */}
                                        <FormControlLabel
                                            value={LaunchpadCurrencies.USDT}
                                            control={<Radio sx={{ color: '#fff' }} />}
                                            label="USDT"
                                        />
                                        <FormControlLabel
                                            value={LaunchpadCurrencies.USDC}
                                            control={<Radio sx={{ color: '#fff' }} />}
                                            label="USDC"
                                        />
                                    </>
                                )}
                            </RadioGroup>
                        )}
                    />

                    <Typography variant="h5" fontSize={'12px'} color="primary">
                        Users will pay with {currencySymbol} for your token
                    </Typography>
                </FormControl>

                <FormControl>
                    <FormLabel id="currency">
                        <Typography color="common.white" variant="h5">
                            Fee Options
                        </Typography>
                    </FormLabel>
                    <Controller
                        name="feeOptions"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup {...field} value={feePercentNum}>
                                <FormControlLabel
                                    value={feePercentNum}
                                    control={<Radio sx={{ color: '#fff' }} />}
                                    label={
                                        feePercentLoading ? (
                                            <Skeleton
                                                animation="wave"
                                                variant="rounded"
                                                width={100}
                                                height={20}
                                            />
                                        ) : (
                                            `${feePercentNum}% ${currencySymbol} raised only`
                                        )
                                    }
                                />
                                {/* <FormControlLabel
                                    value={LaunchpadFeeOptions.OTHERS}
                                    control={<Radio sx={{ color: '#fff' }} />}
                                    label={
                                        LaunchpadFeeOptions.OTHERS === feeOptions
                                            ? `2% ${currency} raised + 2% token sold`
                                            : 'Other'
                                    }
                                /> */}
                            </RadioGroup>
                        )}
                    />
                </FormControl>

                {(pathname === '/create-launchpad' || pathname === '/create-fair-launch') && (
                    <FormControl>
                        <FormLabel id="listingOptions">
                            <Typography color="common.white" variant="h5">
                                Listing Options
                            </Typography>
                        </FormLabel>
                        <Controller
                            name="listingOptions"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup {...field} value={field.value}>
                                    <FormControlLabel
                                        value={ListingOptions.AUTO}
                                        control={<Radio sx={{ color: '#fff' }} />}
                                        label="Auto Listing"
                                    />
                                    {/* TODO: need to handle it for manual listing */}
                                    <FormControlLabel
                                        value={ListingOptions.MANUAL}
                                        control={<Radio sx={{ color: '#fff' }} />}
                                        label="Manual Listing"
                                    />
                                </RadioGroup>
                            )}
                        />
                    </FormControl>
                )}

                {(pathname.toLowerCase() === '/create-fair-launch' ||
                    pathname.toLowerCase() === '/create-launchpad') && (
                    <FormControl>
                        <FormLabel id="currency">
                            <Typography color="common.white" variant="h5">
                                Affiliate Program
                            </Typography>
                        </FormLabel>
                        <Controller
                            name="affiliateProgram"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup {...field} value={field.value}>
                                    <FormControlLabel
                                        value={LaunchpadAffiliateProgram.DISABLED}
                                        control={<Radio sx={{ color: '#fff' }} />}
                                        label="Disable Affiliate"
                                    />
                                    <FormControlLabel
                                        value={LaunchpadAffiliateProgram.ENABLED}
                                        control={<Radio sx={{ color: '#fff' }} />}
                                        label="Enable Affiliate"
                                    />
                                </RadioGroup>
                            )}
                        />

                        <Collapse in={affiliateProgram === LaunchpadAffiliateProgram.ENABLED}>
                            <Controller
                                name="affiliatePercentage"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="number"
                                        onWheel={disableScroll}
                                        placeholder="Ex: 1"
                                        error={!!errors?.affiliatePercentage}
                                        helperText={
                                            <>
                                                <Typography variant="body2" fontSize={12}>
                                                    {errors?.affiliatePercentage?.message}
                                                </Typography>
                                                <Typography
                                                    color="primary"
                                                    variant="h5"
                                                    fontSize={12}
                                                >
                                                    The amount of raised currency that uses for the
                                                    affiliate program.
                                                </Typography>
                                            </>
                                        }
                                    />
                                )}
                            />
                        </Collapse>
                    </FormControl>
                )}
            </Box>

            <Box mt={1}>
                <Infobar
                    dismissable={true}
                    setOpen={setOpenTransferFee}
                    open={openTransferFee}
                    message="Make sure the token has 'Exclude transfer fee' function if it has transfer fees."
                />
            </Box>
            <Box mt={1}>
                <Infobar
                    dismissable={true}
                    setOpen={setOpenCurrency}
                    open={openCurrency}
                    message="Do not use this currency for auto liquidity tokens, or tokens that depend on WETH pair. It will lead to error when finalizing the pool or transfering the tokens (for example Liquidity Generator Token, BabyToken, Buyback Baby Token). Contact Gemlaunch for more information."
                />
            </Box>
            <Box mt={1}>
                <Infobar
                    dismissable={false}
                    open={
                        pathname === '/create-fair-launch' && listingOptions === ListingOptions.AUTO
                    }
                    message="For auto listing, after you finalize the pool your token will be auto listed on DEX."
                />
            </Box>
            <Box mt={1}>
                <Infobar
                    dismissable={false}
                    open={listingOptions === ListingOptions.MANUAL}
                    message={`For manual listing, Gemlaunch won't charge tokens for liquidity.You may withdraw ${currencySymbol} after the pool ends then do DEX listing yourself.`}
                />
            </Box>
        </Box>
    );
};

export default Step1;
