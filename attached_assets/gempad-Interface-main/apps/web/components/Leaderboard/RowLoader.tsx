import React from 'react';
import { TableRowProps } from './types';
import { Box, Button, Skeleton, TableCell, TableRow, Typography } from '@mui/material';
import BadgeAvatars from '../BadgeAvatar/BadgeAvatar';
import CircularProgressWithLabel from './CircularProgress';
import { getProgress } from '@/utils/getProgress';
import { getLaunchpadRouteByContractName } from '../ViewPool/utils';
import Link from 'next/link';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Enable UTC plugin
dayjs.extend(utc);

const RowLoader = () => {
    return (
        <TableRow>
            <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                        }}
                    >
                        <Box sx={{ position: 'relative' }}>
                            <Skeleton animation="wave" variant="circular" width={40} height={40} />
                        </Box>
                        <Box>
                            <Skeleton animation="wave">
                                <Typography variant="h5" color="common.white">
                                    Token name Token symbol
                                </Typography>
                            </Skeleton>
                            <Skeleton animation="wave">
                                <Typography
                                    variant="h5"
                                    color="primary"
                                    sx={{ whiteSpace: 'nowrap' }}
                                >
                                    Invested amount invested token amount listing price
                                </Typography>
                            </Skeleton>
                        </Box>
                    </Box>
                </Box>
            </TableCell>

            <TableCell align="right" sx={{ borderBottom: '1px solid #ffffff30' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Skeleton animation="wave">
                        <Button variant="contained" sx={{ whiteSpace: 'nowrap' }}>
                            View Pool
                        </Button>
                    </Skeleton>
                </Box>
            </TableCell>
        </TableRow>
    );
};

export default RowLoader;
