import React from 'react';
import { Box, Button, Typography, Skeleton } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';

const OwnerZoneSkeleton = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: '30px' }}>
            <Typography variant="h5" fontSize={20} sx={{ mb: '15px', ml: '10px' }}>
                <Skeleton animation="wave" variant="rounded" width="60%" height={30}>
                    <Typography>Owner Zone</Typography>
                </Skeleton>
            </Typography>
            <PrimaryCard py={25}>
                <Skeleton animation="wave" variant="rounded" width="100%" height={60}>
                    <Typography>
                        Please don&apos;t start the airdrop before you finalize the presale pool.
                    </Typography>
                </Skeleton>
                <Box mt={1}>
                    <Skeleton animation="wave" variant="rounded" width="100%" height={60}>
                        <Typography>
                            You must exclude fees, dividens, max tx for airdrop address to start the
                            airdrop.
                        </Typography>
                    </Skeleton>
                </Box>
                <Box mt={2}>
                    <Box mb={1}>
                        <Skeleton animation="wave" variant="rounded" width="100%">
                            <Button variant="contained" size="small">
                                Start Airdrop
                            </Button>
                        </Skeleton>
                    </Box>
                    <Box mb={1}>
                        <Skeleton animation="wave" variant="rounded" width="100%">
                            <Button variant="contained" size="small">
                                Start Airdrop
                            </Button>
                        </Skeleton>
                    </Box>
                </Box>
                <Box mt={1}>
                    <Typography variant="body1" fontSize={14}>
                        <Skeleton animation="wave" variant="text" width="60%" height={40}>
                            <Typography>Allocation Actions</Typography>
                        </Skeleton>
                    </Typography>
                    <Box mt={1}>
                        <Box>
                            <Box mb={1}>
                                <Skeleton animation="wave" variant="rounded" width="100%">
                                    <Button variant="contained" size="small">
                                        Start Airdrop
                                    </Button>
                                </Skeleton>
                            </Box>
                            <Box mb={1}>
                                <Skeleton animation="wave" variant="rounded" width="100%">
                                    <Button variant="contained" size="small">
                                        Start Airdrop
                                    </Button>
                                </Skeleton>
                            </Box>
                            <Box mb={1}>
                                <Skeleton animation="wave" variant="rounded" width="100%">
                                    <Button variant="contained" size="small">
                                        Start Airdrop
                                    </Button>
                                </Skeleton>
                            </Box>
                        </Box>
                        <Box mb={1}>
                            <Skeleton animation="wave" variant="rounded" width="100%">
                                <Button variant="contained" size="small">
                                    Start Airdrop
                                </Button>
                            </Skeleton>
                        </Box>
                    </Box>
                </Box>
            </PrimaryCard>
        </Box>
    );
};

export default OwnerZoneSkeleton;
