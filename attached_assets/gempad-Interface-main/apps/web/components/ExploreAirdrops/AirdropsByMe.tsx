import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import { Airdrop, AirdropEdge } from '@/src/gql/graphql';
import { OperationVariables, useQuery } from '@apollo/client';
import { Box, Button, Grid } from '@mui/material';
import { useAccount, useNetwork } from 'wagmi';
import AirdropCard from './AirdropCard';
import CardsLoading from './CardsLoading';
import { GET_AIRDROPS_BY_ME } from './query';
import { QueryData } from './types';
import { loadMore } from './utils';
import NoData from '../NoData/NoData';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useActiveChainId } from '@/hooks/useActiveChainId';

const AirdropsByMe = () => {
    const { address } = useAccount();
    const { chainId } = useActiveChainId();

    const { data, fetchMore, loading } = useQuery<QueryData, OperationVariables>(
        GET_AIRDROPS_BY_ME,
        {
            variables: {
                first: 9,
                after: null,
                orderBy: 'createdAt_DESC',
                owner: address.toLowerCase(),
            },
            context: { chainId },
            fetchPolicy: 'network-only',
        },
    );

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

            {data?.airdropsConnection?.pageInfo.hasNextPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <Button variant="contained" onClick={() => loadMore(fetchMore, data)}>
                        Load more
                    </Button>
                </Box>
            )}
        </>
    );
};

export default AirdropsByMe;
