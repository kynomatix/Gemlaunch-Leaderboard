import { gql } from '@apollo/client';

export const ADD_METADATA = gql`
    mutation addMetadataToAirdrop(
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
        addMetadataToAirdrop(
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

export const EDIT_AIRDROP_METADATA = gql`
    mutation editAirdropMetadata(
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
        editAirdropMetadata(
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

export const EDIT_AIRDROP = gql(`
query EditAirdrop($contractAddress: String!) {
    airdrops(where: {contractAddress_eq: $contractAddress}) {
      
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
