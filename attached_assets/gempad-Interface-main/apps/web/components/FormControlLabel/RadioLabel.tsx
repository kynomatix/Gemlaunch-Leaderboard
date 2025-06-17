import { FormControlLabel, Radio, Typography } from '@mui/material';
import React from 'react';

interface Props {
    iconSize: number;
    fontSize: number;
    val: number;
    lab: string;
    isDisabled: boolean;
    currentStatus: number;
    handleChange: (e: React.MouseEvent<HTMLLabelElement, MouseEvent>, v: number) => Promise<void>;
}

const RadioLabel = ({ iconSize, lab, val, handleChange, isDisabled, currentStatus }: Props) => {
    return (
        <FormControlLabel
            sx={{
                '& .MuiSvgIcon-root': {
                    fontSize: iconSize,
                },
            }}
            disabled={isDisabled}
            onClick={(e) => currentStatus === 1 && handleChange(e, +val)}
            value={val}
            control={<Radio sx={{ color: '#FFFFFF' }} />}
            label={<Typography fontSize={12}>{lab}</Typography>}
        />
    );
};

export default RadioLabel;
