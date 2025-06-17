import { gql } from '@apollo/client';

export const GET_ALL_LAUNCHPADS = gql(`
    query getAllLaunchpadsLeaderboard(
        $first: Int
        $after: String
        $orderBy: [LaunchPadOrderByInput!]!
        $startTime: BigInt!
        $endTime: BigInt!
    ) {
        launchPadsConnection(
            first: $first
            after: $after
            orderBy: $orderBy
            where: {
                startTime_gte: $startTime
                endTime_lte: $endTime
                finalizeTime_not_eq: "0"
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
                    investedAmount
                    chainId
                    name
                    publicSaleTime
                    sellPrice
                    router
                    softCap
                    startTime
                    fundToken {
                        decimals
                        id
                        symbol
                        name
                        isNative
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
