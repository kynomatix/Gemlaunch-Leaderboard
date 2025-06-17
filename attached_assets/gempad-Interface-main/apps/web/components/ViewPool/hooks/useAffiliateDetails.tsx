import React, { useEffect, useState } from 'react';
import { Address, readContracts } from 'wagmi';
import useLaunchpadDetails from './useLaunchpadDetails';
import { addWatchlistToken } from '@/state/user/actions';

interface ReturnProps {
    affiliateReward: number;
    allReferrers: Address[];
}
const useAffiliateDetails = (launchpadAddress: Address) => {
    const { launchpadContract } = useLaunchpadDetails(launchpadAddress);

    const [affiliateInfo, setAffiliateInfo] = useState<ReturnProps>({
        affiliateReward: 0,
        allReferrers: [],
    });

    useEffect(() => {
        async function getInfo() {
            const [rewardPercentage, referrers] = await readContracts({
                contracts: [
                    {
                        ...launchpadContract,
                        functionName: 'affiliateReward',
                    },
                    {
                        ...launchpadContract,
                        functionName: 'getAllReferrers',
                    },
                ],
            });

            setAffiliateInfo({
                affiliateReward: Number(rewardPercentage.result),
                allReferrers: [...referrers.result],
            });
        }
        getInfo();
    }, [launchpadContract]);

    return { affiliateInfo };
};

export default useAffiliateDetails;
