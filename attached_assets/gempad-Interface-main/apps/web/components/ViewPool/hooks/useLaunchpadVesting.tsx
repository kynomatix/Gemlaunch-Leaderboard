import { useEffect, useState } from 'react';
import { useLaunchpadContract } from '@/hooks/useContract';
import { Address, useContractRead, useContractReads } from 'wagmi';
import { VestingDetails } from '../types';
import { LaunchpadABI } from '@/config/abi/launchpad';

const useLaunchpadVestingDetails = (launchpadAddress: Address) => {
    const launchpadContract = useLaunchpadContract(launchpadAddress);
    const { data, isLoading, error, isFetching } = useContractRead({
        abi: LaunchpadABI,
        address: launchpadAddress,
        functionName: 'vesting',
        watch: true,
    });

    const [vesting, setVestingDetails] = useState<VestingDetails>({
        isVestingEnable: false,
        TGEPercent: 0n,
        cyclePercent: 0n,
        cycleInterval: 0n,
    });

    useEffect(() => {
        if (data && data[0]) {
            const result = {
                isVestingEnable: data[0],
                TGEPercent: data[1],
                cyclePercent: data[2],
                cycleInterval: data[3],
            };
            setVestingDetails(result);
        }
    }, [data]);

    return { vesting, isLoading, error, isFetching };
};

export default useLaunchpadVestingDetails;
