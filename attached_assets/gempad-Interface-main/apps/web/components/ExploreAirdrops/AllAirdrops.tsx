import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import { Airdrop, AirdropEdge } from '@/src/gql/graphql';
import { OperationVariables, useQuery } from '@apollo/client';
import { Box, Button, Grid } from '@mui/material';
import { useNetwork } from 'wagmi';
import AirdropCard from './AirdropCard';
import CardsLoading from './CardsLoading';
import { GET_ALL_AIRDROPS } from './query';
import { QueryData } from './types';
import { loadMore } from './utils';
import NoData from '../NoData/NoData';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useActiveChainId } from '@/hooks/useActiveChainId';

const AllAirdrops = () => {
    const { chainId } = useActiveChainId();

    const { data, fetchMore, loading } = useQuery<QueryData, OperationVariables>(GET_ALL_AIRDROPS, {
        variables: {
            first: 9,
            after: null,
            orderBy: 'createdAt_DESC',
        },
        context: { chainId },
        fetchPolicy: 'network-only',
    });

    // the array coming from backend is readonly and we can not reverse that directly
    // that is why we need to do this
    const airdrops: AirdropEdge[] = data && data.airdropsConnection.edges;

    return (
        <>
            <InfiniteScroll
                dataLength={airdrops?.length ?? 0}
                next={() => loadMore(fetchMore, data) as any}
                hasMore={data?.airdropsConnection?.pageInfo.hasNextPage}
                loader={
                    <Grid container columnSpacing="20px" rowSpacing="40px" sx={{ mt: 2 }}>
                        {[1, 2, 3].map((x) => (
                            <Grid item xs={12} sm={6} md={4} key={x}>
                                <CardsLoading key={x} />
                            </Grid>
                        ))}
                    </Grid>
                }
                endMessage={
                    <p style={{ textAlign: 'center', marginTop: '10px' }}>
                        <b>No More Airdrops</b>
                    </p>
                }
            >
                <Grid container spacing={6}>
                    {airdrops?.map(({ node }, id) => (
                        <Grid item xs={12} sm={6} md={4} key={id}>
                            <AirdropCard {...(node as Airdrop)} />
                        </Grid>
                    ))}
                </Grid>
                {loading && !airdrops && (
                    <Grid container columnSpacing="20px" rowSpacing="40px" sx={{ mt: 2 }}>
                        {[1, 2, 3].map((x) => (
                            <Grid item xs={12} sm={6} md={4} key={x}>
                                <CardsLoading key={x} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </InfiniteScroll>

            {airdrops?.length === 0 && !loading && (
                <Grid item mt={3} xs={12} sx={{ mt: 10 }}>
                    <NoData msg="No Data" />
                </Grid>
            )}
        </>
    );
};

export default AllAirdrops;
