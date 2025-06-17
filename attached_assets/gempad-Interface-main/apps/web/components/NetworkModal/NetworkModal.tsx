'use client';

import { Chain } from 'viem';
import MainModal from '../Modals';
import { Box, Button, Typography } from '@mui/material';
import { useNetwork } from 'wagmi';
import * as React from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useActiveChainId } from '@/hooks/useActiveChainId';

export const NetworkModal = ({ supportedChains }: { supportedChains: Chain[] }) => {
    const [openModal, setOpenModal] = React.useState<boolean>(false);
    const { open } = useWeb3Modal();

    const { chainId } = useActiveChainId();

    const handleClose = () => {
        // if (supportedChains.some((chain) => chain.id !== chainId)) {
        //     const chains = supportedChains.map((item) => item.id);
        //     alert(`${chainId} - ${chains}`);
        //     return;
        // }
        setOpenModal(false);
    };

    const handleOpenWeb3Modal = () => {
        open({ view: 'Networks' });
    };

    React.useEffect(() => {
        if (supportedChains.some((chain) => chain.id !== chainId)) {
            setOpenModal(false);
        }
    }, [chainId, supportedChains]);

    return (
        <MainModal title="Wrong Network" openModal={openModal} onClose={handleClose}>
            <Typography variant="h5" color="common.white">
                This network is not suported yet.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Button variant="contained" onClick={handleOpenWeb3Modal}>
                    Switch Network
                </Button>
            </Box>
        </MainModal>
    );
};
