import { gql } from '@apollo/client';

export const ADD_METADATA = gql`
    mutation addMetadataToLaunchpad(
        $txHash: String!
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
        addMetadataToLaunchpad(
            txHash: $txHash
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

export const GET_LOCK_BY_ID = gql(`
    query GetLockById ($id: String) {
        locks(where: {token: {id_containsInsensitive: $id}}) {
            id
            amount
            unlockDate
            tge
            cycleShare
            interval
        }
    } 
`);

export const GET_PREVIOUS_PRESALES = gql(`
    query GetPreviousPresales ($orderBy: [LaunchPadOrderByInput!], $limit: Int, $ownerId: String, $currentPresaleAddress: String) {
        launchPads(orderBy: $orderBy, where: { contractAddress_not_containsInsensitive: $currentPresaleAddress, owner: {id_containsInsensitive: $ownerId}}, limit: $limit) {
            createdAt
            name
            contractAddress
            token {
                name
                symbol
            }
            metadata {
                socials {
                    logoUrl
                }
            }
        }
    } 
`);
