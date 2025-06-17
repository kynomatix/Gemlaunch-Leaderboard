import React from 'react';
import PrimaryCard from './Cards/PrimaryCard';
import { Skeleton } from '@mui/material';

const BoxLoader = () => {
    return (
        <PrimaryCard mt={30}>
            <Skeleton
                animation="wave"
                variant="rounded"
                height={300}
                sx={{ borderRadius: '20px' }}
            />
        </PrimaryCard>
    );
};

export default BoxLoader;
