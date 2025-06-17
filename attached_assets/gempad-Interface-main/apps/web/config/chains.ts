import { ChainId } from '@dapp/chains';
import memoize from 'lodash/memoize';
import {
    bsc as bsc_,
    bscTestnet as bscTestnet_,
    goerli,
    mainnet,
    Chain,
    polygonZkEvmTestnet,
    polygonZkEvm,
    fantomTestnet as fantomTestnet_,
} from 'wagmi/chains';

export const CHAIN_QUERY_NAME = {
    [ChainId.ETHEREUM]: 'Ethereum Mainnet',
    [ChainId.GOERLI]: 'Ethereum Goerli',
    [ChainId.BSC]: 'BSC Mainnet',
    [ChainId.BSC_TESTNET]: 'BSC Testnet',
    [ChainId.ARBITRUM_ONE]: 'arb',
    [ChainId.ARBITRUM_GOERLI]: 'arbGoerli',
    [ChainId.POLYGON_ZKEVM]: 'polygonZkEVM',
    [ChainId.POLYGON_ZKEVM_TESTNET]: 'polygonZkEVMTestnet',
    [ChainId.ZKSYNC]: 'zkSync',
    [ChainId.ZKSYNC_TESTNET]: 'zkSyncTestnet',
    [ChainId.LINEA]: 'linea',
    [ChainId.LINEA_TESTNET]: 'lineaTestnet',
    [ChainId.OPBNB_TESTNET]: 'opBnbTestnet',
    [ChainId.BASE]: 'base',
    [ChainId.BASE_TESTNET]: 'baseTestnet',
    [ChainId.SCROLL_SEPOLIA]: 'scrollSepolia',
    [ChainId.FANTOM_TESTNET]: 'fantomTestnet',
    [ChainId.FANTOM]: 'fantom',
} as const satisfies Record<ChainId, string>;

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce(
    (acc, [chainId, chainName]) => {
        return {
            [chainName.toLowerCase()]: chainId as unknown as ChainId,
            ...acc,
        };
    },
    {} as Record<string, ChainId>,
);

export const getChainId = memoize((chainName: string) => {
    if (!chainName) return undefined;
    return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()]
        ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()]
        : undefined;
});

const bsc = {
    ...bsc_,
    rpcUrls: {
        ...bsc_.rpcUrls,
        public: {
            ...bsc_.rpcUrls.public,
            http: ['https://solemn-late-violet.bsc.quiknode.pro/7523c2377df9d047dcfa838adaa9979f0143cb5c/'],
        },
        default: {
            ...bsc_.rpcUrls.default,
            http: ['https://solemn-late-violet.bsc.quiknode.pro/7523c2377df9d047dcfa838adaa9979f0143cb5c/'],
        },
    },
} satisfies Chain;

const bscTestnet = {
    ...bscTestnet_,
    rpcUrls: {
        ...bscTestnet_.rpcUrls,
        public: {
            ...bscTestnet_.rpcUrls.public,
            http: ['https://go.getblock.io/2e0d41ff8cbe49e98233da49450d2eb5'],
        },
        default: {
            ...bscTestnet_.rpcUrls.default,
            http: ['https://go.getblock.io/2e0d41ff8cbe49e98233da49450d2eb5'],
        },
    },
} satisfies Chain;

const fantomTestnet = {
    ...fantomTestnet_,
    rpcUrls: {
        ...fantomTestnet_.rpcUrls,
        public: {
            ...fantomTestnet_.rpcUrls.public,
            http: ['https://rpc.testnet.fantom.network'],
        },
        default: {
            ...fantomTestnet_.rpcUrls.default,
            http: ['https://rpc.testnet.fantom.network'],
        },
    },
} satisfies Chain;

// const scrollSepolia = {
//     ...scrollSepolia_,
//     contracts: {
//         multicall3: {
//             address: '0xcA11bde05977b3631167028862bE2a173976CA11',
//             blockCreated: 9473,
//         },
//     },
// } as const satisfies Chain

// export const opbnbTestnet = {
//     id: 5_611,
//     name: 'opBNB Testnet',
//     network: 'opbnb-testnet',
//     nativeCurrency: bscTestnet.nativeCurrency,
//     rpcUrls: {
//         default: {
//             http: ['https://opbnb-testnet-rpc.bnbchain.org'],
//         },
//         public: {
//             http: ['https://opbnb-testnet-rpc.bnbchain.org'],
//         },
//     },
//     blockExplorers: {
//         default: {
//             name: 'opBNBScan',
//             url: 'https://opbnbscan.com',
//         },
//     },
//     contracts: {
//         multicall3: {
//             address: '0xcA11bde05977b3631167028862bE2a173976CA11',
//             blockCreated: 3705108,
//         },
//     },
//     testnet: true,
// } as const satisfies Chain

// export const linea = {
//     id: 59_144,
//     name: 'Linea Mainnet',
//     network: 'linea-mainnet',
//     nativeCurrency: { name: 'Linea Ether', symbol: 'ETH', decimals: 18 },
//     rpcUrls: {
//         infura: {
//             http: ['https://linea-mainnet.infura.io/v3'],
//             webSocket: ['wss://linea-mainnet.infura.io/ws/v3'],
//         },
//         default: {
//             http: ['https://rpc.linea.build'],
//             webSocket: ['wss://rpc.linea.build'],
//         },
//         public: {
//             http: ['https://rpc.linea.build'],
//             webSocket: ['wss://rpc.linea.build'],
//         },
//     },
//     blockExplorers: {
//         default: {
//             name: 'Etherscan',
//             url: 'https://lineascan.build',
//         },
//         etherscan: {
//             name: 'Etherscan',
//             url: 'https://lineascan.build',
//         },
//         blockscout: {
//             name: 'Blockscout',
//             url: 'https://explorer.linea.build',
//         },
//     },
//     contracts: {
//         multicall3: {
//             address: '0xcA11bde05977b3631167028862bE2a173976CA11',
//             blockCreated: 42,
//         },
//     },
//     testnet: false,
// } as const satisfies Chain

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS: ChainId[] = [
    // ChainId.ARBITRUM_ONE,
    // ChainId.ARBITRUM_GOERLI,
    // ChainId.POLYGON_ZKEVM,
    // ChainId.POLYGON_ZKEVM_TESTNET,
    // ChainId.ZKSYNC,
    // ChainId.ZKSYNC_TESTNET,
    // ChainId.LINEA_TESTNET,
    // ChainId.LINEA,
    // ChainId.BASE,
    // ChainId.BASE_TESTNET,
    // ChainId.OPBNB_TESTNET,
];

export const CHAINS = [
    bscTestnet,
    bsc,
    mainnet,
    goerli,
    polygonZkEvm,
    polygonZkEvmTestnet,
    fantomTestnet,
    // zkSync,
    // zkSyncTestnet,
    // arbitrum,
    // arbitrumGoerli,
    // linea,
    // lineaTestnet,
    // arbitrumGoerli,
    // arbitrum,
    // base,
    // baseGoerli,
    // opbnbTestnet,
    // scrollSepolia,
];
