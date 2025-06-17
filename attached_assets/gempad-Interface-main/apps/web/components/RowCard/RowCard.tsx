import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import { Box, Typography } from '@mui/material';

interface RowProps {
    prop: string;
    val: string | number;
}

const RowCard = ({ prop, val }: RowProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'space-between',
                my: 1,
            }}
        >
            <Typography variant="h5" fontSize={12}>
                {prop}
            </Typography>
            <Typography variant="h5" fontSize={12}>
                {val}
            </Typography>
        </Box>
    );
};

export default RowCard;
