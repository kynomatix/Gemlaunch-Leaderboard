import React from 'react';
import { Box, Typography } from '@mui/material';
import { Gilroy, GilroyBold } from '@/constants';

interface CardProps {
    Icon: React.FC;
    title: string;
    value: string | number;
}

const StatsCard = ({ title, value, Icon }: CardProps) => {
    return (
        <Box
            data-aos="fade-up"
            sx={{
                borderRadius: '15px',
                background: '#121212',
                boxShadow: '0px 4px 8px 0px rgba(87, 87, 87, 0.04)',
                px: '25px',
                py: '30px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
            }}
        >
            <Box sx={{ flex: '0 0 auto', minWidth: '50px' }}>
                <Icon />
            </Box>
            <Box sx={{ flex: '1 1 auto' }}>
                <Typography variant="subtitle2" sx={{ fontFamily: Gilroy.style.fontFamily }}>
                    {title}
                </Typography>
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontSize: { xs: '36px' },
                        fontWeight: { xs: 'bold' },
                        fontFamily: GilroyBold.style.fontFamily,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 'calc(100% - 50px)', // Adjust as needed based on the icon size
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Box>
    );
};

export default StatsCard;
