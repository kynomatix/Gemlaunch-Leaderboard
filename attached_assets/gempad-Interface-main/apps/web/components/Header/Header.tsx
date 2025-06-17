'use client';

import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { homeNavigation } from '@/constants';
import Logo from 'public/assets/icons/landing-logo.svg';
import LogoHalf from 'public/assets/icons/logo-nav.svg';
import Hamburger from 'public/assets/icons/hamburger.svg';
import Slider from '@/components/Slider/Slider';
import Link from 'next/link';

const Header = () => {
    const [open, setOpen] = React.useState(false);
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: '20px',
            }}
        >
            <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <Logo />
            </Box>
            <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
                <LogoHalf />
            </Box>
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    gap: '37px',
                }}
            >
                {homeNavigation.map(({ id, text, link }) => (
                    <Link href={link} key={id} target={text === 'Docs' ? '_blank' : '_self'}>
                        <Typography
                            fontSize={20}
                            sx={{ cursor: 'pointer', '&:hover': { color: '#22CDA6' } }}
                        >
                            {text}
                        </Typography>
                    </Link>
                ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link href="/create-launchpad">
                    <Button variant="outlined" size="large">
                        Launch App
                    </Button>
                </Link>

                <IconButton
                    sx={{ display: { xs: 'flex', md: 'none' } }}
                    onClick={() => setOpen(true)}
                >
                    <Hamburger />
                </IconButton>

                <Slider open={open} setOpen={setOpen} />
            </Box>
        </Box>
    );
};

export default Header;
