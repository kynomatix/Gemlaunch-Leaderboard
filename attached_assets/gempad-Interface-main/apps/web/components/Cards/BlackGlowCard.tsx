import React from 'react';
import { Box } from '@mui/material';

interface Props {
    px?: number;
    py?: number;
    mt?: number;
    mb?: number;
    children: React.ReactNode;
}

const BlackGlowCard = ({ children, px, py, mt, mb }: Props) => {
    return (
        <Box
            sx={{
                borderRadius: '15px',
                background: '#080808',
                boxShadow: '0px 0px 10px 2px rgba(100, 231, 122, 0.20)',
                px: px ? `${px}px` : '22px',
                py: py ? `${py}px` : '10px',
                mt: mt ? `${mt}px` : '0px',
                mb: mb ? `${mb}px` : '0px',
            }}
        >
            {children}
        </Box>
    );
};

export default BlackGlowCard;
