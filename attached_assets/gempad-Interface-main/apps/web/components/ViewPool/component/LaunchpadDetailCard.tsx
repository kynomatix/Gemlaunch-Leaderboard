import { Box } from '@mui/material';
import DetailCardIntegration from '../DetailsCardIntegration';
import DetailCardIntegrationLoading from './DetailCardIntegrationLoading';
import AffiliateProgram from './AffiliateProgram';
import { ILaunchpadDetailCard } from '../types';
import { LaunchPad } from '@/src/gql/graphql';
import useLaunchpadDetails from '../hooks/useLaunchpadDetails';
import { useContractRead } from 'wagmi';

const LaunchpadDetailCard = ({
    data,
    isAffiliate,
    tokenForPreSale,
    address,
}: ILaunchpadDetailCard) => {
    const {
        affiliatePercentage,
        allReferrers,
        totalRaisedNum,
        launchpadContract,
        currentLaunchpadStatus,
        affiliateReward,
    } = useLaunchpadDetails(address);

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
    };

    return (
        <>
            {data && data.launchPads.length > 0 ? (
                <DetailCardIntegration
                    launchpad={data?.launchPads[0] as LaunchPad}
                    tokenForPreSale={tokenForPreSale}
                />
            ) : (
                <DetailCardIntegrationLoading />
            )}
            {isAffiliate ? <AffiliateProgram props={props} /> : null}
            {/* <DoughnutChart /> */}
            {/* <FAQ /> */}
        </>
    );
};

export default LaunchpadDetailCard;
