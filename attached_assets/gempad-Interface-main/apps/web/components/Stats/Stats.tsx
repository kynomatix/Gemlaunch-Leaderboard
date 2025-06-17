'use client';

import React from 'react';
import { Box } from '@mui/material';
import StatsIcon from 'public/assets/icons/stats.svg';
import TotalProjectsIcon from 'public/assets/icons/total-projects.svg';
import TotalParticipantsIcon from 'public/assets/icons/total-participants.svg';
import LiquidityRaised from 'public/assets/icons/liquidity-raised.svg';
import StatsCard from '../StatsCard/StatsCard';

import { GetStatsQueryData } from './types';
import { OperationVariables, useQuery } from '@apollo/client';
import { GET_STATS } from './query';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import useCalculateRaisedContribution from '@/hooks/useCalculateRaisedContribution';
import { formatAmount } from '@/utils/formatAmount';
import { fetchEthUsd } from '@/utils/fetchCurrencyPrice';
import { CurrencyData } from '@/constants/types';

const Stats = ({ currencyData }: { currencyData: CurrencyData }) => {
    const { data, refetch } = useQuery<GetStatsQueryData, OperationVariables>(GET_STATS);
    const { chainId } = useActiveChainId();

    const aggregation = data?.aggregations?.[0];

    const { raisedContribution } = useCalculateRaisedContribution(
        aggregation?.raisedContributionNative,
        aggregation?.raisedContributionUSDC,
        aggregation?.raisedContributionUSDT,
        currencyData,
    );

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: ['1fr', '1fr 1fr', '1fr 1fr', '1fr 1fr 1fr 1fr'], // Adjust as needed
                gap: '36px',

                mt: {
                    xs: '200px',
                    md: '500px',
                },
            }}
        >
            <StatsCard
                Icon={LiquidityRaised}
                title="Total Liquidity Raised"
                value={`$${formatAmount(raisedContribution)}` ?? '$0'}
            />
            <StatsCard
                Icon={TotalProjectsIcon}
                title="Total Projects"
                value={aggregation?.fundedProjects ?? 0}
            />
            <StatsCard
                Icon={TotalParticipantsIcon}
                title="Total Participants"
                value={aggregation?.uniqueParticipants?.length ?? 0}
            />
            <StatsCard
                Icon={StatsIcon}
                title="Total Values Locked"
                value={aggregation?.tokenLockedInUsd ?? 0}
            />
        </Box>
    );
};

export default Stats;
