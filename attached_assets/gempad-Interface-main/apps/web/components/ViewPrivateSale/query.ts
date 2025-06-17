import { gql } from '@apollo/client';

export const GET_ALL_PRIVATE_SALE = gql`
    query GetAllPrivateSales(
        $first: Int
        $after: String
        $orderBy: [PrivateSaleOrderByInput!]!
        $searchTerm: String
        $currentTime: BigInt
        $isCancelled: Boolean
    ) {
        privateSalesConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: {
                tokenSymbol_containsInsensitive: $searchTerm
                startTime_lte: $currentTime
                endTime_gte: $currentTime
                isCancelled_eq: $isCancelled
            }
        ) {
            totalCount
            pageInfo {
                endCursor
                hasNextPage
            }
            edges {
                node {
                    id
                    initialRelease
                    currency
                    metadata {
                        socials {
                            logoUrl
                        }
                    }
                }
            }
        }
    }
`;
export const GET_ALL_PRIVATE_SALE_ENDED = gql`
    query GetAllPrivateSales(
        $first: Int
        $after: String
        $orderBy: [PrivateSaleOrderByInput!]!
        $searchTerm: String
        $currentTime: BigInt
        $isCancelled: Boolean
    ) {
        privateSalesConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: {
                tokenSymbol_containsInsensitive: $searchTerm
                startTime_lte: $currentTime
                endTime_lte: $currentTime
                isCancelled_eq: $isCancelled
            }
        ) {
            totalCount
            pageInfo {
                endCursor
                hasNextPage
            }
            edges {
                node {
                    id
                    initialRelease
                    currency
                    metadata {
                        socials {
                            logoUrl
                        }
                    }
                }
            }
        }
    }
`;

export const GET_ALL_PRIVATE_SALE_UPCOMING = gql`
    query GetAllPrivateSales(
        $first: Int
        $after: String
        $orderBy: [PrivateSaleOrderByInput!]!
        $searchTerm: String
        $currentTime: BigInt
        $isCancelled: Boolean
    ) {
        privateSalesConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: {
                tokenSymbol_containsInsensitive: $searchTerm
                startTime_gte: $currentTime
                endTime_gte: $currentTime
                isCancelled_eq: $isCancelled
            }
        ) {
            totalCount
            pageInfo {
                endCursor
                hasNextPage
            }
            edges {
                node {
                    id
                    initialRelease
                    currency
                    metadata {
                        socials {
                            logoUrl
                        }
                    }
                }
            }
        }
    }
`;

export const GET_MY_PRIVATE_SALE = gql`
    query GetMyPrivateSales(
        $first: Int
        $after: String
        $orderBy: [PrivateSaleOrderByInput!]!
        $searchTerm: String
        $owner: String
        $currentTime: BigInt
        $isCancelled: Boolean
    ) {
        privateSalesConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: {
                tokenSymbol_containsInsensitive: $searchTerm
                owner_eq: $owner
                startTime_lte: $currentTime
                endTime_gte: $currentTime
                isCancelled_eq: $isCancelled
            }
        ) {
            totalCount
            pageInfo {
                endCursor
                hasNextPage
            }

            edges {
                node {
                    id
                    initialRelease
                    currency
                    metadata {
                        socials {
                            logoUrl
                        }
                    }
                }
            }
        }
    }
`;
export const GET_MY_PRIVATE_SALE_ENDED = gql`
    query GetMyPrivateSales(
        $first: Int
        $after: String
        $orderBy: [PrivateSaleOrderByInput!]!
        $searchTerm: String
        $owner: String
        $currentTime: BigInt
        $isCancelled: Boolean
    ) {
        privateSalesConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: {
                tokenSymbol_containsInsensitive: $searchTerm
                owner_eq: $owner
                startTime_lte: $currentTime
                endTime_lte: $currentTime
                isCancelled_eq: $isCancelled
            }
        ) {
            totalCount
            pageInfo {
                endCursor
                hasNextPage
            }

            edges {
                node {
                    id
                    initialRelease
                    currency
                    metadata {
                        socials {
                            logoUrl
                        }
                    }
                }
            }
        }
    }
`;
export const GET_MY_PRIVATE_SALE_UPCOMING = gql`
    query GetMyPrivateSales(
        $first: Int
        $after: String
        $orderBy: [PrivateSaleOrderByInput!]!
        $searchTerm: String
        $owner: String
        $currentTime: BigInt
        $isCancelled: Boolean
    ) {
        privateSalesConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: {
                tokenSymbol_containsInsensitive: $searchTerm
                owner_eq: $owner
                startTime_gte: $currentTime
                endTime_gte: $currentTime
                isCancelled_eq: $isCancelled
            }
        ) {
            totalCount
            pageInfo {
                endCursor
                hasNextPage
            }

            edges {
                node {
                    id
                    initialRelease
                    currency
                    metadata {
                        socials {
                            logoUrl
                        }
                    }
                }
            }
        }
    }
`;

export const GET_MY_CONTRIBUTION_PRIVATE_SALE = gql`
    query GetMyContributionPrivateSales(
        $first: Int
        $after: String
        $orderBy: [PrivateSaleOrderByInput!]!
        $owner: [String]
        $searchTerm: String
        $currentTime: BigInt
        $isCancelled: Boolean
    ) {
        privateSalesConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: {
                investors_containsAny: $owner
                tokenSymbol_containsInsensitive: $searchTerm
                startTime_lte: $currentTime
                endTime_gte: $currentTime
                isCancelled_eq: $isCancelled
            }
        ) {
            totalCount
            pageInfo {
                endCursor
                hasNextPage
            }

            edges {
                node {
                    id
                    initialRelease
                    currency
                    metadata {
                        socials {
                            logoUrl
                        }
                    }
                }
            }
        }
    }
`;

export const GET_MY_CONTRIBUTION_PRIVATE_SALE_UPCOMING = gql`
    query GetMyContributionPrivateSales(
        $first: Int
        $after: String
        $orderBy: [PrivateSaleOrderByInput!]!
        $owner: [String]
        $searchTerm: String
        $currentTime: BigInt
        $isCancelled: Boolean
    ) {
        privateSalesConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: {
                investors_containsAny: $owner
                tokenSymbol_containsInsensitive: $searchTerm
                startTime_gte: $currentTime
                endTime_gte: $currentTime
                isCancelled_eq: $isCancelled
            }
        ) {
            totalCount
            pageInfo {
                endCursor
                hasNextPage
            }

            edges {
                node {
                    id
                    initialRelease
                    currency
                    metadata {
                        socials {
                            logoUrl
                        }
                    }
                }
            }
        }
    }
`;

export const GET_MY_CONTRIBUTION_PRIVATE_SALE_ENDED = gql`
    query GetMyContributionPrivateSales(
        $first: Int
        $after: String
        $orderBy: [PrivateSaleOrderByInput!]!
        $owner: [String]
        $searchTerm: String
        $currentTime: BigInt
        $isCancelled: Boolean
    ) {
        privateSalesConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: {
                investors_containsAny: $owner
                tokenSymbol_containsInsensitive: $searchTerm
                startTime_lte: $currentTime
                endTime_lte: $currentTime
                isCancelled_eq: $isCancelled
            }
        ) {
            totalCount
            pageInfo {
                endCursor
                hasNextPage
            }

            edges {
                node {
                    id
                    initialRelease
                    currency
                    metadata {
                        socials {
                            logoUrl
                        }
                    }
                }
            }
        }
    }
`;

export const GET_SINGLE_PRIVATE_SALE = gql`
    query GetSinglePrivateSale($id: String) {
        privateSales(where: { id_eq: $id }) {
            cycleInterval
            cyclePercent
            endTime
            owner
            finalizeTime
            hardcap
            id
            initialRelease
            isWhitelist
            maxBuyLimit
            minBuyLimit
            name
            publicSaleTime
            softcap
            startTime
            currency
            depositedAmount
            whitelistUsers
            metadata {
                socials {
                    logoUrl
                    webUrl
                    facebookUrl
                    twitterUrl
                    githubUrl
                    telegramUrl
                    redditUrl
                    youtubeUrl
                    description
                }
            }
        }
    }
`;
