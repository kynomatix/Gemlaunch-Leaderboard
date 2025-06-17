import React from 'react';
import MainModal, { IModalState } from '.';
import { useAccount, useBalance, useDisconnect, useNetwork } from 'wagmi';
import { Button, Typography } from '@mui/material';
import { shortenAddress } from '@/utils/format';
import { watchContractEvent } from 'wagmi/actions';

const ConnectedModal = ({ open, setOpen }: IModalState) => {
    const { connector, address, status } = useAccount();
    const { disconnect } = useDisconnect();
    const { data: accountBalance } = useBalance({ address });

    const { chain } = useNetwork();

    const { data, isFetching, isLoading, refetch, error } = useBalance({
        address,
    });
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <MainModal title="Account Status" openModal={open} onClose={handleClose}>
            <div style={{ marginBottom: '16px' }}>
                <Typography color="common.white" variant="h5" fontSize={14}>
                    Address:{' '}
                    <span style={{ fontSize: '12px', fontWeight: 400 }}>
                        {address && shortenAddress(address)}
                    </span>
                </Typography>
                <Typography color="common.white" variant="h5" fontSize={14}>
                    Status: <span style={{ fontSize: '12px', fontWeight: 400 }}>{status}</span>
                </Typography>

                {data && (
                    <Typography color="common.white" variant="h5" fontSize={14}>
                        Balance:{' '}
                        <span style={{ fontSize: '12px', fontWeight: 400 }}>
                            {accountBalance?.formatted} {accountBalance.symbol}
                        </span>
                    </Typography>
                )}
            </div>
            <Button
                variant="contained"
                size="small"
                sx={{ borderRadius: '2px', mr: 1 }}
                onClick={() => refetch()}
            >
                Refresh Balance
            </Button>
            <Button
                variant="contained"
                size="small"
                sx={{ borderRadius: '2px' }}
                onClick={() => {
                    disconnect();
                    handleClose();
                }}
            >
                Disconnect
            </Button>
        </MainModal>
    );
};

export default ConnectedModal;
