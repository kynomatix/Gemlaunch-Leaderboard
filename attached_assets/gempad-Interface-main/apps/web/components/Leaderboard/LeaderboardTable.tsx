'use client';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import PrimaryCard from '../Cards/PrimaryCard';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import TableCell from '@mui/material/TableCell';

import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

import Link from 'next/link';
import AppPagination from '../AppPagination/AppPagination';
import images from '@/public/assets/images/images';
import Image from 'next/image';
import BadgeAvatars from '../BadgeAvatar/BadgeAvatar';
import { labels, rows, tableContainerStyles } from './constants';
import { LeaderboardTableProps, QueryData, TabPanelProps } from './types';
import CircularProgressWithLabel from './CircularProgress';
import { OperationVariables, useQuery } from '@apollo/client';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { GET_ALL_LAUNCHPADS } from './query';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Enable UTC plugin
import { getLaunchpadRouteByContractName } from '../ViewPool/utils';
import { formatUnits } from 'viem';
import { CHAIN_SYMBOLS, NATIVE_CURRENCY_SYMBOLS } from '@/constants';
import { getWeeksBetween } from './utils';
import { endOfDay } from 'date-fns';
import { getProgress } from '@/utils/getProgress';
import NoData from '../NoData/NoData';
import Row from './Row';
import RowLoader from './RowLoader';

dayjs.extend(utc);

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ launchpads, setLaunchpads }) => {
    const [value, setValue] = React.useState(0);
    const { chainId } = useActiveChainId();

    const date = new Date(2023, 0, 1); // its gonna  be the contract deployment timestamp
    const weeks = getWeeksBetween(date).reverse(); // always gets the latest date

    const { data, loading, refetch, networkStatus } = useQuery<QueryData, OperationVariables>(
        GET_ALL_LAUNCHPADS,
        {
            variables: {
                first: 9,
                after: null,
                orderBy: 'id_ASC',
                startTime: dayjs(weeks[0].startDateOfWeek).unix(),
                endTime: dayjs(weeks[0].endDateOfWeek).unix(),
            },
            context: { chainId },
            fetchPolicy: 'network-only',
        },
    );

    React.useEffect(() => {
        const launchpads = data?.launchPadsConnection?.edges?.map((x) => x?.node);
        setLaunchpads(launchpads);
    }, [data, setLaunchpads]);

    const handleChange = async (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        await refetch({
            startTime: dayjs(weeks[newValue].startDateOfWeek).unix(),
            endTime: dayjs(weeks[newValue].endDateOfWeek).unix(),
        });
    };

    return (
        <PrimaryCard mt={30} mb={100}>
            <Box sx={{ width: '100%', pb: 3 }}>
                <Box
                    sx={{
                        borderBottom: '1px solid #ffffff26',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Tabs variant="scrollable" value={value} onChange={handleChange}>
                        {weeks.map((item, idx) => (
                            <Tab
                                label={
                                    <Typography
                                        textTransform="capitalize"
                                        variant="h5"
                                        color="common.white"
                                    >
                                        {item.week}/{item.year}
                                    </Typography>
                                }
                                {...a11yProps(idx)}
                            />
                        ))}
                    </Tabs>
                    <Box sx={{ borderLeft: '1px solid #ffffff25', pl: '10px' }}>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{ whiteSpace: 'nowrap', px: { xs: '15px', sm: 'auto' } }}
                        >
                            {NATIVE_CURRENCY_SYMBOLS[chainId]}
                        </Button>
                    </Box>
                </Box>

                {weeks.map((item, idx) => (
                    <CustomTabPanel value={value} index={idx}>
                        <TableContainer sx={tableContainerStyles} component={Paper}>
                            <Table sx={{ minWidth: 650, width: '100%' }}>
                                <TableBody>
                                    {launchpads &&
                                        !loading &&
                                        launchpads.map((lp, idx) => {
                                            const investedAmount = +formatUnits(
                                                lp.investedAmount,
                                                lp.fundToken.decimals,
                                            );
                                            const totalAmount = +formatUnits(
                                                lp.name === 'Fairlaunch' ? lp.softCap : lp.hardCap,
                                                lp.fundToken.decimals,
                                            );

                                            return (
                                                <Row
                                                    idx={idx}
                                                    investedAmount={investedAmount}
                                                    lp={lp}
                                                    totalAmount={totalAmount}
                                                    key={idx}
                                                />
                                            );
                                        })}

                                    {loading && (
                                        <>
                                            {[1, 2, 3, 4, 5].map((x) => (
                                                <RowLoader key={x} />
                                            ))}
                                        </>
                                    )}

                                    {!launchpads?.length && !loading && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                sx={{
                                                    pt: '20px',
                                                    pb: '10px',
                                                    borderBottom: 'none',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <NoData msg="No Data" />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CustomTabPanel>
                ))}
            </Box>
        </PrimaryCard>
    );
};

export default LeaderboardTable;
