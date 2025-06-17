import { gql } from '@apollo/client';

export const GET_TRENDING_TOKENS = gql(`
    query getTrendingTokens ($limit: Int, $orderBy: [LaunchPadOrderByInput!]) {
        launchPads (limit: $limit, orderBy: $orderBy) {
            id
            name
            token {
                id
                name
                symbol
                image
            }
        }
    }  
`);
