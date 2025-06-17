import { useCallback, useState } from 'react';
import { Address, parseUnits } from 'viem';
import { useAccount, useContractReads } from 'wagmi';
import { Box, Button, Typography } from '@mui/material';
import PrimaryCard from '@/components/Cards/PrimaryCard';
import Infobar from '@/components/Infobar/Infobar';
import SetSaleTime from '../SaleTime';
import WhitelistModal from '../../modals/WhiteListModal';
import PublicSaleModal from '../../modals/PublicSaleModal';
import AffiliationModal from '../../modals/AffiliationModal';
import useFairLaunchDetails from '../../hooks/fairlaunchHooks/useFairlaunchDetails';
import useGetLaunchpadContractByName from '../../hooks/useGetLaunchpadContractByName';
import useLaunchpadDetails from '../../hooks/useLaunchpadDetails';
import FairLaunchSaleTime from './FairLaunchSaleTime';
import { LaunchpadSaleMode, LaunchpadSaleStatus } from '../../types';
import FairLaunchAffilationModal from '../../modals/FairlaunchAffilationModal';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

const FairLaunchAdmin = ({
    owner,
    launchpadAddress,
    LaunchpadName,
}: {
    owner: Address;
    launchpadAddress: Address;
    LaunchpadName: string;
}) => {
    const { address } = useAccount();
    const { hasEnded, launchpadContract } = useFairLaunchDetails(launchpadAddress);
    const [isWhiteListModal, setIsWhiteListModal] = useState(false);
    const [isPublicModal, setIsPublicSaleModal] = useState(false);
    const [isAffiliateModal, setIsAffiliateModal] = useState(false);

    const handleClose = () => {
        setIsWhiteListModal(false);
        setIsPublicSaleModal(false);
        setIsAffiliateModal(false);
    };

    const contract = useGetLaunchpadContractByName(LaunchpadName, launchpadAddress);

    const { data } = useContractReads({
        contracts: [
            { ...launchpadContract, functionName: 'currentStatus' },
            { ...launchpadContract, functionName: 'getCurrentMode' },
        ],
    });

    const saleStatusResult = (data?.[0]?.result as unknown as number) ?? 0;
    const saleCurrentMode = (data?.[1]?.result as unknown as number) ?? 0;

    const isSaleActive = saleStatusResult === LaunchpadSaleStatus.ACTIVE;
    const isSaleCanceled = saleStatusResult === LaunchpadSaleStatus.CANCELLED;
    const isSaleClosed = saleStatusResult === LaunchpadSaleStatus.CLOSED;

    const isPublicSale = saleCurrentMode === LaunchpadSaleMode.PUBLIC;
    const isPrivateSale = saleCurrentMode === LaunchpadSaleMode.PRIVATE;
    const isSalePending = saleCurrentMode === LaunchpadSaleMode.PENDING;

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
                        disabled={hasEnded || isPublicSale}
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
                    <FairLaunchSaleTime
                        launchpadAddress={launchpadAddress}
                        contract={contract}
                        launchpadName={LaunchpadName}
                        saleStatusResult={saleStatusResult}
                        saleCurrentMode={saleCurrentMode}
                    />
                </PrimaryCard>
            </Box>
            <WhitelistModal
                open={isWhiteListModal}
                handleClose={handleClose}
                contractAddress={launchpadAddress}
                contract={contract}
            />
            <PublicSaleModal
                open={isPublicModal}
                handleClose={handleClose}
                contractAddress={launchpadAddress}
                contract={contract}
            />
            <FairLaunchAffilationModal
                open={isAffiliateModal}
                handleClose={handleClose}
                contractAddress={launchpadAddress}
                contract={contract}
            />
        </>
    ) : null;
};

export default FairLaunchAdmin;
