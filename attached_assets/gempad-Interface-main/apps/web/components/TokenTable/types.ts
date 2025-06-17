import { LocksConnection } from '@/src/gql/graphql';

export interface Token {
    name: string;
    symbol: string;
    decimals: number;
    id: string;
}

export interface Lock {
    amount: string;
    id: string;
    token: Token;
    owner: { id: string };
    totalCount: number;
}

export interface QueryData {
    locksConnection: LocksConnection;
}

export type ViewOptions = 'All' | 'My Locks';
