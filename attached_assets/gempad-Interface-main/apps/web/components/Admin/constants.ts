import { LaunchPadOrderByInput } from '@/src/gql/graphql';
import { FilterBy, filterByValue, SelectProps, SortBy } from './types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Enable UTC plugin
import { DocumentNode } from 'graphql';
import { GET_ALL_LAUNCHPADS, GET_ALL_LAUNCHPADS_ENDED, GET_ALL_LAUNCHPADS_UPCOMING } from './query';

dayjs.extend(utc);

export const affiliationModalDefaultValues = {
    affiliation: undefined,
};

export const filterByOptions = [
    { id: 1, lab: 'All', val: FilterBy.ALL },
    { id: 2, lab: 'Live', val: FilterBy.LIVE },
    { id: 3, lab: 'Ended', val: FilterBy.ENDED },
    { id: 4, lab: 'Cancelled', val: FilterBy.CANCELLED },
    { id: 5, lab: 'Upcoming', val: FilterBy.UPCOMING },
    // { id: 5, lab: 'Kyc', val: FilterBy.KYC },
] as const satisfies SelectProps['options'];

export const statusFilter: Record<number, filterByValue> = {
    [FilterBy.ALL]: { date: undefined, isCancelled: undefined },
    [FilterBy.LIVE]: { date: dayjs.utc().unix().toString(), isCancelled: false },
    [FilterBy.CANCELLED]: { date: undefined, isCancelled: true },
    [FilterBy.ENDED]: { date: dayjs.utc().unix().toString(), isCancelled: false },
    [FilterBy.UPCOMING]: {
        date: dayjs.utc().unix().toString(),
        isCancelled: false,
    },
};

export const getQueryByFilterAllLaunchpads: Record<number, DocumentNode> = {
    [FilterBy.ALL]: GET_ALL_LAUNCHPADS,
    [FilterBy.LIVE]: GET_ALL_LAUNCHPADS,
    [FilterBy.CANCELLED]: GET_ALL_LAUNCHPADS,
    [FilterBy.ENDED]: GET_ALL_LAUNCHPADS_ENDED,
    [FilterBy.UPCOMING]: GET_ALL_LAUNCHPADS_UPCOMING,
};

export const sortByOptions = [
    { id: 1, lab: 'No Filter', val: SortBy.NONE },
    { id: 2, lab: 'Hardcap', val: SortBy.HARDCAP },
    { id: 2, lab: 'Softcap', val: SortBy.SOFTCAP },
    { id: 2, lab: 'Start Time', val: SortBy.START_TIME },
    { id: 2, lab: 'End Time', val: SortBy.END_TIME },
    { id: 3, lab: 'Liquidity', val: SortBy.LIQUIDITY },
] as const satisfies SelectProps['options'];

export const sortByFilter: Record<number, LaunchPadOrderByInput[]> = {
    [SortBy.NONE]: [LaunchPadOrderByInput.IdAsc],
    [SortBy.HARDCAP]: [LaunchPadOrderByInput.HardCapDesc],
    [SortBy.SOFTCAP]: [LaunchPadOrderByInput.SoftCapDesc],
    [SortBy.START_TIME]: [LaunchPadOrderByInput.StartTimeDesc],
    [SortBy.END_TIME]: [LaunchPadOrderByInput.EndTimeDesc],
};

export const tableContainerStyles = {
    overflowX: 'auto',
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

export const filterWrapper = {
    width: { xs: '100%', sm: 'auto' },
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
    flexWrap: { xs: 'wrap', sm: 'nowrap' },
};

export const searchWrapper = {
    mt: '23px',
    display: 'flex',
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: '25px',
    flexDirection: { xs: 'column', sm: 'row' },
    mb: '30px',
};
