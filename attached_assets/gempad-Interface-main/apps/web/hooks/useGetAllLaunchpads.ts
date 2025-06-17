'use client';

import React from 'react';
import request from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import { SUBSQUID_URLS } from '@/constants';
import { getAllLaunchPads } from '@/components/ViewPool/gqlRequest';
import { useActiveChainId } from './useActiveChainId';
import { GetLaunchpadsQuery } from '@/src/gql/graphql';

export const useGetAllLaunchpads = () => {
    const { chainId } = useActiveChainId();
    const { data, refetch, isLoading, isError, error, isFetching } = useQuery<GetLaunchpadsQuery>({
        queryKey: ['Launchpads'],
        queryFn: async () => request(SUBSQUID_URLS[chainId], getAllLaunchPads),
    });

    return {
        data,
        refetch,
        isLoading,
        isError,
        error,
        isFetching,
    };
};
