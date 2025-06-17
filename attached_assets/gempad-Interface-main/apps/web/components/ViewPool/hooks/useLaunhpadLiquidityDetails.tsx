import { useEffect, useState } from 'react';
import { Address, useAccount, useContractRead, useContractReads } from 'wagmi';
import { LaunchPadLiquidityDetails, UserInfoDetails } from '../types';
import { LaunchpadABI } from '@/config/abi/launchpad';

const useLaunchpadLiquidityDetails = (launchpadAddress: Address) => {
    const { data, isLoading, error, isFetching } = useContractRead({
        abi: LaunchpadABI,
        address: launchpadAddress,
        functionName: 'liquidity',
        watch: true,
    });

    const [liquidityDetails, setLiquidityDetails] = useState<LaunchPadLiquidityDetails>({
        router: '',
        liquidityPercent: 0n,
        lockTime: 0n,
        locker: '',
        liquidityAdded: 0n,
        isAutoListing: false,
    });

    useEffect(() => {
        if (data && data[0]) {
            setLiquidityDetails({
                router: data[0],
                liquidityPercent: data[1],
                lockTime: data[2],
                locker: data[3],
                liquidityAdded: data[4],
                isAutoListing: data[5],
            });
        }
    }, [data]);

    return { liquidityDetails, isLoading, error, isFetching };
};

export default useLaunchpadLiquidityDetails;
