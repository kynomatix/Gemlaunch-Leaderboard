import { LaunchPadOrderByInput } from '@/src/gql/graphql';
import { FilterBy, filterByValue, SelectProps, SortBy } from './types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Enable UTC plugin
import { DocumentNode } from 'graphql';
import {
    GET_ALL_LAUNCHPADS,
    GET_ALL_LAUNCHPADS_ENDED,
    GET_ALL_LAUNCHPADS_UPCOMING,
    GET_MY_LAUNCHPADS,
    GET_MY_LAUNCHPADS_ENDED,
} from './query';
import { getCurrentTimeDayjs } from '@/utils/getCurrentTimeDayjs';

dayjs.extend(utc);

export const affiliationModalDefaultValues = {
    affiliation: undefined,
};

export const whitelistModalPlaceholder =
    'Insert addresses: \nseparate with breaks line. \nEx: \n0x0A6aD098F65C048d1aa263d38eA174e781ae6899\n0x0A6aD098F65C048d1aa263d38eA174e781ae6899\n0x0A6aD098F65C048d1aa263d38eA174e781ae6899';

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
    [FilterBy.LIVE]: { date: getCurrentTimeDayjs, isCancelled: false },
    [FilterBy.CANCELLED]: { date: undefined, isCancelled: true },
    [FilterBy.ENDED]: { date: getCurrentTimeDayjs, isCancelled: false },
    [FilterBy.UPCOMING]: {
        date: getCurrentTimeDayjs,
        isCancelled: false,
    },
    // [FilterBy.KYC]: { date: undefined, isCancelled: undefined, isKyc: true },
};

export const getQueryByFilterAllLaunchpads: Record<number, DocumentNode> = {
    [FilterBy.ALL]: GET_ALL_LAUNCHPADS,
    [FilterBy.LIVE]: GET_ALL_LAUNCHPADS,
    [FilterBy.CANCELLED]: GET_ALL_LAUNCHPADS,
    [FilterBy.ENDED]: GET_ALL_LAUNCHPADS_ENDED,
    [FilterBy.UPCOMING]: GET_ALL_LAUNCHPADS_UPCOMING,
    // [FilterBy.KYC]: GET_ALL_LAUNCHPADS_UPCOMING,
};

export const getQueryByFilterMyLaunchpads: Record<number, DocumentNode> = {
    [FilterBy.ALL]: GET_MY_LAUNCHPADS,
    [FilterBy.LIVE]: GET_MY_LAUNCHPADS,
    [FilterBy.CANCELLED]: GET_MY_LAUNCHPADS,
    [FilterBy.ENDED]: GET_MY_LAUNCHPADS_ENDED,
    [FilterBy.UPCOMING]: GET_ALL_LAUNCHPADS_UPCOMING,
    // [FilterBy.KYC]: GET_MY_LAUNCHPADS_ENDED,
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
    [SortBy.NONE]: [LaunchPadOrderByInput.CreatedAtDesc],
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

export const questions = [
    {
        id: 1,
        question: 'What is KYC ?',
        answer: 'Know Your Customer (KYC) is a process whereby the project owner has shared their identification documents with Gemlaunch. KYC is used as a deterrent method to reduce illicit and deceptive behaviour. More information about KYC can be found on the Binance Academy website via:https://academy.binance.com/en/glossary/know-your-customer',
    },
    {
        id: 2,
        question: 'What is an Audit?',
        answer: 'The Audit badge details that the smart contract has been tested and analysed by a 3rd party service. Information about security audits can be seen via the Binance Academy:https://academy.binance.com/en/glossary/security-audit',
    },
    {
        id: 3,
        question: 'What is SAFU?',
        answer: 'The SAFU badge demonstrates that the contract has been created by a Gemlaunch verified partner.',
    },
    {
        id: 4,
        question: 'What is Doxx?',
        answer: 'Projects certified with the Doxx badge highlights that the projects owner has completed a video AMA within their community, and that their submission to Gemlaunch matches their KYC information.',
    },
    {
        id: 5,
        question: 'What is DYOR?',
        answer: 'DYOR aims to reduce the number of uninformed investors in cryptocurrency. It encourages them to research and understand a cryptocurrency before investing so that they can answer precisely why they are buying that currency and supporting that project. The term is also often used as a disclaimer when cryptocurrency traders and enthusiasts make public posts or share their market analyses on social media platforms.',
    },
];

export const Labels = {
    tokenAddress: 'Token Address',
    logoUrl: 'Logo Url',
    websiteUrl: 'Website Url',
    facebookUrl: 'Facebook Url',
    twitterUrl: 'Twitter Url',
    githubUrl: 'Github Url',
    telegramUrl: 'Telegram Url',
    redditUrl: 'Reddit Url',
    youtubeUrl: 'Youtube Url',
    description: 'description',
};
