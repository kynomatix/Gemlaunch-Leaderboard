'use client';

import { useAccountEventListener } from '@/hooks/useAccountEventListener';
import { fetchStatusMiddleware } from '@/hooks/useSWRContract';
import useSentryUser from '@/hooks/useSentryUser';
import useUserAgent from '@/hooks/useUserAgent';
import { persistor, useStore } from '@/state';
import { usePollBlockNumber } from '@/state/block/hooks';
import { wagmiConfig } from '@/utils/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SWRConfig } from 'swr';
import { bsc, bscTestnet, goerli, mainnet, fantomTestnet } from 'viem/chains';
import { WagmiConfig } from 'wagmi';
import DismissableToast from '../DismissableToast/DismissableToast';
import { Updaters } from '../Updaters';
import { TransactionTrackingProvider } from './TransactionTrackingProvider';
import { NetworkModal } from '../NetworkModal/NetworkModal';
import { ChainApolloProvider } from './ChainApolloProvider';
import { useNetworkConnectorUpdater } from '@/hooks/useActiveWeb3React';

const projectId = 'b74c1200732b4da8f98f29cf935c2263'; // TODO: It should be in .env
const metadata = {
    name: 'GemlaunchModal',
    description: 'Gemlaunch Modal',
    url: 'https://gemlaunch.io',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// const chains = [bscTestnet];
const chains = [bsc];
const _wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });
createWeb3Modal({
    wagmiConfig: _wagmiConfig,
    projectId,
    chains,
    // defaultChain: bscTestnet,
    defaultChain: bsc,
    themeVariables: {
        '--w3m-z-index': 10000,
    },
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchInterval: false,
            refetchIntervalInBackground: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        },
    },
});

function GlobalHooks() {
    usePollBlockNumber();
    // useEagerConnect()
    useUserAgent();
    useAccountEventListener();
    useSentryUser();
    // useNetworkConnectorUpdater()

    // useThemeCookie()
    // useLockedEndNotification()
    return null;
}

const Providers = ({ children }: { children: ReactNode }) => {
    const store = useStore(undefined);

    return (
        <>
            <WagmiConfig config={wagmiConfig}>
                <DismissableToast />
                <ReduxProvider store={store}>
                    <TransactionTrackingProvider>
                        <ChainApolloProvider>
                            <QueryClientProvider client={queryClient}>
                                <ThirdwebProvider
                                    clientId="e346cce1445d0ba99bdec75f38daf5cf"
                                    // activeChain="binance-testnet"
                                    activeChain="binance"
                                >
                                    <SWRConfig
                                        value={{
                                            use: [fetchStatusMiddleware],
                                        }}
                                    >
                                        {/* <ToastsProvider> */}
                                        <PersistGate loading={null} persistor={persistor}>
                                            <Updaters />
                                            <GlobalHooks />
                                            {children}
                                        </PersistGate>
                                        {/* <ToastListener /> */}
                                        {/* </ToastsProvider> */}
                                    </SWRConfig>
                                </ThirdwebProvider>
                            </QueryClientProvider>
                        </ChainApolloProvider>
                    </TransactionTrackingProvider>
                </ReduxProvider>
            </WagmiConfig>
        </>
    );
};

export default Providers;
