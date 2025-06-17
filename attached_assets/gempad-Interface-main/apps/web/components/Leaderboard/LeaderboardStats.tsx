'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';
import { LeaderboardStatsProps } from './types';
import { formatAmount } from '@/utils/formatAmount';
import { formatUnits } from 'viem';

const LeaderboardStats: React.FC<LeaderboardStatsProps> = ({ launchpads, raisedContribution }) => {
    const totalSuccess = launchpads?.filter(
        (x) =>
            +formatUnits(x.investedAmount, x.fundToken.decimals) >=
            +formatUnits(x.softCap, x.fundToken.decimals),
    )?.length;

    return (
        <PrimaryCard py={30} mt={30}>
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
                    <Typography variant="h5">TOTAL SUCCESS THIS WEEK</Typography>
                    <Typography color="primary" variant="h5" fontSize={36}>
                        {totalSuccess ?? 0}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h5">TOTAL RAISED THIS WEEK</Typography>
                    <Typography color="primary" variant="h5" fontSize={36}>
                        ${formatAmount(raisedContribution, 2) ?? 0}
                    </Typography>
                </Box>
            </Box>
        </PrimaryCard>
    );
};

export default LeaderboardStats;
