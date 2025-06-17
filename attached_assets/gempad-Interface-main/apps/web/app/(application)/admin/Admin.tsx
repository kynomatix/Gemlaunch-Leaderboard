'use client';

import React from 'react';
import { Box, Button, Grid, TextField, Typography, useMediaQuery } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import debounce from 'lodash/debounce';
import { QueryData, SearchFormInput } from '@/components/Admin/types';
import {
    filterByOptions,
    filterWrapper,
    getQueryByFilterAllLaunchpads,
    searchWrapper,
    sortByFilter,
    sortByOptions,
    statusFilter,
} from '@/components/Admin/constants';
import { OperationVariables, useQuery } from '@apollo/client';
import { GET_ALL_LAUNCHPADS } from '@/components/Admin/query';
import { LaunchPad, LaunchPadEdge } from '@/src/gql/graphql';
import ViewPoolCard from '@/components/ViewPool/ViewPoolCard';
import CardLoader from '@/components/ViewPool/CardLoader';
import NoData from '@/components/NoData/NoData';
import { loadMore } from '@/components/ViewPool/utils';
import Card from '@/components/Admin/Card';
import { Address, useAccount, useContractRead, useContractReads } from 'wagmi';
import {
    DUTCH_AUCTION_CONTRACT_ADDRESSES,
    FAIRLAUNCH_CONTRACT_ADDRESSES,
    LAUNCHPAD_FACTORY_CONTRACT_ADDRESSES,
    SUBSCRIPTION_CONTRACT_ADDRESSES,
} from '@/constants';
import { LaunchpadFactoryABI } from '@/config/abi/launchpadFactory';
import { useRouter } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import SelectFilter from '@/components/SelectFilter/SelectFilter';
import { getCurrentTimeDayjs } from '@/utils/getCurrentTimeDayjs';

export default function Admin() {
    const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState<string>();
    const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
    const currentTimeRef = React.useRef(undefined);

    const { chainId } = useActiveChainId();
    const { address } = useAccount();

    const { control, watch } = useForm<SearchFormInput>({
        mode: 'onChange',
        defaultValues: {
            filterBy: 0,
            sortBy: 0,
            searchTerm: undefined,
        },
    });

    const searchTerm = watch('searchTerm');
    const filterBy = watch('filterBy');
    const sortBy = watch('sortBy');

    const { data: factoryOwners, isLoading } = useContractReads({
        contracts: [
            {
                address: LAUNCHPAD_FACTORY_CONTRACT_ADDRESSES[chainId] as Address,
                abi: LaunchpadFactoryABI,
                functionName: 'owner',
            },
            {
                address: FAIRLAUNCH_CONTRACT_ADDRESSES[chainId] as Address,
                abi: LaunchpadFactoryABI,
                functionName: 'owner',
            },
            {
                address: SUBSCRIPTION_CONTRACT_ADDRESSES[chainId] as Address,
                abi: LaunchpadFactoryABI,
                functionName: 'owner',
            },
            {
                address: DUTCH_AUCTION_CONTRACT_ADDRESSES[chainId] as Address,
                abi: LaunchpadFactoryABI,
                functionName: 'owner',
            },
        ],
    });

    React.useEffect(() => {
        if (
            address !== factoryOwners?.[0]?.result &&
            address !== factoryOwners?.[1]?.result &&
            address !== factoryOwners?.[2]?.result &&
            address !== factoryOwners?.[3]?.result
        ) {
            setIsAdmin(false);
        } else {
            setIsAdmin(true);
        }
    }, [factoryOwners, chainId, address]);

    React.useEffect(() => {
        const debounceSearch = debounce(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        debounceSearch();

        // cleanup function to prevent memory leaks
        return () => {
            debounceSearch.cancel();
        };
    }, [searchTerm]);

    const { data, loading, fetchMore, refetch } = useQuery<QueryData, OperationVariables>(
        getQueryByFilterAllLaunchpads[filterBy],
        {
            variables: {
                first: 9,
                after: null,
                orderBy: sortByFilter[sortBy],
                searchTerm: debouncedSearchTerm,
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
        <Box sx={{ mt: '30px' }}>
            {!isAdmin && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="h4" fontWeight={500} mb={'30px'}>
                        You are not an admin
                    </Typography>
                </Box>
            )}

            {isAdmin && (
                <>
                    <Typography variant="h4" fontWeight={500} mt={'30px'}>
                        Admin Panel Launchpads
                    </Typography>
                    <form>
                        <Box sx={searchWrapper}>
                            <Controller
                                name="searchTerm"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="text"
                                        fullWidth
                                        placeholder="Enter token symbol"
                                        InputProps={{
                                            sx: {
                                                borderRadius: '25px',
                                                border: '1px solid #7D7D7D',
                                            },
                                        }}
                                    />
                                )}
                            />
                            <Box sx={filterWrapper}>
                                <SelectFilter
                                    control={control}
                                    label="Filter by"
                                    name="filterBy"
                                    options={filterByOptions}
                                />
                                <SelectFilter
                                    control={control}
                                    name="sortBy"
                                    label="Sort by"
                                    options={sortByOptions}
                                />
                            </Box>
                        </Box>
                    </form>

                    <>
                        <InfiniteScroll
                            dataLength={launchpads?.length ?? 0}
                            next={() => loadMore(fetchMore, data) as any}
                            hasMore={data?.launchPadsConnection?.pageInfo.hasNextPage}
                            loader={
                                <Grid
                                    container
                                    columnSpacing="20px"
                                    rowSpacing="40px"
                                    sx={{ mt: 2 }}
                                >
                                    {[1, 2, 3].map((x) => (
                                        <Grid item xs={12} md={6} lg={4} key={x}>
                                            <CardLoader key={x} />
                                        </Grid>
                                    ))}
                                </Grid>
                            }
                            endMessage={
                                <Typography style={{ textAlign: 'center', marginTop: '10px' }}>
                                    <b>No More Pools</b>
                                </Typography>
                            }
                        >
                            <Grid container columnSpacing="20px" rowSpacing="40px">
                                {launchpads?.map(({ node }, id) => (
                                    <Grid key={node.id} item xs={12} md={6} lg={4}>
                                        <Card launchPad={node as LaunchPad} refetch={refetch} />
                                    </Grid>
                                ))}

                                {loading && !launchpads && (
                                    <>
                                        {[1, 2, 3].map((x) => (
                                            <Grid item xs={12} md={6} lg={4} key={x}>
                                                <CardLoader key={x} />
                                            </Grid>
                                        ))}
                                    </>
                                )}
                            </Grid>
                            {launchpads?.length === 0 && !loading && (
                                <Grid item mt={3} xs={12}>
                                    <NoData msg="No Data" />
                                </Grid>
                            )}
                        </InfiniteScroll>
                    </>
                </>
            )}
        </Box>
    );
}
