import { ChainId } from '@dapp/chains';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import localFont from 'next/font/local';
import Admin from 'public/assets/icons/admin.svg';
import Airdrop from 'public/assets/icons/airdrop.svg';
import AntiBot from 'public/assets/icons/anti-bot.svg';
import Branding from 'public/assets/icons/branding.svg';
import Community from 'public/assets/icons/community.svg';
import CreateToken from 'public/assets/icons/create-token.svg';
import Customization from 'public/assets/icons/customization.svg';
import Deflationary from 'public/assets/icons/deflationary.svg';
import Docs from 'public/assets/icons/docs.svg';
import exchange from 'public/assets/icons/exchange.svg';
import Home from 'public/assets/icons/home.svg';
import Launchpad from 'public/assets/icons/launchpad-card.svg';
import launchpad from 'public/assets/icons/launchpad.svg';
import Leaderboard from 'public/assets/icons/leaderboard.svg';
import Lock from 'public/assets/icons/lock.svg';
import Locking from 'public/assets/icons/locking.svg';
import Management from 'public/assets/icons/management.svg';
import MultiSender from 'public/assets/icons/multi-sender.svg';
import PrivateSale from 'public/assets/icons/private-sale.svg';
import Socials from 'public/assets/icons/socials.svg';
import Standard from 'public/assets/icons/standard.svg';
import { Address } from 'viem';
import { bsc, bscTestnet, fantomTestnet, goerli } from 'wagmi/chains';
import images from '../public/assets/images/images';
import { Currency } from './types';

export const Gilroy = localFont({
    src: '../public/assets/fonts/Gilroy-Light.otf',
    display: 'swap',
});
export const GilroyBold = localFont({
    src: '../public/assets/fonts/Gilroy-ExtraBold.otf',
    display: 'swap',
});
export const NeueMachina = localFont({
    src: '../public/assets/fonts/NeueMachina-Regular.otf',
    display: 'swap',
});

export interface Router {
    name: string;
    address: string;
}

export interface Pair {
    name: string;
    addr: string;
}

export const DefaultGasLimit: bigint = 250000n;
// export const DEFAULT_CHAIN_ID = bscTestnet.id; // TODO: Need to update it
export const DEFAULT_CHAIN_ID = bsc.id; // TODO: Need to update it
export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

const routersGoerli: Router[] = [
    { name: 'Uniswap', address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' },
    { name: 'Gemlaunch V2', address: '0x69779a3eE3cc93d4ABB5e4d8880BBd0c17C3EB09' },
];
const routersBinance: Router[] = [
    { name: 'Pancake Swap', address: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3' },
    { name: 'Gemlaunch V2', address: '0xaB32C8cf615902514EDE3DA6ae6a789f6a610350' },
];
const routersFantomTestnet: Router[] = [
    { name: 'Uniswap', address: '0xa6AD18C2aC47803E193F75c3677b14BF19B94883' },
];
const routersBinanceMainnet: Router[] = [
    { name: 'Pancake Swap', address: '0x10ED43C718714eb63d5aA57B78B54704E256024E' },
    { name: 'Gemlaunch V2', address: '0x25E0A7D7C4AEd41b6DFaDe16f4115530AC9000BD' },
];

export const ROUTERS: Record<number, Router[]> = {
    [goerli.id]: routersGoerli,
    [bscTestnet.id]: routersBinance,
    [bsc.id]: routersBinanceMainnet,
    [fantomTestnet.id]: routersFantomTestnet,
};

const uniswap = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const gemlaunchGoerli = '0x69779a3eE3cc93d4ABB5e4d8880BBd0c17C3EB09';
// const pancake = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
const pancake = '0x10ED43C718714eb63d5aA57B78B54704E256024E'; //bsc mainnet pancake router v2.0
// const gemlaunchBSC = '0xaB32C8cf615902514EDE3DA6ae6a789f6a610350'; // testnet @todo replace and use carefully for mainnet
const gemlaunchBSCMainnet = '0x25E0A7D7C4AEd41b6DFaDe16f4115530AC9000BD'; // mainnet

export const PAIR_TOKENS: Record<Address, any> = {
    [uniswap]: [{ name: 'ETH', addr: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6' }],
    [gemlaunchGoerli]: [{ name: 'ETH', addr: '0x1b1a7505C79A56Bf67101EcFDCcDA83d2E6FB117' }],
    // [pancake]: [{ name: 'BNB', addr: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd' }],
    [pancake]: [{ name: 'BNB', addr: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' }], //bsc mainnet
    // [gemlaunchBSC]: [{ name: 'BNB', addr: '0x937741f286294d65C2FfFA93d82675248101FcA8' }], // testnet
    [gemlaunchBSCMainnet]: [{ name: 'BNB', addr: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' }], // mainnet
};

export const ROUTER_NAME_BY_ADDRESS_CHAIN_ID = {
    [ChainId.BSC_TESTNET]: {
        '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3': 'PancakeRouter',
        '0xaB32C8cf615902514EDE3DA6ae6a789f6a610350': 'GempadV2Router02',
    },
    [ChainId.GOERLI]: {
        '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D': 'UniswapV2Router02',
    },
    [ChainId.BSC]: {
        '0x10ED43C718714eb63d5aA57B78B54704E256024E': 'PancakeRouter',
        '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D': 'UniswapV2Router02',
    },
};

// export const ROUTER_NAME_BY_ADDRESS = {
//     "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3": "PancakeRouter", // lowercase
//     "0xaB32C8cf615902514EDE3DA6ae6a789f6a610350": "GempadV2Router02", // lowercase
//     "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D": "GempadV2Router02" // lowercase
// }

// @todo
export const SUBSQUID_URLS: Record<number, string> = {
    [goerli.id]: 'https://api.gemlaunch.io/graphql',
    [bscTestnet.id]: 'https://api.gemlaunch.io/graphql',
    // [bscTestnet.id]: 'http://62.72.24.17:4000/graphql',
    [fantomTestnet.id]: 'https://api.gemlaunch.io/graphql',
    [bsc.id]: 'https://api.gemlaunch.io/graphql', 
    // [bsc.id]: 'http://86.38.204.58:4000/graphql', // @todo change once domain is attached
};

// export const SUBSQUID_URLS: Record<number, string> = {
//     [goerli.id]: 'http://localhost:4350/graphql',
//     [bscTestnet.id]: 'http://localhost:4350/graphql',
//     [fantomTestnet.id]: 'http://localhost:4350/graphql',
// };

export enum LaunchpadServiceName {
    GEMPAD_LAUNCHPAD = 'GempadLaunchpad',
    GEMPAD_DUTCH_AUCTION = 'GempadDutchAuction',
}

export const GEM_TOKEN_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x83381961c7f0472F0B1ed1dd314E863ec01e828c',
    [bscTestnet.id]: '0x83381961c7f0472F0B1ed1dd314E863ec01e828c',
    [bsc.id]: '0xabf26aaD437c3b647885b066f6EEc5373aE977bf',
    [fantomTestnet.id]: '0x83381961c7f0472F0B1ed1dd314E863ec01e828c',
};

export const TOKEN_FACTORY_MANAGER_CONTRACT_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x8C81db60B98c28d270559B3C0A6f131eaad77318',
    [bscTestnet.id]: '0xfc3f631C16dAeAf1135Eb56fd0612735e64d463D',
    [bsc.id]: '0x13bD166b64c8b5606C5a0860ea9692462738d3aF',
    [fantomTestnet.id]: '0x1DA9730E3807C44d27443F7c43dcF5F90ad76a62',
};

export const STANDARD_TOKEN_FACTORY_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0xD9723381f53B3792f04d611719732A3FfcBf95C5', // Ethereum testnet
    [bscTestnet.id]: '0x2124479Cae74bDde24816794e48312D58DA2F82d',
    [bsc.id]: '0x821D482aD54D789aa14B3C467Dc5Cd7a850319e8',
    [fantomTestnet.id]: '0xA19f8919eb220836eae44dF9a0B7C40089102FD1',
};

export const LIQUIDITY_GENERATOR_TOKEN_CONTRACT_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x00295c2140dfC456Db8b3f3b01BF381AD3906Fc2', // Ethereum testnet
    [bscTestnet.id]: '0x1D38dCE9c2B602D869eB17557FD4425C8ECE2BA0',
    [bsc.id]: '0x8A9e700C9e213e921009D772D4aFBf1cBE34c003',
    [fantomTestnet.id]: '0x44fC1596a1aA5c0D0123100A126D73Ce8F07B146',
};

export const BABY_TOKEN_CONTRACT_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x9d3288638EF704B3C1295F9dacac00be6Bc8D948', // Ethereum testnet
    [bscTestnet.id]: '0xA99374d1702Ea1B703d04E99178134e5ed2cDA53',
    [bsc.id]: '0xcc1207136E4fCF219270d393dbE3D83978E03c27',
    [fantomTestnet.id]: '0xBaAF5100d9A4C3C18f80bac01Ad863Ef8F1df7AF',
};

export const BUYBACK_BABY_TOKEN_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x11Ef7F2DbbFEEeF629669f46422808E449cAe17D', // Ethereum testnet
    [bscTestnet.id]: '0x14304c3a48c8affF7C76dF6C72BbDC405712e42d',
    [bsc.id]: '0x0dD4c871520fd8cb5bbd34896547885572929301',
    [fantomTestnet.id]: '0x414e494C0ffC973a4911742cd178934F1A6DF97B',
};

// INFO: This is only for baby token
export const BABY_TOKEN_DIVIDEND_TRACKERS_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x7fDd5B2e0EDA09174aF68397FD021c6E7f2B7531', // Ethereum testnet
    [bscTestnet.id]: '0x1B0AD463c87989C8dd77b7245BC4fcE16fADbb3A',
    [bsc.id]: '0x63Ae8ab2ABD37e308F2Eb975A3BAf5Be2C5A0AeA',
    [fantomTestnet.id]: '0x68A9FbDfab50B0B4F9D55Bdd9db633788BC8cE67',
};

// TODO: This is going to be changed for buybackbaby token
export const REWARD_TOKEN_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x6c01c93E6D707274f4f7A6cd7dA1AC9A1Ca0f280', // Ethereum testnet
    [bscTestnet.id]: '0x83381961c7f0472F0B1ed1dd314E863ec01e828c', // GemToken
    [bsc.id]: '0xabf26aaD437c3b647885b066f6EEc5373aE977bf', // GemToken
    [fantomTestnet.id]: '0x6Ef5d53A33b3E356B752a3F7789e880EC1C39611',
};

export const ANTIBOT_STANDARD_TOKEN_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x79369DaD3D5E6e4F371Cfe48FDC088A80C6d68EA', // Ethereum testnet
    [bscTestnet.id]: '0x0fE9Baa4d3B6e438FFaf9aEf98e601AeEC32fc81',
    [bsc.id]: '0xaB7482a682cc51f39aEF6Fb6dBA636d94391575F',
    [fantomTestnet.id]: '0x77350a508dDcD98E06b95d5ddB8f0F5b6BEb9B2E',
};

export const ANTIBOT_LIQUIDITY_GENERATOR_TOKEN_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0xBd92982b53488933DFD1B402ca4b71DC6d9789d3', // Ethereum testnet
    [bscTestnet.id]: '0xcfeac0DD6Aa05FEa3F98a406476D634e99188080',
    [bsc.id]: '0x1ffbe4260065B585d948FE76862D397D0920887e',
    [fantomTestnet.id]: '0xE04a168972731F7225E10950070E8D1fBc8C776c',
};

export const ANTIBOT_BABY_TOKEN_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x8b48B3b6b9C6035dF682158cEfEea378b26fE034', // Ethereum testnet
    [bscTestnet.id]: '0x684B21a353bFD4c3f98564b5AdB9AEf831A591F8',
    [bsc.id]: '0xF89d978c4884C67Dc790E5270990Fd8af23B5c53',
    [fantomTestnet.id]: '0x02987c2E224Ef99A54C7d76E00159851E9759DCE',
};

export const ANTIBOT_BUYBACK_BABY_TOKEN_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x660b65eFF3592a9BA1947b8d30877DF0F3190Be1', // Ethereum testnet
    [bscTestnet.id]: '0xE21f5Ffc4a72D5d4c8069521d98bCFD94D70bF74',
    [bsc.id]: '0x4262CdF06D8D5E6D526ec6494Bf115077BBFDd0C',
    [fantomTestnet.id]: '0xcb3CC7Acbe460B38dFF98497253b4fc1B82EBea8',
};

export const LOCKER_CONTRACT_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x77350a508dDcD98E06b95d5ddB8f0F5b6BEb9B2E',
    [bscTestnet.id]: '0xD7bEf1D72417019597764209514FFB71DF1a868E',
    [bsc.id]: '0xfB804475f9448f67a166BC3c47466d74C517FFA5',
    [fantomTestnet.id]: '0x9D15134f188e98BCd5F5053A864D88CfCBb1ce36',
};

export const NATIVE_CURRENCY_ADDRESSES: Record<number, string> = {
    [goerli.id]: ADDRESS_ZERO,
    [bscTestnet.id]: ADDRESS_ZERO,
    [bsc.id]: ADDRESS_ZERO,
    [fantomTestnet.id]: ADDRESS_ZERO,
};

//@todo confirm
export const USDT_CURRENCY_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x56358CE5970587Bc2fbc2678Ad8C4a1dc2aBd26f', // Ethereum testnet
    [bscTestnet.id]: '0xAf4DB11839dD39fB4715d8942aA2EC72a842e648',
    [bsc.id]: '0x55d398326f99059fF775485246999027B3197955',
    [fantomTestnet.id]: '0x56358CE5970587Bc2fbc2678Ad8C4a1dc2aBd26f',
};
//@todo confirm
export const USDC_CURRENCY_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x56358CE5970587Bc2fbc2678Ad8C4a1dc2aBd26f', // Ethereum testnet
    [bscTestnet.id]: '0xB12a6f31F80405cAe7fC11499F53EDBeC237b65C',
    [bsc.id]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    [fantomTestnet.id]: '0x56358CE5970587Bc2fbc2678Ad8C4a1dc2aBd26f',
};

export const FAIRLAUNCH_CONTRACT_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0xb2cda8027519fF0F708A03056115f32eead702f1', // Ethereum testnet
    [bscTestnet.id]: '0xA8B9616F6f8A9191404d63976307da0e80DA9E0B', // updated contract
    [bsc.id]: '0x5F72e3204b569Fe2f521f815Fcf7f52CD1cde3A4',
    [fantomTestnet.id]: '0x30f0D2EbcD8676c6242ED45E5686410564f2b94b',
};

export const DUTCH_AUCTION_CONTRACT_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0xD4A7810c2E68865C0576C892A920EF2C27F49223', // Ethereum testnet
    [bscTestnet.id]: '0x1E176E9d228fE4e373610b608288bf7902cC3995',
    [bsc.id]: '0xE2b9A11a8F7d7CA3146d6E50148fF0bDdAF1E113',
    [fantomTestnet.id]: '0xE0a7e2961FB9Ff46C9dA5e7d78d51Cc7481544B8',
};

export const SUBSCRIPTION_CONTRACT_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0xdeaDC218E5fac656b567c9C45e850114fd048228', // Ethereum testnet
    [bscTestnet.id]: '0x0cAe00Bdf196F0Aa4a40706878e30156368Ae9AA',
    [bsc.id]: '0x0dE305F1D89b7046469131f6f7399904069C9165',
    [fantomTestnet.id]: '0x6eD9572e6E327D66EFb7cDd00112D17D534E9C0e',
};

export const LAUNCHPAD_FACTORY_CONTRACT_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x5134d16E2760fb3b23879ef13912B4d1116524Cb', // Ethereum testnet
    [bscTestnet.id]: '0xbffc8a6E823C1d705E2f5162c49f56a01b8eB0Fd',
    [bsc.id]: '0x5bFec604fA4fFBC4D54ce159b5b1434104a8b7b5',
    [fantomTestnet.id]: '0x00295c2140dfC456Db8b3f3b01BF381AD3906Fc2', // Fantom Testnet
};

export const AIRDROP_CONTRACT_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x234b137Da6BD58467DF0809B9B45D9fE84B713e5', // Ethereum testnet
    [bscTestnet.id]: '0xF5c3eDe95b0892289dDd261244d979bDe4b3D578',
    [bsc.id]: '0x0f3C770F1Fd7cfa407D7634f3fa2b3c5cdDa8102',
    [fantomTestnet.id]: '0x3312E22aef0Bb65F82A51D714b881Aba47572Fc8',
};

export const ANTIBOT_CONTRACT_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x7D5742B2dD8A6827493d95AEB4a2e532F39638a9', // Ethereum testnet
    [bscTestnet.id]: '0xFF314895Cb5E7470cBD138F5B8c0F19044DC1b3e',
    [bsc.id]: '0x2a13a2F681ff5D0bFFfE33fc5684e58bC6c77fb6',
    [fantomTestnet.id]: '0x16aCfa215a754F30c9084a4eF6fa7Db37eaCFBD4',
};

export const MULTISENDER_CONTRACT_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0xE20460ECFfd20bAd86C4B24b1e2c728E2cF547c5',
    [bscTestnet.id]: '0xe7857C6600967de42bf9678cb2e25e08D43A9009',
    [bsc.id]: '0x06fC319B36271c9f0331730b4dfFb1B3f88780af',
    [fantomTestnet.id]: '0xffFd36fd3017E277bE0e0e651b51fDc25713D199',
};

export const PRIVATE_SALE_CONTRACT_ADDRESSES: Record<number, string> = {
    [goerli.id]: '0x2Cf13C66A9Fe16C9EAead68521dCb326e6cCFe66', // Ethereum testnet
    [bscTestnet.id]: '0xC343F72Cc5edFA13c6Cf5823Df5AbAbdBAAE4106',
    [bsc.id]: '0x1977580772ff455f437Ea9ff92d88b31848275aa',
    [fantomTestnet.id]: '0x2ce0053BB40EC5e4082f2DBE3eb3A514c2EF4506',
};

export const SERVICE_FEE_RECEIVERS: Record<number, string> = {
    [goerli.id]: '0x73041250643cfF9601beFc2Ee178141cB8C619BF', // Ethereum testnet
    [bscTestnet.id]: '0xee6285839647f1494Eee48AD6058c7b9710BEb12',
    [bsc.id]: '0x975EA11F0AFcf51E2bAF3E0fa6976eFb0233c7e8',
    [fantomTestnet.id]: '0xFCa11b3623527e5a61CDA17A8f65E96b8164cF7D',
};

export const NATIVE_CURRENCY_SYMBOLS: Record<number, string> = {
    [goerli.id]: 'ETH',
    [bscTestnet.id]: 'BNB',
    [bsc.id]: 'BNB',
    [fantomTestnet.id]: 'FTM',
};

export const NATIVE_CURRENCY_NAME: Record<number, string> = {
    [goerli.id]: 'Ethereum',
    [bscTestnet.id]: 'BNB Coin',
    [bsc.id]: 'Binance Coin',
    [fantomTestnet.id]: 'Fantom',
};

export const CURRENCY_ADDRESS: Record<number, string> = {
    [Currency.NATIVE]: '0x0000000000000000000000000000000000000000',
    //bsc testnet
    // [Currency.USDT]: '0xAf4DB11839dD39fB4715d8942aA2EC72a842e648',
    // [Currency.USDC]: '0xB12a6f31F80405cAe7fC11499F53EDBeC237b65C',
    //bsc mainnet
    [Currency.USDT]: '0x55d398326f99059fF775485246999027B3197955',
    [Currency.USDC]: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
};

export const CURRENCY_DECIMALS: Record<string, number> = {
    [CURRENCY_ADDRESS[Currency.NATIVE]]: 18,
    [CURRENCY_ADDRESS[Currency.USDC]]: 18,
    [CURRENCY_ADDRESS[Currency.USDT]]: 18,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
    [CURRENCY_ADDRESS[Currency.USDC]]: 'USDC',
    [CURRENCY_ADDRESS[Currency.USDT]]: 'USDT',
};

export const CHAIN_SYMBOLS: Record<number, string> = {
    [bscTestnet.id]: 'BSC',
    [bsc.id]: 'BSC',
};

// @todo may be the UI link need updations
// UI Statics
export const navLinks = [
    { id: 1, Icon: Home, text: 'Home', link: '/home', isAccordion: false },
    { id: 2, Icon: CreateToken, text: 'Create Token', link: '/create-token', isAccordion: false },
    {
        id: 3,
        Icon: launchpad,
        text: 'Launchpad',
        link: '/launchpad',
        isAccordion: true,
        childLinks: [
            { id: 1, text: 'Create Launchpad', link: '/create-launchpad' },
            { id: 2, text: 'Create Fair Launch', link: '/create-fair-launch' },
            { id: 3, text: 'Create Dutch Auction', link: '/create-dutch-auction' },
            { id: 4, text: 'Create Subscription', link: '/create-subscription' },
            { id: 5, text: 'View Pools', link: '/view-pool' },
        ],
    },
    {
        id: 4,
        Icon: exchange,
        text: 'Exchange',
        link: 'https://exchange.gemlaunch.io', // @todo exchange URL??
        isAccordion: false,
    },
    {
        id: 5,
        Icon: PrivateSale,
        text: 'Private Sale',
        link: '/private-sale',
        isAccordion: true,
        childLinks: [
            { id: 1, text: 'Create Private Sale', link: '/create-private-sale' },
            { id: 2, text: 'Private Sale List', link: '/private-sale-list' },
        ],
    },
    {
        id: 6,
        Icon: Lock,
        text: 'Lock',
        link: '/lock',
        isAccordion: true,
        childLinks: [
            { id: 1, text: 'Create Lock', link: '/create-lock' },
            { id: 2, text: 'Token', link: '/token' },
            { id: 3, text: 'Liquidity', link: '/liquidity' },
        ],
    },
    {
        id: 7,
        Icon: Airdrop,
        text: 'Airdrop',
        link: '/airdrop',
        isAccordion: true,
        childLinks: [
            { id: 1, text: 'Create Airdrop', link: '/create-airdrop' },
            { id: 2, text: 'Airdrop List', link: '/airdrop-list' },
        ],
    },
    { id: 8, Icon: Leaderboard, text: 'Leaderboard', link: '/leaderboard', isAccordion: false },
    { id: 9, Icon: AntiBot, text: 'Anti-Bot', link: '/antibot', isAccordion: false },
    { id: 10, Icon: MultiSender, text: 'Multi-Sender', link: '/multisender', isAccordion: false },
    {
        id: 11,
        Icon: Socials,
        text: 'Socials',
        link: '/socials',
        isAccordion: true,
        childLinks: [
            { id: 1, text: 'Twitter', link: 'https://x.com/gemlaunchio', Icon: TwitterIcon },
            { id: 2, text: 'Telegram', link: 'https://t.me/gemlaunchio', Icon: TelegramIcon },
        ],
    },
    {
        id: 12,
        Icon: Docs,
        text: 'Docs',
        link: 'https://gems-organization-1.gitbook.io/gemlaunch/',
        isAccordion: false,
    },
    {
        id: 13,
        Icon: Admin,
        text: 'Admin',
        link: '/admin',
        isAccordion: false,
    },
];

//@todo gitbook URL
export const homeNavigation = [
    { id: 1, text: 'Home', link: '/home' },
    { id: 2, text: 'Team', link: '' },
    { id: 3, text: 'Docs', link: 'https://gems-organization-1.gitbook.io/gemlaunch/' },
];

export const serviceCards = [
    {
        id: 1,
        Icon: Standard,
        title: 'Standard',
        description: 'Mint standard tokens on ETH, BSC, AVAX, Fantom, Polygon.',
        color: '#22CDA6',
    },
    {
        id: 2,
        Icon: Deflationary,
        title: 'Deflationary',
        description: 'Generate deflationary tokens with tax and/or charity functions.',
        color: '#0FD7D2',
    },
    {
        id: 3,
        Icon: Customization,
        title: 'Customization',
        description: 'Create a token sale for your own custom token easily.',
        color: '#11B6DB',
    },
    {
        id: 4,
        Icon: Launchpad,
        title: 'Launchpad',
        description: 'Use the token you mint to create a launchpad with just a few clicks.',
        color: '#77EB67',
    },
    {
        id: 5,
        Icon: Branding,
        title: 'Branding',
        description: 'Adding logo, social links, description, listing on Gemlaunch.',
        color: '#77EB67',
    },
    {
        id: 6,
        Icon: Management,
        title: 'Management',
        description: 'The portal to help you easily update content for your launchpad.',
        color: '#11B6DB',
    },
    {
        id: 7,
        Icon: Community,
        title: 'Community',
        description: 'Promote your launchpad to thousands of buyers on Gemlaunch.',
        color: '#0FD7D2',
    },
    {
        id: 8,
        Icon: Locking,
        title: 'Locking',
        description: 'Lock your liquidity after presale.',
        color: '#22CDA6',
    },
];

export const comunity = [
    { id: 1, image: images.TBA, alt: 'digital-currency' },
    { id: 2, image: images.TBA, alt: 'BlueYard' },
    { id: 3, image: images.TBA, alt: 'A16Z' },
    { id: 4, image: images.TBA, alt: 'OpenZeplin' },
    { id: 5, image: images.TBA, alt: 'BlockchainCapital' },
    { id: 6, image: images.TBA, alt: 'CoinbaseVentures' },
    { id: 7, image: images.TBA, alt: 'Placeholder' },
    { id: 8, image: images.TBA, alt: 'NorthIceland' },
];

// Footer links
export const Network = [
    { id: 1, text: 'Create Launchpad', ref: '/create-launchpad' },
    { id: 2, text: 'Create Dutch Auction', ref: '/create-dutch-auction' },
    { id: 3, text: 'Create Fair Launch', ref: '/create-fair-launch' },
    { id: 4, text: 'Create Subscription', ref: '/create-subscription' },
];
export const Build = [
    { id: 1, text: 'Developer Page', ref: 'https://github.com' },
    { id: 2, text: 'Docs', ref: 'https://gems-organization-1.gitbook.io/gemlaunch/' },
    { id: 3, text: 'Telegram', ref: 'http://t.me/gemlaunchio' },
];
export const Stake = [
    { id: 1, text: 'Standard Token', ref: '/create-token' },
    { id: 2, text: 'Liquidity Generator Token', ref: '/create-token' },
    { id: 3, text: 'Buyback Baby Token', ref: '/create-token' },
    { id: 4, text: 'Baby Token', ref: '/create-token' },
];
export const Network2 = [
    { id: 1, text: 'Twitter', ref: 'https://x.com/gemlaunchio' },
    { id: 2, text: 'Telegram', ref: 'https://t.me/gemlaunchio' },
    { id: 3, text: 'Discord', ref: 'https://discord.com' },
    { id: 4, text: 'Blogs', ref: 'https://medium.com' },
];
