'use client';

import React from 'react';
import LeaderboardStats from '@/components/Leaderboard/LeaderboardStats';
import LeaderboardTable from '@/components/Leaderboard/LeaderboardTable';
import { LaunchPad } from '@/src/gql/graphql';
import { Box } from '@mui/material';
import { zeroAddress } from 'viem';
import useCalculateRaisedContribution from '@/hooks/useCalculateRaisedContribution';

function useTotalInvestment(launchpads: LaunchPad[] | undefined, symbol: string): bigint {
    return launchpads
        ?.filter((x) => x.fundToken.symbol === symbol)
        .map((x) => BigInt(x.investedAmount))
        .reduce((acc, x) => acc + x, BigInt(0));
}
function useNativeTotalInvestment(launchpads: LaunchPad[] | undefined): bigint {
    return launchpads
        ?.filter((x) => x.fundToken.isNative)
        .map((x) => BigInt(x.investedAmount))
        .reduce((acc, x) => acc + x, BigInt(0));
}

export default function Leaderboard({ data }: { data: any }) {
    const [launchpads, setLaunchpads] = React.useState<LaunchPad[]>();

    const nativeInvestment = useNativeTotalInvestment(launchpads);
    const usdcInvestment = useTotalInvestment(launchpads, 'USDC');
    const usdtInvestment = useTotalInvestment(launchpads, 'USDT');

    const { raisedContribution } = useCalculateRaisedContribution(
        nativeInvestment,
        usdcInvestment,
        usdtInvestment,
        data,
    );

    return (
        <Box>
            <LeaderboardStats launchpads={launchpads} raisedContribution={raisedContribution} />
            <LeaderboardTable launchpads={launchpads} setLaunchpads={setLaunchpads} />
        </Box>
    );
}
