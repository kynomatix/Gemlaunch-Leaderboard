import { useEffect, useState } from 'react';
import { Address, useAccount, useContractRead, useContractReads } from 'wagmi';
import { UserAuctionInfoDetails } from '../../types';
import { LaunchpadABI } from '@/config/abi/launchpad';
import { useDutchAuctionContract } from '@/hooks/useContract';
import { useSingleCallResult } from '@/state/multicall/hooks';

const useAuctionUserInfo = (launchpadAddress: Address) => {
    const launchpadContract = useDutchAuctionContract(launchpadAddress)
    const { address , isConnecting } = useAccount();
    if (!address || isConnecting) {
       return { userInfo: { userTokens : 0n, userInvest : 0n }, isLoading : false, error: false };
    }
    const { result, loading: isLoading, error } = useSingleCallResult({
        contract: launchpadContract,
        functionName: 'userInfo',
        args: [address],
    });

    console.log("my result" , result);
    
    const [userInfo, setUserInfo] = useState<UserAuctionInfoDetails>({
        userTokens: 0n,
        userInvest: 0n,
        userCalimed: 0n,
        lastClaimTime: 0n,
    });

    useEffect(() => {
        if (result && result[0] && !isLoading) {
            setUserInfo({
                userTokens: result[0],
                userInvest: result[1],
                userCalimed: result[2],
                lastClaimTime: result[3],
            });
        }
    }, [result]);

    return { userInfo, isLoading, error };
};

export default useAuctionUserInfo;
