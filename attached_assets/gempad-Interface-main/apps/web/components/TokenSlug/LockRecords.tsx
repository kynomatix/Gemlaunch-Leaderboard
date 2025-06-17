import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import PrimaryCard from '../Cards/PrimaryCard';
import Link from 'next/link';
import AppPagination from '../AppPagination/AppPagination';
import LockRecordsIcon from 'public/assets/icons/records-icon.svg';
import { formatDate } from '@/utils/formatDate';
import { formatUnits } from 'viem';
import { useMediaQuery } from '@mui/material';
import { shortenAddress } from '@/utils/format';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import { getBlockExploreLink } from '@/utils';
import { useNetwork } from 'wagmi';
import dayjs from 'dayjs';
import { LockEdge } from '@/src/gql/graphql';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { formatAmount } from '@/utils/formatAmount';

interface Props {
    lockRecord: LockEdge[];
    baseRoute: string;
    count: number;
    queryVariables: any;
    refetch: any;
    limit: number;
}

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

const LockRecords = ({ lockRecord, baseRoute, count, queryVariables, refetch, limit }: Props) => {
    const isMobile = useMediaQuery('(max-width:800px)');
    const { chainId } = useActiveChainId();

    const handlePegination = async (event, pageNumber) => {
        queryVariables.after = pageNumber === 1 ? null : ((pageNumber - 1) * limit)?.toString();
        await refetch();
    };

    return (
        <Box sx={{ mt: '30px', mb: '30px' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    px: '30px',
                    pb: '17px',
                }}
            >
                <Typography variant="h5" fontSize={20}>
                    Lock Records
                </Typography>
                <LockRecordsIcon />
            </Box>
            <PrimaryCard py={26}>
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
                            {lockRecord?.map((x) => (
                                <TableRow key={x?.node?.id}>
                                    <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                                        <Link
                                            href={getBlockExploreLink(
                                                x?.node?.owner?.id || 's',
                                                'address',
                                                chainId,
                                            )}
                                            target="_blank"
                                        >
                                            <Typography
                                                variant="h5"
                                                fontSize={14}
                                                color="primary"
                                                sx={{
                                                    '&:hover': { opacity: '0.7' },
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                {isMobile
                                                    ? shortenAddress(x?.node?.owner?.id)
                                                    : x?.node?.owner?.id}
                                            </Typography>
                                        </Link>
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                                        <Typography variant="h5" fontSize={14} color="common.white">
                                            {formatAmount(
                                                formatUnits(
                                                    x?.node?.amount ?? 0n,
                                                    x?.node?.token?.decimals ?? 18,
                                                ),
                                            )}{' '}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                                        <Typography variant="h5" fontSize={14} color="common.white">
                                            {Number(x?.node?.interval) / 60 || '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                                        <Typography variant="h5" fontSize={14} color="common.white">
                                            {Number(x?.node?.cycleShare || 0) / 1e2 || '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                                        <Typography variant="h5" fontSize={14} color="common.white">
                                            {Number(x?.node?.tge || 0) / 1e2 || '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                                        <Typography variant="h5" fontSize={14} color="common.white">
                                            {formatDate(x?.node?.unlockDate)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ borderBottom: '1px solid #ffffff30' }}
                                    >
                                        <Link href={`/record/${x?.node?.id}`}>
                                            <Typography
                                                fontSize={14}
                                                fontWeight={600}
                                                color="primary"
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                view
                                            </Typography>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}

                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    sx={{ pt: '20px', pb: '10px', borderBottom: 'none' }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <AppPagination onChange={handlePegination} count={count} />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </PrimaryCard>
        </Box>
    );
};

export default LockRecords;
