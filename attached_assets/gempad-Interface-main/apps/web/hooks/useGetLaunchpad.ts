'use client';

import React from 'react';
import request from 'graphql-request';
import { useQuery } from '@tanstack/react-query';
import { SUBSQUID_URLS } from '@/constants';
import { useActiveChainId } from './useActiveChainId';
import { GET_SINGLE_LAUNCHPAD } from '@/app/(application)/view-pool/constant/gqlQuery';
import { GetLaunchpadsQuery, GetLaunchpadsQueryVariables } from '@/src/gql/graphql';

export const useGetLaunchpadDetails = (address) => {
    const { chainId } = useActiveChainId();
    const { data, refetch, isLoading, isError, error, isFetching } = useQuery<
        GetLaunchpadsQuery,
        GetLaunchpadsQueryVariables
    >({
        queryKey: [`Launchpad ${address}`],
        queryFn: async () => request(SUBSQUID_URLS[chainId], GET_SINGLE_LAUNCHPAD, { address }),
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
