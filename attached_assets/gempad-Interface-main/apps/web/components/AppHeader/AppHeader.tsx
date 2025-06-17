'use client';

import React from 'react';
import { Box, Button, Typography, IconButton, CircularProgress } from '@mui/material';
import BlackGlowCard from '@/components/Cards/BlackGlowCard';
import LogoFull from 'public/assets/icons/gemlaunch-logo.svg';

import Hamburger from 'public/assets/icons/hamburger.svg';
import BNBIcon from 'public/assets/icons/BNB.svg';
import ArrowUpDownIcon from 'public/assets/icons/arrow-up-down.svg';

import ConnectWallet from '../Modals/ConnectWallet';
import { useAccount } from 'wagmi';
import { shortenAddress } from '@/utils/format';
import ConnectedModal from '../Modals/ConnectedModal';
import { NavigationContext } from '../Provider/NavigationProvider';
import BlockchainNetwork from '../BlockchainButton/BlockchainNetwork';
import SwitchNetworkModal from '../Modals/SwitchNetworkModal';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Link from 'next/link';

const AppHeader = ({ handleDrawerOpen }: { handleDrawerOpen: () => void }) => {
    const { open } = useWeb3Modal();

    const { status, address, isConnected, isDisconnected, isConnecting } = useAccount();

    return (
        <>
            <BlackGlowCard px={0}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                            sx={{
                                display: { xs: 'flex', sm: 'none' },
                            }}
                            onClick={handleDrawerOpen}
                        >
                            <Hamburger />
                        </Box>
                        <Box
                            onClick={() => open({ view: 'Networks' })}
                            sx={{ display: { xs: 'none', md: 'flex' } }}
                        >
                            <BlockchainNetwork />
                        </Box>
                        <Link href="/">
                            <Box
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                    width: { xs: '120px', md: 'auto' },
                                }}
                            >
                                <LogoFull />
                            </Box>
                        </Link>
                    </Box>

                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {isConnected && (
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                onClick={() => open()}
                            >
                                {shortenAddress(address)}
                            </Button>
                        )}

                        {isConnecting && (
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <CircularProgress size={14} color="primary" />
                                <Typography>Connecting...</Typography>
                            </Button>
                        )}
                        {isDisconnected && (
                            <Button onClick={() => open()} variant="outlined" size="large">
                                Connect
                            </Button>
                        )}
                    </Box>
                    <Box
                        onClick={() => open()}
                        sx={{
                            backgroundColor: '#22CDA6',

                            width: { xs: '32px', md: '48px' },
                            height: { xs: '32px', md: '48px' },
                            borderRadius: '24px',
                            cursor: 'pointer',
                            display: { xs: 'flex', md: 'none' },
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <AccountBalanceWalletIcon
                            sx={{ fontSize: { xs: 20, md: 30 }, color: '#000' }}
                        />
                    </Box>
                </Box>
            </BlackGlowCard>
        </>
    );
};

export default AppHeader;
