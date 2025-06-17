import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import RefreshIcon from 'public/assets/icons/refresh.svg';
import AppPagination from '../AppPagination/AppPagination';

function createData(action: string, transaction: string, value: string, time: string) {
    return { action, transaction, value, time };
}

const rows = [
    createData('Swap BNB for GEM', '0x821...4f2495131', '$25,000', '1 Minute'),
    createData('Swap BNB for GEM', '0x821...4f2495131', '$25,000', '1 Minute'),
    createData('Swap BNB for GEM', '0x821...4f2495131', '$25,000', '1 Minute'),
    createData('Swap BNB for GEM', '0x821...4f2495131', '$25,000', '1 Minute'),
    createData('Swap BNB for GEM', '0x821...4f2495131', '$25,000', '1 Minute'),
    createData('Swap BNB for GEM', '0x821...4f2495131', '$25,000', '1 Minute'),
    createData('Swap BNB for GEM', '0x821...4f2495131', '$25,000', '1 Minute'),
    createData('Swap BNB for GEM', '0x821...4f2495131', '$25,000', '1 Minute'),
    createData('Swap BNB for GEM', '0x821...4f2495131', '$25,000', '1 Minute'),
    createData('Swap BNB for GEM', '0x821...4f2495131', '$25,000', '1 Minute'),
    createData('Swap BNB for GEM', '0x821...4f2495131', '$25,000', '1 Minute'),
    createData('Swap BNB for GEM', '0x821...4f2495131', '$25,000', '1 Minute'),
];

export default function ExchangeHistory() {
    return (
        <TableContainer
            component={Paper}
            sx={{
                overflowX: 'auto',
                // minWidth: 650,
                borderRadius: '15px',
                '::-webkit-scrollbar': {
                    height: '2px',
                    backgroundColor: 'transparent',
                    color: '#fff',
                },
                '::-webkit-scrollbar-thumb': {
                    borderRadius: '10px',
                    background:
                        'linear-gradient(90deg, rgba(255,255,255,0) 2%, #22CDA660 50%, rgba(255,255,255,0) 98%)',
                },
                '::-webkit-scrollbar-track': {
                    borderRadius: '10px',
                    background: 'transparent',
                },
            }}
        >
            <Table>
                <TableHead>
                    <TableRow
                        sx={{
                            background: 'rgba(37, 101, 86)',
                        }}
                    >
                        <TableCell sx={{ border: 0 }} align="left">
                            <Typography variant="h5" fontWeight={600} color="common.white">
                                Action
                            </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 0 }} align="left">
                            <Typography variant="h5" fontWeight={600} color="common.white">
                                Txn
                            </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 0 }} align="left">
                            <Typography variant="h5" fontWeight={600} color="common.white">
                                Value
                            </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 0 }} align="left">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <Typography variant="h5" fontWeight={600} color="common.white">
                                    Time
                                </Typography>

                                <RefreshIcon />
                            </Box>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                                border: 0,
                                backgroundColor:
                                    index % 2 === 0 ? 'rgba(36, 74, 66)' : 'rgba(37, 56, 52)',
                            }}
                        >
                            <TableCell sx={{ border: 0, py: '20px' }} align="left">
                                <Typography
                                    color="common.white"
                                    variant="h5"
                                    fontSize="14px"
                                    sx={{ whiteSpace: 'nowrap' }}
                                >
                                    {row.action}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ border: 0, py: '20px' }} align="left">
                                <Typography color="common.white" variant="h5" fontSize="14px">
                                    {row.transaction}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ border: 0, py: '20px' }} align="left">
                                <Typography color="common.white" variant="h5" fontSize="14px">
                                    {row.value}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ border: 0, py: '20px' }} align="left">
                                <Typography color="common.white" variant="h5" fontSize="14px">
                                    {row.time}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}

                    <TableRow
                        sx={{
                            backgroundColor: 'rgba(37, 56, 52)',
                        }}
                    >
                        <TableCell colSpan={4} sx={{ pt: '20px' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <AppPagination count={10} />
                            </Box>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
