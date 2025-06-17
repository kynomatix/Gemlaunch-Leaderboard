import React from 'react';
import MainModal, { IModalState } from '.';
import { useAccount, useConnect } from 'wagmi';
import { shortenAddress } from '@/utils/format';
import Connectors from '../ConnectWallet/ConnectorList';
import PrimaryCard from '../Cards/PrimaryCard';
import { Typography } from '@mui/material';

const ConnectWallet = ({ open, setOpen }: IModalState) => {
    const { connector: activeConnector, isConnected, address } = useAccount();
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <MainModal title="Connect Wallet" openModal={open} onClose={handleClose}>
                <>
                    <Connectors />
                    {isConnected && (
                        <Typography color="common.white" variant="body1" fontSize={14}>
                            Connected to {activeConnector?.name}
                        </Typography>
                    )}
                    {address && (
                        <Typography color="common.white" variant="body1" fontSize={14}>
                            {shortenAddress(address)}
                        </Typography>
                    )}
                    {/* {address} */}
                    {/* {status} */}

                    {error && (
                        <Typography color="common.white" variant="body1" fontSize={14}>
                            {error.message}
                        </Typography>
                    )}
                </>
            </MainModal>
        </>
    );
};

export default ConnectWallet;
