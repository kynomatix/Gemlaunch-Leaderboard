import { GET_LAUNCHPAD_FOR_CHART } from '@/components/ViewPool/query';
import { OperationVariables, useQuery } from '@apollo/client';
import { useActiveChainId } from './useActiveChainId';
import { QueryDataLaunchpad } from '@/components/ViewPool/types';
import { LaunchPad } from '@/src/gql/graphql';
import { formatUnits } from 'viem';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import moment from 'moment';

export const useChartContainer = (launchpadAddress: string) => {
    dayjs.extend(utc);
    const { chainId } = useActiveChainId();

    const { data } = useQuery<QueryDataLaunchpad, OperationVariables>(GET_LAUNCHPAD_FOR_CHART, {
        variables: { contractAddress: launchpadAddress },
        context: { chainId },
        fetchPolicy: 'network-only',
    });

    const launchpad = data && data.launchPads?.[0];

    const tokenDecimals = launchpad?.token?.decimals;

    const startPrice = +formatUnits(launchpad?.startPrice ?? 0n, tokenDecimals ?? 18) ?? 0;
    const endPrice = +formatUnits(launchpad?.endPrice ?? 0n, tokenDecimals ?? 18) ?? 0;

    // const startTime = dayjs.unix(Number(launchpad?.startTime ?? 0n));
    const startTime = dayjs.unix(Number(launchpad?.startTime ?? 0n));
    // const startTime = moment.unix(Number(launchpad?.startTime));
    

    const endTime = dayjs.unix(Number(launchpad?.endTime ?? 0n));

    const decreaseInterval = Number(launchpad?.decreaseInterval) / 60 ?? 0; // change seconds into minutes

    return {
        startPrice,
        endPrice,
        startTime,
        endTime,
        decreaseInterval,
    };
};
