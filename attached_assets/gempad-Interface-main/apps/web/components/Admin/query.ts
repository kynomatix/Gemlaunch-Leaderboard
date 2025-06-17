import { gql } from '@apollo/client';

export const GET_ALL_LAUNCHPADS = gql(`
    query getAllLaunchpadsAdmin(
        $first: Int
        $after: String
        $orderBy: [LaunchPadOrderByInput!]!
        $searchTerm: String
        $currentTime: BigInt
        $isCancelled: Boolean
    ) {
        launchPadsConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: { 
                token: {symbol_containsInsensitive: $searchTerm} 
                startTime_lte: $currentTime
                endTime_gte: $currentTime
                isCancelled_eq: $isCancelled
            }
        ) {
            totalCount
            edges {
                node {
                    id
                    endTime
                    hardCap
                    finalizeTime
                    contractAddress
                    isAffiliate
                    isAutoListing
                    liquidityAdded
                    liquidityPercent
                    listingPrice
                    lockTime
                    locker
                    minBuyLimit
                    name
                    publicSaleTime
                    sellPrice
                    router
                    softCap
                    startTime
                    liquidityDetails {
                        id
                        liquidityAdded
                        liquidityPercent
                        lockTime
                        locker
                        router
                    }
                    vestingDetails {
                        cycleInterval
                        cyclePercent
                        id
                        isVestingEnable
                        tgePercent
                    }
                    token {
                        totalSupply
                        symbol
                        name
                        id
                        decimals
                    }
                    owner {
                        id
                    }
                    maxBuyLimit
                    metadata {
                        kyc
                        audit
                        socials {
                            telegramUrl
                            description
                            facebookUrl
                            githubUrl
                            logoUrl
                            redditUrl
                            twitterUrl
                            webUrl
                            youtubeUrl
                        }
                    }
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`);
export const GET_ALL_LAUNCHPADS_ENDED = gql(`
    query getAllLaunchpadsAdmin(
        $first: Int
        $after: String
        $orderBy: [LaunchPadOrderByInput!]!
        $searchTerm: String
        $currentTime: BigInt
        $isCancelled: Boolean
    ) {
        launchPadsConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: { 
                token: {symbol_containsInsensitive: $searchTerm} 
                startTime_lte: $currentTime
                endTime_lte: $currentTime
                isCancelled_eq: $isCancelled
            }
        ) {
            totalCount
            edges {
                node {
                    id
                    endTime
                    hardCap
                    finalizeTime
                    contractAddress
                    isAffiliate
                    isAutoListing
                    liquidityAdded
                    liquidityPercent
                    listingPrice
                    lockTime
                    locker
                    minBuyLimit
                    name
                    publicSaleTime
                    sellPrice
                    router
                    softCap
                    startTime
                    liquidityDetails {
                        id
                        liquidityAdded
                        liquidityPercent
                        lockTime
                        locker
                        router
                    }
                    vestingDetails {
                        cycleInterval
                        cyclePercent
                        id
                        isVestingEnable
                        tgePercent
                    }
                    token {
                        totalSupply
                        symbol
                        name
                        id
                        decimals
                    }
                    owner {
                        id
                    }
                    maxBuyLimit
                    metadata {
                        kyc
                        audit
                        socials {
                            telegramUrl
                            description
                            facebookUrl
                            githubUrl
                            logoUrl
                            redditUrl
                            twitterUrl
                            webUrl
                            youtubeUrl
                        }
                    }
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`);

export const GET_ALL_LAUNCHPADS_UPCOMING = gql(`
    query getAllLaunchpadsAdmin(
        $first: Int
        $after: String
        $orderBy: [LaunchPadOrderByInput!]!
        $searchTerm: String
        $currentTime: BigInt
        $isCancelled: Boolean
    ) {
        launchPadsConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: { 
                token: {symbol_containsInsensitive: $searchTerm} 
                startTime_gte: $currentTime
                endTime_gte: $currentTime
                isCancelled_eq: $isCancelled
            }
        ) {
            totalCount
            edges {
                node {
                    id
                    endTime
                    hardCap
                    finalizeTime
                    contractAddress
                    isAffiliate
                    isAutoListing
                    liquidityAdded
                    liquidityPercent
                    listingPrice
                    lockTime
                    locker
                    minBuyLimit
                    name
                    publicSaleTime
                    sellPrice
                    router
                    softCap
                    startTime
                    liquidityDetails {
                        id
                        liquidityAdded
                        liquidityPercent
                        lockTime
                        locker
                        router
                    }
                    vestingDetails {
                        cycleInterval
                        cyclePercent
                        id
                        isVestingEnable
                        tgePercent
                    }
                    token {
                        totalSupply
                        symbol
                        name
                        id
                        decimals
                    }
                    owner {
                        id
                    }
                    maxBuyLimit
                    metadata {
                        kyc
                        audit
                        socials {
                            telegramUrl
                            description
                            facebookUrl
                            githubUrl
                            logoUrl
                            redditUrl
                            twitterUrl
                            webUrl
                            youtubeUrl
                        }
                    }
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`);

export const ADD_KYC_AUDIT = gql`
    mutation addKycAuditToLaunchpad($contractAddress: String!, $kyc: String!, $audit: String!) {
        addKycAuditToLaunchpad(contractAddress: $contractAddress, kyc: $kyc, audit: $audit)
    }
`;
