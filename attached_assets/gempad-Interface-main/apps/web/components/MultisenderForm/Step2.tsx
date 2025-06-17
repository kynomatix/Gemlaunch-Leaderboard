import React from 'react';
import {
    Box,
    Typography,
    FormControl,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    Radio,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { shortenAddress } from '@/utils/format';
import { useTokenContract } from '@/hooks/useContract';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { useAccount, useBalance, useContractReads, useNetwork, useToken } from 'wagmi';
import { Address, formatEther, formatUnits, parseUnits } from 'viem';
import { Controller, useFormContext } from 'react-hook-form';
import { EnsureExactAmount, RowProps, Step2Props } from './types';
import Row from './Row';

import { NATIVE_CURRENCY_SYMBOLS } from '@/constants';

const Step2 = ({
    totalReceivers,
    totalTransferableAmount,
    isNativeCurrency,
    approveAmount,
    totalTransactions,
}: Step2Props) => {
    const isMobile = useMediaQuery('(max-width: 700px)');
    const { address } = useAccount();

    const { chain } = useNetwork();
    const chainId = chain?.id;

    const { watch, control } = useFormContext();

    const allocations = watch('allocations');
    const tokenAddress = watch('tokenAddress');

    const lines = allocations.trim().split('\n');

    const { data: tokenData } = useToken({
        address: tokenAddress as Address,
    });

    const { data: nativeBalance } = useBalance({ address });
    const { data: tokenBalance } = useBalance({
        address,
        token: tokenAddress as Address,
    });

    const nativeTokenBalance = +formatUnits(nativeBalance?.value || 0n, tokenData?.decimals ?? 18);
    const erc20TokenBalance = +formatUnits(tokenBalance?.value || 0n, tokenData?.decimals ?? 18);

    const balance = isNativeCurrency ? nativeTokenBalance : erc20TokenBalance;
    const tokenToSend = isNativeCurrency ? NATIVE_CURRENCY_SYMBOLS[chainId] : tokenData?.symbol;

    const rowsData = [
        { id: 1, property: 'Total Address', value: totalReceivers },
        {
            id: 2,
            property: 'Total amount to send',
            value: formatUnits(approveAmount, tokenData?.decimals ?? 18),
        },
        { id: 3, property: 'Number of Transaction', value: totalTransactions ?? 1 },
        { id: 4, property: 'Your token balance', value: balance },
        { id: 5, property: 'Token to send', value: tokenToSend },
    ];

    return (
        <Box>
            <Box>
                {rowsData.map(({ id, ...rest }) => (
                    <Row key={id} {...(rest as RowProps)} />
                ))}
            </Box>

            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom: '1px solid #ffffff25',
                        pb: '19px',
                        pt: '9px',
                    }}
                >
                    <Typography sx={{ flex: 2 }} fontWeight={600} fontSize={14}>
                        Address
                    </Typography>
                    <Typography
                        sx={{ flex: 1, borderLeft: '1px solid #ffffff25', pl: '15px' }}
                        fontWeight={600}
                        fontSize={14}
                    >
                        Amount
                    </Typography>
                </Box>
                <Box sx={{ overflowY: 'auto', maxHeight: '400px' }}>
                    {lines.map((item, idx) => {
                        const [address, amount] = item.split(',');
                        return (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderBottom: '1px solid #ffffff25',
                                    pb: '14px',
                                    mt: '14px',
                                }}
                            >
                                <Typography
                                    color="primary"
                                    sx={{ flex: 2 }}
                                    variant="body1"
                                    fontSize={14}
                                >
                                    <span style={{ color: '#fff' }}>{idx + 1}.</span>{' '}
                                    {isMobile ? shortenAddress(address) : address}
                                </Typography>
                                <Typography
                                    sx={{ flex: 1, pl: '15px' }}
                                    fontSize={14}
                                    fontWeight={600}
                                >
                                    {amount}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            <FormControl sx={{ mt: '20px' }}>
                <FormLabel id="currency">
                    <Typography color="common.white" variant="h5">
                        Send options
                    </Typography>
                </FormLabel>
                <Controller
                    name="ensureExactAmount"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            {...field}
                            row
                            aria-labelledby="send-options"
                            defaultValue={EnsureExactAmount.UNSAFE}
                            name="radio-buttons-group"
                        >
                            <FormControlLabel
                                value={EnsureExactAmount.SAFE}
                                control={<Radio sx={{ color: '#fff' }} />}
                                label="Safe mode"
                            />
                            <FormControlLabel
                                value={EnsureExactAmount.UNSAFE}
                                control={<Radio sx={{ color: '#fff' }} />}
                                label="Unsafe mode"
                            />
                        </RadioGroup>
                    )}
                />
            </FormControl>
        </Box>
    );
};

export default Step2;
