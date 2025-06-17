import { Button } from '@mui/material';
import React from 'react';

const LoadMore = ({ handleLoadMore }: { handleLoadMore: () => void }) => {
    return (
        <Button variant="contained" onClick={handleLoadMore}>
            Load more
        </Button>
    );
};

export default LoadMore;
