import { QueryData } from './types';

export const loadMore = (fetchMore: any, data: QueryData) => {
    fetchMore({
        variables: { after: data?.airdropsConnection?.pageInfo.endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            return {
                ...prev,
                airdropsConnection: {
                    ...prev.airdropsConnection,
                    edges: [
                        ...prev.airdropsConnection.edges,
                        ...fetchMoreResult.airdropsConnection.edges,
                    ],
                    pageInfo: fetchMoreResult.airdropsConnection.pageInfo,
                },
            };
        },
    });
};
