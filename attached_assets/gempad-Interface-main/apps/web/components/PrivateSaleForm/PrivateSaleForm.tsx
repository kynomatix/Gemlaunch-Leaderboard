'use client';

import {
    CURRENCY_ADDRESS,
    CURRENCY_DECIMALS,
    DEFAULT_CHAIN_ID,
    DefaultGasLimit,
    PRIVATE_SALE_CONTRACT_ADDRESSES,
    SERVICE_FEE_RECEIVERS,
} from '@/constants';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { usePrivateSaleFactory, useServiceReceiverContract } from '@/hooks/useContract';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { dateToUnix, daysToMinutes } from '@/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Address, parseUnits } from 'viem';
import { waitForTransaction } from 'wagmi/actions';
import PrimaryCard from '../Cards/PrimaryCard';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import { DEFAULTS, SERVICE_NAME, STEPS } from './constants';
import { PrivateSaleArgs, PrivateSaleFormInput, Transaction, Whitelist } from './types';
import { VALIDATIONS } from './validation';
import { client } from '../Provider/ChainApolloProvider';
import { TransactionTrackingContext } from '../Provider/TransactionTrackingProvider';
import { useMutation } from '@apollo/client';
import { ADD_METADATA } from './query';
import { CHECK_STATUS } from '@/query/checkStatus';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Enable UTC plugin
import { useRouter } from 'next/navigation';
import ButtonLoader from '../ButtonLoader/ButtonLoader';

dayjs.extend(utc);

export default function PrivateSaleForm() {
    const router = useRouter();
    const isMobile = useMediaQuery('(max-width:850px)');
    const { addTransaction } = React.useContext(TransactionTrackingContext);
    const { chainId } = useActiveChainId();
    const serviceReceiverContract = useServiceReceiverContract(
        SERVICE_FEE_RECEIVERS[chainId || DEFAULT_CHAIN_ID] as Address,
    );

    const [addMetadataToPrivateSale] = useMutation(ADD_METADATA, {
        client,
    });

    const [checkStatus] = useMutation(CHECK_STATUS, {
        client,
    });

    const [activeStep, setActiveStep] = React.useState(0);
    const [transaction, setTransaction] = React.useState(Transaction.IDLE);
    const privateSaleContract = usePrivateSaleFactory(
        PRIVATE_SALE_CONTRACT_ADDRESSES[chainId || DEFAULT_CHAIN_ID] as Address,
    );

    const { result: serviceFee, loading: serviceFeeLoading } = useSingleCallResult({
        contract: serviceReceiverContract,
        functionName: 'getPrice',
        args: [SERVICE_NAME],
    });

    const formMethods = useForm<PrivateSaleFormInput>({
        mode: 'all',
        defaultValues: DEFAULTS,
        resolver: activeStep !== 3 && (yupResolver(VALIDATIONS[activeStep]) as any),
    });

    const {
        handleSubmit,
        trigger,
        reset,
        watch,
        formState: { isSubmitting, isValid },
    } = formMethods;

    const onSubmit: SubmitHandler<PrivateSaleFormInput> = async (data) => {
        try {
            setTransaction(Transaction.WAITING);
            const res = await checkStatus();
            if (!res) throw new Error('Server is not available!');

            const {
                title,
                softCap,
                hardCap,
                minBuy,
                maxBuy,
                startTime,
                endTime,
                firstFundRelease,
                vestingPeriodEachCycle,
                cycleReleasePercent,
                whitelist,
                currency,
                facebookUrl,
                githubUrl,
                logoUrl,
                redditUrl,
                telegramUrl,
                twitterUrl,
                websiteUrl: webUrl,
                youtubeUrl,
                description,
            } = data;

            const isWhitlistEnable = whitelist === Whitelist.DISABLE ? 0 : 1;
            const currecnyDecimals = CURRENCY_DECIMALS[CURRENCY_ADDRESS[currency]];

            // args to pass
            const args: PrivateSaleArgs = [
                {
                    name: title,
                    softCap: parseUnits(softCap.toString(), currecnyDecimals),
                    hardCap: parseUnits(hardCap.toString(), currecnyDecimals),
                    minBuyLimit: parseUnits(minBuy.toString(), currecnyDecimals),
                    maxBuyLimit: parseUnits(maxBuy.toString(), currecnyDecimals),
                    startTime: BigInt(dayjs.utc(String(startTime)).unix()),
                    endTime: BigInt(dayjs.utc(String(endTime)).unix()),
                    finalizeTime: 0n,
                    publicSaleTime: 0n,
                },
                {
                    initialRelease: BigInt(firstFundRelease * 1e3),
                    cyclePercent: BigInt(cycleReleasePercent * 1e3),
                    cycleInterval: BigInt(vestingPeriodEachCycle * 24 * 60 * 60), // minutes to seconds
                },
                isWhitlistEnable,
                SERVICE_FEE_RECEIVERS[chainId || DEFAULT_CHAIN_ID] as Address, // fund reciever address
                CURRENCY_ADDRESS[currency] as Address,
            ];

            const estimatedGas = await privateSaleContract.estimateGas.createPrivateSale(
                [...args],
                { value: serviceFee } as never,
            );

            const hash = await privateSaleContract.write.createPrivateSale([...args], {
                gas: estimatedGas || DefaultGasLimit,
                value: serviceFee,
            });
            addTransaction({ type: 'private-sale-created', hash });

            await addMetadataToPrivateSale({
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

            setTransaction(Transaction.PROCESSING);
            const receipt = await waitForTransaction({ hash, chainId });
            const privateSaleAddress = receipt.logs[0].address;
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Private sale created"
                    txHash={hash}
                    txChainId={chainId}
                />,
            );
            router.push(`/private-sale-list/${privateSaleAddress}`);
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name ?? 'Error'}
                    description={e.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTransaction(Transaction.IDLE);
        }
    };

    const handleNext = (e: any) => {
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
                <Box sx={{ width: '100%' }}>
                    <PrimaryCard px={36} py={25} mt={30}>
                        <Stepper
                            activeStep={activeStep}
                            orientation={isMobile ? 'vertical' : 'horizontal'}
                            sx={{
                                height: { xs: 'auto', lg: '220px' },
                                mt: { xs: 'auto', lg: '-71px' },
                            }}
                        >
                            {STEPS.map(({ label, desc }, index) => {
                                const stepProps: { completed?: boolean } = {};
                                const labelProps: {
                                    optional?: React.ReactNode;
                                } = {};

                                return (
                                    <Step
                                        key={label}
                                        {...stepProps}
                                        sx={{
                                            '.MuiStepIcon-root': {
                                                color:
                                                    activeStep >= index ? '#22CDA6' : '#ffffff30',
                                                width: {
                                                    md: '28px',
                                                    lg: '32px',
                                                },
                                                height: {
                                                    md: '28px',
                                                    lg: '32px',
                                                },
                                            },
                                        }}
                                    >
                                        <StepLabel {...labelProps} icon={`0${index + 1}`}>
                                            <Typography
                                                fontSize={12}
                                                fontWeight={600}
                                                sx={{
                                                    color:
                                                        activeStep >= index
                                                            ? '#22CDA6'
                                                            : '#FFFFFF30',
                                                }}
                                            >
                                                {label}
                                            </Typography>
                                        </StepLabel>
                                        <Typography
                                            sx={{
                                                display: { xs: 'none', lg: 'flex' },
                                                position: 'absolute',
                                                ml: 5,
                                                // mr: 10,
                                                // mt: '13.5px',
                                                maxWidth: '205px',
                                                flexWrap: 'wrap',
                                                zIndex: 20,
                                                fontSize: {
                                                    sm: 10,
                                                    md: 11,
                                                    lg: 12,
                                                },
                                                pr: 2,
                                                // border: '1px solid red',
                                                color:
                                                    activeStep >= index ? '#ffffff' : '#ffffff30',
                                            }}
                                        >
                                            {desc}
                                        </Typography>
                                    </Step>
                                );
                            })}
                        </Stepper>
                    </PrimaryCard>
                    <PrimaryCard mt={30} mb={30} py={30}>
                        <Box>
                            {activeStep === 0 && (
                                <Step1
                                    serviceFee={serviceFee as bigint}
                                    serviceFeeLoading={serviceFeeLoading}
                                />
                            )}
                            {activeStep === 1 && <Step2 />}
                            {activeStep === 2 && <Step3 />}
                            {activeStep === 3 && <Step4 />}
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '10px',
                                alignItems: 'center',
                                pt: 2,
                            }}
                        >
                            {activeStep !== 0 && (
                                <Button
                                    size="large"
                                    variant="outlined"
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Back
                                </Button>
                            )}
                            {activeStep === STEPS.length - 1 ? (
                                <Button
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    disabled={isSubmitting}
                                >
                                    {transaction === Transaction.WAITING && (
                                        <ButtonLoader text="Waiting" />
                                    )}
                                    {transaction === Transaction.PROCESSING && (
                                        <ButtonLoader text="Processing" />
                                    )}
                                    {transaction === Transaction.IDLE && 'Submit'}
                                </Button>
                            ) : (
                                <Button size="large" variant="contained" onClick={handleNext}>
                                    Next
                                </Button>
                            )}
                        </Box>
                    </PrimaryCard>
                </Box>
            </form>
        </FormProvider>
    );
}
