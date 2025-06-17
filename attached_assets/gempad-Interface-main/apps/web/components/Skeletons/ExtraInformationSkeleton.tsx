import { Box, Typography, Skeleton } from '@mui/material';
import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';

const ExtraInformationSkeleton: React.FC = () => {
    return (
        <Box
            mt={5}
            sx={{
                background: 'rgba(49, 77, 71, 0.70)',
                backdropFilter: 'blur(9.5px)',
                overflow: 'hidden',
                borderRadius: '15px',
                padding: "20px"
            }}
        >
            <Box width="100%" height="15rem">
                <Skeleton
                    animation="wave"
                    variant="rectangular"
                    width="100%"
                    height="15rem"
                    sx={{ borderRadius: '15px' }}
                >
                    <Typography>Upcoming</Typography>
                </Skeleton>
            </Box>
        </Box>
    );
};

export default ExtraInformationSkeleton;
