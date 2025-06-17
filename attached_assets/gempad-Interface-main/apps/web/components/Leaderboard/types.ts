import { LaunchPad, LaunchPadsConnection } from '@/src/gql/graphql';
import React from 'react';

export interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export interface QueryData {
    launchPadsConnection: LaunchPadsConnection;
}

export interface Week {
    year: number;
    week: number;
    startDateOfWeek: string;
    endDateOfWeek: string;
}

export interface LeaderboardTableProps {
    launchpads: LaunchPad[];
    setLaunchpads: React.Dispatch<React.SetStateAction<LaunchPad[]>>;
}

export interface LeaderboardStatsProps {
    launchpads: LaunchPad[];
    raisedContribution: number;
}

export interface TableRowProps {
    lp: LaunchPad;
    totalAmount: number;
    investedAmount: number;
    idx: number;
}
