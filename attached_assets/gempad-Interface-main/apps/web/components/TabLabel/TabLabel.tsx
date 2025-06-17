import { Tab, Typography } from '@mui/material';
import React from 'react';

const TabLabel = ({ label, ...rest }: { label: string }) => {
    return (
        <Tab
            label={
                <Typography color="common.white" variant="h5" sx={{ textTransform: 'capitalize' }}>
                    {label}
                </Typography>
            }
            {...rest}
        />
    );
};

export default TabLabel;
