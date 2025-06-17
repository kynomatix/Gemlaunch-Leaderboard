import { AntibotsConnection, QueryAntibotsConnectionArgs } from '@/src/gql/graphql';
import { TypedDocumentNode, gql } from '@apollo/client';

export const GET_WHITE_BLACK_LIST = gql(`
query getWhiteBlackList ($id: String) {
  antibots(where: {id_eq: $id}) {
    id
    blacklist
    whitelist
  }
}`);
