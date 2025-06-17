'use client';

import React from 'react';
import { Box, Typography, Button, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';

import Image from 'next/image';
import images from '../../public/assets/images/images';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Gilroy, NeueMachina } from '@/constants';
import toast from 'react-hot-toast';
import { Resolver } from 'dns';
import { yupResolver } from '@hookform/resolvers/yup';
import { newsLetterValidation } from './validation';
import { INewsLetterFormInputs } from './types';
import DescriptionWithTx from '../Toast/DescriptionWithTx';

const NewsLetter = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<INewsLetterFormInputs>({
        defaultValues: {
            email: undefined,
        },
        resolver: yupResolver(newsLetterValidation) as any,
    });

    const onSubmit: SubmitHandler<INewsLetterFormInputs> = async (data) => {
        try {
            const res = await axios.post('/api/subscribe', { email: data.email });
            reset();
            if (res?.data?.status === 201) {
                toast.success(
                    <DescriptionWithTx title="Success" description={res?.data?.message} />,
                );
            } else {
                toast.error(<DescriptionWithTx title="Error" description={res?.data?.error} />);
            }
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title="Error"
                    description={e?.shortMessage ?? 'Something went wrong'}
                />,
            );
        }
    };

    return (
        <Box sx={{ mt: '160px' }}>
            <Typography
                data-aos="fade-up"
                variant="h3"
                sx={{
                    textAlign: 'center',
                    maxWidth: '307px',
                    m: '0 auto',
                    fontFamily: NeueMachina.style.fontFamily,
                }}
            >
                Subscribe to <span style={{ color: '#11B6DB' }}>Gemlaunch news</span>
            </Typography>

            <Typography
                data-aos="fade-up"
                variant="subtitle2"
                sx={{
                    textAlign: 'center',
                    mt: '10px',
                    mb: '30px',
                    fontFamily: Gilroy.style.fontFamily,
                }}
            >
                Stay updated on the latest Gemlaunch news and announcements
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <Box
                        sx={{
                            borderRadius: '30px',
                            border: errors.email ? '1px solid #FF0B22' : '1px solid #ffffff',
                            padding: '4px',

                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: {
                                xs: '100%',
                                md: '650px',
                            },
                            m: '0px auto',
                        }}
                    >
                        <input
                            {...register('email', {
                                required: true,
                                pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            })}
                            type="email"
                            placeholder="Enter your email"
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: '#fff',
                                width: '100%',
                                paddingInline: '20px',
                            }}
                        />
                        <Button
                            variant="contained"
                            size="large"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {!isSubmitting ? (
                                <Typography variant="body1" color="#000" fontWeight={500}>
                                    Subscribe
                                </Typography>
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <CircularProgress size={15} sx={{ color: '#fff' }} />
                                    <Typography variant="body1" color="#000" fontWeight={500}>
                                        Subscribing
                                    </Typography>
                                </Box>
                            )}
                        </Button>
                    </Box>
                    {/* <div>
                        {errors.email && (
                            <Typography fontSize={12} sx={{ color: '#FF0B22' }} ml={3} mt={0.5}>
                                {errors.email.message}
                            </Typography>
                        )}
                    </div> */}
                </Box>
            </form>

            <Box
                sx={{
                    height: '300px',
                    width: '100%',
                    position: 'relative',
                }}
            >
                <Image src={images.SubscribeGradient} alt={'subscribe-gradient'} layout="fill" />
            </Box>
            <Box
                sx={{
                    height: '2px',
                    width: '100%',
                    position: 'relative',
                }}
            >
                <Image src={images.Line} alt="line" layout="fill" />
            </Box>
        </Box>
    );
};

export default NewsLetter;
