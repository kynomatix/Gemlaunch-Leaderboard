import React from 'react';
import { Box, Typography } from '@mui/material';

export enum States {
    Danger = '#CD3E00',
    Warning = '#CD9700',
    Success = '#24A52A',
    Disabled = '#6A6A6A',
}

export enum BGStates {
    Danger = '#FFC2C2',
    Warning = '#F0E7CE',
    Success = '#D0FFD2',
    Disabled = '#9E9E9E',
}

export type Status = 'ACTIVE' | 'PENDING' | 'CLOSED' | 'CANCELLED';

interface Props {
    status: number;
}

const StatusChip = ({ status }: Props) => {
    const getStatusTitle: Record<number, string> = {
        0: 'Upcoming',
        1: 'Live',
        2: 'Cancelled',
        3: 'Ended',
        4: 'Unknown',
    };

    let color = '';
    let backgroundColor = '';

    if (status === 1) {
        color = States.Success;
        backgroundColor = BGStates.Success;
    } else if (status === 3) {
        color = States.Danger;
        backgroundColor = BGStates.Danger;
    } else if (status === 0) {
        color = States.Warning;
        backgroundColor = BGStates.Warning;
    } else {
        color = States.Disabled;
        backgroundColor = BGStates.Disabled;
    }
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                px: '15px',
                py: '6px',
                backgroundColor,
                borderRadius: '30px',
                width: 'fit-content',
            }}
        >
            <Box
                sx={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: color }}
            />
            <Typography variant="h5" fontSize={12} sx={{ color }}>
                {getStatusTitle[status]}
            </Typography>
        </Box>
    );
};

export default StatusChip;
