import { Avatar, Box, Grid, Skeleton, Typography } from '@mui/material';
import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import Divider from '../Divider/Divider';

const CardsLoading = () => {
    return (
        <PrimaryCard py={35} height="100%">
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                }}
            >
                <Skeleton animation="wave" variant="circular" width={50} height={50} />
                <Skeleton animation="wave" variant="rounded">
                    <Typography>Upcoming</Typography>
                </Skeleton>
            </Box>
            <Box mt={1}>
                <Skeleton animation="wave" variant="rounded">
                    <Typography>USDC Coin</Typography>
                </Skeleton>
            </Box>
            <Box
                sx={{
                    mt: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}
            >
                {[1, 2, 3].map((x) => (
                    <Skeleton animation="wave" variant="rounded" />
                ))}
            </Box>

            <Divider color="#ffffff" />

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    mt: '25px',
                }}
            >
                <Skeleton animation="wave" variant="rounded">
                    <Typography>Starts in</Typography>
                </Skeleton>
                <Skeleton animation="wave" variant="rounded">
                    <Typography>View Airdrop</Typography>
                </Skeleton>
            </Box>
        </PrimaryCard>
    );
};

export default CardsLoading;
