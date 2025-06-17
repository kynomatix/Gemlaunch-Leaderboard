import { Box, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';
import AllInboxIcon from '@mui/icons-material/AllInbox';

const NotFound = () => {
    return (
        <TableRow>
            <TableCell colSpan={7} sx={{ pt: '20px', pb: '10px', borderBottom: 'none' }}>
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
                        No data
                    </Typography>
                    <AllInboxIcon sx={{ color: '#FFFFFF', fontSize: 38 }} />
                </Box>
            </TableCell>
        </TableRow>
    );
};

export default NotFound;
