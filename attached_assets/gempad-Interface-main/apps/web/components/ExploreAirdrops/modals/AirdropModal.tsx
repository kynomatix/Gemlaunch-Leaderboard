import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Enable UTC plugin

import React from 'react';
import MainModal from '../../Modals';
// eslint-disable-next-line import/named
import { AirdropModalFormInputs, AirdropTime, Tx, ModalProps, AirdropModalProps } from '../types';
import {
    Box,
    Button,
    Collapse,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers';
import ButtonLoader from '../../ButtonLoader/ButtonLoader';
import { useAirdropContract } from '@/hooks/useContract';
import { AIRDROP_CONTRACT_ADDRESSES, DefaultGasLimit } from '@/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { airdropModalValidation } from '../validations';
import { waitForTransaction } from 'wagmi/actions';
import {
    Address,
    useAccount,
    useBalance,
    useContractWrite,
    useNetwork,
    usePrepareContractWrite,
} from 'wagmi';
import { ApprovalState, useApproveCallback } from '@/hooks/useApproveCallback';
import { useToken } from '@/hooks/Tokens';
import tryParseAmount from '@dapp/utils/tryParseAmount';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import toast from 'react-hot-toast';
import { AirdropABI } from '@/config/abi/airdrop'; // Import UTC plugin
import { useSingleCallResult } from '@/state/multicall/hooks';
import { useActiveChainId } from '@/hooks/useActiveChainId';

dayjs.extend(utc);

const AirdropModal = (props: AirdropModalProps) => {
    const {
        open,
        handleClose,
        contractAddress,
        tokenAddress,
        tokensRequired,
        tokenSymbol,
        allocations,
    } = props;

    const [tx, setTx] = React.useState<Tx>(Tx.IDLE);

    const contract = useAirdropContract(contractAddress);
    const { chainId } = useActiveChainId();
    const { address } = useAccount();

    const { result: participants, loading } = useSingleCallResult({
        contract,
        functionName: 'getParticipants',
    });

    const { data } = useBalance({
        address,
        token: tokenAddress,
    });

    const {
        control,
        handleSubmit,
        watch,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<AirdropModalFormInputs>({
        mode: 'onChange',
        defaultValues: {
            timeType: AirdropTime.NOW,
            startTime: undefined,
        },
        resolver: yupResolver(airdropModalValidation) as any,
    });
    const timeType = Number(watch('timeType'));

    const tokenCurrency = useToken(tokenAddress);
    const parsedAmount = tryParseAmount(tokensRequired, tokenCurrency);
    const { approvalState, approveCallback } = useApproveCallback(parsedAmount, contractAddress);

    const onSubmit: SubmitHandler<AirdropModalFormInputs> = async (
        data: AirdropModalFormInputs,
    ) => {
        try {
            setTx(Tx.PENDING);
            const { startTime, timeType } = data;
            let timeUTC = 0n;
            if (timeType === AirdropTime.NOW) {
                // temp fix: contract execution fails when pass the current time
                // that's why passing 5 seconds before time
                // timeUnix = dayjs().unix() - 5 as unknown as bigint;
                timeUTC = BigInt(dayjs().subtract(5, 'second').utc().unix());
            }

            if (timeType === AirdropTime.SPECIFIC) {
                // timeUnix = dayjs(String(startTime)).unix() as unknown as bigint;
                timeUTC = BigInt(dayjs.utc(String(startTime)).unix());
            }

            const estimatedGas = await contract.estimateGas.startAirdrop([timeUTC], {} as never);
            const hash = await contract.write.startAirdrop([timeUTC], {
                gas: estimatedGas || DefaultGasLimit,
            } as never);

            setTx(Tx.PROCESSING);
            await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Transaxtion Successfull"
                    txChainId={chainId}
                    txHash={hash}
                />,
            );
            handleClose();
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e?.name || 'Error'}
                    description={e?.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTx(Tx.IDLE);
        }
    };

    const getRequiredTokens = (tokens: number, percent: number) => {
        return (tokens * percent) / 100 + tokens;
    };

    const handleApprove = async (e) => {
        e.preventDefault();
        try {
            setTx(Tx.PENDING);
            const { hash } = await approveCallback();
            setTx(Tx.PROCESSING);
            await waitForTransaction({ hash, chainId });
        } catch (e) {
            console.error(e);
        } finally {
            setTx(Tx.IDLE);
        }
    };

    return (
        <MainModal title="Start Airdrop" openModal={open} onClose={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                    <FormLabel id="currency">
                        <Typography color="common.white" variant="h5">
                            Set time to start airdrop
                        </Typography>
                    </FormLabel>
                    <Controller
                        name="timeType"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                {...field}
                                value={field.value}
                                row
                                onChange={async (e) => {
                                    field.onChange(e);
                                    await trigger('startTime');
                                }}
                            >
                                <FormControlLabel
                                    value={AirdropTime.NOW}
                                    control={<Radio sx={{ color: '#fff' }} />}
                                    label={
                                        <Typography
                                            variant="body1"
                                            fontSize={14}
                                            color="common.white"
                                        >
                                            Start Now
                                        </Typography>
                                    }
                                />
                                <FormControlLabel
                                    value={AirdropTime.SPECIFIC}
                                    control={<Radio sx={{ color: '#fff' }} />}
                                    label={
                                        <Typography
                                            variant="body1"
                                            fontSize={14}
                                            color="common.white"
                                        >
                                            Start with specific time
                                        </Typography>
                                    }
                                />
                            </RadioGroup>
                        )}
                    />
                </FormControl>

                <Collapse in={timeType === AirdropTime.SPECIFIC}>
                    <Typography variant="h5" ml={1} mb={1} mt={1} color="common.white">
                        Start Time (UTC) <span style={{ color: '#FF8484' }}>*</span>
                    </Typography>
                    <Controller
                        name="startTime"
                        control={control}
                        render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
                            <DateTimePicker
                                {...field}
                                sx={{ width: '100%' }}
                                inputRef={ref}
                                disablePast={true}
                                timezone="UTC"
                                slotProps={{
                                    textField: {
                                        onBlur,
                                        name,
                                        error: !!fieldState.error,
                                        helperText: fieldState?.error?.message,
                                    },
                                }}
                            />
                        )}
                    />
                    <Typography variant="body1" fontSize={12} ml={1} color="primary">
                        Set the time that you want to start this airdrop
                    </Typography>
                </Collapse>

                {!participants?.length ? (
                    <Typography color="common.white" fontSize={12} textAlign="center">
                        You can`t start airdrop without adding allocations
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItmes: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                        mt={1}
                    >
                        {approvalState !== ApprovalState.APPROVED ? (
                            <Button
                                onClick={handleApprove}
                                variant="contained"
                                size="small"
                                disabled={tx !== Tx.IDLE}
                            >
                                {tx === Tx.IDLE && 'Approve'}
                                {tx === Tx.PENDING && <ButtonLoader text="Pending" />}
                                {tx === Tx.PROCESSING && <ButtonLoader text="Processing" />}
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                variant="contained"
                                size="small"
                                disabled={isSubmitting}
                                sx={{ width: { xs: '100%', md: 'auto' } }}
                            >
                                {tx === Tx.IDLE && 'Start Airdrop'}
                                {tx === Tx.PENDING && <ButtonLoader text="Pending" />}
                                {tx === Tx.PROCESSING && <ButtonLoader text="Processing" />}
                            </Button>
                        )}
                        <Typography color="common.white" fontSize={12} textAlign="center" mt={1}>
                            You need at least {getRequiredTokens(+tokensRequired, 5)} {tokenSymbol}{' '}
                            to start airdrop. Your Balance: {data?.formatted} {tokenSymbol}
                        </Typography>
                    </Box>
                )}
            </form>
        </MainModal>
    );
};

export default AirdropModal;
