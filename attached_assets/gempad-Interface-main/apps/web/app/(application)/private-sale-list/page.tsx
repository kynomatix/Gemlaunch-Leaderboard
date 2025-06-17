import React from 'react';
import { Box, Typography } from '@mui/material';
import ViewPrivateSaleTabs from '@/components/ViewPrivateSale/ViewPrivateSaleTabs';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Private Sale Lists | Gemlaunch',
    description: 'Gemlaunch Private Sale List',
};

const page = () => {
    return (
        <Box sx={{ mt: '30px' }}>
            <Typography variant="h4" fontWeight={500} mb={'30px'}>
                Private Sales
            </Typography>

            <ViewPrivateSaleTabs />
        </Box>
    );
};

export default page;
