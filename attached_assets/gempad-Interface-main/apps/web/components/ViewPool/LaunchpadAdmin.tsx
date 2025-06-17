import { useState } from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import { Address } from 'viem';
import { useAccount } from 'wagmi';
import { Box, Button, Typography } from '@mui/material';
import PublicSaleModal from './modals/PublicSaleModal';
import AffiliationModal from './modals/AffiliationModal';
import SetSaleTime from './component/SaleTime';
import Infobar from '../Infobar/Infobar';
import useLaunchpadDetails from './hooks/useLaunchpadDetails';
import { useGetLaunchpadDetails } from '@/hooks/useGetLaunchpad';
import useGetLaunchpadContractByName from './hooks/useGetLaunchpadContractByName';
import WhitelistModal from './modals/WhiteListModal';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

const LaunchpadAdmin = ({
    owner,
    launchpadAddress,
    LaunchpadName,
}: {
    owner: Address;
    launchpadAddress: Address;
    LaunchpadName: string;
}) => {
    const { address } = useAccount();
    const { hasEnded } = useLaunchpadDetails(launchpadAddress);
    const [isWhiteListModal, setIsWhiteListModal] = useState(false);
    const [isPublicModal, setIsPublicSaleModal] = useState(false);
    const [isAffiliateModal, setIsAffiliateModal] = useState(false);

    const handleClose = () => {
        setIsWhiteListModal(false);
        setIsPublicSaleModal(false);
        setIsAffiliateModal(false);
    };
    const contract = useGetLaunchpadContractByName(LaunchpadName, launchpadAddress);

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
                    <Box>
                        <Button
                            size="small"
                            variant="outlined"
                            fullWidth
                            disabled={hasEnded}
                            onClick={() => setIsAffiliateModal(true)}
                        >
                            Set Affiliation
                        </Button>
                        {hasEnded && (
                            <Typography color="#FF0B22" fontSize="12px">
                                Cannot update affiliate program at this time
                            </Typography>
                        )}
                    </Box>
                    <SetSaleTime launchpadAddress={launchpadAddress} />
                </PrimaryCard>
            </Box>
            <WhitelistModal open={isWhiteListModal} handleClose={handleClose} contract={contract} />
            <PublicSaleModal open={isPublicModal} handleClose={handleClose} contract={contract} />
            <AffiliationModal
                open={isAffiliateModal}
                handleClose={handleClose}
                contract={contract}
            />
        </>
    ) : null;
};

export default LaunchpadAdmin;
