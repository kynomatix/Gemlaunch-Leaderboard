import React from 'react';
import { Box, Typography } from '@mui/material';
import TokenTable from '@/components/TokenTable/TokenTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Locked Tokens | Gemlaunch',
    description: 'Gemlaunch Locked Tokens',
};

const page = () => {
    return (
        <Box>
            <TokenTable isLpToken={true} baseRoute="liquidity" />
        </Box>
    );
};

export default page;
