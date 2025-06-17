import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import { Box, Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Gilroy } from '@/constants';

const NetworkCard = () => {
    return (
        <PrimaryCard mt={30} py={130}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                <AccountBalanceWalletIcon sx={{ fontSize: 40, color: '#ffffff' }} />
                <Box
                    sx={{
                        width: '1px',
                        height: '30px',
                        background: '#fff',
                        border: '1px solid #fff',
                        display: { xs: 'none', md: 'flex' },
                    }}
                ></Box>

                {/* Typography is not working while fetching chainId */}
                {/* <Typography textAlign="center">
                    Please connect your wallet to supported networks only................
                </Typography> */}
                <p
                    style={{
                        textAlign: 'center',
                        fontFamily: Gilroy.style.fontFamily,
                        fontWeight: 'bold',
                    }}
                >
                    Please connect your wallet to supported networks only
                </p>
            </Box>

            {/* <Box sx={{ mt: 3 }}>
                <Typography textAlign="center" color="palegreen">
                    <span style={{ color: '#fff' }}>Supoorted Networks:</span> FantomTestnet
                </Typography>
            </Box> */}
        </PrimaryCard>
    );
};

export default NetworkCard;
