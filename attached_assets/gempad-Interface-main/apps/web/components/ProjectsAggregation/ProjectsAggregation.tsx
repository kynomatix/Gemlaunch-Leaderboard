'use client';

import React from 'react';
import AppStatsCard from '../AppStatsCard/AppStatsCard';
import { Grid, Skeleton } from '@mui/material';
import { OperationVariables, useQuery } from '@apollo/client';
import { GET_HOME_AGGREGATIONS } from './query';
import { QueryData } from './types';
import useCalculateRaisedContribution from '@/hooks/useCalculateRaisedContribution';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { formatAmount } from '@/utils/formatAmount';
import { CurrencyData } from '@/constants/types';

const ProjectsAggregation = ({ currencyData }: { currencyData: CurrencyData }) => {
    const { chainId } = useActiveChainId();
    const { data, loading, refetch } = useQuery<QueryData, OperationVariables>(
        GET_HOME_AGGREGATIONS,
    );

    const aggregation = data?.aggregations?.[0];

    const { raisedContribution } = useCalculateRaisedContribution(
        aggregation?.raisedContributionNative,
        aggregation?.raisedContributionUSDC,
        aggregation?.raisedContributionUSDT,
        currencyData,
    );

    React.useEffect(() => {
        refetch();
    }, [chainId, refetch]);

    const cards = [
        { id: 1, title: 'Funded Projects', value: aggregation?.fundedProjects ?? 0 },
        {
            id: 2,
            title: 'Raised Contribution',
            value: `$${formatAmount(raisedContribution)}` ?? '$0',
        },
        {
            id: 3,
            title: 'Unique Participants',
            value: aggregation?.uniqueParticipants?.length ?? 0,
        },
    ];

    return (
        <Grid container spacing={4} mt={1}>
            {!loading &&
                cards.map((x) => (
                    <Grid
                        key={x.id}
                        item
                        xs={12}
                        md={6}
                        lg={4}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <AppStatsCard title={x.title} value={x.value} />
                    </Grid>
                ))}
            {loading &&
                [1, 2, 3].map((x) => (
                    <Grid
                        key={x}
                        item
                        xs={12}
                        md={6}
                        lg={4}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <Skeleton
                            animation="wave"
                            variant="rounded"
                            sx={{ width: '100%', height: '105px', borderRadius: '10px' }}
                        />
                    </Grid>
                ))}
        </Grid>
    );
};

export default ProjectsAggregation;
