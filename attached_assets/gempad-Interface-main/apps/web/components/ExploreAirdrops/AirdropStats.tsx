'use client';

import * as React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import { Box, Typography } from '@mui/material';
import { getAirdropsAggrigation } from './query';
import { useAccount, useNetwork } from 'wagmi';
import { useLazyQuery } from '@apollo/client';

const AirdropStats = () => {
    const [aggregations, setAggregations] = React.useState<any>();

    const { address } = useAccount();
    const { chain } = useNetwork();
    const chainId = chain?.id;

    const [getAggrigation, { data }] = useLazyQuery(getAirdropsAggrigation, {
        context: { chainId },
    });

    React.useEffect(() => {
        if (!address) return;
        getAggrigation();
    }, [getAggrigation, address]);

    React.useEffect(() => {
        setAggregations(data?.aggregations?.[0]);
    }, [data]);

    return (
        <Box>
            <Typography variant="subtitle2" fontWeight={500} sx={{ pl: '30px', mb: '16px' }}>
                Airdrop
            </Typography>
            <PrimaryCard py={30}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        gap: '10px',
                        flexWrap: 'wrap',
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h5">AIRDROP LAUNCHED</Typography>
                        <Typography color="primary" variant="h5" fontSize={36}>
                            {aggregations?.totalAirdropsLaunched ?? 0}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h5">PARTICIPANTS IN ALL-TIME</Typography>
                        <Typography color="primary" variant="h5" fontSize={36}>
                            {aggregations?.totalParticipantsAirdrops ?? 0}
                        </Typography>
                    </Box>
                </Box>
            </PrimaryCard>
        </Box>
    );
};

export default AirdropStats;
