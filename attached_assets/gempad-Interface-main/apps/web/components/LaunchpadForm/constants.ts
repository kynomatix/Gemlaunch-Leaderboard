import {
    LaunchpadAffiliateProgram,
    LaunchpadCurrencies,
    LaunchpadFormInput,
    LaunchpadWhitelist,
    ListingOptions,
    RefundType,
} from '@/components/LaunchpadForm/types';
import { ChainId } from '@dapp/chains';
import { zeroAddress } from 'viem';

export const buybackDetails = [
    { id: 1, prop: 'Amount Per Buyback', val: '0.001 BNB' },
    { id: 2, prop: 'Min Buyback Delay', val: '1 minutes' },
    { id: 3, prop: 'Max Buyback Delay', val: '5 minutes' },
];

export const CURRENCY_DECIMALS = {
    [LaunchpadCurrencies.NATIVE]: 18,
    [LaunchpadCurrencies.BUSD]: 18,
    // [LaunchpadCurrencies.USDC]: 6,
    // [LaunchpadCurrencies.USDT]: 6,
    //@todo confirm addresses and decimals for bsc mainnet
    [LaunchpadCurrencies.USDC]: 18,
    [LaunchpadCurrencies.USDT]: 18,
};

export const CURRENCY_ADDRESSES = {
    [LaunchpadCurrencies.NATIVE]: {
        [ChainId.ETHEREUM]: zeroAddress,
        [ChainId.GOERLI]: zeroAddress,
        [ChainId.BSC_TESTNET]: zeroAddress,
        [ChainId.BSC]: zeroAddress,
        [ChainId.FANTOM_TESTNET]: zeroAddress,
    },
    [LaunchpadCurrencies.USDT]: {
        [ChainId.GOERLI]: '0x509Ee0d083DdF8AC028f2a56731412edD63223B9',
        [ChainId.BSC_TESTNET]: '0xAf4DB11839dD39fB4715d8942aA2EC72a842e648',
        [ChainId.BSC]: '0x55d398326f99059fF775485246999027B3197955',
        [ChainId.FANTOM_TESTNET]: '0x7d43AABC515C356145049227CeE54B608342c0ad',
    },
    [LaunchpadCurrencies.USDC]: {
        [ChainId.GOERLI]: '0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557',
        [ChainId.BSC_TESTNET]: '0xB12a6f31F80405cAe7fC11499F53EDBeC237b65C',
        [ChainId.BSC]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        [ChainId.FANTOM_TESTNET]: '0xE8285aF1ff92606a8e0261FC959E88d66C009704',
    },
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

export const GEMPAD_FAIRLAUNCH = 'GempadFairLaunch';
export const GEMPAD_LAUNCHPAD = 'GempadLaunchpad';
export const GEMPAD_DUTCH = 'GempadDutchAuction';
export const GEMPAD_SUBSCRIPTION = 'GempadSubscriptionPool';

export const Labels = {
    logoUrl: 'Logo Url',
    websiteUrl: 'Website Url',
    facebookUrl: 'Facebook Url',
    twitterUrl: 'Twitter Url',
    githubUrl: 'Github Url',
    telegramUrl: 'Telegram Url',
    redditUrl: 'Reddit Url',
    youtubeUrl: 'Youtube Url',
    description: 'description',
    minBuy: 'Min Buy',
    maxBuy: 'Max Buy',
    softcap: 'Softcap',
    hardcap: 'Hardcap',
    presaleRate: 'Presale Rate',
    totalSellingAmount: 'Total Selling Amount',
    refundType: 'Refund Type',
    startPrice: 'Start Price',
    endPrice: 'End Price',
    maxContribution: 'Max Contribution',
    minContribution: 'Min Contribution',
};

export const DEFAULT_VALUES: Partial<LaunchpadFormInput> = {
    tokenAddress: undefined,
    currency: LaunchpadCurrencies.NATIVE,
    affiliateProgram: LaunchpadAffiliateProgram.DISABLED,
    totalSellingAmount: undefined,
    softcap: undefined,
    isMaxContribution: false,
    maxContribution: undefined,
    whitelist: LaunchpadWhitelist.DISABLED,
    isEnableBuyback: false,
    buybackPercent: 0,
    liquidity: undefined, //  default undefined
    router: zeroAddress, //  default undefined
    startTime: undefined,
    endTime: undefined,
    logoUrl: undefined,
    websiteUrl: undefined,
    facebookUrl: undefined,
    twitterUrl: undefined,
    githubUrl: undefined,
    telegramUrl: undefined,
    redditUrl: undefined,
    youtubeUrl: undefined,
    description: undefined,
    listingOptions: ListingOptions.AUTO,
    presaleRate: undefined,
    hardcap: undefined,
    minBuy: undefined,
    maxBuy: undefined,
    refundType: RefundType.BURN,
    listingRate: undefined,
    isVestingActive: false,
    releasePresale: undefined,
    vestingPeriod: undefined,
    presaleTokenRelease: undefined,
    cycle: undefined,
    cycleReleasePercent: undefined,
    tgeReleasePercent: undefined,
    decreasePriceCycle: undefined,
    affiliatePercentage: undefined,
    minContribution: undefined,
    endPrice: undefined,
    liquidityLockup: undefined, // default undefined
    startPrice: undefined,
    hardcapTokensPerUser: undefined,
    subscriptionRate: undefined,
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
