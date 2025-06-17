import { gql } from '@apollo/client';

// All Airdrops
export const GET_ALL_AIRDROPS = gql(`
    query getAirdrops($first: Int, $after: String, $orderBy: [AirdropOrderByInput!]!) {
        airdropsConnection(first: $first, after: $after, orderBy: $orderBy) {
            totalCount
            edges {
                node {
                    contractAddress
                    name
                    metadata {
                        socials {
                            logoUrl
                        }
                    }
                    token {
                        name
                        decimals
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

// Airdrops created by me
export const GET_AIRDROPS_BY_ME = gql(`
    query getAirdropsByMe($first: Int, $after: String, $orderBy: [AirdropOrderByInput!]!, $owner: String) {
        airdropsConnection(first: $first, after: $after, orderBy: $orderBy, where: {owner: {id_eq: $owner}}) {
            totalCount
            edges {
                node {
                    contractAddress
                    name
                    metadata {
                        socials {
                            logoUrl
                        }
                    }
                    token {
                        name
                        decimals
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

// Airdrops in which i am added in allocations
export const GET_MY_AIRDROPS = gql(`
    query getMyAirdrops($first: Int, $after: String, $orderBy: [AirdropOrderByInput!]!, $owner: [String]) {
        airdropsConnection(first: $first, after: $after, orderBy: $orderBy, where: {allocatedUsers_containsAny: $owner}) {
            totalCount
            edges {
                node {
                    contractAddress
                    name
                    metadata {
                        socials {
                            logoUrl
                        }
                    }
                    token {
                        name
                        decimals
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

export const GET_SINGLE_AIRDROP = gql(`
query GetAirdrop($contractAddress: String!) {
    airdrops(where: {contractAddress_eq: $contractAddress}) {
      id
      status
      tge
      name
      isVesting
      isCancelled
      isEnded
      interval
      cycle
      createdAt
      contractAddress
      startTime
      chainId
      updatedAt
      totalTokens
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
      allocations {
        user
        amount
      }
      token {
        name
        decimals
        symbol
        id
      }
      owner {
        id
      }
    }
  }
`);

export const getAirdropsAggrigation = gql(`
query getAirdropsAggrigation {
    aggregations {
      totalAirdropsLaunched
      totalParticipantsAirdrops
    }
  }
`);
