import React from 'react';
import { Box, Typography } from '@mui/material';

const AppFooter = () => {
    return (
        <Box>
            <Box
                sx={{
                    height: '1px',
                    background: '#FFFFFF',
                    opacity: '0.5',
                    position: 'absolute',
                    left: '0px',
                    right: '0px',
                }}
            ></Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography
                    fontSize={12}
                    fontWeight={500}
                    sx={{
                        textAlign: 'center',
                        my: '10px',
                        maxWidth: '1000px',
                    }}
                >
                    Disclaimer: The content of any material provided or published by Gemlaunch does
                    not represent, in any way, financial advice and is not an investment
                    recommendation. We are not responsible and do not accept liability for any loss
                    of assets to any person or persons acting upon information present in any
                    material associated with Gemlaunch.
                </Typography>
            </Box>
        </Box>
    );
};

export default AppFooter;
