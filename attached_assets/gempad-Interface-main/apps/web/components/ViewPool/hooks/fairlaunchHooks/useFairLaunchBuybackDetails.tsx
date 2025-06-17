import { FairLaunchABI } from '@/config/abi/fairlaunch';
import React, { useMemo, useEffect, useState } from 'react';
import { Address, useContractRead, useAccount, useContractReads } from 'wagmi';
import { FairLaunchBuybackDetails } from '../../types';

const useFairLaunchBuyback = (launchpadAddress: Address) => {
    const { data, isLoading, error, refetch } = useContractRead({
        abi: FairLaunchABI,
        address: launchpadAddress,
        functionName: 'buyBack',
        watch: true,
    });

    const [buybackDetails, setBuybackDetails] = useState<FairLaunchBuybackDetails>({
        isBuyback: false,
        buyBackPercent: 0n,
        totalBuyBackAmount: 0n,
        boughtBackAmount: 0n,
        amountPerBuyback: 0n,
        minDelay: 0n,
        maxDelay: 0n,
        lastBuyTime: 0n,
        refetch: undefined,
    });

    useEffect(() => {
        if (data && data[0]) {
            const result = {
                isBuyback: data[0],
                buyBackPercent: data[1],
                totalBuyBackAmount: data[2],
                boughtBackAmount: data[3],
                amountPerBuyback: data[4],
                minDelay: data[5],
                maxDelay: data[6],
                lastBuyTime: data[7],
                refetch,
            };
            setBuybackDetails(result);
        }
    }, [data]);

    return { buybackDetails, isLoading, error };
};

export default useFairLaunchBuyback;
