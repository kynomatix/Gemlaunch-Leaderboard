import { Box, Button, Grid, Typography } from '@mui/material';
import React from 'react';
import PrivateSaleCard from './PrivateSaleCard';
import { PrivateSale, PrivateSaleEdge, PrivateSalesConnection } from '@/src/gql/graphql';
import { useAccount, useNetwork } from 'wagmi';
import { getQueryByFilterMyPrivateSale, sortByFilter, statusFilter } from './constants';
import { GET_MY_PRIVATE_SALE } from './query';
import { OperationVariables, useQuery } from '@apollo/client';
import { PrivateSaleListProps, QueryData } from './types';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import CardLoader from './CardLoader';
import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import NoData from '../NoData/NoData';
import { loadMore } from './utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { getCurrentTimeDayjs } from '@/utils/getCurrentTimeDayjs';

const MyPrivateSales: React.FC<PrivateSaleListProps> = ({ filterBy, searchTerm, sortBy }) => {
    const { address } = useAccount();
    const { chainId } = useActiveChainId();
    const currentTimeRef = React.useRef(undefined);

    const { data, loading, fetchMore } = useQuery<QueryData, OperationVariables>(
        getQueryByFilterMyPrivateSale[filterBy],
        {
            variables: {
                first: 9,
                after: null,
                orderBy: sortByFilter[sortBy],
                searchTerm,
                owner: address?.toLowerCase(),
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

export default MyPrivateSales;
