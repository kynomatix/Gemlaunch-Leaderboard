'use client';

import React from 'react';
import { Box } from '@mui/material';
import DetailCardSkeleton from './DetailCardSkeleton';
import PrivateSaleTimerSkeleton from './PrivateSaleTimerSkeleton';
import ExtraInformationSkeleton from './ExtraInformationSkeleton';
import { useMediaQuery } from '@mui/material';

const DutchDetailsSkeleton = () => {
    const isMobile = useMediaQuery('(max-width:1460px)');
    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '26px',
            mt: '30px',
            height: '100%',
        }}
    >
        <Box sx={{ flex: 2 }}>
            <DetailCardSkeleton />
            {/* <PreviousPresales
                userAddress={userAddress}
                currentPresaleAddress={address}
            /> */}
            {/* <LockRecord tokenAddress={tokenAddress} /> */}
            {/* <FAQ /> */}
        </Box>

        <Box sx={{ flex: 1 }}>
            <PrivateSaleTimerSkeleton />
            <ExtraInformationSkeleton />
            {/* <LaunchpadProgress launchpadAddress={address} /> */}
            {/* <LaunchpadAdmin
                owner={launchpadOwner}
                launchpadAddress={address}
                LaunchpadName={name}
            /> */}
        </Box>
    </Box>
    );
};

export default DutchDetailsSkeleton;
