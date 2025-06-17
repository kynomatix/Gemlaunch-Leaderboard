import React from 'react';
import { Box } from '@mui/material';

interface Props {
    px?: number;
    py?: number;
    mt?: number;
    mb?: number;
    children: React.ReactNode;
}

const SecondaryCard = ({ children, px, py, mt, mb }: Props) => {
    return (
        <Box
            sx={{
                borderRadius: '15px',
                background: '#0B1B18',
                backdropFilter: 'blur(9.5px)',
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

export default SecondaryCard;
