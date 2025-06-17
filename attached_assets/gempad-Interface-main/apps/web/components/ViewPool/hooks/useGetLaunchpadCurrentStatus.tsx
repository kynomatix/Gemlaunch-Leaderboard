import React from 'react';
import { LaunchpadType } from '../types';
import { Address, useContractRead } from 'wagmi';

const getLaunchpadStatusAbi = (methodName) => {
    return [
        {
            inputs: [],
            name: `${methodName}`,
            outputs: [
                {
                    internalType: 'enum GempadLaunchpad.Status',
                    name: 'status',
                    type: 'uint8',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
    ] as const;
};

const useGetLaunchpadCurrentStatus = (launchpadName: string, launchpadAddress: Address) => {
    const launchpadCurrentStatusFunctionName =
        launchpadName === LaunchpadType.LaunchPad || launchpadName === LaunchpadType.Fairlaunch
            ? 'getCurrentStatus'
            : 'getCurrentStatus';

    const LaunchpadStatusAbi = getLaunchpadStatusAbi(launchpadCurrentStatusFunctionName);

    const { data } = useContractRead({
        address: launchpadAddress,
        abi: LaunchpadStatusAbi,
        functionName: launchpadCurrentStatusFunctionName,
        watch: true,
    });

    const currentLaunchpadStatus = data as number;
    return { currentLaunchpadStatus };
};

export default useGetLaunchpadCurrentStatus;
