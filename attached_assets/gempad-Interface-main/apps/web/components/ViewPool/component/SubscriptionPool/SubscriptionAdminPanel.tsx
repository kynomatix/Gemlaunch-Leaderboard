import React from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';
import { Box, Button, Typography } from '@mui/material';
import { useGetLaunchpadDetails } from '@/hooks/useGetLaunchpad';
import useSubscriptionDetails from '../../hooks/subscriptionHoosk/useSubscriptionDetails';
import PrimaryCard from '@/components/Cards/PrimaryCard';
import Infobar from '@/components/Infobar/Infobar';
import SubscriptionPreSaleTime from './SubscriptionPreSaleTime';
import WhitelistModal from '../../modals/WhiteListModal';
import PublicSaleModal from '../../modals/PublicSaleModal';
import SubscriptionCalculationModal from '../../modals/SubscriptionCalculationModal';
import ContributorsListModal from '../../modals/ContributorsListModal';
import { DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { LaunchpadSaleStatus, Tx } from '../../types';
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import toast from 'react-hot-toast/headless';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

const SubscriptionAdminPanel = ({
    owner,
    launchpadAddress,
    LaunchpadName,
}: {
    owner: Address;
    launchpadAddress: Address;
    LaunchpadName: string;
}) => {
    const { address } = useAccount();
    const [isWhiteListModal, setIsWhiteListModal] = React.useState(false);
    const [isPublicModal, setIsPublicSaleModal] = React.useState(false);
    const [isCalculationModal, setIsCalculationModal] = React.useState(false);
    const [contributorsListModal, setContributorsListModal] = React.useState(false);

    const { hasEnded, launchpadContract, allInvestors, currentLaunchpadStatus } =
        useSubscriptionDetails(launchpadAddress);

    const isSaleCanceled = currentLaunchpadStatus === LaunchpadSaleStatus.CANCELLED;

    const handleClose = () => {
        setIsWhiteListModal(false);
        setIsPublicSaleModal(false);
        setIsCalculationModal(false);
        setContributorsListModal(false);
    };

    return owner === address ? (
        <>
            <Box mt={3}>
                <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Typography fontWeight={600} fontSize={'18px'} mt={3} mb={1}>
                        Owner Zone
                    </Typography>

                    <MdOutlineAdminPanelSettings size="24px" />
                </Box>
                <PrimaryCard py={10} sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Infobar
                        dismissable={false}
                        message="To make sure there will be no issues during the presale time, please do not send tokens to wallets before you finalize the presale pool."
                        open={true}
                        variant="warning"
                    />

                    <Button
                        size="small"
                        variant="outlined"
                        disabled={hasEnded}
                        fullWidth
                        onClick={() => setIsWhiteListModal(true)}
                    >
                        Open WhiteList
                    </Button>

                    <Button
                        size="small"
                        disabled={hasEnded}
                        variant="outlined"
                        fullWidth
                        onClick={() => setIsPublicSaleModal(true)}
                    >
                        Start Public Sale
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        onClick={() => setContributorsListModal(true)}
                    >
                        List of contributors
                    </Button>

                    {isSaleCanceled ? null : (
                        <Button
                            size="small"
                            disabled={!hasEnded}
                            variant="outlined"
                            fullWidth
                            onClick={() => setIsCalculationModal(true)}
                        >
                            Show Finalize Process
                        </Button>
                    )}

                    <SubscriptionPreSaleTime launchpadAddress={launchpadAddress} />
                </PrimaryCard>
            </Box>
            <SubscriptionCalculationModal
                open={isCalculationModal}
                handleClose={handleClose}
                contractAddress={launchpadAddress}
            />
            <PublicSaleModal
                open={isPublicModal}
                handleClose={handleClose}
                contract={launchpadContract}
            />
            <WhitelistModal
                open={isWhiteListModal}
                handleClose={handleClose}
                contract={launchpadContract}
            />

            <ContributorsListModal
                open={contributorsListModal}
                handleClose={handleClose}
                contractAddress={launchpadAddress}
            />
        </>
    ) : null;
};

export default SubscriptionAdminPanel;
