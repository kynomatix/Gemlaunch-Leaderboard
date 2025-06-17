import { gql } from '@apollo/client';

export const GET_HOME_AGGREGATIONS = gql(`
    query getHomeAggregation {
        aggregations {
            fundedProjects
            uniqueParticipants
            raisedContributionNative
            raisedContributionUSDC
            raisedContributionUSDT
            
        }
    }
  
`);
