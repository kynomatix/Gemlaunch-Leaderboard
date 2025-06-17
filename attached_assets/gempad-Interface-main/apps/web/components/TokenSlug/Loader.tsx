import {
    Box,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';

const tableContainerStyles = {
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
    mt: '24px',
    backgroundColor: 'transparent',
    boxShadow: 'none',
};

const Loader = () => {
    return (
        <PrimaryCard mt={30}>
            <TableContainer sx={tableContainerStyles} component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ border: 0 }}>
                                <Typography color="common.white" variant="h5" fontWeight={600}>
                                    Wallet
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ border: 0 }}>
                                <Typography color="common.white" variant="h5" fontWeight={600}>
                                    Amount
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ border: 0 }}>
                                <Typography color="common.white" variant="h5" fontWeight={600}>
                                    Cycle(m)
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ border: 0 }}>
                                <Typography color="common.white" variant="h5" fontWeight={600}>
                                    Cycle Release(%)
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ border: 0 }}>
                                <Typography color="common.white" variant="h5" fontWeight={600}>
                                    TGE(%)
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ border: 0 }}>
                                <Typography color="common.white" variant="h5" fontWeight={600}>
                                    Unlock time(UTC)
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ border: 0 }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[1, 2, 3, 4, 5]?.map((id) => (
                            <TableRow key={id}>
                                <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                                    <Skeleton variant="rounded" width={200} animation="wave" />
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                                    <Skeleton variant="rounded" width={60} animation="wave" />
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                                    <Skeleton variant="rounded" width={60} animation="wave" />
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                                    <Skeleton variant="rounded" width={60} animation="wave" />
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                                    <Skeleton variant="rounded" width={60} animation="wave" />
                                </TableCell>
                                <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                                    <Skeleton variant="rounded" width={120} animation="wave" />
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ borderBottom: '1px solid #ffffff30' }}
                                >
                                    <Skeleton variant="rounded" width={40} animation="wave" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </PrimaryCard>
    );
};

export default Loader;
