import * as React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import MainModal from '../../Modals';
import TextFieldError from '../../TextField/TextFieldError';
import TextFieldHead from '../../TextField/TextFieldHead';
import { vestingModalDefaultValues } from '../constants';
import { ModalProps, Tx, VestingModalFormInputs } from '../types';
import { vestingModalValidation } from '../validations';
import { useAirdropContract } from '@/hooks/useContract';
import { DefaultGasLimit } from '@/constants';
import { disableScroll } from '@/utils/disableScroll';
import { waitForTransaction } from 'wagmi/actions';
import { useNetwork } from 'wagmi';
import ButtonLoader from '../../ButtonLoader/ButtonLoader';
import toast from 'react-hot-toast';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import { useActiveChainId } from '@/hooks/useActiveChainId';

const VestingModal = (props: ModalProps) => {
    const { open, handleClose, contractAddress } = props;
    const { chainId } = useActiveChainId();
    const [tx, setTx] = React.useState<Tx>(Tx.IDLE);
    const airdropContract = useAirdropContract(contractAddress);

    const {
        control,
        handleSubmit,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<VestingModalFormInputs>({
        mode: 'onChange',
        defaultValues: vestingModalDefaultValues,
        resolver: yupResolver(vestingModalValidation) as any,
    });

    const onSubmit: SubmitHandler<VestingModalFormInputs> = async (
        data: VestingModalFormInputs,
    ) => {
        try {
            setTx(Tx.PENDING);
            const { cycle, cycleRelease, tge } = data;

            const tgeBigNumber = BigInt(tge * 1e3);
            const cycleReleaseBigNumber = BigInt(cycleRelease * 1e3);
            const cycleUnix = BigInt(cycle * 60 * 60 * 24);

            const estimatedGas = await airdropContract.estimateGas.setVestingInfo(
                [tgeBigNumber, cycleReleaseBigNumber, cycleUnix],
                {} as never,
            );

            const hash = await airdropContract.write.setVestingInfo(
                [tgeBigNumber, cycleReleaseBigNumber, cycleUnix],
                { gas: estimatedGas || DefaultGasLimit } as never,
            );

            setTx(Tx.PROCESSING);
            await waitForTransaction({ hash, chainId });
            handleClose();
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Vesting Added"
                    txHash={hash}
                    txChainId={chainId}
                />,
            );
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name ?? 'Error'}
                    description={e.shortMessage ?? 'Something went wrong'}
                />,
            );
        } finally {
            setTx(Tx.IDLE);
        }
    };

    return (
        <MainModal title="Set Vesting" openModal={open} onClose={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <TextFieldHead title="TGE Release Percent (%)" isRequired={true} />
                    <Controller
                        name="tge"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                fullWidth
                                onWheel={disableScroll}
                                onChange={async (e) => {
                                    field.onChange(e);
                                    await trigger('cycle');
                                }}
                                placeholder="Ex: 12"
                                error={!!errors?.tge}
                                helperText={<TextFieldError fieldName={errors?.tge} />}
                            />
                        )}
                    />
                </Box>
                <Box mt={1}>
                    <TextFieldHead title="Cycle release percent (%)" isRequired={true} />
                    <Controller
                        name="cycleRelease"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                fullWidth
                                onWheel={disableScroll}
                                placeholder="Ex: 10"
                                error={!!errors?.cycleRelease}
                                helperText={<TextFieldError fieldName={errors?.cycleRelease} />}
                            />
                        )}
                    />
                </Box>
                <Box mt={1} mb={1}>
                    <TextFieldHead title="Cycle (days)" isRequired={true} />
                    <Controller
                        name="cycle"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                fullWidth
                                onChange={async (e) => {
                                    field.onChange(e);
                                    await trigger('tge');
                                }}
                                onWheel={disableScroll}
                                placeholder="Ex: 7"
                                error={!!errors?.cycle}
                                helperText={<TextFieldError fieldName={errors?.cycle} />}
                            />
                        )}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        disabled={isSubmitting}
                        sx={{ width: { xs: '100%', md: 'auto' } }}
                    >
                        {tx === Tx.IDLE && 'Set Vesting'}
                        {tx === Tx.PENDING && <ButtonLoader text="Pending" />}
                        {tx === Tx.PROCESSING && <ButtonLoader text="Processing" />}
                    </Button>
                </Box>
            </form>
        </MainModal>
    );
};

export default VestingModal;
