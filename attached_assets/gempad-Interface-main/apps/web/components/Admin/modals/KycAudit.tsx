import MainModal from '@/components/Modals';
import { Box, Button, TextField, Typography } from '@mui/material';
import React from 'react';
import { KycAuditFormInput, KycAuditProps } from '../types';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { kycAuditValidation } from '../validation';
import { ADD_KYC_AUDIT } from '../query';
import { client } from '@/components/Provider/ChainApolloProvider';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';

const KycAudit: React.FC<KycAuditProps> = ({
    open,
    handleClose,
    contractAddress,
    metadata,
    refetch,
}) => {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<KycAuditFormInput>({
        defaultValues: {
            audit: metadata?.audit ?? '',
            kyc: metadata?.kyc ?? '',
        },
        resolver: !metadata?.kyc && !metadata?.audit && (yupResolver(kycAuditValidation) as any),
    });

    // React.useEffect(() => {
    //     setValue('audit', metadata?.audit)
    //     setValue('kyc', metadata?.kyc)
    // })

    const [addKycAuditToLaunchpad] = useMutation(ADD_KYC_AUDIT, {
        client,
    });

    const onSubmit: SubmitHandler<KycAuditFormInput> = async (data) => {
        try {
            const { audit, kyc } = data;

            const response = await addKycAuditToLaunchpad({
                variables: {
                    contractAddress,
                    kyc,
                    audit,
                },
            });
            refetch();
            handleClose();
            toast.success(
                <DescriptionWithTx title="Success" description="Operation Successfull" />,
            );
        } catch (error: any) {
            console.log(error);
            toast.error(
                <DescriptionWithTx
                    title="Error"
                    description={error.shortMessage ?? 'Something went wrong'}
                />,
            );
        }
    };

    return (
        <MainModal title="KYC/AUDIT" openModal={open} onClose={handleClose}>
            <Typography>Add KYC and Audit</Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mt: 2 }}>
                    <Typography ml={1.5} variant="h5">
                        Audit <span style={{ color: '#FF8484' }}>*</span>
                    </Typography>
                    <Controller
                        name="audit"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="text"
                                value={field.value || ''}
                                placeholder="Ex: https://audit...."
                                fullWidth
                                error={!!errors?.audit}
                                helperText={
                                    <Typography variant="body2">
                                        {errors?.audit?.message}
                                    </Typography>
                                }
                            />
                        )}
                    />
                </Box>
                <Box sx={{ mt: 1 }}>
                    <Typography ml={1.5} variant="h5">
                        KYC <span style={{ color: '#FF8484' }}>*</span>
                    </Typography>
                    <Controller
                        name="kyc"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="text"
                                value={field.value || ''}
                                placeholder="Ex: https://kyc...."
                                fullWidth
                                error={!!errors?.kyc}
                                helperText={
                                    <Typography variant="body2">{errors?.kyc?.message}</Typography>
                                }
                            />
                        )}
                    />
                </Box>

                <Button
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                    sx={{ width: '100%', mt: 1 }}
                >
                    Submit
                </Button>
            </form>
        </MainModal>
    );
};

export default KycAudit;
