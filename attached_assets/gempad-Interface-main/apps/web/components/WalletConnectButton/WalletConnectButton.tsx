import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

const WalletConnectButton = () => {
    const { isDisconnected, isConnecting, status } = useAccount();
    const { open } = useWeb3Modal();

    return (
        <Box sx={{ width: { xs: '100%', md: 'fit-content' } }}>
            {status === 'connecting' && (
                <Button
                    variant="contained"
                    size="large"
                    sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}
                >
                    <CircularProgress size={14} sx={{ color: '#212121' }} />
                    <Typography>Connecting...</Typography>
                </Button>
            )}
            {isDisconnected && (
                <Button
                    onClick={() => open()}
                    variant="contained"
                    size="large"
                    sx={{ width: '100%' }}
                >
                    Connect Wallet
                </Button>
            )}
        </Box>
    );
};

export default WalletConnectButton;
