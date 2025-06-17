import React from 'react';
import { Box, Typography } from '@mui/material';
import ViewPoolTabs from '@/components/ViewPool/Tabs';

const ViewPool = () => {
    return (
        <Box sx={{ mt: '30px' }}>
            <Typography variant="h4" fontWeight={500} mb={'30px'}>
                Current Presales
            </Typography>

            <ViewPoolTabs />
        </Box>
    );
};

export default ViewPool;
