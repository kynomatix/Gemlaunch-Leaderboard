'use client';
import { Avatar, Box, Typography, Skeleton } from '@mui/material';
import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';

const DetailCardSkeleton: React.FC = () => {
    return (
        <Box sx={{ width: '100%' }}>
            <PrimaryCard py={30}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        justifyContent: 'space-between',
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        marginBottom: '3.5rem',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                        }}
                    >
                        <Avatar sx={{ border: '3px solid #fff', width: 70, height: 70 }}>
                            <Skeleton animation="wave" variant="circular" width={70} height={70} />
                        </Avatar>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Typography variant="h5" fontSize={20}>
                                <Skeleton
                                    animation="wave"
                                    variant="rounded"
                                    width="12rem"
                                    height={30}
                                >
                                    <Typography>Upcoming</Typography>
                                </Skeleton>
                            </Typography>
                            <Skeleton
                                animation="wave"
                                variant="rounded"
                                width="1.85rem"
                                height="1.8rem"
                            >
                                <Typography>Upcoming</Typography>
                            </Skeleton>
                        </Box>
                    </Box>
                    <Skeleton
                        animation="wave"
                        variant="rectangular"
                        width="7rem"
                        height={30}
                        sx={{ borderRadius: '30px' }}
                    >
                        <Typography>Upcoming</Typography>
                    </Skeleton>
                </Box>
                <Box width="100%" height="25rem">
                    <Skeleton
                        animation="wave"
                        variant="rectangular"
                        width="100%"
                        height="25rem"
                        sx={{ borderRadius: '15px' }}
                    >
                        <Typography>Upcoming</Typography>
                    </Skeleton>
                </Box>
            </PrimaryCard>
        </Box>
    );
};

export default DetailCardSkeleton;
