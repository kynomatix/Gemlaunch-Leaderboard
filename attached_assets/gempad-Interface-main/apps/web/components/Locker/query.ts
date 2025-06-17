import { gql } from '@apollo/client';

export const GET_SINGLE_RECORD = gql`
    query RecordsLockConnection($lockId: String!, $orderBy: [LockOrderByInput!] = id_ASC) {
        locks(orderBy: $orderBy, where: { id_eq: $lockId }) {
            id
            token {
                id
                name
                symbol
                decimals
                tokenLockedInUsd
                isLiquidityToken
                token0 {
                    symbol
                }
                token1 {
                    symbol
                }
            }
            amount
            owner {
                id
            }
            unlockDate
            status
            depositDate
            interval
            cycleShare
            tge
            title
        }
    }
`;

export const GET_LOCK_RECORD = gql`
    query LockRecords(
        $tokenAddress: String!
        $after: String
        $first: Int
        $orderBy: [LockOrderByInput!] = id_DESC
    ) {
        locksConnection(
            after: $after
            first: $first
            orderBy: $orderBy
            where: { token: { id_eq: $tokenAddress } }
        ) {
            edges {
                node {
                    id
                    tge
                    interval
                    cycleShare
                    owner {
                        id
                    }
                    token {
                        tokenLocked
                        tokenLockedCount
                        tokenLockedInUsd
                        decimals
                        name
                        symbol
                        id
                    }
                    status
                    amount
                    unlockDate
                }
            }
            totalCount
        }
    }
`;
