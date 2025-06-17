import { gql } from 'graphql-request';

export const GET_SINGLE_LAUNCHPAD = gql`
    query LaunchpadDetail($address: String) {
        launchPads(where: { contractAddress_containsInsensitive: $address }) {
            id
            name
            totalSaleAmount
            totalSellTokens
            updatedAt
            userHardCap
            affiliateReward
            chainId
            contractAddress
            createdAt
            decreaseInterval
            endPrice
            endTime
            finalizeTime
            fundToken {
                decimals
                id
                symbol
                name
                isNative
            }
            hardCap
            investedAmount
            investors
            isAffiliate
            isAutoListing
            listingRate
            isMaxLimit
            liquidityAdded
            liquidityDetails {
                id
                liquidityAdded
                liquidityPercent
                lockTime
                locker
                router
            }
            listingPrice
            lockTime
            locker
            maxBuyLimit
            minBuyLimit
            metadata {
                audit
                contractAddress
                id
                kyc
                socials {
                    description
                    facebookUrl
                    githubUrl
                    logoUrl
                    redditUrl
                    telegramUrl
                    twitterUrl
                    webUrl
                    youtubeUrl
                }
            }
            owner {
                id
            }
            publicSaleTime
            router
            sellPrice
            sellRate
            softCap
            startPrice
            startTime
            token {
                id
                chainId
                decimals
                name
                symbol
                totalSupply
            }
            vestingDetails {
                cycleInterval
                cyclePercent
                id
                isVestingEnable
                tgePercent
            }
        }
    }
`;
