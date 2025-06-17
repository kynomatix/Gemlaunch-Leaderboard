import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import { Avatar, Box, Button, Divider, Skeleton, Typography } from '@mui/material';
import StatusChip from '../ExploreAirdrops/StatusChip';
import LinearProgressCustom from '../LinearProgress/LinearProgressCustom';

const CardLoader = () => {
    return (
        <PrimaryCard py={35}>
            <Box sx={{ minHeight: 'auto' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '10px',
                    }}
                >
                    <Skeleton animation="wave" variant="circular" width={50} height={50} />

                    <Skeleton animation="wave" height={40}>
                        <StatusChip status={0} />
                    </Skeleton>
                </Box>

                <Box mt={2}>
                    <Skeleton animation="wave">
                        <Typography fontSize={20} variant="h5">
                            Name
                        </Typography>
                    </Skeleton>
                    <Skeleton animation="wave" height={40}>
                        <Typography fontSize={14} variant="h5" sx={{ color: '#B9B9B9' }}>
                            {`Project will receive 34 % at first release`}
                        </Typography>
                    </Skeleton>
                </Box>

                <Box mt={3} mb={1}>
                    <Skeleton animation="wave">
                        <Typography fontSize={14} variant="h5">
                            softcap/hardcap
                        </Typography>
                    </Skeleton>
                    <Skeleton animation="wave">
                        <Typography fontSize={18} variant="h5" sx={{ color: '#0FD7D2' }}>
                            2 ETH / 4 ETH
                        </Typography>
                    </Skeleton>
                </Box>

                <Box mb={2}>
                    <Skeleton animation="wave">
                        <Typography variant="h5" fontSize={14} sx={{ mb: '4px' }}>
                            Progress (100)
                        </Typography>
                    </Skeleton>
                    <Box mt={0.5} mb={0.5}>
                        <Skeleton animation="wave" height={20} width={'100%'}>
                            <LinearProgressCustom value={100} />
                        </Skeleton>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <Skeleton animation="wave">
                            <Typography variant="h5" fontSize={12}>
                                2 ETH
                            </Typography>
                        </Skeleton>
                        <Skeleton animation="wave">
                            <Typography fontWeight={600} fontSize={12}>
                                4 / ETH
                            </Typography>
                        </Skeleton>
                    </Box>
                </Box>

                <Divider color="#ffffff" />

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <Box>
                        <Skeleton animation="wave">
                            <Typography fontSize={12}>Presale</Typography>
                        </Skeleton>
                        <Skeleton animation="wave">
                            <Typography fontSize={12} fontWeight={600}>
                                Live
                            </Typography>
                        </Skeleton>
                    </Box>
                    <Box mt={2} sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <Skeleton animation="wave">
                            <Button variant="contained" sx={{ px: '17px' }}>
                                View Pool
                            </Button>
                        </Skeleton>
                    </Box>
                </Box>
            </Box>
        </PrimaryCard>
    );
};

export default CardLoader;
