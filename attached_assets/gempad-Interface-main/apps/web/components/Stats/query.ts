import { gql } from '@apollo/client';

export const GET_STATS = gql(`
query getStats {
    aggregations {
      uniqueParticipants
      fundedProjects
      tokenLockedInUsd
      raisedContributionNative
      raisedContributionUSDC
      raisedContributionUSDT
    }
  }
  
`);
