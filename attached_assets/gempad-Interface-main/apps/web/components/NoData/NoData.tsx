import React from 'react';
import { Box, Typography } from '@mui/material';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import { NoDataProps } from './types';

const NoData: React.FC<NoDataProps> = ({ msg }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 1,
            }}
        >
            <Typography variant="h5" fontSize={15} color="common.white">
                {msg}
            </Typography>
            <AllInboxIcon sx={{ color: '#FFFFFF', fontSize: 38 }} />
        </Box>
    );
};

export default NoData;
