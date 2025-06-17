import React from 'react';
import { TableRowProps } from './types';
import { Box, Button, TableCell, TableRow, Typography } from '@mui/material';
import BadgeAvatars from '../BadgeAvatar/BadgeAvatar';
import CircularProgressWithLabel from './CircularProgress';
import { getProgress } from '@/utils/getProgress';
import { getLaunchpadRouteByContractName } from '../ViewPool/utils';
import Link from 'next/link';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Enable UTC plugin
dayjs.extend(utc);

const Row: React.FC<TableRowProps> = ({ lp, investedAmount, totalAmount, idx }) => {
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
                    <Typography variant="h5" fontSize={20} color="common.white">
                        {idx + 1}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                        }}
                    >
                        <Box sx={{ position: 'relative' }}>
                            <BadgeAvatars
                                url={lp?.metadata?.socials?.logoUrl}
                                chainId={lp.chainId}
                            />
                        </Box>
                        <Box>
                            <Typography variant="h5" color="common.white">
                                {lp.token.name} {lp.token.symbol}
                            </Typography>
                            <Typography variant="h5" color="primary" sx={{ whiteSpace: 'nowrap' }}>
                                {investedAmount} {lp.fundToken.symbol}
                                <span
                                    style={{
                                        color: '#ADADAD',
                                        fontSize: '14px',
                                    }}
                                >
                                    {' '}
                                    - Listing time:
                                </span>{' '}
                                {dayjs(+String(1712569817n) * 1000)
                                    .utc()
                                    .format('YYYY-MM-DD HH:mm:ss')}
                            </Typography>
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
                    <CircularProgressWithLabel value={getProgress(investedAmount, totalAmount)} />

                    <Link href={getLaunchpadRouteByContractName(lp.name, lp.contractAddress)}>
                        <Button variant="contained" sx={{ whiteSpace: 'nowrap' }}>
                            View Pool
                        </Button>
                    </Link>
                </Box>
            </TableCell>
        </TableRow>
    );
};

export default Row;
