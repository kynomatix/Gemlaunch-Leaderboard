import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import { tableContainerStyles } from './constants';
import PrimaryCard from '../Cards/PrimaryCard';
import { Box, Collapse, TableFooter, Typography } from '@mui/material';
import { LockRecordProps, LockRecordQueryData } from './types';
import { OperationVariables, useQuery } from '@apollo/client';
import { GET_LOCK_BY_ID } from './query';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { Lock } from '@/src/gql/graphql';
import { formatUnits } from 'viem';
import AppPagination from '../AppPagination/AppPagination';
import TablePagination from '../TablePagination/TablePagination';

function createData(lock: Lock) {
    if (!lock)
        return { amount: undefined, cycle: undefined, tge: undefined, unlockDate: undefined };

    const { amount, cycleShare, tge, unlockDate, interval, token } = lock;
    const amountNum = formatUnits(amount, token?.decimals ?? 18);
    const cycleShareNum = Number(cycleShare) / 1e2;
    const intervalNum = Number(interval) / 60;
    const tgeNum = Number(tge) / 1e2;
    const unlockDateUTC = new Date(unlockDate)?.toUTCString();

    return {
        amount: amountNum,
        cycle: `${cycleShareNum}% each ${intervalNum} minutes`,
        tge: tgeNum,
        unlockDate: unlockDateUTC,
    };
}

const LockRecord: React.FC<LockRecordProps> = ({ tokenAddress }) => {
    const [currentPageLocker, setCurrentPageLocker] = React.useState(1);
    const [currentPageVesting, setCurrentPageVesting] = React.useState(1);
    const itemsPerPageLocker = 5;
    const itemsPerPageVesting = 5;

    const startIndexLocker = (currentPageLocker - 1) * itemsPerPageLocker;
    const endIndexLocker = startIndexLocker + itemsPerPageLocker;

    const startIndexVesting = (currentPageVesting - 1) * itemsPerPageVesting;
    const endIndexVesting = startIndexVesting + itemsPerPageVesting;

    const { chainId } = useActiveChainId();
    const { data } = useQuery<LockRecordQueryData, OperationVariables>(GET_LOCK_BY_ID, {
        variables: {
            id: tokenAddress,
        },
        context: { chainId },
    });

    const isDataAvailable = data && data?.locks.length > 0;
    if (!isDataAvailable) return null;

    const rows = data && data?.locks?.map((x) => createData(x));
    const lockerRows = rows && rows.filter((x) => !x.tge);
    const vestingRows = rows && rows.filter((x) => x.tge);

    const isLockerDataAvailable = lockerRows?.length > 0;
    const isVestingDataAvailable = vestingRows?.length > 0;

    return (
        <>
            <Typography variant="subtitle2" fontSize={20} ml={4} mb={2} mt={4} fontWeight={600}>
                Lock Records
            </Typography>
            <PrimaryCard py={25} mt={20}>
                <Collapse in={isLockerDataAvailable}>
                    <TableContainer component={Paper} sx={tableContainerStyles}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Unlock time(UTC)</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lockerRows &&
                                    lockerRows
                                        .slice(startIndexLocker, endIndexLocker)
                                        .map((row, id) => (
                                            <TableRow
                                                key={id}
                                                sx={{
                                                    '&:last-child td, &:last-child th': {
                                                        border: 0,
                                                    },
                                                }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.amount.toString()}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.unlockDate.toString()}
                                                </TableCell>
                                                <TableCell component="th" scope="row" align="right">
                                                    <Link
                                                        href={`/token/${tokenAddress?.toLowerCase()}`}
                                                        style={{ color: '#22CDA6' }}
                                                    >
                                                        View
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                <TablePagination
                                    colspan={5}
                                    count={Math.ceil(
                                        (lockerRows?.length || 1) / itemsPerPageLocker,
                                    )}
                                    onChange={(_, page) => setCurrentPageLocker(page)}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Collapse>

                <Collapse in={isVestingDataAvailable}>
                    <TableContainer component={Paper} sx={tableContainerStyles}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Cycle</TableCell>
                                    <TableCell>TGE</TableCell>
                                    <TableCell>Unlock time(UTC)</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vestingRows &&
                                    vestingRows
                                        .slice(startIndexVesting, endIndexVesting)
                                        .map((row, id) => (
                                            <TableRow
                                                key={id}
                                                sx={{
                                                    '&:last-child td, &:last-child th': {
                                                        border: 0,
                                                    },
                                                }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.amount.toString()}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.cycle.toString()}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.tge.toString()}%
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {row.unlockDate}
                                                </TableCell>
                                                <TableCell component="th" scope="row" align="right">
                                                    <Link
                                                        href={`/token/${tokenAddress?.toLowerCase()}`}
                                                        style={{ color: '#22CDA6' }}
                                                    >
                                                        View
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                <TablePagination
                                    colspan={5}
                                    count={Math.ceil(
                                        (vestingRows?.length || 1) / itemsPerPageVesting,
                                    )}
                                    onChange={(_, page) => setCurrentPageVesting(page)}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Collapse>
            </PrimaryCard>
        </>
    );
};

export default LockRecord;
