'use client';

import React from 'react';
import { Box, CircularProgress, Skeleton, TextField, Typography } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';
import { Controller, useFormContext } from 'react-hook-form';
import { Address, formatEther, formatUnits } from 'viem';
import { useTokenContract } from '@/hooks/useContract';
import { useAccount, useContractReads, useNetwork } from 'wagmi';
import { NATIVE_CURRENCY_SYMBOLS } from '@/constants';

const Step1 = ({
    serviceFee,
    serviceFeeLoading,
}: {
    serviceFee: bigint;
    serviceFeeLoading: boolean;
}) => {
    const {
        control,
        watch,
        formState: { errors },
    } = useFormContext();

    const tokenAddress = watch('tokenAddress');
    const tokenContract = useTokenContract(tokenAddress as Address);

    const { address } = useAccount();
    const { chain } = useNetwork();
    const chainId = chain?.id;

    const { data: tokenData, isLoading: isTokenLoading } = useContractReads({
        contracts: [
            {
                ...tokenContract,
                functionName: 'name',
            },
            {
                ...tokenContract,
                functionName: 'symbol',
            },
            {
                ...tokenContract,
                functionName: 'decimals',
            },
            {
                ...tokenContract,
                functionName: 'balanceOf',
                args: [address],
            },
        ],
    });

    const tokenName: string = !isTokenLoading && tokenData?.[0]?.result;
    const tokenSymbol: string = !isTokenLoading && (tokenData?.[1]?.result as string);
    const tokenDecimals: number = !isTokenLoading && (tokenData?.[2]?.result as number);
    const tokenBalance: bigint = !isTokenLoading && (tokenData?.[3]?.result as bigint);
    const isTokenDataAvailable = tokenName && tokenSymbol && tokenDecimals && tokenBalance;

    const statics = [
        { id: 1, property: 'Name', value: tokenName },
        { id: 2, property: 'Symbol', value: tokenSymbol },
        { id: 3, property: 'Decimals', value: tokenDecimals },
        { id: 4, property: 'Balance', value: tokenBalance },
    ];

    return (
        <Box>
            <Box>
                <Typography variant="h5" ml={2} sx={{ mb: '9px' }}>
                    Token Address <span style={{ color: '#FF8484' }}>*</span>
                </Typography>
                <Controller
                    name="tokenAddress"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="text"
                            defaultValue={field.value || ''}
                            fullWidth
                            error={!!errors?.tokenAddress}
                            placeholder="Enter token or LP token address"
                            helperText={
                                <>
                                    <Typography variant="body2">
                                        {errors?.tokenAddress?.message?.toString()}
                                    </Typography>
                                    {serviceFeeLoading ? (
                                        <Skeleton
                                            animation="wave"
                                            variant="rounded"
                                            width={100}
                                            height={20}
                                        />
                                    ) : (
                                        <Typography color="primary" variant="body1" fontSize={14}>
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
            {isTokenLoading && (
                <Box mt={3}>
                    <Skeleton
                        variant="rounded"
                        animation="wave"
                        height={150}
                        sx={{ width: '100%', borderRadius: '15px' }}
                    />
                </Box>
            )}
            {isTokenDataAvailable && (
                <PrimaryCard mt={24}>
                    {statics.map(({ id, property, value }) => (
                        <Box
                            key={id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                justifyContent: 'space-between',
                                mb: '9px',
                            }}
                        >
                            <Typography variant="h5" fontSize={15}>
                                {property}
                            </Typography>
                            <Typography variant="h5" fontSize={15}>
                                {id === 4
                                    ? formatUnits(
                                          value as bigint,
                                          (tokenData[2]?.result as unknown as number) || 18,
                                      ).toString()
                                    : value?.toString()}
                            </Typography>
                        </Box>
                    ))}
                </PrimaryCard>
            )}
        </Box>
    );
};

export default Step1;
