import { useSubscriptionContract } from '@/hooks/useContract';
import { useSingleCallResult } from '@/state/multicall/hooks';
import React from 'react';
import { Address, useContractRead } from 'wagmi';

const useDistributionSurplusData = (launchpadAddress: Address) => {
    const launchpadContract = useSubscriptionContract(launchpadAddress);

    const { result } = useSingleCallResult({
        contract: launchpadContract,
        functionName: 'getSurplusData',
    });

    if (!result) {
        return [0n, 0n, 0n, [], []];
    }


    let totalAllocated = 0n;
    let surplusTokens = 0n;
    let totalSurplusFunds = 0n;
    let leftInvestors = [];
    let amounts = [];

    // Check if result is iterable (an array)
    if (Array.isArray(result) && result.length >= 5) {
        // Destructure the array if it has at least 5 elements
        // [totalAllocated, surplusTokens, totalSurplusFunds, leftInvestors, amounts] = result;
        [totalAllocated, surplusTokens, totalSurplusFunds, leftInvestors, amounts] = result;
    } else {
        console.error('Invalid result structure:', result);
    }

    return [totalAllocated, surplusTokens, totalSurplusFunds, leftInvestors, amounts];
};

export default useDistributionSurplusData;
