import React from 'react';
import { Box, Typography } from '@mui/material';

interface CardProps {
    title: string;
    value: string | number;
}

const AppStatsCard = ({ title, value }: CardProps) => {
    return (
        <Box
            sx={{
                borderRadius: '10px',
                background: 'rgba(49, 77, 71, 0.70)',
                backdropFilter: 'blur(4px)',
                width: '100%',
                py: '27px',

                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography variant="body1" fontWeight={500}>
                {title}
            </Typography>
            <Typography variant="h4" color="primary">
                {value}
            </Typography>
        </Box>
    );
};

export default AppStatsCard;
