'use client';

import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { GilroyBold, comunity } from '@/constants';
import Image from 'next/image';

import ArrowRight from '@/public/assets/icons/arrow-right.svg';

const Comunity = () => {
    return (
        <>
            <Box sx={{ mt: '201px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box
                        data-aos="fade-up"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: { xs: 'center', md: 'flex-start' },
                        }}
                    >
                        <Typography variant="h3" sx={{ fontFamily: GilroyBold.style.fontFamily }}>
                            World-Class <span style={{ color: '#11B6DB' }}>Backers</span> And
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                columnGap: '51px',
                                mt: '14px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <ArrowRight />
                            <Typography
                                variant="h3"
                                sx={{ fontFamily: GilroyBold.style.fontFamily }}
                            >
                                <span style={{ color: '#22CDA6' }}>Community</span> Members
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Grid container mt={5} rowSpacing={4}>
                    {comunity.map(({ id, image, alt }) => (
                        <Grid
                            key={id}
                            item
                            lg={3}
                            md={4}
                            sm={6}
                            xs={12}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Image src={image} alt={alt} data-aos="fade-up" width={200} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </>
    );
};

export default Comunity;
