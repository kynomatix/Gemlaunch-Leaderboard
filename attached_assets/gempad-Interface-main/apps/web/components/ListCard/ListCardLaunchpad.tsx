'use client';

import { Box, Skeleton, Typography } from '@mui/material';
import RocketIcon from 'public/assets/icons/rocket.svg';
import SecondaryCard from '../Cards/SecondaryCard';
import ListCardRow from './ListCardRow';
import { GemTokensQueryData, LatestPoolsQueryData, ListType } from './types';
import { OperationVariables, useQuery } from '@apollo/client';
import { GET_LAUNCHPADS } from './query';
import NoData from '../NoData/NoData';
import { getLaunchpadRouteByContractName } from '../ViewPool/utils';
import Link from 'next/link';

const styles = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    mb: '20px',
    ml: '20px',
};

const ListCardLaunchpad = () => {
    const { data: launchpads, loading } = useQuery<LatestPoolsQueryData, OperationVariables>(
        GET_LAUNCHPADS,
        {
            variables: {
                limit: 3,
            },
        },
    );

    const latestPools = launchpads?.launchPads;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={styles}>
                <RocketIcon fill="#2DFE87" />
                <Link href="/view-pool">
                    <Typography sx={{ ':hover': { textDecoration: 'underline' } }}>
                        Latest Pools
                    </Typography>
                </Link>
            </Box>
            {!!latestPools?.length && (
                <SecondaryCard px={20} py={25}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            minHeight: '155px',
                        }}
                    >
                        {latestPools?.map((x) => (
                            <ListCardRow
                                key={x.id}
                                title={x?.name}
                                desc={x?.token?.symbol}
                                image={x?.metadata?.socials?.logoUrl}
                                chainId={x?.chainId}
                                addr={getLaunchpadRouteByContractName(x.name, x.contractAddress)}
                                buttonTitle="View"
                                listType={ListType.LAUNCHPAD}
                            />
                        ))}
                    </Box>
                </SecondaryCard>
            )}
            {!latestPools?.length && !loading && (
                <SecondaryCard px={20} py={70}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <NoData msg="No Data" />
                    </Box>
                </SecondaryCard>
            )}
            {loading && (
                <Skeleton
                    height={200}
                    animation="wave"
                    variant="rounded"
                    sx={{ borderRadius: '15px' }}
                />
            )}
        </Box>
    );
};

export default ListCardLaunchpad;
