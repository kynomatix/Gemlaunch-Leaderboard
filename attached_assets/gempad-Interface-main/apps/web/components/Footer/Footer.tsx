'use client';

import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import Image from 'next/image';
import LogoFull from 'public/assets/icons/gemlaunch-logo.svg';
import { Build, Gilroy, GilroyBold, Network, Network2, Stake } from '@/constants';
import Link from 'next/link';

const Footer = () => {
    return (
        <Box sx={{ width: 'full', height: 'auto', mt: '40px', mb: '40px' }}>
            <Grid container direction="column">
                <Grid item>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            gap: '20px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Box sx={{ cursor: 'pointer' }}>
                            <Link href="/" scroll={true}>
                                <LogoFull />
                            </Link>
                        </Box>
                        <Box sx={{ display: 'flex', gap: '90px', flexWrap: 'wrap' }}>
                            <Box>
                                <Typography
                                    mb={'17px'}
                                    sx={{ fontFamily: GilroyBold.style.fontFamily }}
                                    variant="subtitle2"
                                >
                                    Launchpads
                                </Typography>
                                {Network.map((link) => (
                                    <Link key={link.id} href={link.ref}>
                                        <Typography
                                            variant="body1"
                                            sx={{ mb: '10px', '&:hover': { color: '#22CDA6' } }}
                                        >
                                            {link.text}
                                        </Typography>
                                    </Link>
                                ))}
                            </Box>
                            <Box>
                                <Typography
                                    mb={'17px'}
                                    variant="subtitle2"
                                    sx={{ fontFamily: GilroyBold.style.fontFamily }}
                                >
                                    Build
                                </Typography>
                                {Build.map((link) => (
                                    <Link
                                        key={link.id}
                                        href={link.ref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{ mb: '10px', '&:hover': { color: '#22CDA6' } }}
                                        >
                                            {link.text}
                                        </Typography>
                                    </Link>
                                ))}
                            </Box>
                            <Box>
                                <Typography
                                    mb={'17px'}
                                    sx={{ fontFamily: GilroyBold.style.fontFamily }}
                                    variant="subtitle2"
                                >
                                    Create Token
                                </Typography>
                                {Stake.map((link) => (
                                    <Link key={link.id} href={link.ref}>
                                        <Typography
                                            variant="body1"
                                            sx={{ mb: '10px', '&:hover': { color: '#22CDA6' } }}
                                        >
                                            {link.text}
                                        </Typography>
                                    </Link>
                                ))}
                            </Box>
                            <Box>
                                <Typography
                                    mb={'17px'}
                                    sx={{ fontFamily: GilroyBold.style.fontFamily }}
                                    variant="subtitle2"
                                >
                                    Socials
                                </Typography>
                                {Network2.map((link) => (
                                    <Link
                                        key={link.id}
                                        href={link.ref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Typography
                                            variant="body1"
                                            sx={{ mb: '10px', '&:hover': { color: '#22CDA6' } }}
                                        >
                                            {link.text}
                                        </Typography>
                                    </Link>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item>
                    <Box>
                        <Typography
                            sx={{
                                fontSize: { xs: '12px' },
                                mt: '23px',
                                mb: '30px',
                                color: 'white',
                                textAlign: 'left',
                            }}
                        >
                            All Right Reserved ©️ {new Date().getFullYear()} Gemlaunch
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Footer;
