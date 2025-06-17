import React, { useState } from 'react';
import MainModal, { IModalState } from '.';
import { Box, Button, Typography } from '@mui/material';
import { switchNetwork } from 'wagmi/actions';
import { useNetwork } from 'wagmi';

enum Networks {
    // ETH_MAIN = 'Ethereum Mainnet',
    ETH_TEST = 'Ethereum Testnet',
    BNB_MAIN = 'BNB Mainnet',
    BNB_TEST = 'BNB Testnet',
}

const networkConfig = {
    // [Networks.ETH_MAIN]: { chainId: 1 },
    [Networks.ETH_TEST]: { chainId: 5 },
    [Networks.BNB_MAIN]: { chainId: 56 },
    [Networks.BNB_TEST]: { chainId: 97 },
};

const SwitchNetworkModal = ({ open, setOpen }: IModalState) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { chain } = useNetwork();

    const handleClose = () => {
        setOpen(false);
    };

    const handleSwitch = async (network: string) => {
        setLoading(true);
        try {
            const config = networkConfig[network];
            if (config) {
                await switchNetwork(config);
            }
        } catch (error) {
            console.error({ error });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainModal title="Switch Network" openModal={open} onClose={handleClose}>
            <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {Object.values(Networks).map((network) => (
                    <Button
                        key={network}
                        size="small"
                        disabled={loading || chain?.id === networkConfig[network]?.chainId}
                        variant="contained"
                        onClick={() => handleSwitch(network)}
                    >
                        {network}
                    </Button>
                ))}
            </Box>
        </MainModal>
    );
};

export default SwitchNetworkModal;
