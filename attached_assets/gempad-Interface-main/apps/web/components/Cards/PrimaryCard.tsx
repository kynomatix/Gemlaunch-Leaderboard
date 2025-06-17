import React from 'react';
import { Box } from '@mui/material';

interface Props {
    px?: number;
    py?: number;
    mt?: number;
    mb?: number;
    mr?: number;
    height?: string;
    sx?: any;
    children: React.ReactNode;
}

const PrimaryCard = ({ children, px, py, mt, mb, mr, height = 'auto', sx }: Props) => {
    return (
        <Box
            sx={{
                height,
                borderRadius: '15px',
                background: 'rgba(49, 77, 71, 0.70)',
                backdropFilter: 'blur(9.5px)',
                px: px ? `${px}px` : { xs: '12px', md: '22px' },
                py: py ? `${py}px` : { xs: '7px', md: '10px' },
                mt: mt ? `${mt}px` : '0px',
                mb: mb ? `${mb}px` : '0px',
                mr: mr ? `${mr}px` : '0px',
                ...sx,
            }}
        >
            {children}
        </Box>
    );
};

export default PrimaryCard;
