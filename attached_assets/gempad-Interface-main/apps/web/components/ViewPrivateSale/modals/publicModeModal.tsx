import MainModal from '@/components/Modals';
import { ModalProps, PublicTime, PublicTimeFormInput, Tx } from '../types';
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
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
import React from 'react';
import { publicModeModalValidation } from '../validation';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { DefaultGasLimit } from '@/constants';
import { usePrivateSaleContract } from '@/hooks/useContract';
import { Address } from 'viem';
import { waitForTransaction } from 'wagmi/actions';
import { useNetwork } from 'wagmi';
import toast from 'react-hot-toast';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';

const PublicModeModal = (props: ModalProps) => {
    const { handleClose, open, contractAddress } = props;
    const [tx, setTx] = React.useState<Tx>(Tx.Idle);

    const { chain } = useNetwork();
    const chainId = chain?.id;

    const {
        control,
        handleSubmit,
        watch,
        formState: { isSubmitting },
    } = useForm<PublicTimeFormInput>({
        mode: 'onChange',
        defaultValues: {
            startTime: undefined,
            timeType: PublicTime.Now,
        },
        resolver: yupResolver(publicModeModalValidation) as any,
    });
    const timeType = Number(watch('timeType'));

    const contract = usePrivateSaleContract(contractAddress as Address);
    const onSubmit: SubmitHandler<PublicTimeFormInput> = async (data: PublicTimeFormInput) => {
        try {
            setTx(Tx.Pending);
            const { startTime, timeType } = data;
            let timeUnix = 0n;
            if (timeType === PublicTime.Now) {
                timeUnix = BigInt(dayjs().subtract(5, 'second').utc().unix());
            }

            if (timeType === PublicTime.Specific) {
                timeUnix = BigInt(dayjs.utc(String(startTime)).unix());
            }

            const estimatedGas = await contract.estimateGas.enablePublicSale(
                [timeUnix],
                {} as never,
            );
            const hash = await contract.write.enablePublicSale([timeUnix], {
                gas: estimatedGas || DefaultGasLimit,
            });

            setTx(Tx.Processing);
            const receipt = await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Public Mode Enabled"
                    txChainId={chainId}
                    txHash={hash}
                />,
            );
            handleClose();
            if (!receipt || timeType === PublicTime.Now) return;
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
        <MainModal title="Public Mode" openModal={open} onClose={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                    <FormLabel id="currency">
                        <Typography color="common.white" variant="h5">
                            Set time to change it to public
                        </Typography>
                    </FormLabel>
                    <Controller
                        name="timeType"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup {...field} value={field.value} row>
                                <FormControlLabel
                                    value={PublicTime.Now}
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
                                    value={PublicTime.Specific}
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

                <Collapse in={timeType === PublicTime.Specific}>
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
                        Set the time when you want to change it to public
                    </Typography>
                </Collapse>

                <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={1}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        disabled={isSubmitting}
                        sx={{ width: { xs: '100%', md: 'auto' } }}
                    >
                        {tx === Tx.Idle && 'Change to public'}
                        {tx === Tx.Pending && <ButtonLoader text="Pending" />}
                        {tx === Tx.Processing && <ButtonLoader text="Processing" />}
                    </Button>
                </Box>
            </form>
        </MainModal>
    );
};

export default PublicModeModal;
