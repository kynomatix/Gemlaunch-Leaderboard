'use client';

import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import {
    Box,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import Divider from '../Divider/Divider';
import { styled } from '@mui/material/styles';
import { Address, useNetwork } from 'wagmi';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { SaveConfigFormInput } from './types';
import { SAVE_CONFIG } from './constants';
import {
    ANTIBOT_CONTRACT_ADDRESSES,
    DEFAULT_CHAIN_ID,
    DefaultGasLimit,
    PAIR_TOKENS,
    ROUTERS,
    Router,
} from '@/constants';
import TextFieldHead from '../TextField/TextFieldHead';
import { disableScroll } from '@/utils/disableScroll';
import TextFieldError from '../TextField/TextFieldError';
import { yupResolver } from '@hookform/resolvers/yup';
import { SAVE_CONFIG_VALIDATION } from './validation';
import { useCreateAntibotContract } from '@/hooks/useContract';
import { waitForTransaction } from 'wagmi/actions';
import ButtonLoader from '../ButtonLoader/ButtonLoader';
import toast from 'react-hot-toast';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import { useActiveChainId } from '@/hooks/useActiveChainId';

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                background:
                    'linear-gradient(to right, #0FD7D2, #17D8CA, #39DFA7, #54E48B, #68E877, #73EA6B, #77EB67)',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

enum Transaction {
    IDLE,
    PENDING,
    PROCESSING,
}
interface ConfigProps {
    tokenAddress: Address;
}

const Config = ({ tokenAddress }: ConfigProps) => {
    const [transaction, setTransaction] = React.useState<Transaction>(Transaction.IDLE);

    const isPending = transaction === Transaction.PENDING;
    const isProcessing = transaction === Transaction.PROCESSING;
    const isIdle = transaction === Transaction.IDLE;

    const { chainId } = useActiveChainId();

    const ANTIBOT = useCreateAntibotContract(ANTIBOT_CONTRACT_ADDRESSES[chainId] as Address);

    const {
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SaveConfigFormInput>({
        mode: 'onChange',
        defaultValues: SAVE_CONFIG,
        resolver: yupResolver(SAVE_CONFIG_VALIDATION) as any,
    });

    const router = watch('router');

    const routers: Router[] = ROUTERS[chainId || DEFAULT_CHAIN_ID];
    const pairTokens = PAIR_TOKENS[router];

    React.useEffect(() => {
        const defaultRouter = routers[0].address;
        setValue('router', defaultRouter as Address);
    }, [chainId, routers, setValue]);

    React.useEffect(() => {
        const defaultpair = pairTokens?.[0]?.addr;
        setValue('pairToken', defaultpair);
    }, [chainId, pairTokens, setValue, router]);

    const onSubmit: SubmitHandler<SaveConfigFormInput> = async (data: SaveConfigFormInput) => {
        setTransaction(Transaction.PENDING);

        try {
            const {
                router,
                pairToken,
                amountLimitPerTrade,
                timLimitPerTrade,
                blockNumber,
                amountPerBlock,
            } = data;

            const { estimateGas, write } = ANTIBOT;

            const estimatedGas = await estimateGas.saveConfig(
                [
                    tokenAddress,
                    router,
                    pairToken,
                    BigInt(amountLimitPerTrade),
                    BigInt(amountPerBlock),
                    BigInt(timLimitPerTrade),
                    BigInt(blockNumber),
                ],
                {} as never,
            );
            const hash = await write.saveConfig(
                [
                    tokenAddress,
                    router,
                    pairToken,
                    BigInt(amountLimitPerTrade),
                    BigInt(amountPerBlock),
                    BigInt(timLimitPerTrade),
                    BigInt(blockNumber),
                ],
                { gas: estimatedGas || DefaultGasLimit } as never,
            );
            setTransaction(Transaction.PROCESSING);
            await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Token Configured"
                    txChainId={chainId}
                    txHash={hash}
                />,
            );
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name || 'Error'}
                    description={e.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTransaction(Transaction.IDLE);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <PrimaryCard py={30}>
                <Typography variant="h5">Gem Anti-Bot config</Typography>
                <Divider color="#ffffff" />

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '20px',
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        <TextFieldHead title="Router" isRequired={true} />
                        <Controller
                            name="router"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    MenuProps={{ disableScrollLock: true }}
                                    value={field.value || routers[0].address}
                                    fullWidth
                                    sx={{
                                        '.MuiSvgIcon-root ': {
                                            fill: 'white !important',
                                        },
                                    }}
                                >
                                    {routers.map((x) => (
                                        <MenuItem key={x.name} value={x.address}>
                                            {x.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <TextFieldHead title="Select Pair Token" isRequired={true} />
                        <Controller
                            name="pairToken"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    MenuProps={{ disableScrollLock: true }}
                                    value={field.value || pairTokens?.[0]?.addr || 'a'} // TODO: fix this later: default value not setting if remove a
                                    fullWidth
                                    sx={{
                                        '.MuiSvgIcon-root ': {
                                            fill: 'white !important',
                                        },
                                    }}
                                >
                                    {pairTokens?.map((x) => (
                                        <MenuItem key={x.name} value={x.addr}>
                                            {x.name}
                                        </MenuItem>
                                    ))}
                                    {/* <MenuItem value="a">a</MenuItem> */}
                                </Select>
                            )}
                        />
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItem: 'flex-start',
                        gap: '15px',
                        justifyContent: 'space-between',
                        mt: '20px',
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        <TextFieldHead title="Amount Limit Per Trade" isRequired={true} />
                        <Controller
                            name="amountLimitPerTrade"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    fullWidth
                                    value={field.value}
                                    placeholder="0"
                                    onScroll={disableScroll}
                                    error={!!errors?.amountLimitPerTrade}
                                    helperText={
                                        <TextFieldError fieldName={errors?.amountLimitPerTrade} />
                                    }
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <TextFieldHead title="Amount Per Block" isRequired={true} />
                        <Controller
                            name="amountPerBlock"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    fullWidth
                                    value={field.value}
                                    placeholder="0"
                                    onScroll={disableScroll}
                                    error={!!errors?.amountPerBlock}
                                    helperText={
                                        <TextFieldError fieldName={errors?.amountPerBlock} />
                                    }
                                />
                            )}
                        />
                    </Box>
                </Box>

                <Box>
                    <Box sx={{ mt: '20px' }}>
                        <TextFieldHead title="Time Limit Per Trade (seconds)" isRequired={true} />

                        <Controller
                            name="timLimitPerTrade"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    fullWidth
                                    value={field.value}
                                    placeholder="0"
                                    onScroll={disableScroll}
                                    error={!!errors?.timLimitPerTrade}
                                    helperText={
                                        <TextFieldError fieldName={errors?.timLimitPerTrade} />
                                    }
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ mt: '20px' }}>
                        <TextFieldHead
                            title="Block Number to Disable Anti-Bot (Listing is Block #1)"
                            isRequired={true}
                        />
                        <Controller
                            name="blockNumber"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    fullWidth
                                    value={field.value}
                                    placeholder="0"
                                    onScroll={disableScroll}
                                    error={!!errors?.blockNumber}
                                    helperText={<TextFieldError fieldName={errors?.blockNumber} />}
                                />
                            )}
                        />
                    </Box>
                </Box>

                {/* <FormControlLabel
                    sx={{ mt: 2, ml: '0px' }}
                    label={
                        <Typography ml={1} variant="body1" fontSize={12}>
                            Disable contract transfer?
                        </Typography>
                    }
                    control={<AntSwitch sx={{ color: '#fff' }} />}
                /> */}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: '35px' }}>
                    <Button variant="contained" type="submit" size="large" disabled={isSubmitting}>
                        {isPending && <ButtonLoader text="Pending" />}
                        {isProcessing && <ButtonLoader text="Processing" />}
                        {isIdle && 'Save Config'}
                    </Button>
                </Box>
            </PrimaryCard>
        </form>
    );
};

export default Config;
