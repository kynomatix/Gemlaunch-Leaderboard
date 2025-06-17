import { Address, parseUnits } from 'viem';
import { LaunchpadSaleStatus, LaunchpadType, QueryData, LaunchpadSaleMode } from './types';
import BigNumber from 'bignumber.js';
import { LaunchpadABI } from '@/config/abi/launchpad';
import { FairLaunchABI } from '@/config/abi/fairlaunch';
import { SubscriptionABI } from '@/config/abi/subscription';
import { DutchAuctionABI } from '@/config/abi/dutchAuction';
import { FetchMoreFunction } from '@apollo/client/react/hooks/useSuspenseQuery';
import { OperationVariables } from '@apollo/client';
import { LaunchPadsConnection } from '@/src/gql/graphql';

type PrevQueryData = {
    launchPadsConnection: LaunchPadsConnection;
};

type Options<TData = PrevQueryData, TVariables = OperationVariables> = {
    fetchMore: FetchMoreFunction<TData, TVariables>;
    moreResultsAnnouncerRef: React.RefObject<HTMLElement>;
    totalCount: number;
    pageSize: number;
    visibleCount: number;
};

export const loadMore = (fetchMore: Options['fetchMore'], data: QueryData) => {
    fetchMore({
        variables: { after: data?.launchPadsConnection?.pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            return {
                ...prev,
                launchPadsConnection: {
                    ...prev.launchPadsConnection,
                    edges: [
                        ...prev.launchPadsConnection.edges,
                        ...fetchMoreResult.launchPadsConnection.edges,
                    ],
                    pageInfo: fetchMoreResult.launchPadsConnection.pageInfo,
                },
            };
        },
    });
};

export function mapBigIntToSaleMode(value: number): string {
    if (value === 0) {
        return 'Pending';
    }
    if (value === 1) {
        return 'Private';
    }
    if (value === 2) {
        return 'Public';
    }

    return 'Unknown';
}

export function calculateRemainingBuyLimit(userInvest: string, maxLimit: number): number {
    const userInvestment = new BigNumber(userInvest);
    const maxBuyLimit = new BigNumber(maxLimit);
    const remaining = maxBuyLimit.minus(userInvestment).toString();
    return +remaining;
}

export function formatBigUnits(value: bigint, decimals: number) {
    const display = new BigNumber(value.toString());
    const negative = display.isNegative();

    let integer = display
        .absoluteValue()
        .dividedBy(10 ** decimals)
        .integerValue()
        .toString();
    let fraction = display
        .absoluteValue()
        .dividedBy(10 ** decimals)
        .modulo(1)
        .toFixed(decimals)
        .slice(2);

    fraction = fraction.replace(/0+$/, '');

    if (integer === '') {
        integer = '0';
    }

    return `${negative ? '-' : ''}${integer}${fraction ? `.${fraction}` : ''}`;
}

export const getStatusString = (status, hasStarted, hasEnded) => {
    switch (status) {
        case LaunchpadSaleStatus.INCOMMING:
            return 'Upcoming';
        case LaunchpadSaleStatus.ACTIVE:
            return hasStarted ? 'Live' : 'In progress';
        case LaunchpadSaleStatus.CANCELLED:
            return 'Cancelled';
        case LaunchpadSaleStatus.CLOSED:
            return hasEnded ? 'Ended' : 'Active';
        default:
            return 'Unknown';
    }
};

export function getContractAbiByContractName(launchpadName: string = 'LaunchPad') {
    switch (launchpadName) {
        case LaunchpadType.LaunchPad:
            return LaunchpadABI;
        case LaunchpadType.Fairlaunch:
            return FairLaunchABI;
        case LaunchpadType.SubscriptionPool:
            return SubscriptionABI;
        case LaunchpadType.DutchAuction:
            return DutchAuctionABI;
        default:
            throw new Error('Invalid launchpad type');
    }
}

export function getLaunchpadRouteByContractName(launchpadName: string, address: string | Address) {
    switch (launchpadName) {
        case LaunchpadType.LaunchPad:
            return `view-pool/${LaunchpadType.LaunchPad.toLowerCase()}/${address}`;
        case LaunchpadType.Fairlaunch:
            return `view-pool/${LaunchpadType.Fairlaunch.toLowerCase()}/${address}`;
        case LaunchpadType.SubscriptionPool:
            return `view-pool/${LaunchpadType.SubscriptionPool.toLowerCase()}/${address}`;
        case LaunchpadType.DutchAuction:
            return `view-pool/${LaunchpadType.DutchAuction.toLowerCase()}/${address}`;
        default:
            throw new Error('Invalid launchpad type');
    }
}

export function statusFunctionName(launchpadName) {
    switch (launchpadName) {
        case LaunchpadType.LaunchPad:
            return `getCurrentStatus`;
        case LaunchpadType.Fairlaunch:
            return `getCurrentStatus`;
        case LaunchpadType.SubscriptionPool:
            return `getCurrentStatus`;
        case LaunchpadType.DutchAuction:
            return `getCurrentStatus`;
        default:
            return 'getCurrentStatus';
    }
}

export function calculateFundTokenAmount(tokens, subscriptionRate) {
    const bnbAmount = String(tokens / subscriptionRate);
    return parseFloat(bnbAmount);
}

export function calculateTokenAmount(bnbAmount, subscriptionRate) {
    const tokenAmount = String(bnbAmount * subscriptionRate);
    return parseFloat(tokenAmount);
}
