import * as React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client/core';
import { goerli, mainnet, bscTestnet, fantomTestnet, bsc } from 'wagmi/chains';
import { DEFAULT_CHAIN_ID, SUBSQUID_URLS } from '@/constants';

interface ChainApolloContextProviderProps {
    children: React.ReactNode;
}

const bscLink = new HttpLink({
    // uri: SUBSQUID_URLS[bscTestnet.id], //@todo may be we need it
    uri: SUBSQUID_URLS[bsc.id],
});

const fantomLink = new HttpLink({
    uri: SUBSQUID_URLS[fantomTestnet.id],
});

export const client = new ApolloClient({
    connectToDevTools: typeof window !== 'undefined',
    ssrMode: typeof window === 'undefined', // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.split(
        (operation) => {
            const { chainId } = operation.getContext();
            if (!chainId) return true; // use default chain link
            return chainId === DEFAULT_CHAIN_ID;
        },

        bscLink,
        fantomLink,
    ),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
            notifyOnNetworkStatusChange: true,
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    },
});

const ChainApolloProvider: React.FC<ChainApolloContextProviderProps> = ({ children }) => {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export { ChainApolloProvider };
