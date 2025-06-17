import { Box, Collapse, IconButton, Typography } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

interface InforbarProps {
    message: string;
    open: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    dismissable: boolean;
    variant?: 'error' | 'info' | 'warning';
}

const styles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    px: 2,
    py: 1,
    borderRadius: 1,
};

const border = {
    info: '2px solid #22CDA6',
    error: '2px solid #FF1744',
    warning: '2px solid #DCD448',
};

const bg = {
    info: 'rgba(49, 77, 71, 0.70)',
    error: '#FF174421',
    warning: '#DCD44821',
};

const iconColor = {
    info: ' #22CDA6',
    error: ' #FF1744',
    warning: ' #DCD448',
};

const Infobar = ({ message, open, setOpen, dismissable, variant = 'info' }: InforbarProps) => {
    return (
        <Collapse in={open}>
            <Box
                sx={{
                    justifyContent: dismissable ? 'space-between' : 'center',
                    border: border[variant],
                    background: bg[variant],
                    ...styles,
                }}
            >
                {dismissable && <InfoIcon sx={{ color: iconColor[variant] }} />}
                <Typography variant="body1" fontSize={14} textAlign="center" color="common.white">
                    {message}
                </Typography>
                {dismissable && (
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>
        </Collapse>
    );
};

export default Infobar;
