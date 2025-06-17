import React from 'react';
import { Box, Typography, LinearProgress, Skeleton, Divider, Button } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';
import StatusChip from '../ExploreAirdrops/StatusChip';
import LinearProgressCustom from '../LinearProgress/LinearProgressCustom';

const CardLoader = () => {
    return (
        <PrimaryCard py={35}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '10px',
                    mb: 2,
                }}
            >
                <Skeleton variant="circular" animation="wave" width={70} height={70} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Skeleton variant="rounded" animation="wave">
                        <StatusChip status={0} />
                    </Skeleton>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: '5px',
                            mt: '10px',
                        }}
                    >
                        <Skeleton variant="rounded" animation="wave">
                            <Typography
                                fontSize={12}
                                sx={{
                                    background: '#22CDA6',
                                    borderRadius: '5px',
                                    px: '8px',
                                    py: '2px',
                                }}
                            >
                                KYC
                            </Typography>
                        </Skeleton>
                        <Skeleton variant="rounded" animation="wave">
                            <Typography
                                fontSize={12}
                                sx={{
                                    background: '#11B6DB',
                                    borderRadius: '5px',
                                    px: '8px',
                                    py: '2px',
                                }}
                            >
                                Audit
                            </Typography>
                        </Skeleton>
                    </Box>
                </Box>
            </Box>

            <Skeleton animation="wave" variant="rounded">
                <Typography fontSize={20} variant="h5">
                    Token Name
                </Typography>
            </Skeleton>

            <Skeleton sx={{ mt: '25px' }} animation="wave" variant="rounded">
                <Typography fontSize={18} variant="h5" sx={{ color: '#0FD7D2' }}>
                    100 - 200 FTM
                </Typography>
            </Skeleton>

            <Box>
                <Skeleton animation="wave" variant="rounded" sx={{ mt: 1 }}>
                    <Typography variant="h5" fontSize={14}>
                        Progress 78%
                    </Typography>
                </Skeleton>
                <Skeleton animation="wave" variant="rounded" height={10} sx={{ my: 1 }} />

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <Skeleton animation="wave" variant="rounded">
                        <Typography variant="h5" fontSize={12}>
                            100 FTM
                        </Typography>
                    </Skeleton>
                    <Skeleton animation="wave" variant="rounded">
                        <Typography variant="h5" fontSize={12}>
                            100 FTM
                        </Typography>
                    </Skeleton>
                </Box>
            </Box>

            <Box sx={{ mt: '15px' }}>
                <Skeleton animation="wave" variant="text">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Typography variant="h5" fontSize={14}>
                            Liquidity %:
                        </Typography>
                        <Typography fontSize={14}>48%</Typography>
                    </Box>
                </Skeleton>
                <Skeleton animation="wave" variant="rounded">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <Typography variant="h5" fontSize={14}>
                            Lockup Time:
                        </Typography>
                        <Typography fontSize={14}>this is th lockup time</Typography>
                    </Box>
                </Skeleton>
            </Box>

            <Box mt={1} mb={1}>
                <Divider color="#ffffff" />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    justifyContent: 'space-between',
                }}
            >
                <Skeleton animation="wave" variant="rounded">
                    <Typography fontSize={14}>Sale Ends In:</Typography>
                </Skeleton>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Skeleton animation="wave" variant="circular" height={30} width={30} />

                    <Skeleton animation="wave" variant="rounded">
                        <Typography fontSize={14}>View View</Typography>
                    </Skeleton>
                </Box>
            </Box>
        </PrimaryCard>
    );
};

export default CardLoader;
