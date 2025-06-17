'use client';

import { FC, ReactNode, createContext, useEffect, useState } from 'react';
import { Address } from 'viem';

export type TransactionTrackingType =
    | 'lock-added'
    | 'lock-withdrawn'
    | 'lock-extended'
    | 'lock-transferred'
    | 'vest-added'
    | 'whitelist-added'
    | 'blacklist-added'
    | 'whitelist-removed'
    | 'blacklist-removed'
    | 'participants-added'
    | 'participants-removed'
    | 'airdrop-created'
    | 'private-sale-whitelist-added'
    | 'private-sale-whitelist-removed'
    | 'private-sale-created'
    | 'launchpad-created';

export interface TransactionTracking {
    hash: Address;
    type: TransactionTrackingType;
    entityId?: string; // lock or vest or claimer id
}

interface TransactionTrackingContextState {
    addTransaction(value: TransactionTracking): void;
    removeTransaction(hash: TransactionTracking['hash']): void;
    transactions: TransactionTracking[];
}

interface TransactionTrackingContextProviderProps {
    children: ReactNode;
}

export const TransactionTrackingContext = createContext({} as TransactionTrackingContextState);

export const TransactionTrackingProvider: FC<TransactionTrackingContextProviderProps> = ({
    children,
}) => {
    const [transactions, setTransactions] = useState<TransactionTracking[]>([]);

    // Load transactions from local storage on initial render
    useEffect(() => {
        const storedTransactions = localStorage.getItem('transactionTrackings');
        if (storedTransactions) {
            setTransactions(JSON.parse(storedTransactions));
        }
    }, []);

    const addTransaction = (value: TransactionTracking) => {
        setTransactions((prevHashes) => [
            ...prevHashes,
            { ...value, hash: value.hash.toLowerCase() as Address },
        ]);
    };

    const removeTransaction = (hash: TransactionTracking['hash']) => {
        setTransactions((prevHashes) =>
            prevHashes.filter(
                (transaction) => transaction.hash.toLowerCase() !== hash.toLowerCase(),
            ),
        );
    };

    useEffect(() => {
        localStorage.setItem('transactionTrackings', JSON.stringify(transactions));
    }, [transactions]);

    return (
        <TransactionTrackingContext.Provider
            value={{ transactions, addTransaction, removeTransaction }}
        >
            {children}
        </TransactionTrackingContext.Provider>
    );
};
