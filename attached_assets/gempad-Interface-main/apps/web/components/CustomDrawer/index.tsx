'use client';

import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AppHeader from '../AppHeader/AppHeader';
import AppFooter from '../AppFooter/AppFooter';
import { Collapse, Container, useMediaQuery } from '@mui/material';
import { navLinks } from '@/constants';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import LogoNav from 'public/assets/icons/logo-nav.svg';
import { usePathname } from 'next/navigation';
import GemLaunchLogo from 'public/assets/icons/gemlaunch-logo.svg';
import { useNetwork } from 'wagmi';
import { fantomTestnet, bscTestnet, bsc } from 'viem/chains';
import NetworkCard from '../NetworkCard/NetworkCard';
import BlockchainNetwork from '../BlockchainButton/BlockchainNetwork';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useActiveChainId } from '@/hooks/useActiveChainId';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
    },
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    // width: `calc(${theme.spacing(7)} + 1px)`,
    width: 0,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    // [theme.breakpoints.up('md')]: {
    //     width: 950,
    // },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: '100%',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': {
                ...closedMixin(theme),
                [theme.breakpoints.down('xs')]: {
                    width: 0,
                },
                // [theme.breakpoints.down('md')]: {
                //     width: 950,
                // },
            },
        }),
    }),
);

const chains = [bsc];

export default function CustomDrawer({ children }: { children: React.ReactNode }) {
    const isMobile = useMediaQuery('(max-width:900px)');
    const [open, setOpen] = React.useState(false);
    const [expandedAccordions, setExpandedAccordions] = React.useState([]);
    const [isChainSupported, setIsChainSupported] = React.useState<boolean>(false);

    const pathname = usePathname();
    console.log({ pathname });
    const { chainId } = useActiveChainId();
    const { open: openWeb3Modal } = useWeb3Modal();

    React.useEffect(() => {
        if (chains.some((chain) => chain.id === chainId)) {
            setIsChainSupported(true);
        } else {
            setIsChainSupported(false);
        }
    }, [chainId]);

    React.useEffect(() => {
        if (isMobile) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [isMobile]);

    const handleAccordionToggle = (index) => {
        const newExpandedAccordions = [...expandedAccordions];
        newExpandedAccordions[index] = !newExpandedAccordions[index];
        setExpandedAccordions(newExpandedAccordions);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setExpandedAccordions([]);
        setOpen(false);
    };

    const handleMenuClicked = () => {
        if (isMobile) {
            handleDrawerClose();
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                open={open}
                PaperProps={{
                    sx: {
                        background: '#0B1B18',
                        overflowY: 'scroll',
                        scrollbarWidth: 'none',
                    },
                }}
            >
                <DrawerHeader>
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                display: 'flex',
                                alignItems: 'center',
                                // border: '1px solid red',
                                // px: 2.5,
                                '&:hover': {
                                    backgroundColor: '#0B1B18',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    // mr: open ? 3 : 'auto',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {open ? (
                                    <Box sx={{ mt: 1 }}>
                                        <Box
                                            sx={{
                                                display: { xs: 'none', sm: 'flex' },
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Link
                                                href="/"
                                                style={{ position: 'absolute', left: -8 }}
                                            >
                                                <GemLaunchLogo />
                                            </Link>
                                        </Box>
                                        <Box
                                            onClick={() => openWeb3Modal({ view: 'Networks' })}
                                            sx={{ display: { xs: 'flex', sm: 'none' } }}
                                        >
                                            <BlockchainNetwork />
                                        </Box>
                                    </Box>
                                ) : (
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        onClick={handleDrawerOpen}
                                        edge="start"
                                        sx={{
                                            ...(open && { display: 'none' }),
                                        }}
                                    >
                                        {/* <MenuIcon /> */}
                                        <LogoNav />
                                    </IconButton>
                                )}
                            </ListItemIcon>
                            <ListItemText
                            // primary={<Typography>Hello</Typography>}
                            // sx={{ opacity: open ? 1 : 0 }}
                            />
                            <IconButton
                                onClick={handleDrawerClose}
                                sx={{
                                    mt: 1,
                                    display: open ? 'block' : 'none',
                                    position: 'absolute',
                                    right: 0,
                                    borderRadius: "50%"
                                }}
                            >
                                {open ? <ChevronRightIcon /> : <ChevronRightIcon />}
                            </IconButton>
                        </ListItemButton>
                    </ListItem>
                </DrawerHeader>

                <List>
                    {navLinks.map(({ id, Icon, text, link, isAccordion, childLinks }, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            {isAccordion ? (
                                <>
                                    <ListItemButton
                                        onClick={() => {
                                            handleDrawerOpen();
                                            handleAccordionToggle(index);
                                        }}
                                        sx={{
                                            marginRight: id === 9 ? '10px' : '0px',
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                            '&:hover': {
                                                backgroundColor: '#22CDA619',
                                            },
                                            background: childLinks?.some((linkItem) => {
                                                return (
                                                    pathname.includes(linkItem?.link) ||
                                                    (id === 6 && pathname.includes('/record'))
                                                );
                                            })
                                                ? '#22CDA619'
                                                : 'transparent',
                                            color: childLinks?.some((linkItem) => {
                                                return (
                                                    pathname.includes(linkItem?.link) ||
                                                    (id === 6 && pathname.includes('/record'))
                                                );
                                            })
                                                ? '#22CDA6'
                                                : '#FFFFFF',
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                marginRight: id === 9 ? '2px' : '0px',
                                                minWidth: 0,
                                                maxWidth: 30,
                                                flexShrink: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                                color: childLinks?.some((linkItem) => {
                                                    return (
                                                        pathname.includes(linkItem?.link) ||
                                                        (id === 6 && pathname.includes('/record'))
                                                    );
                                                })
                                                    ? '#22CDA6'
                                                    : '#FFFFFF',
                                            }}
                                        >
                                            <Icon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    sx={{
                                                        marginLeft:
                                                            id === 6 || id === 7 ? '6px' : '0px',
                                                        color: childLinks?.some((linkItem) => {
                                                            return (
                                                                pathname.includes(linkItem?.link) ||
                                                                (id === 6 &&
                                                                    pathname.includes('/record'))
                                                            );
                                                        })
                                                            ? '#22CDA6'
                                                            : '#FFFFFF',
                                                    }}
                                                >
                                                    {text}
                                                </Typography>
                                            }
                                            sx={{ opacity: open ? 1 : 0 }}
                                        />
                                        {open && (
                                            <ExpandMoreIcon
                                                sx={{
                                                    transform: expandedAccordions[index]
                                                        ? 'rotate(180deg)'
                                                        : 'none',
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                    <Collapse
                                        in={expandedAccordions[index]}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <List component="div" disablePadding>
                                            {childLinks?.map(
                                                ({
                                                    id,
                                                    text,
                                                    link,
                                                    Icon,
                                                }: {
                                                    id: number;
                                                    text: string;
                                                    link: string;
                                                    Icon?: any;
                                                }) => (
                                                    <Link
                                                        href={link}
                                                        key={id}
                                                        target={Icon ? '_blank' : '_self'}
                                                    >
                                                        <ListItemButton
                                                            onClick={handleMenuClicked}
                                                            sx={{
                                                                '&:hover': {
                                                                    backgroundColor: '#22CDA619',
                                                                },
                                                                minHeight: 48,
                                                                alignItems: open
                                                                    ? 'initial'
                                                                    : 'center',
                                                                px: 2.5,
                                                                flexDirection: 'column',
                                                            }}
                                                        >
                                                            <ListItemIcon></ListItemIcon>
                                                            <ListItemText
                                                                primary={
                                                                    <Typography
                                                                        variant="body1"
                                                                        fontSize={8}
                                                                        color="common.white"
                                                                        sx={{
                                                                            display: 'flex',
                                                                            gap: 1.5,
                                                                            fontSize: '16px',
                                                                            opacity: open ? 1 : 0,
                                                                            color: pathname.includes(
                                                                                link,
                                                                            )
                                                                                ? '#22CDA6'
                                                                                : '#ffffff',
                                                                        }}
                                                                    >
                                                                        {Icon && <Icon />}
                                                                        {text}
                                                                    </Typography>
                                                                }
                                                                sx={{
                                                                    opacity: open ? 1 : 0,
                                                                }}
                                                            />
                                                        </ListItemButton>
                                                    </Link>
                                                ),
                                            )}
                                        </List>
                                    </Collapse>
                                </>
                            ) : (
                                <Link
                                    href={link}
                                    target={id === 4 || id === 12 ? '_blank' : '_self'}
                                >
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            '&:hover': {
                                                backgroundColor: '#22CDA619',
                                            },
                                            background: childLinks?.some((linkItem) =>
                                                pathname.includes(linkItem?.link),
                                            )
                                                ? '#22CDA619'
                                                : 'transparent',
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                            color:
                                                `/${pathname.split('/')[1]}` === link
                                                    ? '#22CDA6'
                                                    : '#FFFFFF',
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                                color:
                                                    `/${pathname.split('/')[1]}` === link
                                                        ? '#22CDA6'
                                                        : '#FFFFFF',
                                            }}
                                        >
                                            <Icon />
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={
                                                <Typography
                                                    sx={{
                                                        color:
                                                            `/${pathname.split('/')[1]}` === link
                                                                ? '#22CDA6'
                                                                : '#FFFFFF',
                                                    }}
                                                >
                                                    {text}
                                                </Typography>
                                            }
                                            sx={{ opacity: open ? 1 : 0 }}
                                        />
                                    </ListItemButton>
                                </Link>
                            )}
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, px: { xs: 0, sm: 1, md: 3 }, overflow: 'auto' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                        justifyContent: 'space-between',
                    }}
                >
                    <Container disableGutters={false} maxWidth="lg" sx={{ mt: 4 }}>
                        <AppHeader handleDrawerOpen={handleDrawerOpen} />
                        {isChainSupported ? children : <NetworkCard />}
                    </Container>
                    <Box sx={{ mt: '60px' }}>
                        <AppFooter />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
