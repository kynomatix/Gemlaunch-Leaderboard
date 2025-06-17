import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import { PrivateSale, PrivateSaleEdge } from '@/src/gql/graphql';
import { OperationVariables, useQuery } from '@apollo/client';
import { Box, Button, Grid } from '@mui/material';
import React from 'react';
import { useAccount, useNetwork } from 'wagmi';
import NoData from '../NoData/NoData';
import CardLoader from './CardLoader';
import PrivateSaleCard from './PrivateSaleCard';
import { getQueryByFilterMyContribution, sortByFilter, statusFilter } from './constants';
import { GET_MY_CONTRIBUTION_PRIVATE_SALE } from './query';
import { PrivateSaleListProps, QueryData } from './types';
import { loadMore } from './utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { getCurrentTimeDayjs } from '@/utils/getCurrentTimeDayjs';

const MyContribution: React.FC<PrivateSaleListProps> = ({ searchTerm, filterBy, sortBy }) => {
    const { address } = useAccount();
    const { chainId } = useActiveChainId();
    const currentTimeRef = React.useRef(undefined);

    const { data, loading, fetchMore } = useQuery<QueryData, OperationVariables>(
        getQueryByFilterMyContribution[filterBy],
        {
            variables: {
                first: 9,
                after: null,
                orderBy: sortByFilter[sortBy],
                owner: address,
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

    const privateSales: PrivateSaleEdge[] = data && data.privateSalesConnection?.edges;

    return (
        <>
            <InfiniteScroll
                dataLength={privateSales?.length ?? 0}
                next={() => loadMore(fetchMore, data) as any}
                hasMore={data?.privateSalesConnection?.pageInfo.hasNextPage}
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
                    {privateSales?.map(({ node }, id) => (
                        <Grid key={id} item xs={12} md={6} lg={4}>
                            <PrivateSaleCard {...(node as PrivateSale)} />
                        </Grid>
                    ))}
                </Grid>
                {loading && !privateSales && (
                    <Grid container columnSpacing="20px" rowSpacing="40px">
                        {[1, 2, 3].map((x) => (
                            <Grid item xs={12} md={6} lg={4} key={x}>
                                <CardLoader key={x} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </InfiniteScroll>
            {privateSales?.length === 0 && !loading && (
                <Grid item mt={3} xs={12}>
                    <NoData msg="No Data" />
                </Grid>
            )}
        </>
    );
};

export default MyContribution;
