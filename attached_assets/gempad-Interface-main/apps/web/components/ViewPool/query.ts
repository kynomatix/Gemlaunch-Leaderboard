import { gql } from '@apollo/client';

export const GET_ALL_LAUNCHPADS = gql(`
    query getAllLaunchpads(
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
                    affiliateReward
                    isAutoListing
                    listingPrice
                    minBuyLimit
                    name
                    publicSaleTime
                    sellPrice
                    softCap
                    startTime
                    maxBuyLimit
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
                    fundToken {
                        decimals
                        id
                        symbol
                        name
                        isNative
                      }
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
    query getAllLaunchpads(
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
                    affiliateReward
                    isAutoListing
                    listingPrice
                    minBuyLimit
                    name
                    publicSaleTime
                    sellPrice
                    softCap
                    startTime
                    maxBuyLimit
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
                    fundToken {
                        decimals
                        id
                        symbol
                        name
                        isNative
                      }
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
    query getAllLaunchpads(
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
                    affiliateReward
                    isAutoListing
                    listingPrice
                    minBuyLimit
                    name
                    publicSaleTime
                    sellPrice
                    softCap
                    startTime
                    maxBuyLimit
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
                    fundToken {
                        decimals
                        id
                        symbol
                        name
                        isNative
                      }
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

export const GET_MY_LAUNCHPADS = gql(`
    query getMyLaunchpads(
        $first: Int
        $after: String
        $orderBy: [LaunchPadOrderByInput!]!
        $searchTerm: String
        $ownerId: String
        $currentTime: BigInt
        $isCancelled: Boolean
    ) {
        launchPadsConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: { 
                token: {symbol_containsInsensitive: $searchTerm}
                owner: {id_eq: $ownerId}
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
                    affiliateReward
                    isAutoListing
                     liquidityDetails {
                        id
                        liquidityAdded
                        liquidityPercent
                        lockTime
                        locker
                        router
                        }
                    fundToken {
                        decimals
                        id
                        symbol
                        name
                        isNative
                      }
                    listingPrice
                    minBuyLimit
                    name
                    publicSaleTime
                    sellPrice
                    softCap
                    startTime
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
export const GET_MY_LAUNCHPADS_ENDED = gql(`
    query getMyLaunchpads(
        $first: Int
        $after: String
        $orderBy: [LaunchPadOrderByInput!]!
        $searchTerm: String
        $ownerId: String
        $currentTime: BigInt
        $isCancelled: Boolean
    ) {
        launchPadsConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: { 
                token: {symbol_containsInsensitive: $searchTerm}
                owner: {id_eq: $ownerId}
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
                    affiliateReward
                    isAutoListing
                     liquidityDetails {
                        id
                        liquidityAdded
                        liquidityPercent
                        lockTime
                        locker
                        router
                        }

                    fundToken {
                        decimals
                        id
                        symbol
                        name
                        isNative
                      }
                    listingPrice
                    minBuyLimit
                    name
                    publicSaleTime
                    sellPrice
                    softCap
                    startTime
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

export const GET_LAUNCHPAD_FOR_CHART = gql(`
query MyQuery($contractAddress: String!) {
    launchPads(where: {contractAddress_containsInsensitive: $contractAddress}) {
      decreaseInterval
      endTime
      endPrice
      startPrice
      startTime
      fundToken {
        decimals
      }
      token {
        decimals
      }
      createdAt
      contractAddress
    }
  }
`);

export const EDIT_PRESALE = gql(`
query EditPresale($contractAddress: String!) {
    launchPads(where: {contractAddress_eq: $contractAddress}) {
      
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
`);

export const EDIT_PRESALE_METADATA = gql`
    mutation editPresaleMetadata(
        $contractAddress: String!
        $logoUrl: String!
        $webUrl: String!
        $facebookUrl: String
        $twitterUrl: String
        $githubUrl: String
        $telegramUrl: String
        $redditUrl: String
        $youtubeUrl: String
        $description: String
    ) {
        editPresaleMetadata(
            contractAddress: $contractAddress
            logoUrl: $logoUrl
            webUrl: $webUrl
            facebookUrl: $facebookUrl
            twitterUrl: $twitterUrl
            githubUrl: $githubUrl
            telegramUrl: $telegramUrl
            redditUrl: $redditUrl
            youtubeUrl: $youtubeUrl
            description: $description
        )
    }
`;
