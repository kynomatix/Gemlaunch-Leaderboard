'use client';

import React from 'react';
import { Box, Typography, Button, TextField, Skeleton, Collapse } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import TextFieldHead from '../TextField/TextFieldHead';
import TextFieldError from '../TextField/TextFieldError';
import useTokenDetails from '@/hooks/useTokenDetails';
import { AntibotFormInput } from './types';
import { yupResolver } from '@hookform/resolvers/yup';
import { ANTIBOT_VALIDATION } from './validation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { ANTIBOT_CONTRACT_ADDRESSES } from '@/constants';
import { Address } from 'viem';
import { useAccount, useContractRead, useNetwork } from 'wagmi';
import { useCreateAntibotContract, useERC20, useStandardAntibot } from '@/hooks/useContract';
import Infobar from '../Infobar/Infobar';
import { StandardAntibotTokenABI } from '@/config/abi/standardAntibotToken';
import WalletConnectButton from '../WalletConnectButton/WalletConnectButton';

const AntiBot = () => {
    const { address } = useAccount();

    const { chain } = useNetwork();
    const chainId = chain?.id;

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<AntibotFormInput>({
        mode: 'onChange',
        defaultValues: { tokenAddress: undefined },
        resolver: yupResolver(ANTIBOT_VALIDATION) as any,
    });
    const tokenAddress = watch('tokenAddress');

    const { data } = useContractRead({
        address: tokenAddress as Address,
        abi: StandardAntibotTokenABI,
        functionName: 'gemAntiBot',
    });

    const antibotAddress = data ?? undefined;
    const gemAntiBotAddress = ANTIBOT_CONTRACT_ADDRESSES[chainId];

    const isValidGemAntiBot = gemAntiBotAddress?.toLowerCase() === antibotAddress?.toLowerCase();

    const {
        state: { isFetching, tokenDetails },
    } = useTokenDetails(tokenAddress);
    const isTokenDetailsAvailable = !!tokenDetails;

    return (
        <PrimaryCard mt={30} py={25}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '10px',
                    mb: '9px',
                }}
            >
                <TextFieldHead title="Token Address" isRequired={true} />
                <Link href='/create-token'>
                <Button
                    variant="outlined"
                    size="small"
                    sx={{ px: '17px', display: { xs: 'none', md: 'flex' } }}
                >
                    Create Token
                </Button></Link>
            </Box>

            <Controller
                name="tokenAddress"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        placeholder="Enter token address"
                        fullWidth
                        value={field.value}
                        error={!!errors?.tokenAddress}
                        helperText={
                            <>
                                <Collapse in={!!errors?.tokenAddress}>
                                    <TextFieldError fieldName={errors?.tokenAddress} />
                                </Collapse>
                                <Typography color="primary" variant="h5" fontSize={12}>
                                    Choose a token to integrate with Gem Anti-Bot. <br />
                                    Check out the guide for how to integrate Gem Anti-Bot for custom
                                    contract here:{' '}
                                    <Link
                                        href="https://gems-organization-1.gitbook.io/gemlaunch/gem-anti-bot/gem-anti-bot-guide"
                                        target="_blank"
                                    >
                                        <span
                                            style={{
                                                textDecoration: 'underline',
                                                color: '#11B6DB',
                                            }}
                                        >
                                            Guide
                                        </span>
                                    </Link>
                                </Typography>
                            </>
                        }
                    />
                )}
            />

            <Collapse in={isFetching || isTokenDetailsAvailable}>
                {isFetching && (
                    <Box sx={{ width: '100%', mt: '20px', mb: '30px' }}>
                        <Skeleton
                            variant="rounded"
                            animation="wave"
                            height={150}
                            sx={{ width: '100%', borderRadius: '15px' }}
                        />
                    </Box>
                )}
                {isTokenDetailsAvailable && (
                    <PrimaryCard mt={20} mb={30}>
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
                                    <Typography variant="h5" fontSize={12}>
                                        {property}
                                    </Typography>
                                    <Typography variant="h5" fontSize={12}>
                                        {value}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </PrimaryCard>
                )}
            </Collapse>

            <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={3}>
                {address ? (
                    <>
                        {isValidGemAntiBot && (
                            <Link href={`/antibot/${tokenAddress}`}>
                                <Button variant="contained" size="large">
                                    Next
                                </Button>
                            </Link>
                        )}
                        {!isValidGemAntiBot && (
                            <Button variant="contained" size="large" disabled>
                                Next
                            </Button>
                        )}
                    </>
                ) : (
                    <WalletConnectButton />
                )}
            </Box>

            <Box mt={3}>
                <Infobar
                    dismissable={false}
                    open={!isValidGemAntiBot && isTokenDetailsAvailable}
                    message="This token is unable to implement Gem Anti-Bot. Please try with another token"
                    variant="error"
                />
            </Box>
        </PrimaryCard>
    );
};

export default AntiBot;
