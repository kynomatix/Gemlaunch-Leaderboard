import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { homeNavigation } from '@/constants';

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const sidebarStyles = {
    width: '300px',
    background: '#0B1B18', // Darkened background color
    height: '100%',
    color: '#fff',
    overflowY: 'auto',
};

const contentStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    // gap: '16px',
    // p: '20px',
    width: '100%',
};

const itemStyles = {
    cursor: 'pointer',
    width: '100%',
    px: '20px',
    py: '12px',
    // borderRadius: '4px',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: '#22CDA619',
    },
};

export default function Slider({ open, setOpen }: Props) {
    return (
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
            <Box sx={sidebarStyles}>
                <Box sx={{ p: '10px' }}>
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={contentStyles}>
                    {homeNavigation.map(({ id, text }) => (
                        <Typography
                            key={id}
                            fontSize={16}
                            fontWeight={500}
                            color="common.white"
                            sx={itemStyles}
                        >
                            {text}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </Drawer>
    );
}
