import React from 'react';
import CopyIcon from 'public/assets/icons/copy.svg';
import { Box, Tooltip, Typography } from '@mui/material';
import { AddressProps } from './types';
import { handleCopy } from '@/utils/handleCopy';

const Address: React.FC<AddressProps> = ({ idx, user }) => {
    const [open, setOpen] = React.useState<boolean>(false);

    const handleTooltipOpen = () => {
        setOpen(true);
        setTimeout(() => {
            setOpen(false);
        }, 2000);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography fontSize={14}>{user}</Typography>
            <Tooltip
                placement="top"
                PopperProps={{
                    disablePortal: true,
                }}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title="copied"
            >
                <Box onClick={() => handleCopy(user, handleTooltipOpen)} sx={{ cursor: 'pointer' }}>
                    <CopyIcon />
                </Box>
            </Tooltip>
        </Box>
    );
};

export default Address;
