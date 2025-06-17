'use client';

import { Button } from '@mui/material';

import AppStatsCard from '@/components/AppStatsCard/AppStatsCard';

const Page = () => {
    return (
        <div
            style={{
                marginLeft: '54px',
                padding: '200px',
            }}
        >
            <Button variant="contained">Test</Button>
            <Button variant="outlined">Test</Button>
            <Button variant="text">Test</Button>
            {/* <StatsCard title={'Tredning'} value={'100k'} Icon={Stats} /> */}
            <AppStatsCard title="Title" value="value" />
            {/* <Header /> */}
        </div>
    );
};

export default Page;
