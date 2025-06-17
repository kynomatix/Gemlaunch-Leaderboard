'use client';

import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import images from '../../public/assets/images/images';
import Image from 'next/image';
import { Gilroy, NeueMachina } from '@/constants';
import Link from 'next/link';

const Hero = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: {
                    xs: '100px',
                    md: '110px',
                },
                gap: '40px',
            }}
        >
            <Typography
                variant="h1"
                data-aos="fade-up"
                sx={{
                    textAlign: 'center',
                    maxWidth: '1148px',
                    lineHeight: '120%',
                    fontFamily: NeueMachina.style.fontFamily,
                }}
            >
                &quot;Unleash Your Gem with Gemlaunch: Decentralized Token Sales Simplified&quot;
            </Typography>
            <Typography
                variant="subtitle2"
                data-aos="fade-up"
                sx={{
                    textAlign: 'center',
                    maxWidth: '1148px',
                    lineHeight: '135%',
                    position: 'relative',
                    zIndex: 10,
                    fontFamily: Gilroy.style.fontFamily,
                }}
            >
                where the future of decentralized token sales begins. Our platform is designed to
                empower blockchain projects and entrepreneurs like you. With Gemlaunch, you can
                effortlessly launch your tokens, access a global community of investors, and bring
                your vision to life.
            </Typography>
            {/* <Box
                sx={{
                    display: 'grid',
                    alignItems: 'center',
                    gridTemplateColumns: { xs: '1fr 1fr', md: '2fr 2fr' },
                    // gap: '20px',
                    // flexWrap: 'wrap',
                    position: 'relative',
                    zIndex: 10,
                }}
            > */}
            <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{ position: 'relative', zIndex: 10 }}
            >
                <Grid item xs={12} sm="auto">
                    <Link href="/home">
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            Explore
                        </Button>
                    </Link>
                </Grid>
                <Grid item xs={12} sm="auto">
                    <Link
                        href="https://gems-organization-1.gitbook.io/gemlaunch/"
                        target="_blank"
                    >
                        <Button
                            variant="contained"
                            size="large"
                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                        >
                            Documentation
                        </Button>
                    </Link>
                </Grid>
            </Grid>
            {/* </Box> */}

            <Box
                sx={{
                    width: '100%',
                    height: '591px',
                    position: 'absolute',
                    left: '0px',
                    right: '0px',
                    top: '450px',
                    display: {
                        xs: 'none',
                        md: 'flex',
                    },
                }}
            >
                <Image src={images.Hero} alt="herobg" layout="fill" />
            </Box>
        </Box>
    );
};

export default Hero;
