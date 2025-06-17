// import icons
import Website from 'public/assets/icons/website-icon.svg';
import Discord from 'public/assets/icons/discord-icon.svg';
import Github from 'public/assets/icons/github-icon.svg';
import Twitter from 'public/assets/icons/twitter-icon.svg';
import Telegram from 'public/assets/icons/telegram-icon.svg';
import Youtube from 'public/assets/icons/youtube-icon.svg';
import { ExtraInformation, FilterBy, SelectProps, SortBy } from './types';
import { PrivateSaleOrderByInput } from '@/src/gql/graphql';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Enable UTC plugin=
import {
    GET_ALL_PRIVATE_SALE,
    GET_ALL_PRIVATE_SALE_ENDED,
    GET_ALL_PRIVATE_SALE_UPCOMING,
    GET_MY_CONTRIBUTION_PRIVATE_SALE,
    GET_MY_CONTRIBUTION_PRIVATE_SALE_ENDED,
    GET_MY_CONTRIBUTION_PRIVATE_SALE_UPCOMING,
    GET_MY_PRIVATE_SALE,
    GET_MY_PRIVATE_SALE_ENDED,
    GET_MY_PRIVATE_SALE_UPCOMING,
} from './query';
import { DocumentNode } from 'graphql';
import { getCurrentTimeDayjs } from '@/utils/getCurrentTimeDayjs';

dayjs.extend(utc);

export const socialIcons = [Website, Telegram, Github, Youtube, Twitter, Discord];

export const antibotModeMessage =
    'With this option you can control who can contribute to the pool. Only Users who hold a minimum amount of tokens you suggest would be able to contribute';

export const whitelistModalPlaceholder =
    'Insert addresses: \nseparate with breaks line. \nEx: \n0x0A6aD098F65C048d1aa263d38eA174e781ae6899\n0x0A6aD098F65C048d1aa263d38eA174e781ae6899\n0x0A6aD098F65C048d1aa263d38eA174e781ae6899';

export const whitelistStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    borderBottom: '1px solid #ffffff25',
    pb: '9px',
    mt: '15px',
    flexWrap: 'wrap',
};

export const selecStyles = {
    width: '100%',
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#22CDA6',
    },
    '.MuiSvgIcon-root ': {
        fill: 'white !important',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
    },
    '& .SelectOptionsDropDown::placeholder': {
        color: 'red',
    },
};

export const filterByOptions = [
    { id: 1, lab: 'All', val: FilterBy.ALL },
    { id: 2, lab: 'Live', val: FilterBy.LIVE },
    { id: 3, lab: 'Ended', val: FilterBy.ENDED },
    { id: 4, lab: 'Cancelled', val: FilterBy.CANCELLED },
    { id: 5, lab: 'Upcoming', val: FilterBy.UPCOMING },
] as const satisfies SelectProps['options'];

export const sortByOptions = [
    { id: 1, lab: 'No Filter', val: SortBy.NONE },
    { id: 2, lab: 'Hardcap', val: SortBy.HARDCAP },
    { id: 2, lab: 'Softcap', val: SortBy.SOFTCAP },
    { id: 2, lab: 'Start Time', val: SortBy.START_TIME },
    { id: 2, lab: 'End Time', val: SortBy.END_TIME },
    { id: 3, lab: 'Liquidity', val: SortBy.LIQUIDITY },
] as const satisfies SelectProps['options'];

export const sortByFilter: Record<number, PrivateSaleOrderByInput[]> = {
    [SortBy.NONE]: [PrivateSaleOrderByInput.CreatedAtDesc],
    [SortBy.HARDCAP]: [PrivateSaleOrderByInput.HardcapDesc],
    [SortBy.SOFTCAP]: [PrivateSaleOrderByInput.SoftcapDesc],
    [SortBy.START_TIME]: [PrivateSaleOrderByInput.StartTimeDesc],
    [SortBy.END_TIME]: [PrivateSaleOrderByInput.EndTimeDesc],
    [SortBy.LIQUIDITY]: [PrivateSaleOrderByInput.DepositedAmountDesc],
};

export const statusFilter: Record<
    number,
    { date: () => string | undefined; isCancelled: boolean }
> = {
    [FilterBy.ALL]: { date: undefined, isCancelled: undefined },
    [FilterBy.LIVE]: { date: getCurrentTimeDayjs, isCancelled: false },
    [FilterBy.CANCELLED]: { date: undefined, isCancelled: true },
    [FilterBy.ENDED]: { date: getCurrentTimeDayjs, isCancelled: false },
    [FilterBy.UPCOMING]: { date: getCurrentTimeDayjs, isCancelled: false },
};

export const getQueryByFilterAllPrivateSale: Record<number, DocumentNode> = {
    [FilterBy.ALL]: GET_ALL_PRIVATE_SALE,
    [FilterBy.LIVE]: GET_ALL_PRIVATE_SALE,
    [FilterBy.CANCELLED]: GET_ALL_PRIVATE_SALE,
    [FilterBy.ENDED]: GET_ALL_PRIVATE_SALE_ENDED,
    [FilterBy.UPCOMING]: GET_ALL_PRIVATE_SALE_UPCOMING,
};
export const getQueryByFilterMyPrivateSale: Record<number, DocumentNode> = {
    [FilterBy.ALL]: GET_MY_PRIVATE_SALE,
    [FilterBy.LIVE]: GET_MY_PRIVATE_SALE,
    [FilterBy.CANCELLED]: GET_MY_PRIVATE_SALE,
    [FilterBy.ENDED]: GET_MY_PRIVATE_SALE_ENDED,
    [FilterBy.UPCOMING]: GET_MY_PRIVATE_SALE_UPCOMING,
};
export const getQueryByFilterMyContribution: Record<number, DocumentNode> = {
    [FilterBy.ALL]: GET_MY_CONTRIBUTION_PRIVATE_SALE,
    [FilterBy.LIVE]: GET_MY_CONTRIBUTION_PRIVATE_SALE,
    [FilterBy.CANCELLED]: GET_MY_CONTRIBUTION_PRIVATE_SALE,
    [FilterBy.ENDED]: GET_MY_CONTRIBUTION_PRIVATE_SALE_ENDED,
    [FilterBy.UPCOMING]: GET_MY_CONTRIBUTION_PRIVATE_SALE_UPCOMING,
};
