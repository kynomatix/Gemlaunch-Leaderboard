import React from 'react';
import MainModal from '@/components/Modals';
import { Box, Button, Skeleton, TextField, Typography } from '@mui/material';
import { AntibotModeModalFormInput, ModalProps, Tx } from '../types';
import Infobar from '@/components/Infobar/Infobar';
import { antibotModeMessage } from '../constants';
import TextFieldHead from '@/components/TextField/TextFieldHead';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import TextFieldError from '@/components/TextField/TextFieldError';
import { yupResolver } from '@hookform/resolvers/yup';
import { antibotModeModalValidation } from '../validation';
import { usePrivateSaleContract } from '@/hooks/useContract';
import { Address, parseUnits } from 'viem';
import useTokenDetails from '@/hooks/useTokenDetails';
import { DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { useNetwork } from 'wagmi';
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import toast from 'react-hot-toast';

const AntibotModeModal = (props: ModalProps) => {
    const { open, handleClose, contractAddress } = props;
    const [tx, setTx] = React.useState<Tx>(Tx.Idle);
    const contract = usePrivateSaleContract(contractAddress as Address);

    const { chain } = useNetwork();
    const chainId = chain?.id;

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<AntibotModeModalFormInput>({
        mode: 'onChange',
        defaultValues: {
            addr: undefined,
            minHoldingAmount: undefined,
        },
        resolver: yupResolver(antibotModeModalValidation) as any,
    });

    const {
        state: { tokenDetails, isFetching },
    } = useTokenDetails(watch('addr') as Address);
    const tokenDecimals = tokenDetails?.[2]?.value;

    const onSubmit: SubmitHandler<AntibotModeModalFormInput> = async (
        data: AntibotModeModalFormInput,
    ) => {
        try {
            setTx(Tx.Processing);
            const { addr, minHoldingAmount } = data;
            const {
                estimateGas: { enableAntibotMode: enableAntibotModeGas },
                write: { enableAntibotMode },
            } = contract;

            const amount = parseUnits(String(minHoldingAmount), Number(tokenDecimals));

            const estimatedGas = await enableAntibotModeGas([addr as Address, amount], {} as never);
            const hash = await enableAntibotMode([addr as Address, amount], {
                gas: estimatedGas || DefaultGasLimit,
            } as never);

            setTx(Tx.Pending);
            const receipt = await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Public-Antibot Mode Enabled"
                    txChainId={chainId}
                    txHash={hash}
                />,
            );
            handleClose();
            if (!receipt) return;
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e?.name ?? 'Error'}
                    description={e?.shortMessage ?? 'Something went wrong'}
                />,
            );
        } finally {
            setTx(Tx.Idle);
        }
    };

    return (
        <MainModal title="Public with holding condition" openModal={open} onClose={handleClose}>
            <Infobar
                dismissable={false}
                message={antibotModeMessage}
                open={true}
                variant="warning"
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <TextFieldHead title="Token Address" mb={1} mt={2} />
                <Controller
                    name="addr"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="text"
                            fullWidth
                            placeholder="Ex: 0x0A6aD098F65C048d1aa263d38eA174e781ae6899"
                            error={!!errors?.addr}
                            helperText={<TextFieldError fieldName={errors?.addr} />}
                        />
                    )}
                />

                <Box>
                    {isFetching && (
                        <Box sx={{ width: '100%', mb: 2, mt: 2 }}>
                            <Skeleton
                                variant="rounded"
                                animation="wave"
                                height={150}
                                sx={{ width: '100%', borderRadius: '15px' }}
                            />
                        </Box>
                    )}
                    {tokenDetails && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                mb: 2,
                                mt: 2,
                                px: 3,
                                py: 2,
                                borderRadius: 4,
                                background: '#2C453F',
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
                                    <Typography variant="h5" fontSize={12} color="common.white">
                                        {property}
                                    </Typography>
                                    <Typography variant="h5" fontSize={12} color="common.white">
                                        {value}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>

                <TextFieldHead title="Min Holding Amount" mb={1} mt={1} />
                <Controller
                    name="minHoldingAmount"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="text"
                            fullWidth
                            placeholder="Ex: 1000"
                            error={!!errors?.minHoldingAmount}
                            helperText={<TextFieldError fieldName={errors?.minHoldingAmount} />}
                        />
                    )}
                />

                <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={2}>
                    <Button
                        variant="contained"
                        type="submit"
                        size="small"
                        disabled={isSubmitting}
                        sx={{ width: { xs: '100%', md: 'auto' } }}
                    >
                        {tx === Tx.Idle && 'Save Settings'}
                        {tx === Tx.Pending && <ButtonLoader text="Pending" />}
                        {tx === Tx.Processing && <ButtonLoader text="Processing" />}
                    </Button>
                </Box>
            </form>
        </MainModal>
    );
};

export default AntibotModeModal;
