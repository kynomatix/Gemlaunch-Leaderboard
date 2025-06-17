import { useEffect, useState } from 'react';
import { Address, useAccount, useContractRead, useContractReads } from 'wagmi';
import { LaunchpadABI } from '@/config/abi/launchpad';
import { SubscriptionABI } from '@/config/abi/subscription';
import { UserSubscriptionInfoDetails } from '../../types';

const useSubscriptionPoolUserInfo = (launchpadAddress: Address) => {
    const { address } = useAccount();
    const { data, isLoading, error, isFetching, refetch, isRefetching } = useContractRead({
        abi: SubscriptionABI,
        address: launchpadAddress,
        functionName: 'userInfo',
        args: [address],
        watch: true,
    });

    const [userInfo, setUserInfo] = useState<UserSubscriptionInfoDetails>({
        userInvest: 0n,
        userDeposit: 0n,
        userAllocation: 0n,
        userClaimed: 0n,
    });

    useEffect(() => {
        if (data && data[0]) {
            const result = {
                userInvest: data[0],
                userDeposit: data[1],
                userAllocation: data[2],
                userClaimed: data[3],
            };
            setUserInfo(result);
        }
    }, [data]);

    return { userInfo, isLoading, error, isFetching, refetch, isRefetching };
};

export default useSubscriptionPoolUserInfo;
