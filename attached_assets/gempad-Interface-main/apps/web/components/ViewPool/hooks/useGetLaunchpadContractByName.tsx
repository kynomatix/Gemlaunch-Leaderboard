import React from 'react';
import { LaunchpadType } from '../types';
import useLaunchpadUserInfo from './useLaunchpadUserInfo';
import {
    useDutchAuctionContract,
    useFairLaunchContract,
    useLaunchpadContract,
    useSubscriptionContract,
} from '@/hooks/useContract';
import { Address } from 'viem';

const useGetLaunchpadContractByName = (launchpadName: string, launchpadAddress: Address) => {
    const launchpad = useLaunchpadContract(launchpadAddress);
    const fairlaunch = useFairLaunchContract(launchpadAddress);
    const dutchAuction = useDutchAuctionContract(launchpadAddress);
    const subscription = useSubscriptionContract(launchpadAddress);

    switch (launchpadName) {
        case LaunchpadType.LaunchPad:
            return launchpad;
        case LaunchpadType.Fairlaunch:
            return fairlaunch;
        case LaunchpadType.SubscriptionPool:
            return subscription;
        case LaunchpadType.DutchAuction:
            return dutchAuction;
        default:
            return launchpad;
    }
};

export default useGetLaunchpadContractByName;
