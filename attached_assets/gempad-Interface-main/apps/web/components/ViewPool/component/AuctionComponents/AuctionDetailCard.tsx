import { LaunchPad } from '@/src/gql/graphql';
import DetailCardIntegration from '../../DetailsCardIntegration';
import DetailCardIntegrationLoading from '../DetailCardIntegrationLoading';
import { IAuctionDetailCard } from '../../types';
import useAuctionDetails from '../../hooks/auctionHooks/useAuctionDetails';
import useLaunchpadVestingDetails from '../../hooks/useLaunchpadVesting';
import AuctionDetailCardIntegration from './AuctionDetailsCardIntegration';

const AuctionDetailCard = ({ data, address }: IAuctionDetailCard) => {
    const { tokenForPreSale } = useAuctionDetails(address);

    const { vesting } = useLaunchpadVestingDetails(address);

    const vestingDetails = vesting?.isVestingEnable ? vesting : false;
    return (
        <>
            {data && data.launchPads.length > 0 ? (
                <AuctionDetailCardIntegration
                    launchpad={data?.launchPads[0] as LaunchPad}
                    tokenForPreSale={tokenForPreSale}
                />
            ) : (
                <DetailCardIntegrationLoading />
            )}

            {/* <DoughnutChart /> */}
            {/* <FAQ /> */}
        </>
    );
};

export default AuctionDetailCard;
