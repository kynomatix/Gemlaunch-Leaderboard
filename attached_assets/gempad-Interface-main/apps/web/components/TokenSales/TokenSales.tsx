'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import images from '../../public/assets/images/images';
import { Gilroy, NeueMachina } from '@/constants';

const TokenSales = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '90px',
                mt: '110px',
                flexWrap: {
                    xs: 'wrap',
                    md: 'nowrap',
                },
            }}
        >
            <Box
                data-aos="fade-right"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: { xs: '100%', md: 'auto' },
                }}
            >
                <Image src={images.TokenSales} alt="token-sales" />
            </Box>
            <Box>
                <Typography
                    variant="h2"
                    data-aos="fade-right"
                    sx={{
                        maxWidth: '689px',
                        lineHeight: '115%',
                        fontFamily: NeueMachina.style.fontFamily,
                    }}
                >
                    A SUITE OF TOOLS FOR <span style={{ color: '#0FD7D2' }}>TOKEN SALES.</span>
                </Typography>
                <Typography
                    data-aos="fade-right"
                    variant="subtitle1"
                    sx={{
                        maxWidth: '950px',
                        lineHeight: '120%',
                        mt: '11px',
                        fontFamily: Gilroy.style.fontFamily,
                    }}
                >
                    A suite of tools were built to help you create your own tokens and launchpads in
                    a fast, simple and cheap way, with no prior code knowledge required and 100%
                    decentralized!
                </Typography>
            </Box>
        </Box>
    );
};

export default TokenSales;
