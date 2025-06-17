import PrimaryCard from '@/components/Cards/PrimaryCard';
import NoData from '@/components/NoData/NoData';
import { Box } from '@mui/material';
import React from 'react';

const DetailCardIntegrationLoading = () => {
    return (
        <>
            <Box>
                <Box sx={{ width: '100%' }}>
                    <PrimaryCard py={25}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <NoData msg="No Data" />
                        </Box>
                    </PrimaryCard>
                </Box>
            </Box>
        </>
    );
};

export default DetailCardIntegrationLoading;
