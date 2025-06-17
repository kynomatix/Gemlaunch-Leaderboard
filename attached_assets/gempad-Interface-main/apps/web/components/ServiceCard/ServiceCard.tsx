import React from 'react';
import { Box, Typography } from '@mui/material';
import { Gilroy, NeueMachina } from '@/constants';

interface CardProps {
    Icon: React.FC;
    title: string;
    description: string;
    color: string;
}

const ServiceCard = ({ Icon, title, description, color }: CardProps) => {
    return (
        <Box sx={{ width: { xs: '100%', md: '300px' } }} data-aos="fade-up">
            <Box sx={{ height: '1px', background: color, mb: '20px' }} />
            <Icon />
            <Typography
                variant="h3"
                sx={{ mt: '26px', color, fontFamily: NeueMachina.style.fontFamily }}
            >
                {title}
            </Typography>
            <Typography
                variant="subtitle2"
                sx={{ lineHeight: '120%', mt: '6px', fontFamily: Gilroy.style.fontFamily }}
            >
                {description}
            </Typography>
        </Box>
    );
};

export default ServiceCard;
