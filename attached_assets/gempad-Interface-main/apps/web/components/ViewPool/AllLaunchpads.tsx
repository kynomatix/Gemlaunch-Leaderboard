import { Box, Button, Grid, Typography } from '@mui/material';
import React from 'react';
import {
    LaunchPad,
    LaunchPadEdge,
    PrivateSale,
    PrivateSaleEdge,
    PrivateSalesConnection,
} from '@/src/gql/graphql';
import { OperationVariables, useQuery } from '@apollo/client';
import { FilterBy, LaunchpadsListProps, QueryData } from './types';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import NoData from '../NoData/NoData';
import { loadMore } from './utils';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { GET_ALL_LAUNCHPADS } from './query';
import ViewPoolCard from './ViewPoolCard';
import { getQueryByFilterAllLaunchpads, sortByFilter, statusFilter } from './constant';
import CardLoader from './CardLoader';
import { useLaunchpadContract } from '@/hooks/useContract';
import { Address } from 'viem';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getCurrentTimeDayjs } from '@/utils/getCurrentTimeDayjs';

const AllLaunchpads: React.FC<LaunchpadsListProps> = ({ filterBy, searchTerm, sortBy }) => {
    const { chainId } = useActiveChainId();
    const currentTimeRef = React.useRef(undefined);

    const { data, loading, fetchMore } = useQuery<QueryData, OperationVariables>(
        getQueryByFilterAllLaunchpads[filterBy],
        {
            variables: {
                first: 9,
                after: null,
                orderBy: sortByFilter[sortBy],
                searchTerm,
                currentTime: currentTimeRef.current,
                isCancelled: statusFilter[filterBy].isCancelled,
            },
            context: { chainId },
            fetchPolicy: 'network-only',
        },
    );

    React.useEffect(() => {
        if (statusFilter[filterBy].date !== undefined) {
            currentTimeRef.current = getCurrentTimeDayjs();
        } else {
            currentTimeRef.current = undefined;
        }
    }, [filterBy]);

    const launchpads: LaunchPadEdge[] = data && data.launchPadsConnection.edges;

    return (
        <>
            <InfiniteScroll
                dataLength={launchpads?.length ?? 0}
                next={() => loadMore(fetchMore, data)}
                hasMore={data?.launchPadsConnection?.pageInfo.hasNextPage}
                loader={
                    <Grid container columnSpacing="20px" rowSpacing="40px" sx={{ mt: 1 }}>
                        {[1, 2, 3].map((x) => (
                            <Grid item xs={12} md={6} lg={4} key={x}>
                                <CardLoader key={x} />
                            </Grid>
                        ))}
                    </Grid>
                }
            >
                <Grid container columnSpacing="20px" rowSpacing="40px" sx={{ mt: 1 }}>
                    {launchpads?.map(({ node }, id) => (
                        <Grid key={node.id} item xs={12} md={6} lg={4}>
                            <ViewPoolCard {...(node as LaunchPad)} />
                        </Grid>
                    ))}
                </Grid>
                {loading && !launchpads && (
                    <Grid container columnSpacing="20px" rowSpacing="40px">
                        {[1, 2, 3].map((x) => (
                            <Grid item xs={12} md={6} lg={4} key={x}>
                                <CardLoader key={x} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </InfiniteScroll>

            {launchpads?.length === 0 && !loading && (
                <Grid item mt={3} xs={12}>
                    <NoData msg="No Data" />
                </Grid>
            )}
        </>
    );
};

export default AllLaunchpads;
