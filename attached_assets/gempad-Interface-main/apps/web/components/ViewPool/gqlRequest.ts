import { gql } from '@apollo/client';

// Old one not in use, it is used in useGetAllLaunchpads hooks that is not using in the app aswell.

export const getAllLaunchPads = gql`
    query getLaunchpads {
        launchPads {
            id
            endTime
            hardCap
            finalizeTime
            isAffiliate
            isAutoListing
            contractAddress
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
                id
            }
        }
    }
`;
