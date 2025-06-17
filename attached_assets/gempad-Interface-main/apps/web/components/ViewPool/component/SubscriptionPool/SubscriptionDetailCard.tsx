import { Box } from '@mui/material';
import { LaunchPad } from '@/src/gql/graphql';
import { useContractRead } from 'wagmi';
import { ISubscriptionDetailCard } from '../../types';
import DetailCardIntegration from '../../DetailsCardIntegration';
import DetailCardIntegrationLoading from '../DetailCardIntegrationLoading';
import useLaunchpadDetails from '../../hooks/useLaunchpadDetails';
import SubscriptionDetailsCardIntegration from './SubscriptionDetailsCardIntegration';
import useSubscriptionDetails from '../../hooks/subscriptionHoosk/useSubscriptionDetails';

const SubscriptionDetailCard = ({ data, address }: ISubscriptionDetailCard) => {
    const { totalRaisedNum, launchpadContract, currentLaunchpadStatus } =
        useSubscriptionDetails(address);

    // const { data: tokenfee } = useContractRead({
    //   address: launchpadContract.address,
    //   abi: launchpadContract.abi,
    //   functionName: 'tokenFee',
    // })

    // const tokenFee = Number(tokenfee) / 1e3

    return (
        <>
            {data && data.launchPads.length > 0 ? (
                <SubscriptionDetailsCardIntegration launchpad={data?.launchPads[0] as LaunchPad} />
            ) : (
                <DetailCardIntegrationLoading />
            )}

            {/* <DoughnutChart /> */}
            {/* <FAQ /> */}
        </>
    );
};

export default SubscriptionDetailCard;
