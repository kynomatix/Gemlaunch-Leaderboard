// @ts-nocheck
'use client';

import PrimaryCard from '@/components/Cards/PrimaryCard';
import { LiquidityGeneratorTokenABI } from '@/config/abi/LiquidityGeneratorToken';
import { StandardTokenABI } from '@/config/abi/StandardToken';
import { useCreateTokenContract } from '@/hooks/useContract';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Collapse,
    FormControlLabel,
    MenuItem,
    Skeleton,
    TextField,
    Typography,
} from '@mui/material';
import Select from '@mui/material/Select';
import Link from 'next/link';
import * as React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Address, formatEther, parseUnits } from 'viem';
import { waitForTransaction, watchContractEvent } from 'wagmi/actions';

import { AntibotBabyTokenABI } from '@/config/abi/antibotBabyToken';
import { AntibotBuybackBabyTokenABI } from '@/config/abi/antibotBuybackBabyToken';
import { AntibotLiquidityGeneratorTokenABI } from '@/config/abi/antibotLiquidityGeneratorToken';
import { AntibotStandardTokenABI } from '@/config/abi/antibotStandardToken';
import { BabyTokenAbi } from '@/config/abi/babyToken';
import { BuybackTokenABI } from '@/config/abi/buybackToken';
import {
    ADDRESS_ZERO,
    ANTIBOT_BABY_TOKEN_ADDRESSES,
    ANTIBOT_BUYBACK_BABY_TOKEN_ADDRESSES,
    ANTIBOT_CONTRACT_ADDRESSES,
    ANTIBOT_LIQUIDITY_GENERATOR_TOKEN_ADDRESSES,
    ANTIBOT_STANDARD_TOKEN_ADDRESSES,
    BABY_TOKEN_CONTRACT_ADDRESSES,
    BABY_TOKEN_DIVIDEND_TRACKERS_ADDRESSES,
    BUYBACK_BABY_TOKEN_ADDRESSES,
    DEFAULT_CHAIN_ID,
    DefaultGasLimit,
    LIQUIDITY_GENERATOR_TOKEN_CONTRACT_ADDRESSES,
    NATIVE_CURRENCY_SYMBOLS,
    REWARD_TOKEN_ADDRESSES,
    ROUTERS,
    Router,
    STANDARD_TOKEN_FACTORY_ADDRESSES,
} from '@/constants';
import { disableScroll } from '@/utils/disableScroll';
import { useAccount, useContractRead, useNetwork } from 'wagmi';
import {
    AntibotBabyTokenArgs,
    AntibotBuybackBabyTokenArgs,
    AntibotLiquidityGeneratorTokenArgs,
    AntibotStandardTokenArgs,
    BabyTokenArgs,
    BuybackBabyTokenArgs,
    CreateTokenInput,
    LiquidityGeneratorTokenArgs,
    StandardTokenArgs,
    TokenType,
    Transaction,
} from './types';
import { CREATE_TOKEN_VALIDATION } from './validation';
import MainModal from '@/components/Modals';
import { useAddress, useSetIsWalletModalOpen } from '@thirdweb-dev/react';
import TokenCreation from '@/components/TokenCreation/TokenCreation';
import WalletConnectButton from '@/components/WalletConnectButton/WalletConnectButton';

import toast from 'react-hot-toast';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
import useTokenDetails from '@/hooks/useTokenDetails';

const CreateToken = () => {
    const { address: ownerAddress } = useAccount();
    const { chainId } = useActiveChainId();
    const [deployedTokenAddress, setDeployedTokenAddress] = React.useState<Address>();
    const [transaction, setTransaction] = React.useState<Transaction>(Transaction.IDLE);
    const [flatFeeContract, setFlatFeeContract] = React.useState<any>();
    const [showTokenCreation, setShowTokenCreation] = React.useState<boolean>(false);
    const [txHash, setTxHash] = React.useState<string>();
    const hashRef = React.useRef<Address | null>(null);

    const routers: Router[] = ROUTERS[chainId || DEFAULT_CHAIN_ID];

    // contracts creation
    const createStandardTokenContract = useCreateTokenContract(
        STANDARD_TOKEN_FACTORY_ADDRESSES[chainId] as Address,
        StandardTokenABI,
    );
    const createAntibotStandardTokenContract = useCreateTokenContract(
        ANTIBOT_STANDARD_TOKEN_ADDRESSES[chainId] as Address,
        AntibotStandardTokenABI,
    );

    const createLiquidityGeneratorTokenContract = useCreateTokenContract(
        LIQUIDITY_GENERATOR_TOKEN_CONTRACT_ADDRESSES[chainId] as Address,
        LiquidityGeneratorTokenABI,
    );
    const createAntibotLiquidityGeneratorTokenContract = useCreateTokenContract(
        ANTIBOT_LIQUIDITY_GENERATOR_TOKEN_ADDRESSES[chainId] as Address,
        AntibotLiquidityGeneratorTokenABI,
    );

    const createBabyTokenContract = useCreateTokenContract(
        BABY_TOKEN_CONTRACT_ADDRESSES[chainId] as Address,
        BabyTokenAbi,
    );
    const createAntibotBabyTokenContract = useCreateTokenContract(
        ANTIBOT_BABY_TOKEN_ADDRESSES[chainId] as Address,
        AntibotBabyTokenABI,
    );

    const createBuybackBabyTokenContract = useCreateTokenContract(
        BUYBACK_BABY_TOKEN_ADDRESSES[chainId] as Address,
        BuybackTokenABI,
    );
    const createAntibotBuybackBabyTokenContract = useCreateTokenContract(
        ANTIBOT_BUYBACK_BABY_TOKEN_ADDRESSES[chainId] as Address,
        AntibotBuybackBabyTokenABI,
    );

    // Fee to create the token
    // const { result: serviceFee, loading: serviceFeeLoading } = useSingleCallResult({
    //     contract: flatFeeContract,
    //     functionName: 'flatFee',
    // });

    const { data: serviceFee, isLoading: serviceFeeLoading } = useContractRead<any, string, bigint>(
        {
            address: flatFeeContract?.address,
            abi: flatFeeContract?.abi,
            functionName: 'flatFee',
        },
    );

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateTokenInput>({
        mode: 'onBlur',
        defaultValues: {
            autoAddLiquidity: undefined,
            charityMarketingAddress: undefined,
            charityMarketingPercent: undefined,
            generateLiquidityFee: undefined,
            generateYieldFee: undefined,
            liquidityFee: undefined,
            marketingFee: undefined,
            marketingWallet: undefined,
            minTokenBalanceForDividends: undefined,
            rewardToken: undefined,
            tokenDecimals: undefined,
            tokenName: undefined,
            tokenRewardFee: undefined,
            tokenType: TokenType.Standard,
            gemlaunchAntiBotSystem: false,
            tokenSupply: undefined,
            tokenSymbol: undefined,
            buybackFee: undefined,
            reflectionFee: undefined,
            router: routers?.[0]?.address,
        },
        resolver: yupResolver(CREATE_TOKEN_VALIDATION(ownerAddress)) as any,
    });

    React.useEffect(() => {
        // Update the default value of the 'router' field when chain.id changes
        const defaultRouter = routers?.[0]?.address; // Implement a function to get the default router based on chain.id
        setValue('router', defaultRouter);
    }, [chainId, routers, setValue]);

    const data = watch();
    const tokenType = watch('tokenType');
    const tokenSymbol = watch('tokenSymbol');
    const tokenName = watch('tokenName');
    const gemlaunchAntiBotSystem = watch('gemlaunchAntiBotSystem');
    const tokenSupply = watch('tokenSupply');
    const PABS = watch('gemlaunchAntiBotSystem');
    const routerValue = watch('router');
    const minTokenBalanceForDividendsMaxValue = tokenSupply ? (tokenSupply * 0.1) / 100 : 0;

    const {
        state: { isFetching, tokenDetails },
    } = useTokenDetails(data?.rewardToken);
    const isTokenDetailsAvailable = !!tokenDetails;

    React.useEffect(() => {
        // PABS = GemlaunchAntiBotSystem
        if (tokenType === TokenType.Standard && !PABS) {
            setFlatFeeContract(createStandardTokenContract);
            return;
        }

        if (tokenType === TokenType.LiquidityGenerator && !PABS) {
            setFlatFeeContract(createLiquidityGeneratorTokenContract);
            return;
        }

        if (tokenType === TokenType.Baby && !PABS) {
            setFlatFeeContract(createBabyTokenContract);
            return;
        }

        if (tokenType === TokenType.BuybackBaby && !PABS) {
            setFlatFeeContract(createBuybackBabyTokenContract);
            return;
        }

        // Antibots
        if (tokenType === TokenType.Standard && PABS) {
            setFlatFeeContract(createAntibotStandardTokenContract);
            return;
        }

        if (tokenType === TokenType.LiquidityGenerator && PABS) {
            setFlatFeeContract(createAntibotLiquidityGeneratorTokenContract);
            return;
        }

        if (tokenType === TokenType.Baby && PABS) {
            setFlatFeeContract(createAntibotBabyTokenContract);
            return;
        }

        if (tokenType === TokenType.BuybackBaby && PABS) {
            setFlatFeeContract(createAntibotBuybackBabyTokenContract);
            return;
        }

        setFlatFeeContract(undefined);
    }, [
        tokenType,
        chainId,
        createBabyTokenContract,
        createLiquidityGeneratorTokenContract,
        createAntibotLiquidityGeneratorTokenContract,
        createStandardTokenContract,
        createAntibotStandardTokenContract,
        flatFeeContract,
        createBuybackBabyTokenContract,
        createAntibotBabyTokenContract,
        createAntibotBuybackBabyTokenContract,
        PABS,
    ]);

    const createStandardToken = async (data: CreateTokenInput) => {
        const { tokenName, tokenSymbol, tokenDecimals, tokenSupply, gemlaunchAntiBotSystem } = data;

        const simpleArgs: StandardTokenArgs = [
            tokenName,
            tokenSymbol,
            tokenDecimals,
            parseUnits(tokenSupply?.toString(), Number(tokenDecimals)),
        ];

        const antibotArgs: AntibotStandardTokenArgs = [
            tokenName,
            tokenSymbol,
            tokenDecimals,
            parseUnits(tokenSupply?.toString(), Number(tokenDecimals)),
            ANTIBOT_CONTRACT_ADDRESSES[chainId] as Address,
        ];

        const args = gemlaunchAntiBotSystem ? antibotArgs : simpleArgs;
        const contract = gemlaunchAntiBotSystem
            ? createAntibotStandardTokenContract
            : createStandardTokenContract;

        const estimatedGas = await contract.estimateGas.create([...args], {
            value: serviceFee,
        });
        hashRef.current = await contract.write.create([...args], {
            value: serviceFee,
            gas: estimatedGas || DefaultGasLimit,
        });

        setTransaction(Transaction.PROCESSING);

        const receipt = await waitForTransaction({ hash: hashRef.current, chainId });
        const addr = receipt?.logs?.[0]?.address;
        const txh = receipt?.transactionHash;

        setDeployedTokenAddress(addr);
        setTxHash(txh);
        setShowTokenCreation(true);
    };

    const createLiquidityGeneratorToken = async (data: CreateTokenInput) => {
        const {
            tokenName,
            tokenSymbol,
            tokenSupply,
            router,
            generateYieldFee,
            generateLiquidityFee,
            charityMarketingAddress,
            charityMarketingPercent,
            gemlaunchAntiBotSystem,
        } = data;

        if (!charityMarketingAddress && charityMarketingPercent) {
            toast.error(
                <DescriptionWithTx
                    title="Error"
                    description="Unable to set charity percent if the charity address is not defined."
                />,
            );
            return;
        }

        const totalFee = generateYieldFee + generateLiquidityFee + charityMarketingPercent;
        if (totalFee > 25) {
            toast.error(
                <DescriptionWithTx title="Error" description="Total fee can not be over 25%" />,
            );
            return;
        }

        const simpleArgs: LiquidityGeneratorTokenArgs = [
            tokenName,
            tokenSymbol,
            parseUnits(tokenSupply?.toString(), 9), // 9 is the default tokenDecimals in this case
            router as Address,
            charityMarketingAddress || ADDRESS_ZERO,
            BigInt(generateYieldFee * 1e2),
            BigInt(generateLiquidityFee * 1e2),
            BigInt(charityMarketingPercent ? charityMarketingPercent * 1e2 : 0),
        ];

        const antibotArgs: AntibotLiquidityGeneratorTokenArgs = [
            tokenName,
            tokenSymbol,
            parseUnits(tokenSupply?.toString(), 9), // 9 is the default tokenDecimals in this case
            router as Address,
            charityMarketingAddress || ADDRESS_ZERO,
            BigInt(generateYieldFee * 1e2),
            BigInt(generateLiquidityFee * 1e2),
            BigInt(charityMarketingPercent ? charityMarketingPercent * 1e2 : 0),
            ANTIBOT_CONTRACT_ADDRESSES[chainId] as Address,
        ];

        const args = gemlaunchAntiBotSystem ? antibotArgs : simpleArgs;
        const contract = gemlaunchAntiBotSystem
            ? createAntibotLiquidityGeneratorTokenContract
            : createLiquidityGeneratorTokenContract;

        const estimatedGas = await contract.estimateGas.create([...args], {
            value: serviceFee,
        });
        hashRef.current = await contract.write.create([...args], {
            value: serviceFee,
            gas: estimatedGas || DefaultGasLimit,
        });

        setTransaction(Transaction.PROCESSING);

        const receipt = await waitForTransaction({ hash: hashRef.current, chainId });
        const addr = receipt?.logs?.[0]?.address;
        const txh = receipt?.transactionHash;

        setDeployedTokenAddress(addr);
        setTxHash(txh);
        setShowTokenCreation(true);
    };

    const createBabyToken = async (data: CreateTokenInput) => {
        const {
            tokenName,
            tokenSymbol,
            tokenSupply,
            router,
            rewardToken,
            minTokenBalanceForDividends,
            tokenRewardFee,
            autoAddLiquidity,
            marketingFee,
            marketingWallet,
            gemlaunchAntiBotSystem,
        } = data;

        const simpleArgs: BabyTokenArgs = [
            tokenName,
            tokenSymbol,
            parseUnits(tokenSupply?.toString(), 18), // 18 is the default tokenDecimals in this case
            [
                rewardToken,
                router as Address,
                marketingWallet,
                BABY_TOKEN_DIVIDEND_TRACKERS_ADDRESSES[chainId] as Address,
            ],
            [BigInt(tokenRewardFee), BigInt(autoAddLiquidity), BigInt(marketingFee)],
            BigInt(minTokenBalanceForDividends),
        ];

        const antibotArgs: AntibotBabyTokenArgs = [
            tokenName,
            tokenSymbol,
            parseUnits(tokenSupply?.toString(), 18), // 18 is the default tokenDecimals in this case
            [
                rewardToken,
                router as Address,
                marketingWallet,
                BABY_TOKEN_DIVIDEND_TRACKERS_ADDRESSES[chainId] as Address,
                ANTIBOT_CONTRACT_ADDRESSES[chainId] as Address,
            ],
            [BigInt(tokenRewardFee), BigInt(autoAddLiquidity), BigInt(marketingFee)],
            BigInt(minTokenBalanceForDividends),
        ];

        const args = gemlaunchAntiBotSystem ? antibotArgs : simpleArgs;
        const contract = gemlaunchAntiBotSystem
            ? createAntibotBabyTokenContract
            : createBabyTokenContract;

        const estimatedGas = await contract.estimateGas.create([...args], {
            value: serviceFee,
        });
        hashRef.current = await contract.write.create([...args], {
            value: serviceFee,
            gas: estimatedGas || DefaultGasLimit,
        });
        setTransaction(Transaction.PROCESSING);

        const receipt = await waitForTransaction({ hash: hashRef.current, chainId });
        const addr = receipt?.logs?.[0]?.address;
        const txh = receipt?.transactionHash;

        setDeployedTokenAddress(addr);
        setTxHash(txh);
        setShowTokenCreation(true);
    };

    const createBuyBackBabyToken = async (data: CreateTokenInput) => {
        const {
            tokenName,
            tokenSymbol,
            tokenSupply,
            router,
            buybackFee,
            reflectionFee,
            liquidityFee,
            marketingFee,
            gemlaunchAntiBotSystem,
        } = data;

        const simpleArgs: BuybackBabyTokenArgs = [
            tokenName,
            tokenSymbol,
            parseUnits(tokenSupply?.toString(), 9), // 9 is the default tokenDecimals in this case
            REWARD_TOKEN_ADDRESSES[chainId] as Address,
            router as Address,
            [
                BigInt(liquidityFee ? liquidityFee * 1e2 : 0),
                BigInt(buybackFee ? buybackFee * 1e2 : 0),
                BigInt(reflectionFee ? reflectionFee * 1e2 : 0),
                BigInt(marketingFee * 1e2),
                BigInt(100e2),
            ], // last one is 10,000 static feeDenominator
        ];

        const antibotArgs: AntibotBuybackBabyTokenArgs = [
            tokenName,
            tokenSymbol,
            parseUnits(tokenSupply?.toString(), 9), // 9 is the default tokenDecimals in this case
            REWARD_TOKEN_ADDRESSES[chainId] as Address,
            router as Address,
            ANTIBOT_CONTRACT_ADDRESSES[chainId] as Address,
            [
                BigInt(liquidityFee ? liquidityFee * 1e2 : 0),
                BigInt(buybackFee ? buybackFee * 1e2 : 0),
                BigInt(reflectionFee ? reflectionFee * 1e2 : 0),
                BigInt(marketingFee * 1e2),
                BigInt(100e2),
            ], // last one is 10,000 static feeDenominator
        ];

        const args = gemlaunchAntiBotSystem ? antibotArgs : simpleArgs;
        const contract = gemlaunchAntiBotSystem
            ? createAntibotBuybackBabyTokenContract
            : createBuybackBabyTokenContract;

        const estimatedGas = await contract.estimateGas.create([...args], {
            value: serviceFee,
        });
        hashRef.current = await contract.write.create([...args], {
            value: serviceFee,
            gas: estimatedGas || DefaultGasLimit,
        });
        setTransaction(Transaction.PROCESSING);

        const receipt = await waitForTransaction({ hash: hashRef.current, chainId });
        const addr = receipt?.logs?.[2]?.address;
        const txh = receipt?.transactionHash;

        setDeployedTokenAddress(addr);
        setTxHash(txh);
        setShowTokenCreation(true);
    };

    const onSubmit: SubmitHandler<CreateTokenInput> = async (data) => {
        setTransaction(Transaction.WAITING);
        try {
            if (tokenType === TokenType.Standard) {
                await createStandardToken(data);
            }

            if (tokenType === TokenType.LiquidityGenerator) {
                await createLiquidityGeneratorToken(data);
            }

            if (tokenType === TokenType.Baby) {
                await createBabyToken(data);
            }

            if (tokenType === TokenType.BuybackBaby) {
                await createBuyBackBabyToken(data);
            }
        } catch (error: any) {
            console.error({ error });
            toast.error(
                <DescriptionWithTx
                    title="Error"
                    description={error.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTransaction(Transaction.IDLE);
        }
    };

    return (
        <Box sx={{ mt: '70px' }}>
            {!showTokenCreation && (
                <>
                    <Typography variant="h5" fontSize={'20px'} mb={'11px'} ml={'31px'}>
                        Create Token
                    </Typography>
                    <PrimaryCard px={18} py={22}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Box>
                                <Typography
                                    variant="body1"
                                    sx={{ mb: '9px', color: '#FF8484' }}
                                    ml={2}
                                    fontSize={12}
                                >
                                    (*) is required field.
                                </Typography>
                                <Typography variant="h5" ml={1.5}>
                                    Token Type <span style={{ color: '#FF8484' }}>*</span>
                                </Typography>
                                <Controller
                                    name="tokenType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            fullWidth
                                            value={field.value || ''} // Ensure the value is controlled
                                            MenuProps={{
                                                disableScrollLock: true,
                                            }}
                                            sx={{
                                                my: '9px',
                                                '.MuiSvgIcon-root ': {
                                                    fill: 'white !important',
                                                },
                                            }}
                                        >
                                            <MenuItem value={TokenType.Standard}>
                                                Standard Token
                                            </MenuItem>
                                            <MenuItem value={TokenType.LiquidityGenerator}>
                                                Liquidity Generator Token
                                            </MenuItem>
                                            <MenuItem value={TokenType.Baby}>Baby Token</MenuItem>
                                            <MenuItem value={TokenType.BuybackBaby}>
                                                Buyback Baby Token
                                            </MenuItem>
                                        </Select>
                                    )}
                                />
                                {serviceFeeLoading ? (
                                    <Skeleton
                                        animation="wave"
                                        variant="rounded"
                                        width={100}
                                        height={20}
                                    />
                                ) : (
                                    <Typography fontSize={'14px'} color="primary" ml={1.5}>
                                        Fee:{' '}
                                        {serviceFee ? formatEther(serviceFee as bigint) : '...'}{' '}
                                        {NATIVE_CURRENCY_SYMBOLS[chainId]}
                                    </Typography>
                                )}
                            </Box>
                            {/* Token Name and Token Symbol */}
                            <Box
                                sx={{
                                    mt: '25px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: '25px',
                                    flexDirection: {
                                        xs: 'column',
                                        sm: 'row',
                                    },
                                }}
                            >
                                <Box sx={{ width: '100%' }}>
                                    <Typography ml={1.5} variant="h5">
                                        Token Name <span style={{ color: '#FF8484' }}>*</span>
                                    </Typography>
                                    <Controller
                                        name="tokenName"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                type="text"
                                                {...field}
                                                error={!!errors?.tokenName}
                                                value={field.value || ''}
                                                helperText={
                                                    <Typography variant="body2">
                                                        {errors?.tokenName?.message}
                                                    </Typography>
                                                }
                                                fullWidth
                                                placeholder="Ex: Ethereum"
                                                sx={{ my: '9px' }}
                                            />
                                        )}
                                    />
                                </Box>
                                <Box sx={{ width: '100%' }}>
                                    <Typography ml={1.5} variant="h5">
                                        Token Symbol <span style={{ color: '#FF8484' }}>*</span>
                                    </Typography>
                                    <Controller
                                        name="tokenSymbol"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="text"
                                                value={field.value || ''}
                                                error={!!errors?.tokenSymbol}
                                                helperText={
                                                    <Typography variant="body2">
                                                        {errors?.tokenSymbol?.message}
                                                    </Typography>
                                                }
                                                fullWidth
                                                placeholder="Ex: ETH"
                                                sx={{ my: '9px' }}
                                            />
                                        )}
                                    />
                                </Box>
                            </Box>
                            {/* Token Decimalas OR Router AND and token supply */}
                            <Box
                                sx={{
                                    mt: '28px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: '25px',
                                    flexDirection: {
                                        xs: 'column',
                                        sm: 'row',
                                    },
                                }}
                            >
                                <Collapse
                                    in={true}
                                    sx={{
                                        width: '100%',
                                    }}
                                >
                                    {tokenType !== TokenType.Standard ? (
                                        <Box>
                                            <Typography variant="h5" ml={1.5}>
                                                Router <span style={{ color: '#FF8484' }}>*</span>
                                            </Typography>
                                            <Controller
                                                name="router"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        value={field.value || routers?.[0]?.address}
                                                        fullWidth
                                                        MenuProps={{
                                                            disableScrollLock: true,
                                                        }}
                                                        sx={{
                                                            my: '9px',
                                                            '.MuiSvgIcon-root ': {
                                                                fill: 'white !important',
                                                            },
                                                        }}
                                                    >
                                                        {routers.map((x) => (
                                                            <MenuItem
                                                                key={x.name}
                                                                value={x.address}
                                                            >
                                                                {x.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                            />
                                        </Box>
                                    ) : (
                                        <Box>
                                            <Typography ml={1.5} variant="h5">
                                                Token Decimals{' '}
                                                <span style={{ color: '#FF8484' }}>*</span>
                                            </Typography>
                                            <Controller
                                                name="tokenDecimals"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        type="number"
                                                        onWheel={disableScroll}
                                                        value={field.value || ''}
                                                        error={!!errors?.tokenDecimals}
                                                        helperText={
                                                            <Typography variant="body2">
                                                                {errors?.tokenDecimals?.message}
                                                            </Typography>
                                                        }
                                                        fullWidth
                                                        placeholder="Ex: 18"
                                                        sx={{ my: '9px' }}
                                                    />
                                                )}
                                            />
                                        </Box>
                                    )}
                                </Collapse>

                                {/* Token Supply */}
                                <Collapse in={true} sx={{ width: '100%' }}>
                                    <Box>
                                        <Typography ml={1.5} variant="h5">
                                            Token Supply <span style={{ color: '#FF8484' }}>*</span>
                                        </Typography>
                                        <Controller
                                            name="tokenSupply"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    type="number"
                                                    onWheel={disableScroll}
                                                    value={field.value || ''}
                                                    error={!!errors?.tokenSupply}
                                                    helperText={
                                                        <Typography variant="body2">
                                                            {errors?.tokenSupply?.message}
                                                        </Typography>
                                                    }
                                                    fullWidth
                                                    placeholder="Ex: 100000000000"
                                                    sx={{ my: '9px' }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Collapse>
                            </Box>
                            {/* Transaction Fee to generate yield and liquidity */}
                            <Collapse in={tokenType === TokenType.LiquidityGenerator}>
                                <Box
                                    sx={{
                                        mt: '25px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '25px',
                                        flexDirection: {
                                            xs: 'column',
                                            sm: 'row',
                                        },
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Typography ml={1.5} variant="h5">
                                            Transaction fee to generate yield (%){' '}
                                            <span style={{ color: '#FF8484' }}>*</span>
                                        </Typography>
                                        <Controller
                                            name="generateYieldFee"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    type="number"
                                                    {...field}
                                                    value={field.value || ''}
                                                    onWheel={disableScroll}
                                                    error={!!errors?.generateYieldFee}
                                                    helperText={
                                                        <Typography variant="body2">
                                                            {errors?.generateYieldFee?.message}
                                                        </Typography>
                                                    }
                                                    fullWidth
                                                    placeholder="Ex: 1"
                                                    sx={{ my: '9px' }}
                                                />
                                            )}
                                        />
                                    </Box>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography ml={1.5} variant="h5">
                                            Transaction fee to generate liquidity (%){' '}
                                            <span style={{ color: '#FF8484' }}>*</span>
                                        </Typography>
                                        <Controller
                                            name="generateLiquidityFee"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    type="number"
                                                    onWheel={disableScroll}
                                                    value={field.value || ''}
                                                    error={!!errors?.generateLiquidityFee}
                                                    helperText={
                                                        <Typography variant="body2">
                                                            {errors?.generateLiquidityFee?.message}
                                                        </Typography>
                                                    }
                                                    {...field}
                                                    fullWidth
                                                    placeholder="Ex: 1"
                                                    sx={{ my: '9px' }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Box>
                            </Collapse>
                            {/* Charity marketing address and percent */}
                            <Collapse in={tokenType === TokenType.LiquidityGenerator}>
                                <Box
                                    sx={{
                                        mt: '25px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '25px',
                                        flexDirection: {
                                            xs: 'column',
                                            sm: 'row',
                                        },
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Typography ml={1.5} variant="h5">
                                            Charity/Marketing address
                                        </Typography>
                                        <Controller
                                            name="charityMarketingAddress"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    type="text"
                                                    value={field.value || ''}
                                                    {...field}
                                                    error={!!errors?.charityMarketingAddress}
                                                    helperText={
                                                        <Typography variant="body2">
                                                            {
                                                                errors?.charityMarketingAddress
                                                                    ?.message
                                                            }
                                                        </Typography>
                                                    }
                                                    fullWidth
                                                    placeholder="Ex: 0x...."
                                                    sx={{ my: '9px' }}
                                                />
                                            )}
                                        />
                                    </Box>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography ml={1.5} variant="h5">
                                            Charity/Marketing percent (%)
                                        </Typography>
                                        <Controller
                                            name="charityMarketingPercent"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    type="number"
                                                    onWheel={disableScroll}
                                                    value={field.value || ''}
                                                    error={!!errors?.charityMarketingPercent}
                                                    helperText={
                                                        <Typography variant="body2">
                                                            {
                                                                errors?.charityMarketingPercent
                                                                    ?.message
                                                            }
                                                        </Typography>
                                                    }
                                                    {...field}
                                                    fullWidth
                                                    placeholder="0 - 25"
                                                    sx={{ my: '9px' }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Box>
                            </Collapse>
                            {/* RewardToken and MinTokenBalanceForDividends */}

                            <Collapse in={tokenType === TokenType.Baby}>
                                <Box
                                    sx={{
                                        mt: '25px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '25px',
                                        flexDirection: {
                                            xs: 'column',
                                            sm: 'row',
                                        },
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Typography ml={1.5} variant="h5">
                                            Reward Token <span style={{ color: '#FF8484' }}>*</span>
                                        </Typography>
                                        <Controller
                                            name="rewardToken"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    type="text"
                                                    value={field.value || ''}
                                                    {...field}
                                                    error={!!errors?.rewardToken}
                                                    helperText={
                                                        <>
                                                            <Typography variant="body2">
                                                                {errors?.rewardToken?.message}
                                                            </Typography>
                                                            <Typography
                                                                fontSize="11px"
                                                                color="primary"
                                                                fontWeight={500}
                                                            >
                                                                If you want to reward Stable USDC,
                                                                please enter
                                                                0xB12a6f31F80405cAe7fC11499F53EDBeC237b65C.
                                                            </Typography>
                                                        </>
                                                    }
                                                    fullWidth
                                                    placeholder="Ex: 0x...."
                                                    sx={{ my: '9px' }}
                                                />
                                            )}
                                        />
                                        <Box mt={1}>
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
                                                <PrimaryCard>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '10px',
                                                            mb: 2,
                                                        }}
                                                    >
                                                        {tokenDetails.map(
                                                            ({ id, property, value }) => (
                                                                <Box
                                                                    key={id}
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '10px',
                                                                        justifyContent:
                                                                            'space-between',
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="h5"
                                                                        fontSize={14}
                                                                    >
                                                                        {property}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="h5"
                                                                        fontSize={14}
                                                                    >
                                                                        {value?.toString()}
                                                                    </Typography>
                                                                </Box>
                                                            ),
                                                        )}
                                                    </Box>
                                                </PrimaryCard>
                                            )}
                                        </Box>
                                    </Box>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography ml={1.5} variant="h5">
                                            Minimum token balance for dividends (max:{' '}
                                            {minTokenBalanceForDividendsMaxValue})
                                            <span style={{ color: '#FF8484' }}>*</span>
                                        </Typography>
                                        <Controller
                                            name="minTokenBalanceForDividends"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    type="number"
                                                    onWheel={disableScroll}
                                                    error={!!errors?.minTokenBalanceForDividends}
                                                    helperText={
                                                        <>
                                                            <Typography
                                                                fontSize="11px"
                                                                variant="body2"
                                                                color="primary"
                                                            >
                                                                Min hold each wallet must be over
                                                                $50 to receive rewards.
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                {
                                                                    errors
                                                                        ?.minTokenBalanceForDividends
                                                                        ?.message
                                                                }
                                                            </Typography>
                                                        </>
                                                    }
                                                    {...field}
                                                    fullWidth
                                                    placeholder="Ex: 10000000"
                                                    sx={{ my: '9px' }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Box>
                            </Collapse>
                            {/* Token Reward Fee and Auto add liquidity */}

                            <Collapse in={tokenType === TokenType.Baby}>
                                <Box
                                    sx={{
                                        mt: '25px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '25px',
                                        flexDirection: {
                                            xs: 'column',
                                            sm: 'row',
                                        },
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Typography ml={1.5} variant="h5">
                                            Token reward fee (%){' '}
                                            <span style={{ color: '#FF8484' }}>*</span>
                                        </Typography>
                                        <Controller
                                            name="tokenRewardFee"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    type="number"
                                                    {...field}
                                                    onWheel={disableScroll}
                                                    error={!!errors?.tokenRewardFee}
                                                    helperText={
                                                        <Typography variant="body2">
                                                            {errors?.tokenRewardFee?.message}
                                                        </Typography>
                                                    }
                                                    fullWidth
                                                    placeholder="0 - 100"
                                                    sx={{ my: '9px' }}
                                                />
                                            )}
                                        />
                                    </Box>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography ml={1.5} variant="h5">
                                            Auto add liquidity (%){' '}
                                            <span style={{ color: '#FF8484' }}>*</span>
                                        </Typography>
                                        <Controller
                                            name="autoAddLiquidity"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    type="number"
                                                    onWheel={disableScroll}
                                                    error={!!errors?.autoAddLiquidity}
                                                    helperText={
                                                        <Typography variant="body2">
                                                            {errors?.autoAddLiquidity?.message}
                                                        </Typography>
                                                    }
                                                    {...field}
                                                    fullWidth
                                                    placeholder="0 - 100"
                                                    sx={{ my: '9px' }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Box>
                            </Collapse>

                            <Collapse in={tokenType === TokenType.BuybackBaby}>
                                <Box
                                    sx={{
                                        mt: '25px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '25px',
                                        flexDirection: {
                                            xs: 'column',
                                            sm: 'row',
                                        },
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Typography ml={1.5} variant="h5">
                                            Buyback Fee (%)
                                        </Typography>
                                        <Controller
                                            name="buybackFee"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    type="text"
                                                    {...field}
                                                    error={!!errors?.buybackFee}
                                                    helperText={
                                                        <Typography variant="body2">
                                                            {errors?.buybackFee?.message}
                                                        </Typography>
                                                    }
                                                    fullWidth
                                                    placeholder="0 - 100"
                                                    sx={{ my: '9px' }}
                                                />
                                            )}
                                        />
                                    </Box>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography ml={1.5} variant="h5">
                                            Reflection Fee (%)
                                        </Typography>
                                        <Controller
                                            name="reflectionFee"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    type="text"
                                                    error={!!errors?.reflectionFee}
                                                    helperText={
                                                        <Typography variant="body2">
                                                            {errors?.reflectionFee?.message}
                                                        </Typography>
                                                    }
                                                    {...field}
                                                    fullWidth
                                                    placeholder="0 - 100"
                                                    sx={{ my: '9px' }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Box>
                            </Collapse>

                            <Collapse in={tokenType === TokenType.BuybackBaby}>
                                <Box sx={{ width: '100%', mt: '30px' }}>
                                    <Typography ml={1.5} variant="h5">
                                        Liquidity Fee (%)
                                    </Typography>
                                    <Controller
                                        name="liquidityFee"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="number"
                                                error={!!errors?.liquidityFee}
                                                helperText={
                                                    <Typography variant="body2">
                                                        {errors?.liquidityFee?.message}
                                                    </Typography>
                                                }
                                                fullWidth
                                                placeholder="0 - 100"
                                                sx={{ my: '9px' }}
                                            />
                                        )}
                                    />
                                </Box>
                            </Collapse>

                            {/* Marketing fee and Marketing wallet */}

                            <Collapse
                                in={
                                    tokenType === TokenType.Baby ||
                                    tokenType === TokenType.BuybackBaby
                                }
                            >
                                <Box
                                    sx={{
                                        mt: '25px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        gap: '25px',
                                        flexDirection: {
                                            xs: 'column',
                                            sm: 'row',
                                        },
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Typography ml={1.5} variant="h5">
                                            Marketing fee (%){' '}
                                            <span style={{ color: '#FF8484' }}>*</span>
                                        </Typography>
                                        <Controller
                                            name="marketingFee"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    type="number"
                                                    onWheel={disableScroll}
                                                    {...field}
                                                    error={!!errors?.marketingFee}
                                                    helperText={
                                                        <Typography variant="body2">
                                                            {errors?.marketingFee?.message}
                                                        </Typography>
                                                    }
                                                    fullWidth
                                                    placeholder="0 - 100"
                                                    sx={{ my: '9px' }}
                                                />
                                            )}
                                        />
                                    </Box>

                                    <Collapse in={tokenType !== TokenType.BuybackBaby}></Collapse>
                                    <Box sx={{ width: '100%' }}>
                                        <Typography ml={1.5} variant="h5">
                                            Marketing Wallet{' '}
                                            <span style={{ color: '#FF8484' }}>*</span>
                                        </Typography>
                                        <Controller
                                            name="marketingWallet"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    type="text"
                                                    error={!!errors?.marketingWallet}
                                                    helperText={
                                                        <Typography variant="body2">
                                                            {errors?.marketingWallet?.message}
                                                        </Typography>
                                                    }
                                                    {...field}
                                                    fullWidth
                                                    placeholder="Ex: 0x...."
                                                    sx={{ my: '9px' }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Box>
                            </Collapse>

                            {/* GemlaunchAntibotSystem */}
                            <Controller
                                name="gemlaunchAntiBotSystem"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        {...field}
                                        label="Implement Gem Anti-Bot System?"
                                        control={<Checkbox sx={{ color: '#fff' }} />}
                                    />
                                )}
                            />

                            <Collapse in={gemlaunchAntiBotSystem}>
                                <Typography variant="h5" fontSize={12}>
                                    Please visit{' '}
                                    <Link
                                        href="https://www.gemlaunch.io/antibot"
                                        target="_blank"
                                        style={{
                                            color: '#22CDA6',
                                        }}
                                    >
                                        <span className="link">
                                            https://www.gemlaunch.io/antibot
                                        </span>
                                    </Link>{' '}
                                    to activate Gem Anti-Bot after creating the token.
                                </Typography>
                            </Collapse>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mt: '35px',
                                }}
                            >
                                <Button
                                    type="submit"
                                    size="large"
                                    disabled={isSubmitting}
                                    variant="contained"
                                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                                >
                                    {transaction === Transaction.IDLE && 'Create Token'}
                                    {transaction === Transaction.WAITING && (
                                        <ButtonLoader text="Creating" />
                                    )}
                                    {transaction === Transaction.PROCESSING && (
                                        <ButtonLoader text="Processing" />
                                    )}
                                </Button>
                            </Box>
                        </form>
                    </PrimaryCard>
                </>
            )}

            {showTokenCreation && (
                <TokenCreation
                    data={data}
                    address={deployedTokenAddress}
                    txHash={txHash}
                    setShowTokenCreation={setShowTokenCreation}
                    reset={reset}
                />
            )}
        </Box>
    );
};

export default CreateToken;
