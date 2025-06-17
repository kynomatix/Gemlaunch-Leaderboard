'use client';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ViewPoolSelect from './Select';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid } from '@mui/material';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import CardSkeleton from './CardLoader';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
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

export default function LoadingTabs() {
    const isMobile = useMediaQuery('(max-width:500px)');
    const [value, setValue] = React.useState(0);
    const { chainId } = useActiveChainId();

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: '#ffffff25' }}>
                <Tabs value={value} centered variant={isMobile ? 'scrollable' : 'standard'}>
                    <Tab
                        label={
                            <Typography
                                textTransform="capitalize"
                                color={value === 0 ? 'primary' : 'common.white'}
                                variant="h5"
                            >
                                All Launchpad
                            </Typography>
                        }
                        {...a11yProps(0)}
                    />
                    <Tab
                        label={
                            <Typography
                                textTransform="capitalize"
                                color={value === 1 ? 'primary' : 'common.white'}
                                variant="h5"
                            >
                                Advanced Mode
                            </Typography>
                        }
                        {...a11yProps(1)}
                    />
                    <Tab
                        label={
                            <Typography
                                textTransform="capitalize"
                                color={value === 2 ? 'primary' : 'common.white'}
                                variant="h5"
                            >
                                My Contributions
                            </Typography>
                        }
                        {...a11yProps(2)}
                    />
                </Tabs>
            </Box>
            <Box
                sx={{
                    mt: '23px',
                    display: 'flex',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: '25px',
                    flexDirection: { xs: 'column', md: 'row' },
                    mb: '30px',
                }}
            >
                <TextField
                    fullWidth
                    placeholder="Enter token name or token symbol"
                    InputProps={{ sx: { borderRadius: '25px', border: '1px solid #7D7D7D' } }}
                />
                <Box
                    sx={{
                        width: { xs: '100%', sm: 'auto' },
                        display: 'flex',
                        alignItems: 'center',
                        gap: '25px',
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    }}
                >
                    <ViewPoolSelect
                        label="Filter by"
                        properties={['All Status', 'Live Status', 'End Status']}
                    />
                    <ViewPoolSelect
                        label="Sort by"
                        properties={['No Filter', 'Time', 'Liquidity']}
                    />
                </Box>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Grid container columnSpacing="20px" rowSpacing="40px">
                    {
                        <Grid item xs={12} md={6} lg={4}>
                            <CardSkeleton />
                        </Grid>
                    }
                </Grid>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Grid container spacing={'20px'}>
                    {
                        <Grid item xs={12} md={6} lg={4}>
                            <CardSkeleton />
                        </Grid>
                    }
                </Grid>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <Grid container spacing={'20px'}>
                    {
                        <Grid item xs={12} md={6} lg={4}>
                            <CardSkeleton />
                        </Grid>
                    }
                </Grid>
            </CustomTabPanel>
        </Box>
    );
}
