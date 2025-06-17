import { useEffect, useState } from 'react';
import { useLaunchpadContract } from '@/hooks/useContract';
import { Address, useAccount, useContractRead, useContractReads } from 'wagmi';
import { RewardInfo } from '../../types';
import { LaunchpadABI } from '@/config/abi/launchpad';

const useLaunchpadRewardInfo = (launchpadAddress: Address) => {
    const launchpadContract = useLaunchpadContract(launchpadAddress);
    const { address } = useAccount();

    const { data, isLoading, error, isFetching, refetch } = useContractReads({
        contracts: [
            { ...launchpadContract, functionName: 'rewardInfo', args: [address] },
            { ...launchpadContract, functionName: 'tokenFee' },
            { ...launchpadContract, functionName: 'totalRaised' },
            { ...launchpadContract, functionName: 'totalReferralInvest' },
        ],
        watch: true,
    });

    const reward = data?.[0].result ?? [0n, 0n];
    const tokenFee = data?.[1].result ?? 0n;
    const totalRaise = data?.[2].result ?? 0n;
    const totalReferralInvest = data?.[3].result ?? 0n;

    const [rewardInfo, setRewardInfo] = useState<RewardInfo>({
        referralInvest: 0n,
        rewardShare: 0n,
        tokenFees: 0n,
        totalRaised: 0n,
        totalReferralInvest: 0n,
        refetch: undefined,
    });

    useEffect(() => {
        if (data && data[0]) {
            const result = {
                referralInvest: reward[0],
                rewardShare: reward[1],
                tokenFees: tokenFee,
                totalRaised: totalRaise,
                totalReferralInvest,
                refetch,
            };
            setRewardInfo(result);
        }
    }, [data, address, totalReferralInvest, tokenFee, totalRaise, refetch]);

    return { rewardInfo, isLoading, error, isFetching };
};

export default useLaunchpadRewardInfo;
