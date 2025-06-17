import { useSubscriptionContract } from '@/hooks/useContract';
import { useSingleCallResult } from '@/state/multicall/hooks';
import React from 'react';
import { Address, useContractRead } from 'wagmi';

const useSubscriptionPoolDistribution = (launchpadAddress: Address) => {
    const launchpadContract = useSubscriptionContract(launchpadAddress);

    const { result } = useSingleCallResult({
        contract: launchpadContract,
        functionName: 'getDistribution',
    });

    if (!result) {
        return [0n, 0n, 0n];
    }


    const [totalAllocated, surplusTokens, totalSurplusFunds] = result;

    return [totalAllocated, surplusTokens, totalSurplusFunds];
};

export default useSubscriptionPoolDistribution;
