'use client';

import * as React from 'react';
import {
    Buyback,
    DutchInfo,
    DutchLiquidity,
    DutchVesting,
    FairLaunchSubmission,
    Info,
    LaunchpadAffiliateProgram,
    LaunchpadFormInput,
    LaunchpadInfo,
    LaunchpadLiquidity,
    LaunchpadTransaction,
    LaunchpadVesting,
    LaunchpadWhitelist,
    Liquidity,
    ListingOptions,
    RefundType,
    SubscriptionLiquidity,
} from '@/components/LaunchpadForm/types';
import {
    ADDRESS_ZERO,
    CURRENCY_ADDRESS,
    DEFAULT_CHAIN_ID,
    DUTCH_AUCTION_CONTRACT_ADDRESSES,
    DefaultGasLimit,
    FAIRLAUNCH_CONTRACT_ADDRESSES,
    LAUNCHPAD_FACTORY_CONTRACT_ADDRESSES,
    LOCKER_CONTRACT_ADDRESSES,
    ROUTERS,
    Router,
    SERVICE_FEE_RECEIVERS,
    SUBSCRIPTION_CONTRACT_ADDRESSES,
} from '@/constants';
import { useCurrency, useToken } from '@/hooks/Tokens';
import { useApproveCallback } from '@/hooks/useApproveCallback';
import {
    useCreateDutchAuctionContract,
    useCreateFairLaunchContract,
    useCreateLaunchpadFactoryContract,
    useServiceReceiverContract,
    useSubscriptionFactoryContract,
} from '@/hooks/useContract';
import useTokenDetails from '@/hooks/useTokenDetails';
import { useSingleCallResult } from '@/state/multicall/hooks';
import {
    getMinTokensToCreateDutchAuction,
    getMinTokensToCreateFairLaunh,
    getMinTokensToCreateLaunchpad,
    getMinTokensToCreateSubscription,
} from '@/utils/getMinTokens';
import tryParseAmount from '@dapp/utils/tryParseAmount';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs from 'dayjs';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Address, parseEther, parseUnits, zeroAddress } from 'viem';
import { useAccount, useConfig, useContractRead, useNetwork } from 'wagmi';
import { waitForTransaction } from 'wagmi/actions';
import PrimaryCard from '../Cards/PrimaryCard';
import Show from '../Show/Show';
import StepperButton from '../StepperButtons/StepperButton';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
// import { CURRENCY_ADDRESSES, client } from '../Provider/ChainApolloProvider';
import {
    CURRENCY_ADDRESSES,
    CURRENCY_DECIMALS,
    DEFAULT_VALUES,
    GEMPAD_DUTCH,
    GEMPAD_FAIRLAUNCH,
    GEMPAD_LAUNCHPAD,
    GEMPAD_SUBSCRIPTION,
    STEPS,
} from './constants';
import { STEP1_VALIDATION, STEP3_VALIDATION, getStep2ValidationSchema } from './validations';
import toast from 'react-hot-toast';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import { client } from '../Provider/ChainApolloProvider';
import { Button } from '@mui/material';
import { nanoid } from 'nanoid';
import { useMutation } from '@apollo/client';
import { ADD_METADATA } from './query';
import { CHECK_STATUS } from '@/query/checkStatus';
import { ServiceReceiverABI } from '@/config/abi/serviceReceiver';
import useTokenInformation from '@/hooks/useTokenInformation';
import { Currency } from '@/constants/types';
import { useTokenSupply } from '@thirdweb-dev/react';
import useFundTokenDetails from '../ViewPool/hooks/useFundTokenDetails';
import useNativeCurrency from '@/hooks/useNativeCurrency';
import { calculateFundTokenAmount, getLaunchpadRouteByContractName } from '../ViewPool/utils';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { TransactionTrackingContext } from '../Provider/TransactionTrackingProvider';

export default function LaunchpadForm() {
    const isMobile = useMediaQuery('(max-width:850px)');
    const pathname = usePathname();
    const { chainId } = useActiveChainId();
    const nextRouter = useRouter();
    const params = useSearchParams();

    const { addTransaction } = React.useContext(TransactionTrackingContext);
    const [isBalanceEnough, setIsBalanceEnough] = React.useState<boolean>(true);
    const [serviceName, setServiceName] = React.useState<string>();
    const [creationAmount, setCreationAmount] = React.useState<number>();
    const [contractAddress, setContractAddress] = React.useState<Address>();
    const hashRef = React.useRef<Address | null>(null);
    const [activeStep, setActiveStep] = React.useState(0);
    const [transaction, setTransaction] = React.useState<LaunchpadTransaction>(
        LaunchpadTransaction.IDLE,
    );

    // const routers: Router[] = ROUTERS[chainId || DEFAULT_CHAIN_ID];

    const VALIDATION_SCHEMAS = {
        0: STEP1_VALIDATION,
        1: getStep2ValidationSchema(pathname),
        2: STEP3_VALIDATION,
    };

    const [addMetadataToLaunchpad] = useMutation(ADD_METADATA, {
        client,
    });

    const [checkStatus] = useMutation(CHECK_STATUS, {
        client,
    });

    const serviceReceiverContract = useServiceReceiverContract(
        SERVICE_FEE_RECEIVERS[chainId] as Address,
    );
    const { result: serviceFee, loading: serviceFeeLoading } = useSingleCallResult({
        contract: serviceReceiverContract,
        functionName: 'getPrice',
        args: [serviceName],
    });
    const { result: feePercent, loading: feePercentLoading } = useSingleCallResult({
        contract: serviceReceiverContract,
        functionName: 'getFee',
        args: [serviceName],
    });

    const formMethods = useForm<LaunchpadFormInput>({
        mode: 'onChange',
        defaultValues: { ...DEFAULT_VALUES, feeOptions: undefined },
        resolver: activeStep !== 3 && (yupResolver(VALIDATION_SCHEMAS[activeStep]) as any),
    });

    const {
        handleSubmit,
        trigger,
        watch,
        reset,
        setValue,
        formState: { isSubmitting, isValid, errors },
    } = formMethods;

    React.useEffect(() => {
        const address = params.get('address');
        setValue('tokenAddress', address as Address);
        setValue('feeOptions', Number(feePercent) / 1e3);
    }, [feePercent, setValue, params]);

    const tokenAddress = watch('tokenAddress');
    const totalSellingAmount = watch('totalSellingAmount');
    const liquidityPercent = watch('liquidity');
    const presaleRate = watch('presaleRate');
    const hardcap = watch('hardcap');
    const softcap = watch('softcap');
    const listingOptions = watch('listingOptions');
    const listingRate = watch('listingRate');
    const feeOptions = watch('feeOptions');
    const currency = watch('currency');
    const subscriptionRate = watch('subscriptionRate');

    const feePercentNum = !feePercentLoading && Number(feePercent) / 1e3;

    const autoListing = listingOptions === ListingOptions.AUTO;

    // get tokens details
    const {
        state: { isFetching, tokenDetails },
    } = useTokenDetails(tokenAddress);

    const fundTokenCurrency = React.useMemo(() => {
        switch (currency.toUpperCase()) {
            case 'NATIVE':
                return Currency.NATIVE;
            case 'USDT':
                return Currency.USDT;
            case 'USDC':
                return Currency.USDC;
            default:
                throw new Error('Invalid currency input');
        }
    }, [currency]);

    const isNative = CURRENCY_ADDRESSES[currency][chainId] === zeroAddress;
    const { decimals: fundDecimals, totalSupply } = useTokenInformation(
        CURRENCY_ADDRESS[fundTokenCurrency] as Address,
    );
    const tokenCurrency = useToken(tokenAddress);
    const fundTokenDecimals = isNative ? 18 : fundDecimals;

    // const currencyToken = useCurrency(CURRENCY_ADDRESSES[currency][chainId])
    // const nativeCurrency = useNativeCurrency()
    // const fundToken = tokenCurrency

    const isTokenDetailsAvailable = !!tokenDetails;
    const tokenDecimals: number | string = tokenDetails?.[2]?.value;
    const tokenNeedToCreateFairLaunch: number = React.useMemo(() => {
        return getMinTokensToCreateFairLaunh({
            totalSellingAmount: totalSellingAmount as number,
            tokenFee: feePercentNum,
            liquidityPercent: liquidityPercent ? (liquidityPercent as number) : 0,
            decimals: fundTokenDecimals,
        });
    }, [fundTokenDecimals, liquidityPercent, totalSellingAmount, feePercentNum]);

    const tokenNeedToCreateLaunchpad = React.useMemo(() => {
        return getMinTokensToCreateLaunchpad({
            hardcap,
            autoListing,
            listingPrice: listingRate,
            liquidityFee: liquidityPercent,
            sellPrice: presaleRate,
            feeOptions,
        });
    }, [hardcap, autoListing, listingRate, liquidityPercent, presaleRate, feeOptions]);

    const tokenNeedToCreateDutchAuction = React.useMemo(() => {
        return getMinTokensToCreateDutchAuction({
            feeOptions: feePercentNum,
            hardcap,
            liquidityFee: liquidityPercent,
            softcap,
            totalSellingAmount,
        });
    }, [liquidityPercent, hardcap, softcap, totalSellingAmount, feePercentNum]);

    const tokenNeedToCreateSubscription: number = React.useMemo(
        () =>
            getMinTokensToCreateSubscription({
                hardcap,
                tokenFee: feePercentNum,
                listingRate,
                subscriptionRate,
                liquidityPercent,
            }),
        [hardcap, listingRate, subscriptionRate, liquidityPercent, feePercentNum],
    );

    React.useEffect(() => {
        if (pathname === '/create-fair-launch') {
            setServiceName(GEMPAD_FAIRLAUNCH);
            setCreationAmount(tokenNeedToCreateFairLaunch);
            setContractAddress(
                FAIRLAUNCH_CONTRACT_ADDRESSES[chainId || DEFAULT_CHAIN_ID] as Address,
            );
            return;
        }
        if (pathname === '/create-launchpad') {
            setServiceName(GEMPAD_LAUNCHPAD);
            setCreationAmount(tokenNeedToCreateLaunchpad);
            setContractAddress(
                LAUNCHPAD_FACTORY_CONTRACT_ADDRESSES[chainId || DEFAULT_CHAIN_ID] as Address,
            );

            return;
        }

        if (pathname === '/create-dutch-auction') {
            setServiceName(GEMPAD_DUTCH);
            setCreationAmount(tokenNeedToCreateDutchAuction);
            setContractAddress(DUTCH_AUCTION_CONTRACT_ADDRESSES[chainId] as Address);
            return;
        }

        if (pathname === '/create-subscription') {
            setServiceName(GEMPAD_SUBSCRIPTION);
            setCreationAmount(tokenNeedToCreateSubscription);
            setContractAddress(SUBSCRIPTION_CONTRACT_ADDRESSES[chainId] as Address);
        }
    }, [
        pathname,
        tokenNeedToCreateLaunchpad,
        tokenNeedToCreateFairLaunch,
        chainId,
        tokenNeedToCreateDutchAuction,
        tokenNeedToCreateSubscription,
    ]);

    // * Allowence check

    const parsedAmount = React.useMemo(() => {
        return tryParseAmount(creationAmount?.toString(), tokenCurrency);
    }, [creationAmount, tokenCurrency]);

    const { approvalState, approveCallback, currentAllowance } = useApproveCallback(
        parsedAmount,
        contractAddress,
    );

    // const { data: serviceFee, isLoading: serviceFeeLoading } = useContractRead({
    //     address: serviceReceiverContract.address,
    //     abi: serviceReceiverContract.abi,
    //     functionName: 'getPrice',
    //     args: [serviceName]
    // })

    // contract creation
    const fairLaunchContract = useCreateFairLaunchContract(
        FAIRLAUNCH_CONTRACT_ADDRESSES[chainId || DEFAULT_CHAIN_ID] as Address,
    );
    const launchpadFactoryContract = useCreateLaunchpadFactoryContract(
        LAUNCHPAD_FACTORY_CONTRACT_ADDRESSES[chainId ?? DEFAULT_CHAIN_ID] as Address,
    );
    const dutchAuctionContract = useCreateDutchAuctionContract(
        DUTCH_AUCTION_CONTRACT_ADDRESSES[chainId || DEFAULT_CHAIN_ID] as Address,
    );
    const subscriptionFactory = useSubscriptionFactoryContract(
        SUBSCRIPTION_CONTRACT_ADDRESSES[chainId || DEFAULT_CHAIN_ID] as Address,
    );

    // functions
    const handleApprove = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setTransaction(LaunchpadTransaction.PENDING);
        try {
            const { hash } = await approveCallback(); // It will show the toaster notification internally
            setTransaction(LaunchpadTransaction.PROCESSING);
            await waitForTransaction({ hash, chainId });
        } catch (error: any) {
            console.error({ error });
            toast.error(
                <DescriptionWithTx
                    title="Error"
                    description={error.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTransaction(LaunchpadTransaction.IDLE);
        }
    };

    const createFairLaunch = async (data: LaunchpadFormInput) => {
        const {
            tokenAddress,
            totalSellingAmount,
            softcap,
            isMaxContribution,
            maxContribution,
            startTime,
            endTime,
            affiliateProgram, // isAffiliate
            affiliatePercentage,
            feeOptions,
            whitelist,
            isEnableBuyback,
            buybackPercent,
            liquidity,
            router,
            liquidityLockup,
            currency,
        } = data;

        const totalSellingAmountWei = parseUnits(
            totalSellingAmount?.toString() || '0',
            Number(tokenDecimals),
        ); // totalSellingAmount in wei

        const startTimeUnix = dayjs(startTime).unix();
        const endTimeUnix = dayjs(endTime).unix();
        const isAffiliate = affiliateProgram === LaunchpadAffiliateProgram.ENABLED;
        const affiliateBips = BigInt(affiliatePercentage ? affiliatePercentage * 1e3 : 0);
        const liquidityPercent = BigInt(
            liquidity ? liquidity * 1e3 : isEnableBuyback ? 31 * 1e3 : 51 * 1e3,
        );
        const buybackBibs = BigInt(buybackPercent ? buybackPercent * 1e3 : 0);
        const lockupTime = BigInt(liquidityLockup ? liquidityLockup * 60 : 5 * 60);
        const fundToken = CURRENCY_ADDRESSES[currency][chainId]; // TODO: will be changed in future
        const isPrivateSale = whitelist === LaunchpadWhitelist.ENABLED;
        const softcapWei = parseUnits(softcap?.toString() || '0', fundTokenDecimals);
        const maxContributionWei = parseUnits(
            maxContribution?.toString() || '0',
            fundTokenDecimals,
        );

        const info: Info = {
            token: tokenAddress,
            totalsellTokens: totalSellingAmountWei,
            softCap: softcapWei,
            isMaxLimit: isMaxContribution,
            maxBuyLimit: maxContributionWei,
            startTime: BigInt(startTimeUnix),
            endTime: BigInt(endTimeUnix),
            finalizeTime: 0n, // FinalizeTime
            publicSaleTime: isPrivateSale ? BigInt(endTimeUnix) : BigInt(startTimeUnix), // publicSaleTime                    , // publicSaleTime
            isAffiliate,
            affiliateReward: affiliateBips,
        };

        const liquidityDetails: Liquidity = {
            router,
            liquidityPercent,
            lockTime: lockupTime,
            locker: LOCKER_CONTRACT_ADDRESSES[chainId] as Address,
            liquidityAdded: 0n, // LiquidityAdded
        };

        const buyback: Buyback = {
            isBuyback: isEnableBuyback,
            buyBackPercent: buybackBibs,
            totalBuyBackAmount: 0n, // TotalBuybackAmount
            boughtBackAmount: 0n, // BoughtBackAmount
            amountPerBuyback: 1000000000000000n, // AmountPerBuyback
            minDelay: 60n, //  MinDelay
            maxDelay: 300n, // MaxDelay
            lastBuyTime: 0n, // LastBuyTime
        };

        const args: FairLaunchSubmission = [
            info,
            liquidityDetails,
            buyback,
            fundToken,
            isPrivateSale,
            // tokenFee, // tokenFee
            SERVICE_FEE_RECEIVERS[chainId] as Address,
        ];

        const gasEstimate = await fairLaunchContract.estimateGas.createFairLaunch([...args], {
            value: serviceFee,
        } as never);
        hashRef.current = await fairLaunchContract.write.createFairLaunch([...args], {
            value: serviceFee,
            gas: gasEstimate || DefaultGasLimit,
        } as never);
    };

    const createLaunchpad = React.useCallback(
        async (data: LaunchpadFormInput) => {
            const {
                tokenAddress,
                presaleRate,
                listingRate,
                softcap,
                hardcap,
                minBuy,
                maxBuy,
                startTime,
                currency,
                endTime,
                whitelist,
                router,
                liquidity,
                liquidityLockup,
                isVestingActive,
                releasePresale,
                vestingPeriod,
                presaleTokenRelease,
                affiliateProgram,
                affiliatePercentage,
                refundType,
                feeOptions,
                logoUrl,
                websiteUrl: webUrl,
                facebookUrl,
                twitterUrl,
                redditUrl,
                githubUrl,
                telegramUrl,
                youtubeUrl,
                description,
                listingOptions,
            } = data;
            const isAutoListingEnable = listingOptions === ListingOptions.AUTO;

            const sellPriceWei = parseUnits(String(presaleRate), Number(tokenDecimals));
            const listinRateWei = isAutoListingEnable
                ? parseUnits(String(listingRate), Number(tokenDecimals))
                : 0n;
            const softcapWei = parseUnits(String(softcap), fundTokenDecimals);
            const hardcapWei = parseUnits(String(hardcap), fundTokenDecimals);
            const minBuyLimitWei = parseUnits(String(minBuy), fundTokenDecimals);
            const maxBuyLimitWei = parseUnits(String(maxBuy), fundTokenDecimals);
            const startTimeUnix = dayjs(startTime).unix() as unknown as bigint;
            const endTimeUnix = dayjs(endTime).unix() as unknown as bigint;
            const isPrivateSale = whitelist === LaunchpadWhitelist.ENABLED;
            const finalizeTime = 0n;
            const publicSaleTime = isPrivateSale ? BigInt(endTimeUnix) : BigInt(startTimeUnix); // publicSaleTime

            // const liquidityPercent = (liquidity * 1e3) as unknown as bigint;

            const liquidityPercent = isAutoListingEnable
                ? ((liquidity * 1e3) as unknown as bigint)
                : 0n;
            const liquidityAdded = 0n;

            const lockupTime = isAutoListingEnable
                ? ((liquidityLockup * 60) as unknown as bigint)
                : 0n;
            // router
            const routerAddress = isAutoListingEnable ? router : ('' as Address);

            // const lockupTime = (liquidityLockup * 60) as unknown as bigint;

            const locker = LOCKER_CONTRACT_ADDRESSES[chainId] as Address;
            const isAutoListing = listingOptions === ListingOptions.AUTO;
            const isVestingEnable = isVestingActive;
            const TGEPercent = (releasePresale ? releasePresale * 1e3 : 0) as unknown as bigint;
            const cycleInterval = (vestingPeriod ? vestingPeriod * 60 : 0) as unknown as bigint;
            const cyclePercent = (presaleTokenRelease
                ? presaleTokenRelease * 1e3
                : 0) as unknown as bigint;

            const fundToken = CURRENCY_ADDRESSES[currency][chainId]; // TODO: will be changed in future
            const isAffiliate = affiliateProgram === LaunchpadAffiliateProgram.ENABLED;
            const affiliateReward = affiliatePercentage ? BigInt(affiliatePercentage * 1e3) : 0n;
            const refundTypeBool = refundType === RefundType.REFUND;
            const tokenFee = feeOptions as unknown as bigint;
            const feeRecevier = SERVICE_FEE_RECEIVERS[chainId] as Address;

            const info: LaunchpadInfo = {
                token: tokenAddress,
                sellPrice: sellPriceWei,
                listingPrice: listinRateWei,
                softCap: softcapWei,
                hardCap: hardcapWei,
                minBuyLimit: minBuyLimitWei,
                maxBuyLimit: maxBuyLimitWei,
                startTime: startTimeUnix,
                endTime: endTimeUnix,
                finalizeTime,
                publicSaleTime,
            };

            const liquidityDetails: LaunchpadLiquidity = {
                router,
                liquidityPercent,
                lockTime: lockupTime,
                locker,
                liquidityAdded,
                isAutolisting: isAutoListing,
            };

            const vesting: LaunchpadVesting = {
                isVestingEnable,
                TGEPercent,
                cycleInterval,
                cyclePercent,
            };

            const socialMetadata = {
                logoUrl,
                webUrl,
                facebookUrl,
                twitterUrl,
                redditUrl,
                githubUrl,
                telegramUrl,
                youtubeUrl,
                description,
            };

            const estimatedGas = await launchpadFactoryContract.estimateGas.createLaunchpad(
                [
                    info,
                    liquidityDetails,
                    vesting,
                    fundToken,
                    isPrivateSale,
                    isAffiliate,
                    affiliateReward,
                    refundTypeBool,
                    feeRecevier,
                ],
                { value: serviceFee } as never,
            );

            hashRef.current = await launchpadFactoryContract.write.createLaunchpad(
                [
                    info,
                    liquidityDetails,
                    vesting,
                    fundToken,
                    isPrivateSale,
                    isAffiliate,
                    affiliateReward,
                    refundTypeBool,
                    feeRecevier,
                ],
                { value: serviceFee, gas: estimatedGas || DefaultGasLimit } as never,
            );

            const launchpadMetadataResponse = await addMetadataToLaunchpad({
                variables: {
                    txHash: hashRef.current,
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
        },
        [
            tokenDecimals,
            fundTokenDecimals,
            chainId,
            launchpadFactoryContract.estimateGas,
            launchpadFactoryContract.write,
            serviceFee,
            addMetadataToLaunchpad,
        ],
    );

    const createDutchAuction = React.useCallback(
        async (data: LaunchpadFormInput) => {
            const {
                tokenAddress,
                totalSellingAmount,
                startPrice,
                endPrice,
                softcap,
                hardcap,
                minContribution,
                maxContribution,
                startTime,
                endTime,
                currency,
                whitelist,
                decreasePriceCycle,
                router,
                liquidity,
                liquidityLockup,
                isVestingActive,
                tgeReleasePercent,
                cycle,
                cycleReleasePercent,
                refundType,
            } = data;

            // convertion
            const totalSellingAmountWei = parseUnits(
                String(totalSellingAmount),
                Number(tokenDecimals),
            ); // totalSellingAmount in wei
            const startPriceWei = parseUnits(String(startPrice), fundTokenDecimals);
            const endPriceWei = parseUnits(String(endPrice), fundTokenDecimals);
            const softcapWei = parseUnits(String(softcap), fundTokenDecimals);
            const hardcapWei = parseUnits(String(hardcap), fundTokenDecimals);
            const minContributionWei = parseUnits(String(minContribution), fundTokenDecimals);
            const maxContributionWei = parseUnits(String(maxContribution), fundTokenDecimals);
            const startTimeUnix = dayjs(startTime).unix() as unknown as bigint;
            const endTimeUnix = dayjs(endTime).unix() as unknown as bigint;
            const finalizeTime = 0n;
            const isPrivateSale = whitelist === LaunchpadWhitelist.ENABLED;
            const publicSaleTime = isPrivateSale ? BigInt(endTimeUnix) : BigInt(startTimeUnix);
            const decreaseInterval = (decreasePriceCycle * 60) as unknown as bigint; // into minutes
            const locker = LOCKER_CONTRACT_ADDRESSES[chainId] as Address;
            const liquidityPercent = (liquidity * 1e3) as unknown as bigint;
            const lockTime = (liquidityLockup * 60) as unknown as bigint;
            const liquidityAdded = 0n;
            const tgePercent = (tgeReleasePercent
                ? tgeReleasePercent * 1e3
                : 0n) as unknown as bigint;
            const cycleInterval = (cycle ? cycle * 60 : 0n) as unknown as bigint;
            const cycleReleasePercentBigint = (cycleReleasePercent
                ? cycleReleasePercent * 1e3
                : 0n) as unknown as bigint;

            const fundToken = CURRENCY_ADDRESSES[currency][chainId]; // TODO: will be changed in future
            const refundTypeBool = refundType === RefundType.REFUND;
            const tokenFee = feeOptions as unknown as bigint;
            const feeReceiver = SERVICE_FEE_RECEIVERS[chainId] as Address;

            const info: DutchInfo = {
                token: tokenAddress,
                totalSaleAmount: totalSellingAmountWei,
                startPrice: startPriceWei,
                endPrice: endPriceWei,
                softCap: softcapWei,
                hardCap: hardcapWei,
                minBuyLimit: minContributionWei,
                maxBuyLimit: maxContributionWei,
                startTime: startTimeUnix,
                endTime: endTimeUnix,
                finalizeTime,
                publicSaleTime,
                decreaseInterval,
            };

            const liquidityDetails: DutchLiquidity = {
                router,
                liquidityPercent,
                lockTime,
                locker,
                liquidityAdded,
            };

            const vestingDetails: DutchVesting = {
                isVestingEnable: isVestingActive,
                TGEPercent: tgePercent,
                cyclePercent: cycleReleasePercentBigint,
                cycleInterval,
            };

            const {
                estimateGas: { createDutchAuction: estimateGasDutchAuction },
                write: { createDutchAuction },
            } = dutchAuctionContract;
            const estimatedGas = await estimateGasDutchAuction(
                [
                    info,
                    liquidityDetails,
                    vestingDetails,
                    fundToken,
                    isPrivateSale,
                    refundTypeBool,
                    feeReceiver,
                ],
                { value: serviceFee } as never,
            );

            hashRef.current = await createDutchAuction(
                [
                    info,
                    liquidityDetails,
                    vestingDetails,
                    fundToken,
                    isPrivateSale,
                    refundTypeBool,
                    feeReceiver,
                ],
                { value: serviceFee, gas: estimatedGas || DefaultGasLimit } as never,
            );
        },
        [tokenDecimals, fundTokenDecimals, chainId, feeOptions, dutchAuctionContract, serviceFee],
    );
    const createSubscription = React.useCallback(
        async (data: LaunchpadFormInput) => {
            const {
                hardcap,
                softcap,
                tokenAddress,
                hardcapTokensPerUser,
                listingRate,
                subscriptionRate,
                startTime,
                endTime,
                whitelist,
                liquidity,
                liquidityLockup,
                router,
                refundType,
                feeOptions,
            } = data;

            // const hardcapWei = parseUnits(String(hardcap), Number(tokenDecimals));
            // const softcapWei = parseUnits(String(softcap), Number(tokenDecimals));
            // const hardcapTokensPerUserWei = parseUnits(
            //     String(hardcapTokensPerUser),
            //     Number(tokenDecimals),
            // );
            const listingRateWei = parseUnits(String(listingRate), Number(tokenDecimals));
            const subscriptionRateWei = parseUnits(String(subscriptionRate), Number(tokenDecimals));
            const startTimeUnix = dayjs(startTime).unix() as unknown as bigint;
            const endTimeUnix = dayjs(endTime).unix() as unknown as bigint;
            const finalizeTime = 0n;
            const isPrivateSale = whitelist === LaunchpadWhitelist.ENABLED;
            const publicSaleTime = isPrivateSale ? BigInt(endTimeUnix) : BigInt(startTimeUnix);

            const locker = LOCKER_CONTRACT_ADDRESSES[chainId] as Address;
            const liquidityPercent = (liquidity * 1e3) as unknown as bigint;
            const lockTime = (liquidityLockup * 60) as unknown as bigint;
            const liquidityAdded = 0n;

            // converting userSellingTokenAmount to fundTokenAmount
            const calHardCap = String(calculateFundTokenAmount(hardcap, subscriptionRate));
            const calSoftCap = String(calculateFundTokenAmount(softcap, subscriptionRate));
            const calUserTokenHardcap = String(
                calculateFundTokenAmount(hardcapTokensPerUser, subscriptionRate),
            );
            const hardcapWei = parseUnits(calHardCap, Number(tokenDecimals));
            const softcapWei = parseUnits(calSoftCap, Number(tokenDecimals));

            const hardcapTokensPerUserWei = parseUnits(calUserTokenHardcap, Number(tokenDecimals));

            const info = {
                token: tokenAddress,
                hardCap: hardcapWei,
                softCap: softcapWei,
                userHardCap: hardcapTokensPerUserWei,
                sellRate: subscriptionRateWei,
                listingRate: listingRateWei,
                startTime: startTimeUnix,
                endTime: endTimeUnix,
                finalizeTime,
                publicSaleTime,
            };

            const liquidityDetails: SubscriptionLiquidity = {
                router,
                liquidityPercent,
                lockTime,
                locker,
                liquidityAdded,
            };

            const fundToken = CURRENCY_ADDRESSES[currency][chainId]; // TODO: will be change in future
            const refundTypeBool = refundType === RefundType.REFUND;
            const tokenFee = feeOptions as unknown as bigint;
            const feeReceiver = SERVICE_FEE_RECEIVERS[chainId] as Address;

            const {
                estimateGas: { createSubscriptionPool: estimateGasSubscriptionPool },
                write: { createSubscriptionPool },
            } = subscriptionFactory;

            const estimatedGas = await estimateGasSubscriptionPool(
                [info, liquidityDetails, fundToken, isPrivateSale, refundTypeBool, feeReceiver],
                { value: serviceFee } as never,
            );

            hashRef.current = await createSubscriptionPool(
                [info, liquidityDetails, fundToken, isPrivateSale, refundTypeBool, feeReceiver],
                { value: serviceFee, gas: estimatedGas || DefaultGasLimit } as never,
            );
        },
        [tokenDecimals, chainId, currency, subscriptionFactory, serviceFee],
    );

    const onSubmit: SubmitHandler<LaunchpadFormInput> = async (data) => {
        try {
            const {
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

            setTransaction(LaunchpadTransaction.PENDING);
            const res = await checkStatus(); // TODO: check server Status
            if (!res) throw new Error('Server is not available!');

            let msg = '';
            let launchpadName = '';
            if (pathname === '/create-fair-launch') {
                await createFairLaunch(data);
                msg = 'Fair launch created successfully';
                launchpadName = 'Fairlaunch';
            }

            if (pathname === '/create-launchpad') {
                await createLaunchpad(data);
                msg = 'Launchpad created successfully';
                launchpadName = 'LaunchPad';
            }

            if (pathname === '/create-dutch-auction') {
                await createDutchAuction(data);
                msg = 'Dutch auction created successfully';
                launchpadName = 'DutchAuction';
            }

            if (pathname === '/create-subscription') {
                await createSubscription(data);
                msg = 'Subscription pool created successfully';
                launchpadName = 'SubscriptionPool';
            }

            addTransaction({ type: 'launchpad-created', hash: hashRef.current });

            // TODO: Unable it for metadata
            await addMetadataToLaunchpad({
                variables: {
                    txHash: hashRef.current,
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

            setTransaction(LaunchpadTransaction.PROCESSING);
            const receipt = await waitForTransaction({ hash: hashRef.current, chainId });
            const launchpadAddress = receipt.logs[0].address;

            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description={msg}
                    txChainId={chainId}
                    txHash={hashRef.current}
                />,
            );

            nextRouter.push(`/${getLaunchpadRouteByContractName(launchpadName, launchpadAddress)}`);
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name ?? 'Error'}
                    description={e.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTransaction(LaunchpadTransaction.IDLE);
        }
    };

    // const isValidCalculation = React.useCallback(() => {
    //     const x = softcap / endPrice;
    //     const y = hardcap / startPrice;
    //     const tsa = Number(totalSellingAmount);
    //     const result = x === tsa && y === tsa;
    //     console.log({ result }, 'anas');
    //     return result;
    // }, [softcap, hardcap, startPrice, endPrice, totalSellingAmount]);

    const handleNext = (e: any) => {
        e.preventDefault();

        console.log({ errors });

        if (!isValid) {
            trigger();
            return;
        }

        // if (!isValidCalculation && pathname === '/create-dutch-auction') {
        //     alert('Invalid Calculation');
        //     return;
        // }

        if (isBalanceEnough && activeStep === 1 && pathname === '/create-fair-launch') {
            toast.error(<DescriptionWithTx title="Balance not Enough" />);
            return;
        }

        if (isBalanceEnough && activeStep === 1 && pathname === '/create-launchpad') {
            toast.error(<DescriptionWithTx title="Balance not Enough" />);
            return;
        }

        if (isBalanceEnough && activeStep === 1 && pathname === '/create-dutch-auction') {
            toast.error(<DescriptionWithTx title="Balance not Enough" />);
            return;
        }

        if (isBalanceEnough && activeStep === 1 && pathname === '/create-subscription') {
            toast.error(<DescriptionWithTx title="Balance not Enough" />);
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
                    <PrimaryCard py={25} mt={30}>
                        <Stepper
                            activeStep={activeStep}
                            orientation={isMobile ? 'vertical' : 'horizontal'}
                            sx={{
                                height: { xs: 'auto', lg: '220px' },
                                mt: { xs: 'auto', lg: '-71px' },
                                paddingRight: '38px',
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
                        {/* Steps */}
                        <Box>
                            <Show isShow={activeStep === 0}>
                                <Step1
                                    serviceFee={serviceFee}
                                    serviceFeeLoading={serviceFeeLoading}
                                    feePercentNum={feePercentNum}
                                    feePercentLoading={feePercentLoading}
                                    isTokenDetailsAvailable={isTokenDetailsAvailable}
                                    tokenDetails={tokenDetails}
                                    isFetching={isFetching}
                                />
                            </Show>
                            <Show isShow={activeStep === 1}>
                                <Step2
                                    tokenDetails={tokenDetails}
                                    feePercentNum={feePercentNum}
                                    setIsBalanceEnough={setIsBalanceEnough}
                                    tokenNeedToCreateLaunchpad={tokenNeedToCreateLaunchpad}
                                    tokenNeedToCreateDutchAuction={tokenNeedToCreateDutchAuction}
                                />
                            </Show>
                            <Show isShow={activeStep === 2}>
                                <Step3 />
                            </Show>
                            <Show isShow={activeStep === 3}>
                                <Step4
                                    tokenNeedToCreateFairLaunch={tokenNeedToCreateFairLaunch}
                                    tokenNeedToCreateLaunchpad={tokenNeedToCreateLaunchpad}
                                    tokenDetails={tokenDetails}
                                />
                            </Show>
                        </Box>
                        {/* Buttons */}
                        <StepperButton
                            handleApprove={handleApprove}
                            activeStep={activeStep}
                            approvalState={approvalState}
                            handleBack={handleBack}
                            handleNext={handleNext}
                            isSubmitting={isSubmitting}
                            onSubmit={onSubmit}
                            steps={STEPS}
                            transaction={transaction}
                        />
                    </PrimaryCard>
                </Box>
            </form>
        </FormProvider>
    );
}
