'use client';

import PrimaryCard from '@/components/Cards/PrimaryCard';
import { client } from '@/components/Provider/ChainApolloProvider';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import { EDIT_PRESALE, EDIT_PRESALE_METADATA } from '@/components/ViewPool/query';
import { EditPresaleFormInput, Tx, Upload } from '@/components/ViewPool/types';
import { EDIT_PRESALE_VALIDATION } from '@/components/ViewPool/validation';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { CHECK_STATUS } from '@/query/checkStatus';
import { LaunchPad } from '@/src/gql/graphql';
import { OperationVariables, useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    Box,
    Button,
    CircularProgress,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { useStorageUpload } from '@thirdweb-dev/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import LogoURL from 'public/assets/icons/logourl.svg';
import Website from 'public/assets/icons/website.svg';
import Twitter from 'public/assets/icons/twitter.svg';
import Facebook from 'public/assets/icons/facebook.svg';
import Github from 'public/assets/icons/github.svg';
import Reddit from 'public/assets/icons/reddit.svg';
import Telegram from 'public/assets/icons/telegram.svg';
import Youtube from 'public/assets/icons/youtube.svg';
import LockIcon from 'public/assets/icons/lock.svg';
import TextEditor from '@/components/LaunchpadForm/Editor';

export default function Page({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { chainId } = useActiveChainId();
    const { mutateAsync: upload } = useStorageUpload();
    const [logoUpload, setLogoUpload] = React.useState(Upload.IDLE);

    const [tx, setTx] = React.useState<Tx>(Tx.Idle);

    const { data } = useQuery<{ launchPads: LaunchPad[] }, OperationVariables>(EDIT_PRESALE, {
        variables: {
            contractAddress: params?.id,
        },
        context: { chainId },
        fetchPolicy: 'network-only',
    });

    console.log({ data }, 'edit launchpad');

    const [editPresaleMetadata] = useMutation(EDIT_PRESALE_METADATA, {
        client,
    });

    const [checkStatus] = useMutation(CHECK_STATUS, {
        client,
    });

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<EditPresaleFormInput>({
        mode: 'onChange',
        defaultValues: {
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
        resolver: yupResolver(EDIT_PRESALE_VALIDATION) as any,
    });

    React.useEffect(() => {
        if (!data?.launchPads?.[0]?.metadata?.socials) return;

        const {
            logoUrl,
            webUrl,
            description,
            facebookUrl,
            githubUrl,
            redditUrl,
            telegramUrl,
            twitterUrl,
            youtubeUrl,
        } = data.launchPads[0].metadata.socials;

        setValue('logoUrl', logoUrl);
        setValue('websiteUrl', webUrl);
        setValue('facebookUrl', facebookUrl ?? undefined);
        setValue('githubUrl', githubUrl ?? undefined);
        setValue('redditUrl', redditUrl ?? undefined);
        setValue('telegramUrl', telegramUrl ?? undefined);
        setValue('twitterUrl', twitterUrl ?? undefined);
        setValue('youtubeUrl', youtubeUrl ?? undefined);
        setValue('description', description ?? undefined);
    }, [data, setValue]);

    const onSubmit: SubmitHandler<EditPresaleFormInput> = async (data) => {
        try {
            setTx(Tx.Pending);
            const res = await checkStatus();
            if (!res) throw new Error('Server is not available!');

            const {
                description,
                facebookUrl,
                githubUrl,
                logoUrl,
                redditUrl,
                telegramUrl,
                twitterUrl,
                websiteUrl,
                youtubeUrl,
            } = data;

            await editPresaleMetadata({
                variables: {
                    contractAddress: params?.id,
                    description,
                    facebookUrl,
                    githubUrl,
                    logoUrl,
                    redditUrl,
                    telegramUrl,
                    twitterUrl,
                    webUrl: websiteUrl,
                    youtubeUrl,
                },
            });

            toast.success(<DescriptionWithTx title="Success" description="Presale updated" />);
            router.back();
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

    const uploadImageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setLogoUpload(Upload.PENDING);
            const file = event.target.files[0];
            if (!file) {
                toast.error(
                    <DescriptionWithTx title="Error" description="File is not available" />,
                );
                return;
            }

            const image = new Image();
            image.src = URL.createObjectURL(file);

            image.onload = async () => {
                if (image.width > 200 || image.height > 200) {
                    toast.error(
                        <DescriptionWithTx
                            title="Error"
                            description="Image dimensions should be 200x200 pixels or less."
                        />,
                    );
                    setLogoUpload(Upload.IDLE);
                    return;
                }

                if (
                    file.type !== 'image/jpeg' &&
                    file.type !== 'image/png' &&
                    file.type !== 'image/jpg'
                ) {
                    toast.error(
                        <DescriptionWithTx
                            title="Error"
                            description="Only JPEG or PNG images are allowed."
                        />,
                    );
                    return;
                }

                const uploadUrl = await upload({
                    data: [file],
                    options: {
                        uploadWithGatewayUrl: true,
                        uploadWithoutDirectory: true,
                    },
                });

                setValue('logoUrl', uploadUrl[0], { shouldValidate: true });
                setLogoUpload(Upload.IDLE);
            };
        } catch (error: any) {
            console.error({ error });
            toast.error(
                <DescriptionWithTx
                    title={error.name || 'Error'}
                    description={error.shortMessage || 'Something wrong with file'}
                />,
            );
            setLogoUpload(Upload.IDLE);
        }
    };

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    justifyContent: 'space-between',
                    mt: '36px',
                    mb: '16px',
                    px: '30px',
                }}
            >
                <Typography variant="h5" fontSize={20}>
                    Edit Presale
                </Typography>
                <LockIcon />
            </Box>
            <PrimaryCard>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="body1"
                                sx={{ mb: '9px', color: '#FF8484' }}
                                ml={2}
                                fontSize={12}
                            >
                                (*) is required field.
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '25px',
                                flexDirection: { xs: 'column', sm: 'row' },
                            }}
                        >
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h5" mb="9px" ml={2}>
                                    Logo URL <span style={{ color: '#FF8484' }}>*</span>
                                </Typography>
                                <Controller
                                    name="logoUrl"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="url"
                                            fullWidth
                                            defaultValue={field.value || ''}
                                            placeholder="Ex: https://..."
                                            error={!!errors?.logoUrl}
                                            helperText={
                                                <>
                                                    <Typography variant="body2">
                                                        {errors?.logoUrl?.message?.toString()}
                                                    </Typography>
                                                    <Typography
                                                        color="primary"
                                                        variant="h5"
                                                        fontSize={14}
                                                        mt={1}
                                                    >
                                                        Upload image should be 200 x 200px in JPG or
                                                        PNG.
                                                    </Typography>
                                                </>
                                            }
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LogoURL />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <label htmlFor="file">
                                                            {logoUpload === Upload.PENDING ? (
                                                                <CircularProgress size={15} />
                                                            ) : (
                                                                <Button
                                                                    component={Box}
                                                                    variant="contained"
                                                                    size="small"
                                                                    sx={{ px: '15px' }}
                                                                >
                                                                    Upload
                                                                </Button>
                                                            )}
                                                        </label>
                                                        <input
                                                            onChange={(e) => uploadImageHandler(e)}
                                                            type="file"
                                                            id="file"
                                                            style={{ display: 'none' }}
                                                            accept=".jpeg, .jpg, .png"
                                                        />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h5" mb="9px" ml={2}>
                                    Website <span style={{ color: '#FF8484' }}>*</span>
                                </Typography>
                                <Controller
                                    name="websiteUrl"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="url"
                                            fullWidth
                                            defaultValue={field.value || ''}
                                            placeholder="Ex: https://..."
                                            error={!!errors?.websiteUrl}
                                            helperText={
                                                <Typography variant="body2">
                                                    {errors?.websiteUrl?.message?.toString()}
                                                </Typography>
                                            }
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Website />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '25px',
                                flexDirection: { xs: 'column', sm: 'row' },
                                mt: '24px',
                            }}
                        >
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h5" mb="9px" ml={2}>
                                    Facebook
                                </Typography>
                                <Controller
                                    name="facebookUrl"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="url"
                                            defaultValue={field.value || ''}
                                            fullWidth
                                            placeholder="Ex: https://facebook.com/..."
                                            error={!!errors?.facebookUrl}
                                            helperText={
                                                <Typography variant="body2" mt={1}>
                                                    {errors?.facebookUrl?.message?.toString()}
                                                </Typography>
                                            }
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Facebook />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h5" mb="9px" ml={2}>
                                    Twitter
                                </Typography>
                                <Controller
                                    name="twitterUrl"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="url"
                                            defaultValue={field.value || ''}
                                            fullWidth
                                            placeholder="Ex: https://twitter.com/..."
                                            error={!!errors?.twitterUrl}
                                            helperText={
                                                <Typography variant="body2" mt={1}>
                                                    {errors?.twitterUrl?.message?.toString()}
                                                </Typography>
                                            }
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Twitter />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '25px',
                                flexDirection: { xs: 'column', sm: 'row' },
                                mt: '24px',
                            }}
                        >
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h5" mb="9px" ml={2}>
                                    Github
                                </Typography>
                                <Controller
                                    name="githubUrl"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="url"
                                            fullWidth
                                            defaultValue={field.value || ''}
                                            placeholder="Ex: https://github.com/..."
                                            error={!!errors?.githubUrl}
                                            helperText={
                                                <Typography variant="body2" mt={1}>
                                                    {errors?.githubUrl?.message?.toString()}
                                                </Typography>
                                            }
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Github />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h5" mb="9px" ml={2}>
                                    Telegram
                                </Typography>
                                <Controller
                                    name="telegramUrl"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="url"
                                            fullWidth
                                            defaultValue={field.value || ''}
                                            placeholder="Ex: https://t.me/..."
                                            error={!!errors?.telegramUrl}
                                            helperText={
                                                <Typography variant="body2" mt={1}>
                                                    {errors?.telegramUrl?.message?.toString()}
                                                </Typography>
                                            }
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Telegram />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '25px',
                                flexDirection: { xs: 'column', sm: 'row' },
                                mt: '24px',
                            }}
                        >
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h5" mb="9px" ml={2}>
                                    Reddit
                                </Typography>
                                <Controller
                                    name="redditUrl"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="url"
                                            fullWidth
                                            defaultValue={field.value || ''}
                                            placeholder="Ex: https://reddit.com/..."
                                            error={!!errors?.redditUrl}
                                            helperText={
                                                <Typography variant="body2" mt={1}>
                                                    {errors?.redditUrl?.message?.toString()}
                                                </Typography>
                                            }
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Reddit />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h5" mb="9px" ml={2}>
                                    Youtube Video
                                </Typography>
                                <Controller
                                    name="youtubeUrl"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="url"
                                            fullWidth
                                            defaultValue={field.value || ''}
                                            placeholder="Ex: https://www.youtube.com/watch?v=xxxxxxxxx"
                                            error={!!errors?.youtubeUrl}
                                            helperText={
                                                <Typography variant="body2" mt={1}>
                                                    {errors?.youtubeUrl?.message?.toString()}
                                                </Typography>
                                            }
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Youtube />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                mt: '24px',
                            }}
                        >
                            <Typography variant="h5" mb="9px" ml={2}>
                                Description
                            </Typography>
                            {/* <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="text"
                                        fullWidth
                                        defaultValue={field.value || ''}
                                        error={!!errors?.description}
                                        helperText={
                                            <Typography variant="body2" mt={1}>
                                                {errors?.description?.message?.toString()}
                                            </Typography>
                                        }
                                        multiline
                                        rows={8}
                                        placeholder="Ex: Add description about your project here..."
                                    />
                                )}
                            /> */}
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <TextEditor
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            bond="description"
                                        />
                                        {errors?.description && (
                                            <div style={{ color: 'red', marginTop: '8px' }}>
                                                {errors.description.message?.toString()}
                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <Button type="submit" variant="contained">
                            Update
                        </Button>
                    </Box>
                </form>
            </PrimaryCard>
        </Box>
    );
}
