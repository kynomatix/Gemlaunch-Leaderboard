import { useEffect, useState } from 'react';
import { Address, useAccount, useContractRead, useContractReads } from 'wagmi';
import { UserInfoDetails } from '../types';
import { LaunchpadABI } from '@/config/abi/launchpad';
import { useSingleCallResult } from '@/state/multicall/hooks';

const useLaunchpadUserInfo = (launchpadContract) => {
    const { address } = useAccount();
    const { data: result, isLoading, error } = useContractRead({
        address: launchpadContract?.address,
        abi: launchpadContract.abi,
        functionName: 'userInfo',
        args: [address],
        watch: true,
    });

    const [userInfo, setUserInfo] = useState<UserInfoDetails>({
        userInvest: 0n,
        userCalimed: 0n,
        lastClaimTime: 0n,
        intervalClaimed: 0n,
    });

    useEffect(() => {
        if (result) {
            setUserInfo({
                userInvest: result[0],
                userCalimed: result[1],
                lastClaimTime: result[2],
                intervalClaimed: result[3],
            });
        }
    }, [result]);

    return { userInfo, isLoading, error };
};

export default useLaunchpadUserInfo;
