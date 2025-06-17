import { gql } from '@apollo/client';

export const GET_GEM_TOKENS = gql(`
query getGemTokens ($limit: Int!) {
    gemlaunchTokens(limit: $limit, orderBy: createdAt_DESC) {
        id
        name
        symbol
        image
        chainId
    }
  }
  
`);

export const GET_LAUNCHPADS = gql(`
query getLatestPools($limit: Int!) {
  launchPads (limit: $limit, orderBy: createdAt_DESC){
    id
    name
    chainId
    contractAddress
    token {
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

export const GET_PRIVATE_SALES = gql(`
query getPrivateSales($limit: Int!) {
  privateSales (limit: $limit, orderBy: createdAt_DESC){
    id
    name
    chainId
    contractAddress
    tokenSymbol
    metadata {
      socials {
        logoUrl
      }
    }
  }
}
`);
