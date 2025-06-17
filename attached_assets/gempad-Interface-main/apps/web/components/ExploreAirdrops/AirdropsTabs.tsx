'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import useMediaQuery from '@mui/material/useMediaQuery';
import AllAirdrops from './AllAirdrops';
import CustomTabPanel from '../CustomTabPanel/CustomTabPanel';
import AirdropsByMe from './AirdropsByMe';
import MyAirdrops from './MyAirdrops';
import TabLabel from '../TabLabel/TabLabel';
import { a11yProps } from '@/utils/a11Props';

export default function AirdropsTabs() {
    const [value, setValue] = React.useState(0);
    const isMobile = useMediaQuery('(max-width:500px)');

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: '#ffffff20' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    centered
                    variant={isMobile ? 'scrollable' : 'standard'}
                >
                    <TabLabel label="All Airdrops" {...a11yProps(0)} />
                    <TabLabel label="My Airdrops" {...a11yProps(1)} />
                    <TabLabel label="Created by You" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <AllAirdrops />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <MyAirdrops />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <AirdropsByMe />
            </CustomTabPanel>
        </Box>
    );
}
