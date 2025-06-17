'use client';

import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import PrimaryCard from '@/components/Cards/PrimaryCard';
import LockIcon from 'public/assets/icons/lock.svg';
import Step1 from './Step1';
import Step2 from './Step2';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isValidUrl } from '@/utils/isValidUrl';
import { isValidAddress } from '@/utils/format';
import { isValidToken } from '@/utils/isValidToken';
import {
    useAirdropFactory,
    useServiceReceiverContract,
    useTokenContract,
} from '@/hooks/useContract';
import { Address, parseEther } from 'viem';
import {
    AIRDROP_CONTRACT_ADDRESSES,
    DEFAULT_CHAIN_ID,
    DefaultGasLimit,
    SERVICE_FEE_RECEIVERS,
} from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { useContractReads, useNetwork } from 'wagmi';
import toast from 'react-hot-toast';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import { nanoid } from 'nanoid';
import { client } from '../Provider/ChainApolloProvider';
import { useMutation } from '@apollo/client';
import { ADD_METADATA } from './query';
import { AirdropArgs, AirdropFormInput, Tx } from './types';
import { SERVICE_NAME, STEPS, VALIDATION } from './constants';
import ButtonLoader from '../ButtonLoader/ButtonLoader';
import { CHECK_STATUS } from '@/query/checkStatus';
import { useRouter } from 'next/navigation';
import { TransactionTrackingContext } from '../Provider/TransactionTrackingProvider';

const CreateAirdropForm = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [tx, setTx] = React.useState<Tx>(Tx.IDLE);
    const { addTransaction } = React.useContext(TransactionTrackingContext);

    const router = useRouter();
    const { chainId } = useActiveChainId();

    const [addMetadataToAirdrop] = useMutation(ADD_METADATA, {
        client,
    });

    const [checkStatus] = useMutation(CHECK_STATUS, {
        client,
    });

    const serviceReceiverContract = useServiceReceiverContract(
        SERVICE_FEE_RECEIVERS[chainId || DEFAULT_CHAIN_ID] as Address,
    );
    const { result: serviceFee, loading: serviceFeeLoading } = useSingleCallResult({
        contract: serviceReceiverContract,
        functionName: 'getPrice',
        args: [SERVICE_NAME],
    });

    const formMethods = useForm<AirdropFormInput>({
        mode: 'onChange',
        defaultValues: {
            tokenAddress: undefined,
            airdropName: undefined,
            description: undefined,
            facebookUrl: undefined,
            githubUrl: undefined,
            logoUrl: undefined,
            redditUrl: undefined,
            telegramUrl: undefined,
            twitterUrl: undefined,
            websiteUrl: undefined,
            youtubeUrl: undefined,
        },

        resolver: activeStep !== 2 && (yupResolver(VALIDATION[activeStep]) as any),
    });

    const {
        handleSubmit,
        trigger,
        reset,
        formState: { isSubmitting, isValid },
    } = formMethods;

    const airdropContract = useAirdropFactory(
        AIRDROP_CONTRACT_ADDRESSES[chainId || DEFAULT_CHAIN_ID] as Address,
    );

    const onSubmit: SubmitHandler<AirdropFormInput> = async (data: AirdropFormInput) => {
        try {
            setTx(Tx.WAITING);
            const res = await checkStatus();
            if (!res) throw new Error('Server is not available!');
            const {
                tokenAddress,
                airdropName,
                description,
                facebookUrl,
                githubUrl,
                logoUrl,
                redditUrl,
                telegramUrl,
                twitterUrl,
                websiteUrl: webUrl,
                youtubeUrl,
            } = data;

            const args: AirdropArgs = [
                tokenAddress as Address,
                airdropName,
                SERVICE_FEE_RECEIVERS[chainId || DEFAULT_CHAIN_ID] as Address,
            ];

            const estimatedGas = await airdropContract.estimateGas.createGempadAirdrop([...args], {
                value: serviceFee,
            } as never);

            const hash = await airdropContract.write.createGempadAirdrop([...args], {
                value: serviceFee,
                gas: estimatedGas || DefaultGasLimit,
            });

            addTransaction({ type: 'airdrop-created', hash });

            if (!hash) return;

            await addMetadataToAirdrop({
                variables: {
                    txHash: hash,
                    logoUrl,
                    webUrl,
                    facebookUrl,
                    twitterUrl,
                    githubUrl,
                    telegramUrl,
                    redditUrl,
                    youtubeUrl,
                    description,
                },
            });

            setTx(Tx.PROCESSING);
            const receipt = await waitForTransaction({ hash, chainId });
            const airdropAddress = receipt.logs[0].address;
            toast.success(
                <DescriptionWithTx title="Success" description="Airdrop created" txHash={hash} />,
            );
            router.push(`/airdrop-list/${airdropAddress}`);
        } catch (error: any) {
            console.error(error);
            toast.error(
                <DescriptionWithTx
                    title="Error"
                    description={error.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTx(Tx.IDLE);
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (!isValid) {
            trigger();
            return;
        }
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        justifyContent: 'space-between',
                        mt: '36px',
                        px: '30px',
                    }}
                >
                    <Typography variant="h5" fontSize={20}>
                        Create New Airdrop
                    </Typography>
                    <LockIcon />
                </Box>
                <PrimaryCard py={30} mt={12}>
                    {activeStep === 0 && (
                        <Step1
                            serviceFee={serviceFee as bigint}
                            serviceFeeLoading={serviceFeeLoading}
                        />
                    )}
                    {activeStep === 1 && <Step2 />}
                    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                        {activeStep !== 0 && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                sx={{ mr: 1 }}
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                        )}

                        <>
                            {activeStep === STEPS.length - 1 ? (
                                <Button
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    disabled={isSubmitting}
                                >
                                    {tx === Tx.IDLE && 'Submit'}
                                    {tx === Tx.WAITING && <ButtonLoader text="Pending" />}
                                    {tx === Tx.PROCESSING && <ButtonLoader text="Processing" />}
                                </Button>
                            ) : (
                                <Button size="large" variant="contained" onClick={handleNext}>
                                    Next
                                </Button>
                            )}
                        </>
                    </Box>
                </PrimaryCard>
            </form>
        </FormProvider>
    );
};

export default CreateAirdropForm;
