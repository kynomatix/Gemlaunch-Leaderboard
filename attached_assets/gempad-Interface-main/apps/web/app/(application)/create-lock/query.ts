import { gql } from '@apollo/client';

export const ADD_TITLE = gql`
    mutation addTitleToLock($txHash: String!, $title: String!) {
        addTitleToLock(txHash: $txHash, title: $title)
    }
`;
