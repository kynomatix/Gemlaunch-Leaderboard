import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { VestingSchedule } from '@/utils/calculateVesting';
import { Typography } from '@mui/material';

export default function VestingTable({ vestingDetails }: { vestingDetails: VestingSchedule[] }) {
    return (
        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell align="left">
                            <Typography variant="h5" fontSize={14} color="common.white">
                                Unlock #
                            </Typography>
                        </TableCell>
                        <TableCell align="left">
                            <Typography variant="h5" fontSize={14} color="common.white">
                                Time (UTC)
                            </Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Typography variant="h5" fontSize={14} color="common.white">
                                Unlocked tokens
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vestingDetails?.map(({ amount, percentage, unlockTime }, i) => {
                        const time = new Date(unlockTime * 1000).toUTCString();

                        return (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left">
                                    <Typography variant="h5" fontSize={12} color="common.white">
                                        {i + 1}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography
                                        variant="h5"
                                        fontSize={12}
                                        color="common.white"
                                        align="left"
                                    >
                                        {time}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography
                                        variant="h5"
                                        fontSize={12}
                                        color="common.white"
                                    >{`${Number(amount).toFixed(2)} (${Number(percentage).toFixed(
                                        2,
                                    )}%)`}</Typography>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
