import { Currency, Whitelist } from './types';

export const Labels = {
    title: 'Title',
    softCap: 'SoftCap',
    hardCap: 'HardCap',
    maxBuy: 'Max Buy',
    minBuy: 'Min Buy',
    startTime: 'Start Time',
    endTime: 'End Time',
    firstFundRelease: 'First fund release',
    vestingPeriodEachCycle: 'Vesting period each cycle',
    cycleReleasePercent: ' Cycle release percent',
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

export const DEFAULTS = {
    title: undefined,
    currency: Currency.NATIVE,
    whitelist: Whitelist.DISABLE,
    softCap: undefined,
    hardCap: undefined,
    minBuy: undefined,
    maxBuy: undefined,
    startTime: undefined,
    endTime: undefined,
};

export const STEPS = [
    { label: 'Verify Token', desc: 'Enter the token address and verify' },
    {
        label: 'DeFi Launchpad Info',
        desc: 'Enter the launchpad information that you want to raise, that should be enter all details about your presale',
    },
    { label: 'Add Additional Info', desc: 'Let people know who you are' },
    { label: 'Finish', desc: 'Review your information' },
];

export const SERVICE_NAME = 'GempadPrivateSale';
