import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    Avatar,
    AvatarGroup,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useMediaQuery,
} from '@mui/material';
import { StaticImageData } from 'next/image';
import { shortenAddress } from '@/utils/format';
import Link from 'next/link';
import AppPagination from '../AppPagination/AppPagination';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export interface TableProps {
    lockId: string;
    tokenAddress: string;
    urlToken0: StaticImageData;
    urlToken1?: StaticImageData;
    tokenName: string;
    tokenSymbol: string;
    amount: string;
    owner: string;
}

interface Props {
    rows: TableProps[];
    isLpToken: boolean;
    baseRoute: string;
    limit: number;
    refetch: any;
}

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
                <Box sx={{ p: 3 }}>
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

export default function TokensTabs({ rows, isLpToken, baseRoute, limit, refetch }: Props) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    sx={{
                        position: 'absolute',
                        right: '22px',
                    }}
                >
                    <Tab
                        label={
                            <Typography
                                color="common.white"
                                variant="h5"
                                sx={{ textTransform: 'capitalize' }}
                            >
                                All
                            </Typography>
                        }
                        {...a11yProps(0)}
                    />
                    <Tab
                        label={
                            <Typography
                                color="common.white"
                                variant="h5"
                                sx={{ textTransform: 'capitalize' }}
                            >
                                My Locks
                            </Typography>
                        }
                        {...a11yProps(1)}
                    />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}></CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                Item Two
            </CustomTabPanel>
        </Box>
    );
}
