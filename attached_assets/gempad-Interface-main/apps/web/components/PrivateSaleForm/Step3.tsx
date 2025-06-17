import {
    Box,
    Button,
    CircularProgress,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';

// import icons
import LogoURL from 'public/assets/icons/logourl.svg';
import Website from 'public/assets/icons/website.svg';
import Facebook from 'public/assets/icons/facebook.svg';
import Github from 'public/assets/icons/github.svg';
import Reddit from 'public/assets/icons/reddit.svg';
import Twitter from 'public/assets/icons/twitter.svg';
import Telegram from 'public/assets/icons/telegram.svg';
import Youtube from 'public/assets/icons/youtube.svg';
import { useStorageUpload } from '@thirdweb-dev/react';
import { Controller, useFormContext } from 'react-hook-form';
import * as React from 'react';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import toast from 'react-hot-toast';
import { Upload } from './types';

const Step3 = () => {
    const { mutateAsync: upload } = useStorageUpload();
    const [logoUpload, setLogoUpload] = React.useState(Upload.IDLE);

    const {
        control,
        setValue,
        formState: { errors },
    } = useFormContext();

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
                                            Upload image should be 200 x 200px in JPG or PNG.
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
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="text"
                            fullWidth
                            error={!!errors?.description}
                            helperText={
                                <Typography variant="body2" mt={1}>
                                    {errors?.description?.message?.toString()}
                                </Typography>
                            }
                            multiline
                            rows={8}
                            placeholder="Ex: This is the best project..."
                        />
                    )}
                />
            </Box>
        </Box>
    );
};

export default Step3;
