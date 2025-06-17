import { gql } from '@apollo/client';

export const getAllLocksQuery = gql`
    query MyQuery(
        $after: String
        $first: Int
        $orderBy: [LockOrderByInput!] = id_DESC
        $searchTerm: String
        $isLpToken: Boolean
        $ownerAddress: String
    ) {
        locksConnection(
            after: $after
            first: $first
            orderBy: $orderBy
            where: {
                token: { isLiquidityToken_eq: $isLpToken, id_containsInsensitive: $searchTerm }
                owner: { id_containsInsensitive: $ownerAddress }
            }
        ) {
            totalCount
            pageInfo {
                hasNextPage
                endCursor
            }
            edges {
                node {
                    amount
                    token {
                        id
                        decimals
                        name
                        symbol
                    }
                    id
                    owner {
                        id
                    }
                }
            }
        }
    }
`;
