import { Box } from '@mui/material';

import { LaunchPad } from '@/src/gql/graphql';
import DetailCardIntegration from '../../DetailsCardIntegration';
import DetailCardIntegrationLoading from '../DetailCardIntegrationLoading';
import { IFairLaunchDetailCard } from '../../types';
import useFairLaunchDetails from '../../hooks/fairlaunchHooks/useFairlaunchDetails';
import AffiliateProgram from '../AffiliateProgram';
import { useContractRead } from 'wagmi';
import FairLaunchAffiliateProgram from './FairLaunchAffiliateProgram';

const FairLaunchDetailCard = ({ data, address }: IFairLaunchDetailCard) => {
    const {
        isAffiliate,
        totalsellTokens,
        affiliatePercentage,
        allReferrers,
        totalRaisedNum,
        launchpadContract,
        currentLaunchpadStatus,
        affiliateReward,
        totalRewards,
    } = useFairLaunchDetails(address);

    const { data: tokenfee } = useContractRead({
        address: launchpadContract.address,
        abi: launchpadContract.abi,
        functionName: 'tokenFee',
    });

    const tokenFee = Number(tokenfee) / 1e3;

    const props = {
        affiliatePercentage,
        allReferrers,
        totalRaisedNum,
        currentLaunchpadStatus,
        affiliateReward,
        isAffiliate,
        launchpadAddress: address,
        tokenFee,
        launchpadContract,
        totalRewards,
    };


    return (
        <>
            {data && data.launchPads.length > 0 ? (
                <DetailCardIntegration
                    launchpad={data?.launchPads[0] as LaunchPad}
                    tokenForPreSale={totalsellTokens}
                />
            ) : (
                <DetailCardIntegrationLoading />
            )}
            {isAffiliate ? <FairLaunchAffiliateProgram props={props} /> : null}
            {/* <DoughnutChart /> */}
            {/* <FAQ /> */}
        </>
    );
};

export default FairLaunchDetailCard;
