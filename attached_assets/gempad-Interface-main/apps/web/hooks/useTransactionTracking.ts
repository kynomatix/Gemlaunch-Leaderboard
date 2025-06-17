'use client';

import {
    TransactionTracking,
    TransactionTrackingContext,
    TransactionTrackingType,
} from '@/components/Provider/TransactionTrackingProvider';
import { SUBSQUID_URLS } from '@/constants';
// import { useQuery } from '@tanstack/react-query';
// import request, { gql } from 'graphql-request';
import { useContext, useEffect, useState } from 'react';
import { Address, useNetwork } from 'wagmi';
import { useActiveChainId } from './useActiveChainId';
import { gql, useLazyQuery, useQuery } from '@apollo/client';

// Query
const getTransaction = gql`
    query Transactions($id: String) {
        transactions(where: { id_eq: $id }) {
            id
        }
    }
`;

// export const useTransactionTracking = (
//     type: TransactionTrackingType,
//     { onCompleted }: { onCompleted: () => void },
// ) => {

//     const {chainId} = useActiveChainId();
//     const { removeTransaction, transactions } = useContext(TransactionTrackingContext);
//     const [refetchInterval, setRefetchInterval] = useState(1000); // Initial refetch interval (every 5 seconds)

//     const [tracking, setTracking] = useState(false);
//     const [queryId, setQueryId] = useState<string>(undefined);
//     const [currentTransaction, setCurrentTransaction] = useState<TransactionTracking>();

//     const { data, refetch, isLoading } = useQuery<any>({
//         queryKey: ['transaction'],
//         queryFn: async () => request(SUBSQUID_URLS[chainId], getTransaction, { id: queryId }),
//         refetchInterval,
//     });

//     useEffect(() => {
//         (async () => {
//             const transaction = transactions?.find((x) => x.type === type);

//             if (!transaction) return;
//             if (tracking) return;
//             // eslint-disable-next-line no-console
//             console.log(`[${type.toUpperCase()}]`, 'polling started...');
//             setCurrentTransaction(transaction);
//             setQueryId(transaction.hash);
//             refetch();
//             setRefetchInterval(1000);
//             setTracking(true);

//             // eslint-disable-next-line consistent-return
//             return () => {
//                 setRefetchInterval(undefined);
//             };
//         })();
//     }, [type, transactions, refetch, tracking]);

//     useEffect(() => {
//         const hash = data?.transactions?.[0]?.id;

//         if (hash) {
//             // eslint-disable-next-line no-console
//             console.log(`[${type.toUpperCase()}]`, 'polling stopped.');
//             setCurrentTransaction(undefined);
//             removeTransaction(hash as Address);
//             setTracking(false);
//             setRefetchInterval(undefined);
//             onCompleted?.();
//         }
//     }, [data, isLoading, onCompleted, removeTransaction, type]);

//     return { tracking, transaction: currentTransaction };
// };

export const useTransactionTracking = (
    type: TransactionTrackingType,
    { onCompleted }: { onCompleted: () => void },
) => {
    const { chainId } = useActiveChainId();
    const { removeTransaction, transactions } = useContext(TransactionTrackingContext);
    const { data, startPolling, stopPolling } = useQuery(getTransaction, {
        variables: {
            id: transactions?.find((x) => x.type === type)?.hash,
        },
        context: { chainId },
    });
    const [tracking, setTracking] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState<TransactionTracking>();

    useEffect(() => {
        (async () => {
            const transaction = transactions?.find((x) => x.type === type);
            if (!transaction) return;
            if (tracking) return;

            setCurrentTransaction(transaction);
            // getData({ variables: { id: transaction.hash } });
            startPolling(5000);
            setTracking(true);
        })();

        return () => {
            stopPolling();
        };
    }, [type, transactions]);

    useEffect(() => {
        const hash = data?.transactions?.[0]?.id;
        if (hash) {
            setCurrentTransaction(undefined);
            removeTransaction(hash as Address);
            setTracking(false);
            stopPolling();
            onCompleted?.();
        }
    }, [data]);

    return { tracking, transaction: currentTransaction };
};
