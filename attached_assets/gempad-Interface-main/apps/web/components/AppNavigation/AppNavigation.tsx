'use client';

import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Typography,
    IconButton,
} from '@mui/material';
import LogoNav from 'public/assets/icons/logo-nav.svg';
import GemLaunchLogo from 'public/assets/icons/gemlaunch-logo.svg';
import { navLinks } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NavigationContext } from '../Provider/NavigationProvider';

const navContainerStyles = {
    height: '100vh',
    width: '59px',
    overflowX: 'hidden',
    background: '#0B1B18',
    transition: 'width 0.2s ease-in-out',
    pr: '15px',
    py: '24px',
    position: 'fixed',
    left: '0px',
    zIndex: 100,
    '&::-webkit-scrollbar': {
        width: '1rem',
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
        height: '4rem',
        borderRadius: '0.5rem',
        border: '4px solid transparent',
        backgroundClip: 'content-box',
        backgroundColor: '#22CDA660',
    },

    display: 'flex',
    flexDirection: 'column',
};

const navLinkStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '18px',
    cursor: 'pointer',
    borderRadius: '4px',
    // width: "100%",
    marginLeft: '8px',
};

const AppNavigation = () => {
    const pathname = usePathname();
    const { openSidebar, setOpenSidebar } = React.useContext(NavigationContext);
    const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});

    return (
        <Box
            sx={{
                ...navContainerStyles,
                width: openSidebar ? '260px' : '54px',
                display: { xs: openSidebar ? 'flex' : 'none', lg: 'flex' },
                overflowY: openSidebar ? 'auot' : 'hidden',
            }}
            onMouseOver={() => setOpenSidebar(true)}
            onMouseLeave={() => {
                setOpenSidebar(false);
                setExpanded({});
            }}
        >
            <Box sx={{ display: 'flex' }}>
                <Link
                    href={'/'}
                    style={{
                        width: 'fit-content',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '18px',
                        marginBottom: '40px',
                        gap: '14px',
                    }}
                >
                    {openSidebar ? <GemLaunchLogo /> : <LogoNav />}
                </Link>
                <Box sx={{ mt: '10px', pl: '10px', display: { xs: 'flex', md: 'none' } }}>
                    <CloseIcon onClick={() => setOpenSidebar(false)} />
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    gap: '8px',
                    marginLeft: '8px',
                }}
            >
                {navLinks.map(({ id, Icon, text, link, isAccordion, childLinks }, index) => (
                    <Box
                        key={id}
                        sx={{
                            width: '100%',
                            borderRadius: '4px',
                            '&:hover': {
                                background: '#22CDA619',
                            },
                        }}
                    >
                        {isAccordion ? (
                            <Box sx={{ display: 'flex' }}>
                                <Accordion
                                    onClick={() =>
                                        setExpanded((x) => ({ ...x, [index]: !x[index] || false }))
                                    }
                                    elevation={0}
                                    expanded={expanded[index] || false}
                                    sx={{
                                        backgroundColor: 'transparent',
                                        border: 0,
                                        boxShadow: 'none',

                                        width: openSidebar ? '100%' : 'auto',
                                        '&:before': {
                                            display: 'none',
                                        },
                                        position: 'relative',
                                        right: '8px',
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            <ExpandMoreIcon
                                                style={{
                                                    color: '#fff',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            />
                                        }
                                    >
                                        <Box
                                            sx={{
                                                pr: '26px',
                                                color:
                                                    pathname.includes(childLinks[0]?.link) ||
                                                    pathname.includes(childLinks[1]?.link) ||
                                                    pathname.includes(childLinks[2]?.link) ||
                                                    pathname.includes(childLinks[3]?.link) ||
                                                    pathname.includes(childLinks[4]?.link)
                                                        ? '#22CDA6'
                                                        : '#FFFFFF',
                                            }}
                                        >
                                            <Icon />
                                        </Box>
                                        <Typography
                                            color="common.white"
                                            sx={{
                                                whiteSpace: 'nowrap',
                                                color:
                                                    pathname.includes(childLinks[0]?.link) ||
                                                    pathname.includes(childLinks[1]?.link) ||
                                                    pathname.includes(childLinks[2]?.link) ||
                                                    pathname.includes(childLinks[3]?.link) ||
                                                    pathname.includes(childLinks[4]?.link)
                                                        ? '#22CDA6'
                                                        : '#FFFFFF',
                                            }}
                                        >
                                            {text}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '16px',
                                        }}
                                    >
                                        {childLinks?.map(({ id, text, link }) => (
                                            <Link href={link} key={id}>
                                                <Typography
                                                    variant="body1"
                                                    fontSize={14}
                                                    sx={{
                                                        pl: '40px',
                                                        whiteSpace: 'nowrap',
                                                        color: pathname.includes(link)
                                                            ? '#22CDA6'
                                                            : '#ffffff',
                                                        '&:hover': { color: '#22CDA6' },
                                                    }}
                                                >
                                                    {text}
                                                </Typography>
                                            </Link>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        ) : (
                            <Link href={link} style={navLinkStyles}>
                                <Box
                                    sx={{
                                        pr: '8px',
                                        py: '8px',
                                        color: pathname === link ? '#22CDA6' : '#FFFFFF',
                                    }}
                                >
                                    <Icon />
                                </Box>
                                <Typography
                                    sx={{
                                        transition: '0.3s ',
                                        // opacity: openSidebar ? '1' : '0',
                                        whiteSpace: 'nowrap',
                                        color: pathname === link ? '#22CDA6' : '#FFFFFF',
                                    }}
                                >
                                    {text}
                                </Typography>
                            </Link>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default AppNavigation;
