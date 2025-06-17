import { gql } from '@apollo/client';

export const ADD_METADATA = gql`
    mutation addMetadataToPrivateSale(
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
        addMetadataToPrivateSale(
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
