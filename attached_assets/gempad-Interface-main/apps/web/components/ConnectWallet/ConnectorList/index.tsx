import PrimaryCard from '@/components/Cards/PrimaryCard';
import { Box, Button } from '@mui/material';
import React from 'react';
import { useConnect } from 'wagmi';

const Connectors = () => {
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect();

    return (
        <>
            {connectors.map((connector) => (
                <Button
                    sx={{ borderRadius: '2px', mx: 1, my: 1 }}
                    variant="contained"
                    size="small"
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => {
                        connect({ connector });
                    }}
                >
                    {connector.name}
                    {isLoading && pendingConnector?.id === connector.id && ' (connecting)'}
                </Button>
            ))}
        </>
    );
};

export default Connectors;
