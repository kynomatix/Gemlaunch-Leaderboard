import { QueryData } from './types';

export const loadMore = (fetchMore: any, data: QueryData) => {
    fetchMore({
        variables: { after: data?.privateSalesConnection?.pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            return {
                ...prev,
                privateSalesConnection: {
                    ...prev.privateSalesConnection,
                    edges: [
                        ...prev.privateSalesConnection.edges,
                        ...fetchMoreResult.privateSalesConnection.edges,
                    ],
                    pageInfo: fetchMoreResult.privateSalesConnection.pageInfo,
                },
            };
        },
    });
};
