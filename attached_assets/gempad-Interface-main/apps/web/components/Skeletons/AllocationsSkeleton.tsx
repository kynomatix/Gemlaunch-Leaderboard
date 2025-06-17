import React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';
import useMediaQuery from '@mui/material/useMediaQuery';

const AllocationsSkeleton = () => {
    const isMobile = useMediaQuery('(max-width: 700px)');
    return (
        <Box
            mt={5}
            sx={{
                background: 'rgba(49, 77, 71, 0.70)',
                backdropFilter: 'blur(9.5px)',
                overflow: 'hidden',
                borderRadius: '15px',
            }}
        >
            <Box width="100%" height="12rem">
                <Skeleton
                    animation="wave"
                    variant="rectangular"
                    width="100%"
                    height="12rem"
                    sx={{ borderRadius: '15px' }}
                >
                    <Typography>Upcoming</Typography>
                </Skeleton>
            </Box>
        </Box>
    );
};

export default AllocationsSkeleton;
